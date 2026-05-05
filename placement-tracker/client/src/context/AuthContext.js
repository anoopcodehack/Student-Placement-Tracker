// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const savedUser = localStorage.getItem('user');
//     if (token && savedUser) {
//       setUser(JSON.parse(savedUser));
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     }
//     setLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     const res = await axios.post('/api/auth/login', { email, password });
//     const { token, user } = res.data;
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(user));
//     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     setUser(user);
//     return user;
//   };

//   const register = async (name, email, password) => {
//     const res = await axios.post('/api/auth/register', { name, email, password });
//     const { token, user } = res.data;
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(user));
//     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     setUser(user);
//     return user;
//   };

//   const authenticate = (token, user) => {
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(user));
//     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     setUser(user);
//     return user;
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     delete axios.defaults.headers.common['Authorization'];
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, register, authenticate, logout, loading, isAdmin: user?.role === 'admin' }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Restore session on page refresh ──
  useEffect(() => {
    const token     = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  // ── Login ──
  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    return user;
  };

  // ── Register ── ✅ now accepts rollNo for student signup
  const register = async (name, email, password, rollNo = '') => {
    const payload = { name, email, password };
    if (rollNo && rollNo.trim() !== '') {
      payload.rollNo = rollNo.trim().toUpperCase(); // send rollNo only if provided
    }
    const res = await axios.post('/api/auth/register', payload);
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    return user;
  };

  // ── Authenticate ── ✅ used for Google OAuth callback
  const authenticate = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    return user;
  };

  // ── Logout ──
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // ── Update User ── ✅ used to update global user state
  const updateUser = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      authenticate,
      logout,
      updateUser, // ✅ expose updateUser
      loading,
      isAdmin:   user?.role === 'admin',
      isStudent: user?.isStudent === true, // ✅ expose isStudent globally
    }}>
      {children}
    </AuthContext.Provider>
  );
};