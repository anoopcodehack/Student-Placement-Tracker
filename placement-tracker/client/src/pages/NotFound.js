import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f1f5f9' }}>
      <div className="text-center">
        <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'9rem', lineHeight:1, color:'#e2e8f0', userSelect:'none', letterSpacing:'-0.04em' }}>404</div>
        <h2 style={{ fontFamily:'Syne,sans-serif', fontWeight:800, color:'#1e293b', marginTop:'-1rem' }}>Page Not Found</h2>
        <p className="text-muted mb-4" style={{ fontSize:'0.9rem' }}>The page you're looking for doesn't exist or was moved.</p>
        <button className="btn btn-primary px-4" onClick={()=>navigate('/')}>
          <i className="bi bi-house-fill me-2"></i>Go to Dashboard
        </button>
      </div>
    </div>
  );
}
