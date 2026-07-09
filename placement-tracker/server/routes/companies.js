// const express = require('express');
// const router = express.Router();
// const Company = require('../models/Company');
// const User = require('../models/User');
// const { protect, adminOnly } = require('../middleware/auth');
// const { emitNotification } = require('../socket/socketHandler'); 

// router.get('/', protect, async (req, res) => {
//   try {
//     const { industry, type, search } = req.query;
//     const query = {};
//     if (industry) query.industry = industry;
//     if (type) query.type = type;
//     if (search) query.name = { $regex: search, $options: 'i' };
//     const companies = await Company.find(query).sort({ studentsHired: -1, name: 1 });
//     res.json({ success: true, data: companies });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// router.get('/:id', protect, async (req, res) => {
//   try {
//     const company = await Company.findById(req.params.id);
//     if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
//     res.json({ success: true, data: company });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// router.post('/', protect, adminOnly, async (req, res) => {
//   try {
//     const company = await Company.create(req.body);
//     res.status(201).json({ success: true, data: company });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// });

// router.put('/:id', protect, adminOnly, async (req, res) => {
//   try {
//     const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
//     if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
//     res.json({ success: true, data: company });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// });

// router.delete('/:id', protect, adminOnly, async (req, res) => {
//   try {
//     await Company.findByIdAndDelete(req.params.id);
//     res.json({ success: true, message: 'Company deleted' });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const User = require('../models/User'); // ← ADD
const { protect, adminOnly } = require('../middleware/auth');
const { emitNotification } = require('../socket/socketHandler'); // ← ADD

router.get('/', protect, async (req, res) => {
  try {
    const { industry, type, search } = req.query;
    const query = {};
    if (industry) query.industry = industry;
    if (type) query.type = type;
    if (search) query.name = { $regex: search, $options: 'i' };
    const companies = await Company.find(query).sort({ studentsHired: -1, name: 1 });
    res.json({ success: true, data: companies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    res.json({ success: true, data: company });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ← ONLY THIS ROUTE CHANGED
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const company = await Company.create(req.body);

    // notify all students
    const io = req.app.get('io');
    const students = await User.find({ isStudent: true });

    students.forEach(student => {
      emitNotification(io, student._id.toString(), {
        message: `🏢 New company added: ${company.name} (${company.industry})`,
        type: 'company',
        link: '/companies'
      });
    });

    res.status(201).json({ success: true, data: company });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    res.json({ success: true, data: company });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Company deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const company = await Company.create(req.body);

    const io = req.app.get('io');
    const students = await User.find({ isStudent: true });

    console.log('✅ Company created:', company.name);      // ← ADD
    console.log('👥 Students found:', students.length);    // ← ADD
    console.log('🔌 IO exists:', !!io);                    // ← ADD

    students.forEach(student => {
      console.log('📤 Emitting to:', student._id.toString()); // ← ADD
      emitNotification(io, student._id.toString(), {
        message: `🏢 New company added: ${company.name} (${company.industry})`,
        type: 'company',
        link: '/companies'
      });
    });

    res.status(201).json({ success: true, data: company });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
