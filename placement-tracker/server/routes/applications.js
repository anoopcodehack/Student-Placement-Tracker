const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Student = require('../models/Student');
const User = require('../models/User');
const DriveApplication = require('../models/DriveApplication');
const { protect } = require('../middleware/auth');
const { ensureStudentForUser } = require('../utils/studentHelper');
const { emitNotification } = require('../socket/socketHandler');

/**
 * Helper to compute student eligibility for a given company
 */
function evaluateEligibility(student, company) {
  if (!student) {
    return {
      isEligible: false,
      checks: [
        { rule: 'Student Profile', passed: false, detail: 'Complete your student profile to verify eligibility' }
      ]
    };
  }

  const crit = company.eligibilityCriteria || {};
  const minCGPA = crit.minCGPA != null ? crit.minCGPA : 0;
  const maxBacklogs = crit.maxBacklogs != null ? crit.maxBacklogs : 0;
  const eligibleBranches = Array.isArray(crit.branches) ? crit.branches : [];

  const studentCGPA = student.cgpa != null ? student.cgpa : 0;
  const studentBacklogs = student.backlogs != null ? student.backlogs : 0;
  const studentBranch = student.branch || '';

  const cgpaPassed = studentCGPA >= minCGPA;
  const backlogsPassed = studentBacklogs <= maxBacklogs;
  const branchPassed = eligibleBranches.length === 0 || eligibleBranches.includes(studentBranch);
  const unplacedPassed = !student.isPlaced;

  const checks = [
    {
      type: 'cgpa',
      rule: `CGPA ≥ ${minCGPA}`,
      passed: cgpaPassed,
      required: minCGPA,
      studentValue: studentCGPA,
      reason: cgpaPassed ? `CGPA ${studentCGPA} meets requirement` : `CGPA ${studentCGPA} is below required ${minCGPA}`
    },
    {
      type: 'backlogs',
      rule: `Max Backlogs ≤ ${maxBacklogs}`,
      passed: backlogsPassed,
      required: maxBacklogs,
      studentValue: studentBacklogs,
      reason: backlogsPassed ? `${studentBacklogs} backlogs (acceptable)` : `${studentBacklogs} active backlogs exceed maximum allowed (${maxBacklogs})`
    },
    {
      type: 'branch',
      rule: eligibleBranches.length > 0 ? `Branches: ${eligibleBranches.join(', ')}` : 'All Branches Eligible',
      passed: branchPassed,
      required: eligibleBranches.length > 0 ? eligibleBranches.join(', ') : 'All',
      studentValue: studentBranch,
      reason: branchPassed ? `Branch ${studentBranch} is eligible` : `Branch ${studentBranch} is not in eligible list`
    },
    {
      type: 'placement_status',
      rule: 'Unplaced Status',
      passed: unplacedPassed,
      required: 'Unplaced',
      studentValue: student.isPlaced ? 'Placed' : 'Unplaced',
      reason: unplacedPassed ? 'Student is eligible to seek placement' : 'Already marked placed'
    }
  ];

  const isEligible = checks.every(c => c.passed);

  return { isEligible, checks };
}

// ── GET /api/applications/drives — list all company drives with eligibility & application state
router.get('/drives', protect, async (req, res) => {
  try {
    const companies = await Company.find({}).sort({ visitDate: -1, createdAt: -1 });

    let student = null;
    const isStudentUser = req.user.isStudent || req.user.role === 'student' || Boolean(req.user.rollNo);

    if (isStudentUser) {
      student = await ensureStudentForUser(req.user);
    }

    // Get applicant counts per company
    const applicantCounts = await DriveApplication.aggregate([
      { $group: { _id: '$company', count: { $sum: 1 } } }
    ]);
    const countsMap = {};
    applicantCounts.forEach(item => {
      countsMap[item._id.toString()] = item.count;
    });

    // Get student's existing applications
    let studentApplicationsMap = {};
    if (student) {
      const myApps = await DriveApplication.find({ student: student._id });
      myApps.forEach(app => {
        studentApplicationsMap[app.company.toString()] = {
          _id: app._id,
          status: app.status,
          appliedAt: app.appliedAt,
        };
      });
    }

    const drives = companies.map(company => {
      const companyId = company._id.toString();
      const applicantsCount = countsMap[companyId] || 0;
      const application = studentApplicationsMap[companyId] || null;
      const hasApplied = Boolean(application);

      let eligibility = { isEligible: true, checks: [] };
      if (student) {
        eligibility = evaluateEligibility(student, company);
      }

      return {
        _id: company._id,
        name: company.name,
        logo: company.logo,
        industry: company.industry,
        type: company.type,
        website: company.website,
        visitDate: company.visitDate,
        roles: company.roles || [],
        packageRange: company.packageRange || {},
        eligibilityCriteria: company.eligibilityCriteria || { minCGPA: 6.0, maxBacklogs: 0, branches: [] },
        description: company.description || '',
        applicantsCount,
        hasApplied,
        application,
        isEligible: eligibility.isEligible,
        eligibilityChecks: eligibility.checks,
      };
    });

    res.json({
      success: true,
      student: student ? {
        _id: student._id,
        name: student.name,
        rollNo: student.rollNo,
        branch: student.branch,
        cgpa: student.cgpa,
        backlogs: student.backlogs,
        resume: student.resume,
        isPlaced: student.isPlaced,
      } : null,
      totalDrives: drives.length,
      data: drives,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/applications/apply/:companyId — 1-click apply for a drive
router.post('/apply/:companyId', protect, async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Drive / Company not found' });
    }

    const student = await ensureStudentForUser(req.user);
    if (!student) {
      return res.status(400).json({
        success: false,
        message: 'No student record found. Only students can apply for placement drives.'
      });
    }

    // Check if already applied
    const existing = await DriveApplication.findOne({ company: company._id, student: student._id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already registered for this drive',
        application: existing
      });
    }

    // Server-side eligibility validation
    const { isEligible, checks } = evaluateEligibility(student, company);
    if (!isEligible) {
      const failed = checks.filter(c => !c.passed).map(c => c.reason).join('; ');
      return res.status(400).json({
        success: false,
        message: `Eligibility requirements not met: ${failed}`
      });
    }

    // Create application
    const application = await DriveApplication.create({
      company: company._id,
      student: student._id,
      user: req.user._id,
      status: 'applied',
      appliedAt: new Date(),
      resumeSnapshot: student.resume || '',
      cgpaSnapshot: student.cgpa,
      branchSnapshot: student.branch,
      backlogsSnapshot: student.backlogs,
    });

    // Real-time socket notification
    const io = req.app.get('io');
    if (io) {
      emitNotification(io, req.user._id.toString(), {
        message: `Application submitted successfully for ${company.name} drive!`,
        type: 'drive',
        link: '/drives'
      });
    }

    res.status(201).json({
      success: true,
      message: `Successfully registered for ${company.name} placement drive!`,
      data: application
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/applications/withdraw/:companyId — withdraw an application
router.delete('/withdraw/:companyId', protect, async (req, res) => {
  try {
    const { companyId } = req.params;
    const student = await ensureStudentForUser(req.user);

    if (!student) {
      return res.status(400).json({ success: false, message: 'Student profile required' });
    }

    const app = await DriveApplication.findOne({ company: companyId, student: student._id });
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (app.status !== 'applied') {
      return res.status(400).json({
        success: false,
        message: `Cannot withdraw application once status is ${app.status}`
      });
    }

    await DriveApplication.findByIdAndDelete(app._id);

    res.json({ success: true, message: 'Application withdrawn successfully' });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/applications/company/:companyId/applicants — get applicants for a drive (Admin only)
router.get('/company/:companyId/applicants', protect, async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const applications = await DriveApplication.find({ company: companyId })
      .populate('student')
      .sort({ appliedAt: -1 });

    const applicants = applications.map((app, index) => {
      const s = app.student || {};
      return {
        sNo: index + 1,
        applicationId: app._id,
        status: app.status,
        appliedAt: app.appliedAt,
        studentId: s._id,
        name: s.name || 'Unknown',
        rollNo: s.rollNo || '—',
        email: s.email || '—',
        phone: s.phone || '—',
        branch: s.branch || app.branchSnapshot || '—',
        batch: s.batch || '—',
        cgpa: s.cgpa != null ? s.cgpa : (app.cgpaSnapshot != null ? app.cgpaSnapshot : '—'),
        tenthPercent: s.tenthPercent ? `${s.tenthPercent}%` : '—',
        twelfthPercent: s.twelfthPercent ? `${s.twelfthPercent}%` : '—',
        backlogs: s.backlogs != null ? s.backlogs : (app.backlogsSnapshot != null ? app.backlogsSnapshot : 0),
        resume: s.resume || app.resumeSnapshot || '',
        linkedin: s.linkedin || '',
        github: s.github || '',
      };
    });

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        roles: company.roles,
        visitDate: company.visitDate,
        packageRange: company.packageRange,
      },
      total: applicants.length,
      data: applicants,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/applications/my-applications — student's registered drives
router.get('/my-applications', protect, async (req, res) => {
  try {
    const student = await ensureStudentForUser(req.user);
    if (!student) {
      return res.json({ success: true, total: 0, data: [] });
    }

    const applications = await DriveApplication.find({ student: student._id })
      .populate('company')
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      total: applications.length,
      data: applications,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
