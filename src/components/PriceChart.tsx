import React, { useMemo, useState, useId } from 'react';
import { ChartPoint, ChartRange } from '../types/market';
import { formatChartTimestamp } from '../utils/format';

interface PriceChartProps {
  points: ChartPoint[];
  range: ChartRange;
  previousClose?: number;
  currencyPrefix?: string;
  height?: number;
  loading?: boolean;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  points,
  range,
  previousClose,
  currencyPrefix = '₹',
  height = 280,
  loading = false,
}) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const gradientId = useId();

  const viewWidth = 760;
  const padTop = 18;
  const padBottom = 28;
  const padLeft = 8;
  const padRight = 68;
  const plotWidth = viewWidth - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  const metrics = useMemo(() => {
    if (!points || points.length === 0) return null;
    const values = points.map((p) => p.close);
    const isIntradaySingle = range === '1d' || range === '1m' || range === '5m';
    if (typeof previousClose === 'number' && isIntradaySingle) {
      values.push(previousClose);
    }
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const padding = (rawMax - rawMin) * 0.08 || rawMax * 0.01 || 1;
    const min = rawMin - padding;
    const max = rawMax + padding;
    const span = max - min || 1;

    const first = points[0].close;
    const last = points[points.length - 1].close;
    const baseline = isIntradaySingle && typeof previousClose === 'number' ? previousClose : first;
    const isPositive = last >= baseline;

    const mapped = points.map((pt, idx) => {
      const x =
        points.length === 1
          ? padLeft + plotWidth / 2
          : padLeft + (idx / (points.length - 1)) * plotWidth;
      const y = padTop + (1 - (pt.close - min) / span) * plotHeight;
      return { ...pt, x, y };
    });

    const linePath = mapped
      .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
      .join(' ');
    const areaPath = `${linePath} L ${mapped[mapped.length - 1].x.toFixed(1)} ${(
      padTop + plotHeight
    ).toFixed(1)} L ${mapped[0].x.toFixed(1)} ${(padTop + plotHeight).toFixed(1)} Z`;

    const gridTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => {
      const val = max - t * span;
      const y = padTop + t * plotHeight;
      return { val, y };
    });

    const prevY =
      isIntradaySingle && typeof previousClose === 'number'
        ? padTop + (1 - (previousClose - min) / span) * plotHeight
        : null;

    return { mapped, linePath, areaPath, gridTicks, isPositive, prevY };
  }, [points, previousClose, range, plotWidth, plotHeight]);

  if (loading) {
    return (
      <div
        className="w-full rounded-lg bg-slate-100 animate-pulse flex items-center justify-center text-xs text-slate-500"
        style={{ height }}
      >
        Loading live market series...
      </div>
    );
  }

  if (!metrics || metrics.mapped.length === 0) {
    return (
      <div
        className="w-full rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-sm text-slate-500"
        style={{ height }}
      >
        No historical chart data available for this timeframe.
      </div>
    );
  }

  const activePoint =
    hoverIdx !== null && metrics.mapped[hoverIdx]
      ? metrics.mapped[hoverIdx]
      : metrics.mapped[metrics.mapped.length - 1];

  const strokeColor = metrics.isPositive ? '#059669' : '#E11D48';

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * viewWidth;
    const clamped = Math.max(padLeft, Math.min(padLeft + plotWidth, relX));
    const ratio = (clamped - padLeft) / plotWidth;
    const idx = Math.round(ratio * (metrics.mapped.length - 1));
    setHoverIdx(Math.max(0, Math.min(metrics.mapped.length - 1, idx)));
  };

  return (
    <div className="relative w-full select-none">
      <div className="mb-2 flex items-center justify-between text-xs font-mono tabular-nums text-slate-500">
        <span>
          {hoverIdx !== null ? 'Point: ' : 'Latest: '}
          <span className="text-slate-900 font-semibold">
            {currencyPrefix}
            {activePoint.close.toLocaleString(currencyPrefix === '$' ? 'en-US' : 'en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </span>
        <span>{formatChartTimestamp(activePoint.timestamp, range)}</span>
      </div>

      <svg
        viewBox={`0 0 ${viewWidth} ${height}`}
        className="w-full h-auto overflow-visible cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIdx(null)}
        role="img"
        aria-label="Live price chart"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.18} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
          </linearGradient>
        </defs>

        {metrics.gridTicks.map((tick, idx) => (
          <g key={idx}>
            <line
              x1={padLeft}
              y1={tick.y}
              x2={padLeft + plotWidth}
              y2={tick.y}
              stroke="#E2E8F0"
              strokeWidth={1}
            />
            <text
              x={padLeft + plotWidth + 8}
              y={tick.y + 4}
              fill="#64748B"
              fontSize="11"
              fontFamily="JetBrains Mono, monospace"
            >
              {tick.val.toLocaleString(currencyPrefix === '$' ? 'en-US' : 'en-IN', {
                maximumFractionDigits: tick.val >= 1000 ? 0 : 2,
              })}
            </text>
          </g>
        ))}

        {metrics.prevY !== null && (
          <line
            x1={padLeft}
            y1={metrics.prevY}
            x2={padLeft + plotWidth}
            y2={metrics.prevY}
            stroke="#94A3B8"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        )}

        <path d={metrics.areaPath} fill={`url(#${gradientId})`} />
        <path
          d={metrics.linePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {hoverIdx !== null && (
          <g>
            <line
              x1={activePoint.x}
              y1={padTop}
              x2={activePoint.x}
              y2={padTop + plotHeight}
              stroke="#94A3B8"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <circle
              cx={activePoint.x}
              cy={activePoint.y}
              r={4.5}
              fill={strokeColor}
              stroke="#FFFFFF"
              strokeWidth={2}
            />
          </g>
        )}
      </svg>
    </div>
  );
};
