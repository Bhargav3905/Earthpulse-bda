import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import MagnitudeDistributionChart from './components/MagnitudeDistributionChart';
import DailyActivityChart from './components/DailyActivityChart';
import StrongestEarthquakesTable from './components/StrongestEarthquakesTable';
import ErrorAlert from './components/ErrorAlert';
import { fetchDashboardAnalytics, fetchSystemStatus } from './services/api';
import { Radio, Database, ShieldCheck, Activity, Cpu, Layers } from 'lucide-react';

function calculateTimeAgo(date) {
  if (!date) return '';
  const seconds = Math.max(0, Math.floor((new Date().getTime() - date.getTime()) / 1000));
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export default function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [timeAgo, setTimeAgo] = useState('');
  const [countdown, setCountdown] = useState(60);

  // Keep a stable ref for countdown in intervals
  const isRefreshingRef = useRef(false);

  // Main data loader
  const loadData = useCallback(async (isManual = false) => {
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;
    setIsLoading(true);

    try {
      // Execute both requests concurrently
      const [analyticsRes, statusRes] = await Promise.all([
        fetchDashboardAnalytics(),
        fetchSystemStatus(),
      ]);

      if (analyticsRes?.success && analyticsRes?.data) {
        setDashboardData(analyticsRes.data);
      } else {
        throw new Error('Analytics payload format invalid or unsuccessful.');
      }

      if (statusRes?.success) {
        setStatus(statusRes);
      }

      const now = new Date();
      setLastRefreshed(now);
      setTimeAgo('just now');
      setCountdown(60);
      setError(null);
    } catch (err) {
      console.error('Telemetry fetch error:', err);
      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to connect to the EarthPulse API server at http://localhost:5000.';
      setError(message);
    } finally {
      setIsLoading(false);
      isRefreshingRef.current = false;
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 1-second interval for countdown & relative time updates
  useEffect(() => {
    const timer = setInterval(() => {
      // Update relative time
      if (lastRefreshed) {
        setTimeAgo(calculateTimeAgo(lastRefreshed));
      }

      // Decrement countdown
      setCountdown((prev) => {
        if (prev <= 1) {
          // Trigger refresh
          loadData();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lastRefreshed, loadData]);

  const handleManualRefresh = () => {
    setCountdown(60);
    loadData(true);
  };

  return (
    <div className="min-h-screen bg-seismic-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      
      {/* Top Navigation & Status Bar */}
      <Header
        status={status}
        lastRefreshed={lastRefreshed}
        timeAgo={timeAgo}
        countdown={countdown}
        onRefresh={handleManualRefresh}
        isLoading={isLoading}
      />

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Error notification if any */}
        <ErrorAlert
          error={error}
          onRetry={handleManualRefresh}
          onDismiss={() => setError(null)}
        />

        {/* 1. Summary Cards */}
        <section aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="sr-only">Seismic Activity Overview</h2>
          <SummaryCards
            summary={dashboardData?.summary}
            isLoading={isLoading}
          />
        </section>

        {/* 2 & 3. Visual Analytics Charts Grid */}
        <section aria-labelledby="analytics-charts-heading" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 id="analytics-charts-heading" className="text-sm font-semibold tracking-wider uppercase text-slate-400 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Big Data Analytics & Seismic Distribution
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Magnitude Distribution Bar Chart */}
            <MagnitudeDistributionChart
              data={dashboardData?.magnitudeDistribution}
              isLoading={isLoading}
            />

            {/* Daily Trends Area/Line Chart */}
            <DailyActivityChart
              data={dashboardData?.dailyTrends}
              isLoading={isLoading}
            />
          </div>
        </section>

        {/* 4. Strongest Recorded Earthquakes Table */}
        <section aria-labelledby="strongest-earthquakes-heading">
          <StrongestEarthquakesTable
            events={dashboardData?.strongestEvents}
            isLoading={isLoading}
          />
        </section>

        {/* 5. Telemetry Architecture Metadata Bar */}
        <section aria-label="System Pipeline Architecture" className="glass-panel rounded-2xl p-4 sm:p-5 text-xs text-slate-400">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="flex items-center gap-3 pr-4">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-slate-200 block">USGS Ingestion Stream</span>
                <span className="text-[11px] text-slate-500">Auto-syncing global GeoJSON feeds every 60s</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 md:pt-0 md:px-4">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-slate-200 block">Aggregation Pipeline</span>
                <span className="text-[11px] text-slate-500">
                  MongoDB bucket categorization & daily time-series grouping
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 md:pt-0 md:pl-4">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-slate-200 block">Real-Time Polling Engine</span>
                <span className="text-[11px] text-slate-500">Reactive 60s polling loop with client heartbeat</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-seismic-950/80 px-4 sm:px-6 lg:px-8 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
            <span className="text-slate-400 font-medium">EarthPulse Intelligence</span>
            <span>• BDA Lab Project</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Node.js Backend & MongoDB Telemetry Stream • Live USGS Feed
          </div>
        </div>
      </footer>

    </div>
  );
}
