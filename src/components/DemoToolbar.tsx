import React from 'react';
import { Play, Pause, RotateCcw, Zap, AlertOctagon } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface Props {
  onGenerateSafe: () => void;
  onGenerateSuspicious: () => void;
  onReset: () => void;
}

export const DemoToolbar: React.FC<Props> = ({ onGenerateSafe, onGenerateSuspicious, onReset }) => {
  const { settings, updateSettings } = useAppStore();

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 bg-navy-800/70 border-b border-slate-700/40 flex-shrink-0">
      <span className="text-[9px] uppercase tracking-widest text-slate-600 font-semibold mr-1">
        Demo Controls
      </span>

      {settings.isMonitoring ? (
        <button
          onClick={() => updateSettings({ isMonitoring: false })}
          className="flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
        >
          <Pause size={9} /> Pause
        </button>
      ) : (
        <button
          onClick={() => updateSettings({ isMonitoring: true })}
          className="flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-colors"
        >
          <Play size={9} /> Resume
        </button>
      )}

      <button
        onClick={onGenerateSafe}
        className="flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-colors"
      >
        <Zap size={9} /> Generate Safe
      </button>

      <button
        onClick={onGenerateSuspicious}
        className="flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors"
      >
        <AlertOctagon size={9} /> Generate Suspicious
      </button>

      <button
        onClick={onReset}
        className="flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold bg-slate-700/50 text-slate-400 border border-slate-600/50 hover:bg-slate-700 transition-colors"
      >
        <RotateCcw size={9} /> Reset Demo
      </button>

      <div className="ml-auto flex items-center gap-1.5 text-[9px] text-slate-600">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
        Demo Environment — No real bank connection · Simulation only
      </div>
    </div>
  );
};
