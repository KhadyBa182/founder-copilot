import React from 'react';

interface MetricCardProps {
  label: string;
  value: number;
  unit: string;
  score: number;
  maxScore: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, score, maxScore }) => {
  const ratio = score / maxScore;
  const statusColor = ratio >= 0.8 ? '#639922' : ratio >= 0.5 ? '#EF9F27' : '#E24B4A';

  return (
    <div 
      suppressHydrationWarning
      className="glass-panel p-5 rounded-2xl flex flex-col justify-between group transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.03] gradient-border"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.15em] opacity-80 group-hover:opacity-100 transition-opacity">
          {label}
        </span>
        <div 
          className="w-2 h-2 rounded-full animate-pulse-slow"
          style={{ backgroundColor: statusColor, boxShadow: `0 0 10px ${statusColor}` }}
        />
      </div>

      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-3xl font-mono font-bold text-white tracking-tight">
          {value > 1000 ? value.toLocaleString() : value}
        </span>
        <span className="text-gray-500 text-xs font-mono font-medium opacity-50 uppercase">{unit}</span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-500">
          <span>Performance</span>
          <span style={{ color: statusColor }}>{Math.round(ratio * 100)}%</span>
        </div>
        <div className="bg-white/[0.03] h-1.5 rounded-full overflow-hidden border border-white/[0.05]">
          <div 
            className="h-full transition-all duration-1000 ease-out"
            style={{ 
              width: `${(score / maxScore) * 100}%`,
              backgroundColor: statusColor,
              boxShadow: `0 0 12px ${statusColor}66`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
