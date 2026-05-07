'use client';

import React, { useState } from 'react';
import { useHealthScore } from '../../hooks/useHealthScore';
import ScoreGauge from './ScoreGauge';
import MetricCard from './MetricCard';
import InsightList from './InsightList';

// ─── Field config ────────────────────────────────────────────────────────────
const FIELDS = [
  { id: 'monthlyRevenue', label: "Revenue",    suffix: 'currency', placeholder: '1 000 000' },
  { id: 'monthlyCosts',   label: 'Cout',       suffix: 'currency', placeholder: '600 000' },
  { id: 'growthRate',     label: 'Croissance', suffix: '%',        placeholder: '15' },
] as const;

// ─── Tier helper (mirrors scoring.ts, display-only) ──────────────────────────
function tierColor(score: number) {
  if (score >= 80) return '#4ade80';
  if (score >= 60) return '#2dd4bf';
  if (score >= 40) return '#fb923c';
  return '#f87171';
}

// ─── Component ───────────────────────────────────────────────────────────────
const BusinessHealthScore: React.FC = () => {
  const { data, result, updateField, setCurrency } = useHealthScore();
  const [activeTab, setActiveTab] = useState<'metrics' | 'insights'>('metrics');
  const accent = tierColor(result.totalScore);

  return (
    <div
      suppressHydrationWarning
      style={{
        fontFamily: "'DM Mono', 'IBM Plex Mono', monospace",
        minHeight: '100vh',
        background: '#080809',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
      }}
    >
      {/* ── Ambient background blobs ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-15%', right: '-8%',
          width: '55%', height: '55%', borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}08 0%, transparent 70%)`,
          transition: 'background 1.2s ease',
        }} />
        <div style={{
          position: 'absolute', bottom: '-18%', left: '-8%',
          width: '45%', height: '45%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,212,191,0.04) 0%, transparent 70%)',
        }} />
        {/* Grid texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
      </div>

      {/* ── Layout wrapper ── */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', minHeight: '100vh', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>

        {/* SIDEBAR: Configuration */}
        <aside style={{
          width: '300px', flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(10,10,12,0.7)',
          backdropFilter: 'blur(24px)',
          display: 'flex', flexDirection: 'column',
          padding: '1.5rem 1.25rem',
          position: 'sticky', top: 0, height: '100vh',
          overflowY: 'auto',
        }}>

          {/* Logo block */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '6px',
                background: accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 15px ${accent}40`,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#000">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>
                Founder <span style={{ color: accent }}>Copilot</span>
              </div>
            </div>
          </div>

          {/* Input fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            {FIELDS.map((field) => (
              <div key={field.id}>
                <label
                  htmlFor={field.id}
                  style={{
                    display: 'block', fontSize: '9px', letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
                    marginBottom: '5px', fontWeight: 500,
                  }}
                >
                  {field.label}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id={field.id}
                    type="number"
                    placeholder={field.placeholder}
                    value={(data as any)[field.id] || ''}
                    onChange={(e) => updateField(field.id as any, e.target.value)}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '8px', padding: '10px 12px',
                      fontSize: '15px', fontWeight: 500, color: '#fff',
                      outline: 'none', fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                  <span style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    fontSize: '9px', color: 'rgba(255,255,255,0.2)', pointerEvents: 'none',
                  }}>
                    {field.suffix === 'currency' ? data.currency : field.suffix}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '1.75rem' }}>
            <div style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', lineHeight: 1.8 }}>
              <div>© 2026 UBB Digital</div>
              <div style={{ opacity: 0.6 }}>Building the Future of Africa</div>
            </div>
          </div>
        </aside>

        {/* ════════════════════════════════════════════════
            MAIN CONTENT
        ════════════════════════════════════════════════ */}
        <main style={{ flex: 1, padding: '2.5rem 2.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* ── Top bar ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' }}>
                Tableau de bord
              </div>
              <h1 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>
                Santé Business
              </h1>
            </div>
            {/* Live status pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '7px 14px', borderRadius: '100px',
              border: `1px solid ${accent}30`,
              background: `${accent}0A`,
              transition: 'all 0.5s ease',
            }}>
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: accent, display: 'inline-block',
                boxShadow: `0 0 8px ${accent}`,
                animation: 'pulse 2s ease-out infinite',
              }} />
              <span style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: accent, fontWeight: 500, transition: 'color 0.5s ease' }}>
                {result.status}
              </span>
            </div>
          </div>

          {/* ── Hero: gauge + score summary ── */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'auto 1fr',
            gap: '2rem', alignItems: 'center',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px', padding: '2.5rem',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* top accent line */}
            <div style={{
              position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
              background: `linear-gradient(to right, transparent, ${accent}50, transparent)`,
              transition: 'background 0.8s ease',
            }} />

            <ScoreGauge score={result.totalScore} color={accent} status={result.status} />

            {/* Right side summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '6px' }}>
                  Analyse
                </div>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', maxWidth: '380px' }}>
                  Marge brute de{' '}
                  <span style={{ color: '#fff', fontWeight: 500 }}>{result.metrics.grossMargin.value}%</span>
                  {' '}avec une croissance mensuelle de{' '}
                  <span style={{ color: accent, fontWeight: 500, transition: 'color 0.5s ease' }}>
                    +{result.metrics.growthMomentum.value}%
                  </span>
                  .
                </p>
              </div>

              {/* Mini stat row */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'Marge',      val: `${result.metrics.grossMargin.value}%`,    pts: `${result.metrics.grossMargin.score}/40`    },
                  { label: 'Coûts',      val: `${result.metrics.costRatio.value}%`,      pts: `${result.metrics.costRatio.score}/30`      },
                  { label: 'Croissance', val: `${result.metrics.growthMomentum.value}%`, pts: `${result.metrics.growthMomentum.score}/30` },
                ].map(item => (
                  <div key={item.label} style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '12px', padding: '12px 16px', minWidth: '100px',
                  }}>
                    <div style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '5px' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                      {item.val}
                    </div>
                    <div style={{ fontSize: '10px', color: accent, marginTop: '4px', letterSpacing: '0.06em', transition: 'color 0.5s ease' }}>
                      {item.pts} pts
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Tab bar ── */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '4px', alignSelf: 'flex-start' }}>
            {([['metrics', 'Métriques'], ['insights', 'Insights']] as const).map(([id, lbl]) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  padding: '8px 20px', border: 'none', borderRadius: '7px', cursor: 'pointer',
                  fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em',
                  fontFamily: 'inherit', transition: 'all 0.2s ease',
                  background: activeTab === id ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: activeTab === id ? '#fff' : 'rgba(255,255,255,0.35)',
                }}
              >
                {lbl}
              </button>
            ))}
          </div>

          {/* ── Metrics grid ── */}
          {activeTab === 'metrics' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              <MetricCard label="Marge opérationnelle" value={result.metrics.grossMargin.value}    unit="%"  score={result.metrics.grossMargin.score}    maxScore={40} />
              <MetricCard label="Ratio coûts"          value={result.metrics.costRatio.value}      unit="%"  score={result.metrics.costRatio.score}      maxScore={30} />
              <MetricCard label="Growth momentum"      value={result.metrics.growthMomentum.value} unit="%" score={result.metrics.growthMomentum.score} maxScore={30} />
            </div>
          )}

          {/* ── Insights ── */}
          {activeTab === 'insights' && (
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px', padding: '2rem',
            }}>
              <InsightList insights={result.insights} />
            </div>
          )}

          {/* ── Score progress bar (bottom) ── */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '14px', padding: '1.25rem 1.5rem',
            display: 'flex', alignItems: 'center', gap: '1.25rem',
          }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
              Score global
            </div>
            <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'visible', position: 'relative' }}>
              <div style={{
                height: '100%', width: `${result.totalScore}%`,
                background: accent, borderRadius: '2px',
                transition: 'width 1.4s cubic-bezier(0.16,1,0.3,1), background 0.6s ease',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', right: '-1px', top: '-4px',
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: accent, boxShadow: `0 0 10px 2px ${accent}70`,
                  transition: 'background 0.6s ease, box-shadow 0.6s ease',
                }} />
              </div>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: accent, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', minWidth: '52px', textAlign: 'right', transition: 'color 0.6s ease' }}>
              {result.totalScore}<span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', fontWeight: 400 }}>/100</span>
            </div>
          </div>

        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
        @keyframes pulse {
          0%   { box-shadow: 0 0 0 0 currentColor; }
          70%  { box-shadow: 0 0 0 6px transparent; }
          100% { box-shadow: 0 0 0 0 transparent; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
      `}</style>
    </div>
  );
};

export default BusinessHealthScore;