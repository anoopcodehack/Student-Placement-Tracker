const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  logo: { type: String, default: '' },
  industry: {
    type: String,
    enum: ['IT', 'Finance', 'Core', 'Consulting', 'Product', 'Service', 'Startup', 'PSU', 'Other'],
    default: 'IT'
  },
  website: { type: String },
  type: { type: String, enum: ['MNC', 'Startup', 'PSU', 'SME'], default: 'MNC' },
  visitDate: { type: Date },
  roles: [{ type: String }],
  eligibilityCriteria: {
    minCGPA: { type: Number, default: 6.0 },
    maxBacklogs: { type: Number, default: 0 },
    branches: [{ type: String }],
  },
  packageRange: {
    min: { type: Number },
    max: { type: Number },
  },
  studentsHired: { type: Number, default: 0 },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
