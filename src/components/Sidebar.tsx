import React from 'react';
import {
  Activity,
  List,
  Clock,
  BarChart2,
  ShieldCheck,
  FileText,
  Settings,
  CheckCircle,
  Cpu,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { NivaraLogo } from './NivaraLogo';

const NAV_ITEMS = [
  { id: 'overview', icon: Activity, label: 'Overview' },
  { id: 'live', icon: Cpu, label: 'Live Transactions' },
  { id: 'history', icon: Clock, label: 'Transaction History' },
  { id: 'analytics', icon: BarChart2, label: 'Risk Analytics' },
  { id: 'verification', icon: ShieldCheck, label: 'Verification Center' },
  { id: 'reports', icon: FileText, label: 'Reports' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export const Sidebar: React.FC = () => {
  const { activeNav, setActiveNav, settings } = useAppStore();

  return (
    <aside className="flex flex-col w-[180px] flex-shrink-0 bg-navy-900 border-r border-slate-700/60 overflow-hidden">
      <nav className="flex-1 py-3 overflow-y-auto">
        <div className="px-3 mb-3">
          <span className="text-[9px] uppercase tracking-widest text-slate-600 font-semibold">Navigation</span>
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-all ${
                isActive
                  ? 'bg-blue-600/20 text-blue-300 border-r-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-blue-400' : ''} />
              <span className={`${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
              {item.id === 'live' && settings.isMonitoring && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 processing-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-slate-700/60 space-y-3">
        <div>
          <div className="text-[9px] uppercase tracking-widest text-slate-600 font-semibold mb-1.5">System Status</div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-[10px] text-slate-400">All systems operational</span>
          </div>
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-widest text-slate-600 font-semibold mb-1.5">Monitoring</div>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${settings.isMonitoring ? 'bg-green-400 processing-pulse' : 'bg-slate-500'}`} />
            <span className="text-[10px] text-slate-400">
              {settings.isMonitoring ? 'Live simulation active' : 'Monitoring paused'}
            </span>
          </div>
        </div>
        <div className="pt-1 border-t border-slate-700/40">
          <div className="text-[9px] text-slate-600">Demo Environment</div>
          <div className="text-[9px] text-slate-700">Simulation only</div>
        </div>
      </div>
    </aside>
  );
};
