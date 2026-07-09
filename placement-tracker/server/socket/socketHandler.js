// helper to emit notifications cleanly from anywhere
const emitNotification = (io, userId, notification) => {
  io.to(userId).emit('notification', {
    message: notification.message,
    type: notification.type,   // 'drive' | 'result' | 'interview'
    link: notification.link,
    timestamp: new Date()
  });
};

module.exports = { emitNotification };