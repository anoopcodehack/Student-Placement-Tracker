import React from 'react';

export default function ConfirmModal({ show, title, message, onConfirm, onCancel, confirmText = 'Delete', confirmVariant = 'danger' }) {
  if (!show) return null;
  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={onCancel} />
      <div className="modal fade show d-block" style={{ zIndex: 1050 }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: 16, border: 'none', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold" style={{ fontFamily: 'Syne,sans-serif' }}>{title}</h5>
              <button className="btn-close" onClick={onCancel} />
            </div>
            <div className="modal-body pt-2">
              <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>{message}</p>
            </div>
            <div className="modal-footer border-0">
              <button className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
              <button className={`btn btn-${confirmVariant}`} onClick={onConfirm}>{confirmText}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
