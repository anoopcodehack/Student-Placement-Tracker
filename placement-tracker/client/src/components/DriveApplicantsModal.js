import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { exportToExcel } from '../utils/exportUtils';
import { API_BASE_URL } from '../utils/runtimeConfig';

export default function DriveApplicantsModal({ companyId, companyName, onClose }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ company: {}, total: 0, data: [] });
  const [search, setSearch] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!companyId) return;
    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/applications/company/${companyId}/applicants`);
        setData(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch applicants');
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [companyId]);

  const filteredApplicants = (data.data || []).filter(app => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (app.name && app.name.toLowerCase().includes(q)) ||
      (app.rollNo && app.rollNo.toLowerCase().includes(q)) ||
      (app.branch && app.branch.toLowerCase().includes(q)) ||
      (app.email && app.email.toLowerCase().includes(q))
    );
  });

  const handleExportExcel = () => {
    if (!data.data || data.data.length === 0) {
      toast.warning('No applicants to export');
      return;
    }
    setExporting(true);
    try {
      const excelRows = data.data.map((app, index) => {
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

      const cleanCompanyName = (companyName || data.company?.name || 'Company').replace(/[^a-zA-Z0-9_-]/g, '_');
      exportToExcel(excelRows, `${cleanCompanyName}_Applicants`);
      toast.success('Applicant list exported to Excel successfully!');
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to export to Excel');
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={onClose} />
      <div className="modal fade show d-block" style={{ zIndex: 1050 }} tabIndex="-1">
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content" style={{ borderRadius: 16, border: 'none', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>
            
            {/* Modal Header */}
            <div className="modal-header border-bottom px-4 py-3">
              <div>
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2 mb-1" style={{ fontFamily: 'Syne,sans-serif' }}>
                  <i className="bi bi-people-fill text-primary"></i>
                  {companyName || data.company?.name || 'Company'} — Registered Applicants
                </h5>
                <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                  Total Registrations: <strong className="text-dark">{data.total || 0}</strong> students
                  {data.company?.packageRange && (
                    <span className="ms-3">
                      Package: <strong>₹{data.company.packageRange.min || '—'}–{data.company.packageRange.max || '—'} LPA</strong>
                    </span>
                  )}
                </p>
              </div>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>

            {/* Sub-bar: Search & Actions */}
            <div className="px-4 py-3 bg-light border-bottom d-flex flex-wrap align-items-center justify-content-between gap-2">
              <div style={{ position: 'relative', width: 280, maxWidth: '100%' }}>
                <i className="bi bi-search" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.85rem' }}></i>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  style={{ paddingLeft: 30 }}
                  placeholder="Filter by name, USN, branch..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-success d-inline-flex align-items-center gap-1"
                  onClick={handleExportExcel}
                  disabled={exporting || loading || (data.data && data.data.length === 0)}
                  style={{ background: '#1F5C3A', borderColor: '#1F5C3A' }}
                >
                  <i className="bi bi-file-earmark-excel-fill"></i>
                  {exporting ? 'Generating...' : 'Export to Excel (.xlsx)'}
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="modal-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.875rem' }}>Fetching applicants...</p>
                </div>
              ) : filteredApplicants.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-2" style={{ fontSize: '2rem', color: '#94a3b8' }}>
                    <i className="bi bi-inbox"></i>
                  </div>
                  <h6 className="fw-semibold text-secondary">No applicants found</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                    {search ? 'No applicants match your search filter.' : 'No students have applied for this campus drive yet.'}
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.875rem' }}>
                    <thead className="table-light text-muted" style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      <tr>
                        <th style={{ width: 50 }} className="ps-4">#</th>
                        <th>USN / Roll No</th>
                        <th>Student Name</th>
                        <th>Branch & Batch</th>
                        <th>CGPA</th>
                        <th>Backlogs</th>
                        <th>10th / 12th</th>
                        <th>Contact</th>
                        <th>Resume</th>
                        <th>Applied On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplicants.map((app, idx) => {
                        let resumeUrl = app.resume;
                        if (resumeUrl && !resumeUrl.startsWith('http')) {
                          resumeUrl = `${API_BASE_URL}${resumeUrl}`;
                        }
                        return (
                          <tr key={app.applicationId || idx}>
                            <td className="ps-4 text-muted fw-semibold">{idx + 1}</td>
                            <td>
                              <span className="badge bg-light text-dark border font-monospace">
                                {app.rollNo}
                              </span>
                            </td>
                            <td>
                              <div className="fw-bold text-dark">{app.name}</div>
                              <div className="text-muted" style={{ fontSize: '0.75rem' }}>{app.email}</div>
                            </td>
                            <td>
                              <span className="badge bg-secondary-subtle text-secondary me-1">{app.branch}</span>
                              <span className="text-muted" style={{ fontSize: '0.8rem' }}>{app.batch}</span>
                            </td>
                            <td>
                              <span
                                className="fw-bold"
                                style={{
                                  color: (app.cgpa >= 8.5) ? '#1f5c3a' : (app.cgpa >= 7) ? '#0891b2' : '#d97706'
                                }}
                              >
                                {app.cgpa != null ? app.cgpa : '—'}
                              </span>
                            </td>
                            <td>
                              {app.backlogs > 0 ? (
                                <span className="badge bg-danger-subtle text-danger">{app.backlogs} backlogs</span>
                              ) : (
                                <span className="badge bg-success-subtle text-success">0</span>
                              )}
                            </td>
                            <td>
                              <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                                {app.tenthPercent} / {app.twelfthPercent}
                              </span>
                            </td>
                            <td>
                              <div style={{ fontSize: '0.8rem' }}>{app.phone || '—'}</div>
                            </td>
                            <td>
                              {resumeUrl ? (
                                <a
                                  href={resumeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-primary py-0 px-2 d-inline-flex align-items-center gap-1"
                                  style={{ fontSize: '0.75rem' }}
                                >
                                  <i className="bi bi-file-earmark-person"></i> View
                                </a>
                              ) : (
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>None</span>
                              )}
                            </td>
                            <td className="text-muted" style={{ fontSize: '0.8rem' }}>
                              {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer border-top px-4 py-2 d-flex justify-content-between">
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                Showing {filteredApplicants.length} of {data.total || 0} registered candidates
              </span>
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
                Close
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
