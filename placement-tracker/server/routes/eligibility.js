const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Student = require('../models/Student');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const { emitNotification } = require('../socket/socketHandler');

// ── GET /api/eligibility/:companyId — get eligible students for a company
router.get('/:companyId', protect, async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });

    const { minCGPA, maxBacklogs, branches } = company.eligibilityCriteria;

    // Build filter query
    const query = {
      isPlaced: false, // only unplaced students
    };

    if (minCGPA) query.cgpa = { $gte: minCGPA };
    if (maxBacklogs !== undefined) query.backlogs = { $lte: maxBacklogs };
    if (branches && branches.length > 0) query.branch = { $in: branches };

    const eligibleStudents = await Student.find(query).sort({ cgpa: -1 });

    res.json({
      success: true,
      company: {
        name: company.name,
        eligibilityCriteria: company.eligibilityCriteria,
        roles: company.roles,
        packageRange: company.packageRange,
      },
      total: eligibleStudents.length,
      data: eligibleStudents,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/eligibility/:companyId/notify — notify eligible students
router.post('/:companyId/notify', protect, adminOnly, async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });

    const { minCGPA, maxBacklogs, branches } = company.eligibilityCriteria;

    const query = { isPlaced: false };
    if (minCGPA) query.cgpa = { $gte: minCGPA };
    if (maxBacklogs !== undefined) query.backlogs = { $lte: maxBacklogs };
    if (branches && branches.length > 0) query.branch = { $in: branches };

    const eligibleStudents = await Student.find(query);

    // Find user accounts linked to eligible students
    const io = req.app.get('io');
    let notified = 0;

    for (const student of eligibleStudents) {
      const userAccount = await User.findOne({
        studentRef: student._id,
        isStudent: true
      });

      if (userAccount) {
        emitNotification(io, userAccount._id.toString(), {
          message: `🎯 You are eligible for ${company.name}! ${company.roles?.length ? `Roles: ${company.roles.join(', ')}` : ''} | Pkg: ₹${company.packageRange?.min || '?'}–${company.packageRange?.max || '?'} LPA`,
          type: 'eligibility',
          link: '/companies',
        });
        notified++;
      }
    }

    res.json({
      success: true,
      message: `Notified ${notified} eligible students`,
      totalEligible: eligibleStudents.length,
      notified,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/eligibility/check — check if a specific student is eligible
router.post('/check', protect, async (req, res) => {
  try {
    const { studentId, companyId } = req.body;

    const [student, company] = await Promise.all([
      Student.findById(studentId),
      Company.findById(companyId),
    ]);

    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });

    const { minCGPA, maxBacklogs, branches } = company.eligibilityCriteria;

    const checks = [
      {
        rule: `CGPA ≥ ${minCGPA}`,
        passed: !minCGPA || student.cgpa >= minCGPA,
        studentValue: student.cgpa,
        required: minCGPA,
      },
      {
        rule: `Backlogs ≤ ${maxBacklogs}`,
        passed: maxBacklogs === undefined || student.backlogs <= maxBacklogs,
        studentValue: student.backlogs,
        required: maxBacklogs,
      },
      {
        rule: `Branch: ${branches?.join(', ') || 'All'}`,
        passed: !branches?.length || branches.includes(student.branch),
        studentValue: student.branch,
        required: branches?.join(', ') || 'All',
      },
      {
        rule: 'Not already placed',
        passed: !student.isPlaced,
        studentValue: student.isPlaced ? 'Placed' : 'Unplaced',
        required: 'Unplaced',
      },
    ];

    const isEligible = checks.every(c => c.passed);

    res.json({
      success: true,
      isEligible,
      student: { name: student.name, cgpa: student.cgpa, branch: student.branch, backlogs: student.backlogs },
      company: { name: company.name },
      checks,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;