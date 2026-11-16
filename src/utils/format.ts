export function formatINR(value: number | null | undefined, decimals = 2): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }
  return `₹${value.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatIndexValue(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatSignedChange(value: number | null | undefined, prefix = ''): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  const abs = Math.abs(value).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sign}${prefix}${abs}`;
}

export function formatSignedPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}${Math.abs(value).toFixed(2)}%`;
}

export function formatCompactVolume(vol: number | null | undefined): string {
  if (vol === null || vol === undefined || Number.isNaN(vol) || vol <= 0) {
    return '—';
  }
  if (vol >= 10_000_000) {
    return `${(vol / 10_000_000).toFixed(2)} Cr`;
  }
  if (vol >= 100_000) {
    return `${(vol / 100_000).toFixed(2)} L`;
  }
  if (vol >= 1_000) {
    return `${(vol / 1_000).toFixed(1)} K`;
  }
  return vol.toLocaleString('en-IN');
}

export function formatChartTimestamp(tsSeconds: number, range: string): string {
  const d = new Date(tsSeconds * 1000);
  if (range === '1m' || range === '5m' || range === '15m' || range === '1d' || range === '5d') {
    return d.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }
  return d.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
