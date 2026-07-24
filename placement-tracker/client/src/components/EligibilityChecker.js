import { useState } from 'react';
import axios from 'axios';

export default function EligibilityChecker({ companies = [] }) {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notifying, setNotifying] = useState(false);

  const fetchEligible = async () => {
    if (!selectedCompany) return alert('Select a company');
    setLoading(true);
    setResult(null);
    try {
      const { data } = await axios.get(`/api/eligibility/${selectedCompany}`);
      setResult(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const notifyStudents = async () => {
    if (!selectedCompany) return;
    setNotifying(true);
    try {
      const { data } = await axios.post(`/api/eligibility/${selectedCompany}/notify`);
      alert(`✅ Notified ${data.notified} students!`);
    } catch (err) {
      alert('Notification failed');
    } finally {
      setNotifying(false);
    }
  };

  const cgpaColor = (c) => c >= 8 ? '#059669' : c >= 6 ? '#d97706' : '#dc2626';

  return (
    <div className="form-card mt-3">
      <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
        <i className="bi bi-funnel-fill text-primary me-2"></i>Eligibility Engine
      </h6>

      {/* Company select */}
      <div className="row g-2 mb-3">
        <div className="col">
          <select
            className="form-select"
            value={selectedCompany}
            onChange={e => { setSelectedCompany(e.target.value); setResult(null); }}
          >
            <option value="">Select Company</option>
            {companies.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="col-auto">
          <button className="btn btn-primary" onClick={fetchEligible} disabled={loading}>
            {loading
              ? <><span className="spinner-border spinner-border-sm me-1" />Checking...</>
              : <><i className="bi bi-search me-1" />Check Eligible</>
            }
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div>
          {/* Criteria box */}
          <div style={{ background: '#eff6ff', borderRadius: 10, padding: '1rem', marginBottom: '1rem', border: '1px solid #bfdbfe' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e3a8a', marginBottom: 10 }}>
              <i className="bi bi-building-fill me-2"></i>{result.company.name} — Eligibility Criteria
            </div>
            <div className="d-flex flex-wrap gap-2">
              <span style={{ fontSize: '0.75rem', padding: '4px 12px', borderRadius: 20, background: '#dbeafe', color: '#1e40af', fontWeight: 600 }}>
                📊 CGPA ≥ {result.company.eligibilityCriteria.minCGPA}
              </span>
              <span style={{ fontSize: '0.75rem', padding: '4px 12px', borderRadius: 20, background: '#dbeafe', color: '#1e40af', fontWeight: 600 }}>
                ⚠️ Backlogs ≤ {result.company.eligibilityCriteria.maxBacklogs}
              </span>
              {result.company.eligibilityCriteria.branches?.map((b, i) => (
                <span key={i} style={{ fontSize: '0.75rem', padding: '4px 12px', borderRadius: 20, background: '#dbeafe', color: '#1e40af', fontWeight: 600 }}>
                  🏫 {b}
                </span>
              ))}
            </div>
          </div>

          {/* Count + notify */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#059669' }}>
                {result.total}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: 8 }}>eligible students found</span>
            </div>
            <button
              className="btn btn-success btn-sm"
              onClick={notifyStudents}
              disabled={notifying || result.total === 0}
            >
              {notifying
                ? <><span className="spinner-border spinner-border-sm me-1" />Notifying...</>
                : <><i className="bi bi-bell-fill me-1" />Notify All ({result.total})</>
              }
            </button>
          </div>

          {/* Student list */}
          {result.data.length === 0 ? (
            <div className="text-center py-4" style={{ background: '#f8fafc', borderRadius: 10, border: '2px dashed #e2e8f0' }}>
              <div style={{ fontSize: '2rem' }}>😔</div>
              <p style={{ color: '#94a3b8', marginTop: 8, fontSize: '0.85rem' }}>No eligible students found for this criteria</p>
            </div>
          ) : (
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {result.data.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', marginBottom: 6,
                  background: '#f8fafc', borderRadius: 10,
                  border: '1px solid #e2e8f0',
                }}>
                  {/* Avatar */}
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#1a56db,#06b6d4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 800, color: '#fff', flexShrink: 0,
                  }}>
                    {s.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>{s.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{s.rollNo} · {s.branch}</div>
                  </div>

                  {/* CGPA */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1rem', color: cgpaColor(s.cgpa) }}>{s.cgpa}</div>
                    <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>CGPA</div>
                  </div>

                  {/* Backlogs */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1rem', color: s.backlogs > 0 ? '#dc2626' : '#059669' }}>{s.backlogs}</div>
                    <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>Backlogs</div>
                  </div>

                  {/* Branch badge */}
                  <span style={{
                    fontSize: '0.68rem', padding: '3px 10px', borderRadius: 20,
                    background: '#eff6ff', color: '#1a56db', fontWeight: 700,
                  }}>{s.branch}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}