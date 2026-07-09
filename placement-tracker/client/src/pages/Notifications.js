import { useNotifications } from '../context/NotificationProvider';
import { useNavigate } from 'react-router-dom';

export default function Notifications() {
  const { notifications, markAllRead } = useNotifications();
  const navigate = useNavigate();

  const typeIcon = (type) => {
    if (type === 'company') return '🏢';
    if (type === 'result') return '🎉';
    if (type === 'drive') return '📋';
    if (type === 'interview') return '🗓️';
    return '🔔';
  };

  return (
    <div>
      <div className="topbar">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-sub">{notifications.length} total notifications</p>
        </div>
        {notifications.length > 0 && (
          <button className="btn btn-outline-secondary" onClick={markAllRead}>
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: '3rem' }}>🔔</div>
          <h6 className="mt-3 text-muted">No notifications yet</h6>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>
            You'll be notified when companies, drives or results are added
          </p>
        </div>
      ) : (
        <div style={{ maxWidth: 650 }}>
          {notifications.map((n, i) => (
            <div
              key={i}
              onClick={() => n.link && navigate(n.link)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                padding: '16px 20px',
                marginBottom: 10,
                background: 'white',
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                cursor: n.link ? 'pointer' : 'default',
                transition: 'box-shadow 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
            >
              {/* Icon */}
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: '#f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.3rem', flexShrink: 0
              }}>
                {typeIcon(n.type)}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                  {n.message}
                </p>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4, display: 'block' }}>
                  {new Date(n.timestamp).toLocaleString('en-IN', {
                    day: 'numeric', month: 'short',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>

              {/* Arrow */}
              {n.link && (
                <i className="bi bi-chevron-right" style={{ color: '#cbd5e1', alignSelf: 'center' }}></i>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}