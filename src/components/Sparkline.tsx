import React from 'react';

interface SparklineProps {
  values: number[];
  positive: boolean;
  width?: number;
  height?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({
  values,
  positive,
  width = 84,
  height = 28,
}) => {
  if (!values || values.length < 2) {
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="#CBD5E1"
          strokeWidth={1.25}
          strokeDasharray="2 2"
        />
      </svg>
    );
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pad = 2;

  const coords = values.map((val, idx) => {
    const x = (idx / (values.length - 1)) * width;
    const y = pad + (1 - (val - min) / span) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const strokeColor = positive ? '#059669' : '#E11D48';

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible shrink-0"
      aria-hidden="true"
    >
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={coords.join(' ')}
      />
    </svg>
  );
};
