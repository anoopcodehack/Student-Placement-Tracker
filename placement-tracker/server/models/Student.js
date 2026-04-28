const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  rollNo: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, trim: true },
  branch: {
    type: String,
    required: true,
    enum: ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'AIDS', 'AIML', 'CSD', 'Other']
  },
  batch: { type: Number, required: true }, // graduation year e.g. 2024
  cgpa: { type: Number, min: 0, max: 10 },
  skills: [{ type: String, trim: true }],
  tenthPercent: { type: Number },
  twelfthPercent: { type: Number },
  backlogs: { type: Number, default: 0 },
  isPlaced: { type: Boolean, default: false },
  placementDetails: {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    package: { type: Number }, // in LPA
    role: { type: String },
    offerType: { type: String, enum: ['Intern', 'FTE', 'Intern+FTE'], default: 'FTE' },
    dateOfOffer: { type: Date },
  },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  linkedin: { type: String },
  github: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
