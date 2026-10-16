import React from 'react';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';

export default function ErrorAlert({ error, onRetry, onDismiss }) {
  if (!error) return null;

  return (
    <div className="rounded-2xl bg-rose-950/40 border border-rose-500/40 p-4 sm:p-5 text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-rose-950/30">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-rose-100 text-sm sm:text-base">
            Telemetry Feed Disruption
          </h3>
          <p className="text-xs text-rose-300/90 mt-0.5 max-w-xl">
            {error || 'Failed to retrieve seismic intelligence from backend. Please verify your MongoDB connection and API server.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-semibold text-rose-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Feed</span>
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/20 transition-colors"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
