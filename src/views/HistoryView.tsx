import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { StatusPill } from '../components/StatusPill';
import { formatISTTime, formatINRFull } from '../utils/data';
import { TransactionStatus } from '../types';
import { Search } from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { transactions } = useAppStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');
  const [sort, setSort] = useState<'newest' | 'amount'>('newest');

  const filtered = transactions
    .filter((t) => {
      const matchSearch =
        !search ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.customerName.toLowerCase().includes(search.toLowerCase()) ||
        t.city.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) =>
      sort === 'newest'
        ? b.timestamp.getTime() - a.timestamp.getTime()
        : b.amount - a.amount
    );

  const STATUS_FILTERS: Array<{ value: TransactionStatus | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'approved', label: 'Approved' },
    { value: 'action_required', label: 'Action Required' },
    { value: 'otp_sent', label: 'OTP Sent' },
    { value: 'blocked', label: 'Blocked' },
  ];

  return (
    <div className="flex flex-col h-full gap-3 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Transaction History</h2>
        <div className="text-[10px] text-slate-600">{filtered.length} records</div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="relative">
          <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-navy-800 border border-slate-700/60 rounded text-xs text-slate-300 placeholder-slate-600 pl-8 pr-3 py-1.5 focus:outline-none focus:border-blue-500/50 w-52"
          />
        </div>

        <div className="flex gap-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-2.5 py-1 rounded text-[10px] font-medium transition-colors border ${
                statusFilter === f.value
                  ? 'bg-blue-600/20 text-blue-300 border-blue-600/40'
                  : 'bg-navy-800 text-slate-400 border-slate-700/50 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as 'newest' | 'amount')}
          className="bg-navy-800 border border-slate-700/60 rounded text-[10px] text-slate-400 px-2 py-1 focus:outline-none ml-auto"
        >
          <option value="newest">Newest First</option>
          <option value="amount">Highest Amount</option>
        </select>
      </div>

      <div className="flex-1 overflow-auto bg-navy-900 border border-slate-700/50 rounded">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-navy-900 z-10">
            <tr className="border-b border-slate-700/50">
              {['TXN ID', 'Customer', 'Amount', 'To', 'Location', 'Time (IST)', 'Device', 'Status'].map((h) => (
                <th key={h} className="py-2 px-3 text-[9px] uppercase tracking-wider text-slate-600 font-semibold whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-1.5 px-3 text-[10px] font-mono text-slate-400">{t.id}</td>
                <td className="py-1.5 px-3 text-xs text-slate-200">{t.customerName}</td>
                <td className="py-1.5 px-3 text-xs font-mono text-white">{formatINRFull(t.amount)}</td>
                <td className="py-1.5 px-3 text-[10px] font-mono text-slate-500">{t.recipientMasked}</td>
                <td className="py-1.5 px-3 text-[10px] text-slate-400">{t.city.name}</td>
                <td className="py-1.5 px-3 text-[10px] font-mono text-slate-500">{formatISTTime(t.timestamp)}</td>
                <td className="py-1.5 px-3 text-[10px] text-slate-500">{t.device}</td>
                <td className="py-1.5 px-3"><StatusPill status={t.status} small /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-700 text-xs">No transactions found</div>
        )}
      </div>
    </div>
  );
};
