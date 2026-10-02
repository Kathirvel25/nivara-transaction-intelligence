import React from 'react';
import { useAppStore } from '../store/useAppStore';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useAppStore();

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">Settings</h2>

      <div className="max-w-lg space-y-4">
        {/* Fraud Rules */}
        <div className="bg-navy-800 border border-slate-700/50 rounded overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-700/40">
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold">
              Fraud Detection Rules
            </span>
          </div>
          <div className="px-4 py-3 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Distance Threshold
                </label>
                <span className="text-xs font-mono text-white bg-navy-700 px-2 py-0.5 rounded">
                  {settings.distanceThresholdKm} km
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="25"
                value={settings.distanceThresholdKm}
                onChange={(e) => updateSettings({ distanceThresholdKm: +e.target.value })}
                className="w-full accent-blue-500 h-1.5"
              />
              <div className="flex justify-between text-[9px] text-slate-700 mt-1">
                <span>50 km</span>
                <span>500 km</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Time Threshold
                </label>
                <span className="text-xs font-mono text-white bg-navy-700 px-2 py-0.5 rounded">
                  {settings.timeThresholdMinutes} min
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={settings.timeThresholdMinutes}
                onChange={(e) => updateSettings({ timeThresholdMinutes: +e.target.value })}
                className="w-full accent-blue-500 h-1.5"
              />
              <div className="flex justify-between text-[9px] text-slate-700 mt-1">
                <span>5 min</span>
                <span>120 min</span>
              </div>
            </div>

            <div className="bg-navy-700/50 border border-slate-700/40 rounded px-3 py-2 text-[10px] font-mono text-slate-400">
              IF distance &gt; {settings.distanceThresholdKm} km AND time &lt; {settings.timeThresholdMinutes} min → ACTION REQUIRED + OTP
            </div>
          </div>
        </div>

        {/* Monitoring */}
        <div className="bg-navy-800 border border-slate-700/50 rounded overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-700/40">
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold">
              Monitoring Configuration
            </span>
          </div>
          <div className="px-4 py-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5">
                  Min Interval (ms)
                </label>
                <input
                  type="number"
                  min="1000"
                  max="10000"
                  step="500"
                  value={settings.intervalMinMs}
                  onChange={(e) => updateSettings({ intervalMinMs: +e.target.value })}
                  className="bg-navy-700 border border-slate-600 rounded px-2 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500 w-full"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5">
                  Max Interval (ms)
                </label>
                <input
                  type="number"
                  min="1000"
                  max="20000"
                  step="500"
                  value={settings.intervalMaxMs}
                  onChange={(e) => updateSettings({ intervalMaxMs: +e.target.value })}
                  className="bg-navy-700 border border-slate-600 rounded px-2 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500 w-full"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Monitoring Status</div>
                <div className="text-[9px] text-slate-600 mt-0.5">
                  {settings.isMonitoring ? 'Auto-generating transactions' : 'Stream paused'}
                </div>
              </div>
              <button
                onClick={() => updateSettings({ isMonitoring: !settings.isMonitoring })}
                className={`px-4 py-1.5 rounded text-[11px] font-bold border transition-colors ${
                  settings.isMonitoring
                    ? 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20'
                    : 'bg-slate-700/50 text-slate-400 border-slate-600 hover:bg-slate-700'
                }`}
              >
                {settings.isMonitoring ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Demo info */}
        <div className="bg-navy-800 border border-amber-700/20 rounded overflow-hidden">
          <div className="px-3 py-2 border-b border-amber-700/20">
            <span className="text-[9px] uppercase tracking-widest text-amber-500/70 font-semibold">
              Demo Environment
            </span>
          </div>
          <div className="px-4 py-3 space-y-1.5 text-[10px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Mode</span>
              <span className="text-amber-400 font-mono">DEMO (Always On)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Bank Connection</span>
              <span className="text-slate-600">None — Simulation only</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">SMS Service</span>
              <span className="text-slate-600">None — OTP is simulated</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Location Tracking</span>
              <span className="text-slate-600">None — Coordinates are demo data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
