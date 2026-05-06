import React, { useEffect, useRef, useState } from 'react';

interface MetricCardProps {
  label: string;
  value: number;
  unit: string;
  score: number;
  maxScore: number;
}

const TIERS = [
  { min: 0.8, color: '#4ade80', bg: 'rgba(74,222,128,0.07)',  border: 'rgba(74,222,128,0.2)',  label: 'Fort'    },
  { min: 0.5, color: '#fb923c', bg: 'rgba(251,146,60,0.07)',  border: 'rgba(251,146,60,0.2)',  label: 'Moyen'   },
  { min: 0,   color: '#f87171', bg: 'rgba(248,113,113,0.07)', border: 'rgba(248,113,113,0.2)', label: 'Faible'  },
];

function getTier(ratio: number) {
  return TIERS.find(t => ratio >= t.min) ?? TIERS[2];
}

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, score, maxScore }) => {
  const ratio = maxScore > 0 ? score / maxScore : 0;
  const tier = getTier(ratio);
  const pct = Math.round(ratio * 100);

  const [displayValue, setDisplayValue] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const rafRef = useRef<number | null>(null);

  // Animate counter + bar on mount
  useEffect(() => {
    let start: number | null = null;
    const duration = 1400;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = easeOutExpo(p);
      setDisplayValue(Math.round(ease * value));
      setBarWidth(ease * ratio * 100);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    const timer = setTimeout(() => { rafRef.current = requestAnimationFrame(step); }, 80);
    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, ratio]);

  const formatted = displayValue > 999
    ? displayValue.toLocaleString('fr-FR')
    : String(displayValue);

  return (
    <div
      suppressHydrationWarning
      style={{
        fontFamily: "'DM Mono', 'IBM Plex Mono', monospace",
        background: '#111113',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        padding: '1.25rem 1.375rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.3s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = tier.border)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
    >
      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: '20%', right: '20%',
          height: '1px',
          background: `linear-gradient(to right, transparent, ${tier.color}60, transparent)`,
          transition: 'background 0.5s ease',
        }}
      />

      {/* Subtle corner glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40px', right: '-40px',
          width: '120px', height: '120px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${tier.color}12 0%, transparent 70%)`,
          pointerEvents: 'none',
          transition: 'background 0.5s ease',
        }}
      />

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.1rem' }}>
        <div>
          <div
            style={{
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              fontWeight: 500,
              marginBottom: '6px',
            }}
          >
            {label}
          </div>
          {/* Colored accent bar under label */}
          <div
            style={{
              width: '20px',
              height: '2px',
              borderRadius: '1px',
              background: tier.color,
              opacity: 0.4,
              transition: 'background 0.4s ease',
            }}
          />
        </div>

        {/* Score badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: '100px',
            background: tier.bg,
            border: `1px solid ${tier.border}`,
            transition: 'all 0.4s ease',
          }}
        >
          <span
            style={{
              width: '5px', height: '5px',
              borderRadius: '50%',
              backgroundColor: tier.color,
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: '10px',
              fontWeight: 500,
              letterSpacing: '0.08em',
              color: tier.color,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {score}/{maxScore}
          </span>
        </div>
      </div>

      {/* Main value */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '1.25rem' }}>
        <span
          style={{
            fontSize: '42px',
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            color: '#fff',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {formatted}
        </span>
        <span
          style={{
            fontSize: '11px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.22)',
            fontWeight: 400,
            paddingBottom: '4px',
          }}
        >
          {unit}
        </span>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Progress section */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.25)',
            }}
          >
            Indice de santé
          </span>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: tier.color,
              letterSpacing: '-0.01em',
              fontVariantNumeric: 'tabular-nums',
              transition: 'color 0.4s ease',
            }}
          >
            {pct}%
          </span>
        </div>

        {/* Bar track */}
        <div
          style={{
            width: '100%',
            height: '3px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '2px',
            overflow: 'visible',
            position: 'relative',
          }}
        >
          {/* Filled bar */}
          <div
            style={{
              height: '100%',
              width: `${barWidth}%`,
              background: tier.color,
              borderRadius: '2px',
              transition: 'background 0.4s ease',
              position: 'relative',
            }}
          >
            {/* Bright tip */}
            <div
              style={{
                position: 'absolute',
                right: '-1px', top: '-2px',
                width: '7px', height: '7px',
                borderRadius: '50%',
                background: tier.color,
                boxShadow: `0 0 8px 2px ${tier.color}80`,
                transition: 'background 0.4s ease, box-shadow 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Tier label */}
        <div style={{ marginTop: '8px', textAlign: 'right' }}>
          <span
            style={{
              fontSize: '9px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: `${tier.color}70`,
              fontWeight: 500,
            }}
          >
            {tier.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;