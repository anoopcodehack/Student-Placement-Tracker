// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// export default function Login() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await login(form.email, form.password);
//       toast.success('Welcome back! 🎉');
//       navigate('/');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Login failed');
//     } finally { setLoading(false); }
//   };

//   const fillDemo = (role) => {
//     if (role === 'admin') setForm({ email: 'admin@college.edu', password: 'admin123' });
//     else setForm({ email: 'viewer@college.edu', password: 'viewer123' });
//   };

//   return (
//     <div className="auth-wrapper">
//       <div className="auth-card fade-in">
//         {/* Header */}
//         <div className="text-center mb-4">
//           <div style={{
//             width:56,height:56,borderRadius:16,
//             background:'linear-gradient(135deg,#1a56db,#06b6d4)',
//             display:'flex',alignItems:'center',justifyContent:'center',
//             margin:'0 auto 1rem',fontSize:'1.5rem',color:'#fff'
//           }}>
//             <i className="bi bi-mortarboard-fill"></i>
//           </div>
//           <h2 style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1.6rem',color:'#0f172a',marginBottom:4}}>
//             PlaceTrack
//           </h2>
//           <p style={{color:'#64748b',fontSize:'0.875rem',margin:0}}>
//             Sign in to your placement portal
//           </p>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label className="form-label">Email address</label>
//             <div style={{position:'relative'}}>
//               <i className="bi bi-envelope" style={{
//                 position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',
//                 color:'#94a3b8',fontSize:'0.9rem',zIndex:1
//               }}></i>
//               <input type="email" className="form-control" style={{paddingLeft:36}}
//                 placeholder="you@college.edu"
//                 value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
//             </div>
//           </div>
//           <div className="mb-4">
//             <label className="form-label">Password</label>
//             <div style={{position:'relative'}}>
//               <i className="bi bi-lock" style={{
//                 position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',
//                 color:'#94a3b8',fontSize:'0.9rem',zIndex:1
//               }}></i>
//               <input type="password" className="form-control" style={{paddingLeft:36}}
//                 placeholder="••••••••"
//                 value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
//             </div>
//           </div>
//           <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
//             {loading ? <><span className="spinner-border spinner-border-sm me-2"/>Signing in...</> : <>
//               <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
//             </>}
//           </button>
//         </form>

//         {/* Demo accounts */}
//         <div className="mt-4 pt-3" style={{borderTop:'1px solid #e2e8f0'}}>
//           <p style={{fontSize:'0.72rem',color:'#94a3b8',textAlign:'center',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:10}}>
//             Quick Demo Access
//           </p>
//           <div className="d-flex gap-2">
//             <button onClick={()=>fillDemo('admin')}
//               className="btn btn-outline-primary btn-sm w-50"
//               style={{fontSize:'0.78rem',borderRadius:8}}>
//               <i className="bi bi-shield-lock-fill me-1"></i>Admin
//             </button>
//             <button onClick={()=>fillDemo('viewer')}
//               className="btn btn-outline-secondary btn-sm w-50"
//               style={{fontSize:'0.78rem',borderRadius:8}}>
//               <i className="bi bi-eye-fill me-1"></i>Viewer
//             </button>
//           </div>
//           <p style={{fontSize:'0.7rem',color:'#94a3b8',textAlign:'center',margin:'10px 0 0'}}>
//             Admin: full access · Viewer: read only
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// export default function Login() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
//   const [loading, setLoading] = useState(false);
//   const [tab, setTab] = useState('login'); // 'login' | 'signup'
//   const { login, register, authenticate } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const token = params.get('token');
//     const userData = params.get('user');
//     const error = params.get('error');

//     if (error) {
//       if (error === 'google_not_configured') {
//         toast.error('Google login is not configured. Use email/password instead.');
//       } else if (error === 'google_auth_failed') {
//         toast.error('Google login failed. Try again or use email/password.');
//       }
//     }

//     if (token && userData) {
//       try {
//         const user = JSON.parse(userData);
//         authenticate(token, user);
//         navigate('/');
//       } catch (err) {
//         console.error('Google auth callback parse failed', err);
//         toast.error('Google authentication failed.');
//       }
//     }

//     if (token || userData || error) {
//       window.history.replaceState({}, document.title, '/login');
//     }
//   }, [authenticate, navigate]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await login(form.email, form.password);
//       toast.success('Welcome back! 🎉');
//       navigate('/');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Invalid email or password');
//     } finally { setLoading(false); }
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     if (signupForm.password !== signupForm.confirmPassword) {
//       return toast.error('Passwords do not match!');
//     }
//     if (signupForm.password.length < 6) {
//       return toast.error('Password must be at least 6 characters');
//     }
//     setLoading(true);
//     try {
//       await register(signupForm.name, signupForm.email, signupForm.password);
//       toast.success('Account created! Welcome 🎉');
//       navigate('/');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Signup failed');
//     } finally { setLoading(false); }
//   };

//   const handleGoogleLogin = () => {
//     const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
//     window.location.href = `${backendUrl}/api/auth/google`;
//   };

//   const fillDemo = (role) => {
//     setTab('login');
//     if (role === 'admin') setForm({ email: 'admin@college.edu', password: 'admin123' });
//     else setForm({ email: 'viewer@college.edu', password: 'viewer123' });
//   };

//   return (
//     <div className="auth-wrapper">
//       <div className="auth-card fade-in" style={{ maxWidth: 440 }}>

//         {/* Logo */}
//         <div className="text-center mb-4">
//           <div style={{
//             width: 56, height: 56, borderRadius: 16,
//             background: 'linear-gradient(135deg,#1a56db,#06b6d4)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             margin: '0 auto 1rem', fontSize: '1.5rem', color: '#fff'
//           }}>
//             <i className="bi bi-mortarboard-fill"></i>
//           </div>
//           <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.6rem', color: '#0f172a', marginBottom: 4 }}>
//             PlaceTrack
//           </h2>
//           <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
//             Student Placement Portal
//           </p>
//         </div>

//         {/* Tabs — only show for non-admin */}
//         <div className="d-flex mb-4" style={{ background: '#f1f5f9', borderRadius: 10, padding: 4 }}>
//           {['login', 'signup'].map(t => (
//             <button key={t} type="button"
//               onClick={() => setTab(t)}
//               style={{
//                 flex: 1, border: 'none', borderRadius: 8, padding: '8px',
//                 fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
//                 background: tab === t ? '#fff' : 'transparent',
//                 color: tab === t ? '#1a56db' : '#64748b',
//                 boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
//                 transition: 'all 0.15s',
//                 textTransform: 'capitalize',
//               }}>
//               {t === 'login' ? '🔑 Sign In' : '✨ Sign Up'}
//             </button>
//           ))}
//         </div>

//        {/* ── SIGN UP TAB ── */}
// {tab === 'signup' && (
//   <>
//     <form onSubmit={handleSignup}>
//       <div className="mb-3">
//         <label className="form-label">Full Name</label>
//         <div style={{ position: 'relative' }}>
//           <i className="bi bi-person" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
//           <input type="text" className="form-control" style={{ paddingLeft: 36 }}
//             placeholder="Aarav Sharma"
//             value={signupForm.name}
//             onChange={e => setSignupForm({ ...signupForm, name: e.target.value })} required />
//         </div>
//       </div>

//       <div className="mb-3">
//         <label className="form-label">Email address</label>
//         <div style={{ position: 'relative' }}>
//           <i className="bi bi-envelope" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
//           <input type="email" className="form-control" style={{ paddingLeft: 36 }}
//             placeholder="you@college.edu"
//             value={signupForm.email}
//             onChange={e => setSignupForm({ ...signupForm, email: e.target.value })} required />
//         </div>
//       </div>

//       {/* 👇 WHO ARE YOU? */}
//       <div className="mb-3">
//         <label className="form-label">I am a</label>
//         <div className="d-flex gap-2">
//           {[
//             { val: 'viewer',  icon: 'bi-eye-fill',          label: 'Viewer / Staff' },
//             { val: 'student', icon: 'bi-mortarboard-fill',   label: 'Student'        },
//           ].map(opt => (
//             <button type="button" key={opt.val}
//               onClick={() => setSignupForm({ ...signupForm, accountType: opt.val })}
//               style={{
//                 flex: 1, padding: '10px 8px', borderRadius: 10, cursor: 'pointer',
//                 fontWeight: 600, fontSize: '0.82rem',
//                 border: signupForm.accountType === opt.val ? '2px solid #1a56db' : '1.5px solid #e2e8f0',
//                 background: signupForm.accountType === opt.val ? '#eff6ff' : '#fff',
//                 color: signupForm.accountType === opt.val ? '#1a56db' : '#64748b',
//                 transition: 'all 0.15s',
//               }}>
//               <i className={`bi ${opt.icon} d-block mb-1`} style={{ fontSize: '1.2rem' }}></i>
//               {opt.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* 👇 Show Roll No only if Student selected */}
//       {signupForm.accountType === 'student' && (
//         <div className="mb-3">
//           <label className="form-label">Roll Number</label>
//           <div style={{ position: 'relative' }}>
//             <i className="bi bi-card-text" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
//             <input className="form-control" style={{ paddingLeft: 36 }}
//               placeholder="e.g. 4SF24CS021"
//               value={signupForm.rollNo || ''}
//               onChange={e => setSignupForm({ ...signupForm, rollNo: e.target.value })} required />
//           </div>
//           <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>
//             <i className="bi bi-info-circle me-1"></i>
//             Your roll number will be used to link your student profile
//           </div>
//         </div>
//       )}

//       <div className="mb-3">
//         <label className="form-label">Password</label>
//         <div style={{ position: 'relative' }}>
//           <i className="bi bi-lock" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
//           <input type="password" className="form-control" style={{ paddingLeft: 36 }}
//             placeholder="Min 6 characters"
//             value={signupForm.password}
//             onChange={e => setSignupForm({ ...signupForm, password: e.target.value })} required />
//         </div>
//       </div>

//       <div className="mb-4">
//         <label className="form-label">Confirm Password</label>
//         <div style={{ position: 'relative' }}>
//           <i className="bi bi-lock-fill" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
//           <input type="password" className="form-control" style={{ paddingLeft: 36 }}
//             placeholder="Re-enter password"
//             value={signupForm.confirmPassword}
//             onChange={e => setSignupForm({ ...signupForm, confirmPassword: e.target.value })} required />
//         </div>
//         {signupForm.confirmPassword && (
//           <div style={{ fontSize: '0.72rem', marginTop: 4,
//             color: signupForm.password === signupForm.confirmPassword ? '#059669' : '#dc2626' }}>
//             {signupForm.password === signupForm.confirmPassword ? '✓ Passwords match' : '✗ Do not match'}
//           </div>
//         )}
//       </div>

//       <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
//         {loading
//           ? <><span className="spinner-border spinner-border-sm me-2" />Creating account...</>
//           : <><i className="bi bi-person-plus-fill me-2"></i>Create Account</>}
//       </button>

//       {/* Info note */}
//       <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8,
//         background: signupForm.accountType === 'student' ? '#eff6ff' : '#f8fafc',
//         fontSize: '0.72rem',
//         color: signupForm.accountType === 'student' ? '#1e40af' : '#94a3b8' }}>
//         {signupForm.accountType === 'student'
//           ? <><i className="bi bi-mortarboard me-1"></i> Your account will be linked to your student profile using your roll number automatically!</>
//           : <><i className="bi bi-eye me-1"></i> Viewer accounts have read-only access to placement data.</>
//         }
//       </div>
//     </form>
//   </>
// )}
//  </div>
//     </div>
//   );
// }
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { LogIn, UserPlus } from "lucide-react";

// export default function Login() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [signupForm, setSignupForm] = useState({
//     name: '', email: '', password: '', confirmPassword: '',
//     accountType: 'viewer', // default
//     rollNo: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [tab, setTab] = useState('login'); // 'login' | 'signup'
//   const { login, register, authenticate } = useAuth();
//   const navigate = useNavigate();

//   // ── Google OAuth callback handler ──
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const token    = params.get('token');
//     const userData = params.get('user');
//     const error    = params.get('error');

//     if (error) {
//       if (error === 'google_not_configured') {
//         toast.error('Google login is not configured. Use email/password instead.');
//       } else if (error === 'google_auth_failed') {
//         toast.error('Google login failed. Try again or use email/password.');
//       }
//     }

//     if (token && userData) {
//       try {
//         const user = JSON.parse(userData);
//         authenticate(token, user);
//         navigate('/');
//       } catch (err) {
//         console.error('Google auth callback parse failed', err);
//         toast.error('Google authentication failed.');
//       }
//     }

//     if (token || userData || error) {
//       window.history.replaceState({}, document.title, '/login');
//     }
//   }, [authenticate, navigate]);

//   // ── Sign In ──
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await login(form.email, form.password);
//       toast.success('Welcome back! 🎉');
//       navigate('/');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Invalid email or password');
//     } finally { setLoading(false); }
//   };

//   // ── Sign Up ──
//   const handleSignup = async (e) => {
//     e.preventDefault();
//     if (!signupForm.accountType) return toast.error('Please select account type!');
//     if (signupForm.password !== signupForm.confirmPassword) return toast.error('Passwords do not match!');
//     if (signupForm.password.length < 6) return toast.error('Password must be at least 6 characters');
//     if (signupForm.accountType === 'student' && !signupForm.rollNo) return toast.error('Please enter your roll number!');
//     setLoading(true);
//     try {
//       await register(signupForm.name, signupForm.email, signupForm.password, signupForm.rollNo);
//       toast.success('Account created! Welcome 🎉');
//       navigate('/');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Signup failed');
//     } finally { setLoading(false); }
//   };

//   // ── Google Login ──
//   const handleGoogleLogin = () => {
//     const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
//     window.location.href = `${backendUrl}/api/auth/google`;
//   };

//   // ── Fill demo credentials ──
//   const fillDemo = (role) => {
//     setTab('login');
//     if (role === 'admin') setForm({ email: 'admin@college.edu', password: 'admin123' });
//     else setForm({ email: 'viewer@college.edu', password: 'viewer123' });
//   };

//   // ── Google SVG icon ──
//   const GoogleIcon = () => (
//     <svg width="18" height="18" viewBox="0 0 48 48">
//       <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 32.8 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
//       <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
//       <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.3C9.6 35.6 16.3 44 24 44z"/>
//       <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.8l6.2 5.2C40.9 35.5 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"/>
//     </svg>
//   );

//   return (
//     <div className="auth-wrapper">
//       <div className="auth-card fade-in" style={{ maxWidth: 440 }}>

//         {/* ── Logo ── */}
//         <div className="text-center mb-4">
//           <div style={{
//             width: 56, height: 56, borderRadius: 16,
//             background: 'linear-gradient(135deg,#1a56db,#06b6d4)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             margin: '0 auto 1rem', fontSize: '1.5rem', color: '#fff'
//           }}>
//             <i className="bi bi-mortarboard-fill"></i>
//           </div>
//           <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.6rem', color: '#0f172a', marginBottom: 4 }}>
//             PlaceTrack
//           </h2>
//           <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
//             Student Placement Portal
//           </p>
//         </div>

//         {/* ── Tabs ── */}
//         <div className="d-flex mb-4" style={{ background: '#f1f5f9', borderRadius: 10, padding: 4 }}>
//           {['login', 'signup'].map(t => (
//             <button key={t} type="button" onClick={() => setTab(t)}
//               style={{
//                 flex: 1, border: 'none', borderRadius: 8, padding: '8px',
//                 fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
//                 background: tab === t ? '#fff' : 'transparent',
//                 color: tab === t ? '#1a56db' : '#64748b',
//                 boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
//                 transition: 'all 0.15s', textTransform: 'capitalize',
//               }}>
//               {t === 'login' ? (
//   <>
//     <LogIn size={16} />
//     Sign In
//   </>
// ) : (
//   <>
//     <UserPlus size={16} />
//     Sign Up
//   </>
// )}
//             </button>
//           ))}
//         </div>

//         {/* ══════════════════════════════
//             SIGN IN TAB
//         ══════════════════════════════ */}
//         {tab === 'login' && (
//           <>
//             {/* Google button */}
//             <button type="button" onClick={handleGoogleLogin}
//               style={{
//                 width: '100%', padding: '10px', borderRadius: 10, marginBottom: 16,
//                 border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
//                 fontWeight: 600, fontSize: '0.875rem', color: '#1e293b',
//                 transition: 'border-color 0.15s',
//               }}
//               onMouseOver={e => e.currentTarget.style.borderColor = '#1a56db'}
//               onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}
//             >
//               <GoogleIcon />
//               Continue with Google
//             </button>

//             {/* Divider */}
//             <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
//               <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
//               <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>or sign in with email</span>
//               <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
//             </div>

//             {/* Email login form */}
//             <form onSubmit={handleLogin}>
//               <div className="mb-3">
//                 <label className="form-label">Email address</label>
//                 <div style={{ position: 'relative' }}>
//                   <i className="bi bi-envelope" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.9rem' }}></i>
//                   <input type="email" className="form-control" style={{ paddingLeft: 36 }}
//                     placeholder="you@college.edu"
//                     value={form.email}
//                     onChange={e => setForm({ ...form, email: e.target.value })} required />
//                 </div>
//               </div>
//               <div className="mb-4">
//                 <label className="form-label">Password</label>
//                 <div style={{ position: 'relative' }}>
//                   <i className="bi bi-lock" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.9rem' }}></i>
//                   <input type="password" className="form-control" style={{ paddingLeft: 36 }}
//                     placeholder="••••••••"
//                     value={form.password}
//                     onChange={e => setForm({ ...form, password: e.target.value })} required />
//                 </div>
//               </div>
//               <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
//                 {loading
//                   ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</>
//                   : <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>}
//               </button>
//             </form>

//             {/* Demo accounts */}
//             <div className="mt-4 pt-3" style={{ borderTop: '1px solid #e2e8f0' }}>
//               <p style={{ fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
//                 Quick Demo Access
//               </p>
//               <div className="d-flex gap-2">
//                 <button onClick={() => fillDemo('admin')}
//                   className="btn btn-outline-primary btn-sm w-50"
//                   style={{ fontSize: '0.78rem', borderRadius: 8 }}>
//                   <i className="bi bi-shield-lock-fill me-1"></i>Admin
//                 </button>
//                 <button onClick={() => fillDemo('viewer')}
//                   className="btn btn-outline-secondary btn-sm w-50"
//                   style={{ fontSize: '0.78rem', borderRadius: 8 }}>
//                   <i className="bi bi-eye-fill me-1"></i>Viewer
//                 </button>
//               </div>
//               <p style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center', margin: '10px 0 0' }}>
//                 Admin: full access · Viewer: read only
//               </p>
//             </div>
//           </>
//         )}

//         {/* ══════════════════════════════
//             SIGN UP TAB
//         ══════════════════════════════ */}
//         {tab === 'signup' && (
//           <form onSubmit={handleSignup}>

//             {/* Full Name */}
//             <div className="mb-3">
//               <label className="form-label">Full Name</label>
//               <div style={{ position: 'relative' }}>
//                 <i className="bi bi-person" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
//                 <input type="text" className="form-control" style={{ paddingLeft: 36 }}
//                   placeholder="Aarav Sharma"
//                   value={signupForm.name}
//                   onChange={e => setSignupForm({ ...signupForm, name: e.target.value })} required />
//               </div>
//             </div>

//             {/* Email */}
//             <div className="mb-3">
//               <label className="form-label">Email address</label>
//               <div style={{ position: 'relative' }}>
//                 <i className="bi bi-envelope" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
//                 <input type="email" className="form-control" style={{ paddingLeft: 36 }}
//                   placeholder="you@college.edu"
//                   value={signupForm.email}
//                   onChange={e => setSignupForm({ ...signupForm, email: e.target.value })} required />
//               </div>
//             </div>

//             {/* Account type selector */}
//             <div className="mb-3">
//               <label className="form-label">I am a</label>
//               <div className="d-flex gap-2">
//                 {[
//                   { val: 'viewer',  icon: 'bi-eye-fill',        label: 'Viewer / Staff' },
//                   { val: 'student', icon: 'bi-mortarboard-fill', label: 'Student'        },
//                 ].map(opt => (
//                   <button type="button" key={opt.val}
//                     onClick={() => setSignupForm({ ...signupForm, accountType: opt.val })}
//                     style={{
//                       flex: 1, padding: '10px 8px', borderRadius: 10, cursor: 'pointer',
//                       fontWeight: 600, fontSize: '0.82rem', textAlign: 'center',
//                       border: signupForm.accountType === opt.val ? '2px solid #1a56db' : '1.5px solid #e2e8f0',
//                       background: signupForm.accountType === opt.val ? '#eff6ff' : '#fff',
//                       color: signupForm.accountType === opt.val ? '#1a56db' : '#64748b',
//                       transition: 'all 0.15s',
//                     }}>
//                     <i className={`bi ${opt.icon} d-block mb-1`} style={{ fontSize: '1.2rem' }}></i>
//                     {opt.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Roll No — only for students */}
//             {signupForm.accountType === 'student' && (
//               <div className="mb-3">
//                 <label className="form-label">Roll Number</label>
//                 <div style={{ position: 'relative' }}>
//                   <i className="bi bi-card-text" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
//                   <input className="form-control" style={{ paddingLeft: 36 }}
//                     placeholder="e.g. 4SF24CS021"
//                     value={signupForm.rollNo}
//                     onChange={e => setSignupForm({ ...signupForm, rollNo: e.target.value })} required />
//                 </div>
//                 <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>
//                   <i className="bi bi-info-circle me-1"></i>
//                   Your roll number links you to your student profile automatically
//                 </div>
//               </div>
//             )}

//             {/* Password */}
//             <div className="mb-3">
//               <label className="form-label">Password</label>
//               <div style={{ position: 'relative' }}>
//                 <i className="bi bi-lock" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
//                 <input type="password" className="form-control" style={{ paddingLeft: 36 }}
//                   placeholder="Min 6 characters"
//                   value={signupForm.password}
//                   onChange={e => setSignupForm({ ...signupForm, password: e.target.value })} required />
//               </div>
//             </div>

//             {/* Confirm Password */}
//             <div className="mb-3">
//               <label className="form-label">Confirm Password</label>
//               <div style={{ position: 'relative' }}>
//                 <i className="bi bi-lock-fill" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
//                 <input type="password" className="form-control" style={{ paddingLeft: 36 }}
//                   placeholder="Re-enter password"
//                   value={signupForm.confirmPassword}
//                   onChange={e => setSignupForm({ ...signupForm, confirmPassword: e.target.value })} required />
//               </div>
//               {signupForm.confirmPassword && (
//                 <div style={{ fontSize: '0.72rem', marginTop: 4, fontWeight: 600,
//                   color: signupForm.password === signupForm.confirmPassword ? '#059669' : '#dc2626' }}>
//                   {signupForm.password === signupForm.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
//                 </div>
//               )}
//             </div>

//             {/* Submit */}
//             <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
//               {loading
//                 ? <><span className="spinner-border spinner-border-sm me-2" />Creating account...</>
//                 : <><i className="bi bi-person-plus-fill me-2"></i>Create Account</>}
//             </button>

//             {/* Info note */}
//             <div style={{
//               marginTop: 12, padding: '10px 14px', borderRadius: 8, fontSize: '0.72rem',
//               background: signupForm.accountType === 'student' ? '#eff6ff' : '#f8fafc',
//               color: signupForm.accountType === 'student' ? '#1e40af' : '#94a3b8',
//             }}>
//               {signupForm.accountType === 'student'
//                 ? <><i className="bi bi-mortarboard me-1"></i> Your account will be auto-linked to your student profile using your roll number!</>
//                 : <><i className="bi bi-eye me-1"></i> Viewer accounts have read-only access to all placement data.</>
//               }
//             </div>

//           </form>
//         )}

//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    accountType: 'viewer', // default
    rollNo: '',
  });
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const { login, register, authenticate } = useAuth();
  const navigate = useNavigate();

  // ── Google OAuth callback handler ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token    = params.get('token');
    const userData = params.get('user');
    const error    = params.get('error');

    if (error) {
      if (error === 'google_not_configured') {
        toast.error('Google login is not configured. Use email/password instead.');
      } else if (error === 'google_auth_failed') {
        toast.error('Google login failed. Try again or use email/password.');
      }
    }

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        authenticate(token, user);
        navigate('/');
      } catch (err) {
        console.error('Google auth callback parse failed', err);
        toast.error('Google authentication failed.');
      }
    }

    if (token || userData || error) {
      window.history.replaceState({}, document.title, '/login');
    }
  }, [authenticate, navigate]);

  // ── Sign In ──
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  // ── Sign Up ──
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupForm.accountType) return toast.error('Please select account type!');
    if (signupForm.password !== signupForm.confirmPassword) return toast.error('Passwords do not match!');
    if (signupForm.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (signupForm.accountType === 'student' && !signupForm.rollNo) return toast.error('Please enter your roll number!');
    setLoading(true);
    try {
      await register(signupForm.name, signupForm.email, signupForm.password, signupForm.rollNo);
      toast.success('Account created! Welcome 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  // ── Google Login ──
  const handleGoogleLogin = () => {
    const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  // ── Fill demo credentials ──
  const fillDemo = (role) => {
    setTab('login');
    if (role === 'admin') setForm({ email: 'admin@college.edu', password: 'admin123' });
    else setForm({ email: 'viewer@college.edu', password: 'viewer123' });
  };

  // ── Google SVG icon ──
  const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 32.8 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.3C9.6 35.6 16.3 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.8l6.2 5.2C40.9 35.5 44 30.1 44 24c0-1.3-.1-2.7-.4-4z"/>
    </svg>
  );

  return (
    <div className="auth-wrapper">
      <div className="auth-card fade-in" style={{ maxWidth: 440 }}>

        {/* ── Logo ── */}
        <div className="text-center mb-4">
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg,#1a56db,#06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem', fontSize: '1.5rem', color: '#fff'
          }}>
            <i className="bi bi-mortarboard-fill"></i>
          </div>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.6rem', color: '#0f172a', marginBottom: 4 }}>
            PlaceTrack
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
            Student Placement Portal
          </p>
        </div>

        {/* ── Tabs ── */}
        <div className="d-flex mb-4" style={{ background: '#f1f5f9', borderRadius: 10, padding: 4 }}>
          {['login', 'signup'].map(t => (
            <button key={t} type="button" onClick={() => setTab(t)}
              style={{
                flex: 1, border: 'none', borderRadius: 8, padding: '8px',
                fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                background: tab === t ? '#fff' : 'transparent',
                color: tab === t ? '#1a56db' : '#64748b',
                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s', textTransform: 'capitalize',
              }}>
              {t === 'login' ? '🔑 Sign In' : '✨ Sign Up'}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════
            SIGN IN TAB
        ══════════════════════════════ */}
        {tab === 'login' && (
          <>
            {/* Google button */}
            <button type="button" onClick={handleGoogleLogin}
              style={{
                width: '100%', padding: '10px', borderRadius: 10, marginBottom: 16,
                border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                fontWeight: 600, fontSize: '0.875rem', color: '#1e293b',
                transition: 'border-color 0.15s',
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = '#1a56db'}
              onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>or sign in with email</span>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            </div>

            {/* Email login form */}
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <div style={{ position: 'relative' }}>
                  <i className="bi bi-envelope" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.9rem' }}></i>
                  <input type="email" className="form-control" style={{ paddingLeft: 36 }}
                    placeholder="you@college.edu"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <i className="bi bi-lock" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.9rem' }}></i>
                  <input type="password" className="form-control" style={{ paddingLeft: 36 }}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })} required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</>
                  : <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-4 pt-3" style={{ borderTop: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                Quick Demo Access
              </p>
              <div className="d-flex gap-2">
                <button onClick={() => fillDemo('admin')}
                  className="btn btn-outline-primary btn-sm w-50"
                  style={{ fontSize: '0.78rem', borderRadius: 8 }}>
                  <i className="bi bi-shield-lock-fill me-1"></i>Admin
                </button>
                <button onClick={() => fillDemo('viewer')}
                  className="btn btn-outline-secondary btn-sm w-50"
                  style={{ fontSize: '0.78rem', borderRadius: 8 }}>
                  <i className="bi bi-eye-fill me-1"></i>Viewer
                </button>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center', margin: '10px 0 0' }}>
                Admin: full access · Viewer: read only
              </p>
            </div>
          </>
        )}

        {/* ══════════════════════════════
            SIGN UP TAB
        ══════════════════════════════ */}
        {tab === 'signup' && (
          <form onSubmit={handleSignup}>

            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <i className="bi bi-person" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                <input type="text" className="form-control" style={{ paddingLeft: 36 }}
                  placeholder="Aarav Sharma"
                  value={signupForm.name}
                  onChange={e => setSignupForm({ ...signupForm, name: e.target.value })} required />
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <div style={{ position: 'relative' }}>
                <i className="bi bi-envelope" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                <input type="email" className="form-control" style={{ paddingLeft: 36 }}
                  placeholder="you@college.edu"
                  value={signupForm.email}
                  onChange={e => setSignupForm({ ...signupForm, email: e.target.value })} required />
              </div>
            </div>

            {/* Account type selector */}
            <div className="mb-3">
              <label className="form-label">I am a</label>
              <div className="d-flex gap-2">
                {[
                  { val: 'viewer',  icon: 'bi-eye-fill',        label: 'Viewer / Staff' },
                  { val: 'student', icon: 'bi-mortarboard-fill', label: 'Student'        },
                ].map(opt => (
                  <button type="button" key={opt.val}
                    onClick={() => setSignupForm({ ...signupForm, accountType: opt.val })}
                    style={{
                      flex: 1, padding: '10px 8px', borderRadius: 10, cursor: 'pointer',
                      fontWeight: 600, fontSize: '0.82rem', textAlign: 'center',
                      border: signupForm.accountType === opt.val ? '2px solid #1a56db' : '1.5px solid #e2e8f0',
                      background: signupForm.accountType === opt.val ? '#eff6ff' : '#fff',
                      color: signupForm.accountType === opt.val ? '#1a56db' : '#64748b',
                      transition: 'all 0.15s',
                    }}>
                    <i className={`bi ${opt.icon} d-block mb-1`} style={{ fontSize: '1.2rem' }}></i>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Roll No — only for students */}
            {signupForm.accountType === 'student' && (
              <div className="mb-3">
                <label className="form-label">Roll Number</label>
                <div style={{ position: 'relative' }}>
                  <i className="bi bi-card-text" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                  <input className="form-control" style={{ paddingLeft: 36 }}
                    placeholder="e.g. 4SF24CS021"
                    value={signupForm.rollNo}
                    onChange={e => setSignupForm({ ...signupForm, rollNo: e.target.value })} required />
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>
                  <i className="bi bi-info-circle me-1"></i>
                  Your roll number links you to your student profile automatically
                </div>
              </div>
            )}

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <i className="bi bi-lock" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                <input type="password" className="form-control" style={{ paddingLeft: 36 }}
                  placeholder="Min 6 characters"
                  value={signupForm.password}
                  onChange={e => setSignupForm({ ...signupForm, password: e.target.value })} required />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <i className="bi bi-lock-fill" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                <input type="password" className="form-control" style={{ paddingLeft: 36 }}
                  placeholder="Re-enter password"
                  value={signupForm.confirmPassword}
                  onChange={e => setSignupForm({ ...signupForm, confirmPassword: e.target.value })} required />
              </div>
              {signupForm.confirmPassword && (
                <div style={{ fontSize: '0.72rem', marginTop: 4, fontWeight: 600,
                  color: signupForm.password === signupForm.confirmPassword ? '#059669' : '#dc2626' }}>
                  {signupForm.password === signupForm.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </div>
              )}
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2" />Creating account...</>
                : <><i className="bi bi-person-plus-fill me-2"></i>Create Account</>}
            </button>

            {/* Info note */}
            <div style={{
              marginTop: 12, padding: '10px 14px', borderRadius: 8, fontSize: '0.72rem',
              background: signupForm.accountType === 'student' ? '#eff6ff' : '#f8fafc',
              color: signupForm.accountType === 'student' ? '#1e40af' : '#94a3b8',
            }}>
              {signupForm.accountType === 'student'
                ? <><i className="bi bi-mortarboard me-1"></i> Your account will be auto-linked to your student profile using your roll number!</>
                : <><i className="bi bi-eye me-1"></i> Viewer accounts have read-only access to all placement data.</>
              }
            </div>

          </form>
        )}

      </div>
    </div>
  );
}