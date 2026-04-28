import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const BRANCHES = ['CSE','ECE','EEE','ME','CE','IT','AIDS','AIML','CSD','Other'];
const SKILLS = ['JavaScript','Python','Java','C++','React','Node.js','MongoDB','SQL','DSA','Machine Learning','AWS','Docker','TypeScript','Go','Flutter','Kotlin'];

const defaultForm = {
  name:'', rollNo:'', email:'', phone:'', branch:'CSE',
  batch:new Date().getFullYear(), cgpa:'', tenthPercent:'',
  twelfthPercent:'', backlogs:0, gender:'Male', skills:[], linkedin:'', github:'',
};

export default function AddStudent() {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (!isEdit) return;
    setFetching(true);
    axios.get(`/api/students/${id}`)
      .then(res => {
        const s = res.data.data;
        setForm({ name:s.name||'', rollNo:s.rollNo||'', email:s.email||'',
          phone:s.phone||'', branch:s.branch||'CSE', batch:s.batch||2024,
          cgpa:s.cgpa||'', tenthPercent:s.tenthPercent||'',
          twelfthPercent:s.twelfthPercent||'', backlogs:s.backlogs||0,
          gender:s.gender||'Male', skills:s.skills||[], linkedin:s.linkedin||'', github:s.github||'',
        });
      })
      .catch(() => toast.error('Failed to load student'))
      .finally(() => setFetching(false));
  }, [id]);

  const toggleSkill = skill =>
    setForm(f => ({ ...f, skills: f.skills.includes(skill) ? f.skills.filter(s=>s!==skill) : [...f.skills,skill] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) { await axios.put(`/api/students/${id}`, form); toast.success('Student updated!'); }
      else { await axios.post('/api/students', form); toast.success('Student added!'); }
      navigate('/students');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setLoading(false); }
  };

  if (fetching) return <div className="text-center py-5"><div className="spinner-border text-primary"/></div>;

  const inputClass = 'form-control';

  return (
    <div>
      <div className="topbar">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Student' : 'Add Student'}</h1>
          <p className="page-sub">{isEdit ? 'Update student information' : 'Fill in the student details below'}</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={()=>navigate('/students')}>
          <i className="bi bi-arrow-left me-2"></i>Back
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-lg-8">
            {/* Personal */}
            <div className="form-card mb-3">
              <h6 style={{fontFamily:'Syne,sans-serif',fontWeight:700,marginBottom:'1rem',paddingBottom:'0.75rem',borderBottom:'1px solid #e2e8f0'}}>
                <i className="bi bi-person-fill text-primary me-2"></i>Personal Information
              </h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name *</label>
                  <input className={inputClass} placeholder="Aarav Sharma" value={form.name}
                    onChange={e=>setForm({...form,name:e.target.value})} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Roll Number *</label>
                  <input className={inputClass} placeholder="2024CSE001" value={form.rollNo}
                    onChange={e=>setForm({...form,rollNo:e.target.value})} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email *</label>
                  <input type="email" className={inputClass} placeholder="aarav@college.edu" value={form.email}
                    onChange={e=>setForm({...form,email:e.target.value})} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input className={inputClass} placeholder="9876543210" value={form.phone}
                    onChange={e=>setForm({...form,phone:e.target.value})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Gender</label>
                  <select className="form-select" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}>
                    {['Male','Female','Other'].map(g=><option key={g}>{g}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">LinkedIn</label>
                  <input className={inputClass} placeholder="linkedin.com/in/..." value={form.linkedin}
                    onChange={e=>setForm({...form,linkedin:e.target.value})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">GitHub</label>
                  <input className={inputClass} placeholder="github.com/..." value={form.github}
                    onChange={e=>setForm({...form,github:e.target.value})} />
                </div>
              </div>
            </div>

            {/* Academic */}
            <div className="form-card">
              <h6 style={{fontFamily:'Syne,sans-serif',fontWeight:700,marginBottom:'1rem',paddingBottom:'0.75rem',borderBottom:'1px solid #e2e8f0'}}>
                <i className="bi bi-mortarboard-fill text-primary me-2"></i>Academic Details
              </h6>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Branch *</label>
                  <select className="form-select" value={form.branch} onChange={e=>setForm({...form,branch:e.target.value})} required>
                    {BRANCHES.map(b=><option key={b}>{b}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Graduation Year *</label>
                  <input type="number" className={inputClass} min="2020" max="2030" value={form.batch}
                    onChange={e=>setForm({...form,batch:parseInt(e.target.value)})} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">CGPA <span style={{fontSize:'0.72rem',color:'#94a3b8'}}>(out of 10)</span></label>
                  <input type="number" className={inputClass} placeholder="8.5" min="0" max="10" step="0.01" value={form.cgpa}
                    onChange={e=>setForm({...form,cgpa:parseFloat(e.target.value)})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">10th Percentage</label>
                  <input type="number" className={inputClass} placeholder="90.5" min="0" max="100" step="0.1" value={form.tenthPercent}
                    onChange={e=>setForm({...form,tenthPercent:parseFloat(e.target.value)})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">12th Percentage</label>
                  <input type="number" className={inputClass} placeholder="88.0" min="0" max="100" step="0.1" value={form.twelfthPercent}
                    onChange={e=>setForm({...form,twelfthPercent:parseFloat(e.target.value)})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Active Backlogs</label>
                  <input type="number" className={inputClass} min="0" value={form.backlogs}
                    onChange={e=>setForm({...form,backlogs:parseInt(e.target.value)})} />
                </div>
              </div>
            </div>
          </div>

          {/* Skills sidebar */}
          <div className="col-lg-4">
            <div className="form-card h-100">
              <h6 style={{fontFamily:'Syne,sans-serif',fontWeight:700,marginBottom:'1rem',paddingBottom:'0.75rem',borderBottom:'1px solid #e2e8f0'}}>
                <i className="bi bi-lightning-charge-fill text-warning me-2"></i>Technical Skills
              </h6>
              <p style={{fontSize:'0.78rem',color:'#94a3b8',marginBottom:'0.75rem'}}>Click to select skills</p>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {SKILLS.map(skill=>(
                  <button type="button" key={skill}
                    className={`skill-pill ${form.skills.includes(skill)?'active':''}`}
                    onClick={()=>toggleSkill(skill)}>
                    {form.skills.includes(skill)&&<i className="bi bi-check me-1" style={{fontSize:'0.7rem'}}></i>}
                    {skill}
                  </button>
                ))}
              </div>
              <div style={{
                fontSize:'0.78rem',padding:'8px 12px',borderRadius:8,
                background:form.skills.length>0?'#eff6ff':'#f8fafc',
                color:form.skills.length>0?'#1a56db':'#94a3b8',
                border:`1px solid ${form.skills.length>0?'#bfdbfe':'#e2e8f0'}`
              }}>
                <i className="bi bi-check-circle me-1"></i>
                {form.skills.length} skill{form.skills.length!==1?'s':''} selected
              </div>

              {/* Live preview */}
              {(form.name||form.branch||form.cgpa) && (
                <div style={{marginTop:'1rem',padding:'0.85rem',background:'linear-gradient(135deg,#0f172a,#1e3a5f)',borderRadius:10,color:'#fff'}}>
                  <div style={{fontSize:'0.62rem',color:'#64748b',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:6}}>Preview</div>
                  <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'0.95rem'}}>{form.name||'Student Name'}</div>
                  <div style={{fontSize:'0.72rem',color:'#94a3b8',marginTop:2}}>{form.branch} · Batch {form.batch}</div>
                  {form.cgpa && <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1.4rem',marginTop:6,color:'#06b6d4'}}>{form.cgpa} <span style={{fontSize:'0.7rem',color:'#475569'}}>CGPA</span></div>}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 mt-3">
          <button type="submit" className="btn btn-primary px-4" disabled={loading}>
            {loading ? <><span className="spinner-border spinner-border-sm me-2"/>Saving...</> :
              <><i className={`bi ${isEdit?'bi-pencil-fill':'bi-person-plus-fill'} me-2`}></i>
              {isEdit?'Update Student':'Add Student'}</>}
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={()=>navigate('/students')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
