import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './context/AuthContext';
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

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', background: '#f1f5f9' }}>
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} />
        <p className="text-muted">Loading PlaceTrack...</p>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
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
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          theme="light"
          toastStyle={{ borderRadius: 12, fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.875rem' }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
