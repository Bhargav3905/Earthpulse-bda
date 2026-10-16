import React from 'react';
import { Activity, Gauge, Zap, Waves, AlertCircle } from 'lucide-react';
import { CardSkeleton } from './LoadingSkeleton';

export default function SummaryCards({ summary, isLoading }) {
  if (isLoading && !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const totalEvents = summary?.totalEvents ?? 0;
  const avgMagnitude = summary?.averageMagnitude != null ? Number(summary.averageMagnitude).toFixed(2) : '—';
  const maxMagnitude = summary?.maxMagnitude != null ? Number(summary.maxMagnitude).toFixed(1) : '—';
  const tsunamiEvents = summary?.tsunamiEvents ?? 0;

  const cards = [
    {
      title: 'Total Earthquakes',
      value: totalEvents ? totalEvents.toLocaleString() : '0',
      label: 'Recorded Seismic Events',
      caption: 'Ingested USGS telemetry records',
      icon: Activity,
      color: 'cyan',
      glow: 'shadow-cyan-950/40',
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
      badge: `${totalEvents.toLocaleString()} Events`,
      badgeColor: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30',
    },
    {
      title: 'Average Magnitude',
      value: avgMagnitude !== '—' ? avgMagnitude : '—',
      label: 'Mean Richter Scale',
      caption: 'Energy distribution baseline',
      icon: Gauge,
      color: 'amber',
      glow: 'shadow-amber-950/40',
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      badge: 'Micro-Minor Band',
      badgeColor: 'bg-amber-950/60 text-amber-300 border-amber-500/30',
    },
    {
      title: 'Strongest Magnitude',
      value: maxMagnitude !== '—' ? `M ${maxMagnitude}` : '—',
      label: 'Maximum Recorded Energy',
      caption: 'Peak tremor severity in index',
      icon: Zap,
      color: 'rose',
      glow: 'shadow-rose-950/40',
      border: 'border-rose-500/20 hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
      badge: Number(maxMagnitude) >= 7 ? 'Major / Severe' : 'Moderate',
      badgeColor: 'bg-rose-950/60 text-rose-300 border-rose-500/30',
    },
    {
      title: 'Tsunami-Flagged',
      value: tsunamiEvents.toLocaleString(),
      label: 'Oceanic Disturbance Flags',
      caption: 'Events triggering oceanic advisories',
      icon: Waves,
      color: 'blue',
      glow: 'shadow-blue-950/40',
      border: 'border-blue-500/20 hover:border-blue-500/40',
      iconBg: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      badge: tsunamiEvents > 0 ? `${tsunamiEvents} Alerted` : 'Zero Threat',
      badgeColor: tsunamiEvents > 0 
        ? 'bg-blue-950/60 text-blue-300 border-blue-500/30' 
        : 'bg-slate-800 text-slate-400 border-slate-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`glass-panel glass-panel-hover rounded-2xl p-5 sm:p-6 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${card.border}`}
          >
            {/* Ambient subtle glow background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl ${card.iconBg} shadow-sm`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-1 my-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
                {card.value}
              </div>
              <div className="text-xs text-slate-400 font-medium">
                {card.caption}
              </div>
            </div>

            <div className="pt-3 mt-2 border-t border-slate-800/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 truncate">
                {card.label}
              </span>
              <span className={`text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full border ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
