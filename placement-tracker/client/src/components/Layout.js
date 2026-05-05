// import React from 'react';
// import { Outlet, NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const mainNav = [
//   { to: '/', icon: 'bi-speedometer2', label: 'Dashboard', end: true },
//   { to: '/students', icon: 'bi-people-fill', label: 'Students' },
//   { to: '/companies', icon: 'bi-building-fill', label: 'Companies' },
//   { to: '/placements', icon: 'bi-briefcase-fill', label: 'Placements' },
//   { to: '/analytics', icon: 'bi-bar-chart-fill', label: 'Analytics' },
// ];
// const adminNav = [
//   { to: '/students/add', icon: 'bi-person-plus-fill', label: 'Add Student' },
//   { to: '/companies/add', icon: 'bi-building-add', label: 'Add Company' },
//   { to: '/placements/add', icon: 'bi-award-fill', label: 'Add Placement' },
// ];

// export default function Layout() {
//   const { user, logout, isAdmin } = useAuth();
//   const navigate = useNavigate();
//   const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || 'U';

//   return (
//     <div>
//       <aside className="sidebar">
//         {/* Brand */}
//         <div className="sidebar-brand">
//           <div className="logo-wrap">
//             <div className="logo-icon"><i className="bi bi-mortarboard-fill"></i></div>
//             <div>
//               <div className="brand-name">PlaceTrack</div>
//               <div className="brand-sub">Placement Portal</div>
//             </div>
//           </div>
//         </div>

//         {/* Nav */}
//         <nav className="sidebar-nav">
//           <div className="nav-section-label">Main Menu</div>
//           {mainNav.map(item => (
//             <NavLink key={item.to} to={item.to} end={item.end}
//               className={({ isActive }) => `nav-item-custom ${isActive ? 'active' : ''}`}>
//               <i className={`bi ${item.icon} nav-icon`}></i>
//               <span>{item.label}</span>
//             </NavLink>
//           ))}

//           {isAdmin && (
//             <>
//               <div className="nav-section-label" style={{marginTop:'0.5rem'}}>Admin</div>
//               {adminNav.map(item => (
//                 <NavLink key={item.to} to={item.to}
//                   className={({ isActive }) => `nav-item-custom ${isActive ? 'active' : ''}`}>
//                   <i className={`bi ${item.icon} nav-icon`}></i>
//                   <span>{item.label}</span>
//                 </NavLink>
//               ))}
//             </>
//           )}
//         </nav>

//         {/* Footer user */}
//         <div className="sidebar-footer">
//           <div className="user-chip">
//             <div className="user-avatar">{initials}</div>
//             <div style={{flex:1,minWidth:0}}>
//               <div className="user-name" style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.name}</div>
//               <div className="user-role">{user?.role}</div>
//             </div>
//             <button className="logout-btn" title="Logout" onClick={() => { logout(); navigate('/login'); }}>
//               <i className="bi bi-box-arrow-right"></i>
//             </button>
//           </div>
//         </div>
//       </aside>

//       <main className="main-content">
//         <Outlet />
//       </main>
//     </div>
//   );
// }
// import React from 'react';
// import { Outlet, NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { useTheme } from '../context/ThemeContext';
// import { useNavigate } from 'react-router-dom';

// const mainNav = [
//   { to: '/', icon: 'bi-speedometer2', label: 'Dashboard', end: true },
//   { to: '/students', icon: 'bi-people-fill', label: 'Students' },
//   { to: '/companies', icon: 'bi-building-fill', label: 'Companies' },
//   { to: '/placements', icon: 'bi-briefcase-fill', label: 'Placements' },
//   { to: '/analytics', icon: 'bi-bar-chart-fill', label: 'Analytics' },
// ];

// const adminNav = [
//   { to: '/students/add', icon: 'bi-person-plus-fill', label: 'Add Student' },
//   { to: '/companies/add', icon: 'bi-building-add', label: 'Add Company' },
//   { to: '/placements/add', icon: 'bi-award-fill', label: 'Add Placement' },
// ];

// export default function Layout() {
//   const { user, logout, isAdmin } = useAuth();
//   const { isDark, toggleTheme } = useTheme();
//   const navigate = useNavigate();
//   const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

//   return (
//     <div>
//       <aside className="sidebar">

//         {/* Brand */}
//         <div className="sidebar-brand">
//           <div className="logo-wrap">
//             <div className="logo-icon">
//               <i className="bi bi-mortarboard-fill"></i>
//             </div>
//             <div>
//               <div className="brand-name">PlaceTrack</div>
//               <div className="brand-sub">Placement Portal</div>
//             </div>
//           </div>
//         </div>

//         {/* Nav */}
//         <nav className="sidebar-nav">
//           <div className="nav-section-label">Main Menu</div>
//           {mainNav.map(item => (
//             <NavLink
//               key={item.to}
//               to={item.to}
//               end={item.end}
//               className={({ isActive }) => `nav-item-custom ${isActive ? 'active' : ''}`}
//             >
//               <i className={`bi ${item.icon} nav-icon`}></i>
//               <span>{item.label}</span>
//             </NavLink>
//           ))}

//           {isAdmin && (
//             <>
//               <div className="nav-section-label" style={{ marginTop: '0.5rem' }}>Admin</div>
//               {adminNav.map(item => (
//                 <NavLink
//                   key={item.to}
//                   to={item.to}
//                   className={({ isActive }) => `nav-item-custom ${isActive ? 'active' : ''}`}
//                 >
//                   <i className={`bi ${item.icon} nav-icon`}></i>
//                   <span>{item.label}</span>
//                 </NavLink>
//               ))}
//             </>
//           )}
//         </nav>

//         {/* Footer */}
//         <div className="sidebar-footer">

//           {/* 🌙 Dark / Light Mode Toggle */}
//           <button
//             onClick={toggleTheme}
//             title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
//             style={{
//               width: '100%',
//               background: 'rgba(255,255,255,0.05)',
//               border: '1px solid rgba(255,255,255,0.08)',
//               borderRadius: 8,
//               padding: '8px 12px',
//               color: '#94a3b8',
//               cursor: 'pointer',
//               display: 'flex',
//               alignItems: 'center',
//               gap: 8,
//               fontSize: '0.82rem',
//               fontWeight: 600,
//               marginBottom: 10,
//               transition: 'all 0.2s',
//             }}
//             onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
//             onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
//           >
//             <i
//               className={`bi ${isDark ? 'bi-sun-fill' : 'bi-moon-fill'}`}
//               style={{
//                 color: isDark ? '#fbbf24' : '#818cf8',
//                 fontSize: '0.95rem',
//                 transition: 'all 0.2s',
//               }}
//             ></i>
//             <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>

//             {/* Toggle pill indicator */}
//             <div style={{
//               marginLeft: 'auto',
//               width: 36,
//               height: 20,
//               borderRadius: 10,
//               background: isDark ? '#1a56db' : '#334155',
//               position: 'relative',
//               transition: 'background 0.3s',
//               flexShrink: 0,
//             }}>
//               <div style={{
//                 position: 'absolute',
//                 top: 3,
//                 left: isDark ? 18 : 3,
//                 width: 14,
//                 height: 14,
//                 borderRadius: '50%',
//                 background: '#fff',
//                 transition: 'left 0.3s',
//               }} />
//             </div>
//           </button>

          

//           {/* User chip */}
//           <div className="user-chip">
//             <div className="user-avatar">{initials}</div>
//             <div style={{ flex: 1, minWidth: 0 }}>
//               <div
//                 className="user-name"
//                 style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
//               >
//                 {user?.name}
//               </div>
//               <div className="user-role">{user?.role}</div>
//             </div>
//             <button
//               className="logout-btn"
//               title="Logout"
//               onClick={() => { logout(); navigate('/login'); }}
//             >
//               <i className="bi bi-box-arrow-right"></i>
//             </button>
//           </div>

//         </div>
//       </aside>

//       <main className="main-content">
//         <Outlet />
//       </main>
//     </div>
//   );
// }

import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

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
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate(); // ✅ only once — fixed duplicate import bug
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <div>
      <aside className="sidebar">

        {/* Brand */}
        <div className="sidebar-brand">
          <div className="logo-wrap">
            <div className="logo-icon">
              <i className="bi bi-mortarboard-fill"></i>
            </div>
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
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-item-custom ${isActive ? 'active' : ''}`}
            >
              <i className={`bi ${item.icon} nav-icon`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <div className="nav-section-label" style={{ marginTop: '0.5rem' }}>Admin</div>
              {adminNav.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `nav-item-custom ${isActive ? 'active' : ''}`}
                >
                  <i className={`bi ${item.icon} nav-icon`}></i>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </>
          )}

          {/* Profile — visible to all */}
          <div className="nav-section-label" style={{ marginTop: '0.5rem' }}>Account</div>
          <NavLink
            to="/profile"
            className={({ isActive }) => `nav-item-custom ${isActive ? 'active' : ''}`}
          >
            <i className="bi bi-person-circle nav-icon"></i>
            <span>My Profile</span>
          </NavLink>

        </nav>

        {/* Footer */}
        <div className="sidebar-footer">

          {/* 🌙 Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              padding: '8px 12px',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: 10,
              transition: 'all 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <i
              className={`bi ${isDark ? 'bi-sun-fill' : 'bi-moon-fill'}`}
              style={{
                color: isDark ? '#fbbf24' : '#818cf8',
                fontSize: '0.95rem',
                transition: 'all 0.2s',
              }}
            ></i>
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>

            {/* Toggle pill */}
            <div style={{
              marginLeft: 'auto',
              width: 36,
              height: 20,
              borderRadius: 10,
              background: isDark ? '#1a56db' : '#334155',
              position: 'relative',
              transition: 'background 0.3s',
              flexShrink: 0,
            }}>
              <div style={{
                position: 'absolute',
                top: 3,
                left: isDark ? 18 : 3,
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.3s',
              }} />
            </div>
          </button>

          {/* User chip */}
          <div className="user-chip">

            {/* Avatar — click → profile */}
            <div
              className="user-avatar"
              title="View Profile"
              onClick={() => navigate('/profile')}
              style={{ cursor: 'pointer' }}
            >
              {initials}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                className="user-name"
                onClick={() => navigate('/profile')}
                style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}
              >
                {user?.name}
              </div>
              <div className="user-role" style={{ textTransform: 'capitalize' }}>
                {user?.isStudent ? '🎓 Student' : user?.role}
              </div>
            </div>

            {/* Profile button */}
            <button
              className="logout-btn"
              title="My Profile"
              onClick={() => navigate('/profile')}
            >
              <i className="bi bi-person-circle"></i>
            </button>

            {/* Logout button */}
            <button
              className="logout-btn"
              title="Logout"
              onClick={() => { logout(); navigate('/login'); }}
            >
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