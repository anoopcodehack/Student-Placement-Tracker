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
        <i className="bi bi-bell-fill" aria-hidden="true"></i>
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: -2, right: -2,
            background: '#d7e36f', color: '#153f28',
            borderRadius: '50%', fontSize: 11,
            width: 9, height: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }} aria-label={`${unread} unread notifications`} />
        )}
      </button>
    </div>
  );
};

export default NotificationBell;