import React from 'react';
import { MetricsBar } from '../components/MetricsBar';
import { TransactionStream } from '../components/TransactionStream';
import { TransactionDetails } from '../components/TransactionDetails';

export const LiveView: React.FC = () => (
  <div className="flex flex-col flex-1 min-h-0 gap-2 p-2 overflow-hidden">
    <MetricsBar />
    <div className="flex flex-1 min-h-0 gap-2 overflow-hidden">
      <div className="flex flex-col flex-1 min-h-0 min-w-0">
        <TransactionStream />
      </div>
      <div className="w-80 xl:w-[360px] flex-shrink-0 overflow-y-auto overflow-x-hidden">
        <TransactionDetails />
      </div>
    </div>
  </div>
);
