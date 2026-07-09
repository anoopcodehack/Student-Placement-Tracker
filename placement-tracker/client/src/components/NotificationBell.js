import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationProvider';

const NotificationBell = () => {
  const { unread, markAllRead } = useNotifications();
  const navigate = useNavigate();

  const handleClick = () => {
    markAllRead();
    navigate('/notifications');
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleClick}
        className="logout-btn"
        title="Notifications"
      >
        🔔
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: -6, right: -6,
            background: 'red', color: 'white',
            borderRadius: '50%', fontSize: 11,
            width: 18, height: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {unread}
          </span>
        )}
      </button>
    </div>
  );
};

export default NotificationBell;