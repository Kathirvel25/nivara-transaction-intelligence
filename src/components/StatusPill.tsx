import React from 'react';
import { TransactionStatus } from '../types';

interface Props {
  status: TransactionStatus;
  small?: boolean;
}

const STATUS_CONFIG: Record<TransactionStatus, { label: string; classes: string; dot: string }> = {
  processing: {
    label: 'PROCESSING',
    classes: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    dot: 'bg-amber-400 processing-pulse',
  },
  approved: {
    label: 'APPROVED',
    classes: 'bg-green-500/10 text-green-400 border border-green-500/30',
    dot: 'bg-green-400',
  },
  action_required: {
    label: 'ACTION REQUIRED',
    classes: 'bg-red-500/10 text-red-400 border border-red-500/30',
    dot: 'bg-red-400',
  },
  otp_sent: {
    label: 'OTP SENT',
    classes: 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
    dot: 'bg-orange-400 processing-pulse',
  },
  otp_verified: {
    label: 'OTP VERIFIED',
    classes: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    dot: 'bg-blue-400',
  },
  blocked: {
    label: 'BLOCKED',
    classes: 'bg-red-900/30 text-red-300 border border-red-700/50',
    dot: 'bg-red-300',
  },
};

export const StatusPill: React.FC<Props> = ({ status, small }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-mono font-medium tracking-wide ${
        small ? 'text-[9px]' : 'text-[10px]'
      } ${cfg.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};
