
// const express = require('express');
// const router = express.Router();
// const Company = require('../models/Company');
// const User = require('../models/User'); // ← ADD
// const { protect, adminOnly } = require('../middleware/auth');
// const { emitNotification } = require('../socket/socketHandler'); // ← ADD

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

// // ← ONLY THIS ROUTE CHANGED
// router.post('/', protect, adminOnly, async (req, res) => {
//   try {
//     const company = await Company.create(req.body);

//     // notify all students
//     const io = req.app.get('io');
//     const students = await User.find({ isStudent: true });

//     students.forEach(student => {
//       emitNotification(io, student._id.toString(), {
//         message: `🏢 New company added: ${company.name} (${company.industry})`,
//         type: 'company',
//         link: '/companies'
//       });
//     });

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

// // 
// router.post('/', protect, adminOnly, async (req, res) => {
//   try {
//     const company = await Company.create(req.body);

//     const io = req.app.get('io');
//     const students = await User.find({ isStudent: true });

//     console.log('✅ Company created:', company.name);      // ← ADD
//     console.log('👥 Students found:', students.length);    // ← ADD
//     console.log('🔌 IO exists:', !!io);                    // ← ADD

//     students.forEach(student => {
//       console.log('📤 Emitting to:', student._id.toString()); // ← ADD
//       emitNotification(io, student._id.toString(), {
//         message: `🏢 New company added: ${company.name} (${company.industry})`,
//         type: 'company',
//         link: '/companies'
//       });
//     });

//     res.status(201).json({ success: true, data: company });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// });

// //
// router.post('/', protect, adminOnly, async (req, res) => {
//   try {
//     const company = await Company.create(req.body);
//     const io = req.app.get('io');

//     // Build eligibility filter
//     const { minCGPA, maxBacklogs, branches } = company.eligibilityCriteria || {};
//     const query = { isPlaced: false };
//     if (minCGPA) query.cgpa = { $gte: minCGPA };
//     if (maxBacklogs !== undefined) query.backlogs = { $lte: maxBacklogs };
//     if (branches?.length) query.branch = { $in: branches };

//     const eligibleStudents = await Student.find(query); // ← make sure Student is imported
//     const users = await User.find({ isStudent: true });

//     // Map studentRef → userId
//     const refMap = {};
//     users.forEach(u => {
//       if (u.studentRef) refMap[u.studentRef.toString()] = u._id.toString();
//     });

//     let notified = 0;
//     eligibleStudents.forEach(student => {
//       const userId = refMap[student._id.toString()];
//       if (userId) {
//         emitNotification(io, userId, {
//           message: `🏢 New company: ${company.name} — You are eligible! Pkg: ₹${company.packageRange?.min || '?'}–${company.packageRange?.max || '?'} LPA`,
//           type: 'eligibility',
//           link: '/companies',
//         });
//         notified++;
//       }
//     });

//     console.log(`✅ ${company.name} created — ${eligibleStudents.length} eligible, ${notified} notified`);
//     res.status(201).json({ success: true, data: company });

//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// });

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const Company = require('../models/Company');
// const Student = require('../models/Student'); // ← ADD
// const User = require('../models/User');
// const { protect, adminOnly } = require('../middleware/auth');
// const { emitNotification } = require('../socket/socketHandler');

// // GET all companies
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

// // GET single company
// router.get('/:id', protect, async (req, res) => {
//   try {
//     const company = await Company.findById(req.params.id);
//     if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
//     res.json({ success: true, data: company });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // POST create company — notify all students + eligible students
// router.post('/', protect, adminOnly, async (req, res) => {
//   try {
//     const company = await Company.create(req.body);
//     const io = req.app.get('io');

//     // ── Step 1: Find eligible students based on criteria ──
//     const { minCGPA, maxBacklogs, branches } = company.eligibilityCriteria || {};
//     const eligibilityQuery = { isPlaced: false };
//     if (minCGPA) eligibilityQuery.cgpa = { $gte: minCGPA };
//     if (maxBacklogs !== undefined) eligibilityQuery.backlogs = { $lte: maxBacklogs };
//     if (branches?.length) eligibilityQuery.branch = { $in: branches };

//     const eligibleStudents = await Student.find(eligibilityQuery);
//     const allUsers = await User.find({ isStudent: true });

//     console.log('✅ Company created:', company.name);
//     console.log('👥 Eligible students:', eligibleStudents.length);
//     console.log('🔌 IO exists:', !!io);

//     // ── Step 2: Map studentRef → userId ──
//     const refMap = {};
//     allUsers.forEach(u => {
//       if (u.studentRef) refMap[u.studentRef.toString()] = u._id.toString();
//     });

//     // ── Step 3: Notify eligible students with eligibility message ──
//     let eligibleNotified = 0;
//     eligibleStudents.forEach(student => {
//       const userId = refMap[student._id.toString()];
//       if (userId) {
//         console.log('📤 Eligible notify to:', userId);
//         emitNotification(io, userId, {
//           message: `🎯 You are eligible for ${company.name}! Pkg: ₹${company.packageRange?.min || '?'}–${company.packageRange?.max || '?'} LPA | Roles: ${company.roles?.join(', ') || 'TBD'}`,
//           type: 'eligibility',
//           link: '/companies',
//         });
//         eligibleNotified++;
//       }
//     });

//     // ── Step 4: Notify all other students (not eligible) with general message ──
//     allUsers.forEach(user => {
//       const alreadyNotified = eligibleStudents.some(
//         s => refMap[s._id.toString()] === user._id.toString()
//       );
//       if (!alreadyNotified) {
//         emitNotification(io, user._id.toString(), {
//           message: `🏢 New company added: ${company.name} (${company.industry})`,
//           type: 'company',
//           link: '/companies',
//         });
//       }
//     });

//     console.log(`📊 Eligible notified: ${eligibleNotified}, Others notified: ${allUsers.length - eligibleNotified}`);

//     res.status(201).json({ success: true, data: company });

//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// });



// // PUT update company
// router.put('/:id', protect, adminOnly, async (req, res) => {
//   try {
//     const company = await Company.findByIdAndUpdate(
//       req.params.id, req.body,
//       { new: true, runValidators: true }
//     );
//     if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
//     res.json({ success: true, data: company });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// });

// // DELETE company
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
const Student = require('../models/Student');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const { emitNotification } = require('../socket/socketHandler');
const { sendEligibilityEmail } = require('../utils/emailService'); // ← ADD

// GET all companies
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

// GET single company
router.get('/:id', protect, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    res.json({ success: true, data: company });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create company
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const company = await Company.create(req.body);
    const io = req.app.get('io');

    // Step 1: Find eligible students
    const { minCGPA, maxBacklogs, branches } = company.eligibilityCriteria || {};
    const eligibilityQuery = { isPlaced: false };
    if (minCGPA) eligibilityQuery.cgpa = { $gte: minCGPA };
    if (maxBacklogs !== undefined) eligibilityQuery.backlogs = { $lte: maxBacklogs };
    if (branches?.length) eligibilityQuery.branch = { $in: branches };

    const eligibleStudents = await Student.find(eligibilityQuery);
    const allUsers = await User.find({ isStudent: true });

    console.log('✅ Company created:', company.name);
    console.log('👥 Eligible students:', eligibleStudents.length);
    console.log('🔌 IO exists:', !!io);

    // Step 2: Map studentRef → userId
    const refMap = {};
    allUsers.forEach(u => {
      if (u.studentRef) refMap[u.studentRef.toString()] = u._id.toString();
    });

    // Step 3: Notify + Email eligible students
    let eligibleNotified = 0;
    for (const student of eligibleStudents) {
      const userId = refMap[student._id.toString()];

      // Socket notification
      if (userId) {
        console.log('📤 Eligible notify to:', userId);
        emitNotification(io, userId, {
          message: `🎯 You are eligible for ${company.name}! Pkg: ₹${company.packageRange?.min || '?'}–${company.packageRange?.max || '?'} LPA | Roles: ${company.roles?.join(', ') || 'TBD'}`,
          type: 'eligibility',
          link: '/companies',
        });
        eligibleNotified++;
      }

      // Email notification
      if (student.email) {
        try {
          await sendEligibilityEmail({
            to: student.email,
            studentName: student.name,
            companyName: company.name,
            roles: company.roles,
            packageMin: company.packageRange?.min || '?',
            packageMax: company.packageRange?.max || '?',
            minCGPA: company.eligibilityCriteria?.minCGPA || '?',
            branches: company.eligibilityCriteria?.branches,
            visitDate: company.visitDate,
          });
          console.log(`📧 Email sent to ${student.email}`);
        } catch (emailErr) {
          console.error(`❌ Email failed for ${student.email}:`, emailErr.message);
        }
      }
    }

    // Step 4: Notify non-eligible students
    allUsers.forEach(user => {
      const alreadyNotified = eligibleStudents.some(
        s => refMap[s._id.toString()] === user._id.toString()
      );
      if (!alreadyNotified) {
        emitNotification(io, user._id.toString(), {
          message: `🏢 New company added: ${company.name} (${company.industry})`,
          type: 'company',
          link: '/companies',
        });
      }
    });

    console.log(`📊 Eligible notified: ${eligibleNotified}, Others: ${allUsers.length - eligibleNotified}`);
    res.status(201).json({ success: true, data: company });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update company
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id, req.body,
      { new: true, runValidators: true }
    );
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    res.json({ success: true, data: company });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE company
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Company deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
