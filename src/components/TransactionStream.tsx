import React, { useRef, useEffect, useState } from 'react';
import { Smartphone, Monitor, Tablet, MapPin } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Transaction } from '../types';
import { StatusPill } from './StatusPill';
import { formatISTTime, formatINR } from '../utils/data';

const DEVICE_ICONS: Record<string, React.ReactNode> = {
  Mobile: <Smartphone size={11} />,
  Desktop: <Monitor size={11} />,
  Tablet: <Tablet size={11} />,
};

const TransactionRow: React.FC<{
  txn: Transaction;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ txn, index, isSelected, onSelect }) => {
  const isNew = txn.status === 'processing';
  const isProcessing = txn.status === 'processing' || txn.status === 'otp_sent';

  return (
    <tr
      className={`cursor-pointer transition-all duration-300 ${
        isNew ? 'transaction-row-enter' : ''
      } ${
        isSelected
          ? 'bg-blue-600/15 border-l-2 border-blue-500'
          : txn.status === 'processing'
          ? 'bg-amber-500/5'
          : txn.isSuspicious && (txn.status === 'blocked' || txn.status === 'action_required')
          ? 'bg-red-500/5 hover:bg-red-500/10'
          : 'hover:bg-slate-800/40'
      }`}
      onClick={onSelect}
    >
      <td className="pl-3 py-2 text-[10px] text-slate-600 font-mono">{index + 1}</td>
      <td className="py-2 text-[10px] font-mono text-slate-400">{txn.id}</td>
      <td className="py-2">
        <div className="text-xs font-medium text-slate-200">{txn.customerName}</div>
      </td>
      <td className="py-2">
        <div className="text-xs font-semibold text-white font-mono">{formatINR(txn.amount)}</div>
      </td>
      <td className="py-2">
        <div className="text-[10px] text-slate-500 font-mono">{txn.recipientMasked}</div>
      </td>
      <td className="py-2">
        <div className="flex items-center gap-1 text-[10px] text-slate-400">
          <MapPin size={9} />
          {txn.city.name}
        </div>
      </td>
      <td className="py-2 text-[10px] font-mono text-slate-500">
        {formatISTTime(txn.timestamp)}
      </td>
      <td className="py-2">
        <div className={`flex items-center gap-1 text-[10px] text-slate-400 ${isProcessing ? 'processing-pulse' : ''}`}>
          {DEVICE_ICONS[txn.device]}
          {txn.device}
        </div>
      </td>
      <td className="py-2 pr-3">
        <StatusPill status={txn.status} small />
      </td>
    </tr>
  );
};

export const TransactionStream: React.FC = () => {
  const { transactions, selectedTransaction, setSelectedTransaction, searchQuery } = useAppStore();
  const tableRef = useRef<HTMLDivElement>(null);

  const filtered = searchQuery
    ? transactions.filter(
        (t) =>
          t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.city.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : transactions;

  const visible = filtered.slice(0, 50);

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-navy-900 border border-slate-700/50 rounded overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Live Transaction Stream</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 processing-pulse" />
        </div>
        <div className="text-[10px] text-slate-600">{transactions.length} total</div>
      </div>
      <div ref={tableRef} className="overflow-y-auto flex-1">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-navy-900 z-10">
            <tr className="border-b border-slate-700/50">
              <th className="pl-3 py-1.5 text-[9px] uppercase tracking-wider text-slate-600 font-semibold w-8">#</th>
              <th className="py-1.5 text-[9px] uppercase tracking-wider text-slate-600 font-semibold w-28">TXN ID</th>
              <th className="py-1.5 text-[9px] uppercase tracking-wider text-slate-600 font-semibold">Customer</th>
              <th className="py-1.5 text-[9px] uppercase tracking-wider text-slate-600 font-semibold">Amount</th>
              <th className="py-1.5 text-[9px] uppercase tracking-wider text-slate-600 font-semibold">To</th>
              <th className="py-1.5 text-[9px] uppercase tracking-wider text-slate-600 font-semibold">Location</th>
              <th className="py-1.5 text-[9px] uppercase tracking-wider text-slate-600 font-semibold">Time (IST)</th>
              <th className="py-1.5 text-[9px] uppercase tracking-wider text-slate-600 font-semibold">Device</th>
              <th className="py-1.5 pr-3 text-[9px] uppercase tracking-wider text-slate-600 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {visible.map((txn, i) => (
              <TransactionRow
                key={txn.id}
                txn={txn}
                index={i}
                isSelected={selectedTransaction?.id === txn.id}
                onSelect={() => setSelectedTransaction(txn)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
