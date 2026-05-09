const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  // Written by this user account
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: { type: String, required: true },
  package: { type: Number }, // LPA
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  rounds: [
    {
      roundNo: { type: Number },
      roundName: { type: String }, // e.g. "Aptitude Test", "Technical Round 1"
      description: { type: String },
    }
  ],
  questionsAsked: { type: String }, // free text
  tips: { type: String },           // tips for juniors
  verdict: {
    type: String,
    enum: ['Selected', 'Rejected', 'On Hold'],
    default: 'Selected',
  },
  isAnonymous: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);