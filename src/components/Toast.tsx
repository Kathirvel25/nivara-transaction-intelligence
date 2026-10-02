import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const ICONS = {
  success: <CheckCircle size={14} className="text-green-400" />,
  warning: <AlertTriangle size={14} className="text-amber-400" />,
  error: <XCircle size={14} className="text-red-400" />,
  info: <Info size={14} className="text-blue-400" />,
};

const BG = {
  success: 'border-green-500/30 bg-green-900/20',
  warning: 'border-amber-500/30 bg-amber-900/20',
  error: 'border-red-500/30 bg-red-900/20',
  info: 'border-blue-500/30 bg-blue-900/20',
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppStore();
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded border text-xs text-slate-200 pointer-events-auto ${
            BG[t.type]
          } shadow-lg animate-slide-in max-w-xs`}
        >
          {ICONS[t.type]}
          <span className="flex-1 font-medium">{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="ml-1 text-slate-400 hover:text-slate-200"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
};
