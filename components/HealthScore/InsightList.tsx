import React from 'react';

interface InsightListProps {
  insights: string[];
}

/**
 * Affiche la liste des recommandations contextuelles générées par la logique de scoring.
 */
const InsightList: React.FC<InsightListProps> = ({ insights }) => {
  return (
    <div suppressHydrationWarning className="mt-8">
      <h3 className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-4 flex items-center">
        <span className="w-1 h-1 bg-teal-500 rounded-full mr-2"></span>
        IA Insights & Recommandations
      </h3>
      <ul className="space-y-3">
        {insights.map((insight, index) => (
          <li 
            key={index} 
            className="flex gap-3 bg-[#1A1A1A]/50 border-l-2 border-teal-500/30 p-3 rounded-r-lg text-sm text-gray-300 leading-relaxed animate-in fade-in slide-in-from-left duration-500"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <span className="text-teal-500 mt-0.5">→</span>
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InsightList;
