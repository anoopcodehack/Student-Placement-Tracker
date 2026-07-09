import { createContext, useContext, useEffect, useState } from 'react';
import socket from '../socket';
import { useAuth } from './AuthContext'; // your existing auth context

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
  if (!user) return;

  // join personal room
  socket.emit('join', user._id);

  // ← ADD THIS — remove old listener before adding new one
  socket.off('notification');

  // listen for notifications
  socket.on('notification', (data) => {
    console.log('🔔 Notification received:', data);
    setNotifications(prev => [data, ...prev]);
    setUnread(prev => prev + 1);
  });

  return () => {
    socket.off('notification'); // ← cleanup
  };
}, [user]);

  const markAllRead = () => setUnread(0);

  return (
    <NotificationContext.Provider
      value={{ notifications, unread, markAllRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);