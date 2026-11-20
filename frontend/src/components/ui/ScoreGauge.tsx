import React from 'react';

interface ScoreGaugeProps {
  score: number;
  riskTier: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, riskTier }) => {
  // Clamped score between 300 and 900
  const clamped = Math.max(300, Math.min(900, score));
  // Map 300..900 to angle -90 to +90 degrees
  const percentage = (clamped - 300) / 600;
  const angle = -90 + percentage * 180;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'EXCELLENT':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'GOOD':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'FAIR':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'AVERAGE':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'BELOW_AVERAGE':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'UNRATED':
        return 'text-slate-600 bg-slate-100 border-slate-300';
      case 'POOR':
      default:
        return 'text-rose-600 bg-rose-50 border-rose-200';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-sm font-semibold tracking-wider text-slate-500 uppercase mb-2">
        Alternative Credit Score
      </h3>
      
      <div className="relative w-64 h-36 flex items-end justify-center overflow-hidden">
        {/* SVG Half-Circle Gauge */}
        <svg viewBox="0 0 200 110" className="w-full h-full">
          {/* Background Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Colored gradient track */}
          <path
            d="M 20 100 A 80 80 0 0 1 60 40"
            fill="none"
            stroke="#f43f5e"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M 60 40 A 80 80 0 0 1 100 20"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="16"
          />
          <path
            d="M 100 20 A 80 80 0 0 1 140 40"
            fill="none"
            stroke="#10b981"
            strokeWidth="16"
          />
          <path
            d="M 140 40 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#059669"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Needle */}
          <g transform={`rotate(${angle} 100 100)`}>
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="28"
              stroke="#1e293b"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="7" fill="#0f172a" />
          </g>
        </svg>
      </div>

      {/* Numeric Score */}
      <div className="text-center mt-2">
        <div className="text-5xl font-extrabold tracking-tight text-slate-900 font-mono">
          {score}
        </div>
        <div className="text-xs text-slate-400 mt-0.5">Scale: 300 – 900</div>
      </div>

      {/* Risk Tier Badge */}
      <div className="mt-4">
        <span
          className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold border ${getTierColor(
            riskTier
          )}`}
        >
          {riskTier.replace('_', ' ')}
        </span>
      </div>
    </div>
  );
};
