import React, { useEffect, useState } from 'react';

interface ScoreGaugeProps {
  score: number;
  color: string;
  status: string;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, color, status }) => {
  const [offset, setOffset] = useState(377); 
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progress = score / 100;
    const newOffset = circumference - progress * circumference;
    setOffset(newOffset);
  }, [score, circumference]);

  return (
    <div className="flex flex-col items-center justify-center relative w-72 h-72 select-none group">
      {/* Background radial glow */}
      <div 
        className="absolute inset-0 rounded-full opacity-[0.08] blur-[80px] transition-all duration-1000 group-hover:opacity-[0.15]"
        style={{ backgroundColor: color }}
      />
      
      <svg className="w-full h-full transform -rotate-90">
        {/* Background Track */}
        <circle
          cx="144"
          cy="144"
          r={radius}
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="14"
          fill="transparent"
        />
        
        {/* Main Progress Ring */}
        <circle
          cx="144"
          cy="144"
          r={radius}
          stroke={color}
          strokeWidth="14"
          fill="transparent"
          strokeDasharray={circumference}
          style={{ 
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.8s ease'
          }}
          strokeLinecap="round"
          className="filter drop-shadow-[0_0_12px_rgba(0,0,0,0.5)]"
        />

        {/* Decorative inner dotted line */}
        <circle
          cx="144"
          cy="144"
          r={radius - 20}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
          fill="transparent"
          strokeDasharray="2 6"
        />
      </svg>
      
      {/* Center Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-center animate-in zoom-in duration-700">
          <div className="flex items-baseline justify-center">
            <span 
              className="text-8xl font-mono font-black tracking-tighter transition-all duration-500 stat-value"
              style={{ color: color, textShadow: `0 0 40px ${color}33` }}
            >
              {Math.round(score)}
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-black mt-[-10px] opacity-60">
            Points Santé
          </p>
        </div>
      </div>

      {/* Modern Status Badge */}
      <div 
        className="absolute bottom-4 flex items-center gap-2 px-5 py-2 rounded-full border bg-black/40 backdrop-blur-xl shadow-2xl transition-all duration-500"
        style={{ borderColor: `${color}33` }}
      >
        <div 
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
        />
        <span 
          className="text-[10px] font-black uppercase tracking-[0.2em]"
          style={{ color: color }}
        >
          {status}
        </span>
      </div>
    </div>
  );
};

export default ScoreGauge;
