const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Company = require('../models/Company');
const Placement = require('../models/Placement');
const { protect } = require('../middleware/auth');

// GET /api/stats/overview - main dashboard numbers
router.get('/overview', protect, async (req, res) => {
  try {
    const { batch } = req.query;
    const filter = batch ? { batch: parseInt(batch) } : {};

    const [totalStudents, placedStudents, totalCompanies, placements] = await Promise.all([
      Student.countDocuments(filter),
      Student.countDocuments({ ...filter, isPlaced: true }),
      Company.countDocuments(),
      Placement.find(filter.batch ? {} : {})
        .populate('student', 'batch')
        .lean()
    ]);

    const filteredPlacements = batch
      ? placements.filter(p => p.student?.batch === parseInt(batch))
      : placements;

    const packages = filteredPlacements.map(p => p.package).filter(Boolean);
    const avgPackage = packages.length ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(2) : 0;
    const maxPackage = packages.length ? Math.max(...packages) : 0;
    const placementRate = totalStudents ? ((placedStudents / totalStudents) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        totalStudents,
        placedStudents,
        unplacedStudents: totalStudents - placedStudents,
        totalCompanies,
        placementRate: parseFloat(placementRate),
        avgPackage: parseFloat(avgPackage),
        maxPackage,
        totalOffers: filteredPlacements.length,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/stats/branch-wise
router.get('/branch-wise', protect, async (req, res) => {
  try {
    const { batch } = req.query;
    const matchStage = batch ? { batch: parseInt(batch) } : {};
    const data = await Student.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$branch',
          total: { $sum: 1 },
          placed: { $sum: { $cond: ['$isPlaced', 1, 0] } },
          avgCGPA: { $avg: '$cgpa' },
        }
      },
      { $sort: { placed: -1 } }
    ]);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/stats/package-distribution
router.get('/package-distribution', protect, async (req, res) => {
  try {
    const placements = await Placement.find({ status: 'Confirmed' }).select('package');
    const brackets = { '0-5': 0, '5-10': 0, '10-15': 0, '15-20': 0, '20+': 0 };
    placements.forEach(p => {
      if (p.package <= 5) brackets['0-5']++;
      else if (p.package <= 10) brackets['5-10']++;
      else if (p.package <= 15) brackets['10-15']++;
      else if (p.package <= 20) brackets['15-20']++;
      else brackets['20+']++;
    });
    res.json({ success: true, data: Object.entries(brackets).map(([range, count]) => ({ range, count })) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/stats/company-wise
router.get('/company-wise', protect, async (req, res) => {
  try {
    const data = await Placement.aggregate([
      {
        $group: {
          _id: '$company',
          offers: { $sum: 1 },
          avgPackage: { $avg: '$package' },
          maxPackage: { $max: '$package' },
        }
      },
      { $lookup: { from: 'companies', localField: '_id', foreignField: '_id', as: 'company' } },
      { $unwind: '$company' },
      { $project: { name: '$company.name', industry: '$company.industry', offers: 1, avgPackage: 1, maxPackage: 1 } },
      { $sort: { offers: -1 } },
      { $limit: 10 }
    ]);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/stats/monthly-trend
router.get('/monthly-trend', protect, async (req, res) => {
  try {
    const data = await Placement.aggregate([
      {
        $group: {
          _id: { year: { $year: '$dateOfOffer' }, month: { $month: '$dateOfOffer' } },
          count: { $sum: 1 },
          avgPackage: { $avg: '$package' },
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formatted = data.map(d => ({
      month: `${months[d._id.month - 1]} ${d._id.year}`,
      offers: d.count,
      avgPackage: parseFloat(d.avgPackage.toFixed(2)),
    }));
    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/stats/batches
router.get('/batches', protect, async (req, res) => {
  try {
    const batches = await Student.distinct('batch');
    res.json({ success: true, data: batches.sort((a, b) => b - a) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
