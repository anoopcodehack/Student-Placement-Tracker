import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Doughnut, Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement, RadialLinearScale,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import { toast } from 'react-toastify';

ChartJS.register(CategoryScale,LinearScale,BarElement,PointElement,LineElement,ArcElement,RadialLinearScale,Title,Tooltip,Legend,Filler);

const COLORS = ['#1a56db','#06b6d4','#8b5cf6','#f59e0b','#10b981','#ef4444','#f97316','#6366f1','#ec4899','#14b8a6'];

export default function Analytics() {
  const [overview, setOverview]     = useState(null);
  const [branchData, setBranchData] = useState([]);
  const [pkgDist, setPkgDist]       = useState([]);
  const [monthly, setMonthly]       = useState([]);
  const [companies, setCompanies]   = useState([]);
  const [batches, setBatches]       = useState([]);
  const [batch, setBatch]           = useState('');
  const [loading, setLoading]       = useState(true);

  const fetchAll = async (b='') => {
    setLoading(true);
    try {
      const p = b ? { batch:b } : {};
      const [ov,br,pkg,mo,co,bl] = await Promise.all([
        axios.get('/api/stats/overview',{params:p}),
        axios.get('/api/stats/branch-wise',{params:p}),
        axios.get('/api/stats/package-distribution'),
        axios.get('/api/stats/monthly-trend'),
        axios.get('/api/stats/company-wise'),
        axios.get('/api/stats/batches'),
      ]);
      setOverview(ov.data.data);
      setBranchData(br.data.data);
      setPkgDist(pkg.data.data);
      setMonthly(mo.data.data);
      setCompanies(co.data.data);
      setBatches(bl.data.data);
    } catch { toast.error('Failed to load analytics'); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ fetchAll(); },[]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{height:'60vh'}}>
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" style={{width:'2.5rem',height:'2.5rem'}}/>
        <p className="text-muted">Crunching numbers...</p>
      </div>
    </div>
  );

  /* ── chart data ── */
  const branchBar = {
    labels: branchData.map(b=>b._id),
    datasets:[
      { label:'Total', data:branchData.map(b=>b.total), backgroundColor:'rgba(26,86,219,0.12)', borderColor:'#1a56db', borderWidth:2, borderRadius:6 },
      { label:'Placed', data:branchData.map(b=>b.placed), backgroundColor:'#1a56db', borderRadius:6 },
    ]
  };

  const rateBar = {
    labels: branchData.map(b=>b._id),
    datasets:[{
      label:'Placement %',
      data: branchData.map(b=>b.total?+((b.placed/b.total)*100).toFixed(1):0),
      backgroundColor: branchData.map((_,i)=>COLORS[i%COLORS.length]+'cc'),
      borderRadius:8,
    }]
  };

  const donut = {
    labels:['Placed','Unplaced'],
    datasets:[{ data:[overview?.placedStudents,overview?.unplacedStudents],
      backgroundColor:['#1a56db','#e2e8f0'], borderWidth:0, hoverOffset:6 }]
  };

  const pkgBar = {
    labels: pkgDist.map(p=>p.range+' LPA'),
    datasets:[{ label:'Students', data:pkgDist.map(p=>p.count),
      backgroundColor:['#dbeafe','#93c5fd','#60a5fa','#3b82f6','#1d4ed8'], borderRadius:8 }]
  };

  const lineData = {
    labels: monthly.map(m=>m.month),
    datasets:[
      { label:'Offers', data:monthly.map(m=>m.offers), borderColor:'#1a56db', backgroundColor:'rgba(26,86,219,0.07)', fill:true, tension:0.4, pointBackgroundColor:'#1a56db', pointRadius:4 },
      { label:'Avg Pkg (LPA)', data:monthly.map(m=>m.avgPackage), borderColor:'#06b6d4', backgroundColor:'rgba(6,182,212,0.05)', fill:true, tension:0.4, pointBackgroundColor:'#06b6d4', pointRadius:4, yAxisID:'y1' },
    ]
  };

  const radar = {
    labels: branchData.map(b=>b._id),
    datasets:[{
      label:'Avg CGPA',
      data: branchData.map(b=>b.avgCGPA?+b.avgCGPA.toFixed(2):0),
      backgroundColor:'rgba(26,86,219,0.12)', borderColor:'#1a56db',
      pointBackgroundColor:'#1a56db', pointRadius:4,
    }]
  };

  const topBar = {
    labels: companies.slice(0,8).map(c=>c.name),
    datasets:[{ label:'Offers', data:companies.slice(0,8).map(c=>c.offers),
      backgroundColor:companies.slice(0,8).map((_,i)=>COLORS[i%COLORS.length]), borderRadius:8 }]
  };

  const base = { responsive:true, plugins:{legend:{display:false}}, scales:{ x:{grid:{display:false}}, y:{grid:{color:'#f1f5f9'},beginAtZero:true} } };

  return (
    <div>
      <div className="topbar">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-sub">Deep dive into placement statistics & trends</p>
        </div>
        <select className="form-select form-select-sm" style={{width:145}} value={batch}
          onChange={e=>{ setBatch(e.target.value); fetchAll(e.target.value); }}>
          <option value="">All Batches</option>
          {batches.map(b=><option key={b} value={b}>Batch {b}</option>)}
        </select>
      </div>

      {/* KPI Row */}
      <div className="row g-3 mb-4">
        {[
          { label:'Total Students', val:overview?.totalStudents, icon:'bi-people-fill', color:'#1a56db', bg:'#eff6ff' },
          { label:'Placed', val:overview?.placedStudents, icon:'bi-trophy-fill', color:'#059669', bg:'#f0fdf4', sub:`${overview?.placementRate}% rate` },
          { label:'Unplaced', val:overview?.unplacedStudents, icon:'bi-person-x-fill', color:'#dc2626', bg:'#fff1f2' },
          { label:'Avg Package', val:`₹${overview?.avgPackage}`, icon:'bi-currency-rupee', color:'#d97706', bg:'#fffbeb', sub:'LPA' },
          { label:'Highest Pkg', val:`₹${overview?.maxPackage}`, icon:'bi-star-fill', color:'#7c3aed', bg:'#f5f3ff', sub:'LPA' },
          { label:'Companies', val:overview?.totalCompanies, icon:'bi-building-fill', color:'#0891b2', bg:'#ecfeff' },
          { label:'Total Offers', val:overview?.totalOffers, icon:'bi-award-fill', color:'#059669', bg:'#f0fdf4' },
        ].map((s,i)=>(
          <div key={i} className="col-6 col-md-4 col-xl-3">
            <div className="stat-card fade-in">
              <div className="stat-icon" style={{background:s.bg}}>
                <i className={`bi ${s.icon}`} style={{color:s.color}}></i>
              </div>
              <div className="stat-value" style={{fontSize:'1.5rem'}}>{s.val}</div>
              <div className="stat-label">{s.label}</div>
              {s.sub && <div style={{fontSize:'0.7rem',color:'#94a3b8',marginTop:2}}>{s.sub}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Banner */}
      <div className="hero-banner mb-4">
        <div className="row align-items-center" style={{position:'relative',zIndex:1}}>
          <div className="col-md-5">
            <div style={{fontSize:'0.7rem',color:'#475569',textTransform:'uppercase',letterSpacing:'0.1em'}}>Overall Placement Rate</div>
            <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'4.5rem',lineHeight:1,marginTop:4}}>
              {overview?.placementRate}%
            </div>
            <div style={{fontSize:'0.875rem',color:'#64748b',marginTop:8}}>
              {overview?.placedStudents} out of {overview?.totalStudents} students placed
            </div>
            <div style={{marginTop:14,height:10,background:'rgba(255,255,255,0.1)',borderRadius:8,overflow:'hidden'}}>
              <div style={{width:`${overview?.placementRate}%`,height:'100%',
                background:'linear-gradient(90deg,#3b82f6,#06b6d4)',borderRadius:8,transition:'width 1s ease'}}/>
            </div>
          </div>
          <div className="col-md-7 mt-3 mt-md-0">
            <div className="row g-2">
              {[
                { l:'Avg Package', v:`₹${overview?.avgPackage} LPA` },
                { l:'Highest Pkg', v:`₹${overview?.maxPackage} LPA` },
                { l:'Companies', v:overview?.totalCompanies },
                { l:'Total Offers', v:overview?.totalOffers },
                { l:'Batches', v:batches.length },
                { l:'Unplaced', v:overview?.unplacedStudents },
              ].map((s,i)=>(
                <div key={i} className="col-4">
                  <div style={{background:'rgba(255,255,255,0.06)',borderRadius:10,padding:'0.65rem 0.75rem'}}>
                    <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1.1rem'}}>{s.v}</div>
                    <div style={{fontSize:'0.65rem',color:'#64748b',textTransform:'uppercase',letterSpacing:'0.06em'}}>{s.l}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts R1 */}
      <div className="row g-3 mb-3">
        <div className="col-lg-8">
          <div className="chart-card">
            <div className="chart-title">Branch-wise Placement Count</div>
            <Bar data={branchBar} options={{...base,plugins:{legend:{display:true,position:'top',labels:{usePointStyle:true,font:{size:12}}}}}} height={95}/>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="chart-card d-flex flex-column align-items-center justify-content-center">
            <div className="chart-title w-100">Placed vs Unplaced</div>
            <Doughnut data={donut} options={{plugins:{legend:{position:'bottom'}},cutout:'72%'}}/>
            <div className="text-center mt-2">
              <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'1.8rem',color:'#1a56db'}}>{overview?.placementRate}%</div>
              <div style={{fontSize:'0.72rem',color:'#94a3b8'}}>placement rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts R2 */}
      <div className="row g-3 mb-3">
        <div className="col-lg-6">
          <div className="chart-card">
            <div className="chart-title">Branch-wise Placement Rate (%)</div>
            <Bar data={rateBar} options={{...base,plugins:{...base.plugins,tooltip:{callbacks:{label:ctx=>`${ctx.raw}%`}}}}} height={130}/>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="chart-card">
            <div className="chart-title">Package Distribution (LPA brackets)</div>
            <Bar data={pkgBar} options={base} height={130}/>
          </div>
        </div>
      </div>

      {/* Monthly trend dual axis */}
      <div className="row g-3 mb-3">
        <div className="col-12">
          <div className="chart-card">
            <div className="chart-title">Monthly Offer Trend & Average Package</div>
            {monthly.length > 0 ? (
              <Line data={lineData} options={{
                responsive:true,
                interaction:{mode:'index',intersect:false},
                plugins:{legend:{display:true,position:'top',labels:{usePointStyle:true,font:{size:12}}}},
                scales:{
                  x:{grid:{display:false}},
                  y:{grid:{color:'#f1f5f9'},beginAtZero:true,title:{display:true,text:'Offers'}},
                  y1:{position:'right',grid:{display:false},title:{display:true,text:'Avg Pkg (LPA)'},beginAtZero:true},
                }
              }} height={65}/>
            ) : (
              <div className="text-center text-muted py-4" style={{fontSize:'0.85rem'}}>No monthly data available yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Charts R4 */}
      <div className="row g-3 mb-3">
        <div className="col-lg-7">
          <div className="chart-card">
            <div className="chart-title">Top Companies by Offers</div>
            <Bar data={topBar} options={{...base,plugins:{...base.plugins,tooltip:{callbacks:{label:ctx=>`${ctx.raw} offers`}}}}} height={130}/>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="chart-card">
            <div className="chart-title">Avg CGPA by Branch</div>
            <Radar data={radar} options={{
              responsive:true,
              scales:{r:{beginAtZero:false,min:6,max:10,grid:{color:'#e2e8f0'},ticks:{font:{size:10}}}},
              plugins:{legend:{display:false}}
            }}/>
          </div>
        </div>
      </div>

      {/* Company breakdown table */}
      <div className="data-table">
        <div className="table-header-row">
          <span style={{fontWeight:700,fontSize:'0.9rem',fontFamily:'Syne,sans-serif'}}>Company-wise Breakdown</span>
          <span style={{fontSize:'0.78rem',color:'#94a3b8'}}>{companies.length} companies</span>
        </div>
        <div style={{overflowX:'auto'}}>
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>#</th><th>Company</th><th>Industry</th>
                <th>Offers</th><th>Avg Package</th><th>Max Package</th><th>Share</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c,i)=>(
                <tr key={i}>
                  <td>
                    <span style={{
                      width:24,height:24,borderRadius:'50%',display:'inline-flex',
                      alignItems:'center',justifyContent:'center',fontSize:'0.68rem',fontWeight:700,
                      background:i<3?['#ffd70020','#c0c0c020','#cd7f3220'][i]:'#e2e8f0',
                      color:i<3?['#b8860b','#808080','#8b4513'][i]:'#64748b'
                    }}>#{i+1}</span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="avatar" style={{width:30,height:30,fontSize:'0.65rem',fontWeight:800,background:COLORS[i%COLORS.length]+'15',color:COLORS[i%COLORS.length]}}>
                        {c.name.slice(0,2).toUpperCase()}
                      </div>
                      <span style={{fontWeight:600,fontSize:'0.875rem'}}>{c.name}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-industry rounded-pill px-2">{c.industry}</span></td>
                  <td><span style={{fontWeight:800,color:'#1a56db',fontSize:'0.95rem'}}>{c.offers}</span></td>
                  <td style={{fontWeight:600}}>₹{c.avgPackage?.toFixed(1)} LPA</td>
                  <td><span style={{fontSize:'0.72rem',fontWeight:700,padding:'3px 10px',borderRadius:20,background:'#fffbeb',color:'#92400e'}}>₹{c.maxPackage} LPA</span></td>
                  <td style={{minWidth:130}}>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{flex:1,height:6,background:'#e2e8f0',borderRadius:4,overflow:'hidden'}}>
                        <div style={{width:`${overview?.totalOffers?(c.offers/overview.totalOffers*100):0}%`,height:'100%',background:COLORS[i%COLORS.length],borderRadius:4,transition:'width 0.6s ease'}}/>
                      </div>
                      <span style={{fontSize:'0.7rem',color:'#64748b',whiteSpace:'nowrap'}}>
                        {overview?.totalOffers?(c.offers/overview.totalOffers*100).toFixed(1):0}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
