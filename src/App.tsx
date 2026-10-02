import React, { useEffect, useCallback } from 'react';
import { useAppStore } from './store/useAppStore';
import { useMonitor } from './hooks/useMonitor';
import { generateInitialTransactions } from './utils/transactionEngine';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DemoToolbar } from './components/DemoToolbar';
import { ToastContainer } from './components/Toast';
import { LiveView } from './views/LiveView';
import { HistoryView } from './views/HistoryView';
import { AnalyticsView } from './views/AnalyticsView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import { OverviewView } from './views/OverviewView';
import { VerificationView } from './views/VerificationView';

const VIEWS: Record<string, React.FC> = {
  overview: OverviewView,
  live: LiveView,
  history: HistoryView,
  analytics: AnalyticsView,
  verification: VerificationView,
  reports: ReportsView,
  settings: SettingsView,
};

function App() {
  const {
    activeNav,
    settings,
    setTransactions,
    setStats,
    setCustomerMap,
    setSelectedTransaction,
  } = useAppStore();

  const { generateNow } = useMonitor();

  useEffect(() => {
    const { transactions, customerMap } = generateInitialTransactions(12, settings);
    setTransactions(transactions);
    setCustomerMap(customerMap);

    const approved = transactions.filter((t) => t.status === 'approved').length;
    const blocked = transactions.filter((t) => t.status === 'blocked').length;
    const actionRequired = transactions.filter(
      (t) => t.status === 'action_required' || t.status === 'otp_sent'
    ).length;
    const suspicious = transactions.filter((t) => t.isSuspicious).length;

    setStats({
      total: transactions.length,
      approved,
      blocked,
      actionRequired,
      otpSent: suspicious,
      otpVerified: 0,
      otpFailed: 0,
    });

    if (transactions.length > 0) {
      setSelectedTransaction(transactions[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = useCallback(() => {
    const currentSettings = useAppStore.getState().settings;
    const { transactions, customerMap } = generateInitialTransactions(12, currentSettings);
    setTransactions(transactions);
    setCustomerMap(customerMap);

    const approved = transactions.filter((t) => t.status === 'approved').length;
    const blocked = transactions.filter((t) => t.status === 'blocked').length;
    const actionRequired = transactions.filter(
      (t) => t.status === 'action_required' || t.status === 'otp_sent'
    ).length;
    const suspicious = transactions.filter((t) => t.isSuspicious).length;

    setStats({
      total: transactions.length,
      approved,
      blocked,
      actionRequired,
      otpSent: suspicious,
      otpVerified: 0,
      otpFailed: 0,
    });

    if (transactions.length > 0) setSelectedTransaction(transactions[0]);
  }, [setTransactions, setCustomerMap, setStats, setSelectedTransaction]);

  const ActiveView = VIEWS[activeNav] ?? LiveView;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#040c1f] text-slate-200">
      <Header />
      <DemoToolbar
        onGenerateSafe={() => generateNow('safe')}
        onGenerateSuspicious={() => generateNow('suspicious')}
        onReset={handleReset}
      />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-hidden flex flex-col">
          <ActiveView />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
