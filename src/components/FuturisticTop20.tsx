import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  ExternalLink,
  LayoutGrid,
  LineChart,
  Newspaper,
  RefreshCw,
  Rocket,
  Search,
  Sparkles,
  Table2,
} from 'lucide-react';
import {
  DashboardId,
  FuturisticDashboardResponse,
  FuturisticPick,
  NewsArticle,
} from '../types/market';
import { formatSignedPercent } from '../utils/format';
import { fetchJson } from '../utils/safeFetch';
import { Sparkline } from './Sparkline';

interface FuturisticTop20Props {
  dashboardId: DashboardId;
  dashboardTitle: string;
  onOpenChart?: (item: FuturisticPick) => void;
  onAnalyzeItem: (item: FuturisticPick) => void;
  compactHeader?: boolean;
}

function formatPickPrice(price: number | null, prefix: FuturisticPick['currencyPrefix']) {
  if (price === null || price === undefined || Number.isNaN(price)) return 'Pipeline / TBA';
  if (prefix === '%') return `${price.toFixed(2)}%`;
  if (prefix === '$') {
    return `$${price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `${prefix}${price.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatNewsAge(pubDate?: string): string {
  if (!pubDate) return 'Early Wire';
  const parsed = Date.parse(pubDate);
  if (Number.isNaN(parsed)) return 'Early Wire';
  const diffMins = Math.max(0, Math.round((Date.now() - parsed) / 60_000));
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.round(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return new Date(parsed).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  });
}

function getFlowClass(flowType?: FuturisticPick['orderFlowType']): string {
  if (flowType === 'buying') return 'text-emerald-700';
  if (flowType === 'selling') return 'text-rose-600';
  return 'text-slate-500';
}

export const FuturisticTop20: React.FC<FuturisticTop20Props> = ({
  dashboardId,
  dashboardTitle,
  onOpenChart,
  onAnalyzeItem,
  compactHeader = false,
}) => {
  const defaultFlowPriority =
    dashboardId === 'stocks' || dashboardId === 'intraday' || dashboardId === 'ipo';

  const [payload, setPayload] = useState<FuturisticDashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [themeFilter, setThemeFilter] = useState<string>('All');
  const [flowFilter, setFlowFilter] = useState<'all' | 'buying' | 'selling'>('all');
  const [sortBy, setSortBy] = useState<'flow' | 'rank'>(defaultFlowPriority ? 'flow' : 'rank');
  const [query, setQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const fetchFuturistic = async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJson<FuturisticDashboardResponse>(
        `/api/dashboard/${encodeURIComponent(dashboardId)}/futuristic-20${force ? '?force=true' : ''}`
      );
      setPayload(data);
    } catch (err: any) {
      setError(err?.message || 'Unable to reach live exchange & early news feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setThemeFilter('All');
    setFlowFilter('all');
    setSortBy(
      dashboardId === 'stocks' || dashboardId === 'intraday' || dashboardId === 'ipo'
        ? 'flow'
        : 'rank'
    );
    setQuery('');
    fetchFuturistic(false);
    const timer = setInterval(() => fetchFuturistic(false), 30_000);
    return () => clearInterval(timer);
  }, [dashboardId]);

  const items: FuturisticPick[] = payload?.items || [];
  const earlyNews: NewsArticle[] = payload?.earlyNews || [];

  const themeGroups = useMemo(() => {
    const unique = Array.from(new Set(items.map((i) => i.themeGroup)));
    return ['All', ...unique];
  }, [items]);

  const buyingCount = useMemo(
    () => items.filter((i) => i.orderFlowType === 'buying').length,
    [items]
  );
  const sellingCount = useMemo(
    () => items.filter((i) => i.orderFlowType === 'selling').length,
    [items]
  );

  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = items.filter((item) => {
      const matchTheme = themeFilter === 'All' || item.themeGroup === themeFilter;
      const matchFlow = flowFilter === 'all' || item.orderFlowType === flowFilter;
      const matchQ =
        !q ||
        item.ticker.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.futuristicTheme.toLowerCase().includes(q) ||
        item.reason.toLowerCase().includes(q) ||
        item.newsCatalyst.toLowerCase().includes(q);
      return matchTheme && matchFlow && matchQ;
    });

    if (sortBy === 'flow') {
      return [...filtered].sort(
        (a, b) => (b.flowScore ?? 0) - (a.flowScore ?? 0) || a.rank - b.rank
      );
    }
    return [...filtered].sort((a, b) => a.rank - b.rank);
  }, [items, themeFilter, flowFilter, sortBy, query]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0D9488]">
            <Rocket className="h-3.5 w-3.5" />
            <span>
              {dashboardTitle.toUpperCase()} FUTURISTIC 20 · EARLY NEWS &amp; ORDER FLOW SYNCED
            </span>
          </div>
          <h2
            className={`${
              compactHeader ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'
            } font-bold tracking-tight text-slate-900 mt-1`}
          >
            {payload?.headline || `Best 20 Futuristic ${dashboardTitle} Picks & Reasons`}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {payload?.subtitle ||
              `20 high-conviction futuristic ${dashboardTitle.toLowerCase()} opportunities ranked by active buying/selling pressure and early news updates.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
          <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold cursor-pointer whitespace-nowrap ${
                viewMode === 'cards' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold cursor-pointer whitespace-nowrap ${
                viewMode === 'table' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table2 className="h-3.5 w-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => fetchFuturistic(true)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 cursor-pointer whitespace-nowrap"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync News &amp; Flow</span>
          </button>
        </div>
      </div>

      {/* Early News Updates Feed */}
      {earlyNews.length > 0 && (
        <div className="rounded-2xl border border-teal-200/80 bg-[#F0FDFA]/70 p-4 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0F766E]">
              <Newspaper className="h-4 w-4 shrink-0" />
              <span>Early News Updates Driving Today&rsquo;s {dashboardTitle} Picks</span>
            </div>
            {payload?.syncedAt && (
              <span className="text-[11px] font-mono text-slate-500">
                Updated{' '}
                {new Date(payload.syncedAt).toLocaleTimeString('en-IN', {
                  timeZone: 'Asia/Kolkata',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}{' '}
                IST
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {earlyNews.slice(0, 4).map((art, idx) => (
              <a
                key={idx}
                href={art.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between rounded-xl border border-teal-200/70 bg-white p-3 hover:border-[#0D9488] transition-colors"
              >
                <div className="text-xs font-semibold text-slate-800 group-hover:text-[#0F766E] line-clamp-2 leading-snug">
                  {art.title}
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span className="truncate">{art.source}</span>
                  <span className="inline-flex items-center gap-1 font-mono text-[#0284C7] shrink-0">
                    <span>{formatNewsAge(art.pubDate)}</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Buying/Selling Flow Filter + Sort + Theme Filters + Search */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFlowFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                flowFilter === 'all'
                  ? 'bg-[#0D9488] text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              All Flow ({items.length})
            </button>
            <button
              type="button"
              onClick={() => setFlowFilter('buying')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                flowFilter === 'buying'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              High Buying ({buyingCount})
            </button>
            <button
              type="button"
              onClick={() => setFlowFilter('selling')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                flowFilter === 'selling'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white border border-slate-200 text-rose-600 hover:bg-rose-50'
              }`}
            >
              Heavy Selling ({sellingCount})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'flow' | 'rank')}
              aria-label="Sort futuristic picks"
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-[#0D9488] focus:outline-none"
            >
              <option value="flow">Sort: High Buying / Selling First</option>
              <option value="rank">Sort: Curated Rank</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {themeGroups.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setThemeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  themeFilter === t
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {t === 'All' ? `All Themes (${items.length || 20})` : t}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-[320px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Filter ${dashboardTitle.toLowerCase()} picks, reason or news...`}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0D9488] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs sm:text-sm text-rose-800">
          {error}
        </div>
      )}

      {loading && items.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-52 rounded-2xl border border-slate-200 bg-white p-5 animate-pulse" />
          ))}
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          No futuristic {dashboardTitle.toLowerCase()} picks match your active filter.
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleItems.map((item) => {
            const hasPct = item.percentChange !== null && item.percentChange !== undefined;
            const pos = (item.percentChange ?? 0) >= 0;
            const canChart = Boolean(item.symbol || item.schemeCode);
            return (
              <article
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-slate-500">
                        <span className="font-mono font-bold text-[#0D9488]">
                          #{String(item.rank).padStart(2, '0')}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-slate-700">{item.themeGroup}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate max-w-[180px]">{item.categoryLabel}</span>
                      </div>
                      <h3 className="mt-1 text-base font-bold text-slate-900 truncate">
                        {item.ticker}{' '}
                        <span className="font-medium text-slate-500 text-xs sm:text-sm">
                          — {item.name}
                        </span>
                      </h3>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-semibold text-[#0284C7]">{item.futuristicTheme}</span>
                        {item.orderFlowLabel && (
                          <>
                            <span aria-hidden="true" className="text-slate-300">·</span>
                            <span className={`font-semibold ${getFlowClass(item.orderFlowType)}`}>
                              {item.orderFlowLabel}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right font-mono tabular-nums shrink-0">
                      <div className="text-base sm:text-lg font-bold text-slate-900">
                        {formatPickPrice(item.price, item.currencyPrefix)}
                      </div>
                      {hasPct && (
                        <div
                          className={`inline-flex items-center justify-end gap-0.5 text-xs font-semibold ${
                            pos ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          {pos ? (
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowDownRight className="h-3.5 w-3.5" />
                          )}
                          <span>{formatSignedPercent(item.percentChange)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Explicit Futuristic Investment Reason */}
                  <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 space-y-2">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Why Futuristic ({item.horizon})
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {item.reason}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/70 flex items-start justify-between gap-2 text-[11px]">
                      <div className="min-w-0 text-slate-600">
                        <span className="font-semibold text-[#0F766E]">Early News Update: </span>
                        <span>{item.newsCatalyst}</span>
                        {item.newsSource && (
                          <span className="text-slate-400">
                            {' '}
                            ({item.newsSource} · {formatNewsAge(item.newsPubDate)})
                          </span>
                        )}
                      </div>
                      {item.newsLink && (
                        <a
                          href={item.newsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-[#0284C7] hover:underline inline-flex items-center gap-0.5"
                          aria-label="Open source article"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono tabular-nums text-slate-500">
                    <span>
                      {item.metricLabel ? `${item.metricLabel}: ` : ''}
                      {item.metricValue || 'Live'}
                    </span>
                    {item.volumeRatio != null && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className={item.volumeRatio >= 1.4 ? 'font-semibold text-slate-800' : ''}>
                          {item.volumeRatio}x Vol
                        </span>
                      </>
                    )}
                    {item.sparkline.length > 1 && (
                      <div className="hidden sm:block ml-1">
                        <Sparkline values={item.sparkline} positive={pos} width={56} height={18} />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {canChart && onOpenChart && (
                      <button
                        type="button"
                        onClick={() => onOpenChart(item)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap cursor-pointer"
                      >
                        <LineChart className="h-3.5 w-3.5" />
                        <span>Chart</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onAnalyzeItem(item)}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#0D9488] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0F766E] whitespace-nowrap cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>AI Research</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                  <th className="py-3 pl-5 pr-2">Rank</th>
                  <th className="py-3 px-3">Pick &amp; Order Flow</th>
                  <th className="py-3 px-3 min-w-[260px]">Investment Reason &amp; Early News</th>
                  <th className="py-3 px-3 text-right">Live Value</th>
                  <th className="py-3 px-3 text-right">Day %</th>
                  <th className="py-3 pl-3 pr-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleItems.map((item) => {
                  const pos = (item.percentChange ?? 0) >= 0;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => (onOpenChart ? onOpenChart(item) : onAnalyzeItem(item))}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 pl-5 pr-2 font-mono font-bold text-[#0D9488] whitespace-nowrap">
                        #{String(item.rank).padStart(2, '0')}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">
                          {item.ticker} <span className="font-normal text-slate-500">· {item.themeGroup}</span>
                        </div>
                        <div className="text-xs text-slate-600">{item.name}</div>
                        <div className="text-xs font-semibold text-[#0284C7] mt-0.5">
                          {item.futuristicTheme}
                          {item.orderFlowLabel && (
                            <span className={`ml-2 font-semibold ${getFlowClass(item.orderFlowType)}`}>
                              · {item.orderFlowLabel}
                              {item.volumeRatio ? ` (${item.volumeRatio}x)` : ''}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-xs text-slate-600 leading-relaxed max-w-md space-y-1">
                        <div>{item.reason}</div>
                        <div className="text-[11px] text-[#0F766E]">
                          <strong>Early News:</strong> {item.newsCatalyst}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">
                        {formatPickPrice(item.price, item.currencyPrefix)}
                      </td>
                      <td
                        className={`py-3.5 px-3 text-right font-mono tabular-nums font-semibold whitespace-nowrap ${
                          item.percentChange == null
                            ? 'text-slate-400'
                            : pos
                              ? 'text-emerald-700'
                              : 'text-rose-600'
                        }`}
                      >
                        {item.percentChange != null ? formatSignedPercent(item.percentChange) : '—'}
                      </td>
                      <td
                        className="py-3.5 pl-3 pr-5 text-right whitespace-nowrap"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAnalyzeItem(item);
                        }}
                      >
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-lg bg-[#0D9488] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#0F766E] cursor-pointer"
                        >
                          <Sparkles className="h-3 w-3" />
                          <span>Research</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
