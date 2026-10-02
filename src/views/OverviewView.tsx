import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Activity, Shield, AlertTriangle, CheckCircle, Ban, MessageSquare } from 'lucide-react';
import { formatINRFull, formatISTTime } from '../utils/data';

export const OverviewView: React.FC = () => {
  const { stats, settings, transactions } = useAppStore();
  const suspRate =
    stats.total > 0
      ? (((stats.actionRequired + stats.blocked) / stats.total) * 100).toFixed(1)
      : '0.0';

  // Unique recent customers
  const recentCustomers = Array.from(
    transactions.reduce((map, t) => {
      if (!map.has(t.customerId)) map.set(t.customerId, t);
      return map;
    }, new Map<string, typeof transactions[0]>())
  ).slice(0, 8);

  return (
    <div className="p-4 h-full overflow-y-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">System Overview</h2>
        <div
          className={`flex items-center gap-1.5 text-[10px] font-semibold ${
            settings.isMonitoring ? 'text-green-400' : 'text-slate-500'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              settings.isMonitoring ? 'bg-green-400 processing-pulse' : 'bg-slate-500'
            }`}
          />
          {settings.isMonitoring ? 'LIVE MONITORING' : 'MONITORING PAUSED'}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Total Transactions', value: stats.total, Icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-700/30' },
          { label: 'Approved', value: stats.approved, Icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-700/30' },
          { label: 'Suspicious Rate', value: suspRate + '%', Icon: Shield, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-700/30' },
          { label: 'Action Required', value: stats.actionRequired, Icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-700/30' },
          { label: 'Blocked', value: stats.blocked, Icon: Ban, color: 'text-red-400', bg: 'bg-red-500/10 border-red-700/30' },
          { label: 'OTP Verified', value: stats.otpVerified, Icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-700/30' },
        ].map(({ label, value, Icon, color, bg }) => (
          <div key={label} className={`border rounded p-3 ${bg}`}>
            <div className="flex items-center gap-2 mb-1.5">
              <Icon size={13} className={color} />
              <span className="text-[9px] uppercase tracking-wider text-slate-500">{label}</span>
            </div>
            <div className={`text-xl font-bold font-mono ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-navy-800 border border-slate-700/50 rounded p-3">
          <div className="text-[9px] uppercase tracking-wider text-slate-600 mb-2">System Configuration</div>
          <div className="grid grid-cols-2 gap-y-1.5 text-[10px]">
            <span className="text-slate-600">Environment</span>
            <span className="text-amber-400">Demo / Simulation</span>
            <span className="text-slate-600">Bank Connection</span>
            <span className="text-slate-500">Not connected</span>
            <span className="text-slate-600">Fraud Engine</span>
            <span className="text-green-400">Active</span>
            <span className="text-slate-600">Distance Rule</span>
            <span className="text-slate-300">&gt; {settings.distanceThresholdKm} km</span>
            <span className="text-slate-600">Time Rule</span>
            <span className="text-slate-300">&lt; {settings.timeThresholdMinutes} min</span>
            <span className="text-slate-600">Interval</span>
            <span className="text-slate-300">{settings.intervalMinMs / 1000}–{settings.intervalMaxMs / 1000}s</span>
          </div>
        </div>

        <div className="bg-navy-800 border border-slate-700/50 rounded p-3">
          <div className="text-[9px] uppercase tracking-wider text-slate-600 mb-2">Recent Customers</div>
          <div className="space-y-1">
            {recentCustomers.map(([id, t]: [string, typeof transactions[0]]) => (
              <div key={id} className="flex items-center justify-between text-[10px] py-0.5">
                <span className="text-slate-300 truncate">{t.customerName}</span>
                <span
                  className={`text-[9px] font-mono ml-2 flex-shrink-0 ${
                    t.status === 'approved'
                      ? 'text-green-400'
                      : t.status === 'blocked'
                      ? 'text-red-400'
                      : 'text-amber-400'
                  }`}
                >
                  {t.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            ))}
            {recentCustomers.length === 0 && (
              <div className="text-slate-700 text-[10px]">No data yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
