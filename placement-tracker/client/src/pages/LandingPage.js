
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Animated Counter Hook ──
function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const isFloat = !Number.isInteger(target);
    const multiplied = isFloat ? target * 100 : target;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * multiplied));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(multiplied);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  const isFloat = !Number.isInteger(target);
  return isFloat ? (count / 100).toFixed(2) : count;
}

// ── Page Loader ──
function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(timer); return 100; }
        return p + Math.random() * 15;
      });
    }, 80);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => setFade(true), 300);
    }
  }, [progress]);

  if (fade) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#060b18",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      opacity: progress >= 100 ? 0 : 1,
      transition: "opacity 0.5s ease",
      pointerEvents: progress >= 100 ? "none" : "all",
    }}>
      {/* Glow */}
      <div style={{
        position: "absolute", width: 500, height: 500,
        background: "radial-gradient(circle,rgba(26,86,219,0.25),transparent 70%)",
        top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        pointerEvents: "none",
      }} />

      {/* Logo */}
      <div style={{
        width: 72, height: 72, borderRadius: 20,
        background: "linear-gradient(135deg,#1a56db,#06b6d4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "2rem", marginBottom: "1.5rem",
        boxShadow: "0 0 40px rgba(26,86,219,0.5)",
        animation: "logoPulse 1.5s ease-in-out infinite",
      }}>🎓</div>

      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "#fff", marginBottom: 4 }}>
        PlaceTrack
      </div>
      <div style={{ fontSize: "0.72rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "2.5rem" }}>
        Sahyadri College · Placement Portal
      </div>

      {/* Progress bar */}
      <div style={{ width: 200, height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 4,
          background: "linear-gradient(90deg,#1a56db,#06b6d4)",
          width: `${Math.min(progress, 100)}%`,
          transition: "width 0.1s ease",
          boxShadow: "0 0 10px rgba(6,182,212,0.8)",
        }} />
      </div>
      <div style={{ fontSize: "0.72rem", color: "#475569", marginTop: 10 }}>
        {Math.min(Math.floor(progress), 100)}%
      </div>

      <style>{`
        @keyframes logoPulse {
          0%,100% { box-shadow: 0 0 40px rgba(26,86,219,0.5); }
          50% { box-shadow: 0 0 60px rgba(6,182,212,0.7); }
        }
      `}</style>
    </div>
  );
}

// ── Stat Card ──
function StatCard({ value, suffix = "", label, color, started, isDark }) {
  const numeric = parseFloat(value);
  const displayed = useCounter(numeric, 2000, started);

  return (
    <div style={{
      background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
      borderRadius: 16, padding: "1.5rem", textAlign: "center",
      backdropFilter: "blur(10px)",
      transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
      cursor: "default",
    }}
      onMouseOver={e => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 12px 32px ${color}30`;
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "2.2rem", color, lineHeight: 1 }}>
        {displayed}{suffix}
      </div>
      <div style={{ fontSize: "0.72rem", color: isDark ? "#94a3b8" : "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 6, fontWeight: 600 }}>
        {label}
      </div>
    </div>
  );
}

const PLACED_STUDENTS = [
  { name: "Aditya Kumar", company: "Google", pkg: "₹43.24 LPA", branch: "CSE" },
  { name: "Sneha Verma", company: "Amazon", pkg: "₹31.71 LPA", branch: "ISE" },
  { name: "Rohan Shetty", company: "Microsoft", pkg: "₹30.45 LPA", branch: "CSE" },
  { name: "Priya Nair", company: "PhonePe", pkg: "₹21.7 LPA", branch: "AIDS" },
  { name: "Karan Mehta", company: "Swiggy", pkg: "₹19.5 LPA", branch: "CSE" },
  { name: "Divya Rao", company: "Amazon", pkg: "₹28.4 LPA", branch: "AIML" },
  { name: "Arjun Bhat", company: "Microsoft", pkg: "₹26.8 LPA", branch: "CSE" },
  { name: "Nithya S", company: "Google", pkg: "₹38.5 LPA", branch: "ISE" },
  { name: "Rahul D", company: "TCS", pkg: "₹6.8 LPA", branch: "ECE" },
  { name: "Kavya M", company: "Swiggy", pkg: "₹17.2 LPA", branch: "CSE" },
];

const TOP_COMPANIES = [
  { name: "Google", offers: 6, avg: "₹31.7 LPA", color: "#4285F4" },
  { name: "Amazon", offers: 8, avg: "₹24.8 LPA", color: "#FF9900" },
  { name: "Microsoft", offers: 7, avg: "₹23.2 LPA", color: "#00A4EF" },
  { name: "Swiggy", offers: 10, avg: "₹16.0 LPA", color: "#FC8019" },
  { name: "PhonePe", offers: 7, avg: "₹17.8 LPA", color: "#5F259F" },
  { name: "TCS", offers: 10, avg: "₹5.6 LPA", color: "#1a56db" },
  { name: "BHEL", offers: 9, avg: "₹8.7 LPA", color: "#059669" },
  { name: "Wipro", offers: 5, avg: "₹4.9 LPA", color: "#7c3aed" },
];

const FEATURES = [
  { icon: "🤖", title: "AI Resume ATS Scorer", desc: "Upload resume + paste JD → get match %, missing keywords & improvement tips instantly.", color: "#06b6d4" },
  { icon: "🎤", title: "AI Mock Interview", desc: "Company-specific questions, real-time evaluation, scores & ideal answers after each response.", color: "#a78bfa" },
  { icon: "🔔", title: "Real-time Notifications", desc: "Instant Socket.IO alerts when new drives, companies or results are announced.", color: "#34d399" },
  { icon: "📊", title: "Analytics Dashboard", desc: "7-chart visual dashboard with branch-wise stats, package trends & company performance.", color: "#fbbf24" },
  { icon: "🔐", title: "Role-Based Access", desc: "Admin, Student & Viewer roles — each with tailored experience and permissions.", color: "#f87171" },
  { icon: "📅", title: "Drive Calendar", desc: "Never miss a placement drive. Calendar view with all upcoming company visits.", color: "#1a56db" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const statsRef = useRef(null);
  const [statsStarted, setStatsStarted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    // Show loader for 2s then reveal page
    const t1 = setTimeout(() => setLoaded(true), 2200);
    const t2 = setTimeout(() => setHeroVisible(true), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsStarted(true); },
      { threshold: 0.2 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [loaded]);

  const d = isDark;
  const bg = d ? "#060b18" : "#f0f4ff";
  const surface = d ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)";
  const border = d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const text = d ? "#f1f5f9" : "#0f172a";
  const muted = d ? "#94a3b8" : "#64748b";

  return (
    <>
      <PageLoader />

      <div style={{
        background: bg, color: text,
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        overflowX: "hidden", minHeight: "100vh",
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}>

        {/* BG gradient blobs */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
          <div style={{
            position: "absolute", width: 800, height: 800,
            background: d
              ? "radial-gradient(circle,rgba(26,86,219,0.12) 0%,transparent 70%)"
              : "radial-gradient(circle,rgba(26,86,219,0.08) 0%,transparent 70%)",
            top: -200, left: -200,
          }} />
          <div style={{
            position: "absolute", width: 600, height: 600,
            background: d
              ? "radial-gradient(circle,rgba(6,182,212,0.08) 0%,transparent 70%)"
              : "radial-gradient(circle,rgba(6,182,212,0.06) 0%,transparent 70%)",
            bottom: -100, right: -100,
          }} />
        </div>

        {/* ── TOP NAV ── */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 998,
          padding: "0 2rem", height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: scrollY > 50
            ? d ? "rgba(6,11,24,0.92)" : "rgba(240,244,255,0.92)"
            : "transparent",
          backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
          borderBottom: scrollY > 50 ? `1px solid ${border}` : "none",
          transition: "all 0.3s",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg,#1a56db,#06b6d4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1rem", boxShadow: "0 4px 12px rgba(26,86,219,0.4)",
            }}>🎓</div>
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: d ? "#fff" : "#0f172a", lineHeight: 1 }}>PlaceTrack</div>
              <div style={{ fontSize: "0.6rem", color: muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Sahyadri College</div>
            </div>
          </div>

          {/* Nav right */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {["Features", "Stats", "Companies"].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} style={{
                color: muted, fontSize: "0.85rem", fontWeight: 600,
                textDecoration: "none", transition: "color 0.2s",
              }}
                onMouseOver={e => e.target.style.color = d ? "#fff" : "#0f172a"}
                onMouseOut={e => e.target.style.color = muted}
              >{link}</a>
            ))}

            {/* Dark/Light toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              style={{
                background: surface, border: `1px solid ${border}`,
                borderRadius: 20, padding: "6px 12px",
                color: muted, cursor: "pointer", fontSize: "0.85rem",
                display: "flex", alignItems: "center", gap: 6,
                transition: "all 0.2s",
              }}
            >
              {isDark ? "☀️" : "🌙"}
              <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{isDark ? "Light" : "Dark"}</span>
            </button>

            <button
              onClick={() => navigate("/login")}
              style={{
                background: "linear-gradient(135deg,#1a56db,#06b6d4)",
                border: "none", borderRadius: 8, padding: "9px 22px",
                color: "#fff", fontWeight: 700, fontSize: "0.85rem",
                cursor: "pointer", boxShadow: "0 4px 16px rgba(26,86,219,0.4)",
                transition: "all 0.2s",
              }}
              onMouseOver={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(26,86,219,0.5)"; }}
              onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(26,86,219,0.4)"; }}
            >
              Login →
            </button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "8rem 2rem 4rem",
          position: "relative", zIndex: 1,
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s cubic-bezier(0.4,0,0.2,1)",
        }}>
          {/* Live badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: d ? "rgba(26,86,219,0.15)" : "rgba(26,86,219,0.1)",
            border: "1px solid rgba(26,86,219,0.3)",
            borderRadius: 20, padding: "7px 18px", marginBottom: "1.75rem",
            fontSize: "0.78rem", fontWeight: 700, color: "#93c5fd",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", display: "inline-block", animation: "livePulse 1.5s infinite" }} />
            LIVE · 2024–25 Placement Season · Sahyadri
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Syne',sans-serif", fontWeight: 800,
            fontSize: "clamp(2.8rem,6vw,5rem)", lineHeight: 1.05,
            marginBottom: "1.25rem", maxWidth: 820,
            background: d
              ? "linear-gradient(135deg,#fff 30%,#93c5fd 70%,#06b6d4 100%)"
              : "linear-gradient(135deg,#0f172a 30%,#1a56db 70%,#06b6d4 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            letterSpacing: "-0.02em",
          }}>
            Sahyadri's Smartest<br />Placement Portal
          </h1>

          <p style={{ fontSize: "1.1rem", color: muted, maxWidth: 520, lineHeight: 1.8, marginBottom: "2.5rem" }}>
            Track placements, analyze trends, and get AI-powered career tools — all in one place built for Sahyadri students.
          </p>

          {/* CTA */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: "4rem" }}>
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "linear-gradient(135deg,#1a56db,#06b6d4)",
                border: "none", borderRadius: 12, padding: "15px 36px",
                color: "#fff", fontWeight: 700, fontSize: "1rem",
                cursor: "pointer", boxShadow: "0 8px 32px rgba(26,86,219,0.4)",
                transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8,
              }}
              onMouseOver={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(26,86,219,0.5)"; }}
              onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(26,86,219,0.4)"; }}
            >
              🚀 Get Started
            </button>
            <button
              onClick={() => document.getElementById("stats")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: surface, border: `1px solid ${border}`,
                borderRadius: 12, padding: "15px 36px",
                color: d ? "#e2e8f0" : "#1e293b", fontWeight: 700, fontSize: "1rem",
                cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseOver={e => e.currentTarget.style.background = d ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"}
              onMouseOut={e => e.currentTarget.style.background = surface}
            >
              View Stats ↓
            </button>
          </div>

          {/* Quick stats */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { v: "63.4%", l: "Placement Rate", c: "#06b6d4" },
              { v: "₹43.24L", l: "Highest Package", c: "#fbbf24" },
              { v: "78", l: "Students Placed", c: "#34d399" },
              { v: "14", l: "Companies", c: "#a78bfa" },
            ].map((s, i) => (
              <div key={i} style={{
                background: surface, border: `1px solid ${border}`,
                borderRadius: 12, padding: "12px 22px", textAlign: "center",
                backdropFilter: "blur(10px)",
                animation: `fadeUp 0.5s ease ${i * 0.1 + 0.3}s both`,
              }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.3rem", color: s.c }}>{s.v}</div>
                <div style={{ fontSize: "0.65rem", color: muted, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 3 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── LIVE TICKER ── */}
        <section style={{
          padding: "0.85rem 0", overflow: "hidden",
          background: d ? "rgba(26,86,219,0.08)" : "rgba(26,86,219,0.05)",
          borderTop: "1px solid rgba(26,86,219,0.2)",
          borderBottom: "1px solid rgba(26,86,219,0.2)",
          position: "relative", zIndex: 1,
        }}>
          <div style={{ display: "flex", animation: "ticker 35s linear infinite", whiteSpace: "nowrap", width: "max-content" }}>
            {[...PLACED_STUDENTS, ...PLACED_STUDENTS, ...PLACED_STUDENTS].map((s, i) => (
              <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "0 2rem" }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "linear-gradient(135deg,#1a56db,#06b6d4)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.68rem", fontWeight: 800, color: "#fff", flexShrink: 0,
                }}>
                  {s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: d ? "#e2e8f0" : "#1e293b" }}>{s.name}</span>
                <span style={{ fontSize: "0.75rem", color: muted }}>placed at</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#06b6d4" }}>{s.company}</span>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "2px 10px", borderRadius: 20, background: "rgba(52,211,153,0.15)", color: "#34d399" }}>{s.pkg}</span>
                <span style={{ color: d ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", marginLeft: 8 }}>●</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── STATS ── */}
        <section id="stats" ref={statsRef} style={{ padding: "6rem 2rem", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div style={{ fontSize: "0.72rem", color: "#06b6d4", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>
              2024–25 PLACEMENT SEASON
            </div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4vw,3rem)", color: d ? "#fff" : "#0f172a", marginBottom: 12, letterSpacing: "-0.02em" }}>
              Numbers That Speak
            </h2>
            <p style={{ color: muted, fontSize: "0.95rem" }}>Live placement statistics from Sahyadri College of Engineering & Management</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16 }}>
            <StatCard value={123} label="Total Students" color="#93c5fd" started={statsStarted} isDark={d} />
            <StatCard value={78} label="Students Placed" color="#34d399" started={statsStarted} isDark={d} />
            <StatCard value={63} suffix="%" label="Placement Rate" color="#06b6d4" started={statsStarted} isDark={d} />
            <StatCard value={14} label="Companies" color="#a78bfa" started={statsStarted} isDark={d} />
            <StatCard value={14} suffix=" LPA" label="Avg Package" color="#fbbf24" started={statsStarted} isDark={d} />
            <StatCard value={43} suffix=" LPA" label="Highest Package" color="#f87171" started={statsStarted} isDark={d} />
            <StatCard value={78} label="Total Offers" color="#34d399" started={statsStarted} isDark={d} />
            <StatCard value={45} label="Unplaced" color="#94a3b8" started={statsStarted} isDark={d} />
          </div>
        </section>

        {/* ── TOP COMPANIES ── */}
        <section id="companies" style={{ padding: "4rem 2rem 6rem", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: "0.72rem", color: "#06b6d4", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>
              TOP RECRUITERS
            </div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4vw,3rem)", color: d ? "#fff" : "#0f172a", letterSpacing: "-0.02em" }}>
              Companies That Hire From Us
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 14 }}>
            {TOP_COMPANIES.map((c, i) => (
              <div key={i} style={{
                background: surface, border: `1px solid ${border}`,
                borderRadius: 14, padding: "1.35rem",
                transition: "all 0.2s", cursor: "default",
                position: "relative", overflow: "hidden",
              }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.borderColor = c.color + "60";
                  e.currentTarget.style.boxShadow = `0 12px 32px ${c.color}20`;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Top accent line */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${c.color},${c.color}80)` }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: c.color + "18", border: `1px solid ${c.color}35`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "0.9rem", color: c.color,
                  }}>
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span style={{ fontSize: "0.65rem", fontWeight: 800, color: muted }}>#{i + 1}</span>
                </div>

                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem", color: d ? "#fff" : "#0f172a", marginBottom: 10 }}>
                  {c.name}
                </div>

                <div style={{ display: "flex", gap: 20 }}>
                  <div>
                    <div style={{ fontSize: "0.62rem", color: muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Offers</div>
                    <div style={{ fontWeight: 800, color: c.color, fontSize: "1rem", fontFamily: "'Syne',sans-serif" }}>{c.offers}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.62rem", color: muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Avg Pkg</div>
                    <div style={{ fontWeight: 700, color: d ? "#e2e8f0" : "#1e293b", fontSize: "0.9rem" }}>{c.avg}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" style={{ padding: "4rem 2rem 6rem", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: "0.72rem", color: "#06b6d4", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>
              BUILT FOR STUDENTS
            </div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4vw,3rem)", color: d ? "#fff" : "#0f172a", letterSpacing: "-0.02em" }}>
              Everything You Need
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background: surface, border: `1px solid ${border}`,
                borderRadius: 14, padding: "1.5rem",
                transition: "all 0.2s", cursor: "default",
              }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = f.color + "50";
                  e.currentTarget.style.boxShadow = `0 8px 24px ${f.color}15`;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12, marginBottom: 14,
                  background: f.color + "15", border: `1px solid ${f.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.4rem",
                }}>{f.icon}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem", color: d ? "#fff" : "#0f172a", marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: "0.82rem", color: muted, lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: "4rem 2rem 6rem", position: "relative", zIndex: 1 }}>
          <div style={{
            maxWidth: 700, margin: "0 auto", textAlign: "center",
            background: d
              ? "linear-gradient(135deg,rgba(26,86,219,0.2),rgba(6,182,212,0.1))"
              : "linear-gradient(135deg,rgba(26,86,219,0.08),rgba(6,182,212,0.05))",
            border: "1px solid rgba(26,86,219,0.25)", borderRadius: 24, padding: "4rem 2rem",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", width: 400, height: 400, background: "radial-gradient(circle,rgba(26,86,219,0.15),transparent 70%)", top: -150, right: -100, pointerEvents: "none" }} />
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚀</div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "2.2rem", color: d ? "#fff" : "#0f172a", marginBottom: 12, letterSpacing: "-0.02em" }}>
              Ready to Track Your Placement?
            </h2>
            <p style={{ color: muted, marginBottom: "2rem", fontSize: "0.95rem", lineHeight: 1.7 }}>
              Login with your college credentials and start your placement journey today.
            </p>
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "linear-gradient(135deg,#1a56db,#06b6d4)",
                border: "none", borderRadius: 12, padding: "15px 44px",
                color: "#fff", fontWeight: 700, fontSize: "1rem",
                cursor: "pointer", boxShadow: "0 8px 32px rgba(26,86,219,0.4)",
                transition: "all 0.2s",
              }}
              onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(26,86,219,0.5)"; }}
              onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(26,86,219,0.4)"; }}
            >
              Get Started — It's Free →
            </button>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
          borderTop: `1px solid ${border}`, padding: "1.75rem 2rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12, position: "relative", zIndex: 1,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#1a56db,#06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }}>🎓</div>
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "0.9rem", color: d ? "#fff" : "#0f172a" }}>PlaceTrack</div>
              <div style={{ fontSize: "0.6rem", color: muted }}>Sahyadri College of Engineering & Management, Mangaluru</div>
            </div>
          </div>
          <div style={{ fontSize: "0.78rem", color: muted }}>
            Built by <span style={{ color: "#afcef2", fontWeight: 700 }}>Anoop A</span> · 2026
          </div>
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "transparent", border: `1px solid ${border}`,
              borderRadius: 8, padding: "8px 20px", color: muted,
              fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = "#1a56db"; e.currentTarget.style.color = d ? "#fff" : "#0f172a"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = muted; }}
          >
            Login →
          </button>
        </footer>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
          @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
          @keyframes livePulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.4; transform:scale(0.7); } }
          @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
          html { scroll-behavior: smooth; }
        `}</style>
      </div>
    </>
  );
}