const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer config for resume upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/resumes/'),
  filename: (req, file, cb) => {
    cb(null, `resume_${req.user._id}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF allowed!'), false);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// GET /api/profile — get my profile
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    let studentData = null;
    if (user.isStudent && user.studentRef) {
      studentData = await Student.findById(user.studentRef)
        .populate('placementDetails.company', 'name industry');
    }
    res.json({ success: true, data: { user, student: studentData } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/profile — update basic info
router.put('/', protect, async (req, res) => {
  try {
    const { name, phone, linkedin, github } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true }
    ).select('-password');

    // if student, update their profile too
    if (user.isStudent && user.studentRef) {
      await Student.findByIdAndUpdate(user.studentRef, { phone, linkedin, github });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/profile/resume — upload resume
router.post('/resume', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const resumeUrl = `/uploads/resumes/${req.file.filename}`;
    await Student.findByIdAndUpdate(req.user.studentRef, { resume: resumeUrl });
    res.json({ success: true, resumeUrl, message: 'Resume uploaded!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/profile/change-password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is wrong' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;