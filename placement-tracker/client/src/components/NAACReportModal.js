import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { generateNAACReportPDF, exportNAACExcel } from '../utils/naacReportGenerator';

export default function NAACReportModal({ show, onClose }) {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [reportRef, setReportRef] = useState(
    `SCEM/TPO/NAAC-5.2.1/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`
  );

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [overview, setOverview] = useState({});
  const [branchData, setBranchData] = useState([]);
  const [packageDist, setPackageDist] = useState([]);
  const [placements, setPlacements] = useState([]);

  // Fetch audit data based on selected batch
  const fetchAuditData = useCallback(async () => {
    setLoading(true);
    try {
      const params = selectedBatch ? { batch: selectedBatch } : {};
      const [ovRes, brRes, pkgRes, plRes, batchRes] = await Promise.all([
        axios.get('/api/stats/overview', { params }),
        axios.get('/api/stats/branch-wise', { params }),
        axios.get('/api/stats/package-distribution'),
        axios.get('/api/placements'),
        axios.get('/api/stats/batches'),
      ]);

      setOverview(ovRes.data.data || {});
      setBranchData(brRes.data.data || []);
      setPackageDist(pkgRes.data.data || []);
      setBatches(batchRes.data.data || []);

      // Filter placements by batch and branch if selected
      let filteredPlacements = plRes.data.data || [];
      if (selectedBatch) {
        filteredPlacements = filteredPlacements.filter(
          p => p.student?.batch === parseInt(selectedBatch, 10)
        );
      }
      if (selectedBranch && selectedBranch !== 'All') {
        filteredPlacements = filteredPlacements.filter(
          p => p.student?.branch === selectedBranch
        );
      }
      setPlacements(filteredPlacements);

    } catch (err) {
      console.error(err);
      toast.error('Failed to load NAAC audit metrics');
    } finally {
      setLoading(false);
    }
  }, [selectedBatch, selectedBranch]);

  useEffect(() => {
    if (show) {
      fetchAuditData();
    }
  }, [show, fetchAuditData]);

  if (!show) return null;

  // Handle PDF Generation
  const handleDownloadPDF = () => {
    setGenerating(true);
    try {
      toast.info('Rendering Official NAAC Criterion 5.2.1 PDF Report...');
      generateNAACReportPDF({
        batch: selectedBatch ? `Batch ${selectedBatch}` : 'All Batches (Aggregate)',
        overview,
        branchData: selectedBranch === 'All' ? branchData : branchData.filter(b => b._id === selectedBranch),
        packageDist,
        placements,
        reportRef,
      });
      toast.success('Official NAAC PDF downloaded successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate NAAC PDF report');
    } finally {
      setGenerating(false);
    }
  };

  // Handle Excel Export
  const handleDownloadExcel = () => {
    try {
      toast.info('Generating NAAC-compliant Excel spreadsheet...');
      exportNAACExcel({
        batch: selectedBatch ? `Batch ${selectedBatch}` : 'All Batches',
        overview,
        branchData: selectedBranch === 'All' ? branchData : branchData.filter(b => b._id === selectedBranch),
        placements,
      });
      toast.success('NAAC Excel spreadsheet exported successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to export NAAC spreadsheet');
    }
  };

  const placementRate = overview.placementRate != null
    ? `${overview.placementRate}%`
    : (overview.totalStudents ? `${((overview.placedStudents / overview.totalStudents) * 100).toFixed(1)}%` : '0%');

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={onClose} />
      <div className="modal fade show d-block" style={{ zIndex: 1050 }} tabIndex="-1">
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content" style={{ borderRadius: 16, border: 'none', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>
            
            {/* Modal Header */}
            <div className="modal-header border-bottom px-4 py-3" style={{ background: '#f8faf8' }}>
              <div>
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2 mb-1" style={{ fontFamily: 'Syne,sans-serif' }}>
                  <i className="bi bi-file-earmark-check-fill text-success"></i>
                  Official NAAC / TPO Placement Audit Report Generator
                </h5>
                <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                  Institutional-grade report generator compliant with <strong>NAAC SSR Criterion 5.2.1</strong>, NBA, and NIRF audits
                </p>
              </div>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>

            {/* Sub-bar: Filter & Configuration Controls */}
            <div className="px-4 py-3 bg-light border-bottom">
              <div className="row g-2 align-items-center">
                <div className="col-12 col-sm-4 col-md-3">
                  <label className="form-label text-muted fw-semibold mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    Academic Batch
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={selectedBatch}
                    onChange={e => setSelectedBatch(e.target.value)}
                  >
                    <option value="">All Batches (Aggregate)</option>
                    {batches.map(b => (
                      <option key={b} value={b}>Batch {b}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-sm-4 col-md-3">
                  <label className="form-label text-muted fw-semibold mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    Program / Branch
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={selectedBranch}
                    onChange={e => setSelectedBranch(e.target.value)}
                  >
                    <option value="All">All Departments</option>
                    {['CSE', 'ECE', 'EEE', 'ME', 'CE', 'IT', 'AIDS', 'AIML', 'CSD'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-sm-4 col-md-6">
                  <label className="form-label text-muted fw-semibold mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    Report Reference Number
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm font-monospace"
                    value={reportRef}
                    onChange={e => setReportRef(e.target.value)}
                    placeholder="SCEM/TPO/NAAC-5.2.1/2026/041"
                  />
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="modal-body p-4">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.85rem' }}>Aggregating accreditation records...</p>
                </div>
              ) : (
                <div>
                  {/* Institutional Header Preview Callout */}
                  <div
                    className="p-3 mb-4 rounded-3 text-center border"
                    style={{
                      background: 'linear-gradient(180deg, #ffffff 0%, #f7f9f7 100%)',
                      borderColor: 'rgba(31, 92, 58, 0.2)'
                    }}
                  >
                    <div className="fw-bold text-uppercase" style={{ color: '#1F5C3A', fontSize: '1.05rem', letterSpacing: '0.03em' }}>
                      Sahyadri College of Engineering & Management, Mangaluru
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                      Autonomous Institute Affiliated to VTU Belagavi | Approved by AICTE, New Delhi | Accredited by NAAC with &apos;A&apos; Grade
                    </div>
                    <div className="fw-bold text-dark mt-1" style={{ fontSize: '0.85rem' }}>
                      DEPARTMENT OF TRAINING & PLACEMENT (PlaceTrack Central Portal)
                    </div>
                    <div className="badge bg-success-subtle text-success border border-success-subtle mt-1 px-3 py-1" style={{ fontSize: '0.75rem' }}>
                      Official Audit Copy for NAAC SSR Criterion 5.2.1 & NBA Documentation
                    </div>
                  </div>

                  {/* 4 Core NAAC Indicator Cards */}
                  <div className="row g-3 mb-4">
                    <div className="col-6 col-md-3">
                      <div className="p-3 rounded-3 bg-light border text-center h-100">
                        <div className="text-muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>
                          Outgoing Cohort
                        </div>
                        <div className="fw-bold text-dark mt-1" style={{ fontSize: '1.4rem' }}>
                          {overview.totalStudents || 0}
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>Graduating Students</div>
                      </div>
                    </div>

                    <div className="col-6 col-md-3">
                      <div className="p-3 rounded-3 bg-light border text-center h-100">
                        <div className="text-muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>
                          Placed Students
                        </div>
                        <div className="fw-bold text-success mt-1" style={{ fontSize: '1.4rem', color: '#1F5C3A' }}>
                          {overview.placedStudents || 0}
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>Verified Appointments</div>
                      </div>
                    </div>

                    <div className="col-6 col-md-3">
                      <div className="p-3 rounded-3 bg-light border text-center h-100">
                        <div className="text-muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>
                          NAAC 5.2.1 Placement Rate
                        </div>
                        <div className="fw-bold mt-1" style={{ fontSize: '1.4rem', color: '#059669' }}>
                          {placementRate}
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>Accreditation KPI</div>
                      </div>
                    </div>

                    <div className="col-6 col-md-3">
                      <div className="p-3 rounded-3 bg-light border text-center h-100">
                        <div className="text-muted" style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>
                          Average & Max CTC
                        </div>
                        <div className="fw-bold text-dark mt-1" style={{ fontSize: '1.1rem' }}>
                          ₹{overview.avgPackage || 0} / ₹{overview.maxPackage || 0} LPA
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>Compensation Metric</div>
                      </div>
                    </div>
                  </div>

                  {/* Department-wise Table Preview */}
                  <div className="card border rounded-3 mb-4">
                    <div className="card-header bg-light py-2 px-3 d-flex align-items-center justify-content-between">
                      <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>
                        <i className="bi bi-table text-primary me-2"></i>
                        Department-Wise NAAC Criterion 5.2.1 Audit Breakdown
                      </span>
                      <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: '0.72rem' }}>
                        {branchData.length} Departments
                      </span>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-hover table-sm align-middle mb-0" style={{ fontSize: '0.8rem' }}>
                        <thead className="table-light text-muted">
                          <tr>
                            <th className="ps-3">#</th>
                            <th>Program / Department</th>
                            <th className="text-center">Graduating Strength</th>
                            <th className="text-center">Students Placed</th>
                            <th className="text-center">Placement %</th>
                            <th className="text-center pe-3">Average CGPA</th>
                          </tr>
                        </thead>
                        <tbody>
                          {branchData.map((b, i) => {
                            const rate = b.total ? ((b.placed / b.total) * 100).toFixed(1) : '0.0';
                            return (
                              <tr key={b._id}>
                                <td className="ps-3 text-muted">{i + 1}</td>
                                <td className="fw-semibold text-dark">{b._id}</td>
                                <td className="text-center">{b.total}</td>
                                <td className="text-center text-success fw-bold">{b.placed}</td>
                                <td className="text-center">
                                  <span className="badge bg-success-subtle text-success">{rate}%</span>
                                </td>
                                <td className="text-center pe-3">{b.avgCGPA ? Number(b.avgCGPA).toFixed(2) : '—'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Certified Signatures Preview Block */}
                  <div className="p-3 bg-light rounded-3 border d-flex flex-wrap align-items-center justify-content-between gap-3">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-patch-check-fill text-success" style={{ fontSize: '1.4rem' }}></i>
                      <div>
                        <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>
                          Institutional Attestation Blocks Included in Output
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                          Includes certified signature boxes for Placement Officer, Head of TPO, and College Principal.
                        </div>
                      </div>
                    </div>
                    <div className="text-muted font-monospace" style={{ fontSize: '0.75rem' }}>
                      Total Verified Student Records: <strong>{placements.length}</strong>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Modal Footer: Action Buttons */}
            <div className="modal-footer border-top px-4 py-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                <i className="bi bi-info-circle me-1"></i>
                Ready for submission to NAAC peer team and NIRF portal
              </span>

              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm d-inline-flex align-items-center gap-1"
                  onClick={handleDownloadExcel}
                  disabled={loading}
                >
                  <i className="bi bi-file-earmark-excel-fill"></i>
                  <span>Export NAAC Excel (.xlsx)</span>
                </button>

                <button
                  type="button"
                  className="btn btn-success btn-sm d-inline-flex align-items-center gap-1 px-3"
                  style={{ background: '#1F5C3A', borderColor: '#1F5C3A' }}
                  onClick={handleDownloadPDF}
                  disabled={loading || generating}
                >
                  {generating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-file-earmark-pdf-fill"></i>
                      <span>Download Official NAAC PDF</span>
                    </>
                  )}
                </button>

                <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
