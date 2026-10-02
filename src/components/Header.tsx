import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Square,
  Play,
} from 'lucide-react';
import { NivaraLogo } from './NivaraLogo';
import { useAppStore } from '../store/useAppStore';
import { formatISTTime, formatISTDate } from '../utils/data';

export const Header: React.FC = () => {
  const { settings, updateSettings, searchQuery, setSearchQuery } = useAppStore();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex items-center gap-4 px-4 py-2.5 border-b border-slate-700/60 bg-navy-900 flex-shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2.5 min-w-[180px]">
        <NivaraLogo size={28} />
        <div>
          <div className="text-sm font-bold text-white tracking-wider">NIVARA</div>
          <div className="text-[9px] text-slate-400 tracking-widest uppercase">Transaction Intelligence</div>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search transaction ID, customer or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-navy-800 border border-slate-700/60 rounded text-xs text-slate-300 placeholder-slate-600 pl-8 pr-3 py-1.5 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Demo badge */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 processing-pulse" />
          <span className="text-[10px] font-mono font-semibold text-amber-400 tracking-wider">DEMO MODE</span>
        </div>

        {/* Clock */}
        <div className="text-right">
          <div className="text-xs font-mono text-slate-200 tracking-wider">
            IST {formatISTTime(now)}
          </div>
          <div className="text-[10px] text-slate-500">{formatISTDate(now)}</div>
        </div>

        {/* Stop/Resume monitoring */}
        {settings.isMonitoring ? (
          <button
            onClick={() => updateSettings({ isMonitoring: false })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors"
          >
            <Square size={10} />
            STOP MONITORING
          </button>
        ) : (
          <button
            onClick={() => updateSettings({ isMonitoring: true })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-semibold bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-colors"
          >
            <Play size={10} />
            RESUME
          </button>
        )}

        {/* Notifications */}
        <button className="relative p-1.5 rounded hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors">
          <Bell size={16} />
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-red-400" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-[11px] font-bold text-white">
            SV
          </div>
          <div className="hidden xl:block">
            <div className="text-xs font-medium text-slate-200">Shri Vishnu</div>
            <div className="text-[10px] text-slate-500">Security Analyst</div>
          </div>
          <ChevronDown size={12} className="text-slate-500" />
        </div>
      </div>
    </header>
  );
};
