import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';

const INDUSTRY_COLORS = {
  IT:'#1a56db', Product:'#059669', Finance:'#d97706',
  Consulting:'#0891b2', Core:'#64748b', Startup:'#dc2626',
  PSU:'#7c3aed', Service:'#6366f1', Other:'#94a3b8',
};

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (industry) params.industry = industry;
      const res = await axios.get('/api/companies', { params });
      setCompanies(res.data.data);
    } catch { toast.error('Failed to load companies'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCompanies(); }, [search, industry]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/companies/${deleteTarget._id}`);
      toast.success('Company deleted');
      setDeleteTarget(null);
      fetchCompanies();
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  const totalHired = companies.reduce((s,c)=>s+c.studentsHired,0);

  return (
    <div>
      <div className="topbar">
        <div>
          <h1 className="page-title">Companies</h1>
          <p className="page-sub">{companies.length} companies · {totalHired} total hires</p>
        </div>
        {isAdmin && (
          <Link to="/companies/add" className="btn btn-primary">
            <i className="bi bi-plus-circle-fill me-2"></i>Add Company
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        <div style={{position:'relative',flex:'1',minWidth:200}}>
          <i className="bi bi-search" style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',color:'#94a3b8',fontSize:'0.85rem'}}></i>
          <input className="form-control" style={{paddingLeft:32}} placeholder="Search companies..."
            value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{width:160}} value={industry} onChange={e=>setIndustry(e.target.value)}>
          <option value="">All Industries</option>
          {Object.keys(INDUSTRY_COLORS).map(i=><option key={i}>{i}</option>)}
        </select>
        {(search||industry) && (
          <button className="btn btn-outline-secondary" onClick={()=>{setSearch('');setIndustry('');}}>
            <i className="bi bi-x-circle me-1"></i>Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"/><p className="text-muted mt-2" style={{fontSize:'0.85rem'}}>Loading companies...</p></div>
      ) : companies.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-building" style={{fontSize:'3rem',color:'#cbd5e1'}}></i>
          <h6 className="mt-3 text-muted">No companies found</h6>
        </div>
      ) : (
        <div className="row g-3">
          {companies.map((c,idx)=>{
            const color = INDUSTRY_COLORS[c.industry] || '#94a3b8';
            return (
              <div key={c._id} className="col-md-6 col-xl-4 fade-in">
                <div className="company-card">
                  <div className="company-card-accent" style={{background:`linear-gradient(90deg,${color},${color}80)`}}/>
                  <div className="d-flex justify-content-between align-items-start mb-3 mt-1">
                    <div className="d-flex align-items-center gap-3">
                      <div className="avatar" style={{
                        width:46,height:46,fontSize:'1rem',fontWeight:800,
                        background:`${color}15`,color:color,borderRadius:12
                      }}>
                        {c.name.slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{fontWeight:700,fontSize:'0.95rem',color:'#1e293b'}}>{c.name}</div>
                        <span style={{
                          fontSize:'0.65rem',fontWeight:600,padding:'2px 8px',borderRadius:20,
                          background:`${color}15`,color:color
                        }}>{c.industry}</span>
                      </div>
                    </div>
                    <span className="badge bg-secondary-subtle text-secondary" style={{fontSize:'0.65rem'}}>{c.type}</span>
                  </div>

                  {/* Stats row */}
                  <div className="row g-2 mb-3">
                    {[
                      { label:'Hired', val:c.studentsHired, color:'#1a56db' },
                      { label:'Min Pkg', val:c.packageRange?.min?`₹${c.packageRange.min}L`:'—', color:'#059669' },
                      { label:'Max Pkg', val:c.packageRange?.max?`₹${c.packageRange.max}L`:'—', color:'#d97706' },
                    ].map((m,i)=>(
                      <div key={i} className="col-4">
                        <div className="metric-box">
                          <div className="metric-val" style={{color:m.color,fontSize:'1.1rem'}}>{m.val}</div>
                          <div className="metric-lbl">{m.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Roles */}
                  {c.roles?.length>0 && (
                    <div className="d-flex flex-wrap gap-1 mb-3">
                      {c.roles.slice(0,3).map((r,i)=>(
                        <span key={i} style={{
                          fontSize:'0.68rem',padding:'3px 10px',borderRadius:20,
                          background:'#f8fafc',border:'1px solid #e2e8f0',color:'#475569',fontWeight:500
                        }}>{r}</span>
                      ))}
                      {c.roles.length>3&&<span style={{fontSize:'0.68rem',color:'#94a3b8'}}>+{c.roles.length-3} more</span>}
                    </div>
                  )}

                  <div className="d-flex align-items-center justify-content-between">
                    {c.visitDate && (
                      <div style={{fontSize:'0.72rem',color:'#94a3b8'}}>
                        <i className="bi bi-calendar3 me-1"></i>
                        {new Date(c.visitDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                      </div>
                    )}
                    {isAdmin && (
                      <button className="btn btn-sm btn-outline-danger ms-auto" style={{padding:'4px 10px',fontSize:'0.75rem'}}
                        onClick={()=>setDeleteTarget(c)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        show={!!deleteTarget}
        title="Delete Company"
        message={`Delete "${deleteTarget?.name}"? All associated data may be affected.`}
        onConfirm={handleDelete}
        onCancel={()=>setDeleteTarget(null)}
        confirmText="Delete"
      />
    </div>
  );
}
