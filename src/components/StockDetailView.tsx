import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { AiBriefResponse, ChartRange, StockDetail } from '../types/market';
import {
  formatCompactVolume,
  formatSignedChange,
  formatSignedPercent,
} from '../utils/format';
import { PriceChart } from './PriceChart';
import { fetchJson } from '../utils/safeFetch';

function formatDetailPrice(
  value: number | null | undefined,
  currencyPrefix: string,
  isUsd: boolean,
  isPercentYield: boolean,
  decimals = 2
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }
  const formatted = value.toLocaleString(isUsd ? 'en-US' : 'en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${currencyPrefix}${formatted}${isPercentYield ? '%' : ''}`;
}

interface StockDetailViewProps {
  symbol: string;
  onBack: () => void;
}

const RANGES: Array<{ id: ChartRange; label: string }> = [
  { id: '1d', label: '1D' },
  { id: '5d', label: '5D' },
  { id: '1mo', label: '1M' },
  { id: '3mo', label: '3M' },
  { id: '1y', label: '1Y' },
  { id: '5y', label: '5Y' },
];

export const StockDetailView: React.FC<StockDetailViewProps> = ({
  symbol,
  onBack,
}) => {
  const [range, setRange] = useState<ChartRange>('1mo');
  const [detail, setDetail] = useState<StockDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [brief, setBrief] = useState<AiBriefResponse | null>(null);
  const [briefLoading, setBriefLoading] = useState<boolean>(false);
  const [briefError, setBriefError] = useState<string | null>(null);
  const autoTriggeredSymbolRef = useRef<string | null>(null);

  useEffect(() => {
    setBrief(null);
    setBriefError(null);
    autoTriggeredSymbolRef.current = null;
  }, [symbol]);

  useEffect(() => {
    let cancelled = false;
    async function loadDetail() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchJson<StockDetail>(
          `/api/stock/${encodeURIComponent(symbol)}?range=${range}`
        );
        if (!cancelled) {
          setDetail(data);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || 'Unable to load equity data');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    loadDetail();
    return () => {
      cancelled = true;
    };
  }, [symbol, range]);

  const handleGenerateBrief = async (targetDetail = detail, signal?: AbortSignal) => {
    if (!targetDetail) return;
    setBriefLoading(true);
    setBriefError(null);
    try {
      const data = await fetchJson<AiBriefResponse>('/api/ai/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal,
        body: JSON.stringify({
          symbol: targetDetail.symbol,
          companyName: targetDetail.name,
          price: targetDetail.price,
          percentChange: targetDetail.percentChange,
        }),
      });
      if (!signal?.aborted) {
        setBrief(data);
      }
    } catch (err: any) {
      if (err?.name === 'AbortError' || signal?.aborted) return;
      setBriefError(err?.message || 'Research request failed');
    } finally {
      if (!signal?.aborted) {
        setBriefLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!detail || detail.symbol !== symbol) return;
    if (autoTriggeredSymbolRef.current === symbol) return;
    autoTriggeredSymbolRef.current = symbol;
    const controller = new AbortController();
    handleGenerateBrief(detail, controller.signal);
    return () => controller.abort();
  }, [detail, symbol]);

  const isPositive = (detail?.change ?? 0) >= 0;
  const isPercentYield = detail?.symbol === '^TNX' || symbol === '^TNX';
  const isUsdAsset =
    detail?.currency === 'USD' ||
    symbol.includes('=F') ||
    (!symbol.endsWith('.NS') && !symbol.endsWith('.BO') && !symbol.startsWith('^') && symbol !== 'DX-Y.NYB');
  const currencyPrefix = isPercentYield || symbol === 'DX-Y.NYB' ? '' : isUsdAsset ? '$' : '₹';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">
          {error}
        </div>
      ) : (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono font-semibold text-slate-800">
                    {detail?.symbol || symbol}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{detail?.exchange || 'NSE'}</span>
                  <span aria-hidden="true">·</span>
                  <span>{detail?.currency || (isUsdAsset ? 'USD' : 'INR')}</span>
                </div>
                <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">
                  {detail?.name || symbol}
                </h1>
              </div>

              <div className="text-left sm:text-right font-mono tabular-nums">
                <div className="text-3xl font-bold text-slate-900">
                  {loading && !detail
                    ? '—'
                    : formatDetailPrice(detail?.price, currencyPrefix, isUsdAsset, isPercentYield)}
                </div>
                {detail && (
                  <div
                    className={`mt-1 inline-flex items-center gap-1 text-sm font-semibold ${
                      isPositive ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    <span>
                      {formatSignedChange(detail.change, currencyPrefix)} (
                      {formatSignedPercent(detail.percentChange)})
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 mb-4">
              <span className="text-xs font-medium text-slate-500">Price History</span>
              <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 border border-slate-200">
                {RANGES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRange(r.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      range === r.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <PriceChart
              points={detail?.points || []}
              range={range}
              previousClose={detail?.previousClose}
              currencyPrefix={currencyPrefix}
              height={300}
              loading={loading}
            />

            <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              <div>
                <div className="text-xs text-slate-500">Previous Close</div>
                <div className="mt-1 text-sm font-mono tabular-nums font-semibold text-slate-900">
                  {formatDetailPrice(detail?.previousClose, currencyPrefix, isUsdAsset, isPercentYield)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Open</div>
                <div className="mt-1 text-sm font-mono tabular-nums font-semibold text-slate-900">
                  {formatDetailPrice(detail?.open, currencyPrefix, isUsdAsset, isPercentYield)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Day High</div>
                <div className="mt-1 text-sm font-mono tabular-nums font-semibold text-slate-900">
                  {formatDetailPrice(detail?.dayHigh, currencyPrefix, isUsdAsset, isPercentYield)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Day Low</div>
                <div className="mt-1 text-sm font-mono tabular-nums font-semibold text-slate-900">
                  {formatDetailPrice(detail?.dayLow, currencyPrefix, isUsdAsset, isPercentYield)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">52W Range</div>
                <div className="mt-1 text-sm font-mono tabular-nums font-semibold text-slate-900">
                  {detail?.low52w !== null && detail?.high52w !== null
                    ? `${formatDetailPrice(detail?.low52w, currencyPrefix, isUsdAsset, isPercentYield, 0)} – ${formatDetailPrice(detail?.high52w, currencyPrefix, isUsdAsset, isPercentYield, 0)}`
                    : '—'}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Volume</div>
                <div className="mt-1 text-sm font-mono tabular-nums font-semibold text-slate-900">
                  {formatCompactVolume(detail?.volume)}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Grounded Equity Research
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Synthesizes live web filings, recent earnings, and sector developments with verified sources
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleGenerateBrief()}
                disabled={briefLoading || !detail}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0D9488] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0F766E] disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>
                  {briefLoading
                    ? 'Researching...'
                    : brief
                      ? 'Refresh Research'
                      : 'Generate Research Brief'}
                </span>
              </button>
            </div>

            {briefError && (
              <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                {briefError}
              </div>
            )}

            {briefLoading && (
              <div className="mt-6 space-y-3 animate-pulse">
                <div className="h-5 w-2/3 rounded bg-slate-200" />
                <div className="h-4 w-full rounded bg-slate-100" />
                <div className="h-4 w-5/6 rounded bg-slate-100" />
              </div>
            )}

            {brief && !briefLoading && (
              <div className="mt-6 pt-6 border-t border-slate-200 space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>Sentiment:</span>
                    <span className="font-semibold text-slate-900">{brief.sentiment}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">
                      {new Date(brief.generatedAt).toLocaleTimeString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}{' '}
                      IST
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-slate-900 text-balance">
                    {brief.headline}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 max-w-3xl">
                    {brief.summary}
                  </p>
                </div>

                {brief.sections.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {brief.sections.map((sec, idx) => (
                      <div key={idx} className="space-y-2.5">
                        <h4 className="text-sm font-bold text-slate-900">
                          {sec.title}
                        </h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                          {sec.points.map((pt, pIdx) => (
                            <li key={pIdx} className="flex gap-2.5">
                              <span className="text-[#0D9488] shrink-0">•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {brief.sources.length > 0 && (
                  <div className="pt-4 border-t border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 mb-2">
                      Verified Web Sources
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-2">
                      {brief.sources.map((src, idx) => (
                        <a
                          key={idx}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#0284C7] hover:underline"
                        >
                          <span className="truncate max-w-[260px]">{src.title}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};
