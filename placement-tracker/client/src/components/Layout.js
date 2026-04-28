import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const mainNav = [
  { to: '/', icon: 'bi-speedometer2', label: 'Dashboard', end: true },
  { to: '/students', icon: 'bi-people-fill', label: 'Students' },
  { to: '/companies', icon: 'bi-building-fill', label: 'Companies' },
  { to: '/placements', icon: 'bi-briefcase-fill', label: 'Placements' },
  { to: '/analytics', icon: 'bi-bar-chart-fill', label: 'Analytics' },
];
const adminNav = [
  { to: '/students/add', icon: 'bi-person-plus-fill', label: 'Add Student' },
  { to: '/companies/add', icon: 'bi-building-add', label: 'Add Company' },
  { to: '/placements/add', icon: 'bi-award-fill', label: 'Add Placement' },
];

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || 'U';

  return (
    <div>
      <aside className="sidebar">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="logo-wrap">
            <div className="logo-icon"><i className="bi bi-mortarboard-fill"></i></div>
            <div>
              <div className="brand-name">PlaceTrack</div>
              <div className="brand-sub">Placement Portal</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Main Menu</div>
          {mainNav.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) => `nav-item-custom ${isActive ? 'active' : ''}`}>
              <i className={`bi ${item.icon} nav-icon`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <div className="nav-section-label" style={{marginTop:'0.5rem'}}>Admin</div>
              {adminNav.map(item => (
                <NavLink key={item.to} to={item.to}
                  className={({ isActive }) => `nav-item-custom ${isActive ? 'active' : ''}`}>
                  <i className={`bi ${item.icon} nav-icon`}></i>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* Footer user */}
        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="user-avatar">{initials}</div>
            <div style={{flex:1,minWidth:0}}>
              <div className="user-name" style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
            <button className="logout-btn" title="Logout" onClick={() => { logout(); navigate('/login'); }}>
              <i className="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
