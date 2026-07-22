
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationProvider';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentDetail from './pages/StudentDetail';
import AddStudent from './pages/AddStudent';
import Companies from './pages/Companies';
import AddCompany from './pages/AddCompany';
import Placements from './pages/Placements';
import AddPlacement from './pages/AddPlacement';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Interviews from './pages/Interviews';
import CalendarPage from './pages/CalendarPage';
import Contact from './pages/Contact';
import Notifications from './pages/Notifications';
import LandingPage from './pages/LandingPage';


const ThemedToast = () => {
  const { isDark } = useTheme();
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      theme={isDark ? 'dark' : 'light'}
      toastStyle={{
        borderRadius: 12,
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        fontSize: '0.875rem',
      }}
    />
  );
};

// ── Routes INSIDE AuthProvider so useAuth works ──
const AppRoutes = () => {
  const { user, loading } = useAuth();

  // Show loader while checking auth
  if (loading) return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0f1e',
      flexDirection: 'column',
      gap: 16
    }}>
      <div className="spinner-border text-primary"
        style={{ width: '3rem', height: '3rem' }} />
      <p style={{ color: '#94a3b8', margin: 0 }}>Loading PlaceTrack...</p>
    </div>
  );

  return (
    <Routes>

      {/* ── / → Landing if not logged in, Dashboard if logged in ── */}
      <Route
        path="/"
        element={user ? <Layout /> : <LandingPage />}
      >
        {/* These only render when user is logged in (Layout renders Outlet) */}
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="students/:id" element={<StudentDetail />} />
        <Route path="students/add" element={<AddStudent />} />
        <Route path="students/edit/:id" element={<AddStudent />} />
        <Route path="companies" element={<Companies />} />
        <Route path="companies/add" element={<AddCompany />} />
        <Route path="placements" element={<Placements />} />
        <Route path="placements/add" element={<AddPlacement />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="interviews" element={<Interviews />} />
        <Route path="contact" element={<Contact />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* ── /login → Login if not logged in, redirect home if logged in ── */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />

      {/* ── 404 ── */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

// ── Root App — providers wrap everything ──
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <AppRoutes />
            <ThemedToast />
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}