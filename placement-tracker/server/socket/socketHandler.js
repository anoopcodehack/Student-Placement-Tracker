const Notification = require('../models/Notification');

// Persist first so the notification is available after refresh, then deliver it live.
const emitNotification = async (io, userId, notification) => {
  const saved = await Notification.create({
    user: userId,
    message: notification.message,
    type: notification.type,
    link: notification.link || '',
  });

  io.to(userId).emit('notification', {
    _id: saved._id,
    message: notification.message,
    type: notification.type,
    link: notification.link || '',
    read: false,
    timestamp: saved.createdAt,
  });
};

module.exports = { emitNotification };