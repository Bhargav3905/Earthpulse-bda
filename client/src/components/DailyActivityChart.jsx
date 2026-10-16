import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp, AlertCircle, Calendar, Sparkles } from 'lucide-react';
import { ChartSkeleton } from './LoadingSkeleton';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const date = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

function formatFullDate(dateStr) {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const date = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

function CustomDailyTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const avgMag = data.averageMagnitude != null ? Number(data.averageMagnitude).toFixed(2) : '—';

    return (
      <div className="glass-panel px-4 py-3 rounded-xl border border-slate-700 shadow-xl text-xs space-y-2 z-50">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-1.5">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-white">
            {formatFullDate(data._id)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Daily Events:
          </span>
          <span className="font-mono font-bold text-white text-sm">
            {Number(data.count).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Mean Magnitude:
          </span>
          <span className="font-mono font-bold text-amber-300 text-sm">
            M {avgMag}
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export default function DailyActivityChart({ data = [], isLoading }) {
  if (isLoading && (!data || data.length === 0)) {
    return <ChartSkeleton height="h-96" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center min-h-[360px] text-center">
        <AlertCircle className="w-10 h-10 text-slate-500 mb-3" />
        <h3 className="text-base font-semibold text-slate-200">No Daily Activity Trends</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          Historical timeline data is currently accumulating.
        </p>
      </div>
    );
  }

  // Calculate peak day and summary stats
  let peakEvent = data[0];
  let totalWindowEvents = 0;

  data.forEach((item) => {
    totalWindowEvents += (item.count || 0);
    if ((item.count || 0) > (peakEvent?.count || 0)) {
      peakEvent = item;
    }
  });

  const avgPerDay = data.length > 0 ? Math.round(totalWindowEvents / data.length) : 0;

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              Daily Earthquake Activity
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Chronological trend analysis tracking daily frequency & mean tremor intensity
          </p>
        </div>

        {/* Quick Highlights */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
            <span className="text-slate-400">Avg/Day:</span>{' '}
            <strong className="text-cyan-400 font-mono">{avgPerDay}</strong>
          </div>
          {peakEvent && (
            <div className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
              <span className="text-slate-400">Peak:</span>{' '}
              <strong className="text-white font-mono">{formatDate(peakEvent._id)}</strong>{' '}
              <span className="text-cyan-400 font-mono font-semibold">({peakEvent.count})</span>
            </div>
          )}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 15, right: 10, left: -10, bottom: 25 }}
          >
            <defs>
              <linearGradient id="cyanAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="_id"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={formatDate}
              interval="preserveStartEnd"
              minTickGap={24}
              angle={-25}
              textAnchor="end"
            />
            {/* Primary Y Axis for Count */}
            <YAxis
              yAxisId="left"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
            />
            {/* Secondary Y Axis for Average Magnitude */}
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#f59e0b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              domain={[0, 4]}
              tickFormatter={(v) => `M${v}`}
            />
            <Tooltip content={<CustomDailyTooltip />} />
            
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="count"
              name="Event Count"
              stroke="#06b6d4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#cyanAreaGradient)"
              activeDot={{ r: 5, fill: '#38bdf8', stroke: '#0e7490', strokeWidth: 2 }}
            />

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="averageMagnitude"
              name="Avg Magnitude"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="4 3"
              dot={false}
              activeDot={{ r: 4, fill: '#fbbf24', stroke: '#b45309', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Summary Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-3 h-1.5 rounded-full bg-cyan-400 inline-block"></span> Daily Earthquake Count (Left Axis)
          </span>
          <span className="flex items-center gap-1.5 text-amber-300/90">
            <span className="w-3 h-0.5 bg-amber-400 inline-block border-b border-dashed border-amber-400"></span> Mean Magnitude (Right Axis)
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">
          Span: {data.length} days analyzed
        </span>
      </div>
    </div>
  );
}
