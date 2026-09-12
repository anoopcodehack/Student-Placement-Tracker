

// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { LogIn, UserPlus } from 'lucide-react';
// //


// export default function Login() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [signupForm, setSignupForm] = useState({
//     name: '', email: '', password: '', confirmPassword: '',
//     accountType: 'viewer',
//     rollNo: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [tab, setTab] = useState('login');
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

//   const handleGoogleLogin = () => {
//     const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
//     window.location.href = `${backendUrl}/api/auth/google`;
//   };

//   const fillDemo = (role) => {
//     setTab('login');
//     if (role === 'admin') setForm({ email: 'admin@college.edu', password: 'admin123' });
//     else setForm({ email: 'viewer@college.edu', password: 'viewer123' });
//   };

//   const GoogleIcon = () => (
//     <svg width="18" height="18" viewBox="0 0 48 48">
//       <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 32.8 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z" />
//       <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
//       <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.3C9.6 35.6 16.3 44 24 44z" />
//       <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.8l6.2 5.2C40.9 35.5 44 30.1 44 24c0-1.3-.1-2.7-.4-4z" />
//     </svg>
//   );

//   return (
//   <div
//   className={`auth-wrapper ${tab === "signup" ? "swap" : ""}`}
//   style={{
//     minHeight: "100vh",
//     display: "grid",
//     gridTemplateColumns: "1.2fr 0.8fr",
//     background: "#0f172a",
//   }}
// >

//   {/* LEFT SIDE */}
//   <div
//   className="left-panel"
//     style={{
//       display: "flex",
//       flexDirection: "column",
//       justifyContent: "center",
//       padding: "70px",
//       color: "white",
//       background:
//         "linear-gradient(135deg,#0f172a 0%,#1e3a8a 60%,#2563eb 100%)",
//     }}
//   >

//     <div
//       style={{
//         width: 70,
//         height: 70,
//         borderRadius: 20,
//         background: "rgba(255,255,255,.12)",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         fontSize: 30,
//         marginBottom: 30
//       }}
//     >
//       🎓
//     </div>

//     <h1
//       style={{
//         fontSize: "3.2rem",
//         fontWeight: 800,
//         marginBottom: 15,
//         fontFamily: "Syne"
//       }}
//     >
//       PlaceTrack
//     </h1>

//     <p
//       style={{
//         fontSize: 20,
//         color: "#cbd5e1",
//         maxWidth: 520,
//         lineHeight: 1.7
//       }}
//     >
//       Smart Placement Management Portal for Colleges.
//       Manage students, companies, applications,
//       placement drives and analytics from one dashboard.
//     </p>

//     <div style={{ marginTop: 50 }}>

//       <div style={{ marginBottom: 18,fontSize:18 }}>
//         ✅ Company Drive Management
//       </div>

//       <div style={{ marginBottom: 18,fontSize:18 }}>
//         ✅ Student Performance Analytics
//       </div>

//       <div style={{ marginBottom: 18,fontSize:18 }}>
//         ✅ Resume & Placement Tracking
//       </div>

//       <div style={{ marginBottom: 18,fontSize:18 }}>
//         ✅ Real-time Dashboard
//       </div>

//     </div>

//   </div>

//   {/* RIGHT SIDE */}
//   <div
//   className="right-panel"
//     style={{
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       background: "#f8fafc"
//     }}
//   >

//       <div
//         className="auth-card fade-in"
//         style={{
//           width: 450,
//           borderRadius: 24,
//           padding: 40,
//           background: "#fff",
//           boxShadow: "0 25px 60px rgba(0,0,0,.15)"
//         }}
//       >

       
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
//               <div className="d-flex align-items-center justify-content-center gap-2">
//                 {t === 'login' ? <LogIn size={16} /> : <UserPlus size={16} />}
//                 {t === 'login' ? 'Sign In' : 'Sign Up'}
//               </div>
//             </button>
//           ))}
//         </div>

//         {tab === 'login' ? (
//           <>
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

//             <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
//               <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
//               <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>or sign in with email</span>
//               <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
//             </div>

//             <form onSubmit={handleLogin}>
//               <div className="mb-3">
//                 <label className="form-label">Email address</label>
//                 <div style={{ position: 'relative' }}>
//                   <i className="bi bi-envelope" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.9rem' }}></i>
//                   <input type="email" className="form-control" style={{ paddingLeft: 36 }}
//                     placeholder="you@college.edu"
//                     value={form.email}
//                     autoComplete="off"
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
//                     autoComplete="new-password"
//                     onChange={e => setForm({ ...form, password: e.target.value })} required />
//                 </div>
//               </div>
//               <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
//                 {loading
//                   ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</>
//                   : <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>}
//               </button>
//             </form>

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
//             </div>
//           </>
//         ) : (
//           <form onSubmit={handleSignup}>
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

//             <div className="mb-3">
//               <label className="form-label">I am a</label>
//               <div className="d-flex gap-2">
//                 {[
//                   { val: 'viewer', icon: 'bi-eye-fill', label: 'Viewer / Staff' },
//                   { val: 'student', icon: 'bi-mortarboard-fill', label: 'Student' },
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
//               </div>
//             )}

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
//                 <div style={{
//                   fontSize: '0.72rem', marginTop: 4, fontWeight: 600,
//                   color: signupForm.password === signupForm.confirmPassword ? '#059669' : '#dc2626'
//                 }}>
//                   {signupForm.password === signupForm.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
//                 </div>
//               )}
//             </div>

//             <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
//               {loading
//                 ? <><span className="spinner-border spinner-border-sm me-2" />Creating account...</>
//                 : <><i className="bi bi-person-plus-fill me-2"></i>Create Account</>}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/runtimeConfig';
import {
  Mail, Lock, Eye, EyeOff, User, Hash, ShieldCheck, GraduationCap,
  CheckCircle2, XCircle, Loader2, ArrowLeft, Target, FileSearch, Mic,
  Bell, BarChart3, Send, Info,
} from 'lucide-react';

/* ============================================================
   Assets — same crest + campus photography as the homepage
   ============================================================ */
const AERIAL_IMG = "/collegeaerial.webp";
const CREST_IMG = "/Sayhadri-Logo-02.jpg";

/* ============================================================
   Design tokens — shared with the PlaceTrack landing page
   ============================================================ */
const C = {
  paper: "#F1F3EA",
  paperDeep: "#E6EADA",
  ink: "#131A10",
  greenDeep: "#153F28",
  green: "#1F5C3A",
  clay: "#A8462B",
  text: "#1B2318",
  muted: "#5C664F",
  onDark: "#F1F3EA",
  mutedOnDark: "#A6B296",
  hairline: "rgba(27,35,24,0.14)",
  hairlineDark: "rgba(241,243,234,0.16)",
  danger: "#B3402A",
  success: "#1F5C3A",
};
const display = "'Fraunces', serif";
const body = "'Work Sans', sans-serif";

function goTo(path) {
  if (typeof window !== "undefined") window.location.href = path;
}

function getPostLoginPath(user) {
  if (user?.isStudent === true) return '/profile';
  return '/';
}

function useToastStack() {
  const [items, setItems] = useState([]);
  const push = (type, message) => {
    const id = Math.random().toString(36).slice(2);
    setItems((t) => [...t, { id, type, message }]);
    setTimeout(() => setItems((t) => t.filter((x) => x.id !== id)), 3400);
  };
  return [items, { success: (m) => push('success', m), error: (m) => push('error', m) }];
}
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 32.8 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.3C9.6 35.6 16.3 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.8l6.2 5.2C40.9 35.5 44 30.1 44 24c0-1.3-.1-2.7-.4-4z" />
  </svg>
);

const FEATURES = [
  { Icon: Target, title: 'Eligibility Engine', desc: 'Auto-filters students by CGPA, branch & backlogs' },
  { Icon: FileSearch, title: 'AI ATS Resume Scorer', desc: 'Match your resume against any JD instantly' },
  { Icon: Mic, title: 'AI Mock Interview', desc: 'Practice with real company-specific questions' },
  { Icon: Bell, title: 'Real-time Alerts', desc: 'Socket.IO notifications for every drive update' },
  { Icon: BarChart3, title: '7-Chart Analytics', desc: 'Branch-wise stats, packages, trends & more' },
  { Icon: Send, title: 'Email Automation', desc: "Auto-emails when you're eligible or placed" },
];

const STATS = [
  { v: '78', l: 'Placed' },
  { v: '63%', l: 'Rate' },
  { v: '₹43L', l: 'Highest' },
  { v: '14', l: 'Companies' },
];

/* ============================================================
   Small building blocks
   ============================================================ */
function Field({ icon: Icon, children }) {
  return (
    <div style={{ position: 'relative' }}>
      <Icon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '12px 14px 12px 40px', borderRadius: 6,
  border: `1.5px solid ${C.hairline}`, background: '#fff',
  fontFamily: body, fontSize: '0.9rem', color: C.text, outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

function TextInput(props) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      className={`pt-text-input ${props.className || ''}`}
      onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
      style={{
        ...inputStyle,
        ...(props.style || {}),
        borderColor: focused ? C.green : C.hairline,
        boxShadow: focused ? `0 0 0 3px ${C.green}1a` : 'none',
      }}
    />
  );
}

function ToastStack({ items }) {
  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((t) => (
        <div key={t.id} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: C.ink, color: '#fff', padding: '12px 18px', borderRadius: 6,
          fontFamily: body, fontSize: '0.85rem', fontWeight: 500,
          boxShadow: '0 12px 28px rgba(19,26,16,0.28)',
          borderLeft: `3px solid ${t.type === 'error' ? C.danger : '#7FDCA4'}`,
          animation: 'pt-toast-in 0.3s cubic-bezier(0.16,1,0.3,1)',
          maxWidth: 320,
        }}>
          {t.type === 'error' ? <XCircle size={16} color="#E08D77" /> : <CheckCircle2 size={16} color="#7FDCA4" />}
          {t.message}
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   Page
   ============================================================ */
export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    accountType: 'viewer', rollNo: '',
  });
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('login');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login, register, authenticate } = useAuth();
  const navigate = useNavigate();
  const [toasts, toast] = useToastStack();

  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userData = params.get('user');
    const error = params.get('error');
    if (error) {
      if (error === 'google_not_configured') toast.error('Google login not configured. Use email/password.');
      else if (error === 'google_auth_failed') toast.error('Google login failed. Try again.');
    }
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        authenticate(token, user);
        navigate(getPostLoginPath(user), { replace: true });
      } catch { toast.error('Google authentication failed.'); }
    }
    if (token || userData || error) window.history.replaceState({}, document.title, '/login');
   
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(getPostLoginPath(user), { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) return toast.error('Passwords do not match!');
    if (signupForm.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (signupForm.accountType === 'student' && !signupForm.rollNo) return toast.error('Please enter your roll number!');
    setLoading(true);
    try {
      const user = await register(signupForm.name, signupForm.email, signupForm.password, signupForm.rollNo);
      toast.success('Account created! Welcome.');
      navigate(getPostLoginPath(user), { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  const handleGoogleLogin = () => {
    window.location.assign(`${API_BASE_URL}/api/auth/google`);
  };

  const fillDemo = (role) => {
    setTab('login');
    if (role === 'admin') setForm({ email: 'admin@college.edu', password: 'admin123' });
    else setForm({ email: 'viewer@college.edu', password: 'viewer123' });
  };

  const passMatch = signupForm.confirmPassword && signupForm.password === signupForm.confirmPassword;
  const passMismatch = signupForm.confirmPassword && signupForm.password !== signupForm.confirmPassword;

  return (
    <div style={{
      minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.05fr 1fr',
      fontFamily: body, background: C.paper, color: C.text,
    }} className="pt-login-grid">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Work+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes pt-livedot { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
        @keyframes pt-toast-in { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pt-spin { to { transform: rotate(360deg); } }
        .pt-spin { animation: pt-spin 0.8s linear infinite; }
        .pt-tab { transition: all 0.2s ease; }
        .pt-toggle-eye { background: none; border: none; cursor: pointer; color: ${C.muted}; padding: 4px; display: flex; }
        .pt-toggle-eye:hover { color: ${C.text}; }
        .pt-demo-btn { transition: all 0.15s ease; }
        .pt-demo-btn:hover { transform: translateY(-1px); }
        .pt-account-opt { transition: all 0.15s ease; cursor: pointer; }
        .pt-account-opt:hover { transform: translateY(-1px); }
        .pt-google-btn { transition: all 0.2s ease; }
        .pt-google-btn:hover { border-color: ${C.green} !important; box-shadow: 0 4px 14px rgba(31,92,58,0.12); }
        .pt-submit-btn { transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease; }
        .pt-submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 22px rgba(31,92,58,0.2); }
        .pt-feature-row:hover { background: rgba(255,255,255,0.05); }

        .pt-mobile-brand-bar { display: none; }
        .pt-form-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem clamp(1.25rem, 4vw, 3rem);
          background: ${C.paperDeep};
          min-height: 100vh;
        }
        .pt-form-card {
          width: 100%;
          max-width: 440px;
          background: #fff;
          border: 1px solid ${C.hairline};
          border-radius: 14px;
          padding: clamp(1.5rem, 4vw, 2.25rem);
          box-shadow: 0 20px 50px rgba(19, 26, 16, 0.08);
        }
        .pt-demo-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .pt-account-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        @media (max-width: 900px) {
          .pt-login-grid { grid-template-columns: 1fr !important; min-height: 100vh; }
          .pt-left-panel { display: none !important; }
          .pt-mobile-brand-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.25rem;
            padding-bottom: 0.85rem;
            border-bottom: 1px solid ${C.hairline};
          }
          .pt-mobile-back-link {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: ${C.green};
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            padding: 4px 6px 4px 0;
          }
          .pt-mobile-live-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #dcfce7;
            color: #166534;
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 0.04em;
            text-transform: uppercase;
          }
          .pt-mobile-live-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #16a34a;
            display: inline-block;
            animation: pt-livedot 1.6s infinite;
          }
        }

        @media (max-width: 600px) {
          .pt-form-wrapper {
            padding: 1.25rem 0.85rem !important;
            align-items: flex-start !important;
          }
          .pt-form-card {
            padding: 1.35rem 1.1rem !important;
            border-radius: 14px !important;
            box-shadow: 0 10px 30px rgba(19, 26, 16, 0.06) !important;
          }
          .pt-text-input {
            font-size: 16px !important; /* Prevents auto-zoom in iOS Safari */
            padding-top: 13px !important;
            padding-bottom: 13px !important;
            min-height: 48px !important;
          }
          .pt-google-btn {
            min-height: 48px !important;
            font-size: 0.9rem !important;
          }
          .pt-submit-btn {
            min-height: 48px !important;
            font-size: 0.95rem !important;
          }
          .pt-demo-btn {
            min-height: 44px !important;
            padding: 8px 6px !important;
          }
          .pt-tab {
            min-height: 44px !important;
            padding: 11px 0 !important;
            font-size: 0.9rem !important;
          }
        }

        @media (max-width: 380px) {
          .pt-form-wrapper {
            padding: 0.75rem 0.5rem !important;
          }
          .pt-form-card {
            padding: 1.1rem 0.85rem !important;
            border-radius: 12px !important;
          }
          .pt-demo-grid {
            grid-template-columns: 1fr !important;
          }
          .pt-account-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <ToastStack items={toasts} />

      {/* ============ LEFT — BRAND PANEL ============ */}
      <div className="pt-left-panel" style={{
        position: 'relative', overflow: 'hidden',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateX(0)' : 'translateX(-24px)',
        transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <img src={AERIAL_IMG} alt="Sahyadri College campus" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.9)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(165deg, rgba(19,26,16,0.72) 0%, ${C.greenDeep}dd 55%, rgba(19,26,16,0.92) 100%)`,
        }} />

        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', padding: 'clamp(2rem,4vw,3.25rem)' }}>
          {/* back link */}
          <div onClick={() => goTo('/')} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(241,243,234,0.75)',
            fontSize: '0.82rem', cursor: 'pointer', width: 'fit-content', marginBottom: 'clamp(1.5rem,4vh,3rem)',
          }}>
            <ArrowLeft size={15} /> Back to PlaceTrack
          </div>

          {/* crest + wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.75rem' }}>
            <img src={CREST_IMG} alt="Sahyadri College logo" style={{ height: 46, width: 'auto', maxWidth: 220, objectFit: 'contain', background: '#fff', borderRadius: 3, padding: 3 }} />
            <div>
              <div style={{ fontFamily: display, fontWeight: 600, fontSize: '1.2rem', color: '#fff', lineHeight: 1 }}>PlaceTrack</div>
              <div style={{ fontSize: '0.62rem', color: 'rgba(241,243,234,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 3 }}>Sahyadri College</div>
            </div>
          </div>

          {/* live badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7FDCA4', display: 'inline-block', animation: 'pt-livedot 1.6s infinite' }} />
            <span style={{ color: 'rgba(241,243,234,0.75)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>2024–25 Placement Season, Live</span>
          </div>

          {/* headline */}
          <h1 style={{
            fontFamily: display, fontWeight: 600, color: '#fff', fontSize: 'clamp(1.9rem,2.8vw,2.5rem)',
            lineHeight: 1.12, marginBottom: '0.85rem', maxWidth: 420, letterSpacing: '-0.01em',
          }}>
            Sahyadri's Smartest<br />Placement Portal
          </h1>
          <p style={{ color: 'rgba(241,243,234,0.72)', fontSize: '0.92rem', lineHeight: 1.7, maxWidth: 380, marginBottom: '2rem' }}>
            Digitizing campus placements with AI-powered tools, real-time notifications & smart analytics.
          </p>

          {/* stats */}
          <div style={{ display: 'flex', gap: 10, marginBottom: '2rem' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ flex: 1, borderTop: '1px solid rgba(241,243,234,0.18)', paddingTop: 10 }}>
                <div style={{ fontFamily: display, fontWeight: 600, fontSize: '1.15rem', color: '#fff' }}>{s.v}</div>
                <div style={{ fontSize: '0.62rem', color: 'rgba(241,243,234,0.55)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* features */}
          <div style={{ flex: 1 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="pt-feature-row" style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px',
                borderRadius: 6,
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(241,243,234,0.08)', border: '1px solid rgba(241,243,234,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <f.Icon size={14} color="#9FE6BE" strokeWidth={1.75} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>{f.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(241,243,234,0.55)' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* credit */}
          <div style={{ fontSize: '0.72rem', color: 'rgba(241,243,234,0.42)', marginTop: '1.5rem' }}>
            Built by <span style={{ color: 'rgba(241,243,234,0.75)', fontWeight: 600 }}>Anoop A</span> · Sahyadri College of Engineering &amp; Management
          </div>
        </div>
      </div>

      {/* ============ RIGHT — FORM PANEL ============ */}
      <div className="pt-form-wrapper" style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(16px)',
        transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s',
      }}>
        <div className="pt-form-card">

          {/* mobile back & live pill header */}
          <div className="pt-mobile-brand-bar">
            <div onClick={() => goTo('/')} className="pt-mobile-back-link">
              <ArrowLeft size={14} /> Back to portal
            </div>
            <div className="pt-mobile-live-badge">
              <span className="pt-mobile-live-dot" />
              <span>2024–25 Live</span>
            </div>
          </div>

          {/* header */}
          <div style={{ marginBottom: '1.75rem' }}>
            <img src={CREST_IMG} alt="Sahyadri College logo" style={{ width: 180, maxWidth: '100%', height: 56, objectFit: 'contain', objectPosition: 'left center', background: '#fff', marginBottom: 18 }} />
            <h2 style={{ fontFamily: display, fontWeight: 600, fontSize: '1.7rem', color: C.text, marginBottom: 6 }}>
              {tab === 'login' ? 'Welcome back' : 'Join PlaceTrack'}
            </h2>
            <p style={{ color: C.muted, fontSize: '0.88rem', margin: 0 }}>
              {tab === 'login' ? 'Sign in to your placement portal' : 'Create your account to get started'}
            </p>
          </div>

          {/* tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem', borderBottom: `1px solid ${C.hairline}` }}>
            {['login', 'signup'].map((t) => (
              <button key={t} type="button" onClick={() => setTab(t)} className="pt-tab" style={{
                flex: 1, border: 'none', background: 'none', cursor: 'pointer',
                padding: '10px 0', fontFamily: body, fontWeight: 600, fontSize: '0.85rem',
                color: tab === t ? C.text : C.muted,
                borderBottom: tab === t ? `2px solid ${C.green}` : '2px solid transparent',
                marginBottom: -1,
              }}>
                {t === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* ---------------- LOGIN ---------------- */}
          {tab === 'login' && (
            <>
              <button type="button" onClick={handleGoogleLogin} className="pt-google-btn" style={{
                width: '100%', padding: '11px', borderRadius: 6, marginBottom: '1rem',
                border: `1.5px solid ${C.hairline}`, background: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                fontFamily: body, fontWeight: 600, fontSize: '0.87rem', color: C.text,
              }}>
                <GoogleIcon /> Continue with Google
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.1rem' }}>
                <div style={{ flex: 1, height: 1, background: C.hairline }} />
                <span style={{ fontSize: '0.68rem', color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>or</span>
                <div style={{ flex: 1, height: 1, background: C.hairline }} />
              </div>

              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '0.9rem' }}>
                  <label htmlFor="login-email" style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text, display: 'block', marginBottom: 6 }}>Email address</label>
                  <Field icon={Mail}>
                    <TextInput id="login-email" type="email" placeholder="you@college.edu" value={form.email}
                      autoComplete="email"
                      onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </Field>
                </div>

                <div style={{ marginBottom: '1.3rem' }}>
                  <label htmlFor="login-password" style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text, display: 'block', marginBottom: 6 }}>Password</label>
                  <Field icon={Lock}>
                    <TextInput id="login-password" type={showLoginPass ? 'text' : 'password'} placeholder="••••••••" value={form.password}
                      style={{ paddingRight: 40 }}
                      autoComplete="current-password"
                      onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                    <button type="button" className="pt-toggle-eye" onClick={() => setShowLoginPass(!showLoginPass)}
                      aria-label={showLoginPass ? 'Hide password' : 'Show password'}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>
                      {showLoginPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </Field>
                </div>

                <button type="submit" disabled={loading} className="pt-submit-btn" style={{
                  width: '100%', padding: '12px', borderRadius: 6, border: 'none',
                  background: C.green, color: '#fff', fontFamily: body, fontWeight: 600, fontSize: '0.9rem',
                  cursor: loading ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  opacity: loading ? 0.75 : 1, transition: 'opacity 0.2s',
                }}>
                  {loading ? <Loader2 size={16} className="pt-spin" /> : null}
                  {loading ? 'Signing in…' : 'Sign In to PlaceTrack'}
                </button>
              </form>

              <div style={{ marginTop: '1.4rem', paddingTop: '1.4rem', borderTop: `1px solid ${C.hairline}` }}>
                <p style={{ fontSize: '0.68rem', color: C.muted, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, fontWeight: 600 }}>
                  Quick demo access
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <button type="button" onClick={() => fillDemo('admin')} className="pt-demo-btn" style={{
                    padding: '9px', borderRadius: 6, border: `1.5px solid ${C.green}55`, background: `${C.green}0f`,
                    color: C.green, fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                    <ShieldCheck size={14} /> Admin Demo
                  </button>
                  <button type="button" onClick={() => fillDemo('viewer')} className="pt-demo-btn" style={{
                    padding: '9px', borderRadius: 6, border: `1.5px solid ${C.hairline}`, background: C.paperDeep,
                    color: C.muted, fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                    <Eye size={14} /> Viewer Demo
                  </button>
                </div>
                <p style={{ fontSize: '0.7rem', color: C.muted, textAlign: 'center', marginTop: 12, marginBottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  <GraduationCap size={13} /> Student? Sign up with your roll number
                </p>
              </div>
            </>
          )}

          {/* ---------------- SIGNUP ---------------- */}
          {tab === 'signup' && (
            <form onSubmit={handleSignup}>
              <div style={{ marginBottom: '0.9rem' }}>
                <label htmlFor="signup-name" style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text, display: 'block', marginBottom: 6 }}>Full name</label>
                <Field icon={User}>
                  <TextInput id="signup-name" type="text" placeholder="Aarav Sharma" value={signupForm.name}
                    autoComplete="name"
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })} required />
                </Field>
              </div>

              <div style={{ marginBottom: '0.9rem' }}>
                <label htmlFor="signup-email" style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text, display: 'block', marginBottom: 6 }}>Email address</label>
                <Field icon={Mail}>
                  <TextInput id="signup-email" type="email" placeholder="you@college.edu" value={signupForm.email}
                    autoComplete="email"
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })} required />
                </Field>
              </div>

              <div style={{ marginBottom: '0.9rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text, display: 'block', marginBottom: 6 }}>I am a</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { val: 'viewer', Icon: Eye, label: 'Viewer / Staff', desc: 'Read-only access' },
                    { val: 'student', Icon: GraduationCap, label: 'Student', desc: 'Full profile access' },
                  ].map((opt) => (
                    <div key={opt.val} className="pt-account-opt" role="radio" tabIndex={0}
                      aria-checked={signupForm.accountType === opt.val}
                      onClick={() => setSignupForm({ ...signupForm, accountType: opt.val })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSignupForm({ ...signupForm, accountType: opt.val });
                        }
                      }}
                      style={{
                        padding: '10px 8px', borderRadius: 6, textAlign: 'center',
                        border: signupForm.accountType === opt.val ? `1.5px solid ${C.green}` : `1.5px solid ${C.hairline}`,
                        background: signupForm.accountType === opt.val ? `${C.green}0f` : '#fff',
                      }}>
                      <opt.Icon size={17} color={signupForm.accountType === opt.val ? C.green : C.muted} style={{ display: 'block', margin: '0 auto 5px' }} />
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: signupForm.accountType === opt.val ? C.green : C.text }}>{opt.label}</div>
                      <div style={{ fontSize: '0.65rem', color: C.muted, marginTop: 1 }}>{opt.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {signupForm.accountType === 'student' && (
                <div style={{ marginBottom: '0.9rem' }}>
                  <label htmlFor="signup-rollno" style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text, display: 'block', marginBottom: 6 }}>Roll number</label>
                  <Field icon={Hash}>
                    <TextInput id="signup-rollno" placeholder="e.g. 4SF24CS021" value={signupForm.rollNo}
                      autoComplete="off"
                      onChange={(e) => setSignupForm({ ...signupForm, rollNo: e.target.value })} required />
                  </Field>
                  <div style={{ fontSize: '0.7rem', color: C.muted, marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Info size={11} /> Must match your roll number in the system
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '0.9rem' }}>
                <label htmlFor="signup-password" style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text, display: 'block', marginBottom: 6 }}>Password</label>
                <Field icon={Lock}>
                  <TextInput id="signup-password" type={showSignupPass ? 'text' : 'password'} placeholder="Min 6 characters" value={signupForm.password}
                    style={{ paddingRight: 40 }}
                    autoComplete="new-password"
                    minLength={6}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })} required />
                  <button type="button" className="pt-toggle-eye" onClick={() => setShowSignupPass(!showSignupPass)}
                    aria-label={showSignupPass ? 'Hide password' : 'Show password'}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>
                    {showSignupPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </Field>
              </div>

              <div style={{ marginBottom: '1.3rem' }}>
                <label htmlFor="signup-confirm-password" style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text, display: 'block', marginBottom: 6 }}>Confirm password</label>
                <Field icon={Lock}>
                  <TextInput id="signup-confirm-password" type={showConfirmPass ? 'text' : 'password'} placeholder="Re-enter password" value={signupForm.confirmPassword}
                    style={{ paddingRight: 40, ...(passMismatch ? { borderColor: C.danger } : {}) }}
                    autoComplete="new-password"
                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })} required />
                  <button type="button" className="pt-toggle-eye" onClick={() => setShowConfirmPass(!showConfirmPass)}
                    aria-label={showConfirmPass ? 'Hide password' : 'Show password'}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>
                    {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </Field>
                {signupForm.confirmPassword && (
                  <div style={{
                    fontSize: '0.72rem', marginTop: 6, fontWeight: 600,
                    color: passMatch ? C.success : C.danger,
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    {passMatch ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    {passMatch ? 'Passwords match' : 'Passwords do not match'}
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading} className="pt-submit-btn" style={{
                width: '100%', padding: '12px', borderRadius: 6, border: 'none',
                background: C.green, color: '#fff', fontFamily: body, fontWeight: 600, fontSize: '0.9rem',
                cursor: loading ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                opacity: loading ? 0.75 : 1, transition: 'opacity 0.2s',
              }}>
                {loading ? <Loader2 size={16} className="pt-spin" /> : null}
                {loading ? 'Creating account…' : 'Create Account'}
              </button>

              <p style={{ fontSize: '0.78rem', color: C.muted, textAlign: 'center', marginTop: '1.1rem', marginBottom: 0 }}>
                Already have an account?{' '}
                <button type="button" onClick={() => setTab('login')} style={{
                  background: 'none', border: 'none', color: C.green, fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: '0.78rem',
                }}>Sign In</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
