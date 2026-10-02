import React from 'react';
import {
  Smartphone, Monitor, Tablet, MapPin, Clock,
  AlertTriangle, CheckCircle,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { StatusPill } from './StatusPill';
import { SecurityTimeline } from './SecurityTimeline';
import { RouteVisualization } from './RouteVisualization';
import { OTPVerification } from './OTPVerification';
import { formatISTTime, formatINRFull } from '../utils/data';

const DEVICE_ICONS: Record<string, React.ReactNode> = {
  Mobile: <Smartphone size={11} />,
  Desktop: <Monitor size={11} />,
  Tablet: <Tablet size={11} />,
};

const SectionHeader: React.FC<{ title: string; icon?: React.ReactNode }> = ({ title, icon }) => (
  <div className="px-3 py-1.5 border-b border-slate-700/40 flex items-center gap-1.5">
    {icon}
    <span className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold">{title}</span>
  </div>
);

export const TransactionDetails: React.FC = () => {
  const { selectedTransaction, settings } = useAppStore();

  if (!selectedTransaction) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-700">
        <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center">
          <MapPin size={14} />
        </div>
        <div className="text-xs">Select a transaction to inspect</div>
      </div>
    );
  }

  const txn = selectedTransaction;
  const isSuspicious = txn.isSuspicious;
  const showOTP =
    txn.status === 'otp_sent' ||
    txn.status === 'otp_verified' ||
    txn.status === 'blocked';
  const showRoute = !!txn.previousTransaction;
  const ruleTriggered =
    isSuspicious &&
    txn.distanceKm !== undefined &&
    txn.timeDiffMinutes !== undefined &&
    txn.distanceKm > settings.distanceThresholdKm &&
    txn.timeDiffMinutes < settings.timeThresholdMinutes;

  return (
    <div className="flex flex-col gap-2 overflow-y-auto h-full pr-0.5">

      {/* Transaction card */}
      <div className="bg-navy-800 border border-slate-700/50 rounded overflow-hidden flex-shrink-0">
        <SectionHeader title="Transaction Details" />
        <div className="px-3 py-2.5 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[10px] font-mono text-slate-500">{txn.id}</div>
              <div className="text-sm font-bold text-white mt-0.5 truncate">{txn.customerName}</div>
              <div className="text-base font-bold text-white font-mono">{formatINRFull(txn.amount)}</div>
            </div>
            <div className="flex-shrink-0">
              <StatusPill status={txn.status} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]">
            <div>
              <span className="text-slate-600">To: </span>
              <span className="font-mono text-slate-400">{txn.recipientMasked}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-slate-600">Device: </span>
              <span className="text-slate-400 flex items-center gap-0.5">
                {DEVICE_ICONS[txn.device]} {txn.device}
              </span>
            </div>
            <div className="flex items-center gap-1 col-span-2">
              <MapPin size={9} className="text-slate-600 flex-shrink-0" />
              <span className="text-slate-300">{txn.city.name}, {txn.city.state}</span>
              <span className="text-slate-600 mx-1">·</span>
              <Clock size={9} className="text-slate-600 flex-shrink-0" />
              <span className="text-slate-400 font-mono">{formatISTTime(txn.timestamp)} IST</span>
            </div>
          </div>

          {txn.previousTransaction && (
            <div className="border-t border-slate-700/40 pt-2">
              <div className="text-[9px] text-slate-600 uppercase tracking-wider mb-1">
                Previous Transaction
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px]">
                <span className="flex items-center gap-1 text-amber-400">
                  <MapPin size={8} />
                  {txn.previousTransaction.city.name}
                </span>
                <span className="text-slate-600">·</span>
                <span className="font-mono text-slate-400">
                  {formatISTTime(txn.previousTransaction.timestamp)} IST
                </span>
                <span className="text-slate-600">·</span>
                <span className="font-mono text-slate-300">
                  {formatINRFull(txn.previousTransaction.amount)}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-500">{txn.previousTransaction.device}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fraud alert */}
      {isSuspicious && txn.status !== 'approved' && (
        <div className="bg-red-950/40 border border-red-700/40 rounded overflow-hidden flex-shrink-0">
          <div className="px-3 py-1.5 border-b border-red-800/30 flex items-center gap-1.5">
            <AlertTriangle size={10} className="text-red-400" />
            <span className="text-[9px] uppercase tracking-widest text-red-400 font-semibold">
              Suspicious Transaction
            </span>
          </div>
          <div className="px-3 py-2.5 space-y-2">
            <div className="text-[10px] text-slate-300">
              {txn.fraudReason || 'Location changed too quickly'}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {txn.distanceKm !== undefined && (
                <div>
                  <div className="text-[9px] text-slate-600 uppercase tracking-wider">Distance</div>
                  <div className="text-sm font-bold font-mono text-red-400">
                    {txn.distanceKm > 0 ? `${txn.distanceKm.toLocaleString()} km` : 'Same city'}
                  </div>
                </div>
              )}
              {txn.timeDiffMinutes !== undefined && (
                <div>
                  <div className="text-[9px] text-slate-600 uppercase tracking-wider">Time Difference</div>
                  <div className="text-sm font-bold font-mono text-red-400">
                    {txn.timeDiffMinutes} min
                  </div>
                </div>
              )}
            </div>
            {ruleTriggered && (
              <div className="text-[9px] font-mono bg-red-950/60 border border-red-800/40 rounded px-2 py-1 text-red-300">
                Rule: Distance &gt; {settings.distanceThresholdKm} km AND Time &lt; {settings.timeThresholdMinutes} min
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success state */}
      {!isSuspicious && txn.status === 'approved' && (
        <div className="bg-green-950/30 border border-green-700/30 rounded overflow-hidden flex-shrink-0">
          <div className="px-3 py-2.5 flex items-center gap-2">
            <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
            <div>
              <div className="text-[11px] font-semibold text-green-400">Transaction Approved</div>
              <div className="text-[9px] text-slate-500 mt-0.5">
                No abnormal location velocity detected.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP */}
      {showOTP && (
        <div className="bg-navy-800 border border-orange-700/30 rounded overflow-hidden flex-shrink-0">
          <SectionHeader title="OTP Verification" icon={<div className="w-1.5 h-1.5 rounded-full bg-orange-400 processing-pulse" />} />
          <div className="px-3 py-2.5">
            <OTPVerification transaction={txn} />
          </div>
        </div>
      )}

      {/* Route visualization */}
      {showRoute && (
        <div className="flex-shrink-0">
          <RouteVisualization transaction={txn} />
        </div>
      )}

      {/* Security Timeline */}
      {txn.checkTimeline && txn.checkTimeline.length > 0 && (
        <div className="bg-navy-800 border border-slate-700/50 rounded overflow-hidden flex-shrink-0">
          <SectionHeader title="Security Timeline" />
          <div className="px-3 py-2.5">
            <SecurityTimeline events={txn.checkTimeline} />
          </div>
        </div>
      )}

      {/* Active Rules */}
      <div className="bg-navy-800 border border-slate-700/50 rounded overflow-hidden flex-shrink-0">
        <SectionHeader title="Active Fraud Rules" />
        <div className="px-3 py-2.5">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-[9px] text-slate-600 uppercase tracking-wider">Distance</div>
              <div className="text-xs font-mono text-slate-300">&gt; {settings.distanceThresholdKm} km</div>
            </div>
            <div className="text-slate-700 font-bold">AND</div>
            <div>
              <div className="text-[9px] text-slate-600 uppercase tracking-wider">Time Gap</div>
              <div className="text-xs font-mono text-slate-300">&lt; {settings.timeThresholdMinutes} min</div>
            </div>
            <div className="ml-auto">
              <div className="text-[9px] text-slate-600 uppercase tracking-wider">Outcome</div>
              <div className="text-xs font-mono text-orange-400">OTP Trigger</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
