import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const cgpaColor = c => c >= 8 ? '#059669' : c >= 6 ? '#d97706' : '#dc2626';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editForm, setEditForm] = useState({ name: '', phone: '', linkedin: '', github: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get('/api/profile')
      .then(res => {
        setProfile(res.data.data.user);
        setStudent(res.data.data.student);
        setEditForm({
          name: res.data.data.user.name || '',
          phone: res.data.data.student?.phone || '',
          linkedin: res.data.data.student?.linkedin || '',
          github: res.data.data.student?.github || '',
        });
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/api/profile', editForm);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') return toast.error('Only PDF allowed!');
    const formData = new FormData();
    formData.append('resume', file);
    setUploading(true);
    try {
      const res = await axios.post('/api/profile/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStudent(s => ({ ...s, resume: res.data.resumeUrl }));
      toast.success('Resume uploaded!');
    } catch (err) {
      toast.error('Upload failed');
    } finally { setUploading(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('Passwords do not match!');
    if (pwForm.newPassword.length < 6) return toast.error('Min 6 characters!');
    try {
      await axios.put('/api/profile/change-password', pwForm);
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
      <div className="spinner-border text-primary" />
    </div>
  );

  const initials = profile?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const isStudent = profile?.isStudent && student;
  const tabs = isStudent
    ? ['profile', 'academic', 'resume', 'placement', 'password']
    : ['profile', 'password'];

  return (
    <div>
      <div className="topbar">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-sub">Manage your account settings</p>
        </div>
      </div>

      <div className="row g-3">
        {/* Left — Avatar & Info */}
        <div className="col-lg-4">
          <div className="form-card text-center mb-3">
            {/* Avatar */}
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg,#1a56db,#06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', fontWeight: 800, color: '#fff',
              margin: '0 auto 1rem', fontFamily: 'Syne,sans-serif'
            }}>{initials}</div>

            <h5 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800 }}>{profile?.name}</h5>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: 12 }}>{profile?.email}</p>

            <span style={{
              padding: '4px 16px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
              background: profile?.role === 'admin' ? '#eff6ff' : isStudent ? '#f0fdf4' : '#f5f3ff',
              color: profile?.role === 'admin' ? '#1a56db' : isStudent ? '#059669' : '#7c3aed',
            }}>
              {profile?.role === 'admin' ? '🛡️ Admin' : isStudent ? '🎓 Student' : '👁️ Viewer'}
            </span>

            {/* Student quick stats */}
            {isStudent && (
              <div className="row g-2 mt-3">
                {[
                  { l: 'Branch', v: student.branch },
                  { l: 'Batch', v: student.batch },
                  { l: 'CGPA', v: student.cgpa, color: cgpaColor(student.cgpa) },
                  { l: 'Status', v: student.isPlaced ? '✓ Placed' : '○ Unplaced', color: student.isPlaced ? '#059669' : '#dc2626' },
                ].map((item, i) => (
                  <div key={i} className="col-6">
                    <div className="metric-box">
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: item.color || '#1e293b' }}>{item.v}</div>
                      <div className="metric-lbl">{item.l}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tab nav */}
          <div className="form-card p-2">
            {tabs.map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                style={{
                  width: '100%', border: 'none', borderRadius: 8,
                  padding: '10px 14px', marginBottom: 4, cursor: 'pointer',
                  textAlign: 'left', fontWeight: 600, fontSize: '0.855rem',
                  background: activeTab === t ? '#eff6ff' : 'transparent',
                  color: activeTab === t ? '#1a56db' : '#64748b',
                  display: 'flex', alignItems: 'center', gap: 10,
                  transition: 'all 0.15s',
                }}>
                <i className={`bi ${
                  t === 'profile' ? 'bi-person-fill' :
                  t === 'academic' ? 'bi-mortarboard-fill' :
                  t === 'resume' ? 'bi-file-earmark-pdf-fill' :
                  t === 'placement' ? 'bi-trophy-fill' :
                  'bi-lock-fill'
                }`} style={{ color: activeTab === t ? '#1a56db' : '#94a3b8' }}></i>
                {t.charAt(0).toUpperCase() + t.slice(1)}
                {t === 'resume' && student?.resume && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.65rem', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: 10 }}>Uploaded</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right — Tab Content */}
        <div className="col-lg-8">

          {/* ── PROFILE TAB ── */}
          {activeTab === 'profile' && (
            <div className="form-card">
              <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
                <i className="bi bi-person-fill text-primary me-2"></i>Personal Information
              </h6>
              <form onSubmit={handleSaveProfile}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name</label>
                    <input className="form-control" value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>(cannot change)</span></label>
                    <input className="form-control" value={profile?.email} disabled style={{ background: '#f8fafc' }} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Role</label>
                    <input className="form-control" value={profile?.role} disabled style={{ background: '#f8fafc', textTransform: 'capitalize' }} />
                  </div>
                  {isStudent && (
                    <>
                      <div className="col-md-6">
                        <label className="form-label">Phone</label>
                        <input className="form-control" placeholder="9876543210"
                          value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">LinkedIn</label>
                        <input className="form-control" placeholder="linkedin.com/in/..."
                          value={editForm.linkedin} onChange={e => setEditForm({ ...editForm, linkedin: e.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">GitHub</label>
                        <input className="form-control" placeholder="github.com/..."
                          value={editForm.github} onChange={e => setEditForm({ ...editForm, github: e.target.value })} />
                      </div>
                    </>
                  )}
                </div>
                <button type="submit" className="btn btn-primary mt-3" disabled={saving}>
                  {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : <><i className="bi bi-check2 me-2"></i>Save Changes</>}
                </button>
              </form>
            </div>
          )}

          {/* ── ACADEMIC TAB (student only) ── */}
          {activeTab === 'academic' && isStudent && (
            <div className="form-card">
              <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
                <i className="bi bi-mortarboard-fill text-primary me-2"></i>Academic Details
              </h6>
              <div className="row g-3 mb-4">
                {[
                  { l: 'Roll No', v: student.rollNo },
                  { l: 'Branch', v: student.branch },
                  { l: 'Batch', v: student.batch },
                  { l: 'CGPA', v: student.cgpa, color: cgpaColor(student.cgpa) },
                  { l: '10th %', v: student.tenthPercent ? `${student.tenthPercent}%` : '—' },
                  { l: '12th %', v: student.twelfthPercent ? `${student.twelfthPercent}%` : '—' },
                  { l: 'Backlogs', v: student.backlogs ?? 0, color: student.backlogs > 0 ? '#dc2626' : '#059669' },
                  { l: 'Gender', v: student.gender || '—' },
                ].map((item, i) => (
                  <div key={i} className="col-6 col-md-3">
                    <div className="metric-box" style={{ padding: '1rem' }}>
                      <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.2rem', color: item.color || '#1e293b' }}>{item.v}</div>
                      <div className="metric-lbl">{item.l}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CGPA Progress */}
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  <span>CGPA Progress</span>
                  <span style={{ fontWeight: 700, color: cgpaColor(student.cgpa) }}>{student.cgpa}/10</span>
                </div>
                <div className="progress-bar-custom">
                  <div className="progress-bar-fill" style={{ width: `${(student.cgpa / 10) * 100}%` }} />
                </div>
              </div>

              {/* Skills */}
              {student.skills?.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: 8 }}>Skills</div>
                  <div className="d-flex flex-wrap gap-2">
                    {student.skills.map((s, i) => (
                      <span key={i} style={{
                        padding: '4px 14px', borderRadius: 20, fontSize: '0.78rem',
                        background: '#eff6ff', color: '#1a56db', border: '1px solid #bfdbfe', fontWeight: 600
                      }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── RESUME TAB (student only) ── */}
          {activeTab === 'resume' && isStudent && (
            <div className="form-card">
              <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
                <i className="bi bi-file-earmark-pdf-fill text-danger me-2"></i>Resume
              </h6>

              {student.resume ? (
                <div className="mb-4 p-4 text-center" style={{ background: '#f0fdf4', borderRadius: 12, border: '1px solid #bbf7d0' }}>
                  <i className="bi bi-file-earmark-check-fill" style={{ fontSize: '3rem', color: '#059669' }}></i>
                  <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginTop: 12 }}>Resume Uploaded ✅</h6>
                  <div className="d-flex gap-2 justify-content-center mt-3">
                    <a href={`http://localhost:5000${student.resume}`} target="_blank" rel="noreferrer"
                      className="btn btn-success btn-sm">
                      <i className="bi bi-eye me-1"></i>View Resume
                    </a>
                    <a href={`http://localhost:5000${student.resume}`} download
                      className="btn btn-outline-success btn-sm">
                      <i className="bi bi-download me-1"></i>Download
                    </a>
                  </div>
                </div>
              ) : (
                <div className="mb-4 p-4 text-center" style={{ background: '#fef9c3', borderRadius: 12, border: '1px solid #fde68a' }}>
                  <i className="bi bi-file-earmark-x" style={{ fontSize: '3rem', color: '#d97706' }}></i>
                  <h6 style={{ marginTop: 12, color: '#92400e' }}>No resume uploaded yet</h6>
                </div>
              )}

              {/* Upload */}
              <div style={{ border: '2px dashed #e2e8f0', borderRadius: 12, padding: '2rem', textAlign: 'center' }}>
                <i className="bi bi-cloud-upload-fill" style={{ fontSize: '2.5rem', color: '#94a3b8' }}></i>
                <h6 style={{ marginTop: 12, marginBottom: 4 }}>
                  {student.resume ? 'Replace Resume' : 'Upload Resume'}
                </h6>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: 16 }}>PDF only · Max 5MB</p>
                <label style={{
                  background: '#1a56db', color: '#fff', padding: '8px 24px',
                  borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                  display: 'inline-block',
                }}>
                  {uploading ? 'Uploading...' : 'Choose PDF File'}
                  <input type="file" accept=".pdf" style={{ display: 'none' }}
                    onChange={handleResumeUpload} disabled={uploading} />
                </label>
              </div>
            </div>
          )}

          {/* ── PLACEMENT TAB (student only) ── */}
          {activeTab === 'placement' && isStudent && (
            <div className="form-card">
              <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
                <i className="bi bi-trophy-fill text-warning me-2"></i>Placement Status
              </h6>
              {student.isPlaced && student.placementDetails?.package ? (
                <div style={{ background: 'linear-gradient(135deg,#eff6ff,#f0fdf4)', borderRadius: 12, padding: '1.5rem', border: '1px solid #bfdbfe' }}>
                  <div className="text-center mb-4">
                    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '3rem', color: '#1a56db' }}>
                      ₹{student.placementDetails.package}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.85rem' }}>LPA Package</div>
                    <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 16px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, marginTop: 8, display: 'inline-block' }}>
                      🎉 Congratulations! You are Placed
                    </span>
                  </div>
                  <div className="row g-3">
                    {[
                      { l: 'Company', v: student.placementDetails.company?.name || 'N/A', icon: 'bi-building' },
                      { l: 'Role', v: student.placementDetails.role || '—', icon: 'bi-briefcase' },
                      { l: 'Offer Type', v: student.placementDetails.offerType || '—', icon: 'bi-award' },
                      { l: 'Date', v: student.placementDetails.dateOfOffer ? new Date(student.placementDetails.dateOfOffer).toLocaleDateString('en-IN') : '—', icon: 'bi-calendar3' },
                    ].map((item, i) => (
                      <div key={i} className="col-6">
                        <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 10, padding: '0.85rem' }}>
                          <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            <i className={`bi ${item.icon} me-1`}></i>{item.l}
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: 4 }}>{item.v}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4" style={{ background: '#f8fafc', borderRadius: 12, border: '2px dashed #e2e8f0' }}>
                  <i className="bi bi-briefcase" style={{ fontSize: '3rem', color: '#cbd5e1' }}></i>
                  <h6 style={{ fontFamily: 'Syne,sans-serif', marginTop: 12, color: '#64748b' }}>Not Placed Yet</h6>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Keep working hard! Your placement is on the way 💪</p>
                </div>
              )}
            </div>
          )}

          {/* ── PASSWORD TAB ── */}
          {activeTab === 'password' && (
            <div className="form-card">
              <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
                <i className="bi bi-lock-fill text-primary me-2"></i>Change Password
              </h6>
              <form onSubmit={handleChangePassword}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Current Password</label>
                    <input type="password" className="form-control" placeholder="Enter current password"
                      value={pwForm.currentPassword} onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">New Password</label>
                    <input type="password" className="form-control" placeholder="Min 6 characters"
                      value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Confirm New Password</label>
                    <input type="password" className="form-control" placeholder="Re-enter new password"
                      value={pwForm.confirmPassword} onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })} required />
                    {pwForm.confirmPassword && (
                      <div style={{ fontSize: '0.72rem', marginTop: 4, color: pwForm.newPassword === pwForm.confirmPassword ? '#059669' : '#dc2626' }}>
                        {pwForm.newPassword === pwForm.confirmPassword ? '✓ Passwords match' : '✗ Do not match'}
                      </div>
                    )}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                  <i className="bi bi-lock me-2"></i>Update Password
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}