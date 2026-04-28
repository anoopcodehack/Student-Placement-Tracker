const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  package: { type: Number, required: true }, // in LPA
  role: { type: String, required: true },
  offerType: { type: String, enum: ['Intern', 'FTE', 'Intern+FTE'], default: 'FTE' },
  dateOfOffer: { type: Date, default: Date.now },
  location: { type: String },
  status: { type: String, enum: ['Confirmed', 'Pending', 'Rejected'], default: 'Confirmed' },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Placement', placementSchema);
