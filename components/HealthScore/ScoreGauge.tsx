import React, { useEffect, useState, useRef } from 'react';

interface ScoreGaugeProps {
  score: number;
  color: string;
  status: string;
}

const THRESHOLDS = [
  { min: 80, label: 'Excellent', accent: '#4ade80', bg: 'rgba(74,222,128,0.06)', ring: 'rgba(74,222,128,0.15)' },
  { min: 60, label: 'Sain',      accent: '#2dd4bf', bg: 'rgba(45,212,191,0.06)', ring: 'rgba(45,212,191,0.15)' },
  { min: 40, label: 'Fragile',   accent: '#fb923c', bg: 'rgba(251,146,60,0.06)',  ring: 'rgba(251,146,60,0.15)'  },
  { min: 0,  label: 'Critique',  accent: '#f87171', bg: 'rgba(248,113,113,0.06)', ring: 'rgba(248,113,113,0.15)' },
];

function getTheme(score: number) {
  return THRESHOLDS.find(t => score >= t.min) ?? THRESHOLDS[3];
}

// Tick marks around the gauge
function Ticks({ count = 48, radius = 108 }: { count?: number; radius?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const isMajor = i % 8 === 0;
        const inner = radius - (isMajor ? 10 : 5);
        const outer = radius;
        const x1 = (144 + inner * Math.cos(rad)).toFixed(3);
        const y1 = (144 + inner * Math.sin(rad)).toFixed(3);
        const x2 = (144 + outer * Math.cos(rad)).toFixed(3);
        const y2 = (144 + outer * Math.sin(rad)).toFixed(3);
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={isMajor ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)'}
            strokeWidth={isMajor ? 1.5 : 1}
            strokeLinecap="round"
          />
        );
      })}
    </>
  );
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, color, status }) => {
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);
  const [displayScore, setDisplayScore] = useState(0);
  const [mounted, setMounted] = useState(false);
  const animRef = useRef<number | null>(null);
  const theme = getTheme(score);
  const accentColor = color || theme.accent;

  // Animate stroke offset
  useEffect(() => {
    const timeout = setTimeout(() => {
      const progress = score / 100;
      setOffset(circumference - progress * circumference);
      setMounted(true);
    }, 120);
    return () => clearTimeout(timeout);
  }, [score, circumference]);

  // Animate counter
  useEffect(() => {
    let start: number | null = null;
    const duration = 1800;
    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayScore(Math.round(easeOutExpo(progress) * score));
      if (progress < 1) animRef.current = requestAnimationFrame(step);
    };
    const raf = setTimeout(() => { animRef.current = requestAnimationFrame(step); }, 200);
    return () => {
      clearTimeout(raf);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [score]);

  // Derive label color from score
  const scoreLabel =
    score >= 80 ? 'Excellent' :
    score >= 60 ? 'Sain' :
    score >= 40 ? 'Fragile' : 'Critique';

  return (
    <div
      style={{
        fontFamily: "'DM Mono', 'IBM Plex Mono', 'Fira Mono', monospace",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '288px',
        height: '288px',
        userSelect: 'none',
      }}
    >
      {/* Outer ambient glow */}
      <div
        style={{
          position: 'absolute',
          inset: '-20px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}18 0%, transparent 70%)`,
          opacity: mounted ? 1 : 0,
          transition: 'opacity 1.2s ease',
          pointerEvents: 'none',
        }}
      />

      {/* SVG ring */}
      <svg
        width="288"
        height="288"
        viewBox="0 0 288 288"
        style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Segment gradient for the arc */}
          <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.6" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Tick marks */}
        <g style={{ transform: 'rotate(0)', transformOrigin: '144px 144px' }}>
          <Ticks count={60} radius={128} />
        </g>

        {/* Background track */}
        <circle
          cx="144" cy="144" r={radius}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
        />

        {/* Secondary soft track */}
        <circle
          cx="144" cy="144" r={radius}
          stroke={`${accentColor}18`}
          strokeWidth="12"
          fill="transparent"
        />

        {/* Progress arc */}
        <circle
          cx="144" cy="144" r={radius}
          stroke={`url(#arcGrad)`}
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          filter="url(#glow)"
          style={{
            transition: 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* Glowing tip dot — positioned at arc end */}
        {mounted && (
          (() => {
            const angle = ((score / 100) * 360 - 90) * (Math.PI / 180);
            const dotX = (144 + radius * Math.cos(angle)).toFixed(3);
            const dotY = (144 + radius * Math.sin(angle)).toFixed(3);
            return (
              <circle
                cx={dotX} cy={dotY} r="6"
                fill={accentColor}
                filter="url(#glow)"
                style={{ transition: 'all 1.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            );
          })()
        )}

        {/* Inner decorative ring */}
        <circle
          cx="144" cy="144" r={radius - 28}
          stroke={`${accentColor}12`}
          strokeWidth="1"
          fill="transparent"
          strokeDasharray="3 8"
        />
      </svg>

      {/* Center content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
        }}
      >
        {/* Score number */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            color: accentColor,
            textShadow: `0 0 30px ${accentColor}44`,
            fontVariantNumeric: 'tabular-nums',
            transition: 'color 0.6s ease',
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {displayScore}
        </div>

        {/* /100 label */}
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.28)',
            fontWeight: 400,
            marginTop: '-4px',
          }}
        >
          / 100
        </div>

        {/* Thin separator */}
        <div
          style={{
            width: '24px',
            height: '1px',
            background: `linear-gradient(to right, transparent, ${accentColor}60, transparent)`,
            margin: '6px 0',
          }}
        />

        {/* Status label */}
        <div
          style={{
            fontSize: '10px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            fontWeight: 500,
          }}
        >
          {scoreLabel}
        </div>
      </div>

      {/* Bottom status pill */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          padding: '5px 14px',
          borderRadius: '100px',
          border: `1px solid ${accentColor}30`,
          background: `${accentColor}0A`,
          backdropFilter: 'blur(8px)',
          transition: 'all 0.5s ease',
        }}
      >
        {/* Pulsing dot */}
        <span
          style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: accentColor,
            boxShadow: `0 0 0 0 ${accentColor}`,
            animation: 'pulse-ring 2s ease-out infinite',
          }}
        />
        <span
          style={{
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: accentColor,
          }}
        >
          {status || scoreLabel}
        </span>
      </div>

      {/* Pulse keyframe via inline style tag */}
      <style>{`
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 ${accentColor}70; }
          60%  { box-shadow: 0 0 0 5px ${accentColor}00; }
          100% { box-shadow: 0 0 0 0 ${accentColor}00; }
        }
      `}</style>
    </div>
  );
};

export default ScoreGauge;