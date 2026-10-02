import React from 'react';
import { CheckCircle, Circle, Clock, Loader } from 'lucide-react';
import { CheckEvent } from '../types';
import { formatISTTime } from '../utils/data';

interface Props {
  events: CheckEvent[];
}

export const SecurityTimeline: React.FC<Props> = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-[10px] text-slate-600 text-center py-4">
        No activity yet
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {events.map((ev, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="mt-0.5">
              {ev.status === 'done' ? (
                <CheckCircle size={13} className="text-green-400" />
              ) : ev.status === 'running' ? (
                <Loader size={13} className="text-amber-400 processing-pulse" />
              ) : ev.status === 'error' ? (
                <Circle size={13} className="text-red-400" />
              ) : (
                <Circle size={13} className="text-slate-700" />
              )}
            </div>
            {i < events.length - 1 && (
              <div
                className={`w-px flex-1 mt-1 mb-1 ${
                  ev.status === 'done' ? 'bg-green-700/50' : 'bg-slate-700/50'
                }`}
                style={{ minHeight: '16px' }}
              />
            )}
          </div>
          <div className="pb-2 min-w-0">
            <div
              className={`text-[10px] font-medium leading-none ${
                ev.status === 'done'
                  ? 'text-slate-300'
                  : ev.status === 'running'
                  ? 'text-amber-300'
                  : 'text-slate-600'
              }`}
            >
              {ev.label}
            </div>
            <div className="text-[9px] text-slate-600 mt-0.5 font-mono">
              {formatISTTime(ev.time)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
