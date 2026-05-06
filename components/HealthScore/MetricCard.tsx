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
      className="dashboard-card p-6 flex flex-col justify-between group h-full"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex flex-col gap-1">
          <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
            {label}
          </span>
          <div className="h-0.5 w-6 bg-teal-500/30 rounded-full" />
        </div>
        <div 
          className="px-2 py-1 rounded-md text-[9px] font-black tracking-tighter"
          style={{ backgroundColor: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}33` }}
        >
          {score}/{maxScore} PTS
        </div>
      </div>

      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-4xl font-mono font-bold text-white stat-value tracking-tighter">
          {value > 1000 ? value.toLocaleString() : value}
        </span>
        <span className="text-gray-500 text-sm font-bold uppercase tracking-widest opacity-40">{unit}</span>
      </div>

      <div className="relative pt-4">
        <div className="flex justify-between items-center mb-2 text-[10px] font-bold text-gray-500">
          <span className="uppercase tracking-widest opacity-60">Indice de Santé</span>
          <span className="font-mono text-white/80">{Math.round(ratio * 100)}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.05]">
          <div 
            className="h-full transition-all duration-1000 ease-out relative"
            style={{ 
              width: `${(score / maxScore) * 100}%`,
              backgroundColor: statusColor,
              boxShadow: `0 0 15px ${statusColor}44`
            }}
          >
            <div className="absolute top-0 right-0 h-full w-4 bg-white/20 blur-[2px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
