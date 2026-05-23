import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setSending(true);
  try {
    await axios.post('/api/contact', form);
    toast.success('Message sent! We will get back to you shortly 📬');
    setForm({ name:'', email:'', phone:'', subject:'', message:'' });
  } catch (err) {
    toast.error('Failed to send message');
  } finally { setSending(false); }
};

  const contactCards = [
    {
      icon: 'bi-geo-alt-fill',
      color: '#1a56db',
      bg: '#eff6ff',
      title: 'Address',
      lines: [
        'Sahyadri College of Engineering & Management',
        'Adyar, Mangaluru - 575 007',
        'Karnataka, India',
      ],
    },
    {
      icon: 'bi-telephone-fill',
      color: '#059669',
      bg: '#f0fdf4',
      title: 'Phone',
      lines: [
        'Main Office: +91-824-2277777',
        'Placement Cell: +91-824-2277788',
        'Admissions: +91-824-2277799',
      ],
    },
    {
      icon: 'bi-envelope-fill',
      color: '#d97706',
      bg: '#fffbeb',
      title: 'Email',
      lines: [
        'info@sahyadri.edu.in',
        'placements@sahyadri.edu.in',
        'admissions@sahyadri.edu.in',
      ],
    },
    {
      icon: 'bi-clock-fill',
      color: '#7c3aed',
      bg: '#f5f3ff',
      title: 'Office Hours',
      lines: [
        'Monday – Friday: 9:00 AM – 5:00 PM',
        'Saturday: 9:00 AM – 1:00 PM',
        'Sunday & Holidays: Closed',
      ],
    },
  ];

  const departments = [
    { name: 'Computer Science & Engineering', hod: 'Dr. Mustafa Basthikodi', email: 'hod.cse@sahyadri.edu.in', phone: '+91-824-2277701' },
    { name: 'Electronics & Communication', hod: 'Dr. Rajesh Kumar', email: 'hod.ece@sahyadri.edu.in', phone: '+91-824-2277702' },
    { name: 'Mechanical Engineering', hod: 'Dr. Suresh Prabhu', email: 'hod.me@sahyadri.edu.in', phone: '+91-824-2277703' },
    { name: 'Civil Engineering', hod: 'Dr. Anitha Rao', email: 'hod.ce@sahyadri.edu.in', phone: '+91-824-2277704' },
    { name: 'Placement Cell', hod: 'Mr. Prajwal Rao', email: 'placements@sahyadri.edu.in', phone: '+91-824-2277788' },
  ];

  const quickLinks = [
    { label: 'College Website', url: 'https://sahyadri.edu.in', icon: 'bi-globe' },
    { label: 'Admissions Portal', url: 'https://sahyadri.edu.in/admissions', icon: 'bi-mortarboard-fill' },
    { label: 'VTU Official Site', url: 'https://vtu.ac.in', icon: 'bi-building-fill' },
    { label: 'NAAC Certificate', url: 'https://sahyadri.edu.in/naac', icon: 'bi-award-fill' },
  ];

  return (
    <div>
      {/* Topbar */}
      <div className="topbar">
        <div>
          <h1 className="page-title">Contact & Info</h1>
          <p className="page-sub">Reach out to us for admissions, placements, or any queries</p>
        </div>
        <a href="tel:+918242277777" className="btn btn-primary">
          <i className="bi bi-telephone-fill me-2"></i>Call Us
        </a>
      </div>

      {/* College hero banner */}
      <div className="hero-banner mb-4">
        <div className="row align-items-center" style={{ position: 'relative', zIndex: 1 }}>
          <div className="col-md-7">
            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
              Autonomous Institution · Affiliated to VTU, Belagavi
            </div>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.6rem', color: '#fff', margin: '0 0 8px' }}>
              Sahyadri College of Engineering & Management
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: 16 }}>
              Adyar, Mangaluru - 575 007, Karnataka, India
            </p>
            <div className="d-flex gap-2 flex-wrap">
              <a href="https://sahyadri.edu.in" target="_blank" rel="noreferrer"
                className="btn btn-sm"
                style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.78rem' }}>
                <i className="bi bi-globe me-1"></i>Visit Website
              </a>
              <a href="mailto:info@sahyadri.edu.in"
                className="btn btn-sm"
                style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.78rem' }}>
                <i className="bi bi-envelope me-1"></i>Send Email
              </a>
              <a href="https://maps.google.com/?q=Sahyadri+College+of+Engineering+Mangalore" target="_blank" rel="noreferrer"
                className="btn btn-sm"
                style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.78rem' }}>
                <i className="bi bi-map me-1"></i>Get Directions
              </a>
            </div>
          </div>
          <div className="col-md-5 mt-3 mt-md-0">
            <div className="row g-2">
              {[
                { label: 'Established', val: '1999' },
                { label: 'NAAC Grade', val: 'A+' },
                { label: 'Programs', val: '15+' },
                { label: 'Students', val: '4000+' },
              ].map((s, i) => (
                <div key={i} className="col-6">
                  <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '0.75rem', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: '#06b6d4' }}>{s.val}</div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact cards */}
      <div className="row g-3 mb-4">
        {contactCards.map((card, i) => (
          <div key={i} className="col-md-6 col-xl-3">
            <div className="stat-card h-100">
              <div className="stat-icon" style={{ background: card.bg }}>
                <i className={`bi ${card.icon}`} style={{ color: card.color }}></i>
              </div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '0.9rem', marginBottom: 8, marginTop: 4 }}>
                {card.title}
              </div>
              {card.lines.map((line, j) => (
                <div key={j} style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.8 }}>{line}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-4">
        {/* Contact Form */}
        <div className="col-lg-7">
          <div className="form-card">
            <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
              <i className="bi bi-send-fill text-primary me-2"></i>Send us a Message
            </h6>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Your Name *</label>
                  <div style={{ position: 'relative' }}>
                    <i className="bi bi-person" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                    <input className="form-control" style={{ paddingLeft: 32 }} placeholder="Aarav Sharma"
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email Address *</label>
                  <div style={{ position: 'relative' }}>
                    <i className="bi bi-envelope" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                    <input type="email" className="form-control" style={{ paddingLeft: 32 }} placeholder="you@email.com"
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <i className="bi bi-telephone" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                    <input className="form-control" style={{ paddingLeft: 32 }} placeholder="9876543210"
                      value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Subject *</label>
                  <select className="form-select" value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })} required>
                    <option value="">Select Subject</option>
                    <option>Admission Enquiry</option>
                    <option>Placement Information</option>
                    <option>Fee Structure</option>
                    <option>Scholarship Information</option>
                    <option>Course Information</option>
                    <option>Campus Visit Request</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Message *</label>
                  <textarea className="form-control" rows={4}
                    placeholder="Write your message here..."
                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary mt-3 px-4" disabled={sending}>
                {sending
                  ? <><span className="spinner-border spinner-border-sm me-2" />Sending...</>
                  : <><i className="bi bi-send-fill me-2"></i>Send Message</>}
              </button>
            </form>
          </div>
        </div>

        {/* Right column */}
        <div className="col-lg-5">
          {/* Quick links */}
          <div className="form-card mb-3">
            <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
              <i className="bi bi-link-45deg text-primary me-2"></i>Quick Links
            </h6>
            <div className="d-flex flex-column gap-2">
              {quickLinks.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '0.75rem 1rem', borderRadius: 10,
                    background: '#f8fafc', border: '1px solid #e2e8f0',
                    textDecoration: 'none', color: '#1e293b',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
                  onMouseOut={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={`bi ${link.icon}`} style={{ color: '#1a56db', fontSize: '1rem' }}></i>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{link.label}</span>
                  <i className="bi bi-arrow-up-right ms-auto" style={{ color: '#94a3b8', fontSize: '0.8rem' }}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Social media */}
          <div className="form-card mb-3">
            <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
              <i className="bi bi-share-fill text-primary me-2"></i>Follow Us
            </h6>
            <div className="d-flex gap-2 flex-wrap">
              {[
                { icon: 'bi-linkedin', label: 'LinkedIn', color: '#0077b5', url: 'https://linkedin.com/school/sahyadri-college' },
                { icon: 'bi-instagram', label: 'Instagram', color: '#e1306c', url: 'https://instagram.com/sahyadricollege' },
                { icon: 'bi-youtube', label: 'YouTube', color: '#ff0000', url: 'https://youtube.com/@sahyadricollege' },
                { icon: 'bi-twitter-x', label: 'Twitter', color: '#000', url: 'https://twitter.com/sahyadricollege' },
              ].map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 14px', borderRadius: 20,
                    background: `${s.color}12`, color: s.color,
                    border: `1px solid ${s.color}30`,
                    textDecoration: 'none', fontSize: '0.78rem', fontWeight: 600,
                    transition: 'all 0.15s',
                  }}>
                  <i className={`bi ${s.icon}`}></i>{s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Emergency contacts */}
          <div className="form-card" style={{ background: 'linear-gradient(135deg,#eff6ff,#f0fdf4)', border: '1px solid #bfdbfe' }}>
            <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #bfdbfe' }}>
              <i className="bi bi-headset text-primary me-2"></i>Helpline Numbers
            </h6>
            {[
              { label: 'Admission Helpline', number: '+91-824-2277799', icon: 'bi-mortarboard', color: '#1a56db' },
              { label: 'Placement Cell', number: '+91-824-2277788', icon: 'bi-briefcase-fill', color: '#059669' },
              { label: 'Student Grievance', number: '+91-824-2277777', icon: 'bi-shield-check', color: '#d97706' },
            ].map((h, i) => (
              <a key={i} href={`tel:${h.number}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '0.65rem 0.75rem', borderRadius: 10,
                  background: 'rgba(255,255,255,0.6)', marginBottom: 8,
                  textDecoration: 'none', border: '1px solid rgba(255,255,255,0.8)',
                  transition: 'all 0.15s',
                }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: `${h.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={`bi ${h.icon}`} style={{ color: h.color, fontSize: '0.9rem' }}></i>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h.label}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>{h.number}</div>
                </div>
                <i className="bi bi-telephone-fill ms-auto" style={{ color: h.color, fontSize: '0.85rem' }}></i>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Department contacts table */}
      <div className="data-table mb-4">
        <div className="table-header-row">
          <span style={{ fontWeight: 700, fontSize: '0.9rem', fontFamily: 'Syne,sans-serif' }}>
            <i className="bi bi-people-fill text-primary me-2"></i>Department Contacts
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Department</th>
                <th>Head of Department</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, fontSize: '0.875rem' }}>{dept.name}</td>
                  <td style={{ fontSize: '0.855rem', color: '#475569' }}>{dept.hod}</td>
                  <td>
                    <a href={`mailto:${dept.email}`} style={{ fontSize: '0.8rem', color: '#1a56db', textDecoration: 'none' }}>
                      {dept.email}
                    </a>
                  </td>
                  <td style={{ fontSize: '0.855rem' }}>{dept.phone}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <a href={`mailto:${dept.email}`} className="btn btn-sm btn-outline-primary" style={{ padding: '3px 8px', fontSize: '0.72rem' }}>
                        <i className="bi bi-envelope"></i>
                      </a>
                      <a href={`tel:${dept.phone}`} className="btn btn-sm btn-outline-success" style={{ padding: '3px 8px', fontSize: '0.72rem' }}>
                        <i className="bi bi-telephone"></i>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Google Map embed */}
      <div className="form-card">
        <h6 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
          <i className="bi bi-map-fill text-primary me-2"></i>Find Us on Map
        </h6>
        <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <iframe
            title="Sahyadri College Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.123456789!2d74.8!3d12.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSahyadri+College+of+Engineering+Mangalore!5e0!3m2!1sen!2sin!4v1234567890"
            width="100%"
            height="300"
            style={{ border: 0, display: 'block' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="d-flex justify-content-end mt-2">
          <a href="https://maps.google.com/?q=Sahyadri+College+of+Engineering+Mangalore"
            target="_blank" rel="noreferrer"
            className="btn btn-outline-primary btn-sm">
            <i className="bi bi-box-arrow-up-right me-1"></i>Open in Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}