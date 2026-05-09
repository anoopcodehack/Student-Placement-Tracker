const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const { protect } = require('../middleware/auth');

// ── GET /api/interviews ── get all experiences (everyone can view)
router.get('/', protect, async (req, res) => {
  try {
    const { company } = req.query;
    const query = company ? { company } : {};
    const interviews = await Interview.find(query)
      .populate('student', 'name branch batch')
      .populate('company', 'name industry')
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });

    // Hide student name if anonymous
    const data = interviews.map(i => {
      const obj = i.toObject();
      if (obj.isAnonymous) {
        obj.student = { name: 'Anonymous', branch: obj.student?.branch, batch: obj.student?.batch };
        obj.postedBy = { name: 'Anonymous' };
      }
      return obj;
    });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/interviews ── add experience (placed students only)
router.post('/', protect, async (req, res) => {
  try {
    // Only students can post
    if (!req.user.isStudent || !req.user.studentRef) {
      return res.status(403).json({
        success: false,
        message: 'Only placed students can share interview experiences'
      });
    }

    const { company, role, package: pkg, difficulty, rounds, questionsAsked, tips, verdict, isAnonymous } = req.body;

    if (!company || !role) {
      return res.status(400).json({ success: false, message: 'Company and role are required' });
    }

    const interview = await Interview.create({
      student:        req.user.studentRef,
      company,
      postedBy:       req.user._id,
      role,
      package:        pkg,
      difficulty,
      rounds:         rounds || [],
      questionsAsked,
      tips,
      verdict:        verdict || 'Selected',
      isAnonymous:    isAnonymous || false,
    });

    const populated = await interview.populate([
      { path: 'student', select: 'name branch batch' },
      { path: 'company', select: 'name industry' },
    ]);

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/interviews/:id ── delete own experience
router.delete('/:id', protect, async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ success: false, message: 'Not found' });

    // Only the poster or admin can delete
    if (interview.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await interview.deleteOne();
    res.json({ success: true, message: 'Experience deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/interviews/:id/like ── like an experience
router.put('/:id/like', protect, async (req, res) => {
  try {
    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json({ success: true, likes: interview.likes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;