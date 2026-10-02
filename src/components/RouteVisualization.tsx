import React from 'react';
import { Transaction } from '../types';

interface Props {
  transaction: Transaction;
}

const MAP_W = 260;
const MAP_H = 190;

const geoToCanvas = (lat: number, lng: number): [number, number] => {
  const minLat = 8, maxLat = 37;
  const minLng = 68, maxLng = 97;
  const x = ((lng - minLng) / (maxLng - minLng)) * (MAP_W - 48) + 24;
  const y = MAP_H - ((lat - minLat) / (maxLat - minLat)) * (MAP_H - 48) - 24;
  return [x, y];
};

export const RouteVisualization: React.FC<Props> = ({ transaction }) => {
  const { previousTransaction, city, distanceKm, timeDiffMinutes } = transaction;
  if (!previousTransaction) return null;

  const [x1, y1] = geoToCanvas(previousTransaction.city.lat, previousTransaction.city.lng);
  const [x2, y2] = geoToCanvas(city.lat, city.lng);
  const midX = (x1 + x2) / 2 + (Math.random() > 0.5 ? -20 : 20);
  const midY = (y1 + y2) / 2 - 20;

  const routeColor = transaction.isSuspicious ? '#ef4444' : '#22c55e';

  return (
    <div className="rounded border border-slate-700/50 bg-navy-800/80 overflow-hidden">
      <div className="px-3 py-1.5 border-b border-slate-700/40">
        <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">
          Location Route
        </span>
      </div>
      <div className="p-2 flex gap-3 items-start">
        <svg
          width={MAP_W}
          height={MAP_H}
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          style={{ flexShrink: 0, maxWidth: '100%' }}
        >
          {/* India background shape (simplified polygon) */}
          <polygon
            points="60,10 80,8 100,14 125,10 148,18 162,16 175,28 180,45 185,65 190,88 195,112 187,128 178,148 162,162 148,172 128,180 112,184 95,182 78,174 63,158 50,138 40,118 33,96 30,74 34,56 44,38 54,24"
            fill="#0e1d45"
            stroke="#1a2d6b"
            strokeWidth="1.5"
          />
          {/* Kerala peninsula */}
          <polygon
            points="95,182 100,188 105,184 108,178 103,175"
            fill="#0e1d45"
            stroke="#1a2d6b"
            strokeWidth="1"
          />

          {/* Route line */}
          <path
            d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
            fill="none"
            stroke={routeColor}
            strokeWidth="1.5"
            strokeDasharray="5 3"
            className="route-line"
            opacity="0.85"
          />

          {/* Previous city marker */}
          <circle cx={x1} cy={y1} r="6" fill="#0e1d45" stroke="#f59e0b" strokeWidth="2" />
          <circle cx={x1} cy={y1} r="2.5" fill="#f59e0b" />

          {/* Current city marker */}
          <circle cx={x2} cy={y2} r="6" fill="#0e1d45" stroke={routeColor} strokeWidth="2" />
          <circle cx={x2} cy={y2} r="2.5" fill={routeColor} />

          {/* City labels */}
          <text
            x={x1}
            y={y1 - 10}
            textAnchor="middle"
            fill="#f59e0b"
            fontSize="7.5"
            fontFamily="monospace"
            fontWeight="600"
          >
            {previousTransaction.city.name}
          </text>
          <text
            x={x2}
            y={y2 - 10}
            textAnchor="middle"
            fill={routeColor}
            fontSize="7.5"
            fontFamily="monospace"
            fontWeight="600"
          >
            {city.name}
          </text>

          {/* Distance label along route */}
          {distanceKm && distanceKm > 0 && (
            <text
              x={(x1 + x2) / 2}
              y={(y1 + y2) / 2 - 8}
              textAnchor="middle"
              fill={routeColor}
              fontSize="7"
              fontFamily="monospace"
              opacity="0.7"
            >
              ~{distanceKm} km
            </text>
          )}
        </svg>

        <div className="space-y-2.5 min-w-0 flex-shrink-0">
          <div>
            <div className="text-[9px] text-slate-600 uppercase tracking-wider">Previous</div>
            <div className="text-xs font-semibold text-amber-400">{previousTransaction.city.name}</div>
            <div className="text-[9px] text-slate-500">{previousTransaction.city.state}</div>
          </div>
          <div>
            <div className="text-[9px] text-slate-600 uppercase tracking-wider">Current</div>
            <div className={`text-xs font-semibold ${transaction.isSuspicious ? 'text-red-400' : 'text-green-400'}`}>
              {city.name}
            </div>
            <div className="text-[9px] text-slate-500">{city.state}</div>
          </div>
          {distanceKm !== undefined && (
            <div>
              <div className="text-[9px] text-slate-600 uppercase tracking-wider">Distance</div>
              <div className="text-sm font-bold text-white font-mono">{distanceKm > 0 ? `${distanceKm.toLocaleString()} km` : 'Same city'}</div>
            </div>
          )}
          {timeDiffMinutes !== undefined && (
            <div>
              <div className="text-[9px] text-slate-600 uppercase tracking-wider">Time Gap</div>
              <div className={`text-sm font-bold font-mono ${transaction.isSuspicious ? 'text-red-400' : 'text-white'}`}>
                {timeDiffMinutes} min
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
