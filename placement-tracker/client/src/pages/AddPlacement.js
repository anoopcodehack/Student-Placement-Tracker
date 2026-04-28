import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const pkgColor = p => p>=20?'#7c3aed':p>=10?'#1a56db':p>=5?'#059669':'#64748b';

export default function AddPlacement() {
  const [form, setForm] = useState({
    student:'', company:'', package:'', role:'',
    offerType:'FTE', dateOfOffer:'', location:'', status:'Confirmed', notes:'',
  });
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      axios.get('/api/students', { params:{ isPlaced:false, limit:300 } }),
      axios.get('/api/companies'),
    ]).then(([s,c]) => {
      setStudents(s.data.data);
      setCompanies(c.data.data);
    }).catch(() => toast.error('Failed to load data'));
  }, []);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const selectedStudent = students.find(s=>s._id===form.student);
  const selectedCompany = companies.find(c=>c._id===form.company);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.student || !form.company) return toast.error('Please select student and company');
    setLoading(true);
    try {
      await axios.post('/api/placements', form);
      toast.success('🎉 Placement recorded!');
      navigate('/placements');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="topbar">
        <div>
          <h1 className="page-title">Add Placement</h1>
          <p className="page-sub">Record a new placement offer</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={()=>navigate('/placements')}>
          <i className="bi bi-arrow-left me-2"></i>Back
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-lg-8">
            {/* Student selection */}
            <div className="form-card mb-3">
              <h6 style={{fontFamily:'Syne,sans-serif',fontWeight:700,marginBottom:'1rem',paddingBottom:'0.75rem',borderBottom:'1px solid #e2e8f0'}}>
                <i className="bi bi-person-check-fill text-primary me-2"></i>Select Student (Unplaced only)
              </h6>
              <div style={{position:'relative',marginBottom:10}}>
                <i className="bi bi-search" style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',color:'#94a3b8',fontSize:'0.85rem'}}></i>
                <input className="form-control" style={{paddingLeft:32}} placeholder="Search by name or roll no..."
                  value={studentSearch} onChange={e=>setStudentSearch(e.target.value)} />
              </div>
              <div className="student-select-list">
                {filtered.length === 0 ? (
                  <div className="text-center py-4 text-muted" style={{fontSize:'0.85rem'}}>No unplaced students found</div>
                ) : filtered.slice(0,40).map(s=>(
                  <div key={s._id} className={`student-select-item ${form.student===s._id?'selected':''}`}
                    onClick={()=>setForm({...form,student:s._id})}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span style={{fontWeight:600}}>{s.name}</span>
                        <span style={{fontSize:'0.72rem',color:'#94a3b8',marginLeft:8}}>{s.rollNo}</span>
                      </div>
                      <div style={{fontSize:'0.72rem',color:'#94a3b8'}}>{s.branch} · Batch {s.batch} · {s.cgpa} CGPA</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Offer details */}
            <div className="form-card">
              <h6 style={{fontFamily:'Syne,sans-serif',fontWeight:700,marginBottom:'1rem',paddingBottom:'0.75rem',borderBottom:'1px solid #e2e8f0'}}>
                <i className="bi bi-briefcase-fill text-primary me-2"></i>Offer Details
              </h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Company *</label>
                  <select className="form-select" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} required>
                    <option value="">Select Company</option>
                    {companies.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Role / Designation *</label>
                  <input className="form-control" placeholder="e.g. Software Engineer"
                    value={form.role} onChange={e=>setForm({...form,role:e.target.value})} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Package (LPA) *</label>
                  <input type="number" className="form-control" placeholder="e.g. 12.5" min="0" step="0.1"
                    value={form.package} onChange={e=>setForm({...form,package:e.target.value})} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Offer Type</label>
                  <select className="form-select" value={form.offerType} onChange={e=>setForm({...form,offerType:e.target.value})}>
                    {['FTE','Intern','Intern+FTE'].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                    {['Confirmed','Pending','Rejected'].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Date of Offer</label>
                  <input type="date" className="form-control" value={form.dateOfOffer}
                    onChange={e=>setForm({...form,dateOfOffer:e.target.value})} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Location</label>
                  <input className="form-control" placeholder="e.g. Bangalore"
                    value={form.location} onChange={e=>setForm({...form,location:e.target.value})} />
                </div>
                <div className="col-12">
                  <label className="form-label">Notes (optional)</label>
                  <textarea className="form-control" rows={2} placeholder="Any additional notes..."
                    value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="col-lg-4">
            <div className="form-card" style={{position:'sticky',top:'1.5rem'}}>
              <h6 style={{fontFamily:'Syne,sans-serif',fontWeight:700,marginBottom:'1rem',paddingBottom:'0.75rem',borderBottom:'1px solid #e2e8f0'}}>
                <i className="bi bi-eye-fill text-primary me-2"></i>Preview
              </h6>

              {selectedStudent ? (
                <div style={{background:'#eff6ff',borderRadius:10,padding:'0.85rem',marginBottom:12}}>
                  <div style={{fontWeight:700,fontSize:'0.9rem'}}>{selectedStudent.name}</div>
                  <div style={{fontSize:'0.75rem',color:'#1e40af',marginTop:3}}>
                    {selectedStudent.rollNo} · {selectedStudent.branch} · CGPA {selectedStudent.cgpa}
                  </div>
                  {selectedStudent.skills?.length>0&&(
                    <div className="mt-2 d-flex flex-wrap gap-1">
                      {selectedStudent.skills.slice(0,3).map((sk,i)=>(
                        <span key={i} style={{fontSize:'0.62rem',padding:'2px 6px',borderRadius:10,background:'#dbeafe',color:'#1e40af'}}>{sk}</span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{background:'#f8fafc',borderRadius:10,padding:'0.85rem',marginBottom:12,textAlign:'center',color:'#94a3b8',fontSize:'0.85rem'}}>
                  <i className="bi bi-person" style={{fontSize:'1.5rem',display:'block',marginBottom:4}}></i>
                  No student selected
                </div>
              )}

              {selectedCompany && (
                <div style={{background:'#f0fdf4',borderRadius:10,padding:'0.85rem',marginBottom:12}}>
                  <div style={{fontWeight:700,fontSize:'0.9rem'}}>{selectedCompany.name}</div>
                  <div style={{fontSize:'0.75rem',color:'#059669',marginTop:3}}>{selectedCompany.industry} · {selectedCompany.type}</div>
                </div>
              )}

              {form.package && (
                <div style={{
                  background:'linear-gradient(135deg,#eff6ff,#f0fdf4)',
                  borderRadius:12,padding:'1.25rem',textAlign:'center',
                  border:'1px solid #bfdbfe'
                }}>
                  <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'2.5rem',color:pkgColor(parseFloat(form.package)),lineHeight:1}}>
                    ₹{form.package}
                  </div>
                  <div style={{fontSize:'0.8rem',color:'#64748b',marginTop:4}}>LPA · {form.offerType}</div>
                  {form.role && <div style={{fontSize:'0.78rem',color:'#475569',marginTop:6,fontWeight:600}}>{form.role}</div>}
                </div>
              )}

              <div style={{marginTop:12,padding:'0.75rem',background:'#fffbeb',borderRadius:10,fontSize:'0.78rem',color:'#92400e'}}>
                <i className="bi bi-info-circle me-1"></i>
                Recording this will mark the student as <strong>Placed</strong> and update their profile automatically.
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex gap-2 mt-3">
          <button type="submit" className="btn btn-primary px-4" disabled={loading}>
            {loading ? <><span className="spinner-border spinner-border-sm me-2"/>Saving...</> :
              <><i className="bi bi-award-fill me-2"></i>Record Placement</>}
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={()=>navigate('/placements')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
