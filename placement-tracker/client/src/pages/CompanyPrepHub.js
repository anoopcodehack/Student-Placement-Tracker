import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

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

const TOPICS = [
  { id: 'All', label: 'All Topics', icon: 'bi-grid-fill' },
  { id: 'DSA', label: 'Data Structures & Algo', icon: 'bi-diagram-3-fill' },
  { id: 'SQL', label: 'Database & SQL', icon: 'bi-database-fill' },
  { id: 'Core CS', label: 'Core CS (OS, Networks, OOP)', icon: 'bi-cpu-fill' },
  { id: 'Web Dev', label: 'Web & Full Stack', icon: 'bi-code-slash' },
  { id: 'Aptitude', label: 'Quantitative & Aptitude', icon: 'bi-calculator-fill' },
  { id: 'HR', label: 'HR & Behavioral', icon: 'bi-chat-heart-fill' },
];

const DIFFICULTY_STYLES = {
  Easy: { bg: 'rgba(5, 150, 105, 0.12)', color: '#059669', border: 'rgba(5, 150, 105, 0.25)' },
  Medium: { bg: 'rgba(217, 119, 6, 0.12)', color: '#d97706', border: 'rgba(217, 119, 6, 0.25)' },
  Hard: { bg: 'rgba(220, 38, 38, 0.12)', color: '#dc2626', border: 'rgba(220, 38, 38, 0.25)' },
};

const STORAGE_KEY = 'placetrack_mastered_questions';

export default function CompanyPrepHub() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'guides'
  const [questions, setQuestions] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  // Filters
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Expand state for solutions
  const [expandedIds, setExpandedIds] = useState(new Set());

  // Mastered questions tracker in localStorage
  const [masteredIds, setMasteredIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Modal state for adding question
  const [showAddModal, setShowAddModal] = useState(false);
  const [submittingQuestion, setSubmittingQuestion] = useState(false);
  const [newQuestionForm, setNewQuestionForm] = useState({
    title: '',
    topic: 'DSA',
    subTopic: '',
    difficulty: 'Medium',
    companies: '',
    question: '',
    solution: '',
    codeSnippet: '',
    language: 'javascript',
    tips: '',
  });

  // Fetch Questions
  const fetchQuestions = useCallback(async () => {
    setLoadingQuestions(true);
    try {
      const res = await axios.get('/api/prep/questions', {
        params: {
          topic: selectedTopic,
          difficulty: selectedDifficulty,
          company: selectedCompany,
          search: searchQuery,
        }
      });
      setQuestions(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load questions');
    } finally {
      setLoadingQuestions(false);
    }
  }, [selectedTopic, selectedDifficulty, selectedCompany, searchQuery]);

  // Fetch Company Guides
  const fetchCompanyGuides = useCallback(async () => {
    setLoadingCompanies(true);
    try {
      const res = await axios.get('/api/prep/companies');
      setCompanies(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load company guides');
    } finally {
      setLoadingCompanies(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    fetchCompanyGuides();
  }, [fetchCompanyGuides]);

  // Save mastered IDs to localStorage
  const toggleMastered = (id) => {
    setMasteredIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.info('Removed from mastered list');
      } else {
        next.add(id);
        toast.success('Marked as mastered! Keep it up!');
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Toggle question accordion
  const toggleExpand = (id) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Like question
  const handleLike = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await axios.put(`/api/prep/questions/${id}/like`);
      setQuestions(prev => prev.map(q => q._id === id ? { ...q, likes: res.data.likes } : q));
    } catch {
      toast.error('Failed to like question');
    }
  };

  // Copy code snippet
  const handleCopyCode = (code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  // Submit new question
  const handleAddQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestionForm.title || !newQuestionForm.question || !newQuestionForm.solution) {
      toast.error('Please fill in Title, Question, and Solution.');
      return;
    }
    setSubmittingQuestion(true);
    try {
      await axios.post('/api/prep/questions', newQuestionForm);
      toast.success('Question added to the Question Bank successfully!');
      setShowAddModal(false);
      setNewQuestionForm({
        title: '',
        topic: 'DSA',
        subTopic: '',
        difficulty: 'Medium',
        companies: '',
        question: '',
        solution: '',
        codeSnippet: '',
        language: 'javascript',
        tips: '',
      });
      fetchQuestions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add question');
    } finally {
      setSubmittingQuestion(false);
    }
  };

  // Filter company questions from guide card
  const handleFilterByCompanyFromGuide = (companyName) => {
    setSelectedCompany(companyName);
    setSelectedTopic('All');
    setSelectedDifficulty('All');
    setActiveTab('questions');
    toast.info(`Filtered Question Bank for ${companyName}`);
  };

  // Progress metrics
  const totalQuestions = questions.length;
  const masteredCount = useMemo(() => {
    return questions.filter(q => masteredIds.has(q._id)).length;
  }, [questions, masteredIds]);

  const masteredPercentage = totalQuestions > 0 ? Math.round((masteredCount / totalQuestions) * 100) : 0;

  return (
    <div className="company-prep-hub-page">
      {/* Top Header */}
      <div className="topbar mb-4">
        <div>
          <h1 className="page-title d-flex align-items-center gap-2">
            <i className="bi bi-journal-code text-primary"></i>
            Company Prep Hub & Question Bank
          </h1>
          <p className="page-sub">
            Curated placement questions, round-by-round company hiring guides, and practice readiness tracking
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-plus-circle"></i> Contribute Question
          </button>
          <Link to="/drives" className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1">
            <i className="bi bi-clipboard-check"></i> Campus Drives
          </Link>
        </div>
      </div>

      {/* Student Readiness & Practice Progress Bar */}
      <div
        className="card border-0 shadow-sm p-3 mb-4"
        style={{
          borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(31, 92, 58, 0.08) 0%, rgba(159, 230, 190, 0.16) 100%)',
          borderLeft: '4px solid #1F5C3A'
        }}
      >
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-3 d-flex align-items-center justify-content-center text-white shadow-sm flex-shrink-0"
              style={{ width: 44, height: 44, background: '#1F5C3A', fontSize: '1.2rem' }}
            >
              <i className="bi bi-award-fill"></i>
            </div>
            <div>
              <div className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>
                Your Placement Readiness Tracker
              </div>
              <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                Master essential questions asked frequently in campus hiring drives across TCS, Infosys, Amazon & more.
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="text-end">
              <span className="fw-bold text-dark" style={{ fontSize: '1.1rem' }}>
                {masteredCount} / {totalQuestions}
              </span>
              <span className="text-muted ms-1" style={{ fontSize: '0.8rem' }}>Mastered</span>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>({masteredPercentage}% readiness)</div>
            </div>
            <div style={{ width: 140 }}>
              <div className="progress" style={{ height: 10, borderRadius: 10, background: 'rgba(31, 92, 58, 0.15)' }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${masteredPercentage}%`,
                    background: 'linear-gradient(90deg, #1F5C3A, #059669)',
                    borderRadius: 10,
                    transition: 'width 0.4s ease'
                  }}
                  aria-valuenow={masteredPercentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Header */}
      <div className="d-flex align-items-center gap-2 mb-4 border-bottom pb-2">
        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'questions' ? 'btn-primary' : 'btn-light border'} d-inline-flex align-items-center gap-2`}
          onClick={() => setActiveTab('questions')}
          style={activeTab === 'questions' ? { background: '#1F5C3A', borderColor: '#1F5C3A' } : {}}
        >
          <i className="bi bi-collection-fill"></i>
          <span>Interview Question Bank</span>
          <span className="badge bg-light text-dark ms-1">{questions.length}</span>
        </button>

        <button
          type="button"
          className={`btn btn-sm ${activeTab === 'guides' ? 'btn-primary' : 'btn-light border'} d-inline-flex align-items-center gap-2`}
          onClick={() => setActiveTab('guides')}
          style={activeTab === 'guides' ? { background: '#1F5C3A', borderColor: '#1F5C3A' } : {}}
        >
          <i className="bi bi-building"></i>
          <span>Company Recruitment Guides</span>
          <span className="badge bg-light text-dark ms-1">{companies.length}</span>
        </button>
      </div>

      {/* TAB 1: QUESTION BANK */}
      {activeTab === 'questions' && (
        <div>
          {/* Topic Filter Pills */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            {TOPICS.map(t => {
              const isActive = selectedTopic === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`btn btn-sm ${isActive ? 'btn-success text-white' : 'btn-light border text-secondary'}`}
                  style={isActive ? { background: '#1F5C3A', borderColor: '#1F5C3A' } : { fontSize: '0.8rem' }}
                  onClick={() => setSelectedTopic(t.id)}
                >
                  <i className={`bi ${t.icon} me-1`}></i>
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Secondary Filters Bar */}
          <div className="card border-0 shadow-sm p-3 mb-4" style={{ borderRadius: 12 }}>
            <div className="row g-2 align-items-center">
              {/* Search */}
              <div className="col-12 col-md-5">
                <div style={{ position: 'relative' }}>
                  <i className="bi bi-search" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.85rem' }}></i>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    style={{ paddingLeft: 32 }}
                    placeholder="Search question, concept, or keyword..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Difficulty */}
              <div className="col-6 col-md-3">
                <select
                  className="form-select form-select-sm"
                  value={selectedDifficulty}
                  onChange={e => setSelectedDifficulty(e.target.value)}
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Target Company */}
              <div className="col-6 col-md-3">
                <select
                  className="form-select form-select-sm"
                  value={selectedCompany}
                  onChange={e => setSelectedCompany(e.target.value)}
                >
                  <option value="All">All Companies</option>
                  <option value="TCS">TCS</option>
                  <option value="Infosys">Infosys</option>
                  <option value="Wipro">Wipro</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Google">Google</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Swiggy">Swiggy</option>
                  <option value="Accenture">Accenture</option>
                  <option value="Cognizant">Cognizant</option>
                </select>
              </div>

              {/* Reset */}
              <div className="col-12 col-md-1 text-md-end">
                {(selectedTopic !== 'All' || selectedDifficulty !== 'All' || selectedCompany !== 'All' || searchQuery) && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary w-100"
                    title="Reset filters"
                    onClick={() => {
                      setSelectedTopic('All');
                      setSelectedDifficulty('All');
                      setSelectedCompany('All');
                      setSearchQuery('');
                    }}
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Questions List */}
          {loadingQuestions ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.85rem' }}>Loading question bank...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="card border-0 shadow-sm text-center py-5" style={{ borderRadius: 14 }}>
              <div className="mb-2" style={{ fontSize: '2.5rem', color: '#94a3b8' }}>
                <i className="bi bi-question-circle"></i>
              </div>
              <h5 className="fw-bold">No questions found</h5>
              <p className="text-muted mb-3" style={{ fontSize: '0.875rem' }}>
                No questions matched your current filter criteria.
              </p>
              <div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => {
                    setSelectedTopic('All');
                    setSelectedDifficulty('All');
                    setSelectedCompany('All');
                    setSearchQuery('');
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {questions.map((q, idx) => {
                const isExpanded = expandedIds.has(q._id);
                const isMastered = masteredIds.has(q._id);
                const diffStyle = DIFFICULTY_STYLES[q.difficulty] || DIFFICULTY_STYLES.Medium;

                return (
                  <div
                    key={q._id}
                    className="card border-0 shadow-sm transition-all"
                    style={{
                      borderRadius: 14,
                      borderLeft: `4px solid ${isMastered ? '#059669' : '#1F5C3A'}`
                    }}
                  >
                    {/* Question Header & Summary */}
                    <div className="p-3">
                      <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-2">
                        <div className="flex-grow-1">
                          {/* Badges row */}
                          <div className="d-flex flex-wrap align-items-center gap-1 mb-2">
                            <span
                              className="badge"
                              style={{
                                background: diffStyle.bg,
                                color: diffStyle.color,
                                border: `1px solid ${diffStyle.border}`,
                                fontSize: '0.72rem'
                              }}
                            >
                              {q.difficulty}
                            </span>
                            <span className="badge bg-light text-secondary border" style={{ fontSize: '0.72rem' }}>
                              {q.topic}
                            </span>
                            {q.subTopic && (
                              <span className="badge bg-light text-dark border" style={{ fontSize: '0.72rem' }}>
                                {q.subTopic}
                              </span>
                            )}
                            {q.companies && q.companies.map((c, cIdx) => (
                              <span key={cIdx} className="badge bg-primary-subtle text-primary" style={{ fontSize: '0.72rem' }}>
                                <i className="bi bi-tag-fill me-1" style={{ fontSize: '0.65rem' }}></i>
                                {c}
                              </span>
                            ))}
                          </div>

                          {/* Title */}
                          <h5 className="fw-bold mb-1 text-dark" style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.05rem' }}>
                            {idx + 1}. {q.title}
                          </h5>

                          {/* Problem description */}
                          <p className="text-secondary mb-0" style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                            {q.question}
                          </p>
                        </div>

                        {/* Mastered toggle */}
                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            className={`btn btn-sm d-inline-flex align-items-center gap-1 ${isMastered ? 'btn-success text-white' : 'btn-outline-secondary'}`}
                            onClick={() => toggleMastered(q._id)}
                            style={{ fontSize: '0.78rem' }}
                            title={isMastered ? 'Marked as Mastered' : 'Mark as Mastered'}
                          >
                            <i className={`bi ${isMastered ? 'bi-check-circle-fill' : 'bi-circle'}`}></i>
                            <span>{isMastered ? 'Mastered' : 'Mark Mastered'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Accordion Toggle Bar */}
                    <div
                      className="px-3 py-2 bg-light border-top d-flex align-items-center justify-content-between"
                      style={{ cursor: 'pointer', borderBottomLeftRadius: isExpanded ? 0 : 14, borderBottomRightRadius: isExpanded ? 0 : 14 }}
                      onClick={() => toggleExpand(q._id)}
                    >
                      <span className="fw-semibold text-primary d-inline-flex align-items-center gap-1" style={{ fontSize: '0.8rem' }}>
                        <i className={`bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                        {isExpanded ? 'Hide Solution & Key Points' : 'View Solution, Hints & Code'}
                      </span>

                      <div className="d-flex align-items-center gap-3" onClick={e => e.stopPropagation()}>
                        <button
                          type="button"
                          className="btn btn-sm text-muted p-0 d-inline-flex align-items-center gap-1"
                          onClick={(e) => handleLike(q._id, e)}
                          style={{ fontSize: '0.78rem' }}
                        >
                          <i className="bi bi-hand-thumbs-up text-primary"></i>
                          <span>Helpful ({q.likes || 0})</span>
                        </button>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="p-3 border-top" style={{ background: '#fafbfc' }}>
                        {/* Solution & Approach */}
                        <div className="mb-3">
                          <h6 className="fw-bold text-dark d-flex align-items-center gap-1 mb-2" style={{ fontSize: '0.875rem' }}>
                            <i className="bi bi-lightbulb-fill text-warning"></i>
                            Approach & Concept:
                          </h6>
                          <div
                            className="p-3 bg-white border rounded-3 text-secondary"
                            style={{ fontSize: '0.85rem', whiteSpace: 'pre-line', lineHeight: 1.6 }}
                          >
                            {q.solution}
                          </div>
                        </div>

                        {/* Code Snippet if present */}
                        {q.codeSnippet && (
                          <div className="mb-3">
                            <div className="d-flex align-items-center justify-content-between mb-1">
                              <span className="fw-semibold text-muted text-uppercase" style={{ fontSize: '0.75rem' }}>
                                Reference Code ({q.language || 'Code'})
                              </span>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary py-0 px-2 d-inline-flex align-items-center gap-1"
                                style={{ fontSize: '0.72rem' }}
                                onClick={(e) => handleCopyCode(q.codeSnippet, e)}
                              >
                                <i className="bi bi-clipboard"></i> Copy
                              </button>
                            </div>
                            <pre
                              className="p-3 text-dark rounded-3 font-monospace mb-0"
                              style={{
                                background: '#f1f5f9',
                                border: '1px solid #cbd5e1',
                                fontSize: '0.82rem',
                                overflowX: 'auto',
                                maxHeight: 280
                              }}
                            >
                              <code>{q.codeSnippet}</code>
                            </pre>
                          </div>
                        )}

                        {/* Key Points */}
                        {q.keyPoints && q.keyPoints.length > 0 && (
                          <div className="mb-2">
                            <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '0.82rem' }}>
                              <i className="bi bi-check2-circle text-success me-1"></i>
                              Key Takeaways for Interviews:
                            </h6>
                            <ul className="mb-0 ps-3 text-secondary" style={{ fontSize: '0.82rem' }}>
                              {q.keyPoints.map((pt, pIdx) => (
                                <li key={pIdx} className="mb-1">{pt}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Interviewer Tip */}
                        {q.tips && (
                          <div
                            className="p-2 px-3 mt-2 rounded-2 d-flex align-items-center gap-2"
                            style={{ background: 'rgba(31, 92, 58, 0.08)', border: '1px solid rgba(31, 92, 58, 0.2)', fontSize: '0.8rem' }}
                          >
                            <i className="bi bi-info-circle-fill text-success flex-shrink-0"></i>
                            <span className="text-dark"><strong>Interviewer Tip:</strong> {q.tips}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COMPANY RECRUITMENT GUIDES */}
      {activeTab === 'guides' && (
        <div>
          {loadingCompanies ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.85rem' }}>Loading company recruitment patterns...</p>
            </div>
          ) : (
            <div className="row g-4">
              {companies.map(comp => {
                const logoSrc = COMPANY_LOGOS[comp.name.split(' ')[0]] || null;

                return (
                  <div key={comp.id} className="col-12 col-lg-6">
                    <div className="card h-100 border-0 shadow-sm p-4" style={{ borderRadius: 16 }}>
                      {/* Company Header */}
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="rounded-3 d-flex align-items-center justify-content-center bg-white shadow-sm flex-shrink-0"
                            style={{ width: 50, height: 50, border: '1px solid #e2e8f0', padding: 4 }}
                          >
                            {logoSrc ? (
                              <img
                                src={logoSrc}
                                alt={comp.name}
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                onError={e => { e.currentTarget.style.display = 'none'; }}
                              />
                            ) : (
                              <span className="fw-bold text-secondary" style={{ fontSize: '1.1rem' }}>
                                {comp.name.slice(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <h5 className="fw-bold mb-0 text-dark" style={{ fontFamily: 'Syne,sans-serif' }}>
                              {comp.name}
                            </h5>
                            <span className="text-muted" style={{ fontSize: '0.8rem' }}>{comp.industry}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1"
                          onClick={() => handleFilterByCompanyFromGuide(comp.name.split(' ')[0])}
                          style={{ fontSize: '0.78rem' }}
                        >
                          <i className="bi bi-journal-check"></i> Practice Questions
                        </button>
                      </div>

                      {/* Roles & Package */}
                      <div className="p-2 px-3 rounded-2 bg-light border mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
                        <div>
                          <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Hiring Tracks:</span>
                          <div className="fw-semibold text-dark" style={{ fontSize: '0.82rem' }}>
                            {comp.roles?.join(' · ')}
                          </div>
                        </div>
                        {comp.packageRange && (
                          <div className="text-end">
                            <span className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Package:</span>
                            <div className="fw-bold text-success" style={{ fontSize: '0.88rem' }}>
                              ₹{comp.packageRange.min} – {comp.packageRange.max} LPA
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Rounds Timeline */}
                      <div className="mb-3">
                        <div className="text-uppercase fw-semibold text-muted mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                          <i className="bi bi-diagram-2 me-1"></i> Selection Rounds Breakdown
                        </div>
                        <div className="d-flex flex-column gap-2">
                          {comp.rounds?.map(r => (
                            <div key={r.roundNo} className="p-2 px-3 rounded-2 bg-white border" style={{ fontSize: '0.82rem' }}>
                              <div className="d-flex align-items-center justify-content-between">
                                <span className="fw-bold text-dark">
                                  Round {r.roundNo}: {r.title}
                                </span>
                                <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: '0.7rem' }}>
                                  {r.type}
                                </span>
                              </div>
                              <p className="text-secondary mt-1 mb-1" style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                                {r.description}
                              </p>
                              {r.tips && (
                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                  <i className="bi bi-arrow-right-short text-success"></i>
                                  <strong>Strategy:</strong> {r.tips}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommended Syllabus */}
                      {comp.syllabus && comp.syllabus.length > 0 && (
                        <div className="mt-auto pt-2 border-top">
                          <span className="text-muted fw-semibold" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                            Priority Preparation Syllabus:
                          </span>
                          <ul className="mb-0 ps-3 mt-1 text-secondary" style={{ fontSize: '0.78rem' }}>
                            {comp.syllabus.map((s, sIdx) => (
                              <li key={sIdx}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CONTRIBUTE QUESTION MODAL */}
      {showAddModal && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={() => setShowAddModal(false)} />
          <div className="modal fade show d-block" style={{ zIndex: 1050 }} tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content" style={{ borderRadius: 16, border: 'none', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>
                <div className="modal-header border-bottom px-4 py-3">
                  <h5 className="modal-title fw-bold d-flex align-items-center gap-2 mb-0" style={{ fontFamily: 'Syne,sans-serif' }}>
                    <i className="bi bi-plus-circle-fill text-primary"></i>
                    Contribute Interview Question
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddModal(false)} aria-label="Close"></button>
                </div>

                <form onSubmit={handleAddQuestionSubmit}>
                  <div className="modal-body px-4 py-3">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Question Title *</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="e.g. Reverse a Linked List / ACID Properties in DBMS"
                          required
                          value={newQuestionForm.title}
                          onChange={e => setNewQuestionForm({ ...newQuestionForm, title: e.target.value })}
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Topic *</label>
                        <select
                          className="form-select form-select-sm"
                          value={newQuestionForm.topic}
                          onChange={e => setNewQuestionForm({ ...newQuestionForm, topic: e.target.value })}
                        >
                          <option value="DSA">Data Structures & Algo</option>
                          <option value="SQL">Database & SQL</option>
                          <option value="Core CS">Core CS (OS, Networks, OOP)</option>
                          <option value="Web Dev">Web & Full Stack</option>
                          <option value="Aptitude">Quantitative & Aptitude</option>
                          <option value="HR">HR & Behavioral</option>
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Sub-Topic</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="e.g. Dynamic Programming, Joins"
                          value={newQuestionForm.subTopic}
                          onChange={e => setNewQuestionForm({ ...newQuestionForm, subTopic: e.target.value })}
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Difficulty</label>
                        <select
                          className="form-select form-select-sm"
                          value={newQuestionForm.difficulty}
                          onChange={e => setNewQuestionForm({ ...newQuestionForm, difficulty: e.target.value })}
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Companies Asked In (comma separated)</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="e.g. TCS, Infosys, Amazon, Swiggy"
                          value={newQuestionForm.companies}
                          onChange={e => setNewQuestionForm({ ...newQuestionForm, companies: e.target.value })}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Problem Statement / Question *</label>
                        <textarea
                          className="form-control form-control-sm"
                          rows="3"
                          placeholder="Describe the full question or interview problem statement..."
                          required
                          value={newQuestionForm.question}
                          onChange={e => setNewQuestionForm({ ...newQuestionForm, question: e.target.value })}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Solution & Approach *</label>
                        <textarea
                          className="form-control form-control-sm"
                          rows="4"
                          placeholder="Explain the step-by-step approach, time complexity, and reasoning..."
                          required
                          value={newQuestionForm.solution}
                          onChange={e => setNewQuestionForm({ ...newQuestionForm, solution: e.target.value })}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Reference Code Snippet (Optional)</label>
                        <textarea
                          className="form-control form-control-sm font-monospace"
                          rows="4"
                          placeholder="Paste clean code snippet or SQL query here..."
                          value={newQuestionForm.codeSnippet}
                          onChange={e => setNewQuestionForm({ ...newQuestionForm, codeSnippet: e.target.value })}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Interviewer Tip / Common Gotcha (Optional)</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="e.g. Mention O(n) space trade-off before writing the code."
                          value={newQuestionForm.tips}
                          onChange={e => setNewQuestionForm({ ...newQuestionForm, tips: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer border-top px-4 py-2">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success btn-sm d-inline-flex align-items-center gap-1"
                      style={{ background: '#1F5C3A', borderColor: '#1F5C3A' }}
                      disabled={submittingQuestion}
                    >
                      {submittingQuestion ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check2"></i> Add to Question Bank
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
