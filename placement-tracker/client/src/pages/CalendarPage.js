// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';

// const INDUSTRY_COLORS = {
//   IT:          '#1a56db',
//   Product:     '#059669',
//   Finance:     '#d97706',
//   Consulting:  '#0891b2',
//   Core:        '#64748b',
//   Startup:     '#dc2626',
//   PSU:         '#7c3aed',
//   Service:     '#6366f1',
//   Other:       '#94a3b8',
// };

// const formatDate = (d) =>
//   new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

// const isSameDay = (d1, d2) => {
//   const a = new Date(d1);
//   const b = new Date(d2);
//   return a.getFullYear() === b.getFullYear() &&
//          a.getMonth()    === b.getMonth()    &&
//          a.getDate()     === b.getDate();
// };

// export default function CalendarPage() {
//   const [drives, setDrives]           = useState([]);
//   const [loading, setLoading]         = useState(true);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [selectedDrives, setSelectedDrives] = useState([]);
//   const [view, setView]               = useState('calendar'); // 'calendar' | 'list'

//   useEffect(() => {
//     axios.get('/api/calendar')
//       .then(res => {
//         setDrives(res.data.data);
//         // show today's or nearest drives on load
//         const todayDrives = res.data.data.filter(d =>
//           isSameDay(d.visitDate, new Date())
//         );
//         setSelectedDrives(todayDrives);
//       })
//       .catch(() => toast.error('Failed to load calendar'))
//       .finally(() => setLoading(false));
//   }, []);

//   // When user clicks a date on calendar
//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//     const found = drives.filter(d => isSameDay(d.visitDate, date));
//     setSelectedDrives(found);
//   };

//   // Dates that have drives — for highlighting
//   const driveDates = drives.map(d => new Date(d.visitDate));

//   // Tile content — show dot on dates with drives
//   const tileContent = ({ date, view }) => {
//     if (view !== 'month') return null;
//     const hasDrive = driveDates.some(d => isSameDay(d, date));
//     if (!hasDrive) return null;
//     const count = driveDates.filter(d => isSameDay(d, date)).length;
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', marginTop: 2, gap: 2 }}>
//         {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
//           <div key={i} style={{
//             width: 6, height: 6, borderRadius: '50%',
//             background: '#1a56db',
//           }} />
//         ))}
//       </div>
//     );
//   };

//   // Tile class — highlight drive dates
//   const tileClassName = ({ date, view }) => {
//     if (view !== 'month') return '';
//     const hasDrive = driveDates.some(d => isSameDay(d, date));
//     return hasDrive ? 'drive-date' : '';
//   };

//   // Upcoming drives (next 30 days)
//   const upcoming = drives.filter(d => {
//     const driveDate = new Date(d.visitDate);
//     const today     = new Date();
//     const in30      = new Date();
//     in30.setDate(today.getDate() + 30);
//     return driveDate >= today && driveDate <= in30;
//   });

//   // Past drives
//   const past = drives.filter(d => new Date(d.visitDate) < new Date());

//   const DriveCard = ({ drive, compact = false }) => {
//     const color = INDUSTRY_COLORS[drive.industry] || '#94a3b8';
//     const isPast = new Date(drive.visitDate) < new Date();
//     const isToday = isSameDay(drive.visitDate, new Date());

//     return (
//       <div style={{
//         background: '#fff',
//         borderRadius: 12,
//         padding: compact ? '0.85rem' : '1.1rem',
//         border: `1px solid ${isToday ? '#bfdbfe' : '#e2e8f0'}`,
//         borderLeft: `4px solid ${color}`,
//         background: isToday ? '#eff6ff' : isPast ? '#f8fafc' : '#fff',
//         opacity: isPast ? 0.75 : 1,
//         transition: 'transform 0.15s',
//       }}>
//         <div className="d-flex align-items-start justify-content-between gap-2">
//           <div className="d-flex align-items-center gap-2">
//             {/* Company avatar */}
//             <div style={{
//               width: 38, height: 38, borderRadius: 10, flexShrink: 0,
//               background: `${color}15`, color,
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               fontWeight: 800, fontSize: '0.8rem', fontFamily: 'Syne,sans-serif',
//             }}>
//               {drive.name.slice(0, 2).toUpperCase()}
//             </div>
//             <div>
//               <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>{drive.name}</div>
//               <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{drive.industry} · {drive.type}</div>
//             </div>
//           </div>

//           <div className="text-end flex-shrink-0">
//             {isToday && (
//               <span style={{
//                 fontSize: '0.62rem', fontWeight: 700, padding: '2px 8px',
//                 borderRadius: 20, background: '#1a56db', color: '#fff',
//                 display: 'block', marginBottom: 4,
//               }}>TODAY</span>
//             )}
//             {isPast && (
//               <span style={{
//                 fontSize: '0.62rem', fontWeight: 600, padding: '2px 8px',
//                 borderRadius: 20, background: '#e2e8f0', color: '#64748b',
//                 display: 'block', marginBottom: 4,
//               }}>Completed</span>
//             )}
//             <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#475569' }}>
//               <i className="bi bi-calendar3 me-1"></i>
//               {formatDate(drive.visitDate)}
//             </div>
//           </div>
//         </div>

//         {!compact && (
//           <div className="mt-2">
//             {/* Package range */}
//             {drive.packageRange?.min && (
//               <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: 4 }}>
//                 <i className="bi bi-currency-rupee me-1 text-success"></i>
//                 Package: ₹{drive.packageRange.min} – ₹{drive.packageRange.max} LPA
//               </div>
//             )}

//             {/* Eligibility */}
//             {drive.eligibilityCriteria?.minCGPA && (
//               <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: 4 }}>
//                 <i className="bi bi-mortarboard me-1 text-primary"></i>
//                 Min CGPA: {drive.eligibilityCriteria.minCGPA} · Max Backlogs: {drive.eligibilityCriteria.maxBacklogs ?? 0}
//               </div>
//             )}

//             {/* Roles */}
//             {drive.roles?.length > 0 && (
//               <div className="d-flex flex-wrap gap-1 mt-2">
//                 {drive.roles.slice(0, 3).map((r, i) => (
//                   <span key={i} style={{
//                     fontSize: '0.65rem', padding: '2px 8px', borderRadius: 20,
//                     background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 500,
//                   }}>{r}</span>
//                 ))}
//                 {drive.roles.length > 3 && (
//                   <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>+{drive.roles.length - 3} more</span>
//                 )}
//               </div>
//             )}

//             {/* Eligible branches */}
//             {drive.eligibilityCriteria?.branches?.length > 0 && (
//               <div className="d-flex flex-wrap gap-1 mt-1">
//                 <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Branches:</span>
//                 {drive.eligibilityCriteria.branches.map((b, i) => (
//                   <span key={i} style={{
//                     fontSize: '0.65rem', padding: '2px 8px', borderRadius: 20,
//                     background: '#eff6ff', color: '#1a56db', fontWeight: 600,
//                   }}>{b}</span>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div>
//       {/* Topbar */}
//       <div className="topbar">
//         <div>
//           <h1 className="page-title">Placement Calendar</h1>
//           <p className="page-sub">Track upcoming company drives and never miss a chance! 📅</p>
//         </div>
//         <div className="d-flex gap-2">
//           <button
//             className={`btn btn-sm ${view === 'calendar' ? 'btn-primary' : 'btn-outline-secondary'}`}
//             onClick={() => setView('calendar')}>
//             <i className="bi bi-calendar3 me-1"></i>Calendar
//           </button>
//           <button
//             className={`btn btn-sm ${view === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
//             onClick={() => setView('list')}>
//             <i className="bi bi-list-ul me-1"></i>List View
//           </button>
//         </div>
//       </div>

//       {/* Stats row */}
//       <div className="row g-3 mb-4">
//         {[
//           { label: 'Total Drives', val: drives.length, icon: 'bi-building-fill', color: '#1a56db', bg: '#eff6ff' },
//           { label: 'Upcoming (30 days)', val: upcoming.length, icon: 'bi-calendar-check-fill', color: '#059669', bg: '#f0fdf4' },
//           { label: 'Completed', val: past.length, icon: 'bi-check-circle-fill', color: '#64748b', bg: '#f8fafc' },
//           { label: 'Today\'s Drives', val: drives.filter(d => isSameDay(d.visitDate, new Date())).length, icon: 'bi-star-fill', color: '#d97706', bg: '#fffbeb' },
//         ].map((s, i) => (
//           <div key={i} className="col-6 col-md-3">
//             <div className="stat-card">
//               <div className="stat-icon" style={{ background: s.bg }}>
//                 <i className={`bi ${s.icon}`} style={{ color: s.color }}></i>
//               </div>
//               <div className="stat-value" style={{ fontSize: '1.5rem' }}>{s.val}</div>
//               <div className="stat-label">{s.label}</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {loading ? (
//         <div className="text-center py-5">
//           <div className="spinner-border text-primary mb-2" />
//           <p className="text-muted" style={{ fontSize: '0.85rem' }}>Loading calendar...</p>
//         </div>
//       ) : (

//         /* ── CALENDAR VIEW ── */
//         view === 'calendar' ? (
//           <div className="row g-3">
//             {/* Left — Calendar */}
//             <div className="col-lg-7">
//               <div className="form-card">
//                 <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
//                   <i className="bi bi-calendar3 text-primary me-2"></i>
//                   Drive Calendar
//                   <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 400, marginLeft: 8 }}>
//                     Click a date to see drives
//                   </span>
//                 </h6>

//                 {/* Custom calendar CSS */}
//                 <style>{`
//                   .react-calendar {
//                     width: 100% !important;
//                     border: none !important;
//                     font-family: 'Plus Jakarta Sans', sans-serif !important;
//                     font-size: 0.875rem;
//                   }
//                   .react-calendar__tile {
//                     border-radius: 8px !important;
//                     padding: 0.6rem 0.5rem !important;
//                     transition: all 0.15s !important;
//                   }
//                   .react-calendar__tile:hover {
//                     background: #eff6ff !important;
//                   }
//                   .react-calendar__tile--active {
//                     background: #1a56db !important;
//                     border-radius: 8px !important;
//                     color: #fff !important;
//                   }
//                   .react-calendar__tile--now {
//                     background: #f0fdf4 !important;
//                     color: #059669 !important;
//                     font-weight: 700 !important;
//                   }
//                   .react-calendar__tile--now.react-calendar__tile--active {
//                     background: #1a56db !important;
//                     color: #fff !important;
//                   }
//                   .drive-date {
//                     background: #eff6ff !important;
//                     font-weight: 700 !important;
//                     color: #1a56db !important;
//                   }
//                   .react-calendar__navigation button {
//                     font-family: 'Syne', sans-serif !important;
//                     font-weight: 700 !important;
//                     border-radius: 8px !important;
//                   }
//                   .react-calendar__navigation button:hover {
//                     background: #eff6ff !important;
//                   }
//                   .react-calendar__month-view__weekdays {
//                     font-size: 0.72rem !important;
//                     color: #94a3b8 !important;
//                     text-transform: uppercase !important;
//                     letter-spacing: 0.05em !important;
//                   }
//                   .react-calendar__month-view__weekdays abbr {
//                     text-decoration: none !important;
//                   }
//                 `}</style>

//                 <Calendar
//                   onChange={handleDateChange}
//                   value={selectedDate}
//                   tileContent={tileContent}
//                   tileClassName={tileClassName}
//                 />

//                 {/* Legend */}
//                 <div className="d-flex gap-3 mt-3 pt-2" style={{ borderTop: '1px solid #e2e8f0', fontSize: '0.72rem', color: '#64748b' }}>
//                   <div className="d-flex align-items-center gap-1">
//                     <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1a56db' }}></div>
//                     Drive scheduled
//                   </div>
//                   <div className="d-flex align-items-center gap-1">
//                     <div style={{ width: 14, height: 14, borderRadius: 4, background: '#f0fdf4' }}></div>
//                     Today
//                   </div>
//                   <div className="d-flex align-items-center gap-1">
//                     <div style={{ width: 14, height: 14, borderRadius: 4, background: '#1a56db' }}></div>
//                     Selected
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right — Selected date drives */}
//             <div className="col-lg-5">
//               <div className="form-card h-100">
//                 <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
//                   <i className="bi bi-calendar-event text-primary me-2"></i>
//                   {formatDate(selectedDate)}
//                 </h6>

//                 {selectedDrives.length === 0 ? (
//                   <div className="text-center py-4">
//                     <i className="bi bi-calendar-x" style={{ fontSize: '2.5rem', color: '#cbd5e1' }}></i>
//                     <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: 12, marginBottom: 0 }}>
//                       No drives on this date
//                     </p>
//                     <p style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
//                       Click a highlighted date to see drives
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="d-flex flex-column gap-2">
//                     {selectedDrives.map(drive => (
//                       <DriveCard key={drive._id} drive={drive} compact={false} />
//                     ))}
//                   </div>
//                 )}

//                 {/* Upcoming section below */}
//                 {upcoming.length > 0 && (
//                   <div className="mt-3 pt-3" style={{ borderTop: '1px solid #e2e8f0' }}>
//                     <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
//                       Upcoming in 30 days
//                     </div>
//                     <div className="d-flex flex-column gap-2">
//                       {upcoming.slice(0, 4).map(drive => (
//                         <div key={drive._id}
//                           onClick={() => { setSelectedDate(new Date(drive.visitDate)); setSelectedDrives([drive]); }}
//                           style={{ cursor: 'pointer' }}>
//                           <DriveCard drive={drive} compact={true} />
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//         ) : (

//           /* ── LIST VIEW ── */
//           <div>
//             {/* Upcoming */}
//             <div className="mb-4">
//               <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
//                 <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669', display: 'inline-block' }}></span>
//                 Upcoming Drives
//                 <span style={{ fontSize: '0.75rem', background: '#f0fdf4', color: '#059669', padding: '2px 10px', borderRadius: 20, fontWeight: 600 }}>
//                   {upcoming.length}
//                 </span>
//               </div>
//               {upcoming.length === 0 ? (
//                 <div className="form-card text-center py-4">
//                   <i className="bi bi-calendar-x" style={{ fontSize: '2.5rem', color: '#cbd5e1' }}></i>
//                   <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.85rem' }}>No upcoming drives in next 30 days</p>
//                 </div>
//               ) : (
//                 <div className="row g-3">
//                   {upcoming.map(drive => (
//                     <div key={drive._id} className="col-md-6">
//                       <DriveCard drive={drive} compact={false} />
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Past */}
//             {past.length > 0 && (
//               <div>
//                 <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
//                   <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#94a3b8', display: 'inline-block' }}></span>
//                   Past Drives
//                   <span style={{ fontSize: '0.75rem', background: '#f8fafc', color: '#64748b', padding: '2px 10px', borderRadius: 20, fontWeight: 600 }}>
//                     {past.length}
//                   </span>
//                 </div>
//                 <div className="row g-3">
//                   {past.map(drive => (
//                     <div key={drive._id} className="col-md-6">
//                       <DriveCard drive={drive} compact={false} />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';

const INDUSTRY_COLORS = {
  IT: '#1a56db', Product: '#059669', Finance: '#d97706',
  Consulting: '#0891b2', Core: '#64748b', Startup: '#dc2626',
  PSU: '#7c3aed', Service: '#6366f1', Other: '#94a3b8',
};

export default function Companies() {
  const [companies, setCompanies]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [industry, setIndustry]       = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [dateModal, setDateModal]     = useState(null); // company being edited
  const [newDate, setNewDate]         = useState('');
  const [savingDate, setSavingDate]   = useState(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search)   params.search   = search;
      if (industry) params.industry = industry;
      const res = await axios.get('/api/companies', { params });
      setCompanies(res.data.data);
    } catch { toast.error('Failed to load companies'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCompanies(); }, [search, industry]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/companies/${deleteTarget._id}`);
      toast.success('Company deleted');
      setDeleteTarget(null);
      fetchCompanies();
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  // ── Open date modal ──
  const openDateModal = (company) => {
    setDateModal(company);
    // pre-fill existing date if any
    setNewDate(company.visitDate
      ? new Date(company.visitDate).toISOString().split('T')[0]
      : '');
  };

  // ── Save visit date ──
  const handleSaveDate = async () => {
    if (!newDate) return toast.error('Please select a date!');
    setSavingDate(true);
    try {
      await axios.put(`/api/companies/${dateModal._id}`, {
        ...dateModal,
        visitDate: newDate,
      });
      toast.success(`Visit date set for ${dateModal.name}! 📅`);
      setDateModal(null);
      fetchCompanies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save date');
    } finally { setSavingDate(false); }
  };

  // ── Remove visit date ──
  const handleRemoveDate = async () => {
    setSavingDate(true);
    try {
      await axios.put(`/api/companies/${dateModal._id}`, {
        ...dateModal,
        visitDate: null,
      });
      toast.success('Visit date removed');
      setDateModal(null);
      fetchCompanies();
    } catch {
      toast.error('Failed to remove date');
    } finally { setSavingDate(false); }
  };

  const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const isUpcoming = (d) => d && new Date(d) >= new Date();
  const isPast     = (d) => d && new Date(d) < new Date();
  const isToday    = (d) => {
    if (!d) return false;
    const a = new Date(d), b = new Date();
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth()    === b.getMonth()    &&
           a.getDate()     === b.getDate();
  };

  return (
    <div>
      <div className="topbar">
        <div>
          <h1 className="page-title">Companies</h1>
          <p className="page-sub">{companies.length} companies · {companies.filter(c => isUpcoming(c.visitDate)).length} upcoming drives</p>
        </div>
        {isAdmin && (
          <Link to="/companies/add" className="btn btn-primary">
            <i className="bi bi-plus-circle-fill me-2"></i>Add Company
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <i className="bi bi-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.85rem' }}></i>
          <input className="form-control" style={{ paddingLeft: 32 }} placeholder="Search companies..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: 160 }} value={industry}
          onChange={e => setIndustry(e.target.value)}>
          <option value="">All Industries</option>
          {Object.keys(INDUSTRY_COLORS).map(i => <option key={i}>{i}</option>)}
        </select>
        {(search || industry) && (
          <button className="btn btn-outline-secondary" onClick={() => { setSearch(''); setIndustry(''); }}>
            <i className="bi bi-x-circle me-1"></i>Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="text-muted mt-2" style={{ fontSize: '0.85rem' }}>Loading companies...</p>
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-building" style={{ fontSize: '3rem', color: '#cbd5e1' }}></i>
          <h6 className="mt-3 text-muted">No companies found</h6>
        </div>
      ) : (
        <div className="row g-3">
          {companies.map((c) => {
            const color = INDUSTRY_COLORS[c.industry] || '#94a3b8';
            return (
              <div key={c._id} className="col-md-6 col-xl-4 fade-in">
                <div className="company-card h-100">
                  <div className="company-card-accent" style={{ background: `linear-gradient(90deg,${color},${color}80)` }} />

                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-start mb-3 mt-1">
                    <div className="d-flex align-items-center gap-3">
                      <div className="avatar" style={{
                        width: 46, height: 46, fontSize: '1rem', fontWeight: 800,
                        background: `${color}15`, color, borderRadius: 12,
                      }}>
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>{c.name}</div>
                        <span style={{
                          fontSize: '0.65rem', fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                          background: `${color}15`, color,
                        }}>{c.industry}</span>
                      </div>
                    </div>
                    <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: '0.65rem' }}>{c.type}</span>
                  </div>

                  {/* Stats */}
                  <div className="row g-2 mb-3">
                    {[
                      { label: 'Hired', val: c.studentsHired, color: '#1a56db' },
                      { label: 'Min Pkg', val: c.packageRange?.min ? `₹${c.packageRange.min}L` : '—', color: '#059669' },
                      { label: 'Max Pkg', val: c.packageRange?.max ? `₹${c.packageRange.max}L` : '—', color: '#d97706' },
                    ].map((m, i) => (
                      <div key={i} className="col-4">
                        <div className="metric-box">
                          <div className="metric-val" style={{ color: m.color, fontSize: '1.1rem' }}>{m.val}</div>
                          <div className="metric-lbl">{m.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Roles */}
                  {c.roles?.length > 0 && (
                    <div className="d-flex flex-wrap gap-1 mb-3">
                      {c.roles.slice(0, 3).map((r, i) => (
                        <span key={i} style={{
                          fontSize: '0.68rem', padding: '3px 10px', borderRadius: 20,
                          background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 500,
                        }}>{r}</span>
                      ))}
                      {c.roles.length > 3 && <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>+{c.roles.length - 3} more</span>}
                    </div>
                  )}

                  {/* ── Visit Date section ── */}
                  <div style={{
                    padding: '0.6rem 0.75rem',
                    borderRadius: 8,
                    background: isToday(c.visitDate) ? '#eff6ff' :
                                isUpcoming(c.visitDate) ? '#f0fdf4' :
                                isPast(c.visitDate) ? '#f8fafc' : '#fafafa',
                    border: `1px solid ${isToday(c.visitDate) ? '#bfdbfe' :
                                         isUpcoming(c.visitDate) ? '#bbf7d0' :
                                         isPast(c.visitDate) ? '#e2e8f0' : '#e2e8f0'}`,
                    marginBottom: 10,
                  }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        {c.visitDate ? (
                          <>
                            <div style={{
                              fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
                              letterSpacing: '0.06em',
                              color: isToday(c.visitDate) ? '#1a56db' :
                                     isUpcoming(c.visitDate) ? '#059669' : '#94a3b8',
                            }}>
                              {isToday(c.visitDate) ? '🔴 TODAY' :
                               isUpcoming(c.visitDate) ? '🟢 Upcoming Drive' : '⚫ Completed'}
                            </div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b', marginTop: 2 }}>
                              <i className="bi bi-calendar3 me-1"></i>{fmtDate(c.visitDate)}
                            </div>
                          </>
                        ) : (
                          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                            <i className="bi bi-calendar-x me-1"></i>No drive date set
                          </div>
                        )}
                      </div>

                      {/* Admin — set date button */}
                      {isAdmin && (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          style={{ fontSize: '0.72rem', padding: '3px 10px' }}
                          onClick={() => openDateModal(c)}
                          title="Set visit date">
                          <i className="bi bi-calendar-plus me-1"></i>
                          {c.visitDate ? 'Edit' : 'Set Date'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Footer actions */}
                  {isAdmin && (
                    <div className="d-flex gap-1 pt-2" style={{ borderTop: '1px solid #e2e8f0' }}>
                      <button className="btn btn-sm btn-outline-danger ms-auto" style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        onClick={() => setDeleteTarget(c)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Date Picker Modal ── */}
      {dateModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={() => setDateModal(null)} />
          <div className="modal fade show d-block" style={{ zIndex: 1050 }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: 16, border: 'none', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>
                <div className="modal-header border-0 pb-0">
                  <div>
                    <h5 className="modal-title fw-bold" style={{ fontFamily: 'Syne,sans-serif' }}>
                      Set Campus Visit Date
                    </h5>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                      {dateModal.name} — this date will appear on the Placement Calendar
                    </p>
                  </div>
                  <button className="btn-close" onClick={() => setDateModal(null)} />
                </div>

                <div className="modal-body">
                  <label className="form-label fw-semibold">Visit / Drive Date</label>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    style={{ borderRadius: 10 }}
                  />

                  {newDate && (
                    <div style={{ marginTop: 12, padding: '10px 14px', background: '#eff6ff', borderRadius: 10, fontSize: '0.82rem', color: '#1e40af' }}>
                      <i className="bi bi-calendar-check me-1"></i>
                      Drive will be shown as: <strong>{fmtDate(newDate)}</strong>
                    </div>
                  )}
                </div>

                <div className="modal-footer border-0 pt-0">
                  {/* Remove date button */}
                  {dateModal.visitDate && (
                    <button className="btn btn-outline-danger btn-sm me-auto" onClick={handleRemoveDate} disabled={savingDate}>
                      <i className="bi bi-calendar-x me-1"></i>Remove Date
                    </button>
                  )}
                  <button className="btn btn-outline-secondary" onClick={() => setDateModal(null)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary px-4" onClick={handleSaveDate} disabled={savingDate || !newDate}>
                    {savingDate
                      ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                      : <><i className="bi bi-calendar-check me-2"></i>Save Date</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <ConfirmModal
        show={!!deleteTarget}
        title="Delete Company"
        message={`Delete "${deleteTarget?.name}"? All associated data may be affected.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmText="Delete"
      />
    </div>
  );
}