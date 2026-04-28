import React from 'react';

export default function Loader({ message = 'Loading...' }) {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" style={{ width: '2.5rem', height: '2.5rem' }} />
        <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>{message}</p>
      </div>
    </div>
  );
}
