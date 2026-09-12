const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  message: { type: String, required: true, trim: true },
  type: { type: String, enum: ['company', 'result', 'drive', 'interview', 'system'], default: 'system' },
  link: { type: String, default: '' },
  read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
