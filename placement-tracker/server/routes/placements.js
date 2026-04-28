const express = require('express');
const router = express.Router();
const Placement = require('../models/Placement');
const Student = require('../models/Student');
const Company = require('../models/Company');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { company, offerType, status } = req.query;
    const query = {};
    if (company) query.company = company;
    if (offerType) query.offerType = offerType;
    if (status) query.status = status;
    const placements = await Placement.find(query)
      .populate('student', 'name rollNo branch batch cgpa email')
      .populate('company', 'name industry type')
      .sort({ dateOfOffer: -1 });
    res.json({ success: true, data: placements });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const placement = await Placement.create(req.body);

    // Update student's placement status
    await Student.findByIdAndUpdate(req.body.student, {
      isPlaced: true,
      'placementDetails.company': req.body.company,
      'placementDetails.package': req.body.package,
      'placementDetails.role': req.body.role,
      'placementDetails.offerType': req.body.offerType,
      'placementDetails.dateOfOffer': req.body.dateOfOffer,
    });

    // Update company's hired count
    await Company.findByIdAndUpdate(req.body.company, { $inc: { studentsHired: 1 } });

    const populated = await placement.populate([
      { path: 'student', select: 'name rollNo branch batch' },
      { path: 'company', select: 'name industry' }
    ]);
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);
    if (!placement) return res.status(404).json({ success: false, message: 'Not found' });

    await Student.findByIdAndUpdate(placement.student, {
      isPlaced: false,
      placementDetails: {}
    });
    await Company.findByIdAndUpdate(placement.company, { $inc: { studentsHired: -1 } });
    await placement.deleteOne();
    res.json({ success: true, message: 'Placement record deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
