import { useNotifications } from '../context/NotificationProvider';
import { useNavigate } from 'react-router-dom';

export default function Notifications() {
  const { notifications, unread, markAllRead, removeNotification, clearNotifications } = useNotifications();
  const navigate = useNavigate();

  const typeIcon = (type) => {
    if (type === 'company') return 'bi-building-fill';
    if (type === 'result') return 'bi-trophy-fill';
    if (type === 'drive') return 'bi-clipboard2-check-fill';
    if (type === 'interview') return 'bi-calendar-event-fill';
    return 'bi-bell-fill';
  };

  return (
    <div>
      <div className="topbar">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-sub">{notifications.length} total notifications{unread > 0 ? ` · ${unread} unread` : ''}</p>
        </div>
        {notifications.length > 0 && (
            <div className="d-flex gap-2">
              {unread > 0 && <button className="btn btn-outline-primary" onClick={markAllRead}><i className="bi bi-check2-all me-1"></i>Mark all read</button>}
              <button className="btn btn-outline-danger" onClick={clearNotifications}><i className="bi bi-trash3 me-1"></i>Clear history</button>
            </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-bell-slash" style={{ fontSize: '3rem', color: '#a6b296' }}></i>
          <h6 className="mt-3 text-muted">No notifications yet</h6>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>
            You'll be notified when companies, drives or results are added
          </p>
        </div>
      ) : (
        <div style={{ maxWidth: 650 }}>
          {notifications.map((n, i) => (
            <div
              key={n._id || i}
              onClick={() => n.link && navigate(n.link)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                padding: '16px 20px',
                marginBottom: 10,
                background: 'white',
                borderRadius: 12,
                border: n.read ? '1px solid #e2e8f0' : '1px solid #d7e36f',
                background: n.read ? 'white' : '#fbfdea',
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
                fontSize: '1.05rem', color: '#1f5c3a', flexShrink: 0
              }}>
                <i className={`bi ${typeIcon(n.type)}`}></i>
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
              <button
                type="button"
                title="Delete notification"
                aria-label="Delete notification"
                className="btn btn-sm btn-link text-danger"
                onClick={(event) => { event.stopPropagation(); removeNotification(n._id); }}
                style={{ alignSelf: 'center', padding: '4px 6px' }}
              >
                <i className="bi bi-trash3"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}