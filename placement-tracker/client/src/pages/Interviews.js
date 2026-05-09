import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const DIFFICULTY_COLORS = {
  Easy:   { bg: '#dcfce7', color: '#166534' },
  Medium: { bg: '#fffbeb', color: '#92400e' },
  Hard:   { bg: '#fee2e2', color: '#991b1b' },
};

const VERDICT_COLORS = {
  Selected: { bg: '#dcfce7', color: '#166534' },
  Rejected: { bg: '#fee2e2', color: '#991b1b' },
  'On Hold': { bg: '#eff6ff', color: '#1e40af' },
};

const defaultForm = {
  company: '',
  role: '',
  package: '',
  difficulty: 'Medium',
  verdict: 'Selected',
  questionsAsked: '',
  tips: '',
  isAnonymous: false,
  rounds: [{ roundNo: 1, roundName: '', description: '' }],
};

export default function Interviews() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [companies, setCompanies]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [filterCompany, setFilterCompany] = useState('');

  const isStudent = user?.isStudent;

  const fetchInterviews = async () => {
    try {
      const params = filterCompany ? { company: filterCompany } : {};
      const res = await axios.get('/api/interviews', { params });
      setInterviews(res.data.data);
    } catch {
      toast.error('Failed to load experiences');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchInterviews();
    axios.get('/api/companies').then(r => setCompanies(r.data.data)).catch(() => {});
  }, [filterCompany]);

  const addRound = () => {
    setForm(f => ({
      ...f,
      rounds: [...f.rounds, { roundNo: f.rounds.length + 1, roundName: '', description: '' }]
    }));
  };

  const updateRound = (idx, field, val) => {
    setForm(f => {
      const rounds = [...f.rounds];
      rounds[idx] = { ...rounds[idx], [field]: val };
      return { ...f, rounds };
    });
  };

  const removeRound = (idx) => {
    setForm(f => ({ ...f, rounds: f.rounds.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company || !form.role) return toast.error('Company and role are required!');
    setSubmitting(true);
    try {
      await axios.post('/api/interviews', form);
      toast.success('Experience shared! 🎉 It will help juniors a lot!');
      setForm(defaultForm);
      setShowForm(false);
      fetchInterviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally { setSubmitting(false); }
  };

  const handleLike = async (id) => {
    try {
      const res = await axios.put(`/api/interviews/${id}/like`);
      setInterviews(prev => prev.map(i => i._id === id ? { ...i, likes: res.data.likes } : i));
    } catch { toast.error('Failed to like'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this experience?')) return;
    try {
      await axios.delete(`/api/interviews/${id}`);
      toast.success('Deleted');
      fetchInterviews();
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  return (
    <div>
      {/* Topbar */}
      <div className="topbar">
        <div>
          <h1 className="page-title">Interview Experiences</h1>
          <p className="page-sub">Real experiences shared by placed students — learn from them! 🎯</p>
        </div>
        {isStudent && (
          <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>
            {showForm
              ? <><i className="bi bi-x me-2"></i>Cancel</>
              : <><i className="bi bi-plus-circle-fill me-2"></i>Share My Experience</>}
          </button>
        )}
      </div>

      {/* Share experience form */}
      {showForm && isStudent && (
        <div className="form-card mb-4 fade-in">
          <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
            <i className="bi bi-pencil-fill text-primary me-2"></i>Share Your Interview Experience
          </h6>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              {/* Company */}
              <div className="col-md-6">
                <label className="form-label">Company *</label>
                <select className="form-select" value={form.company}
                  onChange={e => setForm({ ...form, company: e.target.value })} required>
                  <option value="">Select Company</option>
                  {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>

              {/* Role */}
              <div className="col-md-6">
                <label className="form-label">Role / Position *</label>
                <input className="form-control" placeholder="e.g. Software Engineer"
                  value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required />
              </div>

              {/* Package */}
              <div className="col-md-4">
                <label className="form-label">Package Offered (LPA)</label>
                <input type="number" className="form-control" placeholder="e.g. 12.5" min="0" step="0.1"
                  value={form.package} onChange={e => setForm({ ...form, package: e.target.value })} />
              </div>

              {/* Difficulty */}
              <div className="col-md-4">
                <label className="form-label">Interview Difficulty</label>
                <select className="form-select" value={form.difficulty}
                  onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                  {['Easy', 'Medium', 'Hard'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              {/* Verdict */}
              <div className="col-md-4">
                <label className="form-label">Final Verdict</label>
                <select className="form-select" value={form.verdict}
                  onChange={e => setForm({ ...form, verdict: e.target.value })}>
                  {['Selected', 'Rejected', 'On Hold'].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>

              {/* Rounds */}
              <div className="col-12">
                <label className="form-label">Interview Rounds</label>
                {form.rounds.map((round, idx) => (
                  <div key={idx} className="p-3 mb-2" style={{ background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1a56db', background: '#eff6ff', padding: '2px 10px', borderRadius: 20 }}>
                        Round {round.roundNo}
                      </span>
                      <input className="form-control form-control-sm" placeholder="Round name e.g. Aptitude Test, Technical Round"
                        style={{ flex: 1 }} value={round.roundName}
                        onChange={e => updateRound(idx, 'roundName', e.target.value)} />
                      {form.rounds.length > 1 && (
                        <button type="button" className="btn btn-sm btn-outline-danger"
                          onClick={() => removeRound(idx)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </div>
                    <textarea className="form-control form-control-sm" rows={2}
                      placeholder="Describe what happened in this round..."
                      value={round.description}
                      onChange={e => updateRound(idx, 'description', e.target.value)} />
                  </div>
                ))}
                <button type="button" className="btn btn-outline-primary btn-sm mt-1" onClick={addRound}>
                  <i className="bi bi-plus-circle me-1"></i>Add Round
                </button>
              </div>

              {/* Questions asked */}
              <div className="col-12">
                <label className="form-label">Questions Asked</label>
                <textarea className="form-control" rows={3}
                  placeholder="List the important questions asked during your interview..."
                  value={form.questionsAsked}
                  onChange={e => setForm({ ...form, questionsAsked: e.target.value })} />
              </div>

              {/* Tips */}
              <div className="col-12">
                <label className="form-label">
                  Tips for Juniors <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.75rem' }}>(most important part!)</span>
                </label>
                <textarea className="form-control" rows={3}
                  placeholder="What should juniors prepare? What topics are most important? Any advice?"
                  value={form.tips}
                  onChange={e => setForm({ ...form, tips: e.target.value })} />
              </div>

              {/* Anonymous toggle */}
              <div className="col-12">
                <div className="d-flex align-items-center gap-3 p-3" style={{ background: '#f8fafc', borderRadius: 10 }}>
                  <input type="checkbox" id="anon" checked={form.isAnonymous}
                    onChange={e => setForm({ ...form, isAnonymous: e.target.checked })}
                    style={{ width: 18, height: 18, cursor: 'pointer' }} />
                  <label htmlFor="anon" style={{ cursor: 'pointer', margin: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Post Anonymously</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Your name won't be shown to others</div>
                  </label>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-primary px-4" disabled={submitting}>
                {submitting
                  ? <><span className="spinner-border spinner-border-sm me-2" />Sharing...</>
                  : <><i className="bi bi-send-fill me-2"></i>Share Experience</>}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Not a student — info box */}
      {!isStudent && (
        <div className="mb-3 p-3" style={{ background: '#eff6ff', borderRadius: 10, border: '1px solid #bfdbfe', fontSize: '0.85rem', color: '#1e40af' }}>
          <i className="bi bi-info-circle me-2"></i>
          Only placed students can share experiences. Sign up with your roll number to contribute!
        </div>
      )}

      {/* Filter */}
      <div className="d-flex gap-2 mb-3">
        <select className="form-select" style={{ maxWidth: 220 }} value={filterCompany}
          onChange={e => setFilterCompany(e.target.value)}>
          <option value="">All Companies</option>
          {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        {filterCompany && (
          <button className="btn btn-outline-secondary" onClick={() => setFilterCompany('')}>
            <i className="bi bi-x-circle me-1"></i>Clear
          </button>
        )}
      </div>

      {/* Stats row */}
      <div className="row g-3 mb-3">
        {[
          { label: 'Total Experiences', val: interviews.length, icon: 'bi-chat-quote-fill', color: '#1a56db', bg: '#eff6ff' },
          { label: 'Companies Covered', val: [...new Set(interviews.map(i => i.company?._id))].length, icon: 'bi-building-fill', color: '#7c3aed', bg: '#f5f3ff' },
          { label: 'Selected', val: interviews.filter(i => i.verdict === 'Selected').length, icon: 'bi-trophy-fill', color: '#059669', bg: '#f0fdf4' },
          { label: 'Total Helpful Votes', val: interviews.reduce((s, i) => s + (i.likes || 0), 0), icon: 'bi-hand-thumbs-up-fill', color: '#d97706', bg: '#fffbeb' },
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

      {/* Experiences list */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-2" />
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>Loading experiences...</p>
        </div>
      ) : interviews.length === 0 ? (
        <div className="text-center py-5 form-card">
          <i className="bi bi-chat-square-quote" style={{ fontSize: '3rem', color: '#cbd5e1' }}></i>
          <h6 style={{ fontFamily: 'Syne,sans-serif', marginTop: 16, color: '#64748b', fontWeight: 700 }}>
            No experiences shared yet
          </h6>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Be the first to share your interview experience! Help your juniors 🙌
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {interviews.map(exp => {
            const isExpanded  = expandedId === exp._id;
            const isOwn       = exp.postedBy?._id === user?._id;
            const diffColor   = DIFFICULTY_COLORS[exp.difficulty] || DIFFICULTY_COLORS.Medium;
            const verdictColor = VERDICT_COLORS[exp.verdict] || VERDICT_COLORS.Selected;

            return (
              <div key={exp._id} className="form-card fade-in" style={{ cursor: 'pointer' }}>
                {/* Card header */}
                <div className="d-flex align-items-start justify-content-between gap-3"
                  onClick={() => setExpandedId(isExpanded ? null : exp._id)}>
                  <div className="d-flex align-items-center gap-3">
                    {/* Company avatar */}
                    <div className="avatar" style={{
                      width: 46, height: 46, borderRadius: 12, fontSize: '0.9rem', fontWeight: 800,
                      background: '#eff6ff', color: '#1a56db', flexShrink: 0,
                    }}>
                      {exp.company?.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{exp.company?.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{exp.role}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>
                        {exp.isAnonymous ? 'Anonymous' : exp.student?.name} · {exp.student?.branch} · Batch {exp.student?.batch}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2 flex-shrink-0">
                    {exp.package && (
                      <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '0.95rem', color: '#1a56db' }}>
                        ₹{exp.package} LPA
                      </span>
                    )}
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: diffColor.bg, color: diffColor.color }}>
                      {exp.difficulty}
                    </span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: verdictColor.bg, color: verdictColor.color }}>
                      {exp.verdict === 'Selected' ? '✓' : exp.verdict === 'Rejected' ? '✗' : '~'} {exp.verdict}
                    </span>
                    <i className={`bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`} style={{ color: '#94a3b8', fontSize: '0.85rem' }}></i>
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }} className="fade-in">

                    {/* Rounds */}
                    {exp.rounds?.length > 0 && (
                      <div className="mb-3">
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 10 }}>
                          <i className="bi bi-list-ol text-primary me-1"></i>Interview Rounds
                        </div>
                        {exp.rounds.map((r, i) => (
                          <div key={i} className="d-flex gap-3 mb-2">
                            <div style={{
                              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                              background: '#eff6ff', color: '#1a56db',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.75rem', fontWeight: 800,
                            }}>{r.roundNo}</div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{r.roundName || `Round ${r.roundNo}`}</div>
                              {r.description && <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 2 }}>{r.description}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Questions */}
                    {exp.questionsAsked && (
                      <div className="mb-3 p-3" style={{ background: '#f8fafc', borderRadius: 10 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 6 }}>
                          <i className="bi bi-question-circle-fill text-warning me-1"></i>Questions Asked
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, whiteSpace: 'pre-line' }}>
                          {exp.questionsAsked}
                        </p>
                      </div>
                    )}

                    {/* Tips */}
                    {exp.tips && (
                      <div className="mb-3 p-3" style={{ background: '#f0fdf4', borderRadius: 10, border: '1px solid #bbf7d0' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 6, color: '#166534' }}>
                          <i className="bi bi-lightbulb-fill me-1"></i>Tips for Juniors 💡
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#166534', margin: 0, whiteSpace: 'pre-line' }}>
                          {exp.tips}
                        </p>
                      </div>
                    )}

                    {/* Footer actions */}
                    <div className="d-flex align-items-center justify-content-between mt-2">
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        {new Date(exp.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          style={{ fontSize: '0.75rem' }}
                          onClick={(e) => { e.stopPropagation(); handleLike(exp._id); }}>
                          <i className="bi bi-hand-thumbs-up me-1"></i>Helpful {exp.likes > 0 && `(${exp.likes})`}
                        </button>
                        {(isOwn || user?.role === 'admin') && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            style={{ fontSize: '0.75rem' }}
                            onClick={(e) => { e.stopPropagation(); handleDelete(exp._id); }}>
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}