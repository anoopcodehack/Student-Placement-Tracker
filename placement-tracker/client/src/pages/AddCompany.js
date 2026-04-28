import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const BRANCHES = ['CSE','ECE','EEE','ME','CE','IT','AIDS','AIML','CSD'];
const INDUSTRIES = ['IT','Finance','Core','Consulting','Product','Service','Startup','PSU','Other'];
const TYPES = ['MNC','Startup','PSU','SME'];

export default function AddCompany() {
  const [form, setForm] = useState({
    name:'', industry:'IT', type:'MNC', website:'', description:'',
    visitDate:'', roles:'',
    packageRange:{ min:'', max:'' },
    eligibilityCriteria:{ minCGPA:6.0, maxBacklogs:0, branches:[] },
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleBranch = branch => {
    const { branches } = form.eligibilityCriteria;
    setForm({ ...form, eligibilityCriteria: {
      ...form.eligibilityCriteria,
      branches: branches.includes(branch) ? branches.filter(b=>b!==branch) : [...branches,branch]
    }});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, roles: form.roles.split(',').map(r=>r.trim()).filter(Boolean) };
      await axios.post('/api/companies', payload);
      toast.success('Company added!');
      navigate('/companies');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setLoading(false); }
  };

  const INDUSTRY_COLORS = { IT:'#1a56db',Product:'#059669',Finance:'#d97706',Consulting:'#0891b2',Core:'#64748b',Startup:'#dc2626',PSU:'#7c3aed',Service:'#6366f1',Other:'#94a3b8' };
  const color = INDUSTRY_COLORS[form.industry] || '#94a3b8';

  return (
    <div>
      <div className="topbar">
        <div>
          <h1 className="page-title">Add Company</h1>
          <p className="page-sub">Register a new recruiting company</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={()=>navigate('/companies')}>
          <i className="bi bi-arrow-left me-2"></i>Back
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-lg-8">
            <div className="form-card mb-3">
              <h6 style={{fontFamily:'Syne,sans-serif',fontWeight:700,marginBottom:'1rem',paddingBottom:'0.75rem',borderBottom:'1px solid #e2e8f0'}}>
                <i className="bi bi-building-fill text-primary me-2"></i>Company Information
              </h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Company Name *</label>
                  <input className="form-control" placeholder="e.g. Google" value={form.name}
                    onChange={e=>setForm({...form,name:e.target.value})} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Industry</label>
                  <select className="form-select" value={form.industry} onChange={e=>setForm({...form,industry:e.target.value})}>
                    {INDUSTRIES.map(i=><option key={i}>{i}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                    {TYPES.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Website</label>
                  <input className="form-control" placeholder="https://company.com" value={form.website}
                    onChange={e=>setForm({...form,website:e.target.value})} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Campus Visit Date</label>
                  <input type="date" className="form-control" value={form.visitDate}
                    onChange={e=>setForm({...form,visitDate:e.target.value})} />
                </div>
                <div className="col-12">
                  <label className="form-label">Roles Offered <span style={{color:'#94a3b8',fontWeight:400,fontSize:'0.75rem'}}>(comma separated)</span></label>
                  <input className="form-control" placeholder="Software Engineer, Data Analyst, Product Manager"
                    value={form.roles} onChange={e=>setForm({...form,roles:e.target.value})} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Min Package (LPA)</label>
                  <div style={{position:'relative'}}>
                    <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#94a3b8',fontSize:'0.85rem'}}>₹</span>
                    <input type="number" className="form-control" style={{paddingLeft:26}} placeholder="3.5" min="0" step="0.5"
                      value={form.packageRange.min} onChange={e=>setForm({...form,packageRange:{...form.packageRange,min:e.target.value}})} />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Max Package (LPA)</label>
                  <div style={{position:'relative'}}>
                    <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#94a3b8',fontSize:'0.85rem'}}>₹</span>
                    <input type="number" className="form-control" style={{paddingLeft:26}} placeholder="45" min="0" step="0.5"
                      value={form.packageRange.max} onChange={e=>setForm({...form,packageRange:{...form.packageRange,max:e.target.value}})} />
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={3} placeholder="Brief about the company, work culture, job profile..."
                    value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            {/* Eligibility */}
            <div className="form-card mb-3">
              <h6 style={{fontFamily:'Syne,sans-serif',fontWeight:700,marginBottom:'1rem',paddingBottom:'0.75rem',borderBottom:'1px solid #e2e8f0'}}>
                <i className="bi bi-funnel-fill text-primary me-2"></i>Eligibility Criteria
              </h6>
              <div className="mb-3">
                <label className="form-label">Minimum CGPA</label>
                <input type="number" className="form-control" min="0" max="10" step="0.1"
                  value={form.eligibilityCriteria.minCGPA}
                  onChange={e=>setForm({...form,eligibilityCriteria:{...form.eligibilityCriteria,minCGPA:parseFloat(e.target.value)}})} />
              </div>
              <div className="mb-3">
                <label className="form-label">Max Active Backlogs Allowed</label>
                <input type="number" className="form-control" min="0"
                  value={form.eligibilityCriteria.maxBacklogs}
                  onChange={e=>setForm({...form,eligibilityCriteria:{...form.eligibilityCriteria,maxBacklogs:parseInt(e.target.value)}})} />
              </div>
              <div>
                <label className="form-label">Eligible Branches</label>
                <div className="d-flex flex-wrap gap-2">
                  {BRANCHES.map(b=>(
                    <button type="button" key={b}
                      className={`skill-pill ${form.eligibilityCriteria.branches.includes(b)?'active':''}`}
                      onClick={()=>toggleBranch(b)}>{b}</button>
                  ))}
                </div>
                <div style={{fontSize:'0.72rem',color:'#94a3b8',marginTop:6}}>
                  {form.eligibilityCriteria.branches.length===0?'All branches eligible':
                    `${form.eligibilityCriteria.branches.length} branch(es) selected`}
                </div>
              </div>
            </div>

            {/* Live preview card */}
            {form.name && (
              <div className="company-card fade-in">
                <div className="company-card-accent" style={{background:`linear-gradient(90deg,${color},${color}80)`}}/>
                <div className="mt-1 d-flex align-items-center gap-3 mb-3">
                  <div className="avatar" style={{width:46,height:46,fontSize:'1rem',fontWeight:800,background:`${color}15`,color,borderRadius:12}}>
                    {form.name.slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{fontWeight:700,fontSize:'0.95rem'}}>{form.name}</div>
                    <span style={{fontSize:'0.65rem',fontWeight:600,padding:'2px 8px',borderRadius:20,background:`${color}15`,color}}>
                      {form.industry}
                    </span>
                  </div>
                </div>
                <div className="row g-2">
                  <div className="col-4"><div className="metric-box"><div className="metric-val" style={{color:'#059669',fontSize:'0.95rem'}}>{form.packageRange.min?`₹${form.packageRange.min}L`:'—'}</div><div className="metric-lbl">Min</div></div></div>
                  <div className="col-4"><div className="metric-box"><div className="metric-val" style={{color:'#d97706',fontSize:'0.95rem'}}>{form.packageRange.max?`₹${form.packageRange.max}L`:'—'}</div><div className="metric-lbl">Max</div></div></div>
                  <div className="col-4"><div className="metric-box"><div className="metric-val" style={{color:'#1a56db',fontSize:'0.95rem'}}>{form.type}</div><div className="metric-lbl">Type</div></div></div>
                </div>
                <div style={{marginTop:8,fontSize:'0.72rem',color:'#94a3b8'}}>Preview of company card</div>
              </div>
            )}
          </div>
        </div>

        <div className="d-flex gap-2 mt-3">
          <button type="submit" className="btn btn-primary px-4" disabled={loading}>
            {loading ? <><span className="spinner-border spinner-border-sm me-2"/>Saving...</> :
              <><i className="bi bi-building-add me-2"></i>Add Company</>}
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={()=>navigate('/companies')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
