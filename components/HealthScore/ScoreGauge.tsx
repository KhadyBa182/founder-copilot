import React, { useEffect, useState } from 'react';

interface ScoreGaugeProps {
  score: number;
  color: string;
  status: string;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, color, status }) => {
  const [offset, setOffset] = useState(251); 
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progress = score / 100;
    const newOffset = circumference - progress * circumference;
    setOffset(newOffset);
  }, [score, circumference]);

  return (
    <div className="flex flex-col items-center justify-center relative w-64 h-64 select-none">
      {/* Outer Glow Background */}
      <div 
        className="absolute inset-4 rounded-full blur-3xl opacity-20 transition-all duration-1000"
        style={{ backgroundColor: color }}
      />
      
      <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]">
        {/* Background track - Inner */}
        <circle
          cx="128"
          cy="128"
          r={radius}
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="12"
          fill="transparent"
        />
        
        {/* Progress bar - Main */}
        <circle
          cx="128"
          cy="128"
          r={radius}
          stroke={color}
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          style={{ 
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.8s ease'
          }}
          strokeLinecap="round"
          className="filter drop-shadow-[0_0_12px_currentColor]"
        />

        {/* Decorative inner circle */}
        <circle
          cx="128"
          cy="128"
          r={radius - 15}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
          fill="transparent"
          strokeDasharray="4 8"
        />
      </svg>
      
      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <span 
            className="text-6xl font-mono font-black tracking-tighter transition-all duration-500"
            style={{ color: color, textShadow: `0 0 20px ${color}44` }}
          >
            {Math.round(score)}
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold -mt-1 ml-1 opacity-60">
            Score Santé
          </span>
        </div>
      </div>

      {/* Floating Status Badge */}
      <div 
        className="absolute -bottom-2 px-6 py-2 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] glass-panel border shadow-2xl transition-all duration-500 hover:scale-105 cursor-default"
        style={{ borderColor: `${color}44`, color: color }}
      >
        <span className="relative z-10">{status}</span>
        <div className="absolute inset-0 bg-current opacity-[0.03] rounded-2xl" />
      </div>
    </div>
  );
};

export default ScoreGauge;
