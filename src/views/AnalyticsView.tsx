import React from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useAppStore } from '../store/useAppStore';

export const AnalyticsView: React.FC = () => {
  const { stats, transactions } = useAppStore();

  const cityData = Object.entries(
    transactions.reduce((acc, t) => {
      acc[t.city.name] = (acc[t.city.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  const statusData = [
    { name: 'Approved', value: stats.approved, color: '#22c55e' },
    { name: 'Action Req.', value: stats.actionRequired, color: '#f59e0b' },
    { name: 'Blocked', value: stats.blocked, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  const otpData = [
    { name: 'Verified', value: stats.otpVerified, color: '#22c55e' },
    { name: 'Failed', value: stats.otpFailed, color: '#ef4444' },
    {
      name: 'Pending',
      value: Math.max(0, stats.otpSent - stats.otpVerified - stats.otpFailed),
      color: '#f59e0b',
    },
  ].filter((d) => d.value > 0);

  const volumeData = Array.from({ length: 8 }, (_, i) => {
    const bucket = transactions.slice(i * 5, i * 5 + 5);
    return {
      t: `${i * 5 + 1}–${i * 5 + 5}`,
      safe: bucket.filter((t) => !t.isSuspicious).length,
      suspicious: bucket.filter((t) => t.isSuspicious).length,
    };
  });

  const suspiciousRate =
    stats.total > 0
      ? (((stats.actionRequired + stats.blocked) / stats.total) * 100).toFixed(1)
      : '0.0';

  const tooltipStyle = {
    contentStyle: {
      background: '#0a1535',
      border: '1px solid #1e2a3a',
      fontSize: 10,
      borderRadius: 4,
    },
    labelStyle: { color: '#94a3b8' },
  };

  return (
    <div className="p-4 h-full overflow-y-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Risk Analytics</h2>
        <div className="text-[10px] text-slate-600">Based on current session</div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-2">
        {[
          { label: 'Total', value: stats.total, color: 'text-blue-400' },
          { label: 'Approved', value: stats.approved, color: 'text-green-400' },
          { label: 'Action Req.', value: stats.actionRequired, color: 'text-amber-400' },
          { label: 'Blocked', value: stats.blocked, color: 'text-red-400' },
          { label: 'Susp. Rate', value: suspiciousRate + '%', color: 'text-orange-400' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-navy-800 border border-slate-700/50 rounded p-2.5">
            <div className={`text-lg font-bold font-mono ${kpi.color}`}>{kpi.value}</div>
            <div className="text-[9px] text-slate-600 uppercase tracking-wider mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Volume */}
        <div className="bg-navy-800 border border-slate-700/50 rounded p-3">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
            Transaction Volume (Safe vs Suspicious)
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={volumeData} barGap={2} barCategoryGap="30%">
              <XAxis dataKey="t" tick={{ fontSize: 8, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 8, fill: '#64748b' }} width={20} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="safe" fill="#22c55e" name="Safe" radius={[2, 2, 0, 0]} />
              <Bar dataKey="suspicious" fill="#ef4444" name="Suspicious" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status distribution */}
        <div className="bg-navy-800 border border-slate-700/50 rounded p-3">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
            Status Distribution
          </div>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={130}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={55}
                  dataKey="value"
                >
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 9, color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-32 flex items-center justify-center text-slate-700 text-[10px]">
              No data yet
            </div>
          )}
        </div>

        {/* City chart */}
        <div className="bg-navy-800 border border-slate-700/50 rounded p-3">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
            City-wise Activity
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={cityData} layout="vertical" barCategoryGap="25%">
              <XAxis type="number" tick={{ fontSize: 8, fill: '#64748b' }} />
              <YAxis
                dataKey="name"
                type="category"
                width={72}
                tick={{ fontSize: 8, fill: '#94a3b8' }}
              />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 2, 2, 0]} name="Transactions" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* OTP outcomes */}
        <div className="bg-navy-800 border border-slate-700/50 rounded p-3">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
            OTP Outcomes
          </div>
          {otpData.length > 0 ? (
            <ResponsiveContainer width="100%" height={130}>
              <PieChart>
                <Pie
                  data={otpData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={55}
                  dataKey="value"
                >
                  {otpData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 9, color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-32 flex items-center justify-center text-slate-700 text-[10px]">
              No OTP data yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
