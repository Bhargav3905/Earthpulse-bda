import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  ExternalLink,
  MapPin,
  Clock,
  Layers,
  Search,
  Filter,
  Navigation,
  AlertCircle,
} from 'lucide-react';
import { TableSkeleton } from './LoadingSkeleton';

function getMagnitudeBadge(mag) {
  const val = Number(mag);
  if (val >= 7.0) {
    return {
      bg: 'bg-rose-950/80 border-rose-500/40 text-rose-300',
      label: 'Major',
      indicator: 'bg-rose-500',
    };
  }
  if (val >= 6.0) {
    return {
      bg: 'bg-orange-950/80 border-orange-500/40 text-orange-300',
      label: 'Strong',
      indicator: 'bg-orange-500',
    };
  }
  if (val >= 5.0) {
    return {
      bg: 'bg-amber-950/80 border-amber-500/40 text-amber-300',
      label: 'Moderate',
      indicator: 'bg-amber-500',
    };
  }
  return {
    bg: 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300',
    label: 'Light',
    indicator: 'bg-cyan-500',
  };
}

function getDepthClassification(depthKm) {
  if (depthKm == null) return { label: 'Unknown', color: 'text-slate-400' };
  if (depthKm < 70) return { label: 'Shallow (<70km)', color: 'text-cyan-400' };
  if (depthKm <= 300) return { label: 'Intermediate (70-300km)', color: 'text-amber-400' };
  return { label: 'Deep (>300km)', color: 'text-purple-400' };
}

function formatCoordinates(lat, lon) {
  if (lat == null || lon == null) return 'N/A';
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(2)}°${latDir}, ${Math.abs(lon).toFixed(2)}°${lonDir}`;
}

function formatEventTime(isoString) {
  if (!isoString) return { formatted: 'N/A', relative: '' };
  try {
    const date = new Date(isoString);
    const formatted = date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });

    // Relative calculation
    const diffMs = Date.now() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    let relative = '';
    if (diffDays <= 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      relative = diffHours > 0 ? `${diffHours}h ago` : 'today';
    } else {
      relative = `${diffDays}d ago`;
    }

    return { formatted, relative };
  } catch {
    return { formatted: isoString, relative: '' };
  }
}

export default function StrongestEarthquakesTable({ events = [], isLoading }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [minMagnitude, setMinMagnitude] = useState(0);

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesSearch =
        !searchQuery ||
        (ev.place && ev.place.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ev.usgsId && ev.usgsId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesMag = minMagnitude === 0 || (ev.magnitude && ev.magnitude >= minMagnitude);

      return matchesSearch && matchesMag;
    });
  }, [events, searchQuery, minMagnitude]);

  if (isLoading && (!events || events.length === 0)) {
    return <TableSkeleton />;
  }

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 sm:p-6 transition-all duration-300">
      
      {/* Header with Title and Search/Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              Strongest Recorded Earthquakes
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 font-semibold">
              Top 10 Global Intensity
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked order of peak seismic moments indexed in the big data pipeline
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by location or ID..."
              className="pl-9 pr-3 py-1.5 bg-slate-900/90 border border-slate-800 focus:border-cyan-500/50 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors w-48 sm:w-56"
            />
          </div>

          {/* Magnitude Quick Filter */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 border border-slate-800 rounded-xl text-xs">
            <button
              onClick={() => setMinMagnitude(0)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                minMagnitude === 0
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setMinMagnitude(6.5)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                minMagnitude === 6.5
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              M 6.5+
            </button>
            <button
              onClick={() => setMinMagnitude(7.0)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                minMagnitude === 7.0
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              M 7.0+
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="earthquake-table-container mt-4">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
              <th scope="col" className="py-3 px-3 font-semibold">Magnitude</th>
              <th scope="col" className="py-3 px-3 font-semibold">Location & Coordinates</th>
              <th scope="col" className="py-3 px-3 font-semibold">Time Recorded</th>
              <th scope="col" className="py-3 px-3 font-semibold">Focal Depth</th>
              <th scope="col" className="py-3 px-3 font-semibold text-right">USGS Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <AlertCircle className="w-8 h-8 text-slate-500" />
                    <p className="text-sm font-medium text-slate-300">
                      {events.length === 0
                        ? 'No earthquake records available in dataset.'
                        : 'No earthquakes match your filter criteria.'}
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setMinMagnitude(0);
                        }}
                        className="text-cyan-400 hover:underline text-xs"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredEvents.map((event) => {
                const badge = getMagnitudeBadge(event.magnitude);
                const depthInfo = getDepthClassification(event.depth);
                const timeInfo = formatEventTime(event.time);
                const coords = formatCoordinates(event.latitude, event.longitude);

                return (
                  <tr
                    key={event.usgsId || event._id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    {/* Magnitude Badge */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono font-bold text-xs ${badge.bg}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${badge.indicator}`}
                          ></span>
                          <span>M {event.magnitude != null ? Number(event.magnitude).toFixed(1) : '—'}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 hidden sm:inline uppercase tracking-wider font-semibold">
                          {badge.label}
                        </span>
                      </div>
                    </td>

                    {/* Location & Coordinates */}
                    <td className="py-3.5 px-3 max-w-xs sm:max-w-md">
                      <div className="font-medium text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                        {event.place || 'Unknown Location'}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1 font-mono text-[10px]">
                          <Navigation className="w-3 h-3 text-slate-500 rotate-45 inline" />
                          {coords}
                        </span>
                      </div>
                    </td>

                    {/* Time */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="text-slate-200 font-mono text-[11px]">
                        {timeInfo.formatted}
                      </div>
                      {timeInfo.relative && (
                        <span className="inline-block text-[10px] text-slate-400 px-1.5 py-0.2 rounded bg-slate-800/60 mt-0.5">
                          {timeInfo.relative}
                        </span>
                      )}
                    </td>

                    {/* Depth */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="font-mono font-semibold text-slate-200">
                        {event.depth != null ? `${Number(event.depth).toFixed(1)} km` : 'N/A'}
                      </div>
                      <div className={`text-[10px] font-medium ${depthInfo.color}`}>
                        {depthInfo.label}
                      </div>
                    </td>

                    {/* Source / USGS Link */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      {event.eventUrl ? (
                        <a
                          href={event.eventUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-500/20 border border-slate-700/60 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all font-mono text-[11px]"
                          title="View verified USGS event detail page"
                        >
                          <span>{event.usgsId || 'USGS'}</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                        </a>
                      ) : (
                        <span className="text-slate-500 font-mono text-[11px]">
                          {event.usgsId || '—'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-2">
        <span>
          Displaying {filteredEvents.length} of {events.length} strongest seismic records
        </span>
        <span className="text-[11px]">
          Focal depth criteria: USGS Seismological Standard Catalog
        </span>
      </div>

    </div>
  );
}
