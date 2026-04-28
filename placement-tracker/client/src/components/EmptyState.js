import React from 'react';

export default function EmptyState({ icon = 'bi-inbox', title = 'Nothing here', message = 'No data found.', action }) {
  return (
    <div className="text-center py-5">
      <i className={`bi ${icon}`} style={{ fontSize: '3rem', color: '#cbd5e1' }}></i>
      <h5 className="mt-3 mb-1" style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, color: '#64748b' }}>{title}</h5>
      <p className="text-muted mb-3" style={{ fontSize: '0.875rem' }}>{message}</p>
      {action && action}
    </div>
  );
}
