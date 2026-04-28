import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';

const BRANCHES = ['CSE','ECE','EEE','ME','CE','IT','AIDS','AIML','CSD'];

export default function Students() {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ branch:'', batch:'', isPlaced:'', search:'' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const limit = 15;

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, page, limit };
      Object.keys(params).forEach(k => !params[k] && params[k] !== 0 && delete params[k]);
      const res = await axios.get('/api/students', { params });
      setStudents(res.data.data);
      setTotal(res.data.total);
    } catch { toast.error('Failed to load students'); }
    finally { setLoading(false); }
  }, [filters, page]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/students/${deleteTarget._id}`);
      toast.success(`${deleteTarget.name} deleted`);
      setDeleteTarget(null);
      fetchStudents();
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  const setFilter = (key, val) => { setFilters(f => ({...f,[key]:val})); setPage(1); };
  const clearFilters = () => { setFilters({ branch:'',batch:'',isPlaced:'',search:'' }); setPage(1); };

  const pages = Math.ceil(total / limit);
  const cgpaCol = (c) => c>=8?'#059669':c>=6?'#d97706':'#dc2626';

  return (
    <div>
      <div className="topbar">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-sub">{total.toLocaleString()} total students</p>
        </div>
        {isAdmin && (
          <Link to="/students/add" className="btn btn-primary">
            <i className="bi bi-person-plus-fill me-2"></i>Add Student
          </Link>
        )}
      </div>

      {/* Filter bar */}
      <div className="form-card mb-3 p-3">
        <div className="row g-2 align-items-center">
          <div className="col-md-4">
            <div style={{position:'relative'}}>
              <i className="bi bi-search" style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',color:'#94a3b8',fontSize:'0.85rem'}}></i>
              <input className="form-control" style={{paddingLeft:32}} placeholder="Search name, roll no, email..."
                value={filters.search} onChange={e=>setFilter('search',e.target.value)} />
            </div>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={filters.branch} onChange={e=>setFilter('branch',e.target.value)}>
              <option value="">All Branches</option>
              {BRANCHES.map(b=><option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={filters.batch} onChange={e=>setFilter('batch',e.target.value)}>
              <option value="">All Batches</option>
              {[2023,2024,2025,2026].map(b=><option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={filters.isPlaced} onChange={e=>setFilter('isPlaced',e.target.value)}>
              <option value="">All Status</option>
              <option value="true">✓ Placed</option>
              <option value="false">○ Unplaced</option>
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>
              <i className="bi bi-x-circle me-1"></i>Clear
            </button>
          </div>
        </div>
      </div>

      {/* Summary pills */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        {[
          { label:'Total', val:total, color:'#1a56db' },
          { label:'Placed', val:students.filter(s=>s.isPlaced).length + (page>1?'…':''), color:'#059669' },
          { label:'Unplaced', val:students.filter(s=>!s.isPlaced).length + (page>1?'…':''), color:'#dc2626' },
        ].map((p,i)=>(
          <div key={i} style={{
            padding:'4px 14px',borderRadius:20,background:p.color+'12',
            border:`1px solid ${p.color}30`,fontSize:'0.78rem',fontWeight:600,color:p.color
          }}>
            {p.label}: {p.val}
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="data-table">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-2"/>
            <p className="text-muted mb-0" style={{fontSize:'0.85rem'}}>Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-people" style={{fontSize:'3rem',color:'#cbd5e1'}}></i>
            <h6 className="mt-3 text-muted">No students found</h6>
            <p className="text-muted" style={{fontSize:'0.85rem'}}>Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div style={{overflowX:'auto'}}>
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll No</th>
                    <th>Branch</th>
                    <th>Batch</th>
                    <th>CGPA</th>
                    <th>Backlogs</th>
                    <th>Status</th>
                    <th>Package</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s=>(
                    <tr key={s._id} style={{cursor:'pointer'}} onClick={()=>navigate(`/students/${s._id}`)}>
                      <td onClick={e=>e.stopPropagation()}>
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar" style={{
                            width:36,height:36,fontSize:'0.72rem',
                            background:s.isPlaced?'linear-gradient(135deg,#1a56db,#06b6d4)':'#e2e8f0',
                            color:s.isPlaced?'#fff':'#64748b'
                          }}>
                            {s.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{fontWeight:600,fontSize:'0.875rem',color:'#1e293b',cursor:'pointer'}}
                              onClick={()=>navigate(`/students/${s._id}`)}>
                              {s.name}
                            </div>
                            <div style={{fontSize:'0.72rem',color:'#94a3b8'}}>{s.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><code style={{fontSize:'0.78rem',color:'#475569',background:'#f8fafc',padding:'2px 6px',borderRadius:4}}>{s.rollNo}</code></td>
                      <td><span className="badge badge-branch rounded-pill px-2">{s.branch}</span></td>
                      <td style={{fontWeight:600,fontSize:'0.875rem'}}>{s.batch}</td>
                      <td>
                        <span style={{fontWeight:800,color:cgpaCol(s.cgpa),fontSize:'0.9rem'}}>{s.cgpa}</span>
                        <span style={{fontSize:'0.7rem',color:'#94a3b8'}}>/10</span>
                      </td>
                      <td>
                        <span style={{
                          fontWeight:600,fontSize:'0.875rem',
                          color:s.backlogs>0?'#dc2626':'#059669'
                        }}>{s.backlogs ?? 0}</span>
                      </td>
                      <td>
                        <span className={`badge rounded-pill px-2 py-1 ${s.isPlaced?'badge-placed':'badge-unplaced'}`} style={{fontSize:'0.68rem'}}>
                          {s.isPlaced?'✓ Placed':'○ Unplaced'}
                        </span>
                      </td>
                      <td>
                        {s.isPlaced && s.placementDetails?.package
                          ? <span style={{fontWeight:800,color:'#1a56db',fontSize:'0.875rem'}}>₹{s.placementDetails.package} <span style={{fontSize:'0.7rem',color:'#94a3b8',fontWeight:400}}>LPA</span></span>
                          : <span style={{color:'#cbd5e1'}}>—</span>}
                      </td>
                      <td onClick={e=>e.stopPropagation()}>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-secondary" style={{padding:'4px 8px'}}
                            onClick={()=>navigate(`/students/${s._id}`)}>
                            <i className="bi bi-eye"></i>
                          </button>
                          {isAdmin && <>
                            <button className="btn btn-sm btn-outline-primary" style={{padding:'4px 8px'}}
                              onClick={()=>navigate(`/students/edit/${s._id}`)}>
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger" style={{padding:'4px 8px'}}
                              onClick={()=>setDeleteTarget(s)}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="d-flex justify-content-between align-items-center px-4 py-3" style={{borderTop:'1px solid #e2e8f0'}}>
                <span style={{fontSize:'0.8rem',color:'#64748b'}}>
                  Showing {((page-1)*limit)+1}–{Math.min(page*limit,total)} of {total}
                </span>
                <div className="d-flex gap-1">
                  <button className="btn btn-sm btn-outline-secondary" disabled={page===1} onClick={()=>setPage(p=>p-1)}>
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  {Array.from({length:Math.min(pages,7)},(_,i)=>i+1).map(p=>(
                    <button key={p} className={`btn btn-sm ${page===p?'btn-primary':'btn-outline-secondary'}`}
                      onClick={()=>setPage(p)}>{p}</button>
                  ))}
                  <button className="btn btn-sm btn-outline-secondary" disabled={page===pages} onClick={()=>setPage(p=>p+1)}>
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmModal
        show={!!deleteTarget}
        title="Delete Student"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={()=>setDeleteTarget(null)}
        confirmText="Delete Student"
      />
    </div>
  );
}
