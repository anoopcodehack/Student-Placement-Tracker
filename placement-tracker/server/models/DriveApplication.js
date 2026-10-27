const mongoose = require('mongoose');

const driveApplicationSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'in_progress', 'rejected', 'selected'],
    default: 'applied',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  resumeSnapshot: {
    type: String,
    default: '',
  },
  cgpaSnapshot: {
    type: Number,
  },
  branchSnapshot: {
    type: String,
  },
  backlogsSnapshot: {
    type: Number,
  },
  notes: {
    type: String,
    default: '',
  },
}, { timestamps: true });

// Prevent duplicate applications by same student for same company drive
driveApplicationSchema.index({ company: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('DriveApplication', driveApplicationSchema);
