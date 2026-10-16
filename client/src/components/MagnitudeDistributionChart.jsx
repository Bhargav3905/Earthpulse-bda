import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { BarChart3, AlertCircle } from 'lucide-react';
import { ChartSkeleton } from './LoadingSkeleton';

const MAGNITUDE_METADATA = {
  0: { label: '0.0 - 0.9', severity: 'Micro', color: '#10b981' },
  1: { label: '1.0 - 1.9', severity: 'Minor', color: '#06b6d4' },
  2: { label: '2.0 - 2.9', severity: 'Minor', color: '#38bdf8' },
  3: { label: '3.0 - 3.9', severity: 'Light', color: '#fbbf24' },
  4: { label: '4.0 - 4.9', severity: 'Light', color: '#f59e0b' },
  5: { label: '5.0 - 5.9', severity: 'Moderate', color: '#f97316' },
  6: { label: '6.0 - 6.9', severity: 'Strong', color: '#ea580c' },
  7: { label: '7.0 - 7.9', severity: 'Major', color: '#ef4444' },
  8: { label: '8.0 - 9.9', severity: 'Great', color: '#dc2626' },
  '10+': { label: '10+ / Other', severity: 'Extreme', color: '#b91c1c' },
};

function CustomTooltip({ active, payload, totalEvents }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const count = data.count || 0;
    const percent = totalEvents > 0 ? ((count / totalEvents) * 100).toFixed(1) : 0;

    return (
      <div className="glass-panel px-4 py-3 rounded-xl border border-slate-700 shadow-xl text-xs space-y-1 z-50">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ backgroundColor: data.color }}
          ></span>
          <span className="font-semibold text-white text-sm">
            M {data.label}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
            {data.severity}
          </span>
        </div>
        <div className="text-slate-300 pt-1 flex justify-between gap-4">
          <span>Frequency:</span>
          <span className="font-mono font-bold text-white">{count.toLocaleString()}</span>
        </div>
        <div className="text-slate-400 flex justify-between gap-4">
          <span>Share:</span>
          <span className="font-mono text-cyan-400 font-semibold">{percent}%</span>
        </div>
      </div>
    );
  }
  return null;
}

export default function MagnitudeDistributionChart({ data = [], isLoading }) {
  if (isLoading && (!data || data.length === 0)) {
    return <ChartSkeleton height="h-96" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center min-h-[360px] text-center">
        <AlertCircle className="w-10 h-10 text-slate-500 mb-3" />
        <h3 className="text-base font-semibold text-slate-200">No Magnitude Distribution Data</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          Telemetry records are currently empty or waiting for ingestion from the USGS feed.
        </p>
      </div>
    );
  }

  // Calculate total events for percentage calculations
  const totalEvents = data.reduce((acc, curr) => acc + (curr.count || 0), 0);

  // Format data with metadata labels and colors
  const formattedData = data.map((item) => {
    const meta = MAGNITUDE_METADATA[item._id] || {
      label: String(item._id),
      severity: 'Standard',
      color: '#38bdf8',
    };

    return {
      id: item._id,
      label: meta.label,
      severity: meta.severity,
      count: item.count || 0,
      color: meta.color,
    };
  });

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              Magnitude Distribution
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Frequency breakdown categorized across Richter scale buckets
          </p>
        </div>

        {/* Legend pills */}
        <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Minor (&lt;3)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Light (3-5)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span> Moderate (5-7)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Major (7+)
          </span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-72 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 15, right: 10, left: -10, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              interval={0}
              angle={-25}
              textAnchor="end"
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val)}
            />
            <Tooltip
              content={<CustomTooltip totalEvents={totalEvents} />}
              cursor={{ fill: 'rgba(51, 65, 85, 0.25)' }}
            />
            <Bar
              dataKey="count"
              radius={[6, 6, 0, 0]}
              animationDuration={800}
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 gap-2">
        <span>
          Total sample categorized: <strong className="text-white font-mono">{totalEvents.toLocaleString()}</strong> events
        </span>
        <span className="text-[11px] text-slate-500">
          Source: USGS Global GeoJSON Seismic Bucket Aggregation
        </span>
      </div>
    </div>
  );
}
