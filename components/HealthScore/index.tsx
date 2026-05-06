'use client';

import React from 'react';
import { useHealthScore } from '../../hooks/useHealthScore';
import ScoreGauge from './ScoreGauge';
import MetricCard from './MetricCard';
import InsightList from './InsightList';

const BusinessHealthScore: React.FC = () => {
  const { data, result, updateField, setCurrency } = useHealthScore();

  return (
    <div className="min-h-screen bg-[#030305] text-white selection:bg-teal-500/30 overflow-x-hidden font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-teal-500/[0.03] blur-[150px] rounded-full glow-bg" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/[0.03] blur-[150px] rounded-full glow-bg" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row min-h-screen">
        
        {/* SIDEBAR: Configuration */}
        <aside className="w-full lg:w-[400px] lg:fixed lg:h-screen p-8 border-b lg:border-b-0 lg:border-r border-white/5 bg-black/20 backdrop-blur-3xl z-10 flex flex-col">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/20">
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-xl font-black uppercase tracking-tighter">
                Founder <span className="text-teal-500">Copilot</span>
              </h1>
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] opacity-60">Intelligence Business App</p>
          </div>

          <div className="flex-1 space-y-10">
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-500">Paramètres</h2>
                <div className="flex bg-white/5 p-1 rounded-lg">
                  {(['XOF', 'USD'] as const).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setCurrency(curr)}
                      className={`px-4 py-1.5 rounded-md text-[9px] font-black transition-all tracking-widest ${
                        data.currency === curr 
                        ? 'bg-teal-500 text-black' 
                        : 'text-gray-500 hover:text-white'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { id: 'monthlyRevenue', label: 'Chiffre d\'Affaires Mensuel', icon: '💰' },
                  { id: 'monthlyCosts', label: 'Charges Totales', icon: '📉' },
                  { id: 'growthRate', label: 'Taux de Croissance (%)', icon: '🚀' },
                ].map((field) => (
                  <div key={field.id} className="space-y-3 group">
                    <label htmlFor={field.id} className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest transition-colors group-focus-within:text-teal-500">
                      <span>{field.icon}</span>
                      {field.label}
                    </label>
                    <div className="input-field relative overflow-hidden">
                      <input
                        id={field.id}
                        type="number"
                        className="w-full bg-transparent py-4 px-5 font-mono text-xl text-white focus:outline-none placeholder:text-white/10"
                        placeholder="0.00"
                        value={(data as any)[field.id] || ''}
                        onChange={(e) => updateField(field.id as any, e.target.value)}
                      />
                      {field.id !== 'growthRate' && (
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-600 uppercase tracking-widest pointer-events-none">
                          {data.currency}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <footer className="pt-10 border-t border-white/5 text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em] leading-relaxed">
            <p>© 2026 UBB Digital</p>
            <p className="mt-1 opacity-60">Building the Future of Africa</p>
          </footer>
        </aside>

        {/* MAIN CONTENT: Dashboard */}
        <main className="flex-1 lg:ml-[400px] p-8 lg:p-12 animate-in fade-in slide-in-from-right duration-1000">
          <div className="max-w-5xl mx-auto space-y-12">
            
            {/* HERO SECTION: Score */}
            <section className="flex flex-col items-center justify-center dashboard-card py-16 relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />
              <ScoreGauge 
                score={result.totalScore} 
                color={result.color} 
                status={result.status} 
              />
              <div className="mt-10 text-center max-w-md px-6">
                <h3 className="text-xl font-bold mb-2 tracking-tight">Analyse de Santé Business</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Basé sur votre rentabilité de <span className="text-white font-mono">{result.metrics.grossMargin.value}%</span> et votre croissance mensuelle.
                </p>
              </div>
            </section>

            {/* METRICS GRID */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard 
                label="Marge Opérationnelle" 
                value={result.metrics.grossMargin.value} 
                unit="%" 
                score={result.metrics.grossMargin.score} 
                maxScore={40} 
              />
              <MetricCard 
                label="Ratio Coûts" 
                value={result.metrics.costRatio.value} 
                unit="%" 
                score={result.metrics.costRatio.score} 
                maxScore={30} 
              />
              <MetricCard 
                label="Growth Momentum" 
                value={result.metrics.growthMomentum.value} 
                unit="%" 
                score={result.metrics.growthMomentum.score} 
                maxScore={30} 
              />
            </section>

            {/* INSIGHTS SECTION */}
            <section className="dashboard-card p-10">
              <InsightList insights={result.insights} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BusinessHealthScore;
