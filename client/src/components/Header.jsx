import React from 'react';
import { Activity, RefreshCw, Database, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export default function Header({
  status,
  lastRefreshed,
  timeAgo,
  countdown,
  onRefresh,
  isLoading,
}) {
  const isConnected = Boolean(status?.databaseConnected);
  const dbName = status?.database || 'EarthPulse';

  return (
    <header className="glass-panel sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-4 border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 shadow-lg shadow-cyan-950/50">
            <Activity className="w-6 h-6 text-cyan-400 animate-pulse" />
            <span className="absolute -inset-0.5 rounded-xl bg-cyan-400/20 blur-sm -z-10"></span>
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                EarthPulse
                <span className="text-xs uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  BDA Intelligence
                </span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Real-Time Global Seismic Telemetry & Ingestion Stream
            </p>
          </div>
        </div>

        {/* Controls & Telemetry Indicators */}
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
          
          {/* Database Connection Pill */}
          <div 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
              isConnected 
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' 
                : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
            }`}
            title={isConnected ? `Connected to MongoDB database: ${dbName}` : 'MongoDB connection unavailable'}
          >
            <span className="relative flex h-2 w-2">
              {isConnected ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              )}
            </span>
            <Database className="w-3.5 h-3.5 opacity-70" />
            <span className="font-medium">
              {isConnected ? `DB: ${dbName}` : 'DB Disconnected'}
            </span>
          </div>

          {/* Last Refreshed & Auto-refresh countdown */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/70 border border-slate-800 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {lastRefreshed ? (
                <>
                  Updated <span className="text-white font-medium">{timeAgo || 'just now'}</span>
                </>
              ) : (
                'Connecting...'
              )}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-cyan-400 font-mono" title="Automatic telemetry sync in seconds">
              {countdown}s
            </span>
          </div>

          {/* Manual Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-all duration-200 border ${
              isLoading
                ? 'bg-slate-800 border-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-cyan-500/10 hover:bg-cyan-500/20 active:bg-cyan-500/30 border-cyan-500/40 text-cyan-300 hover:text-cyan-200 hover:shadow-lg hover:shadow-cyan-950/40'
            }`}
            aria-label="Refresh earthquake analytics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{isLoading ? 'Syncing...' : 'Refresh'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
