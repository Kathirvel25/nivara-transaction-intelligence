import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { StatusPill } from '../components/StatusPill';
import { OTPVerification } from '../components/OTPVerification';
import { formatISTTime, formatINRFull } from '../utils/data';

export const VerificationView: React.FC = () => {
  const { transactions, setSelectedTransaction } = useAppStore();
  const pendingOtp = transactions.filter(
    (t) => t.status === 'otp_sent' || t.status === 'action_required'
  );

  return (
    <div className="p-4 h-full overflow-y-auto space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Verification Center
        </h2>
        <div className="flex items-center gap-1.5">
          {pendingOtp.length > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 processing-pulse" />
          )}
          <div className="text-[10px] text-slate-600">{pendingOtp.length} pending</div>
        </div>
      </div>

      {pendingOtp.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-700">
          <div className="text-xs">No pending verifications</div>
          <div className="text-[10px]">New suspicious transactions will appear here</div>
        </div>
      )}

      <div className="space-y-3">
        {pendingOtp.map((t) => (
          <div
            key={t.id}
            className="bg-navy-800 border border-orange-700/30 rounded overflow-hidden cursor-pointer hover:border-orange-600/50 transition-colors"
            onClick={() => setSelectedTransaction(t)}
          >
            <div className="px-3 py-2 border-b border-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500">{t.id}</span>
                <span className="text-xs font-semibold text-slate-200">{t.customerName}</span>
              </div>
              <StatusPill status={t.status} small />
            </div>
            <div className="px-3 py-1.5 flex items-center gap-3 text-[10px] border-b border-slate-800/40">
              <span className="font-mono font-semibold text-white">{formatINRFull(t.amount)}</span>
              <span className="text-slate-600">→</span>
              <span className="text-slate-400 font-mono">{t.recipientMasked}</span>
              <span className="ml-auto text-slate-500">{t.city.name}</span>
              <span className="font-mono text-slate-600">{formatISTTime(t.timestamp)}</span>
            </div>
            {t.distanceKm !== undefined && t.timeDiffMinutes !== undefined && (
              <div className="px-3 py-1.5 flex gap-4 text-[10px] border-b border-slate-800/40 bg-red-950/20">
                <span className="text-slate-600">Distance: <span className="text-red-400 font-mono">{t.distanceKm} km</span></span>
                <span className="text-slate-600">Time gap: <span className="text-red-400 font-mono">{t.timeDiffMinutes} min</span></span>
              </div>
            )}
            <div className="px-3 py-2.5">
              <OTPVerification transaction={t} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
