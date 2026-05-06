'use client';

import React from 'react';
import { useHealthScore } from '../../hooks/useHealthScore';
import ScoreGauge from './ScoreGauge';
import MetricCard from './MetricCard';
import InsightList from './InsightList';

const BusinessHealthScore: React.FC = () => {
  const { data, result, updateField, setCurrency } = useHealthScore();

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans selection:bg-teal-500/30 overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <header className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-8 animate-in fade-in duration-1000">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.3)] gradient-border">
              <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight uppercase">
                  Founder <span className="text-teal-500">Copilot</span>
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-teal-500/10 text-teal-500 border border-teal-500/20 uppercase tracking-widest">v2.0</span>
              </div>
              <p className="text-gray-500 text-xs font-medium mt-1 tracking-wide uppercase">Advanced Business Health Monitoring</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex glass-panel p-1 rounded-xl border border-white/5">
              {(['XOF', 'USD'] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-6 py-2 rounded-lg text-[10px] font-black transition-all duration-300 tracking-widest ${
                    data.currency === curr 
                    ? 'bg-teal-500 text-black shadow-[0_0_15px_rgba(20,184,166,0.4)]' 
                    : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Inputs Column */}
          <aside className="xl:col-span-4 space-y-6 animate-in slide-in-from-left duration-700">
            <div className="glass-panel p-8 rounded-3xl gradient-border">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-teal-500/80">Config Business</h2>
                <div className="w-8 h-1 bg-teal-500/20 rounded-full" />
              </div>
              
              <div className="space-y-8">
                {[
                  { id: 'monthlyRevenue', label: 'Revenu Mensuel', placeholder: 'ex: 1 500 000', suffix: data.currency },
                  { id: 'monthlyCosts', label: 'Coûts Totaux', placeholder: 'ex: 900 000', suffix: data.currency },
                  { id: 'growthRate', label: 'Croissance', placeholder: 'ex: 12', suffix: '%' },
                ].map((field) => (
                  <div key={field.id} className="space-y-3">
                    <label htmlFor={field.id} className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.15em]">
                      {field.label}
                    </label>
                    <div className="relative group">
                      <input
                        id={field.id}
                        type="number"
                        placeholder={field.placeholder}
                        className="glass-input w-full rounded-2xl py-4 px-5 font-mono text-lg text-white focus:outline-none"
                        value={(data as any)[field.id] || ''}
                        onChange={(e) => updateField(field.id as any, e.target.value)}
                      />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 font-mono text-sm group-focus-within:text-teal-500 transition-colors uppercase font-bold">
                        {field.suffix}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-4 rounded-2xl bg-teal-500/5 border border-teal-500/10">
                <p className="text-[10px] text-teal-500/60 leading-relaxed font-medium">
                  <span className="font-black mr-1">NOTE:</span>
                  Les calculs sont mis à jour instantanément. Votre Health Score est une projection basée sur la rentabilité et le momentum.
                </p>
              </div>
            </div>
          </aside>

          {/* Visualization Column */}
          <main className="xl:col-span-8 space-y-8 animate-in slide-in-from-bottom duration-1000 delay-200">
            <div className="glass-panel p-10 rounded-3xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 blur-[80px] -z-10 rounded-full" />
              
              <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="flex-shrink-0">
                  <ScoreGauge 
                    score={result.totalScore} 
                    color={result.color} 
                    status={result.status} 
                  />
                </div>

                <div className="w-full grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-5">
                  <MetricCard 
                    label="Marge Opérationnelle" 
                    value={result.metrics.grossMargin.value} 
                    unit="%" 
                    score={result.metrics.grossMargin.score} 
                    maxScore={40} 
                  />
                  <MetricCard 
                    label="Efficacité Coûts" 
                    value={result.metrics.costRatio.value} 
                    unit="%" 
                    score={result.metrics.costRatio.score} 
                    maxScore={30} 
                  />
                  <MetricCard 
                    label="Momentum" 
                    value={result.metrics.growthMomentum.value} 
                    unit="%" 
                    score={result.metrics.growthMomentum.score} 
                    maxScore={30} 
                  />
                </div>
              </div>

              <div className="mt-12 pt-10 border-t border-white/5">
                <InsightList insights={result.insights} />
              </div>
            </div>
          </main>
        </div>

        <footer className="mt-20 flex justify-center text-gray-600 text-[9px] font-black uppercase tracking-[0.4em] opacity-40">
          © 2026 UBB Digital - Building the Future of Africa
        </footer>
      </div>
    </div>
  );
};

export default BusinessHealthScore;
