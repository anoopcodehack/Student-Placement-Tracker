const express = require('express');
const router = express.Router();
const { emitNotification } = require('../socket/socketHandler');
const User = require('../models/User');

// POST /api/drives — admin adds new drive
router.post('/', async (req, res) => {
  try {
    const io = req.app.get('io');
    const drive = req.body; // { company, role, date, eligibleBranches }

    // save drive to DB here (your existing logic)

    // notify all eligible students
    const eligibleStudents = await User.find({
      branch: { $in: drive.eligibleBranches },
      role: 'student'
    });

    eligibleStudents.forEach(student => {
      emitNotification(io, student._id.toString(), {
        message: `🏢 New drive added: ${drive.company} — ${drive.role}`,
        type: 'drive',
        link: `/drives/${drive._id}`
      });
    });

    res.status(201).json({ message: 'Drive added and students notified' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/drives/result — admin announces result
router.post('/result', async (req, res) => {
  try {
    const io = req.app.get('io');
    const { studentId, company, status } = req.body;

    // save result to DB here

    emitNotification(io, studentId, {
      message: status === 'selected'
        ? `🎉 Congrats! You are selected at ${company}`
        : `❌ Result updated for ${company}`,
      type: 'result',
      link: `/results`
    });

    res.status(200).json({ message: 'Result announced' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;