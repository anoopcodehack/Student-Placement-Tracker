

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