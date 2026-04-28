import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const fillDemo = (role) => {
    if (role === 'admin') setForm({ email: 'admin@college.edu', password: 'admin123' });
    else setForm({ email: 'viewer@college.edu', password: 'viewer123' });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card fade-in">
        {/* Header */}
        <div className="text-center mb-4">
          <div style={{
            width:56,height:56,borderRadius:16,
            background:'linear-gradient(135deg,#1a56db,#06b6d4)',
            display:'flex',alignItems:'center',justifyContent:'center',
            margin:'0 auto 1rem',fontSize:'1.5rem',color:'#fff'
          }}>
            <i className="bi bi-mortarboard-fill"></i>
          </div>
          <h2 style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1.6rem',color:'#0f172a',marginBottom:4}}>
            PlaceTrack
          </h2>
          <p style={{color:'#64748b',fontSize:'0.875rem',margin:0}}>
            Sign in to your placement portal
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <div style={{position:'relative'}}>
              <i className="bi bi-envelope" style={{
                position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',
                color:'#94a3b8',fontSize:'0.9rem',zIndex:1
              }}></i>
              <input type="email" className="form-control" style={{paddingLeft:36}}
                placeholder="you@college.edu"
                value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <div style={{position:'relative'}}>
              <i className="bi bi-lock" style={{
                position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',
                color:'#94a3b8',fontSize:'0.9rem',zIndex:1
              }}></i>
              <input type="password" className="form-control" style={{paddingLeft:36}}
                placeholder="••••••••"
                value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
            {loading ? <><span className="spinner-border spinner-border-sm me-2"/>Signing in...</> : <>
              <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
            </>}
          </button>
        </form>

        {/* Demo accounts */}
        <div className="mt-4 pt-3" style={{borderTop:'1px solid #e2e8f0'}}>
          <p style={{fontSize:'0.72rem',color:'#94a3b8',textAlign:'center',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>
            Quick Demo Access
          </p>
          <div className="d-flex gap-2">
            <button onClick={()=>fillDemo('admin')}
              className="btn btn-outline-primary btn-sm w-50"
              style={{fontSize:'0.78rem',borderRadius:8}}>
              <i className="bi bi-shield-lock-fill me-1"></i>Admin
            </button>
            <button onClick={()=>fillDemo('viewer')}
              className="btn btn-outline-secondary btn-sm w-50"
              style={{fontSize:'0.78rem',borderRadius:8}}>
              <i className="bi bi-eye-fill me-1"></i>Viewer
            </button>
          </div>
          <p style={{fontSize:'0.7rem',color:'#94a3b8',textAlign:'center',margin:'10px 0 0'}}>
            Admin: full access · Viewer: read only
          </p>
        </div>
      </div>
    </div>
  );
}
