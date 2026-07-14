import { useState } from 'react';
import axios from 'axios';

const COMPANIES = [
  'TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture',
  'Google', 'Amazon', 'Microsoft', 'Zoho', 'Freshworks',
  'Flipkart', 'Swiggy', 'Zomato', 'Juspay', 'HashedIn',
  'Capgemini', 'HCL', 'Tech Mahindra', 'IBM', 'Oracle'
];

const ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer',
  'Full Stack Developer', 'Data Analyst', 'DevOps Engineer',
  'System Engineer', 'Associate Consultant', 'Java Developer',
  'Python Developer', 'React Developer', 'Node.js Developer'
];

const ROUNDS = [
  { value: 'aptitude', label: '🧮 Aptitude', desc: 'Logical, quantitative & verbal' },
  { value: 'technical', label: '💻 Technical', desc: 'DSA, CS fundamentals, coding' },
  { value: 'hr', label: '🤝 HR Round', desc: 'Behavioral & situational questions' },
];

export default function MockInterview({ student }) {
  const [phase, setPhase] = useState('setup'); // setup | interview | result
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [round, setRound] = useState('technical');
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [evalLoading, setEvalLoading] = useState(false);

  // Generate questions
  const startInterview = async () => {
    if (!company || !role) return alert('Please select company and role');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/mock-interview/questions', {
        company, role, round
      });
      setQuestions(data.data);
      setAnswers([]);
      setFeedback([]);
      setCurrent(0);
      setAnswer('');
      setPhase('interview');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  // Submit answer and get feedback
  const submitAnswer = async () => {
    if (!answer.trim()) return alert('Please type your answer');
    setEvalLoading(true);
    try {
      const { data } = await axios.post('/api/mock-interview/evaluate', {
        question: questions[current].question,
        answer,
        company,
        role,
        round
      });

      const newAnswers = [...answers, answer];
      const newFeedback = [...feedback, data.data];
      setAnswers(newAnswers);
      setFeedback(newFeedback);

      if (current + 1 >= questions.length) {
        // All questions done — generate final result
        await generateResult(newAnswers, newFeedback);
      } else {
        setCurrent(current + 1);
        setAnswer('');
      }
    } catch (err) {
      alert('Evaluation failed');
    } finally {
      setEvalLoading(false);
    }
  };

  // Final result
  const generateResult = async (allAnswers, allFeedback) => {
    try {
      const { data } = await axios.post('/api/mock-interview/result', {
        company, role, round,
        questions: questions.map(q => q.question),
        answers: allAnswers,
        scores: allFeedback.map(f => f.score)
      });
      setResult(data.data);
      setPhase('result');
    } catch {
      setPhase('result');
    }
  };

  const reset = () => {
    setPhase('setup');
    setCompany('');
    setRole('');
    setRound('technical');
    setQuestions([]);
    setAnswers([]);
    setFeedback([]);
    setResult(null);
    setCurrent(0);
    setAnswer('');
  };

  const scoreColor = (s) => s >= 8 ? '#059669' : s >= 6 ? '#d97706' : s >= 4 ? '#f97316' : '#dc2626';
  const avgScore = feedback.length ? (feedback.reduce((a, f) => a + f.score, 0) / feedback.length).toFixed(1) : 0;

  // ── SETUP PHASE ──
  if (phase === 'setup') return (
    <div className="form-card mt-3">
      <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
        <i className="bi bi-mic-fill text-primary me-2"></i>AI Mock Interview
      </h6>

      <div className="mb-3">
        <label className="form-label">Target Company *</label>
        <select className="form-select" value={company} onChange={e => setCompany(e.target.value)}>
          <option value="">Select Company</option>
          {COMPANIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Role *</label>
        <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
          <option value="">Select Role</option>
          {ROLES.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      <div className="mb-4">
        <label className="form-label">Interview Round *</label>
        <div className="row g-2">
          {ROUNDS.map(r => (
            <div key={r.value} className="col-md-4">
              <div
                onClick={() => setRound(r.value)}
                style={{
                  padding: '0.85rem',
                  borderRadius: 10,
                  border: `2px solid ${round === r.value ? '#1a56db' : '#e2e8f0'}`,
                  background: round === r.value ? '#eff6ff' : '#f8fafc',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{r.label}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info box */}
      <div style={{ background: '#eff6ff', borderRadius: 10, padding: '0.85rem', marginBottom: '1rem', border: '1px solid #bfdbfe' }}>
        <div style={{ fontSize: '0.8rem', color: '#1e3a8a', fontWeight: 600, marginBottom: 4 }}>
          <i className="bi bi-info-circle-fill me-1"></i>How it works
        </div>
        <div style={{ fontSize: '0.78rem', color: '#1e40af' }}>
          5 questions tailored for <strong>{company || 'your target company'}</strong> → Answer each one → AI evaluates instantly → Final score + feedback
        </div>
      </div>

      <button
        className="btn btn-primary w-100"
        onClick={startInterview}
        disabled={loading}
      >
        {loading
          ? <><span className="spinner-border spinner-border-sm me-2" />Generating Questions...</>
          : <><i className="bi bi-play-fill me-2" />Start Mock Interview</>
        }
      </button>
    </div>
  );

  // ── INTERVIEW PHASE ──
  if (phase === 'interview') {
    const q = questions[current];
    const progress = ((current) / questions.length) * 100;

    return (
      <div className="form-card mt-3">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, margin: 0 }}>
            <i className="bi bi-mic-fill text-primary me-2"></i>
            {company} — {role}
          </h6>
          <span style={{
            fontSize: '0.72rem', padding: '4px 12px', borderRadius: 20,
            background: '#eff6ff', color: '#1a56db', fontWeight: 700
          }}>
            Q{current + 1}/{questions.length}
          </span>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="progress-bar-custom">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>
            {current} of {questions.length} completed
          </div>
        </div>

        {/* Question */}
        <div style={{
          background: 'linear-gradient(135deg,#0f172a,#1e3a5f)',
          borderRadius: 12, padding: '1.25rem',
          marginBottom: '1rem', position: 'relative'
        }}>
          <div style={{ fontSize: '0.65rem', color: '#06b6d4', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            {q?.difficulty?.toUpperCase()} • {q?.topic}
          </div>
          <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.6 }}>
            {q?.question}
          </div>
          {q?.hint && (
            <div style={{ marginTop: 10, fontSize: '0.75rem', color: '#94a3b8' }}>
              💡 Hint: {q.hint}
            </div>
          )}
        </div>

        {/* Answer */}
        <div className="mb-3">
          <label className="form-label">Your Answer</label>
          <textarea
            className="form-control"
            rows={5}
            placeholder="Type your answer here... Be as detailed as possible."
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            disabled={evalLoading}
          />
        </div>

        {/* Previous feedback */}
        {feedback.length > 0 && (
          <div style={{
            background: '#f8fafc', borderRadius: 10, padding: '0.85rem',
            marginBottom: '1rem', border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 6 }}>
              Previous Answer Score
            </div>
            <div className="d-flex align-items-center gap-2">
              <div style={{
                fontFamily: 'Syne,sans-serif', fontWeight: 800,
                fontSize: '1.5rem', color: scoreColor(feedback[feedback.length - 1].score)
              }}>
                {feedback[feedback.length - 1].score}/10
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {feedback[feedback.length - 1].shortFeedback}
              </div>
            </div>
          </div>
        )}

        <button
          className="btn btn-primary w-100"
          onClick={submitAnswer}
          disabled={evalLoading}
        >
          {evalLoading
            ? <><span className="spinner-border spinner-border-sm me-2" />Evaluating...</>
            : current + 1 === questions.length
              ? <><i className="bi bi-flag-fill me-2" />Submit Final Answer</>
              : <><i className="bi bi-arrow-right me-2" />Submit & Next Question</>
          }
        </button>
      </div>
    );
  }

  // ── RESULT PHASE ──
  if (phase === 'result') {
    const sc = scoreColor(Number(avgScore));

    return (
      <div className="form-card mt-3">
        <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
          <i className="bi bi-trophy-fill text-warning me-2"></i>Interview Result
        </h6>

        {/* Score */}
        <div className="text-center mb-4">
          <div style={{
            width: 130, height: 130, borderRadius: '50%',
            border: `6px solid ${sc}`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto', background: `${sc}10`
          }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '2.2rem', color: sc, lineHeight: 1 }}>
              {avgScore}
            </div>
            <div style={{ fontSize: '0.65rem', color: sc, fontWeight: 700 }}>OUT OF 10</div>
          </div>
          <div style={{ marginTop: 12, fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>
            {Number(avgScore) >= 8 ? '🎉 Excellent Performance!' :
              Number(avgScore) >= 6 ? '👍 Good Performance!' :
                Number(avgScore) >= 4 ? '📈 Needs Improvement' : '💪 Keep Practicing!'}
          </div>
          {result?.overallFeedback && (
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 8 }}>
              {result.overallFeedback}
            </p>
          )}
        </div>

        {/* Per question breakdown */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 10 }}>Question Breakdown</div>
          {questions.map((q, i) => (
            <div key={i} style={{
              background: '#f8fafc', borderRadius: 10, padding: '0.85rem',
              marginBottom: 8, border: '1px solid #e2e8f0'
            }}>
              <div className="d-flex justify-content-between align-items-start mb-1">
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', flex: 1, paddingRight: 8 }}>
                  Q{i + 1}: {q.question}
                </div>
                <span style={{
                  fontFamily: 'Syne,sans-serif', fontWeight: 800,
                  fontSize: '1rem', color: scoreColor(feedback[i]?.score || 0),
                  flexShrink: 0
                }}>
                  {feedback[i]?.score || 0}/10
                </span>
              </div>
              {feedback[i]?.shortFeedback && (
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  → {feedback[i].shortFeedback}
                </div>
              )}
              {feedback[i]?.idealAnswer && (
                <div style={{
                  marginTop: 6, padding: '0.5rem 0.75rem',
                  background: '#eff6ff', borderRadius: 8,
                  fontSize: '0.75rem', color: '#1e3a8a',
                  borderLeft: '3px solid #1a56db'
                }}>
                  <strong>Ideal:</strong> {feedback[i].idealAnswer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tips */}
        {result?.tips?.length > 0 && (
          <div style={{ background: '#fffbeb', borderRadius: 10, padding: '1rem', marginBottom: '1rem', border: '1px solid #fde68a' }}>
            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#d97706', marginBottom: 8 }}>
              <i className="bi bi-lightbulb-fill me-1"></i>Tips to Improve
            </div>
            {result.tips.map((t, i) => (
              <div key={i} style={{ fontSize: '0.8rem', color: '#92400e', marginBottom: 4 }}>
                → {t}
              </div>
            ))}
          </div>
        )}

        <button className="btn btn-primary w-100" onClick={reset}>
          <i className="bi bi-arrow-repeat me-2" />Try Another Interview
        </button>
      </div>
    );
  }
}