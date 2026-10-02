import { create } from 'zustand';
import { Transaction, AppStats, AppSettings } from '../types';

interface AppStore {
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  stats: AppStats;
  settings: AppSettings;
  activeNav: string;
  customerMap: Map<string, Transaction>;
  toasts: Toast[];
  searchQuery: string;

  setTransactions: (txns: Transaction[]) => void;
  addTransaction: (txn: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  setSelectedTransaction: (txn: Transaction | null) => void;
  setStats: (stats: Partial<AppStats>) => void;
  incrementStat: (key: keyof AppStats) => void;
  updateSettings: (s: Partial<AppSettings>) => void;
  setActiveNav: (nav: string) => void;
  setCustomerMap: (map: Map<string, Transaction>) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  setSearchQuery: (q: string) => void;
}

export interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

export const useAppStore = create<AppStore>((set) => ({
  transactions: [],
  selectedTransaction: null,
  stats: {
    total: 0,
    approved: 0,
    actionRequired: 0,
    blocked: 0,
    otpSent: 0,
    otpVerified: 0,
    otpFailed: 0,
  },
  settings: {
    distanceThresholdKm: 100,
    timeThresholdMinutes: 30,
    intervalMinMs: 3000,
    intervalMaxMs: 5000,
    isMonitoring: true,
    demoMode: true,
  },
  activeNav: 'live',
  customerMap: new Map(),
  toasts: [],
  searchQuery: '',

  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (txn) =>
    set((state) => ({
      transactions: [txn, ...state.transactions].slice(0, 200),
    })),
  updateTransaction: (id, updates) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
      selectedTransaction:
        state.selectedTransaction?.id === id
          ? { ...state.selectedTransaction, ...updates }
          : state.selectedTransaction,
    })),
  setSelectedTransaction: (txn) => set({ selectedTransaction: txn }),
  setStats: (partial) =>
    set((state) => ({ stats: { ...state.stats, ...partial } })),
  incrementStat: (key) =>
    set((state) => ({
      stats: { ...state.stats, [key]: state.stats[key] + 1 },
    })),
  updateSettings: (s) =>
    set((state) => ({ settings: { ...state.settings, ...s } })),
  setActiveNav: (nav) => set({ activeNav: nav }),
  setCustomerMap: (customerMap) => set({ customerMap }),
  addToast: (toast) => {
    const id = Date.now().toString();
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, toast.duration || 3500);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  setSearchQuery: (q) => set({ searchQuery: q }),
}));
