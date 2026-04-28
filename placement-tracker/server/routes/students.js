const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/students - get all with filters
router.get('/', protect, async (req, res) => {
  try {
    const { branch, batch, isPlaced, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (branch) query.branch = branch;
    if (batch) query.batch = parseInt(batch);
    if (isPlaced !== undefined) query.isPlaced = isPlaced === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [students, total] = await Promise.all([
      Student.find(query).populate('placementDetails.company', 'name industry').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Student.countDocuments(query)
    ]);
    res.json({ success: true, data: students, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/students/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('placementDetails.company');
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/students
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({ success: true, data: student });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ success: false, message: `${field} already exists` });
    }
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/students/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/students/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
