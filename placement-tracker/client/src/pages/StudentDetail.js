import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';

const cgpaColor = c => c>=8?'#059669':c>=6?'#d97706':'#dc2626';
const fmtDate   = d => d ? new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : '—';

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(()=>{
    axios.get(`/api/students/${id}`)
      .then(r=>setStudent(r.data.data))
      .catch(()=>toast.error('Student not found'))
      .finally(()=>setLoading(false));
  },[id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/students/${id}`);
      toast.success('Student deleted');
      navigate('/students');
    } catch (err) { toast.error(err.response?.data?.message||'Delete failed'); }
  };

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{height:'60vh'}}><div className="spinner-border text-primary"/></div>;
  if (!student) return <div className="text-center py-5 text-muted">Student not found</div>;

  const initials = student.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
  const cc = cgpaColor(student.cgpa);

  return (
    <div>
      <div className="topbar">
        <button className="btn btn-outline-secondary" onClick={()=>navigate('/students')}>
          <i className="bi bi-arrow-left me-2"></i>All Students
        </button>
        {isAdmin && (
          <div className="d-flex gap-2">
            <Link to={`/students/edit/${id}`} className="btn btn-outline-primary">
              <i className="bi bi-pencil me-1"></i>Edit
            </Link>
            <button className="btn btn-outline-danger" onClick={()=>setShowDelete(true)}>
              <i className="bi bi-trash me-1"></i>Delete
            </button>
          </div>
        )}
      </div>

      <div className="row g-3">
        {/* Left col */}
        <div className="col-lg-4">
          {/* Profile card */}
          <div className="form-card text-center mb-3">
            <div style={{
              width:80,height:80,borderRadius:'50%',margin:'0 auto 1rem',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:'1.8rem',fontWeight:800,fontFamily:'Syne,sans-serif',
              background:student.isPlaced
                ?'linear-gradient(135deg,#1a56db,#06b6d4)'
                :'linear-gradient(135deg,#64748b,#94a3b8)',
              color:'#fff',
            }}>{initials}</div>
            <h4 style={{fontFamily:'Syne,sans-serif',fontWeight:800,marginBottom:4}}>{student.name}</h4>
            <p style={{color:'#64748b',fontSize:'0.85rem',marginBottom:12}}>{student.email}</p>
            <span className={`badge rounded-pill px-3 py-2 mb-4 ${student.isPlaced?'badge-placed':'badge-unplaced'}`}>
              {student.isPlaced?'✓ Placed':'○ Unplaced'}
            </span>
            <div className="row g-2 text-center">
              {[
                {l:'Roll No',v:student.rollNo},
                {l:'Branch',v:student.branch},
                {l:'Batch',v:student.batch},
                {l:'Gender',v:student.gender||'—'},
              ].map((item,i)=>(
                <div key={i} className="col-6">
                  <div className="metric-box">
                    <div style={{fontWeight:700,fontSize:'0.85rem',color:'#1e293b'}}>{item.v}</div>
                    <div className="metric-lbl">{item.l}</div>
                  </div>
                </div>
              ))}
            </div>
            {(student.linkedin||student.github) && (
              <div className="d-flex gap-2 justify-content-center mt-3">
                {student.linkedin && <a href={student.linkedin} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary"><i className="bi bi-linkedin me-1"></i>LinkedIn</a>}
                {student.github && <a href={student.github} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-dark"><i className="bi bi-github me-1"></i>GitHub</a>}
              </div>
            )}
          </div>

          {/* Skills */}
          {student.skills?.length>0 && (
            <div className="form-card mb-3">
              <h6 style={{fontFamily:'Syne,sans-serif',fontWeight:700,marginBottom:'0.75rem'}}>
                <i className="bi bi-lightning-charge-fill text-warning me-2"></i>Skills
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {student.skills.map((s,i)=>(
                  <span key={i} style={{
                    fontSize:'0.75rem',padding:'4px 12px',borderRadius:20,
                    background:'#eff6ff',color:'#1a56db',border:'1px solid #bfdbfe',fontWeight:600
                  }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          <div className="form-card">
            <h6 style={{fontFamily:'Syne,sans-serif',fontWeight:700,marginBottom:'0.75rem'}}>
              <i className="bi bi-telephone-fill text-primary me-2"></i>Contact
            </h6>
            {[
              {icon:'bi-envelope-fill',label:'Email',val:student.email},
              {icon:'bi-phone-fill',label:'Phone',val:student.phone||'—'},
            ].map((item,i)=>(
              <div key={i} className="d-flex align-items-center gap-3 mb-2 p-3" style={{background:'#f8fafc',borderRadius:10}}>
                <i className={`bi ${item.icon}`} style={{color:'#1a56db',fontSize:'1rem'}}></i>
                <div>
                  <div style={{fontSize:'0.65rem',color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.06em'}}>{item.label}</div>
                  <div style={{fontWeight:600,fontSize:'0.855rem'}}>{item.val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right col */}
        <div className="col-lg-8">
          {/* Academic */}
          <div className="form-card mb-3">
            <h6 style={{fontFamily:'Syne,sans-serif',fontWeight:700,marginBottom:'1rem',paddingBottom:'0.75rem',borderBottom:'1px solid #e2e8f0'}}>
              <i className="bi bi-mortarboard-fill text-primary me-2"></i>Academic Details
            </h6>
            <div className="row g-3 mb-3">
              {[
                {l:'CGPA',v:student.cgpa,color:cc,suffix:'/10'},
                {l:'10th %',v:student.tenthPercent?`${student.tenthPercent}%`:'—'},
                {l:'12th %',v:student.twelfthPercent?`${student.twelfthPercent}%`:'—'},
                {l:'Backlogs',v:student.backlogs??0,color:student.backlogs>0?'#dc2626':'#059669'},
              ].map((item,i)=>(
                <div key={i} className="col-6 col-md-3">
                  <div className="metric-box" style={{padding:'1rem'}}>
                    <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1.5rem',color:item.color||'#1e293b',lineHeight:1}}>
                      {item.v}<span style={{fontSize:'0.65rem',color:'#94a3b8',fontWeight:400}}>{item.suffix||''}</span>
                    </div>
                    <div className="metric-lbl">{item.l}</div>
                  </div>
                </div>
              ))}
            </div>
            {student.cgpa && (
              <div>
                <div className="d-flex justify-content-between mb-1" style={{fontSize:'0.75rem',color:'#64748b'}}>
                  <span>CGPA Progress</span><span style={{fontWeight:700,color:cc}}>{student.cgpa}/10</span>
                </div>
                <div className="progress-bar-custom">
                  <div className="progress-bar-fill" style={{width:`${(student.cgpa/10)*100}%`,background:`linear-gradient(90deg,${cc},${cc}aa)`}}/>
                </div>
              </div>
            )}
          </div>

          {/* Placement */}
          {student.isPlaced && student.placementDetails?.package ? (
            <div className="form-card" style={{background:'linear-gradient(135deg,#eff6ff,#f0fdf4)',border:'1px solid #bfdbfe'}}>
              <h6 style={{fontFamily:'Syne,sans-serif',fontWeight:700,marginBottom:'1rem',paddingBottom:'0.75rem',borderBottom:'1px solid #bfdbfe'}}>
                <i className="bi bi-trophy-fill text-warning me-2"></i>Placement Details
              </h6>
              <div className="row g-3 align-items-center">
                <div className="col-md-4 text-center">
                  <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'2.8rem',color:'#1a56db',lineHeight:1}}>
                    ₹{student.placementDetails.package}
                  </div>
                  <div style={{fontSize:'0.75rem',color:'#64748b',marginTop:4}}>LPA Package</div>
                </div>
                <div className="col-md-8">
                  <div className="row g-2">
                    {[
                      {l:'Company',v:student.placementDetails.company?.name||'N/A'},
                      {l:'Role',v:student.placementDetails.role||'—'},
                      {l:'Offer Type',v:student.placementDetails.offerType||'—'},
                      {l:'Date of Offer',v:fmtDate(student.placementDetails.dateOfOffer)},
                    ].map((item,i)=>(
                      <div key={i} className="col-6">
                        <div style={{padding:'0.65rem',background:'rgba(255,255,255,0.6)',borderRadius:10}}>
                          <div style={{fontSize:'0.65rem',color:'#64748b',textTransform:'uppercase',letterSpacing:'0.06em'}}>{item.l}</div>
                          <div style={{fontWeight:700,fontSize:'0.875rem',marginTop:2}}>{item.v}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="form-card text-center py-4" style={{background:'#f8fafc',border:'2px dashed #e2e8f0'}}>
              <i className="bi bi-briefcase" style={{fontSize:'2.5rem',color:'#cbd5e1'}}></i>
              <h6 style={{fontFamily:'Syne,sans-serif',marginTop:12,color:'#64748b'}}>Not Placed Yet</h6>
              <p style={{fontSize:'0.85rem',color:'#94a3b8',marginBottom:0}}>This student hasn't received a placement offer yet.</p>
              {isAdmin && (
                <Link to="/placements/add" className="btn btn-primary btn-sm mt-3">
                  <i className="bi bi-award me-1"></i>Add Placement
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        show={showDelete}
        title="Delete Student"
        message={`Are you sure you want to permanently delete "${student.name}"?`}
        onConfirm={handleDelete}
        onCancel={()=>setShowDelete(false)}
        confirmText="Delete"
      />
    </div>
  );
}
