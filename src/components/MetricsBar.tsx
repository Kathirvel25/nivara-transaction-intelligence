import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { TrendingUp, CheckCircle, AlertTriangle, Ban, MessageSquare } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon, color, bg }) => (
  <div className={`flex-1 flex items-center gap-3 px-4 py-2.5 rounded border ${bg}`}>
    <div className={`p-1.5 rounded ${color}`}>{icon}</div>
    <div>
      <div className="text-lg font-bold text-white font-mono leading-none">
        {value.toLocaleString('en-IN')}
      </div>
      <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  </div>
);

export const MetricsBar: React.FC = () => {
  const { stats } = useAppStore();

  return (
    <div className="flex gap-2 px-4 py-2 flex-shrink-0">
      <MetricCard
        label="Total Transactions"
        value={stats.total}
        icon={<TrendingUp size={14} className="text-blue-400" />}
        color="bg-blue-500/10"
        bg="bg-navy-800 border-slate-700/50"
      />
      <MetricCard
        label="Approved"
        value={stats.approved}
        icon={<CheckCircle size={14} className="text-green-400" />}
        color="bg-green-500/10"
        bg="bg-navy-800 border-slate-700/50"
      />
      <MetricCard
        label="Action Required"
        value={stats.actionRequired}
        icon={<AlertTriangle size={14} className="text-amber-400" />}
        color="bg-amber-500/10"
        bg="bg-navy-800 border-amber-700/20"
      />
      <MetricCard
        label="Blocked"
        value={stats.blocked}
        icon={<Ban size={14} className="text-red-400" />}
        color="bg-red-500/10"
        bg="bg-navy-800 border-red-700/20"
      />
      <MetricCard
        label="OTP Sent"
        value={stats.otpSent}
        icon={<MessageSquare size={14} className="text-purple-400" />}
        color="bg-purple-500/10"
        bg="bg-navy-800 border-slate-700/50"
      />
    </div>
  );
};
