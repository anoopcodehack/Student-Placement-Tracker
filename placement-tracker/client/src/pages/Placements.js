import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';

const pkgColor = p => p>=20?'#7c3aed':p>=10?'#1a56db':p>=5?'#059669':'#64748b';
const fmtDate  = d => d ? new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : '—';

export default function Placements() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ offerType:'', status:'' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { isAdmin } = useAuth();

  const fetchPlacements = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.offerType) params.offerType = filter.offerType;
      if (filter.status) params.status = filter.status;
      const res = await axios.get('/api/placements', { params });
      setPlacements(res.data.data);
    } catch { toast.error('Failed to load placements'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPlacements(); }, [filter]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/placements/${deleteTarget._id}`);
      toast.success('Placement removed');
      setDeleteTarget(null);
      fetchPlacements();
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  const avgPkg = placements.length
    ? (placements.reduce((s,p)=>s+p.package,0)/placements.length).toFixed(1)
    : 0;
  const maxPkg = placements.length ? Math.max(...placements.map(p=>p.package)) : 0;

  return (
    <div>
      <div className="topbar">
        <div>
          <h1 className="page-title">Placements</h1>
          <p className="page-sub">{placements.length} records · Avg ₹{avgPkg} LPA · Max ₹{maxPkg} LPA</p>
        </div>
        {isAdmin && (
          <Link to="/placements/add" className="btn btn-primary">
            <i className="bi bi-award-fill me-2"></i>Add Placement
          </Link>
        )}
      </div>

      {/* Quick stats */}
      <div className="row g-3 mb-3">
        {[
          { label:'Total Offers', val:placements.length, icon:'bi-award-fill', bg:'#eff6ff', color:'#1a56db' },
          { label:'Avg Package', val:`₹${avgPkg} LPA`, icon:'bi-currency-rupee', bg:'#fffbeb', color:'#d97706' },
          { label:'Highest Pkg', val:`₹${maxPkg} LPA`, icon:'bi-star-fill', bg:'#f5f3ff', color:'#7c3aed' },
          { label:'FTE Offers', val:placements.filter(p=>p.offerType==='FTE').length, icon:'bi-briefcase-fill', bg:'#f0fdf4', color:'#059669' },
        ].map((s,i)=>(
          <div key={i} className="col-6 col-md-3">
            <div className="stat-card">
              <div className="stat-icon" style={{background:s.bg}}>
                <i className={`bi ${s.icon}`} style={{color:s.color}}></i>
              </div>
              <div className="stat-value" style={{fontSize:'1.4rem'}}>{s.val}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        <select className="form-select" style={{width:170}} value={filter.offerType}
          onChange={e=>setFilter({...filter,offerType:e.target.value})}>
          <option value="">All Offer Types</option>
          {['Intern','FTE','Intern+FTE'].map(t=><option key={t}>{t}</option>)}
        </select>
        <select className="form-select" style={{width:150}} value={filter.status}
          onChange={e=>setFilter({...filter,status:e.target.value})}>
          <option value="">All Status</option>
          {['Confirmed','Pending','Rejected'].map(s=><option key={s}>{s}</option>)}
        </select>
        {(filter.offerType||filter.status) && (
          <button className="btn btn-outline-secondary" onClick={()=>setFilter({offerType:'',status:''})}>
            <i className="bi bi-x-circle me-1"></i>Clear
          </button>
        )}
      </div>

      <div className="data-table">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary"/></div>
        ) : placements.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-briefcase" style={{fontSize:'3rem',color:'#cbd5e1'}}></i>
            <h6 className="mt-3 text-muted">No placement records found</h6>
          </div>
        ) : (
          <div style={{overflowX:'auto'}}>
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Package</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Status</th>
                  {isAdmin && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {placements.map(p=>(
                  <tr key={p._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="avatar" style={{
                          width:34,height:34,fontSize:'0.68rem',
                          background:'linear-gradient(135deg,#1a56db,#06b6d4)',color:'#fff'
                        }}>
                          {p.student?.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{fontWeight:600,fontSize:'0.855rem'}}>{p.student?.name}</div>
                          <div style={{fontSize:'0.7rem',color:'#94a3b8'}}>
                            {p.student?.rollNo} · {p.student?.branch}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{fontWeight:600,fontSize:'0.855rem'}}>{p.company?.name}</div>
                      <div style={{fontSize:'0.7rem',color:'#94a3b8'}}>{p.company?.industry}</div>
                    </td>
                    <td style={{fontSize:'0.855rem',color:'#475569'}}>{p.role}</td>
                    <td>
                      <span style={{fontFamily:'Syne,sans-serif',fontWeight:800,color:pkgColor(p.package),fontSize:'1rem'}}>
                        ₹{p.package}
                      </span>
                      <span style={{fontSize:'0.7rem',color:'#94a3b8'}}> LPA</span>
                    </td>
                    <td>
                      <span style={{
                        fontSize:'0.68rem',fontWeight:600,padding:'3px 10px',borderRadius:20,
                        background:p.offerType==='FTE'?'#dcfce7':p.offerType==='Intern'?'#dbeafe':'#ede9fe',
                        color:p.offerType==='FTE'?'#166534':p.offerType==='Intern'?'#1e40af':'#5b21b6'
                      }}>{p.offerType}</span>
                    </td>
                    <td style={{fontSize:'0.8rem',color:'#64748b'}}>{p.location||'—'}</td>
                    <td style={{fontSize:'0.8rem',color:'#64748b'}}>{fmtDate(p.dateOfOffer)}</td>
                    <td>
                      <span style={{
                        fontSize:'0.68rem',fontWeight:600,padding:'3px 10px',borderRadius:20,
                        background:p.status==='Confirmed'?'#dcfce7':p.status==='Pending'?'#fffbeb':'#fee2e2',
                        color:p.status==='Confirmed'?'#166534':p.status==='Pending'?'#92400e':'#991b1b'
                      }}>{p.status}</span>
                    </td>
                    {isAdmin && (
                      <td>
                        <button className="btn btn-sm btn-outline-danger" style={{padding:'4px 8px'}}
                          onClick={()=>setDeleteTarget(p)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        show={!!deleteTarget}
        title="Remove Placement"
        message={`Remove placement record for "${deleteTarget?.student?.name}"? This will mark them as unplaced.`}
        onConfirm={handleDelete}
        onCancel={()=>setDeleteTarget(null)}
        confirmText="Remove"
      />
    </div>
  );
}
