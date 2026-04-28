import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale,LinearScale,BarElement,PointElement,LineElement,ArcElement,Title,Tooltip,Legend,Filler);

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [branchData, setBranchData] = useState([]);
  const [packageDist, setPackageDist] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAll = async (batch='') => {
    setLoading(true);
    try {
      const params = batch ? { batch } : {};
      const [ov,br,pkg,trend,comp,batchList] = await Promise.all([
        axios.get('/api/stats/overview',{params}),
        axios.get('/api/stats/branch-wise',{params}),
        axios.get('/api/stats/package-distribution'),
        axios.get('/api/stats/monthly-trend'),
        axios.get('/api/stats/company-wise'),
        axios.get('/api/stats/batches'),
      ]);
      setOverview(ov.data.data);
      setBranchData(br.data.data);
      setPackageDist(pkg.data.data);
      setMonthlyTrend(trend.data.data);
      setCompanyData(comp.data.data);
      setBatches(batchList.data.data);
    } catch { toast.error('Failed to load dashboard data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{height:'60vh'}}>
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" style={{width:'2.5rem',height:'2.5rem'}}/>
        <p className="text-muted">Loading dashboard...</p>
      </div>
    </div>
  );

  const branchChart = {
    labels: branchData.map(b=>b._id),
    datasets: [
      { label:'Total', data:branchData.map(b=>b.total), backgroundColor:'rgba(26,86,219,0.12)', borderColor:'#1a56db', borderWidth:2, borderRadius:6 },
      { label:'Placed', data:branchData.map(b=>b.placed), backgroundColor:'#1a56db', borderRadius:6 },
    ]
  };

  const doughnutData = {
    labels:['Placed','Unplaced'],
    datasets:[{ data:[overview?.placedStudents,overview?.unplacedStudents],
      backgroundColor:['#1a56db','#e2e8f0'], borderWidth:0, hoverOffset:6 }]
  };

  const pkgChart = {
    labels: packageDist.map(p=>p.range+' LPA'),
    datasets:[{ label:'Students', data:packageDist.map(p=>p.count),
      backgroundColor:['#dbeafe','#93c5fd','#60a5fa','#3b82f6','#1d4ed8'], borderRadius:8 }]
  };

  const lineChart = {
    labels: monthlyTrend.map(m=>m.month),
    datasets:[{
      label:'Offers', data:monthlyTrend.map(m=>m.offers),
      borderColor:'#1a56db', backgroundColor:'rgba(26,86,219,0.07)',
      fill:true, tension:0.4, pointBackgroundColor:'#1a56db', pointRadius:4
    }]
  };

  const chartOpts = {
    responsive:true,
    plugins:{ legend:{ display:false } },
    scales:{ x:{ grid:{ display:false } }, y:{ grid:{ color:'#f1f5f9' }, beginAtZero:true } }
  };

  return (
    <div>
      {/* Topbar */}
      <div className="topbar">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Overview of all placement activity</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <select className="form-select form-select-sm" style={{width:140}} value={selectedBatch}
            onChange={e=>{ setSelectedBatch(e.target.value); fetchAll(e.target.value); }}>
            <option value="">All Batches</option>
            {batches.map(b=><option key={b} value={b}>Batch {b}</option>)}
          </select>
          <span style={{
            display:'inline-flex',alignItems:'center',gap:5,fontSize:'0.75rem',fontWeight:600,
            padding:'4px 12px',borderRadius:20,background:'#dcfce7',color:'#166534'
          }}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'#059669',display:'inline-block'}}></span>
            Live
          </span>
        </div>
      </div>

      {/* Hero banner */}
      <div className="hero-banner mb-4">
        <div className="row align-items-center" style={{position:'relative',zIndex:1}}>
          <div className="col-md-6">
            <div style={{fontSize:'0.72rem',color:'#64748b',textTransform:'uppercase',letterSpacing:'0.1em'}}>Placement Rate</div>
            <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'4rem',lineHeight:1,marginTop:4}}>
              {overview?.placementRate}%
            </div>
            <div style={{fontSize:'0.875rem',color:'#94a3b8',marginTop:8}}>
              {overview?.placedStudents} of {overview?.totalStudents} students placed
            </div>
            <div style={{marginTop:16,height:8,background:'rgba(255,255,255,0.1)',borderRadius:8,overflow:'hidden'}}>
              <div style={{width:`${overview?.placementRate}%`,height:'100%',
                background:'linear-gradient(90deg,#3b82f6,#06b6d4)',borderRadius:8,transition:'width 1s ease'}}/>
            </div>
          </div>
          <div className="col-md-6 mt-3 mt-md-0">
            <div className="row g-2">
              {[
                { label:'Avg Package', val:`₹${overview?.avgPackage} LPA` },
                { label:'Highest Pkg', val:`₹${overview?.maxPackage} LPA` },
                { label:'Companies', val:overview?.totalCompanies },
                { label:'Total Offers', val:overview?.totalOffers },
              ].map((s,i)=>(
                <div key={i} className="col-6">
                  <div style={{background:'rgba(255,255,255,0.06)',borderRadius:10,padding:'0.75rem'}}>
                    <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1.25rem'}}>{s.val}</div>
                    <div style={{fontSize:'0.7rem',color:'#64748b',textTransform:'uppercase',letterSpacing:'0.06em'}}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="row g-3 mb-4">
        {[
          { icon:'bi-people-fill', bg:'#eff6ff', color:'#1a56db', val:overview?.totalStudents, label:'Total Students', link:'/students' },
          { icon:'bi-trophy-fill', bg:'#f0fdf4', color:'#059669', val:overview?.placedStudents, label:'Placed', link:'/students?isPlaced=true' },
          { icon:'bi-person-x-fill', bg:'#fff1f2', color:'#e11d48', val:overview?.unplacedStudents, label:'Unplaced', link:'/students?isPlaced=false' },
          { icon:'bi-building-fill', bg:'#f5f3ff', color:'#7c3aed', val:overview?.totalCompanies, label:'Companies', link:'/companies' },
          { icon:'bi-currency-rupee', bg:'#fffbeb', color:'#d97706', val:overview?.avgPackage, label:'Avg Package (LPA)' },
          { icon:'bi-star-fill', bg:'#ecfdf5', color:'#059669', val:overview?.maxPackage, label:'Highest Pkg (LPA)' },
        ].map((s,i)=>(
          <div key={i} className="col-6 col-md-4 col-xl-2">
            <div className="stat-card" style={{cursor:s.link?'pointer':undefined}}
              onClick={()=>s.link&&navigate(s.link)}>
              <div className="stat-icon" style={{background:s.bg}}>
                <i className={`bi ${s.icon}`} style={{color:s.color}}></i>
              </div>
              <div className="stat-value">{s.val}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="row g-3 mb-3">
        <div className="col-lg-8">
          <div className="chart-card">
            <div className="chart-title">Branch-wise Placement</div>
            <Bar data={branchChart} options={{...chartOpts,plugins:{legend:{display:true,position:'top',labels:{usePointStyle:true,font:{size:12}}}}}} height={95}/>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="chart-card d-flex flex-column align-items-center justify-content-center">
            <div className="chart-title w-100">Placed vs Unplaced</div>
            <Doughnut data={doughnutData} options={{plugins:{legend:{position:'bottom'}},cutout:'72%'}}/>
            <div className="text-center mt-2">
              <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1.8rem',color:'#1a56db'}}>{overview?.placementRate}%</div>
              <div style={{fontSize:'0.72rem',color:'#94a3b8'}}>placement rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <div className="chart-card">
            <div className="chart-title">Package Distribution</div>
            <Bar data={pkgChart} options={chartOpts} height={120}/>
          </div>
        </div>
        <div className="col-md-6">
          <div className="chart-card">
            <div className="chart-title">Monthly Offer Trend</div>
            <Line data={lineChart} options={chartOpts} height={120}/>
          </div>
        </div>
      </div>

      {/* Top companies table */}
      <div className="data-table">
        <div className="table-header-row">
          <span style={{fontWeight:700,fontSize:'0.9rem',fontFamily:'Syne,sans-serif'}}>Top Recruiting Companies</span>
          <button className="btn btn-sm btn-outline-secondary" onClick={()=>navigate('/companies')}>
            View All <i className="bi bi-arrow-right ms-1"></i>
          </button>
        </div>
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Company</th>
              <th>Industry</th>
              <th>Offers</th>
              <th>Avg Package</th>
              <th>Max Package</th>
            </tr>
          </thead>
          <tbody>
            {companyData.slice(0,8).map((c,i)=>(
              <tr key={i}>
                <td>
                  <span style={{
                    width:24,height:24,borderRadius:'50%',display:'inline-flex',
                    alignItems:'center',justifyContent:'center',fontSize:'0.72rem',fontWeight:700,
                    background:i<3?['#ffd700','#c0c0c0','#cd7f32'][i]:'#e2e8f0',
                    color:i<3?'#fff':'#64748b'
                  }}>#{i+1}</span>
                </td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <div className="avatar" style={{width:32,height:32,fontSize:'0.68rem',background:'#eff6ff',color:'#1a56db',fontWeight:800}}>
                      {c.name.slice(0,2).toUpperCase()}
                    </div>
                    <span style={{fontWeight:600,fontSize:'0.875rem'}}>{c.name}</span>
                  </div>
                </td>
                <td><span className="badge badge-industry rounded-pill px-2">{c.industry}</span></td>
                <td><span style={{fontWeight:800,color:'#1a56db',fontSize:'0.95rem'}}>{c.offers}</span></td>
                <td style={{fontWeight:600}}>₹{c.avgPackage?.toFixed(1)} LPA</td>
                <td>
                  <span style={{
                    fontSize:'0.75rem',fontWeight:700,padding:'3px 10px',borderRadius:20,
                    background:'#fffbeb',color:'#92400e'
                  }}>₹{c.maxPackage} LPA</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
