import React from 'react';

export const CardSkeleton = () => (
  <div className="glass-panel p-6 rounded-2xl animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-4 w-28 bg-slate-800 rounded"></div>
      <div className="h-9 w-9 bg-slate-800 rounded-lg"></div>
    </div>
    <div className="h-9 w-36 bg-slate-800 rounded mb-2"></div>
    <div className="h-3.5 w-20 bg-slate-800/60 rounded"></div>
  </div>
);

export const ChartSkeleton = ({ height = "h-80" }) => (
  <div className={`glass-panel p-6 rounded-2xl animate-pulse flex flex-col ${height}`}>
    <div className="flex items-center justify-between mb-6">
      <div className="space-y-2">
        <div className="h-5 w-48 bg-slate-800 rounded"></div>
        <div className="h-3 w-64 bg-slate-800/60 rounded"></div>
      </div>
      <div className="h-8 w-24 bg-slate-800 rounded-lg"></div>
    </div>
    <div className="flex-1 flex items-end gap-3 pt-4">
      <div className="w-full bg-slate-800/40 rounded-t h-[40%]"></div>
      <div className="w-full bg-slate-800/40 rounded-t h-[65%]"></div>
      <div className="w-full bg-slate-800/40 rounded-t h-[85%]"></div>
      <div className="w-full bg-slate-800/40 rounded-t h-[50%]"></div>
      <div className="w-full bg-slate-800/40 rounded-t h-[70%]"></div>
      <div className="w-full bg-slate-800/40 rounded-t h-[35%]"></div>
      <div className="w-full bg-slate-800/40 rounded-t h-[90%]"></div>
      <div className="w-full bg-slate-800/40 rounded-t h-[60%]"></div>
      <div className="w-full bg-slate-800/40 rounded-t h-[45%]"></div>
      <div className="w-full bg-slate-800/40 rounded-t h-[20%]"></div>
    </div>
  </div>
);

export const TableSkeleton = () => (
  <div className="glass-panel p-6 rounded-2xl animate-pulse space-y-4">
    <div className="flex items-center justify-between pb-4 border-b border-slate-800">
      <div className="h-6 w-52 bg-slate-800 rounded"></div>
      <div className="h-8 w-32 bg-slate-800 rounded-lg"></div>
    </div>
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800/50">
        <div className="flex items-center gap-4">
          <div className="h-7 w-14 bg-slate-800 rounded-full"></div>
          <div className="space-y-1">
            <div className="h-4 w-64 bg-slate-800 rounded"></div>
            <div className="h-3 w-40 bg-slate-800/60 rounded"></div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="h-4 w-20 bg-slate-800 rounded"></div>
          <div className="h-4 w-24 bg-slate-800 rounded"></div>
          <div className="h-8 w-8 bg-slate-800 rounded-lg"></div>
        </div>
      </div>
    ))}
  </div>
);
