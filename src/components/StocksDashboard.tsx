import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Building2,
  Database,
  ExternalLink,
  Globe,
  Newspaper,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  CapTier,
  ChartRange,
  IndexQuote,
  MarketStatus,
  NewsArticle,
  PriceAlert,
  SearchHit,
  StockDetail,
  StockQuote,
  StocksResearchResponse,
} from '../types/market';
import {
  formatCompactVolume,
  formatINR,
  formatIndexValue,
  formatSignedChange,
  formatSignedPercent,
} from '../utils/format';
import { fetchJson } from '../utils/safeFetch';
import { PriceChart } from './PriceChart';
import { Sparkline } from './Sparkline';
import { DashboardModuleGrid, MODULE_THEMES, ModuleCardSpec } from './DashboardModuleGrid';
import { FuturisticTop20 } from './FuturisticTop20';

interface StocksDashboardProps {
  indices: IndexQuote[];
  stocks: StockQuote[];
  marketStatus: MarketStatus | null;
  syncedAt: string | null;
  loading: boolean;
  error: string | null;
  requestedResearchSymbol?: string | null;
  onClearRequestedResearch?: () => void;
  onSelectStock: (symbol: string) => void;
  onTrackSymbol: (symbol: string) => void;
  onRetry: () => void;
  onBack: () => void;
}

type StocksTab = 'database' | 'official' | 'research' | 'monitoring';

const ALERTS_STORAGE_KEY = 'cinfi_price_alerts_v1';

const CHART_RANGES: Array<{ id: ChartRange; label: string }> = [
  { id: '1d', label: '1D' },
  { id: '5d', label: '1W' },
  { id: '1mo', label: '1M' },
  { id: '3mo', label: '3M' },
  { id: '1y', label: '1Y' },
];

export const StocksDashboard: React.FC<StocksDashboardProps> = ({
  indices,
  stocks,
  marketStatus,
  syncedAt,
  loading,
  error,
  requestedResearchSymbol,
  onClearRequestedResearch,
  onSelectStock,
  onTrackSymbol,
  onRetry,
  onBack,
}) => {
  const [subTab, setSubTab] = useState<StocksTab>('database');
  const [databaseView, setDatabaseView] = useState<'all' | 'futuristic'>('all');

  // Index chart state
  const [selectedIndexSymbol, setSelectedIndexSymbol] = useState<string>('^NSEI');
  const [chartRange, setChartRange] = useState<ChartRange>('1mo');
  const [indexDetail, setIndexDetail] = useState<StockDetail | null>(null);
  const [chartLoading, setChartLoading] = useState<boolean>(true);

  // Module A: Company Database Filters + Flow Sorting + Live Global Search
  const [capFilter, setCapFilter] = useState<'All' | CapTier>('All');
  const [sectorFilter, setSectorFilter] = useState<string>('All');
  const [flowFilter, setFlowFilter] = useState<'all' | 'buying' | 'selling'>('all');
  const [sortBy, setSortBy] = useState<'flow' | 'default'>('flow');
  const [dbQuery, setDbQuery] = useState('');
  const [liveHits, setLiveHits] = useState<SearchHit[]>([]);
  const [searchingGlobal, setSearchingGlobal] = useState(false);

  // Shared focused stock for Official Websites (B) & Stocks Research AI (C-E)
  const [focusSymbol, setFocusSymbol] = useState<string>('RELIANCE.NS');

  // Module C-E: Stocks Research AI state (with Auto-Sync AI)
  const [researchMap, setResearchMap] = useState<Record<string, StocksResearchResponse>>({});
  const [researchLoading, setResearchLoading] = useState<boolean>(false);
  const [researchError, setResearchError] = useState<string | null>(null);
  const [researchQuestion, setResearchQuestion] = useState<string>('');
  const [autoSyncAi, setAutoSyncAi] = useState<boolean>(true);
  const lastAutoSyncKeyRef = useRef<string>('');

  // Module F: Monitoring (News + Price Alerts)
  const [newsQuery, setNewsQuery] = useState<string>('');
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState<boolean>(false);

  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    try {
      const raw = localStorage.getItem(ALERTS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [alertSymbol, setAlertSymbol] = useState<string>('RELIANCE.NS');
  const [alertCondition, setAlertCondition] = useState<'above' | 'below'>('above');
  const [alertPriceInput, setAlertPriceInput] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
    } catch {
      // Ignore storage errors
    }
  }, [alerts]);

  // Evaluate live price alerts whenever quotes update
  useEffect(() => {
    if (stocks.length === 0 || alerts.length === 0) return;
    setAlerts((prev) => {
      let changed = false;
      const next = prev.map((al) => {
        if (al.triggeredAt) return al;
        const stk = stocks.find((s) => s.symbol === al.symbol);
        if (!stk || typeof stk.price !== 'number' || stk.price <= 0) return al;
        const hit =
          (al.condition === 'above' && stk.price >= al.targetPrice) ||
          (al.condition === 'below' && stk.price <= al.targetPrice);
        if (hit) {
          changed = true;
          return { ...al, triggeredAt: new Date().toISOString() };
        }
        return al;
      });
      return changed ? next : prev;
    });
  }, [stocks]);

  // Index chart fetch
  useEffect(() => {
    let cancelled = false;
    setChartLoading(true);
    fetchJson<StockDetail>(`/api/stock/${encodeURIComponent(selectedIndexSymbol)}?range=${chartRange}`)
      .then((data) => {
        if (!cancelled && data) setIndexDetail(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setChartLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedIndexSymbol, chartRange]);

  // Global NSE/BSE live search
  useEffect(() => {
    const trimmed = dbQuery.trim();
    if (trimmed.length < 2) {
      setLiveHits([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      setSearchingGlobal(true);
      try {
        const data = await fetchJson<{ results?: SearchHit[] }>(
          `/api/search?q=${encodeURIComponent(trimmed)}`
        );
        if (!cancelled) setLiveHits(Array.isArray(data.results) ? data.results : []);
      } catch {
        if (!cancelled) setLiveHits([]);
      } finally {
        if (!cancelled) setSearchingGlobal(false);
      }
    }, 280);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [dbQuery]);

  // Load 24/7 news stream when opening Monitoring tab
  const fetchLiveNews = async (queryStr = newsQuery) => {
    setNewsLoading(true);
    try {
      const data = await fetchJson<{ articles?: NewsArticle[] }>(
        `/api/stocks/news${queryStr.trim() ? `?q=${encodeURIComponent(queryStr.trim())}` : ''}`
      );
      setNewsArticles(Array.isArray(data.articles) ? data.articles : []);
    } catch {
      setNewsArticles([]);
    } finally {
      setNewsLoading(false);
    }
  };

  useEffect(() => {
    if (subTab === 'monitoring' && newsArticles.length === 0) {
      fetchLiveNews('');
    }
  }, [subTab]);

  useEffect(() => {
    if (stocks.length > 0 && !focusSymbol) {
      setFocusSymbol(stocks[0].symbol);
    }
  }, [stocks, focusSymbol]);

  const activeIndex = indices.find((i) => i.symbol === selectedIndexSymbol) || indices[0] || null;
  const focusedStock: Partial<StockQuote> & { symbol: string; ticker: string; name: string; sector: string } | null =
    stocks.find((s) => s.symbol === focusSymbol) ||
    (focusSymbol
      ? {
          symbol: focusSymbol,
          ticker: focusSymbol.replace(/\.(NS|BO)$/i, ''),
          name: researchMap[focusSymbol]?.companyName || focusSymbol.replace(/\.(NS|BO)$/i, ''),
          sector: 'NSE Listed',
          capTier: 'Large Cap',
          price: null,
          previousClose: null,
          change: null,
          percentChange: null,
          sma20: null,
          sma50: null,
          rsi14: null,
          volumeRatio: null,
        }
      : stocks[0] || null);
  const activeResearch = focusedStock ? researchMap[focusedStock.symbol] || null : null;

  const sectors = useMemo(
    () => ['All', ...Array.from(new Set(stocks.map((s) => s.sector)))],
    [stocks]
  );

  const buyingCount = useMemo(
    () => stocks.filter((s) => s.orderFlowType === 'buying').length,
    [stocks]
  );
  const sellingCount = useMemo(
    () => stocks.filter((s) => s.orderFlowType === 'selling').length,
    [stocks]
  );

  const filteredStocks = useMemo(() => {
    const q = dbQuery.trim().toLowerCase();
    const list = stocks.filter((s) => {
      const matchCap = capFilter === 'All' || s.capTier === capFilter;
      const matchSector = sectorFilter === 'All' || s.sector === sectorFilter;
      const matchFlow = flowFilter === 'all' || s.orderFlowType === flowFilter;
      const matchQ =
        !q ||
        s.ticker.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.sector.toLowerCase().includes(q);
      return matchCap && matchSector && matchFlow && matchQ;
    });

    if (sortBy === 'flow') {
      return [...list].sort(
        (a, b) =>
          (b.flowScore ?? 0) - (a.flowScore ?? 0) ||
          Math.abs(b.percentChange ?? 0) - Math.abs(a.percentChange ?? 0)
      );
    }
    return list;
  }, [stocks, capFilter, sectorFilter, flowFilter, sortBy, dbQuery]);

  const executeResearchRequest = async (
    payload: {
      symbol: string;
      companyName?: string;
      sector?: string;
      capTier?: string;
      price?: number;
      percentChange?: number;
      sma20?: number | null;
      sma50?: number | null;
      rsi14?: number | null;
      volumeRatio?: number | null;
    },
    forceRefresh = false,
    signal?: AbortSignal
  ) => {
    setResearchLoading(true);
    setResearchError(null);
    try {
      const data = await fetchJson<StocksResearchResponse>('/api/stocks/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal,
        body: JSON.stringify({
          ...payload,
          customQuestion: researchQuestion.trim() || undefined,
          force: forceRefresh,
        }),
      });
      if (!signal?.aborted) {
        setResearchMap((prev) => ({ ...prev, [payload.symbol]: data }));
      }
    } catch (err: any) {
      if (err?.name === 'AbortError' || signal?.aborted) return;
      setResearchError(err?.message || 'Stocks Research AI unavailable');
    } finally {
      if (!signal?.aborted) {
        setResearchLoading(false);
      }
    }
  };

  const runResearchPayload = async (
    payload: Parameters<typeof executeResearchRequest>[0],
    forceRefresh = false
  ) => {
    if (!stocks.some((s) => s.symbol === payload.symbol)) {
      onTrackSymbol(payload.symbol);
    }
    setFocusSymbol(payload.symbol);
    setSubTab('research');
    lastAutoSyncKeyRef.current = `${payload.symbol}__${syncedAt || ''}`;
    await executeResearchRequest(payload, forceRefresh);
  };

  const handleRunStocksResearch = async (
    targetStock?: StockQuote,
    forceRefresh = false,
    switchTab = true
  ) => {
    const target = targetStock || focusedStock;
    if (!target) return;
    if (switchTab) {
      setFocusSymbol(target.symbol);
      setSubTab('research');
    }
    lastAutoSyncKeyRef.current = `${target.symbol}__${syncedAt || ''}`;
    await executeResearchRequest(
      {
        symbol: target.symbol,
        companyName: target.name,
        sector: target.sector,
        capTier: target.capTier,
        price: target.price ?? undefined,
        percentChange: target.percentChange ?? undefined,
        sma20: target.sma20,
        sma50: target.sma50,
        rsi14: target.rsi14,
        volumeRatio: target.volumeRatio,
      },
      forceRefresh
    );
  };

  useEffect(() => {
    if (!requestedResearchSymbol) return;
    const matched = stocks.find((s) => s.symbol === requestedResearchSymbol);
    if (matched) {
      handleRunStocksResearch(matched, false, true);
    } else {
      runResearchPayload({ symbol: requestedResearchSymbol }, false);
    }
    onClearRequestedResearch?.();
  }, [requestedResearchSymbol, stocks.length]);

  // Auto-Sync Stocks Research AI when Module C-E is active or focused stock/live sync updates
  // Passes forceRefresh=false so 30s live polls use the 10-minute server AI cache
  useEffect(() => {
    if (subTab !== 'research' || !autoSyncAi || !focusedStock) return;
    const syncKey = `${focusedStock.symbol}__${syncedAt || ''}`;
    if (lastAutoSyncKeyRef.current === syncKey && researchMap[focusedStock.symbol]) return;
    lastAutoSyncKeyRef.current = syncKey;
    const controller = new AbortController();
    executeResearchRequest(
      {
        symbol: focusedStock.symbol,
        companyName: focusedStock.name,
        sector: focusedStock.sector,
        capTier: focusedStock.capTier,
        price: focusedStock.price ?? undefined,
        percentChange: focusedStock.percentChange ?? undefined,
        sma20: focusedStock.sma20,
        sma50: focusedStock.sma50,
        rsi14: focusedStock.rsi14,
        volumeRatio: focusedStock.volumeRatio,
      },
      false,
      controller.signal
    );
    return () => controller.abort();
  }, [subTab, autoSyncAi, focusedStock?.symbol, syncedAt]);

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(alertPriceInput);
    if (Number.isNaN(num) || num <= 0) return;
    const targetStk = stocks.find((s) => s.symbol === alertSymbol);
    if (!targetStk) return;

    const hasLivePrice = typeof targetStk.price === 'number' && targetStk.price > 0;
    const alreadyTriggered =
      hasLivePrice &&
      ((alertCondition === 'above' && (targetStk.price as number) >= num) ||
        (alertCondition === 'below' && (targetStk.price as number) <= num));

    const newAlert: PriceAlert = {
      id: `${Date.now()}`,
      symbol: targetStk.symbol,
      ticker: targetStk.ticker,
      condition: alertCondition,
      targetPrice: num,
      createdAt: new Date().toISOString(),
      triggeredAt: alreadyTriggered ? new Date().toISOString() : undefined,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    setAlertPriceInput('');
  };

  const triggeredAlerts = alerts.filter((a) => Boolean(a.triggeredAt));
  const advancers = stocks.filter((s) => (s.change ?? 0) > 0).length;
  const decliners = stocks.filter((s) => (s.change ?? 0) < 0).length;

  const MODULE_CARDS: Array<ModuleCardSpec<StocksTab>> = [
    {
      id: 'database',
      code: 'A',
      title: 'Company Database',
      subtitle: `${stocks.length || 24} Large, Mid & Small Cap NSE firms`,
      Icon: Database,
      cardBg: MODULE_THEMES[0].cardBg,
      iconBg: MODULE_THEMES[0].iconBg,
      arrowText: MODULE_THEMES[0].arrowText,
    },
    {
      id: 'official',
      code: 'B',
      title: 'Official Websites',
      subtitle: 'NSE, BSE, IR, Annual Reports & Announcements',
      Icon: Globe,
      cardBg: MODULE_THEMES[1].cardBg,
      iconBg: MODULE_THEMES[1].iconBg,
      arrowText: MODULE_THEMES[1].arrowText,
    },
    {
      id: 'research',
      code: 'C–E',
      title: 'Stocks AI Research',
      subtitle: 'Auto-Sync Stock AI, SEBI Experts & Decision Engine',
      Icon: Sparkles,
      cardBg: MODULE_THEMES[2].cardBg,
      iconBg: MODULE_THEMES[2].iconBg,
      arrowText: MODULE_THEMES[2].arrowText,
    },
    {
      id: 'monitoring',
      code: 'F',
      title: '24/7 Monitoring',
      subtitle: 'Live news, price alerts & session breadth',
      Icon: Bell,
      cardBg: MODULE_THEMES[4].cardBg,
      iconBg: MODULE_THEMES[4].iconBg,
      arrowText: MODULE_THEMES[4].arrowText,
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardModuleGrid
        num="01"
        title="Stocks"
        description="Live NSE/BSE company database across Large, Mid & Small caps, high buying/selling order flow tracking, official filings, and Auto-Sync SEBI expert AI."
        marketStatus={marketStatus}
        syncedAt={syncedAt}
        isSyncing={loading}
        onSync={onRetry}
        onBack={onBack}
        modules={MODULE_CARDS}
        activeModule={subTab}
        onSelectModule={(id) => setSubTab(id as StocksTab)}
      />

      {/* Live Triggered Alerts Banner */}
      {triggeredAlerts.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs sm:text-sm text-amber-900">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-700 shrink-0" />
            <span>
              <strong>{triggeredAlerts.length} Price Alert(s) Triggered:</strong>{' '}
              {triggeredAlerts
                .slice(0, 3)
                .map((a) => `${a.ticker} ${a.condition} ${formatINR(a.targetPrice)}`)
                .join(' · ')}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSubTab('monitoring')}
            className="font-semibold text-amber-900 underline cursor-pointer"
          >
            View Alerts
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          <span>{error}</span>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* 4 Live Benchmarks (2x2 mobile, 4-col desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {loading && indices.length === 0
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-[108px] rounded-2xl border border-slate-200 bg-white p-4 animate-pulse"
              />
            ))
          : indices.map((idx) => {
              const isPos = idx.change >= 0;
              const isSel = idx.symbol === selectedIndexSymbol;
              return (
                <button
                  key={idx.symbol}
                  type="button"
                  onClick={() => setSelectedIndexSymbol(idx.symbol)}
                  className={`text-left rounded-2xl border p-4 sm:p-5 transition-all cursor-pointer ${
                    isSel
                      ? 'border-[#0D9488] bg-[#F0FDFA]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-600 truncate">
                      {idx.name}
                    </span>
                    <span
                      className={`inline-flex items-center text-xs font-mono font-semibold tabular-nums shrink-0 ${
                        isPos ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {isPos ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                      {formatSignedPercent(idx.percentChange)}
                    </span>
                  </div>
                  <div className="mt-2.5 flex items-end justify-between gap-2">
                    <div>
                      <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-slate-900">
                        {formatIndexValue(idx.price)}
                      </div>
                      <div className={`text-xs font-mono tabular-nums ${isPos ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {formatSignedChange(idx.change)}
                      </div>
                    </div>
                    <div className="hidden sm:block">
                      <Sparkline values={idx.sparkline} positive={isPos} />
                    </div>
                  </div>
                </button>
              );
            })}
      </div>

      {/* Live Index PriceChart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{activeIndex?.name || 'NIFTY 50'}</h2>
            {activeIndex && (
              <div className="mt-0.5 flex items-baseline gap-2.5 font-mono tabular-nums">
                <span className="text-xl font-bold text-slate-900">
                  {formatIndexValue(activeIndex.price)}
                </span>
                <span className={`text-xs font-semibold ${activeIndex.change >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {formatSignedChange(activeIndex.change)} ({formatSignedPercent(activeIndex.percentChange)})
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 border border-slate-200">
            {CHART_RANGES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setChartRange(r.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  chartRange === r.id
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
          points={indexDetail?.points || []}
          range={chartRange}
          previousClose={indexDetail?.previousClose ?? undefined}
          currencyPrefix=""
          height={220}
          loading={chartLoading}
        />
      </div>

      {/* MODULE A: COMPANY DATABASE + BEST 20 FUTURISTIC COMPANIES */}
      {subTab === 'database' && (
        <section className="space-y-4">
          {/* Sub-View Switcher: All Listed vs Best 20 Futuristic + Reasons */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDatabaseView('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  databaseView === 'all'
                    ? 'bg-[#0D9488] text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                All Listed Companies ({stocks.length})
              </button>
              <button
                type="button"
                onClick={() => setDatabaseView('futuristic')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  databaseView === 'futuristic'
                    ? 'bg-[#0D9488] text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Best 20 Futuristic + Early News
              </button>
            </div>
            <span className="text-xs text-slate-500">
              {databaseView === 'futuristic'
                ? '20 high-conviction futuristic companies synced with early breaking news'
                : 'Large, Mid & Small Cap NSE/BSE equities'}
            </span>
          </div>

          {databaseView === 'futuristic' ? (
            <FuturisticTop20
              dashboardId="stocks"
              dashboardTitle="Stocks"
              compactHeader
              onOpenChart={(item) => item.symbol && onSelectStock(item.symbol)}
              onAnalyzeItem={(item) => {
                if (!item.symbol) return;
                const matched = stocks.find((s) => s.symbol === item.symbol);
                runResearchPayload({
                  symbol: item.symbol,
                  companyName: item.name,
                  sector: matched?.sector || item.themeGroup,
                  capTier: matched?.capTier,
                  price: item.price ?? undefined,
                  percentChange: item.percentChange ?? undefined,
                  sma20: matched?.sma20,
                  sma50: matched?.sma50,
                  rsi14: matched?.rsi14,
                  volumeRatio: matched?.volumeRatio,
                });
              }}
            />
          ) : (
            <>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
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
                      All Flow ({stocks.length})
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

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'flow' | 'default')}
                    aria-label="Sort listed companies"
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-[#0D9488] focus:outline-none"
                  >
                    <option value="flow">Sort: High Buying / Selling First</option>
                    <option value="default">Sort: Index Benchmark Order</option>
                  </select>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {(['All', 'Large Cap', 'Mid Cap', 'Small Cap'] as const).map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setCapFilter(tier)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                          capFilter === tier
                            ? 'bg-slate-900 text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                    <select
                      value={sectorFilter}
                      onChange={(e) => setSectorFilter(e.target.value)}
                      aria-label="Filter by sector"
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-[#0D9488] focus:outline-none"
                    >
                      {sectors.map((sec) => (
                        <option key={sec} value={sec}>
                          Sector: {sec}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Live Search in Company Database + Global NSE/BSE lookup */}
                  <div className="relative w-full lg:w-[380px]">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={dbQuery}
                      onChange={(e) => setDbQuery(e.target.value)}
                      placeholder="Filter database or search any NSE/BSE stock..."
                      className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0D9488] focus:outline-none"
                    />
                    {dbQuery.trim().length >= 2 && liveHits.length > 0 && (
                      <div className="absolute left-0 right-0 top-full z-20 mt-1.5 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                        <div className="px-3.5 py-2 border-b border-slate-100 text-[11px] font-semibold text-slate-500 flex justify-between">
                          <span>Add Any NSE/BSE Listing</span>
                          {searchingGlobal && <span>Searching...</span>}
                        </div>
                        <div className="max-h-56 overflow-y-auto divide-y divide-slate-100">
                          {liveHits.map((hit) => (
                            <div key={hit.symbol} className="flex items-center justify-between gap-2 px-3.5 py-2 hover:bg-slate-50">
                              <button
                                type="button"
                                onClick={() => {
                                  onTrackSymbol(hit.symbol);
                                  onSelectStock(hit.symbol);
                                }}
                                className="text-left min-w-0 flex-1 cursor-pointer"
                              >
                                <div className="text-xs font-bold text-slate-900">{hit.ticker} · {hit.exchange}</div>
                                <div className="text-[11px] text-slate-500 truncate">{hit.name}</div>
                              </button>
                              {!stocks.some((s) => s.symbol === hit.symbol) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onTrackSymbol(hit.symbol);
                                    setDbQuery('');
                                  }}
                                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] font-semibold text-[#0D9488] hover:bg-teal-50 cursor-pointer shrink-0"
                                >
                                  <Plus className="h-3 w-3" />
                                  <span>Add</span>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                        <th className="py-3 pl-5 pr-3">Company</th>
                        <th className="py-3 px-3">Cap / Sector</th>
                        <th className="py-3 px-3 hidden md:table-cell">Buying / Selling Flow</th>
                        <th className="py-3 px-3 text-right">Price</th>
                        <th className="py-3 px-3 text-right">Day %</th>
                        <th className="py-3 px-3 text-right hidden lg:table-cell">Vol / 20D</th>
                        <th className="py-3 px-3 text-right hidden lg:table-cell">RSI(14)</th>
                        <th className="py-3 pl-3 pr-5 text-right">AI Research</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {loading && stocks.length === 0 ? (
                        Array.from({ length: 10 }).map((_, idx) => (
                          <tr key={idx}>
                            <td colSpan={8} className="px-5 py-3">
                              <div className="h-5 rounded bg-slate-100 animate-pulse" />
                            </td>
                          </tr>
                        ))
                      ) : filteredStocks.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-10 text-center text-sm text-slate-500">
                            No listed companies match the active filters.
                          </td>
                        </tr>
                      ) : (
                        filteredStocks.map((stk) => {
                          const pos = (stk.change ?? 0) >= 0;
                          const flowTone =
                            stk.orderFlowType === 'buying'
                              ? 'text-emerald-700'
                              : stk.orderFlowType === 'selling'
                                ? 'text-rose-600'
                                : 'text-slate-500';
                          return (
                            <tr
                              key={stk.symbol}
                              onClick={() => onSelectStock(stk.symbol)}
                              className="hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <td className="py-3 pl-5 pr-3">
                                <div className="font-semibold text-slate-900">{stk.ticker}</div>
                                <div className="text-xs text-slate-500 truncate max-w-[200px]">
                                  {stk.name}
                                </div>
                              </td>
                              <td className="py-3 px-3 text-xs whitespace-nowrap">
                                <div className="font-medium text-slate-700">{stk.capTier || 'NSE'}</div>
                                <div className="text-slate-500">{stk.sector}</div>
                              </td>
                              <td className="py-3 px-3 text-xs hidden md:table-cell whitespace-nowrap">
                                <span className={`font-semibold ${flowTone}`}>
                                  {stk.orderFlowLabel || 'Balanced Flow'}
                                </span>
                                <div className="text-[11px] font-mono tabular-nums text-slate-400">
                                  Vol {formatCompactVolume(stk.volume)}
                                </div>
                              </td>
                              <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">
                                {formatINR(stk.price)}
                              </td>
                              <td
                                className={`py-3 px-3 text-right font-mono tabular-nums font-semibold whitespace-nowrap ${
                                  pos ? 'text-emerald-700' : 'text-rose-600'
                                }`}
                              >
                                {formatSignedPercent(stk.percentChange)}
                              </td>
                              <td className="py-3 px-3 text-right font-mono tabular-nums text-xs text-slate-700 hidden lg:table-cell whitespace-nowrap">
                                {stk.volumeRatio ? `${stk.volumeRatio}x` : '—'}
                              </td>
                              <td className="py-3 px-3 text-right font-mono tabular-nums text-xs text-slate-600 hidden lg:table-cell whitespace-nowrap">
                                {stk.rsi14 ?? '—'}
                              </td>
                              <td
                                className="py-3 pl-3 pr-5 text-right whitespace-nowrap"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRunStocksResearch(stk, false, true);
                                }}
                              >
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-1 rounded-lg border border-teal-200 bg-teal-50/70 px-2.5 py-1.5 text-xs font-semibold text-[#0D9488] hover:bg-teal-100 cursor-pointer"
                                >
                                  <Sparkles className="h-3 w-3" />
                                  <span>Analyze</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </section>
      )}

      {/* MODULE B: OFFICIAL WEBSITES */}
      {subTab === 'official' && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Official Exchange &amp; Corporate Filings Directory
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct verified links to NSE India, BSE India, Investor Relations, Annual Reports, and Exchange Announcements
              </p>
            </div>
            <select
              value={focusSymbol}
              onChange={(e) => setFocusSymbol(e.target.value)}
              aria-label="Select company for official links"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-900 focus:border-[#0D9488] focus:outline-none"
            >
              {!stocks.some((s) => s.symbol === focusSymbol) && focusSymbol && (
                <option value={focusSymbol}>{focusSymbol}</option>
              )}
              {stocks.map((s) => (
                <option key={s.symbol} value={s.symbol}>
                  {s.ticker} — {s.name}
                </option>
              ))}
            </select>
          </div>

          {focusedStock?.officialLinks && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: 'NSE India Equity Quote',
                  desc: `Live official order book, market depth & corporate filings for ${focusedStock.ticker}`,
                  url: focusedStock.officialLinks.nse,
                },
                {
                  title: 'BSE India Stock Page',
                  desc: `Bombay Stock Exchange equity profile, circulars & historical data`,
                  url: focusedStock.officialLinks.bse,
                },
                {
                  title: 'Company Investor Relations',
                  desc: `Official ${focusedStock.name} investor relations hub & presentations`,
                  url: focusedStock.officialLinks.investorRelations,
                },
                {
                  title: 'Company Annual Reports',
                  desc: `Audited statutory annual reports, balance sheets & shareholder letters`,
                  url: focusedStock.officialLinks.annualReports,
                },
                {
                  title: 'Exchange Announcements',
                  desc: `Real-time NSE Regulation 30 filings, board meetings & quarterly outcomes`,
                  url: focusedStock.officialLinks.announcements,
                },
              ].map((linkItem) => (
                <a
                  key={linkItem.title}
                  href={linkItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-5 hover:border-[#0D9488] hover:bg-[#F0FDFA] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <Building2 className="h-4 w-4 text-[#0D9488]" />
                      <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-[#0D9488]" />
                    </div>
                    <h3 className="mt-3 text-sm font-bold text-slate-900">
                      {linkItem.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      {linkItem.desc}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      )}

      {/* MODULES C, D, E: OWN STOCKS RESEARCH AI (Stock Analysis AI + Expert Research AI + Decision Engine) */}
      {subTab === 'research' && (
        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Stocks AI Research &amp; Decision Engine
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Combines live NSE technicals (20/50 DMA, 14D RSI, Volume Ratio) with search-grounded Gemini analysis &amp; SEBI analyst consensus
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  value={focusSymbol}
                  onChange={(e) => setFocusSymbol(e.target.value)}
                  aria-label="Select company for AI research"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-900 focus:border-[#0D9488] focus:outline-none"
                >
                  {!stocks.some((s) => s.symbol === focusSymbol) && focusSymbol && (
                    <option value={focusSymbol}>{focusSymbol}</option>
                  )}
                  {stocks.map((s) => (
                    <option key={s.symbol} value={s.symbol}>
                      {s.ticker} ({s.capTier || 'NSE'})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setAutoSyncAi((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    autoSyncAi
                      ? 'border-teal-200 bg-teal-50 text-[#0F766E]'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${researchLoading && autoSyncAi ? 'animate-spin' : ''}`} />
                  <span>{autoSyncAi ? 'Auto-Sync AI: On' : 'Auto-Sync AI: Paused'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRunStocksResearch(undefined, true, false)}
                  disabled={researchLoading || !focusedStock}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0D9488] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0F766E] disabled:opacity-60 cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>
                    {researchLoading
                      ? 'Syncing AI Research...'
                      : activeResearch
                        ? 'Refresh AI'
                        : 'Run Stocks Research AI'}
                  </span>
                </button>
              </div>
            </div>

            {/* Optional Custom Research Question */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRunStocksResearch(undefined, true);
              }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            >
              <input
                type="text"
                value={researchQuestion}
                onChange={(e) => setResearchQuestion(e.target.value)}
                placeholder={`Ask a specific question about ${focusedStock?.ticker || 'this company'} (e.g. "2026 growth catalysts, moat or entry zone")...`}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0D9488] focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={researchLoading || !focusedStock}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60 cursor-pointer whitespace-nowrap"
              >
                Ask &amp; Analyze
              </button>
            </form>

            {/* Live Quantitative Anchor Metrics (Always live from NSE) */}
            {focusedStock && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <div className="text-xs text-slate-500">Live Price</div>
                  <div className="mt-1 text-sm font-bold font-mono tabular-nums text-slate-900">
                    {formatINR(focusedStock.price)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">20-Day SMA</div>
                  <div className="mt-1 text-sm font-bold font-mono tabular-nums text-slate-900">
                    {focusedStock.sma20 ? formatINR(focusedStock.sma20) : '—'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">50-Day SMA</div>
                  <div className="mt-1 text-sm font-bold font-mono tabular-nums text-slate-900">
                    {focusedStock.sma50 ? formatINR(focusedStock.sma50) : '—'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">14-Day RSI</div>
                  <div className="mt-1 text-sm font-bold font-mono tabular-nums text-slate-900">
                    {focusedStock.rsi14 ?? '—'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Volume / 20D Avg</div>
                  <div className="mt-1 text-sm font-bold font-mono tabular-nums text-slate-900">
                    {focusedStock.volumeRatio ? `${focusedStock.volumeRatio}x` : '—'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Cap Tier</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">
                    {focusedStock.capTier || 'NSE'}
                  </div>
                </div>
              </div>
            )}

            {researchError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                {researchError}
              </div>
            )}

            {researchLoading && !activeResearch && (
              <div className="space-y-4 pt-2 animate-pulse">
                <div className="h-24 rounded-xl bg-slate-100" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="h-28 rounded-xl bg-slate-100" />
                  <div className="h-28 rounded-xl bg-slate-100" />
                  <div className="h-28 rounded-xl bg-slate-100" />
                </div>
              </div>
            )}

            {!activeResearch && !researchLoading && !researchError && (
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-8 text-center">
                <p className="text-sm font-medium text-slate-700">
                  Select any company above and click <strong>Run Stocks Research AI</strong> to generate C. Stock Analysis AI, D. Expert Research AI, and E. Decision Engine output.
                </p>
              </div>
            )}
          </div>

          {activeResearch && (
            <>
              {/* Module E: Decision Engine */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      E. Decision Engine — {activeResearch.companyName}
                    </h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {activeResearch.researchMode === 'live-quant-news'
                        ? 'Live Exchange Quant & RSS Wire Synthesis'
                        : 'Search-Grounded Institutional AI + Live Wire'}{' '}
                      · Generated{' '}
                      <span className="font-mono">
                        {new Date(activeResearch.generatedAt).toLocaleTimeString('en-IN', {
                          timeZone: 'Asia/Kolkata',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}{' '}
                        IST
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">Directional Stance</div>
                    <div
                      className={`mt-1 text-xl font-bold ${
                        activeResearch.decisionEngine.stance === 'Bullish'
                          ? 'text-emerald-700'
                          : activeResearch.decisionEngine.stance === 'Bearish'
                            ? 'text-rose-600'
                            : 'text-slate-900'
                      }`}
                    >
                      {activeResearch.decisionEngine.stance}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">Risk Score</div>
                    <div className="mt-1 text-xl font-bold font-mono tabular-nums text-slate-900">
                      {activeResearch.decisionEngine.riskScore}/10 · {activeResearch.decisionEngine.riskLabel}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">Investment Horizon</div>
                    <div className="mt-1 text-sm font-bold text-slate-900">
                      {activeResearch.decisionEngine.investmentHorizon}
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">AI Confidence</div>
                    <div className="mt-1 text-xl font-bold font-mono tabular-nums text-[#0D9488]">
                      {activeResearch.decisionEngine.confidence}%
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-700">Reasons &amp; Evidence</div>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    {activeResearch.decisionEngine.reasons.map((r, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-[#0D9488] shrink-0">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Module C: Stock Analysis AI */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-900">
                  C. Stock Analysis AI
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: 'Live Price Analysis', text: activeResearch.stockAnalysis.livePriceAnalysis },
                    { title: 'Technical Analysis', text: activeResearch.stockAnalysis.technicalAnalysis },
                    { title: 'Fundamental Analysis', text: activeResearch.stockAnalysis.fundamentalAnalysis },
                    { title: 'Volume Analysis', text: activeResearch.stockAnalysis.volumeAnalysis },
                    { title: 'Financial Results', text: activeResearch.stockAnalysis.financialResults },
                    { title: 'News Analysis', text: activeResearch.stockAnalysis.newsAnalysis },
                  ].map((block) => (
                    <div key={block.title} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                      <h4 className="text-xs font-bold text-slate-900">{block.title}</h4>
                      <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {block.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module D: Expert Research AI */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#0D9488]" />
                  <h3 className="text-base font-bold text-slate-900">
                    D. Expert Research AI (SEBI &amp; Source Verification)
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'SEBI-Registered Analysts', text: activeResearch.expertResearch.sebiAnalysts },
                    { title: 'Verified Expert Research', text: activeResearch.expertResearch.verifiedResearch },
                    { title: 'Expert Opinion Tracking', text: activeResearch.expertResearch.opinionTracking },
                    { title: 'Source Verification', text: activeResearch.expertResearch.sourceVerification },
                  ].map((block) => (
                    <div key={block.title} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                      <h4 className="text-xs font-bold text-slate-900">{block.title}</h4>
                      <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {block.text}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h4 className="text-xs font-bold text-slate-900">Conflict-of-Interest Check</h4>
                  <p className="mt-1 text-xs text-slate-600">
                    {activeResearch.expertResearch.conflictCheck}
                  </p>
                </div>

                {activeResearch.sources.length > 0 && (
                  <div className="pt-3 border-t border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 mb-2">
                      Verified Citations
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-2">
                      {activeResearch.sources.map((src, idx) => (
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
            </>
          )}
        </section>
      )}

      {/* MODULE F: MONITORING (24/7 News, Market-Hours Price Monitor, Price Alerts, Daily Reports) */}
      {subTab === 'monitoring' && (
        <section className="space-y-6">
          {/* Market-Hours Monitor + Daily Reports Strip */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Market-Hours Price Monitoring
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    30-second live NSE polling · {marketStatus?.tradingHours || '09:15 AM – 03:30 PM IST'}
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#0F766E]">
                  24x7 Automated Alerts Active
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">Advancers</div>
                  <div className="mt-1 text-xl font-bold font-mono tabular-nums text-emerald-700">
                    {advancers}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">Decliners</div>
                  <div className="mt-1 text-xl font-bold font-mono tabular-nums text-rose-600">
                    {decliners}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">Tracked Equities</div>
                  <div className="mt-1 text-xl font-bold font-mono tabular-nums text-slate-900">
                    {stocks.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Price Alerts Builder */}
            <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Live Price Alerts</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Evaluated automatically on every live sync
                </p>
              </div>

              <form onSubmit={handleAddAlert} className="grid grid-cols-12 gap-2">
                <select
                  value={alertSymbol}
                  onChange={(e) => setAlertSymbol(e.target.value)}
                  className="col-span-5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-900"
                >
                  {stocks.map((s) => (
                    <option key={s.symbol} value={s.symbol}>
                      {s.ticker}
                    </option>
                  ))}
                </select>
                <select
                  value={alertCondition}
                  onChange={(e) => setAlertCondition(e.target.value as 'above' | 'below')}
                  className="col-span-3 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-xs font-medium text-slate-800"
                >
                  <option value="above">Above</option>
                  <option value="below">Below</option>
                </select>
                <input
                  type="number"
                  step="0.05"
                  value={alertPriceInput}
                  onChange={(e) => setAlertPriceInput(e.target.value)}
                  placeholder="₹ Target"
                  className="col-span-4 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-mono text-slate-900 focus:border-[#0D9488] focus:outline-none"
                />
                <button
                  type="submit"
                  className="col-span-12 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
                >
                  Set Price Alert
                </button>
              </form>

              {alerts.length > 0 && (
                <div className="divide-y divide-slate-100 max-h-36 overflow-y-auto">
                  {alerts.map((al) => (
                    <div key={al.id} className="flex items-center justify-between py-2 text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{al.ticker}</span>{' '}
                        <span className="text-slate-600">
                          {al.condition} {formatINR(al.targetPrice)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold ${
                            al.triggeredAt ? 'text-amber-700' : 'text-emerald-700'
                          }`}
                        >
                          {al.triggeredAt ? 'Triggered' : 'Active'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setAlerts((prev) => prev.filter((x) => x.id !== al.id))}
                          aria-label="Delete alert"
                          className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 24/7 Live News Monitoring */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Newspaper className="h-4 w-4 text-[#0D9488]" />
                <h2 className="text-base font-bold text-slate-900">
                  24/7 Live Indian Market News Monitor
                </h2>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchLiveNews(newsQuery);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={newsQuery}
                  onChange={(e) => setNewsQuery(e.target.value)}
                  placeholder="Filter news (e.g. Reliance, IT, RBI)"
                  className="w-52 sm:w-64 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:border-[#0D9488] focus:bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={newsLoading}
                  className="rounded-lg bg-[#0D9488] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0F766E] cursor-pointer"
                >
                  {newsLoading ? 'Loading...' : 'Refresh News'}
                </button>
              </form>
            </div>

            {newsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-pulse">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="h-20 rounded-xl bg-slate-100" />
                ))}
              </div>
            ) : newsArticles.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No news articles loaded. Click Refresh News to query the live wire.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {newsArticles.map((art, idx) => (
                  <a
                    key={idx}
                    href={art.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:border-[#0D9488] hover:bg-[#F0FDFA] transition-colors"
                  >
                    <div className="text-sm font-semibold text-slate-900 group-hover:text-[#0F766E] leading-snug">
                      {art.title}
                    </div>
                    <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
                      <span>{art.source}</span>
                      <span className="inline-flex items-center gap-1 text-[#0284C7]">
                        <span>Read</span>
                        <ExternalLink className="h-3 w-3" />
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
