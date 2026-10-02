import React from 'react';
import { Download } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { StatusPill } from '../components/StatusPill';
import { formatISTTime, formatINRFull } from '../utils/data';

export const ReportsView: React.FC = () => {
  const { transactions, stats } = useAppStore();

  const reportTxns = transactions.filter(
    (t) =>
      t.isSuspicious ||
      t.status === 'blocked' ||
      t.status === 'action_required' ||
      t.status === 'otp_sent'
  );

  const downloadCSV = () => {
    const headers = [
      'Transaction ID',
      'Customer',
      'Amount (INR)',
      'Recipient',
      'Current Location',
      'Previous Location',
      'Distance (km)',
      'Time Difference (min)',
      'Timestamp (IST)',
      'Reason',
      'OTP Result',
      'Final Status',
    ];

    const escape = (v: string | number) => {
      const s = String(v);
      return s.includes(',') ? `"${s}"` : s;
    };

    const rows = reportTxns.map((t) =>
      [
        t.id,
        t.customerName,
        t.amount,
        t.recipientMasked,
        t.city.name,
        t.previousTransaction?.city.name ?? 'N/A',
        t.distanceKm ?? 'N/A',
        t.timeDiffMinutes ?? 'N/A',
        formatISTTime(t.timestamp),
        t.fraudReason ?? 'N/A',
        t.status === 'blocked'
          ? 'FAILED'
          : t.status === 'approved' || t.status === 'otp_verified'
          ? 'VERIFIED'
          : 'PENDING',
        t.status.toUpperCase().replace('_', ' '),
      ].map(escape)
    );

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nivara-security-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 h-full overflow-y-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Security Report
        </h2>
        <button
          onClick={downloadCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-blue-600/20 text-blue-400 border border-blue-600/30 hover:bg-blue-600/30 transition-colors"
        >
          <Download size={12} /> Download CSV
        </button>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-amber-900/20 border border-amber-700/30 rounded p-3">
          <div className="text-xl font-bold font-mono text-amber-400">{stats.actionRequired}</div>
          <div className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">Action Required</div>
        </div>
        <div className="bg-orange-900/20 border border-orange-700/30 rounded p-3">
          <div className="text-xl font-bold font-mono text-orange-400">{stats.otpSent}</div>
          <div className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">OTP Sent</div>
        </div>
        <div className="bg-red-900/20 border border-red-700/30 rounded p-3">
          <div className="text-xl font-bold font-mono text-red-400">{stats.otpFailed}</div>
          <div className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">OTP Failed</div>
        </div>
        <div className="bg-red-900/30 border border-red-700/40 rounded p-3">
          <div className="text-xl font-bold font-mono text-red-300">{stats.blocked}</div>
          <div className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">Blocked</div>
        </div>
      </div>

      {/* Report table */}
      <div className="bg-navy-900 border border-slate-700/50 rounded overflow-auto">
        <table className="w-full text-left" style={{ minWidth: 700 }}>
          <thead className="sticky top-0 bg-navy-900 z-10">
            <tr className="border-b border-slate-700/50">
              {[
                'TXN ID',
                'Customer',
                'Amount',
                'Prev. Location',
                'Current',
                'Distance',
                'Time Gap',
                'OTP',
                'Status',
              ].map((h) => (
                <th
                  key={h}
                  className="py-2 px-3 text-[9px] uppercase tracking-wider text-slate-600 font-semibold whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {reportTxns.map((t) => (
              <tr key={t.id} className="hover:bg-slate-800/20 transition-colors">
                <td className="py-1.5 px-3 text-[10px] font-mono text-slate-400">{t.id}</td>
                <td className="py-1.5 px-3 text-xs text-slate-200">{t.customerName}</td>
                <td className="py-1.5 px-3 text-xs font-mono text-white">{formatINRFull(t.amount)}</td>
                <td className="py-1.5 px-3 text-[10px] text-amber-400">
                  {t.previousTransaction?.city.name ?? '—'}
                </td>
                <td className="py-1.5 px-3 text-[10px] text-red-400">{t.city.name}</td>
                <td className="py-1.5 px-3 text-[10px] font-mono text-slate-300">
                  {t.distanceKm != null ? `${t.distanceKm} km` : '—'}
                </td>
                <td className="py-1.5 px-3 text-[10px] font-mono text-slate-300">
                  {t.timeDiffMinutes != null ? `${t.timeDiffMinutes} min` : '—'}
                </td>
                <td className="py-1.5 px-3 text-[10px] font-mono">
                  {t.status === 'blocked' ? (
                    <span className="text-red-400">FAILED</span>
                  ) : t.status === 'approved' || t.status === 'otp_verified' ? (
                    <span className="text-green-400">VERIFIED</span>
                  ) : (
                    <span className="text-amber-400">PENDING</span>
                  )}
                </td>
                <td className="py-1.5 px-3">
                  <StatusPill status={t.status} small />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reportTxns.length === 0 && (
          <div className="text-center py-12 text-slate-700 text-xs">
            No suspicious transactions detected yet
          </div>
        )}
      </div>
    </div>
  );
};
