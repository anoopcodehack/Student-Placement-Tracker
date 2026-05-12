import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const INDUSTRY_COLORS = {
  IT:          '#1a56db',
  Product:     '#059669',
  Finance:     '#d97706',
  Consulting:  '#0891b2',
  Core:        '#64748b',
  Startup:     '#dc2626',
  PSU:         '#7c3aed',
  Service:     '#6366f1',
  Other:       '#94a3b8',
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

const isSameDay = (d1, d2) => {
  const a = new Date(d1);
  const b = new Date(d2);
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth()    &&
         a.getDate()     === b.getDate();
};

export default function CalendarPage() {
  const [drives, setDrives]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDrives, setSelectedDrives] = useState([]);
  const [view, setView]               = useState('calendar'); // 'calendar' | 'list'

  useEffect(() => {
    axios.get('/api/calendar')
      .then(res => {
        setDrives(res.data.data);
        // show today's or nearest drives on load
        const todayDrives = res.data.data.filter(d =>
          isSameDay(d.visitDate, new Date())
        );
        setSelectedDrives(todayDrives);
      })
      .catch(() => toast.error('Failed to load calendar'))
      .finally(() => setLoading(false));
  }, []);

  // When user clicks a date on calendar
  const handleDateChange = (date) => {
    setSelectedDate(date);
    const found = drives.filter(d => isSameDay(d.visitDate, date));
    setSelectedDrives(found);
  };

  // Dates that have drives — for highlighting
  const driveDates = drives.map(d => new Date(d.visitDate));

  // Tile content — show dot on dates with drives
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const hasDrive = driveDates.some(d => isSameDay(d, date));
    if (!hasDrive) return null;
    const count = driveDates.filter(d => isSameDay(d, date)).length;
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 2, gap: 2 }}>
        {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#1a56db',
          }} />
        ))}
      </div>
    );
  };

  // Tile class — highlight drive dates
  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return '';
    const hasDrive = driveDates.some(d => isSameDay(d, date));
    return hasDrive ? 'drive-date' : '';
  };

  // Upcoming drives (next 30 days)
  const upcoming = drives.filter(d => {
    const driveDate = new Date(d.visitDate);
    const today     = new Date();
    const in30      = new Date();
    in30.setDate(today.getDate() + 30);
    return driveDate >= today && driveDate <= in30;
  });

  // Past drives
  const past = drives.filter(d => new Date(d.visitDate) < new Date());

  const DriveCard = ({ drive, compact = false }) => {
    const color = INDUSTRY_COLORS[drive.industry] || '#94a3b8';
    const isPast = new Date(drive.visitDate) < new Date();
    const isToday = isSameDay(drive.visitDate, new Date());

    return (
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: compact ? '0.85rem' : '1.1rem',
        border: `1px solid ${isToday ? '#bfdbfe' : '#e2e8f0'}`,
        borderLeft: `4px solid ${color}`,
        background: isToday ? '#eff6ff' : isPast ? '#f8fafc' : '#fff',
        opacity: isPast ? 0.75 : 1,
        transition: 'transform 0.15s',
      }}>
        <div className="d-flex align-items-start justify-content-between gap-2">
          <div className="d-flex align-items-center gap-2">
            {/* Company avatar */}
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: `${color}15`, color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '0.8rem', fontFamily: 'Syne,sans-serif',
            }}>
              {drive.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>{drive.name}</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{drive.industry} · {drive.type}</div>
            </div>
          </div>

          <div className="text-end flex-shrink-0">
            {isToday && (
              <span style={{
                fontSize: '0.62rem', fontWeight: 700, padding: '2px 8px',
                borderRadius: 20, background: '#1a56db', color: '#fff',
                display: 'block', marginBottom: 4,
              }}>TODAY</span>
            )}
            {isPast && (
              <span style={{
                fontSize: '0.62rem', fontWeight: 600, padding: '2px 8px',
                borderRadius: 20, background: '#e2e8f0', color: '#64748b',
                display: 'block', marginBottom: 4,
              }}>Completed</span>
            )}
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#475569' }}>
              <i className="bi bi-calendar3 me-1"></i>
              {formatDate(drive.visitDate)}
            </div>
          </div>
        </div>

        {!compact && (
          <div className="mt-2">
            {/* Package range */}
            {drive.packageRange?.min && (
              <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: 4 }}>
                <i className="bi bi-currency-rupee me-1 text-success"></i>
                Package: ₹{drive.packageRange.min} – ₹{drive.packageRange.max} LPA
              </div>
            )}

            {/* Eligibility */}
            {drive.eligibilityCriteria?.minCGPA && (
              <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: 4 }}>
                <i className="bi bi-mortarboard me-1 text-primary"></i>
                Min CGPA: {drive.eligibilityCriteria.minCGPA} · Max Backlogs: {drive.eligibilityCriteria.maxBacklogs ?? 0}
              </div>
            )}

            {/* Roles */}
            {drive.roles?.length > 0 && (
              <div className="d-flex flex-wrap gap-1 mt-2">
                {drive.roles.slice(0, 3).map((r, i) => (
                  <span key={i} style={{
                    fontSize: '0.65rem', padding: '2px 8px', borderRadius: 20,
                    background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 500,
                  }}>{r}</span>
                ))}
                {drive.roles.length > 3 && (
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>+{drive.roles.length - 3} more</span>
                )}
              </div>
            )}

            {/* Eligible branches */}
            {drive.eligibilityCriteria?.branches?.length > 0 && (
              <div className="d-flex flex-wrap gap-1 mt-1">
                <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Branches:</span>
                {drive.eligibilityCriteria.branches.map((b, i) => (
                  <span key={i} style={{
                    fontSize: '0.65rem', padding: '2px 8px', borderRadius: 20,
                    background: '#eff6ff', color: '#1a56db', fontWeight: 600,
                  }}>{b}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Topbar */}
      <div className="topbar">
        <div>
          <h1 className="page-title">Placement Calendar</h1>
          <p className="page-sub">Track upcoming company drives and never miss a chance! 📅</p>
        </div>
        <div className="d-flex gap-2">
          <button
            className={`btn btn-sm ${view === 'calendar' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setView('calendar')}>
            <i className="bi bi-calendar3 me-1"></i>Calendar
          </button>
          <button
            className={`btn btn-sm ${view === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setView('list')}>
            <i className="bi bi-list-ul me-1"></i>List View
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Drives', val: drives.length, icon: 'bi-building-fill', color: '#1a56db', bg: '#eff6ff' },
          { label: 'Upcoming (30 days)', val: upcoming.length, icon: 'bi-calendar-check-fill', color: '#059669', bg: '#f0fdf4' },
          { label: 'Completed', val: past.length, icon: 'bi-check-circle-fill', color: '#64748b', bg: '#f8fafc' },
          { label: 'Today\'s Drives', val: drives.filter(d => isSameDay(d.visitDate, new Date())).length, icon: 'bi-star-fill', color: '#d97706', bg: '#fffbeb' },
        ].map((s, i) => (
          <div key={i} className="col-6 col-md-3">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: s.bg }}>
                <i className={`bi ${s.icon}`} style={{ color: s.color }}></i>
              </div>
              <div className="stat-value" style={{ fontSize: '1.5rem' }}>{s.val}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-2" />
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>Loading calendar...</p>
        </div>
      ) : (

        /* ── CALENDAR VIEW ── */
        view === 'calendar' ? (
          <div className="row g-3">
            {/* Left — Calendar */}
            <div className="col-lg-7">
              <div className="form-card">
                <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
                  <i className="bi bi-calendar3 text-primary me-2"></i>
                  Drive Calendar
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 400, marginLeft: 8 }}>
                    Click a date to see drives
                  </span>
                </h6>

                {/* Custom calendar CSS */}
                <style>{`
                  .react-calendar {
                    width: 100% !important;
                    border: none !important;
                    font-family: 'Plus Jakarta Sans', sans-serif !important;
                    font-size: 0.875rem;
                  }
                  .react-calendar__tile {
                    border-radius: 8px !important;
                    padding: 0.6rem 0.5rem !important;
                    transition: all 0.15s !important;
                  }
                  .react-calendar__tile:hover {
                    background: #eff6ff !important;
                  }
                  .react-calendar__tile--active {
                    background: #1a56db !important;
                    border-radius: 8px !important;
                    color: #fff !important;
                  }
                  .react-calendar__tile--now {
                    background: #f0fdf4 !important;
                    color: #059669 !important;
                    font-weight: 700 !important;
                  }
                  .react-calendar__tile--now.react-calendar__tile--active {
                    background: #1a56db !important;
                    color: #fff !important;
                  }
                  .drive-date {
                    background: #eff6ff !important;
                    font-weight: 700 !important;
                    color: #1a56db !important;
                  }
                  .react-calendar__navigation button {
                    font-family: 'Syne', sans-serif !important;
                    font-weight: 700 !important;
                    border-radius: 8px !important;
                  }
                  .react-calendar__navigation button:hover {
                    background: #eff6ff !important;
                  }
                  .react-calendar__month-view__weekdays {
                    font-size: 0.72rem !important;
                    color: #94a3b8 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.05em !important;
                  }
                  .react-calendar__month-view__weekdays abbr {
                    text-decoration: none !important;
                  }
                `}</style>

                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  tileContent={tileContent}
                  tileClassName={tileClassName}
                />

                {/* Legend */}
                <div className="d-flex gap-3 mt-3 pt-2" style={{ borderTop: '1px solid #e2e8f0', fontSize: '0.72rem', color: '#64748b' }}>
                  <div className="d-flex align-items-center gap-1">
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1a56db' }}></div>
                    Drive scheduled
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <div style={{ width: 14, height: 14, borderRadius: 4, background: '#f0fdf4' }}></div>
                    Today
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <div style={{ width: 14, height: 14, borderRadius: 4, background: '#1a56db' }}></div>
                    Selected
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Selected date drives */}
            <div className="col-lg-5">
              <div className="form-card h-100">
                <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
                  <i className="bi bi-calendar-event text-primary me-2"></i>
                  {formatDate(selectedDate)}
                </h6>

                {selectedDrives.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-calendar-x" style={{ fontSize: '2.5rem', color: '#cbd5e1' }}></i>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: 12, marginBottom: 0 }}>
                      No drives on this date
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                      Click a highlighted date to see drives
                    </p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {selectedDrives.map(drive => (
                      <DriveCard key={drive._id} drive={drive} compact={false} />
                    ))}
                  </div>
                )}

                {/* Upcoming section below */}
                {upcoming.length > 0 && (
                  <div className="mt-3 pt-3" style={{ borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                      Upcoming in 30 days
                    </div>
                    <div className="d-flex flex-column gap-2">
                      {upcoming.slice(0, 4).map(drive => (
                        <div key={drive._id}
                          onClick={() => { setSelectedDate(new Date(drive.visitDate)); setSelectedDrives([drive]); }}
                          style={{ cursor: 'pointer' }}>
                          <DriveCard drive={drive} compact={true} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        ) : (

          /* ── LIST VIEW ── */
          <div>
            {/* Upcoming */}
            <div className="mb-4">
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669', display: 'inline-block' }}></span>
                Upcoming Drives
                <span style={{ fontSize: '0.75rem', background: '#f0fdf4', color: '#059669', padding: '2px 10px', borderRadius: 20, fontWeight: 600 }}>
                  {upcoming.length}
                </span>
              </div>
              {upcoming.length === 0 ? (
                <div className="form-card text-center py-4">
                  <i className="bi bi-calendar-x" style={{ fontSize: '2.5rem', color: '#cbd5e1' }}></i>
                  <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.85rem' }}>No upcoming drives in next 30 days</p>
                </div>
              ) : (
                <div className="row g-3">
                  {upcoming.map(drive => (
                    <div key={drive._id} className="col-md-6">
                      <DriveCard drive={drive} compact={false} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past */}
            {past.length > 0 && (
              <div>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#94a3b8', display: 'inline-block' }}></span>
                  Past Drives
                  <span style={{ fontSize: '0.75rem', background: '#f8fafc', color: '#64748b', padding: '2px 10px', borderRadius: 20, fontWeight: 600 }}>
                    {past.length}
                  </span>
                </div>
                <div className="row g-3">
                  {past.map(drive => (
                    <div key={drive._id} className="col-md-6">
                      <DriveCard drive={drive} compact={false} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}