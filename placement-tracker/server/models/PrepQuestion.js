const mongoose = require('mongoose');

const prepQuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  topic: {
    type: String,
    required: true,
    enum: ['DSA', 'SQL', 'Core CS', 'Web Dev', 'Aptitude', 'HR'],
  },
  subTopic: {
    type: String,
    trim: true,
    default: '',
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  companies: [{
    type: String,
    trim: true,
  }],
  question: {
    type: String,
    required: true,
  },
  solution: {
    type: String,
    required: true,
  },
  codeSnippet: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: 'text',
  },
  keyPoints: [{
    type: String,
  }],
  tips: {
    type: String,
    default: '',
  },
  likes: {
    type: Number,
    default: 0,
  },
  isOfficial: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

// Index for search & filter optimization
prepQuestionSchema.index({ topic: 1, difficulty: 1 });
prepQuestionSchema.index({ companies: 1 });
prepQuestionSchema.index({ title: 'text', question: 'text', subTopic: 'text' });

module.exports = mongoose.model('PrepQuestion', prepQuestionSchema);
