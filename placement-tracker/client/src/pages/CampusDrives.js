import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import DriveApplicantsModal from '../components/DriveApplicantsModal';
import { exportToExcel } from '../utils/exportUtils';
import { API_BASE_URL } from '../utils/runtimeConfig';

const COMPANY_LOGOS = {
  Google: '/Google-Emblema.png',
  Amazon: '/amazon.webp',
  Microsoft: '/microsoft.png',
  Swiggy: '/swiggy.webp',
  PhonePe: '/phonepay.jpg',
  TCS: '/tcs.webp',
  BHEL: '/bhel.png',
  Wipro: '/Wipro-logo.jpg',
};

const INDUSTRY_COLORS = {
  IT: '#1f5c3a',
  Product: '#153f28',
  Finance: '#d97706',
  Consulting: '#0891b2',
  Core: '#64748b',
  Startup: '#dc2626',
  PSU: '#7c3aed',
  Service: '#6366f1',
  Other: '#94a3b8',
};

export default function CampusDrives() {
  const { user, isAdmin } = useAuth();
  const [drives, setDrives] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tabFilter, setTabFilter] = useState('all'); // 'all' | 'eligible' | 'registered'
  const [branchFilter, setBranchFilter] = useState('');
  const [applyingId, setApplyingId] = useState(null);
  const [withdrawingDrive, setWithdrawingDrive] = useState(null);
  const [applicantsModalDrive, setApplicantsModalDrive] = useState(null);
  const [notifyingId, setNotifyingId] = useState(null);

  const fetchDrives = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/applications/drives');
      setDrives(res.data.data || []);
      if (res.data.student) {
        setStudentInfo(res.data.student);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch campus drives');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrives();
  }, [fetchDrives]);

  const isStudent = !isAdmin && (user?.isStudent || user?.role === 'student' || Boolean(studentInfo));

  // 1-Click Apply Handler
  const handleApply = async (companyId, companyName) => {
    setApplyingId(companyId);
    try {
      const res = await axios.post(`/api/applications/apply/${companyId}`);
      toast.success(res.data.message || `Registered successfully for ${companyName}!`);
      // Refresh drives list
      await fetchDrives();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplyingId(null);
    }
  };

  // Withdraw Application Handler
  const handleConfirmWithdraw = async () => {
    if (!withdrawingDrive) return;
    try {
      await axios.delete(`/api/applications/withdraw/${withdrawingDrive._id}`);
      toast.success(`Application for ${withdrawingDrive.name} withdrawn successfully`);
      setWithdrawingDrive(null);
      await fetchDrives();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to withdraw application');
    }
  };

  // Notify Eligible Students (Admin action)
  const handleNotifyEligible = async (companyId, companyName) => {
    setNotifyingId(companyId);
    try {
      const res = await axios.post(`/api/eligibility/${companyId}/notify`);
      toast.success(res.data.message || `Notified eligible students for ${companyName}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send notifications');
    } finally {
      setNotifyingId(null);
    }
  };

  // Quick Direct Excel Export (Admin action from card)
  const handleQuickExport = async (companyId, companyName) => {
    try {
      toast.info(`Fetching applicants for ${companyName}...`);
      const res = await axios.get(`/api/applications/company/${companyId}/applicants`);
      const list = res.data.data || [];
      if (list.length === 0) {
        toast.warning(`No students have registered for ${companyName} yet`);
        return;
      }
      const excelRows = list.map((app, index) => {
        let resumeUrl = app.resume || '';
        if (resumeUrl && !resumeUrl.startsWith('http')) {
          resumeUrl = `${API_BASE_URL}${resumeUrl}`;
        }
        return {
          'S.No': index + 1,
          'USN / Roll No': app.rollNo || 'N/A',
          'Candidate Name': app.name,
          'Branch': app.branch || 'N/A',
          'Batch': app.batch || 'N/A',
          'CGPA': app.cgpa != null ? app.cgpa : 'N/A',
          '10th %': app.tenthPercent || 'N/A',
          '12th %': app.twelfthPercent || 'N/A',
          'Active Backlogs': app.backlogs != null ? app.backlogs : 0,
          'Email': app.email || 'N/A',
          'Phone': app.phone || 'N/A',
          'Resume Link': resumeUrl || 'Not uploaded',
          'Registration Date': app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A',
          'Status': app.status || 'Applied'
        };
      });
      const cleanName = companyName.replace(/[^a-zA-Z0-9_-]/g, '_');
      exportToExcel(excelRows, `${cleanName}_Campus_Drive_Applicants`);
      toast.success(`Exported ${list.length} applicants to Excel!`);
    } catch (err) {
      toast.error('Failed to export applicants list');
    }
  };

  // Filter drives
  const filteredDrives = drives.filter(d => {
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = d.name && d.name.toLowerCase().includes(q);
      const matchRole = d.roles && d.roles.some(r => r.toLowerCase().includes(q));
      const matchInd = d.industry && d.industry.toLowerCase().includes(q);
      if (!matchName && !matchRole && !matchInd) return false;
    }
    // Branch filter
    if (branchFilter) {
      const bList = d.eligibilityCriteria?.branches || [];
      if (bList.length > 0 && !bList.includes(branchFilter)) return false;
    }
    // Tab filter
    if (tabFilter === 'eligible') {
      return d.isEligible === true;
    }
    if (tabFilter === 'registered') {
      return d.hasApplied === true;
    }
    return true;
  });

  const totalDrives = drives.length;
  const eligibleCount = drives.filter(d => d.isEligible).length;
  const registeredCount = drives.filter(d => d.hasApplied).length;
  const totalApplicantsCount = drives.reduce((sum, d) => sum + (d.applicantsCount || 0), 0);

  return (
    <div className="campus-drives-page">
      {/* Top Header */}
      <div className="topbar mb-4">
        <div>
          <h1 className="page-title d-flex align-items-center gap-2">
            <i className="bi bi-clipboard-check-fill text-primary"></i>
            Campus Recruitment Drives
          </h1>
          <p className="page-sub">
            Real-time eligibility engine, instant 1-click registration, and HR-ready candidate spreadsheets
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          {isAdmin ? (
            <>
              <Link to="/companies/add" className="btn btn-primary d-inline-flex align-items-center gap-1">
                <i className="bi bi-building-add"></i> Create Drive
              </Link>
              <Link to="/companies" className="btn btn-outline-secondary d-inline-flex align-items-center gap-1">
                <i className="bi bi-building"></i> Companies
              </Link>
            </>
          ) : (
            <Link to="/profile" className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1">
              <i className="bi bi-person-badge"></i> My Profile
            </Link>
          )}
        </div>
      </div>

      {/* Student Profile Quick Evaluator Bar (if student) */}
      {isStudent && studentInfo && (
        <div
          className="p-3 mb-4 rounded-3 d-flex flex-wrap align-items-center justify-content-between gap-3"
          style={{
            background: 'linear-gradient(135deg, rgba(31, 92, 58, 0.08) 0%, rgba(159, 230, 190, 0.15) 100%)',
            border: '1px solid rgba(31, 92, 58, 0.2)'
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
              style={{ width: 44, height: 44, background: '#1F5C3A', fontSize: '1rem' }}
            >
              <i className="bi bi-person-check-fill"></i>
            </div>
            <div>
              <div className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>
                Evaluating Eligibility For: <span className="text-primary">{studentInfo.name}</span>
                {studentInfo.rollNo && <span className="text-muted ms-2">({studentInfo.rollNo})</span>}
              </div>
              <div className="d-flex flex-wrap align-items-center gap-2 mt-1" style={{ fontSize: '0.8rem' }}>
                <span className="badge bg-light text-dark border">
                  Branch: <strong>{studentInfo.branch || 'N/A'}</strong>
                </span>
                <span className="badge bg-light text-dark border">
                  CGPA: <strong className="text-success">{studentInfo.cgpa != null ? studentInfo.cgpa : '—'}</strong>
                </span>
                <span className="badge bg-light text-dark border">
                  Active Backlogs: <strong>{studentInfo.backlogs != null ? studentInfo.backlogs : 0}</strong>
                </span>
                <span className={`badge ${studentInfo.isPlaced ? 'bg-warning-subtle text-warning' : 'bg-success-subtle text-success'}`}>
                  {studentInfo.isPlaced ? 'Placed' : 'Seeking Placement'}
                </span>
              </div>
            </div>
          </div>
          <div>
            <Link to="/profile" className="btn btn-sm btn-outline-success" style={{ fontSize: '0.8rem' }}>
              <i className="bi bi-pencil-square me-1"></i> Update Profile
            </Link>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-md-4">
          <div className="card h-100 border-0 shadow-sm p-3" style={{ borderRadius: 14 }}>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="text-muted text-uppercase" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Active Drives</div>
                <div className="fw-bold mt-1" style={{ fontSize: '1.6rem', color: '#1F5C3A' }}>{totalDrives}</div>
                <div className="text-muted" style={{ fontSize: '0.78rem' }}>On-campus hiring drives</div>
              </div>
              <div className="p-3 rounded-3" style={{ background: 'rgba(31, 92, 58, 0.1)', color: '#1F5C3A', fontSize: '1.4rem' }}>
                <i className="bi bi-building"></i>
              </div>
            </div>
          </div>
        </div>

        {isStudent ? (
          <>
            <div className="col-12 col-sm-6 col-md-4">
              <div className="card h-100 border-0 shadow-sm p-3" style={{ borderRadius: 14 }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="text-muted text-uppercase" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Eligible For You</div>
                    <div className="fw-bold mt-1" style={{ fontSize: '1.6rem', color: '#059669' }}>{eligibleCount}</div>
                    <div className="text-muted" style={{ fontSize: '0.78rem' }}>Criteria matched your profile</div>
                  </div>
                  <div className="p-3 rounded-3" style={{ background: 'rgba(5, 150, 105, 0.1)', color: '#059669', fontSize: '1.4rem' }}>
                    <i className="bi bi-check2-circle"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4">
              <div className="card h-100 border-0 shadow-sm p-3" style={{ borderRadius: 14 }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="text-muted text-uppercase" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Your Registrations</div>
                    <div className="fw-bold mt-1" style={{ fontSize: '1.6rem', color: '#0284c7' }}>{registeredCount}</div>
                    <div className="text-muted" style={{ fontSize: '0.78rem' }}>Drives applied with 1-click</div>
                  </div>
                  <div className="p-3 rounded-3" style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7', fontSize: '1.4rem' }}>
                    <i className="bi bi-send-check"></i>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="col-12 col-sm-6 col-md-4">
              <div className="card h-100 border-0 shadow-sm p-3" style={{ borderRadius: 14 }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="text-muted text-uppercase" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Total Student Registrations</div>
                    <div className="fw-bold mt-1" style={{ fontSize: '1.6rem', color: '#059669' }}>{totalApplicantsCount}</div>
                    <div className="text-muted" style={{ fontSize: '0.78rem' }}>Applications submitted by students</div>
                  </div>
                  <div className="p-3 rounded-3" style={{ background: 'rgba(5, 150, 105, 0.1)', color: '#059669', fontSize: '1.4rem' }}>
                    <i className="bi bi-people-fill"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4">
              <div className="card h-100 border-0 shadow-sm p-3" style={{ borderRadius: 14 }}>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="text-muted text-uppercase" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Drive Management</div>
                    <div className="fw-bold mt-1" style={{ fontSize: '1.6rem', color: '#6366f1' }}>Excel Export</div>
                    <div className="text-muted" style={{ fontSize: '0.78rem' }}>Export student rosters per company</div>
                  </div>
                  <div className="p-3 rounded-3" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', fontSize: '1.4rem' }}>
                    <i className="bi bi-file-earmark-excel"></i>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm p-3 mb-4" style={{ borderRadius: 14 }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          
          {/* Tabs */}
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn btn-sm ${tabFilter === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setTabFilter('all')}
            >
              All Drives ({totalDrives})
            </button>
            {isStudent && (
              <>
                <button
                  type="button"
                  className={`btn btn-sm ${tabFilter === 'eligible' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setTabFilter('eligible')}
                >
                  <i className="bi bi-check-circle me-1"></i> Eligible for Me ({eligibleCount})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${tabFilter === 'registered' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setTabFilter('registered')}
                >
                  <i className="bi bi-send-check me-1"></i> Registered ({registeredCount})
                </button>
              </>
            )}
          </div>

          {/* Search & Branch Select */}
          <div className="d-flex align-items-center gap-2 flex-grow-1 justify-content-end" style={{ maxWidth: 500 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <i className="bi bi-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.85rem' }}></i>
              <input
                type="text"
                className="form-control form-control-sm"
                style={{ paddingLeft: 32 }}
                placeholder="Search company, role..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="form-select form-select-sm"
              style={{ width: 150 }}
              value={branchFilter}
              onChange={e => setBranchFilter(e.target.value)}
            >
              <option value="">All Branches</option>
              {['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'AIDS', 'AIML', 'CSD'].map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Drives List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.875rem' }}>Evaluating drives & eligibility criteria...</p>
        </div>
      ) : filteredDrives.length === 0 ? (
        <div className="card border-0 shadow-sm text-center py-5" style={{ borderRadius: 14 }}>
          <div className="mb-2" style={{ fontSize: '2.5rem', color: '#94a3b8' }}>
            <i className="bi bi-calendar-x"></i>
          </div>
          <h5 className="fw-bold">No campus drives found</h5>
          <p className="text-muted mb-3" style={{ fontSize: '0.875rem' }}>
            {tabFilter === 'eligible'
              ? 'None of the active drives currently match your profile criteria.'
              : tabFilter === 'registered'
              ? "You haven't registered for any drives yet. Check eligible drives and apply in 1-click!"
              : 'Try clearing your search or branch filters.'}
          </p>
          {(search || branchFilter || tabFilter !== 'all') && (
            <div>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => { setSearch(''); setBranchFilter(''); setTabFilter('all'); }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredDrives.map(drive => {
            const logoSrc = COMPANY_LOGOS[drive.name] || drive.logo;
            const indColor = INDUSTRY_COLORS[drive.industry] || '#1f5c3a';
            const minCGPA = drive.eligibilityCriteria?.minCGPA != null ? drive.eligibilityCriteria.minCGPA : 0;
            const maxBacklogs = drive.eligibilityCriteria?.maxBacklogs != null ? drive.eligibilityCriteria.maxBacklogs : 0;
            const branches = drive.eligibilityCriteria?.branches || [];

            return (
              <div
                key={drive._id}
                className="card border-0 shadow-sm p-4 transition-all"
                style={{
                  borderRadius: 16,
                  borderLeft: `4px solid ${drive.hasApplied ? '#059669' : drive.isEligible ? '#1F5C3A' : '#cbd5e1'}`
                }}
              >
                <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3">
                  
                  {/* Left: Company & Meta */}
                  <div className="d-flex align-items-start gap-3 flex-grow-1">
                    {/* Logo */}
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center bg-white shadow-sm flex-shrink-0"
                      style={{ width: 56, height: 56, border: '1px solid #e2e8f0', padding: 4 }}
                    >
                      {logoSrc ? (
                        <img
                          src={logoSrc}
                          alt={drive.name}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                          onError={e => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <span className="fw-bold text-secondary" style={{ fontSize: '1.2rem' }}>
                          {drive.name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Company info */}
                    <div>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <h4 className="fw-bold mb-0 text-dark" style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.2rem' }}>
                          {drive.name}
                        </h4>
                        {drive.industry && (
                          <span
                            className="badge"
                            style={{
                              backgroundColor: `${indColor}18`,
                              color: indColor,
                              fontWeight: 600,
                              fontSize: '0.72rem'
                            }}
                          >
                            {drive.industry}
                          </span>
                        )}
                        {drive.visitDate && (
                          <span className="badge bg-light text-muted border" style={{ fontSize: '0.72rem' }}>
                            <i className="bi bi-calendar-event me-1"></i>
                            {new Date(drive.visitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                      </div>

                      {/* Roles */}
                      {drive.roles && drive.roles.length > 0 && (
                        <div className="d-flex flex-wrap gap-1 mt-2">
                          {drive.roles.map((r, i) => (
                            <span key={i} className="badge bg-light text-secondary border" style={{ fontSize: '0.75rem', fontWeight: 500 }}>
                              <i className="bi bi-briefcase me-1 text-muted"></i>{r}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Package & Applicants */}
                      <div className="d-flex flex-wrap align-items-center gap-3 mt-2 text-muted" style={{ fontSize: '0.82rem' }}>
                        {drive.packageRange?.min != null && drive.packageRange?.max != null && (
                          <div>
                            <i className="bi bi-cash-stack text-success me-1"></i>
                            <strong>₹{drive.packageRange.min} – {drive.packageRange.max} LPA</strong>
                          </div>
                        )}
                        <div>
                          <i className="bi bi-people me-1"></i>
                          <span><strong>{drive.applicantsCount || 0}</strong> applicants registered</span>
                        </div>
                        {drive.website && (
                          <div>
                            <a href={drive.website.startsWith('http') ? drive.website : `https://${drive.website}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-primary">
                              <i className="bi bi-box-arrow-up-right me-1"></i> Website
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Status Pill */}
                  <div className="text-md-end flex-shrink-0">
                    {drive.hasApplied ? (
                      <span className="badge px-3 py-2 text-white d-inline-flex align-items-center gap-1 shadow-sm" style={{ background: '#1F5C3A', fontSize: '0.82rem' }}>
                        <i className="bi bi-check-circle-fill"></i> Registered
                      </span>
                    ) : drive.isEligible ? (
                      <span className="badge px-3 py-2 bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1" style={{ fontSize: '0.82rem' }}>
                        <i className="bi bi-check2"></i> Eligible to Apply
                      </span>
                    ) : (
                      <span className="badge px-3 py-2 bg-light text-secondary border d-inline-flex align-items-center gap-1" style={{ fontSize: '0.82rem' }}>
                        <i className="bi bi-x-circle"></i> Criteria Not Met
                      </span>
                    )}
                  </div>

                </div>

                {/* Eligibility Breakdown Bar */}
                <div className="mt-3 pt-3 border-top">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-uppercase fw-semibold text-muted" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                      <i className="bi bi-sliders me-1"></i> Drive Criteria & Eligibility Check
                    </span>
                    {!isStudent && (
                      <span className="badge bg-light text-muted border" style={{ fontSize: '0.72rem' }}>
                        Default criteria
                      </span>
                    )}
                  </div>

                  <div className="row g-2">
                    {/* CGPA */}
                    <div className="col-6 col-sm-3">
                      <div className="p-2 rounded bg-light border" style={{ fontSize: '0.78rem' }}>
                        <div className="text-muted">Min CGPA</div>
                        <div className="fw-bold mt-1 d-flex align-items-center justify-content-between">
                          <span>≥ {minCGPA}</span>
                          {isStudent && (
                            drive.eligibilityChecks?.find(c => c.type === 'cgpa')?.passed ? (
                              <i className="bi bi-check-circle-fill text-success" title="Passed"></i>
                            ) : (
                              <i className="bi bi-x-circle-fill text-danger" title="Below requirement"></i>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Backlogs */}
                    <div className="col-6 col-sm-3">
                      <div className="p-2 rounded bg-light border" style={{ fontSize: '0.78rem' }}>
                        <div className="text-muted">Max Backlogs</div>
                        <div className="fw-bold mt-1 d-flex align-items-center justify-content-between">
                          <span>≤ {maxBacklogs}</span>
                          {isStudent && (
                            drive.eligibilityChecks?.find(c => c.type === 'backlogs')?.passed ? (
                              <i className="bi bi-check-circle-fill text-success" title="Passed"></i>
                            ) : (
                              <i className="bi bi-x-circle-fill text-danger" title="Too many backlogs"></i>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Branches */}
                    <div className="col-6 col-sm-3">
                      <div className="p-2 rounded bg-light border" style={{ fontSize: '0.78rem' }}>
                        <div className="text-muted">Branches</div>
                        <div className="fw-bold mt-1 text-truncate d-flex align-items-center justify-content-between" title={branches.length > 0 ? branches.join(', ') : 'All Branches'}>
                          <span className="text-truncate">{branches.length > 0 ? branches.join(', ') : 'All Branches'}</span>
                          {isStudent && (
                            drive.eligibilityChecks?.find(c => c.type === 'branch')?.passed ? (
                              <i className="bi bi-check-circle-fill text-success ms-1" title="Passed"></i>
                            ) : (
                              <i className="bi bi-x-circle-fill text-danger ms-1" title="Branch not eligible"></i>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-6 col-sm-3">
                      <div className="p-2 rounded bg-light border" style={{ fontSize: '0.78rem' }}>
                        <div className="text-muted">Hiring Status</div>
                        <div className="fw-bold mt-1 d-flex align-items-center justify-content-between">
                          <span>Unplaced Only</span>
                          {isStudent && (
                            drive.eligibilityChecks?.find(c => c.type === 'placement_status')?.passed ? (
                              <i className="bi bi-check-circle-fill text-success" title="Passed"></i>
                            ) : (
                              <i className="bi bi-x-circle-fill text-danger" title="Already placed"></i>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feedback line if ineligible */}
                  {isStudent && !drive.isEligible && (
                    <div className="alert alert-warning py-2 px-3 mt-2 mb-0 d-flex align-items-center gap-2" style={{ fontSize: '0.78rem', borderRadius: 8 }}>
                      <i className="bi bi-exclamation-triangle-fill text-warning"></i>
                      <span>
                        <strong>Ineligible: </strong>
                        {drive.eligibilityChecks?.filter(c => !c.passed).map(c => c.reason).join(' · ') || 'Does not match drive criteria'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="mt-3 pt-3 border-top d-flex flex-wrap align-items-center justify-content-between gap-2">
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                    {drive.hasApplied && drive.application?.appliedAt && (
                      <span>
                        <i className="bi bi-clock-history me-1"></i>
                        Applied on {new Date(drive.application.appliedAt).toLocaleDateString()} at {new Date(drive.application.appliedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>

                  {/* Actions based on role */}
                  <div className="d-flex align-items-center gap-2">
                    {/* Admin Actions */}
                    {isAdmin && (
                      <>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                          onClick={() => setApplicantsModalDrive(drive)}
                        >
                          <i className="bi bi-people-fill"></i>
                          Applicants ({drive.applicantsCount || 0})
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1"
                          onClick={() => handleQuickExport(drive._id, drive.name)}
                        >
                          <i className="bi bi-file-earmark-excel-fill"></i>
                          Export Excel
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
                          disabled={notifyingId === drive._id}
                          onClick={() => handleNotifyEligible(drive._id, drive.name)}
                          title="Send notification to all eligible students"
                        >
                          <i className="bi bi-bell-fill"></i>
                          {notifyingId === drive._id ? 'Notifying...' : 'Notify'}
                        </button>
                      </>
                    )}

                    {/* Student Actions */}
                    {isStudent && (
                      <>
                        {drive.hasApplied ? (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                            onClick={() => setWithdrawingDrive(drive)}
                          >
                            <i className="bi bi-x-circle"></i> Withdraw Application
                          </button>
                        ) : drive.isEligible ? (
                          <button
                            type="button"
                            className="btn btn-sm btn-success d-inline-flex align-items-center gap-1 px-3"
                            style={{ background: '#1F5C3A', borderColor: '#1F5C3A' }}
                            disabled={applyingId === drive._id}
                            onClick={() => handleApply(drive._id, drive.name)}
                          >
                            {applyingId === drive._id ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                                Registering...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-send-check-fill"></i> 1-Click Apply
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary opacity-75"
                            disabled
                          >
                            <i className="bi bi-slash-circle me-1"></i> Ineligible
                          </button>
                        )}
                      </>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Admin Applicants Modal */}
      {applicantsModalDrive && (
        <DriveApplicantsModal
          companyId={applicantsModalDrive._id}
          companyName={applicantsModalDrive.name}
          onClose={() => {
            setApplicantsModalDrive(null);
            fetchDrives();
          }}
        />
      )}

      {/* Confirm Withdraw Modal */}
      <ConfirmModal
        show={Boolean(withdrawingDrive)}
        title="Withdraw Application"
        message={`Are you sure you want to withdraw your application for ${withdrawingDrive?.name}? You can re-register later if the drive is still open.`}
        confirmText="Withdraw"
        confirmVariant="danger"
        onConfirm={handleConfirmWithdraw}
        onCancel={() => setWithdrawingDrive(null)}
      />
    </div>
  );
}
