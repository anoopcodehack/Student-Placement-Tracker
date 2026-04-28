import React from 'react';

export default function StatCard({ icon, iconBg, iconColor, value, label, suffix = '', trend, trendLabel }) {
  return (
    <div className="stat-card fade-in h-100">
      <div className="d-flex align-items-start justify-content-between">
        <div className="stat-icon" style={{ background: iconBg }}>
          <i className={`bi ${icon}`} style={{ color: iconColor }}></i>
        </div>
        {trend !== undefined && (
          <span style={{
            fontSize: '0.72rem', fontWeight: 600, padding: '3px 8px', borderRadius: 20,
            background: trend >= 0 ? '#dcfce7' : '#fee2e2',
            color: trend >= 0 ? '#166534' : '#991b1b'
          }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="stat-value mt-3">{value}{suffix}</div>
      <div className="stat-label">{label}</div>
      {trendLabel && <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>{trendLabel}</div>}
    </div>
  );
}
