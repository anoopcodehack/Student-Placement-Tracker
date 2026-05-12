const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const { protect } = require('../middleware/auth');

// GET /api/calendar — get all upcoming company drives
router.get('/', protect, async (req, res) => {
  try {
    const companies = await Company.find({ visitDate: { $exists: true, $ne: null } })
      .select('name industry type visitDate roles packageRange eligibilityCriteria studentsHired')
      .sort({ visitDate: 1 });

    res.json({ success: true, data: companies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;