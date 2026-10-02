import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { generateTransaction } from '../utils/transactionEngine';
import { Transaction, CheckEvent } from '../types';
import { formatISTTime } from '../utils/data';

const STEP_DELAYS = [800, 600, 700, 500, 600, 500, 800, 600];

const CHECK_LABELS = [
  'Transaction received',
   'Customer identity verified',
  'Location detected',
  'Previous transaction found',
  'Distance calculated',
  'Time difference calculated',
  'Risk evaluation complete',
  'Decision rendered',
];

export const useMonitor = () => {
  const {
    settings,
    customerMap,
    addTransaction,
    updateTransaction,
    setSelectedTransaction,
    setCustomerMap,
    incrementStat,
    addToast,
    transactions,
  } = useAppStore();

  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const processingRef = useRef<Set<string>>(new Set());

  const processTransaction = useCallback(
    async (txn: Transaction) => {
      if (processingRef.current.has(txn.id)) return;
      processingRef.current.add(txn.id);

      // Add to store immediately as processing
      addTransaction(txn);
      incrementStat('total');
      setSelectedTransaction(txn);

      // Build timeline
      const now = new Date();
      const timeline: CheckEvent[] = CHECK_LABELS.map((label, i) => ({
        time: new Date(now.getTime() + STEP_DELAYS.slice(0, i).reduce((a, b) => a + b, 0)),
        label,
        status: i === 0 ? 'running' : 'pending',
      }));

      updateTransaction(txn.id, { checkTimeline: timeline });

      // Animate timeline steps
      let cumulativeDelay = 0;
      for (let i = 0; i < CHECK_LABELS.length; i++) {
        await new Promise((r) => setTimeout(r, STEP_DELAYS[i]));
        cumulativeDelay += STEP_DELAYS[i];

        const updatedTimeline = timeline.map((ev, idx) => ({
          ...ev,
          status:
            idx < i + 1
              ? 'done'
              : idx === i + 1
              ? 'running'
              : 'pending',
        })) as CheckEvent[];

        updateTransaction(txn.id, { checkTimeline: updatedTimeline });
      }

      // Final decision
      const isSusp = txn.isSuspicious;

      if (isSusp) {
        updateTransaction(txn.id, { status: 'action_required' });
        incrementStat('actionRequired');

        await new Promise((r) => setTimeout(r, 600));
        updateTransaction(txn.id, { status: 'otp_sent' });
        incrementStat('otpSent');

        addToast({
          message: `OTP sent for ${txn.customerName} — ₹${txn.amount.toLocaleString('en-IN')}`,
          type: 'warning',
        });

        // Update customer map
        const newMap = new Map(customerMap);
        newMap.set(txn.customerId, { ...txn, status: 'otp_sent' });
        setCustomerMap(newMap);
      } else {
        updateTransaction(txn.id, { status: 'approved' });
        incrementStat('approved');

        addToast({
          message: `Transaction approved — ${txn.customerName} ₹${txn.amount.toLocaleString('en-IN')}`,
          type: 'success',
        });

        // Update customer map
        const newMap = new Map(customerMap);
        newMap.set(txn.customerId, { ...txn, status: 'approved' });
        setCustomerMap(newMap);
      }

      processingRef.current.delete(txn.id);
    },
    [addTransaction, updateTransaction, setSelectedTransaction, incrementStat, addToast, customerMap, setCustomerMap]
  );

  const scheduleNext = useCallback(() => {
    if (!settings.isMonitoring) return;
    const delay =
      settings.intervalMinMs +
      Math.random() * (settings.intervalMaxMs - settings.intervalMinMs);

    intervalRef.current = setTimeout(() => {
      if (!useAppStore.getState().settings.isMonitoring) return;
      const currentSettings = useAppStore.getState().settings;
      const currentCustomerMap = useAppStore.getState().customerMap;
      const txn = generateTransaction(currentCustomerMap, currentSettings);
      processTransaction(txn);
      scheduleNext();
    }, delay);
  }, [settings.isMonitoring, settings.intervalMinMs, settings.intervalMaxMs, processTransaction]);

  useEffect(() => {
    if (settings.isMonitoring) {
      scheduleNext();
    } else {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [settings.isMonitoring]);

  const generateNow = useCallback(
    (type: 'safe' | 'suspicious') => {
      const currentSettings = useAppStore.getState().settings;
      const currentCustomerMap = useAppStore.getState().customerMap;
      const txn = generateTransaction(currentCustomerMap, currentSettings, type);
      processTransaction(txn);
    },
    [processTransaction]
  );

  return { generateNow };
};
