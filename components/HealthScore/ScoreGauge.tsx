import React, { useEffect, useState, useRef } from 'react';

interface ScoreGaugeProps {
  score: number;
  color: string;
  status: string;
}

const THRESHOLDS = [
  { min: 80, label: 'Excellent', accent: '#4ade80' },
  { min: 60, label: 'Sain',      accent: '#2dd4bf' },
  { min: 40, label: 'Fragile',   accent: '#fb923c' },
  { min: 0,  label: 'Critique',  accent: '#f87171' },
];

function getTheme(score: number) {
  return THRESHOLDS.find(t => score >= t.min) ?? THRESHOLDS[3];
}

function Ticks({ count = 48, radius = 80 }: { count?: number; radius?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const isMajor = i % 8 === 0;
        const inner = radius - (isMajor ? 8 : 4);
        const outer = radius;
        const x1 = (110 + inner * Math.cos(rad)).toFixed(3);
        const y1 = (110 + inner * Math.sin(rad)).toFixed(3);
        const x2 = (110 + outer * Math.cos(rad)).toFixed(3);
        const y2 = (110 + outer * Math.sin(rad)).toFixed(3);
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={isMajor ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)'}
            strokeWidth={isMajor ? 1.2 : 0.8}
            strokeLinecap="round"
          />
        );
      })}
    </>
  );
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, color, status }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);
  const [displayScore, setDisplayScore] = useState(0);
  const [mounted, setMounted] = useState(false);
  const animRef = useRef<number | null>(null);
  const theme = getTheme(score);
  const accentColor = color || theme.accent;

  useEffect(() => {
    const timeout = setTimeout(() => {
      const progress = score / 100;
      setOffset(circumference - progress * circumference);
      setMounted(true);
    }, 120);
    return () => clearTimeout(timeout);
  }, [score, circumference]);

  useEffect(() => {
    let start: number | null = null;
    const duration = 1500;
    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayScore(Math.round(easeOutExpo(progress) * score));
      if (progress < 1) animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [score]);

  return (
    <div
      style={{
        fontFamily: "'DM Mono', monospace",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '220px',
        height: '220px',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '-10px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}12 0%, transparent 70%)`,
          opacity: mounted ? 1 : 0,
          transition: 'opacity 1s ease',
          pointerEvents: 'none',
        }}
      />

      <svg
        width="220"
        height="220"
        viewBox="0 0 220 220"
        style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
      >
        <defs>
          <filter id="glow-small">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="arcGradSmall" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.5" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="1" />
          </linearGradient>
        </defs>

        <g style={{ transformOrigin: '110px 110px' }}>
          <Ticks count={40} radius={95} />
        </g>

        <circle
          cx="110" cy="110" r={radius}
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="10"
          fill="transparent"
        />

        <circle
          cx="110" cy="110" r={radius}
          stroke={`url(#arcGradSmall)`}
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          filter="url(#glow-small)"
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />

        {mounted && (
          (() => {
            const angle = ((score / 100) * 360 - 90) * (Math.PI / 180);
            const dotX = (110 + radius * Math.cos(angle)).toFixed(3);
            const dotY = (110 + radius * Math.sin(angle)).toFixed(3);
            return (
              <circle
                cx={dotX} cy={dotY} r="4"
                fill={accentColor}
                filter="url(#glow-small)"
                style={{ transition: 'all 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            );
          })()
        )}
      </svg>
      
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0' }}>
        <div style={{ fontSize: '56px', fontWeight: 700, lineHeight: 1, color: accentColor, textShadow: `0 0 25px ${accentColor}44`, fontVariantNumeric: 'tabular-nums' }}>
          {displayScore}
        </div>
        <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginTop: '-2px' }}>
          / 100
        </div>
        <div style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 500, marginTop: '8px' }}>
          {status}
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;