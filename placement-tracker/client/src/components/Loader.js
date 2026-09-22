import React from 'react';

const WORD = 'PlaceTrack';

export default function Loader({ message = '' }) {
  return (
    <div style={styles.overlay}>
      <style>{`
        @keyframes letterDrop {
          0%   { transform: translateY(-120px) scaleY(1.4); opacity: 0; }
          55%  { transform: translateY(10px)   scaleY(0.85); opacity: 1; }
          70%  { transform: translateY(-18px)  scaleY(1.1); }
          82%  { transform: translateY(6px)    scaleY(0.95); }
          91%  { transform: translateY(-6px)   scaleY(1.03); }
          100% { transform: translateY(0)      scaleY(1); opacity: 1; }
        }

        @keyframes logoReveal {
          0%   { opacity: 0; transform: scale(0.6) translateY(20px); }
          60%  { transform: scale(1.08) translateY(-4px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        @keyframes fadeMsg {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes barGrow {
          from { width: 0%; }
          to   { width: 100%; }
        }

        .drop-letter {
          display: inline-block;
          opacity: 0;
          animation: letterDrop 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          transform-origin: bottom center;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2rem, 8vw, 3.2rem);
          letter-spacing: -0.02em;
          color: #fff;
          will-change: transform, opacity;
        }

        .logo-pop {
          opacity: 0;
          animation: logoReveal 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .loader-bar {
          animation: barGrow 2.2s ease forwards;
          background: linear-gradient(90deg, #9fe6be, #1f5c3a, #9fe6be);
          background-size: 200% 100%;
        }

        .msg-fade {
          animation: fadeMsg 0.5s ease forwards;
        }
      `}</style>

      {/* Letter drop row */}
      <div style={styles.wordRow}>
        {WORD.split('').map((char, i) => {
          // Delay each letter — first half green, second half white accent
          const isAccent = i >= 5;
          return (
            <span
              key={i}
              className="drop-letter"
              style={{
                animationDelay: `${i * 0.07}s`,
                color: isAccent ? '#9fe6be' : '#ffffff',
                textShadow: isAccent
                  ? '0 0 24px rgba(159,230,190,0.5)'
                  : '0 0 24px rgba(255,255,255,0.3)',
              }}
            >
              {char}
            </span>
          );
        })}
      </div>

      {/* Sahyadri logo — pops in after all letters land */}
      <div
        className="logo-pop"
        style={{
          animationDelay: `${WORD.length * 0.07 + 0.4}s`,
          marginTop: '1.5rem',
        }}
      >
        <img
          src="/Sayhadri-Logo-02.jpg"
          alt="Sahyadri"
          style={styles.logo}
        />
      </div>

      {/* Thin progress bar */}
      <div style={styles.barTrack}>
        <div
          className="loader-bar"
          style={{
            ...styles.bar,
            animationDelay: `${WORD.length * 0.07 + 0.2}s`,
          }}
        />
      </div>

      {/* Optional message */}
      {message ? (
        <p
          className="msg-fade"
          style={{
            ...styles.msg,
            animationDelay: `${WORD.length * 0.07 + 0.9}s`,
          }}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'linear-gradient(145deg, #153f28 0%, #1f5c3a 50%, #0d2b1a 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  wordRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '1px',
    lineHeight: 1,
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: 'contain',
    borderRadius: 14,
    background: '#fff',
    padding: 4,
    boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
  },
  barTrack: {
    marginTop: '2rem',
    width: 220,
    height: 3,
    borderRadius: 99,
    background: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 99,
    width: 0,
  },
  msg: {
    marginTop: '1rem',
    color: 'rgba(255,255,255,0.55)',
    fontSize: '0.78rem',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontWeight: 500,
    letterSpacing: '0.05em',
    opacity: 0,
  },
};
