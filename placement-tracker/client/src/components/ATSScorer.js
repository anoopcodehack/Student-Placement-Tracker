import { useState } from 'react';
import axios from 'axios';

export default function ATSScorer({ student }) {
  const [jd, setJd] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const scoreColor = (score) => {
    if (score >= 80) return '#059669';
    if (score >= 60) return '#d97706';
    if (score >= 40) return '#f97316';
    return '#dc2626';
  };

  const handleAnalyze = async () => {
    if (!file && !student.resume) {
      return alert('Please upload a resume PDF');
    }
    if (!jd.trim()) return alert('Please enter a job description');

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('jobDescription', jd);

      if (file) {
        formData.append('resume', file);
      } else {
        // fetch existing resume and convert to file
        const res = await fetch(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${student.resume}`
        );
        const blob = await res.blob();
        formData.append('resume', blob, 'resume.pdf');
      }

      const { data } = await axios.post('/api/ats', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setResult(data.data);
    } catch (err) {
      console.error('ATS Scorer Error:', err);
      alert(err.response?.data?.message || err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const sc = result ? scoreColor(result.matchScore) : null;

  return (
    <div className="form-card mt-3">
      <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
        <i className="bi bi-robot text-primary me-2"></i>AI Resume ATS Scorer
      </h6>

      {/* JD Input */}
      <div className="mb-3">
        <label className="form-label">Job Description *</label>
        <textarea
          className="form-control"
          rows={4}
          placeholder="Paste the job description here..."
          value={jd}
          onChange={e => setJd(e.target.value)}
        />
      </div>

      {/* Resume Upload */}
      <div className="mb-3">
        <label className="form-label">
          Resume PDF
          {student.resume && <span style={{ color: '#059669', fontSize: '0.75rem', marginLeft: 8 }}>✓ Existing resume will be used if no file uploaded</span>}
        </label>
        <input
          type="file"
          className="form-control"
          accept=".pdf"
          onChange={e => setFile(e.target.files[0])}
        />
      </div>

      {/* Analyze Button */}
      <button
        className="btn btn-primary w-100"
        onClick={handleAnalyze}
        disabled={loading}
      >
        {loading ? (
          <><span className="spinner-border spinner-border-sm me-2" />Analyzing Resume...</>
        ) : (
          <><i className="bi bi-stars me-2" />Analyze with AI</>
        )}
      </button>

      {/* Results */}
      {result && (
        <div className="mt-4">

          {/* Score Circle */}
          <div className="text-center mb-4">
            <div style={{
              width: 120, height: 120, borderRadius: '50%',
              border: `6px solid ${sc}`,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto',
              background: `${sc}10`
            }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '2rem', color: sc, lineHeight: 1 }}>
                {result.matchScore}%
              </div>
              <div style={{ fontSize: '0.65rem', color: sc, fontWeight: 600, textTransform: 'uppercase' }}>
                {result.matchLevel}
              </div>
            </div>
            <p style={{ marginTop: 12, fontSize: '0.85rem', color: '#64748b' }}>{result.summary}</p>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.75rem', color: '#64748b' }}>
              <span>ATS Match Score</span>
              <span style={{ fontWeight: 700, color: sc }}>{result.matchScore}/100</span>
            </div>
            <div className="progress-bar-custom">
              <div className="progress-bar-fill" style={{
                width: `${result.matchScore}%`,
                background: `linear-gradient(90deg, ${sc}, ${sc}aa)`
              }} />
            </div>
          </div>

          <div className="row g-3">

            {/* Matched Keywords */}
            <div className="col-md-6">
              <div style={{ background: '#f0fdf4', borderRadius: 10, padding: '1rem', border: '1px solid #bbf7d0' }}>
                <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#059669', marginBottom: 8 }}>
                  <i className="bi bi-check-circle-fill me-1"></i>
                  Matched Keywords ({result.matchedKeywords.length})
                </div>
                <div className="d-flex flex-wrap gap-1">
                  {result.matchedKeywords.map((k, i) => (
                    <span key={i} style={{
                      fontSize: '0.72rem', padding: '3px 10px', borderRadius: 20,
                      background: '#dcfce7', color: '#166534', fontWeight: 600
                    }}>{k}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="col-md-6">
              <div style={{ background: '#fef2f2', borderRadius: 10, padding: '1rem', border: '1px solid #fecaca' }}>
                <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#dc2626', marginBottom: 8 }}>
                  <i className="bi bi-x-circle-fill me-1"></i>
                  Missing Keywords ({result.missingKeywords.length})
                </div>
                <div className="d-flex flex-wrap gap-1">
                  {result.missingKeywords.map((k, i) => (
                    <span key={i} style={{
                      fontSize: '0.72rem', padding: '3px 10px', borderRadius: 20,
                      background: '#fee2e2', color: '#991b1b', fontWeight: 600
                    }}>{k}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div className="col-md-6">
              <div style={{ background: '#eff6ff', borderRadius: 10, padding: '1rem', border: '1px solid #bfdbfe' }}>
                <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#1a56db', marginBottom: 8 }}>
                  <i className="bi bi-star-fill me-1"></i>Strengths
                </div>
                {result.strengths.map((s, i) => (
                  <div key={i} style={{ fontSize: '0.8rem', color: '#1e3a8a', marginBottom: 4, display: 'flex', gap: 6 }}>
                    <span style={{ color: '#1a56db', flexShrink: 0 }}>✓</span>{s}
                  </div>
                ))}
              </div>
            </div>

            {/* Improvements */}
            <div className="col-md-6">
              <div style={{ background: '#fffbeb', borderRadius: 10, padding: '1rem', border: '1px solid #fde68a' }}>
                <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#d97706', marginBottom: 8 }}>
                  <i className="bi bi-lightbulb-fill me-1"></i>Improvements
                </div>
                {result.improvements.map((s, i) => (
                  <div key={i} style={{ fontSize: '0.8rem', color: '#92400e', marginBottom: 4, display: 'flex', gap: 6 }}>
                    <span style={{ color: '#d97706', flexShrink: 0 }}>→</span>{s}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}