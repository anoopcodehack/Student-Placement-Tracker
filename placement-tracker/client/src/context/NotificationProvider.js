import { createContext, useContext, useEffect, useState } from 'react';
import socket from '../socket';
import { useAuth } from './AuthContext'; // your existing auth context
import axios from 'axios';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
  if (!user) {
    setNotifications([]);
    setUnread(0);
    return undefined;
  }

  let active = true;
  axios.get('/api/notifications')
    .then(({ data }) => {
      if (!active) return;
      const history = data.data || [];
      setNotifications(history);
      setUnread(history.filter(notification => !notification.read).length);
    })
    .catch(() => {});

  socket.emit('join', user._id);
  socket.off('notification');
  socket.on('notification', (data) => {
    setNotifications(prev => [data, ...prev]);
    setUnread(prev => prev + 1);
  });

  return () => {
    active = false;
    socket.off('notification');
  };
}, [user]);

  const markAllRead = async () => {
    setUnread(0);
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
    try { await axios.patch('/api/notifications/read-all'); } catch { /* local state remains usable */ }
  };

  const removeNotification = async (id) => {
    setNotifications(prev => {
      const removed = prev.find(notification => notification._id === id);
      if (removed && !removed.read) setUnread(count => Math.max(0, count - 1));
      return prev.filter(notification => notification._id !== id);
    });
    try { await axios.delete(`/api/notifications/${id}`); } catch { /* server cleanup can retry on refresh */ }
  };

  const clearNotifications = async () => {
    setNotifications([]);
    setUnread(0);
    try { await axios.delete('/api/notifications'); } catch { /* local state remains cleared */ }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unread, markAllRead, removeNotification, clearNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);