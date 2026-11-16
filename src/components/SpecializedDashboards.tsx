import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Building2,
  CandlestickChart,
  Coins,
  Database,
  ExternalLink,
  Gem,
  Globe,
  Landmark,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  BondReferenceRecord,
  ChartRange,
  DashboardId,
  FnoIndexItem,
  IpoRecord,
  MarketStatus,
  MutualFundSummary,
  SgbRecord,
  StockDetail,
} from '../types/market';
import {
  formatCompactVolume,
  formatINR,
  formatIndexValue,
  formatSignedChange,
  formatSignedPercent,
} from '../utils/format';
import { PriceChart } from './PriceChart';
import { Sparkline } from './Sparkline';
import { DashboardModuleGrid, MODULE_THEMES, ModuleCardSpec } from './DashboardModuleGrid';
import { OfficialSourcesGrid } from './OfficialSourcesGrid';
import { StructuredDashboardAI } from './StructuredDashboardAI';
import { DashboardMonitoringPanel, MonitorMetricItem } from './DashboardMonitoringPanel';
import { FnoChainPanel, getUpcomingExpiries } from './FnoChainPanel';
import { getOfficialSourcesForDashboard } from '../data/officialSources';
import { FuturisticTop20 } from './FuturisticTop20';

interface SpecializedDashboardsProps {
  dashboardId: Exclude<DashboardId, 'stocks' | 'mutual-funds'>;
  onBack: () => void;
  onOpenStock?: (symbol: string) => void;
}

type ModuleTab = 'database' | 'official' | 'ai' | 'expert' | 'monitoring';

const META: Record<
  Exclude<DashboardId, 'stocks' | 'mutual-funds'>,
  {
    num: string;
    title: string;
    subtitle: string;
    defaultChartSymbol: string;
    defaultRange: ChartRange;
    hasExpertModule: boolean;
    dbModuleTitle: string;
    aiModuleTitle: string;
    sessionHours: string;
  }
> = {
  intraday: {
    num: '03',
    title: 'Intraday',
    subtitle: '22 liquid NSE stocks ranked by live buying/selling breakouts, 1m/5m/15m charts, VWAP, RSI & MACD signals.',
    defaultChartSymbol: 'RELIANCE.NS',
    defaultRange: '5m',
    hasExpertModule: true,
    dbModuleTitle: 'Stock Universe',
    aiModuleTitle: 'Intraday AI',
    sessionHours: 'Pre-Open 09:00 · Live 09:15–15:30 IST',
  },
  fno: {
    num: '04',
    title: 'Futures & Options',
    subtitle: '21 F&O underlyings, live India VIX, Option Chain, Black-Scholes Greeks, PCR, expiry calendar & risk scenarios.',
    defaultChartSymbol: '^NSEI',
    defaultRange: '5m',
    hasExpertModule: true,
    dbModuleTitle: 'Instruments',
    aiModuleTitle: 'F&O AI',
    sessionHours: 'NSE Derivatives 09:15 AM – 03:30 PM IST',
  },
  etfs: {
    num: '05',
    title: 'ETFs',
    subtitle: '24 live NSE ETFs across Nifty, Sensex, Sector, Gold & International categories with iNAV, expense ratio & tracking error.',
    defaultChartSymbol: 'NIFTYBEES.NS',
    defaultRange: '1mo',
    hasExpertModule: false,
    dbModuleTitle: 'ETF Database',
    aiModuleTitle: 'ETF AI',
    sessionHours: 'NSE Cash Session 09:15 AM – 03:30 PM IST',
  },
  ipo: {
    num: '06',
    title: 'IPO',
    subtitle: '22 IPO candidates & listed companies ranked by live subscription demand, listing gains & DRHP/registrar links.',
    defaultChartSymbol: 'HYUNDAI.NS',
    defaultRange: '3mo',
    hasExpertModule: true,
    dbModuleTitle: 'IPO Database',
    aiModuleTitle: 'IPO Analysis AI',
    sessionHours: 'IPO Bidding 10:00 AM – 05:00 PM IST',
  },
  gold: {
    num: '07',
    title: 'Gold',
    subtitle: 'Live Gold ETFs, AMFI Gold Mutual Funds, Sovereign Gold Bond (SGB) parity, MCX 24K/22K India spot & COMEX benchmarks.',
    defaultChartSymbol: 'GC=F',
    defaultRange: '1mo',
    hasExpertModule: false,
    dbModuleTitle: 'Gold Database',
    aiModuleTitle: 'Gold AI',
    sessionHours: 'MCX Bullion 09:00 AM – 11:30 PM IST · COMEX 24x5',
  },
  silver: {
    num: '08',
    title: 'Silver',
    subtitle: 'Live Silver ETFs, AMFI Silver Funds, MCX INR/kg parity, COMEX Silver, Gold-to-Silver ratio & solar demand insights.',
    defaultChartSymbol: 'SI=F',
    defaultRange: '1mo',
    hasExpertModule: false,
    dbModuleTitle: 'Silver Database',
    aiModuleTitle: 'Silver AI',
    sessionHours: 'MCX Bullion 09:00 AM – 11:30 PM IST · COMEX 24x5',
  },
  bonds: {
    num: '09',
    title: 'Bonds',
    subtitle: 'Government securities, T-Bills, Corporate Bonds, SDLs & Listed Debt ETFs/Funds with yield sensitivity & RBI watch.',
    defaultChartSymbol: 'LTGILTBEES.NS',
    defaultRange: '3mo',
    hasExpertModule: false,
    dbModuleTitle: 'Bond Database',
    aiModuleTitle: 'Bond AI',
    sessionHours: 'RBI NDS-OM 09:00 AM – 05:00 PM IST',
  },
  commodities: {
    num: '10',
    title: 'Commodities',
    subtitle: 'Live Crude Oil, Natural Gas, Copper, Aluminium, Zinc, Nickel, Cotton & Agri benchmarks with USD/INR parity.',
    defaultChartSymbol: 'BZ=F',
    defaultRange: '1mo',
    hasExpertModule: false,
    dbModuleTitle: 'Commodity Database',
    aiModuleTitle: 'Commodity AI',
    sessionHours: 'MCX Non-Agri 09:00–23:30 IST · NCDEX Agri 09:00–17:00 IST',
  },
};

export const SpecializedDashboards: React.FC<SpecializedDashboardsProps> = ({
  dashboardId,
  onBack,
  onOpenStock,
}) => {
  const cfg = META[dashboardId];
  const [activeModule, setActiveModule] = useState<ModuleTab>('database');
  const [databaseView, setDatabaseView] = useState<'all' | 'futuristic'>('all');
  const [customAiFocus, setCustomAiFocus] = useState<string | null>(null);
  const [payload, setPayload] = useState<any>(null);
  const [marketStatus, setMarketStatus] = useState<MarketStatus | null>(null);
  const [syncedAt, setSyncedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quickFilter, setQuickFilter] = useState('');
  const [subFilter, setSubFilter] = useState<string>('All');
  const [flowFilter, setFlowFilter] = useState<'all' | 'buying' | 'selling'>('all');
  const [chartSymbol, setChartSymbol] = useState<string>(cfg.defaultChartSymbol);
  const [chartRange, setChartRange] = useState<ChartRange>(cfg.defaultRange);
  const [chartDetail, setChartDetail] = useState<StockDetail | null>(null);
  const [chartLoading, setChartLoading] = useState(true);

  // Bonds Yield Sensitivity Calculator state
  const [rateShockBps, setRateShockBps] = useState<number>(-25);
  // F&O Option Chain Focus mode
  const [fnoOptionFocus, setFnoOptionFocus] = useState<'all' | 'ce' | 'pe'>('all');

  const fetchDashboard = async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/dashboard/${dashboardId}${force ? '?force=true' : ''}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to load dashboard');
      setPayload(data);
      if (data.marketStatus) setMarketStatus(data.marketStatus);
      if (data.syncedAt) setSyncedAt(data.syncedAt);
    } catch (err: any) {
      setError(err?.message || 'Unable to connect to live feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setActiveModule('database');
    setDatabaseView('all');
    setCustomAiFocus(null);
    setSubFilter('All');
    setFlowFilter('all');
    setQuickFilter('');
    setChartSymbol(cfg.defaultChartSymbol);
    setChartRange(cfg.defaultRange);
    fetchDashboard(false);

    const interval = setInterval(() => fetchDashboard(false), 30_000);
    return () => clearInterval(interval);
  }, [dashboardId]);

  useEffect(() => {
    let cancelled = false;
    setChartLoading(true);
    fetch(`/api/stock/${encodeURIComponent(chartSymbol)}?range=${chartRange}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && !data?.error) setChartDetail(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setChartLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [chartSymbol, chartRange]);

  const rawListItems: any[] = useMemo(() => {
    if (!payload) return [];
    if (dashboardId === 'ipo') return payload.records || [];
    if (dashboardId === 'gold' || dashboardId === 'silver') return payload.etfs || [];
    return payload.items || payload.etfs || payload.instruments || payload.indices || [];
  }, [payload, dashboardId]);

  const buyingCount = useMemo(
    () => rawListItems.filter((i) => i.orderFlowType === 'buying').length,
    [rawListItems]
  );
  const sellingCount = useMemo(
    () => rawListItems.filter((i) => i.orderFlowType === 'selling').length,
    [rawListItems]
  );

  // Dashboard-specific Database Sub-Filtering & Flow Sorting
  const visibleItems = useMemo(() => {
    const q = quickFilter.trim().toLowerCase();
    let list = [...rawListItems];

    if (flowFilter !== 'all') {
      list = list.filter((i) => i.orderFlowType === flowFilter);
    }

    if (dashboardId === 'intraday') {
      if (subFilter === 'Volume Leaders') {
        list.sort((a, b) => (b.volumeRatio ?? 0) - (a.volumeRatio ?? 0));
      } else if (subFilter === 'High Liquidity') {
        list.sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0));
      } else if (subFilter === 'Volatility Watchlist') {
        list.sort((a, b) => (b.volatilityPct ?? 0) - (a.volatilityPct ?? 0));
      } else {
        list.sort((a, b) => (b.flowScore ?? 0) - (a.flowScore ?? 0));
      }
    } else if (dashboardId === 'fno' && subFilter !== 'All') {
      if (subFilter === 'Index Futures') list = list.filter((i) => i.instrumentType === 'Index');
      else if (subFilter === 'Stock Futures') list = list.filter((i) => i.instrumentType === 'Stock');
    } else if (dashboardId === 'etfs' && subFilter !== 'All') {
      list = list.filter((i) => i.category === subFilter);
    } else if (dashboardId === 'ipo' && subFilter !== 'All') {
      list = list.filter((i) => i.status === subFilter);
    } else if (dashboardId === 'commodities' && subFilter !== 'All') {
      list = list.filter((i) => i.category === subFilter);
    }

    if (q) {
      list = list.filter(
        (i) =>
          (i.name || i.companyName || '').toLowerCase().includes(q) ||
          (i.ticker || '').toLowerCase().includes(q) ||
          (i.sector || i.category || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [rawListItems, dashboardId, subFilter, flowFilter, quickFilter]);

  const monitorInstruments: MonitorMetricItem[] = useMemo(() => {
    return rawListItems
      .filter((i) => typeof i.price === 'number' && i.symbol)
      .map((i) => ({
        symbol: i.symbol,
        ticker: i.ticker || i.name,
        price: i.price,
      }));
  }, [rawListItems]);

  // Module Cards matching Homepage 2x2 Mobile / Auto Desktop Grid
  const MODULE_CARDS: Array<ModuleCardSpec<ModuleTab>> = [
    {
      id: 'database',
      code: 'A',
      title: cfg.dbModuleTitle,
      subtitle: `${rawListItems.length || '20+'} live tracked records & categories`,
      Icon:
        dashboardId === 'fno'
          ? CandlestickChart
          : dashboardId === 'gold'
            ? Coins
            : dashboardId === 'silver'
              ? Gem
              : dashboardId === 'bonds'
                ? Landmark
                : dashboardId === 'etfs'
                  ? Layers
                  : dashboardId === 'ipo'
                    ? Building2
                    : dashboardId === 'intraday'
                      ? Activity
                      : Database,
      cardBg: MODULE_THEMES[0].cardBg,
      iconBg: MODULE_THEMES[0].iconBg,
      arrowText: MODULE_THEMES[0].arrowText,
    },
    {
      id: 'official',
      code: 'B',
      title: dashboardId === 'intraday' ? 'Data Sources' : 'Official Sources',
      subtitle: 'Direct exchange, RBI, SEBI & registrar links',
      Icon: Globe,
      cardBg: MODULE_THEMES[1].cardBg,
      iconBg: MODULE_THEMES[1].iconBg,
      arrowText: MODULE_THEMES[1].arrowText,
    },
    {
      id: 'ai',
      code: 'C',
      title: cfg.aiModuleTitle,
      subtitle: 'Auto-Sync charts, indicators & grounded AI',
      Icon: Sparkles,
      cardBg: MODULE_THEMES[2].cardBg,
      iconBg: MODULE_THEMES[2].iconBg,
      arrowText: MODULE_THEMES[2].arrowText,
    },
    ...(cfg.hasExpertModule
      ? [
          {
            id: 'expert' as const,
            code: 'D',
            title: dashboardId === 'fno' ? 'Expert Verification AI' : dashboardId === 'ipo' ? 'Expert AI' : 'Expert Verification',
            subtitle: 'Verified commentary, source comparison & track record',
            Icon: ShieldCheck,
            cardBg: MODULE_THEMES[3].cardBg,
            iconBg: MODULE_THEMES[3].iconBg,
            arrowText: MODULE_THEMES[3].arrowText,
          },
        ]
      : []),
    {
      id: 'monitoring',
      code: cfg.hasExpertModule ? 'E' : 'D',
      title: 'Monitoring',
      subtitle: '24/7 news, session alerts & live stream',
      Icon: Bell,
      cardBg: MODULE_THEMES[4].cardBg,
      iconBg: MODULE_THEMES[4].iconBg,
      arrowText: MODULE_THEMES[4].arrowText,
    },
  ];

  const isUsdAsset =
    chartDetail?.currency === 'USD' ||
    chartSymbol.includes('=F') ||
    (!chartSymbol.endsWith('.NS') &&
      !chartSymbol.endsWith('.BO') &&
      !chartSymbol.startsWith('^') &&
      chartSymbol !== 'DX-Y.NYB');
  const currencyPrefix =
    chartSymbol === '^TNX' || chartSymbol === 'DX-Y.NYB' ? '' : isUsdAsset ? '$' : '₹';

  const RANGES: Array<{ id: ChartRange; label: string }> =
    dashboardId === 'intraday'
      ? [
          { id: '1m', label: '1m' },
          { id: '5m', label: '5m' },
          { id: '15m', label: '15m' },
          { id: '5d', label: '1W' },
          { id: '1mo', label: '1M' },
        ]
      : [
          { id: '1d', label: '1D' },
          { id: '5d', label: '1W' },
          { id: '1mo', label: '1M' },
          { id: '3mo', label: '3M' },
          { id: '1y', label: '1Y' },
        ];

  const selectedItem =
    rawListItems.find((i) => i.symbol === chartSymbol) || rawListItems[0] || null;

  const renderTopBannerMetrics = () => {
    if (!payload) return null;
    if (dashboardId === 'gold') {
      return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5">
            <div className="text-xs text-slate-600">24K India Parity (10g)</div>
            <div className="mt-1.5 text-lg sm:text-2xl font-bold font-mono tabular-nums text-amber-800">
              {payload.parity24k10g ? formatINR(payload.parity24k10g, 0) : '—'}
            </div>
            <div className="mt-1 text-xs text-slate-500">MCX / Physical Benchmark</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="text-xs text-slate-600">22K India Parity (10g)</div>
            <div className="mt-1.5 text-lg sm:text-2xl font-bold font-mono tabular-nums text-slate-900">
              {payload.parity22k10g ? formatINR(payload.parity22k10g, 0) : '—'}
            </div>
            <div className="mt-1 text-xs text-slate-500">91.6% Jewellery Purity</div>
          </div>
          {payload.comex && (
            <button
              type="button"
              onClick={() => setChartSymbol('GC=F')}
              className="text-left rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 hover:border-slate-300 cursor-pointer"
            >
              <div className="flex justify-between text-xs text-slate-600">
                <span>COMEX Gold</span>
                <span className={payload.comex.change >= 0 ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-semibold'}>
                  {formatSignedPercent(payload.comex.percentChange)}
                </span>
              </div>
              <div className="mt-1.5 text-lg sm:text-2xl font-bold font-mono tabular-nums text-slate-900">
                ${payload.comex.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </button>
          )}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="text-xs text-slate-600">USD/INR &amp; Dollar Index</div>
            <div className="mt-1.5 text-base sm:text-xl font-bold font-mono tabular-nums text-slate-900">
              {payload.usdInr ? `₹${payload.usdInr.price.toFixed(2)}` : '—'} · {payload.dxy ? payload.dxy.price.toFixed(1) : '—'}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              US 10Y: {payload.us10y ? `${payload.us10y.price.toFixed(2)}%` : '—'}
            </div>
          </div>
        </div>
      );
    }

    if (dashboardId === 'silver') {
      return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4 sm:p-5">
            <div className="text-xs text-slate-600">India Silver Parity (1 kg)</div>
            <div className="mt-1.5 text-lg sm:text-2xl font-bold font-mono tabular-nums text-cyan-900">
              {payload.parity1kg ? formatINR(payload.parity1kg, 0) : '—'}
            </div>
            <div className="mt-1 text-xs text-slate-500">MCX / Bullion Parity</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="text-xs text-slate-600">Gold / Silver Ratio</div>
            <div className="mt-1.5 text-lg sm:text-2xl font-bold font-mono tabular-nums text-slate-900">
              {payload.goldSilverRatio ? `${payload.goldSilverRatio}x` : '—'}
            </div>
            <div className="mt-1 text-xs text-slate-500">Oz Silver per Oz Gold</div>
          </div>
          {payload.comex && (
            <button
              type="button"
              onClick={() => setChartSymbol('SI=F')}
              className="text-left rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 hover:border-slate-300 cursor-pointer"
            >
              <div className="flex justify-between text-xs text-slate-600">
                <span>COMEX Silver</span>
                <span className={payload.comex.change >= 0 ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-semibold'}>
                  {formatSignedPercent(payload.comex.percentChange)}
                </span>
              </div>
              <div className="mt-1.5 text-lg sm:text-2xl font-bold font-mono tabular-nums text-slate-900">
                ${payload.comex.price.toFixed(2)}
              </div>
            </button>
          )}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <div className="text-xs text-slate-600">USD / INR Spot</div>
            <div className="mt-1.5 text-lg sm:text-2xl font-bold font-mono tabular-nums text-slate-900">
              {payload.usdInr ? `₹${payload.usdInr.price.toFixed(2)}` : '—'}
            </div>
            <div className="mt-1 text-xs text-slate-500">Import currency rate</div>
          </div>
        </div>
      );
    }

    if (dashboardId === 'fno') {
      const topIndices: FnoIndexItem[] = (payload.indices || []).slice(0, 3);
      return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {payload.vix && (
            <button
              type="button"
              onClick={() => setChartSymbol('^INDIAVIX')}
              className="text-left rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 sm:p-5 hover:border-indigo-300 cursor-pointer"
            >
              <div className="flex justify-between text-xs text-slate-600">
                <span>INDIA VIX</span>
                <span className={payload.vix.change >= 0 ? 'text-rose-600 font-semibold' : 'text-emerald-700 font-semibold'}>
                  {formatSignedPercent(payload.vix.percentChange)}
                </span>
              </div>
              <div className="mt-1.5 text-lg sm:text-2xl font-bold font-mono tabular-nums text-slate-900">
                {payload.vix.price.toFixed(2)}
              </div>
              <div className="mt-1 text-xs text-slate-500">Implied volatility</div>
            </button>
          )}
          {topIndices.map((idx) => (
            <button
              key={idx.symbol}
              type="button"
              onClick={() => setChartSymbol(idx.symbol)}
              className="text-left rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 hover:border-slate-300 cursor-pointer"
            >
              <div className="flex justify-between text-xs text-slate-600">
                <span>{idx.name}</span>
                <span className={idx.change >= 0 ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-semibold'}>
                  {formatSignedPercent(idx.percentChange)}
                </span>
              </div>
              <div className="mt-1.5 text-lg sm:text-xl font-bold font-mono tabular-nums text-slate-900">
                {formatIndexValue(idx.price)}
              </div>
              {idx.levels && (
                <div className="mt-1 text-xs font-mono text-slate-500">
                  ATM {idx.levels.atmStrike.toLocaleString('en-IN')} · ±{idx.levels.dailySigmaPct}%
                </div>
              )}
            </button>
          ))}
        </div>
      );
    }

    return null;
  };

  const renderFilterPills = () => {
    let options: string[] = [];
    if (dashboardId === 'intraday') {
      options = ['All', 'Volume Leaders', 'High Liquidity', 'Volatility Watchlist'];
    } else if (dashboardId === 'fno') {
      options = ['All', 'Index Futures', 'Stock Futures', 'Call Options', 'Put Options'];
    } else if (dashboardId === 'etfs') {
      options = ['All', 'Nifty ETFs', 'Sensex ETFs', 'Sector ETFs', 'Gold ETFs', 'International ETFs'];
    } else if (dashboardId === 'ipo') {
      options = ['All', 'Upcoming', 'Open', 'Closed', 'Listed'];
    } else if (dashboardId === 'commodities') {
      options = [
        'All',
        'Crude Oil',
        'Natural Gas',
        'Copper',
        'Aluminium',
        'Zinc & Lead',
        'Nickel & Base Metals',
        'Cotton',
        'Agricultural',
      ];
    }

    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
              All Flow ({rawListItems.length})
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
              {dashboardId === 'ipo' ? `High Buyer Demand (${buyingCount})` : `High Buying (${buyingCount})`}
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

          <div className="relative w-full sm:w-[300px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={quickFilter}
              onChange={(e) => setQuickFilter(e.target.value)}
              placeholder={`Filter ${cfg.title.toLowerCase()} records...`}
              className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0D9488] focus:outline-none"
            />
          </div>
        </div>

        {options.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  if (dashboardId === 'fno' && (opt === 'Call Options' || opt === 'Put Options')) {
                    setFnoOptionFocus(opt === 'Call Options' ? 'ce' : 'pe');
                    setSubFilter(opt);
                    setActiveModule('ai');
                  } else {
                    setSubFilter(opt);
                  }
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  subFilter === opt
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderChartWidget = (height = 250) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <div className="text-xs font-mono text-slate-500">{chartSymbol}</div>
          <h2 className="mt-0.5 text-lg font-bold text-slate-900">
            {chartDetail?.name || chartSymbol}
          </h2>
          {chartDetail && (
            <div className="mt-1 flex flex-wrap items-center gap-3 font-mono tabular-nums">
              <span className="text-xl font-bold text-slate-900">
                {currencyPrefix}
                {chartDetail.price.toLocaleString(isUsdAsset ? 'en-US' : 'en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                {chartSymbol === '^TNX' ? '%' : ''}
              </span>
              <span
                className={`inline-flex items-center text-xs font-semibold ${
                  chartDetail.change >= 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {chartDetail.change >= 0 ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                {formatSignedPercent(chartDetail.percentChange)}
              </span>
              {dashboardId === 'intraday' && chartDetail.vwap && (
                <span className="text-xs text-slate-600">
                  VWAP ₹{chartDetail.vwap} · RSI {chartDetail.rsi14 ?? '—'} · MACD {chartDetail.macd ?? '—'}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 border border-slate-200">
          {RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setChartRange(r.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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
        points={chartDetail?.points || []}
        range={chartRange}
        previousClose={chartDetail?.previousClose}
        currencyPrefix={currencyPrefix}
        height={height}
        loading={chartLoading}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <DashboardModuleGrid
        num={cfg.num}
        title={cfg.title}
        description={cfg.subtitle}
        marketStatus={marketStatus}
        syncedAt={syncedAt}
        isSyncing={loading}
        onSync={() => fetchDashboard(true)}
        onBack={onBack}
        modules={MODULE_CARDS}
        activeModule={activeModule}
        onSelectModule={setActiveModule}
      />

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          {error}
        </div>
      )}

      {renderTopBannerMetrics()}

      {/* MODULE A: DATABASE / INSTRUMENTS + BEST 20 FUTURISTIC */}
      {activeModule === 'database' && (
        <section className="space-y-6">
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
                All {cfg.dbModuleTitle} ({rawListItems.length || '20+'})
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
                ? `20 tailored futuristic ${cfg.title.toLowerCase()} picks updated from early news feeds`
                : cfg.subtitle}
            </span>
          </div>

          {databaseView === 'futuristic' ? (
            <FuturisticTop20
              dashboardId={dashboardId}
              dashboardTitle={cfg.title}
              compactHeader
              onOpenChart={(item) => {
                if (item.symbol) {
                  setCustomAiFocus(item.name);
                  setChartSymbol(item.symbol);
                  setActiveModule('ai');
                }
              }}
              onAnalyzeItem={(item) => {
                setCustomAiFocus(item.name);
                if (item.symbol) {
                  setChartSymbol(item.symbol);
                }
                setActiveModule('ai');
              }}
            />
          ) : (
            <>
              {renderFilterPills()}

              {/* Primary Live Database Table */}
          {dashboardId === 'ipo' ? (
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">
                  IPO Pipeline &amp; Listed Performance ({visibleItems.length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                      <th className="py-3 pl-5 pr-3">Company</th>
                      <th className="py-3 px-3">Stage</th>
                      <th className="py-3 px-3">Issue / Price Band</th>
                      <th className="py-3 px-3 text-right">Live Price</th>
                      <th className="py-3 px-3 text-right">Gain vs Issue</th>
                      <th className="py-3 px-3 hidden md:table-cell">Subscription</th>
                      <th className="py-3 pl-3 pr-5 text-right">Registrar / Dates</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {visibleItems.map((rec: IpoRecord) => {
                      const pos = (rec.listingGainPct ?? 0) >= 0;
                      const flowTone =
                        rec.orderFlowType === 'buying'
                          ? 'text-emerald-700'
                          : rec.orderFlowType === 'selling'
                            ? 'text-rose-600'
                            : 'text-slate-500';
                      return (
                        <tr
                          key={rec.id}
                          onClick={() => {
                            if (rec.symbol) {
                              setCustomAiFocus(null);
                              setChartSymbol(rec.symbol);
                            } else {
                              setCustomAiFocus(rec.companyName);
                            }
                            setActiveModule('ai');
                          }}
                          className="transition-colors cursor-pointer hover:bg-slate-50"
                        >
                          <td className="py-3 pl-5 pr-3">
                            <div className="font-semibold text-slate-900">{rec.companyName}</div>
                            <div className="text-xs text-slate-500">
                              {rec.sector} · {rec.issueSizeCr}
                              {rec.orderFlowLabel && (
                                <span className={`ml-1.5 font-semibold ${flowTone}`}>
                                  · {rec.orderFlowLabel}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-xs font-semibold text-slate-700 whitespace-nowrap">
                            {rec.status}
                          </td>
                          <td className="py-3 px-3 font-mono tabular-nums text-xs text-slate-700 whitespace-nowrap">
                            {rec.priceBand}
                          </td>
                          <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">
                            {rec.livePrice ? formatINR(rec.livePrice) : '—'}
                          </td>
                          <td
                            className={`py-3 px-3 text-right font-mono tabular-nums font-semibold whitespace-nowrap ${
                              rec.listingGainPct == null
                                ? 'text-slate-400'
                                : pos
                                  ? 'text-emerald-700'
                                  : 'text-rose-600'
                            }`}
                          >
                            {rec.listingGainPct != null ? formatSignedPercent(rec.listingGainPct) : 'Pending'}
                          </td>
                          <td className="py-3 px-3 text-xs font-mono text-slate-600 hidden md:table-cell whitespace-nowrap">
                            {rec.subscriptionTotal}
                          </td>
                          <td className="py-3 pl-3 pr-5 text-right text-xs text-slate-500 whitespace-nowrap">
                            <div>{rec.listingDate}</div>
                            <a
                              href={rec.registrarUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-[#0284C7] hover:underline"
                            >
                              <span>{rec.registrar}</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">
                  Live {cfg.dbModuleTitle} ({visibleItems.length})
                </h2>
                <span className="text-xs text-slate-500">
                  Tap a row to analyze in {cfg.aiModuleTitle}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                      <th className="py-3 pl-5 pr-3">Instrument</th>
                      <th className="py-3 px-3">Category / Unit</th>
                      <th className="py-3 px-3 text-right">Live Price</th>
                      <th className="py-3 px-3 text-right">Change</th>
                      {dashboardId === 'intraday' && (
                        <>
                          <th className="py-3 px-3 text-right hidden md:table-cell">VWAP</th>
                          <th className="py-3 px-3 text-right hidden lg:table-cell">Vol Spike</th>
                          <th className="py-3 px-3 text-right hidden lg:table-cell">Range %</th>
                        </>
                      )}
                      {dashboardId === 'fno' && (
                        <>
                          <th className="py-3 px-3 text-right hidden md:table-cell">Lot</th>
                          <th className="py-3 px-3 text-right hidden md:table-cell">ATM Strike</th>
                          <th className="py-3 px-3 text-right hidden lg:table-cell">1D 1σ Range</th>
                        </>
                      )}
                      {dashboardId === 'etfs' && (
                        <>
                          <th className="py-3 px-3 text-right hidden md:table-cell">TER %</th>
                          <th className="py-3 px-3 text-right hidden md:table-cell">Track Err</th>
                          <th className="py-3 px-3 text-right hidden lg:table-cell">vs iNAV</th>
                        </>
                      )}
                      {dashboardId === 'commodities' && (
                        <th className="py-3 px-3 text-right hidden md:table-cell">INR Parity</th>
                      )}
                      <th className="py-3 px-3 text-right hidden xl:table-cell">Volume</th>
                      <th className="py-3 pl-3 pr-5 text-right hidden sm:table-cell">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {loading && visibleItems.length === 0 ? (
                      Array.from({ length: 8 }).map((_, idx) => (
                        <tr key={idx}>
                          <td colSpan={8} className="px-5 py-3">
                            <div className="h-5 rounded bg-slate-100 animate-pulse" />
                          </td>
                        </tr>
                      ))
                    ) : (
                      visibleItems.map((item: any) => {
                        const pos = item.change >= 0;
                        const isItemUsd =
                          item.currency === 'USD' ||
                          item.symbol?.includes('=F') ||
                          (!item.symbol?.endsWith('.NS') &&
                            !item.symbol?.endsWith('.BO') &&
                            !item.symbol?.startsWith('^') &&
                            item.symbol !== 'DX-Y.NYB');
                        const itemPrefix =
                          item.symbol === '^TNX' || item.symbol === 'DX-Y.NYB'
                            ? ''
                            : isItemUsd
                              ? '$'
                              : '₹';
                        const isActive = item.symbol === chartSymbol;
                        return (
                          <tr
                            key={item.symbol}
                            onClick={() => {
                              setCustomAiFocus(null);
                              setChartSymbol(item.symbol);
                              if (
                                onOpenStock &&
                                dashboardId === 'intraday' &&
                                isActive
                              ) {
                                onOpenStock(item.symbol);
                              } else {
                                setActiveModule('ai');
                              }
                            }}
                            className={`cursor-pointer transition-colors ${
                              isActive ? 'bg-[#F0FDFA]' : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="py-3 pl-5 pr-3">
                              <div className="font-semibold text-slate-900">{item.ticker}</div>
                              <div className="text-xs text-slate-500 truncate max-w-[220px]">
                                {item.name}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-xs text-slate-600 whitespace-nowrap">
                              <div>{item.category || item.sector || item.unit || item.exchange}</div>
                              {item.orderFlowLabel && (
                                <div
                                  className={`text-[11px] font-semibold ${
                                    item.orderFlowType === 'buying'
                                      ? 'text-emerald-700'
                                      : item.orderFlowType === 'selling'
                                        ? 'text-rose-600'
                                        : 'text-slate-400'
                                  }`}
                                >
                                  {item.orderFlowLabel}
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">
                              {itemPrefix}
                              {item.price.toLocaleString(isItemUsd ? 'en-US' : 'en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                              {item.symbol === '^TNX' ? '%' : ''}
                            </td>
                            <td
                              className={`py-3 px-3 text-right font-mono tabular-nums whitespace-nowrap ${
                                pos ? 'text-emerald-700' : 'text-rose-600'
                              }`}
                            >
                              <div className="font-medium">{formatSignedPercent(item.percentChange)}</div>
                              <div className="text-xs opacity-80">
                                {formatSignedChange(item.change, itemPrefix)}
                              </div>
                            </td>

                            {dashboardId === 'intraday' && (
                              <>
                                <td className="py-3 px-3 text-right font-mono tabular-nums text-xs text-slate-700 hidden md:table-cell whitespace-nowrap">
                                  {item.vwap ? formatINR(item.vwap) : '—'}
                                </td>
                                <td className="py-3 px-3 text-right font-mono tabular-nums text-xs font-semibold hidden lg:table-cell whitespace-nowrap">
                                  <span className={(item.volumeRatio ?? 0) >= 1.5 ? 'text-[#0D9488]' : 'text-slate-600'}>
                                    {item.volumeRatio ? `${item.volumeRatio}x` : '—'}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-right font-mono tabular-nums text-xs text-slate-600 hidden lg:table-cell whitespace-nowrap">
                                  {item.volatilityPct ? `${item.volatilityPct}%` : '—'}
                                </td>
                              </>
                            )}

                            {dashboardId === 'fno' && (
                              <>
                                <td className="py-3 px-3 text-right font-mono tabular-nums text-xs text-slate-700 hidden md:table-cell">
                                  {item.lotSize}
                                </td>
                                <td className="py-3 px-3 text-right font-mono tabular-nums text-xs font-semibold text-slate-900 hidden md:table-cell">
                                  {item.levels ? item.levels.atmStrike.toLocaleString('en-IN') : '—'}
                                </td>
                                <td className="py-3 px-3 text-right font-mono tabular-nums text-xs text-slate-600 hidden lg:table-cell whitespace-nowrap">
                                  {item.levels
                                    ? `${item.levels.dailyRange[0].toLocaleString('en-IN')} – ${item.levels.dailyRange[1].toLocaleString('en-IN')}`
                                    : '—'}
                                </td>
                              </>
                            )}

                            {dashboardId === 'etfs' && (
                              <>
                                <td className="py-3 px-3 text-right font-mono tabular-nums text-xs text-slate-700 hidden md:table-cell">
                                  {item.expenseRatio != null ? `${item.expenseRatio}%` : '—'}
                                </td>
                                <td className="py-3 px-3 text-right font-mono tabular-nums text-xs text-slate-600 hidden md:table-cell">
                                  {item.trackingError != null ? `${item.trackingError}%` : '—'}
                                </td>
                                <td className="py-3 px-3 text-right font-mono tabular-nums text-xs hidden lg:table-cell whitespace-nowrap">
                                  {item.premiumDiscountPct != null ? formatSignedPercent(item.premiumDiscountPct) : '—'}
                                </td>
                              </>
                            )}

                            {dashboardId === 'commodities' && (
                              <td className="py-3 px-3 text-right font-mono tabular-nums text-xs text-slate-700 hidden md:table-cell whitespace-nowrap">
                                {item.inrEquivalent ? formatINR(item.inrEquivalent, 0) : '—'}
                              </td>
                            )}

                            <td className="py-3 px-3 text-right font-mono tabular-nums text-xs text-slate-500 hidden xl:table-cell whitespace-nowrap">
                              {formatCompactVolume(item.volume)}
                            </td>
                            <td className="py-3 pl-3 pr-5 text-right hidden sm:table-cell">
                              <div className="inline-flex justify-end">
                                <Sparkline values={item.sparkline} positive={pos} width={72} height={22} />
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Extra Gold Database Sections: Sovereign Gold Bonds + AMFI Gold Mutual Funds */}
          {dashboardId === 'gold' && payload && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-3">
                <h3 className="text-base font-bold text-slate-900">
                  Sovereign Gold Bond (SGB) Records
                </h3>
                <div className="divide-y divide-slate-100 text-xs">
                  {(payload.sgbRecords as SgbRecord[] | undefined)?.map((s) => (
                    <div key={s.series} className="flex items-center justify-between py-2.5 gap-2">
                      <div>
                        <div className="font-semibold text-slate-900">{s.series}</div>
                        <div className="text-slate-500">
                          Issue ₹{s.issuePrice} · {s.couponPct}% p.a. · Mat {s.maturityDate}
                        </div>
                      </div>
                      <div className="text-right font-mono tabular-nums">
                        <div className="font-bold text-slate-900">
                          {s.liveParity24kPerGram ? formatINR(s.liveParity24kPerGram, 0) : '—'}/g
                        </div>
                        <div className="text-emerald-700 font-semibold">
                          {s.unrealizedGainPct != null ? formatSignedPercent(s.unrealizedGainPct) : '—'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-3">
                <h3 className="text-base font-bold text-slate-900">
                  Gold Mutual Funds (Live AMFI NAVs)
                </h3>
                <div className="divide-y divide-slate-100 text-xs">
                  {(payload.mutualFunds as MutualFundSummary[] | undefined)?.map((mf) => (
                    <div key={mf.schemeCode} className="flex items-center justify-between py-2.5 gap-2">
                      <div>
                        <div className="font-semibold text-slate-900">{mf.schemeName}</div>
                        <div className="text-slate-500">{mf.fundHouse} · TER {mf.expenseRatio}%</div>
                      </div>
                      <div className="text-right font-mono tabular-nums">
                        <div className="font-bold text-slate-900">{formatINR(mf.nav, 2)}</div>
                        <div className={(mf.return1y ?? 0) >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                          1Y: {formatSignedPercent(mf.return1y)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Extra Silver Database Section: AMFI Silver Mutual Funds */}
          {dashboardId === 'silver' && payload?.mutualFunds && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-3">
              <h3 className="text-base font-bold text-slate-900">
                Silver Mutual Funds &amp; FoFs (Live AMFI)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(payload.mutualFunds as MutualFundSummary[]).map((mf) => (
                  <div
                    key={mf.schemeCode}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{mf.schemeName}</div>
                      <div className="text-slate-500 mt-0.5">{mf.fundHouse} · TER {mf.expenseRatio}%</div>
                    </div>
                    <div className="text-right font-mono tabular-nums">
                      <div className="font-bold text-slate-900">{formatINR(mf.nav, 2)}</div>
                      <div className={(mf.return1y ?? 0) >= 0 ? 'text-emerald-700 font-semibold' : 'text-rose-600'}>
                        1Y: {formatSignedPercent(mf.return1y)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extra Bonds Database Sections: Sovereign G-Sec, T-Bills, Corporate Bonds & SDLs */}
          {dashboardId === 'bonds' && payload?.referenceBonds && (
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">
                  Government Securities, T-Bills, Corporate Bonds, SDLs &amp; Listed Debt Matrix
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                      <th className="py-3 pl-5 pr-3">Security / Benchmark</th>
                      <th className="py-3 px-3">Debt Segment</th>
                      <th className="py-3 px-3">Rating</th>
                      <th className="py-3 px-3 text-right">Coupon</th>
                      <th className="py-3 px-3 text-right">Indicative YTM</th>
                      <th className="py-3 px-3 text-right">Maturity</th>
                      <th className="py-3 pl-3 pr-5 text-right">Interest Payout</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(payload.referenceBonds as BondReferenceRecord[]).map((b) => (
                      <tr key={b.isinName} className="hover:bg-slate-50">
                        <td className="py-3 pl-5 pr-3 font-semibold text-slate-900">{b.isinName}</td>
                        <td className="py-3 px-3 text-xs text-slate-600">{b.issuerType}</td>
                        <td className="py-3 px-3 text-xs font-semibold text-emerald-700">{b.rating}</td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">{b.couponPct.toFixed(2)}%</td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-slate-900">{b.ytmPct.toFixed(2)}%</td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-xs text-slate-600">{b.maturityDate}</td>
                        <td className="py-3 pl-3 pr-5 text-right text-xs text-slate-600">{b.interestFrequency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
            </>
          )}
        </section>
      )}

      {/* MODULE B: OFFICIAL SOURCES */}
      {activeModule === 'official' && (
        <OfficialSourcesGrid
          title={`Official ${cfg.title} Regulatory & Exchange Portals`}
          subtitle="Direct verified regulatory, exchange, circular, and factsheet websites"
          sources={getOfficialSourcesForDashboard(dashboardId, chartSymbol)}
        />
      )}

      {/* MODULE C: SPECIALIZED AI + CHARTS + QUANT TOOLS */}
      {activeModule === 'ai' && (
        <section className="space-y-6">
          {/* Instrument Selector Bar */}
          {rawListItems.some((i) => i.symbol) && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-semibold text-slate-600">
                Active Focus Instrument:
              </div>
              <select
                value={chartSymbol}
                onChange={(e) => {
                  setCustomAiFocus(null);
                  setChartSymbol(e.target.value);
                }}
                aria-label="Select focus instrument"
                className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:border-[#0D9488] focus:outline-none"
              >
                {!rawListItems.some((i) => i.symbol === chartSymbol) && (
                  <option value={chartSymbol}>
                    {customAiFocus ? `${chartSymbol} — ${customAiFocus}` : chartSymbol}
                  </option>
                )}
                {rawListItems
                  .filter((i) => i.symbol)
                  .map((i) => (
                    <option key={i.symbol} value={i.symbol}>
                      {i.ticker || i.symbol} — {i.name || i.companyName}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {renderChartWidget(270)}

          {/* F&O Specialized Option Chain + Greeks + Scenarios */}
          {dashboardId === 'fno' && selectedItem && (
            <FnoChainPanel
              underlying={selectedItem}
              vixPrice={payload?.vix?.price || 14.5}
              initialFocus={fnoOptionFocus}
            />
          )}

          {/* Bonds Interactive Duration & Rate Sensitivity Calculator */}
          {dashboardId === 'bonds' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    RBI Rate Sensitivity &amp; Modified Duration Impact Simulator
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Estimate bond price impact across T-Bills (0.5Y), Corporate (3.8Y), and 10Y G-Sec (6.9Y)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {[-50, -25, 25, 50].map((bps) => (
                    <button
                      key={bps}
                      type="button"
                      onClick={() => setRateShockBps(bps)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold cursor-pointer ${
                        rateShockBps === bps
                          ? 'bg-[#0D9488] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {bps > 0 ? `+${bps}` : bps} bps
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Short T-Bills (Mod Duration ~0.7)', dur: 0.7 },
                  { label: 'AAA Corporate Bond (Mod Duration ~3.8)', dur: 3.8 },
                  { label: '10Y G-Sec Sovereign (Mod Duration ~6.9)', dur: 6.9 },
                ].map((seg) => {
                  const pctImpact = Number(((-seg.dur * rateShockBps) / 100).toFixed(2));
                  return (
                    <div key={seg.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-xs text-slate-600">{seg.label}</div>
                      <div
                        className={`mt-1.5 text-xl font-bold font-mono tabular-nums ${
                          pctImpact >= 0 ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {formatSignedPercent(pctImpact)} Price Shift
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <StructuredDashboardAI
            dashboardType={dashboardId}
            title={`C. ${cfg.aiModuleTitle}`}
            description={cfg.subtitle}
            focusLabel={customAiFocus || chartDetail?.name || selectedItem?.name || cfg.title}
            syncedAt={syncedAt}
            liveContext={
              chartDetail
                ? {
                    symbol: chartDetail.symbol,
                    price: chartDetail.price,
                    percentChange: chartDetail.percentChange,
                    vwap: chartDetail.vwap,
                    rsi14: chartDetail.rsi14,
                    macd: chartDetail.macd,
                  }
                : undefined
            }
            mode={cfg.hasExpertModule ? 'analysis' : 'combined'}
          />
        </section>
      )}

      {/* MODULE D: EXPERT VERIFICATION (for Intraday, F&O, IPO) */}
      {activeModule === 'expert' && cfg.hasExpertModule && (
        <StructuredDashboardAI
          dashboardType={dashboardId}
          title={`D. ${cfg.title} Expert Verification AI`}
          description="Verified brokerage/analyst consensus, source comparison, and historical accuracy tracking"
          focusLabel={customAiFocus || chartDetail?.name || selectedItem?.name || cfg.title}
          syncedAt={syncedAt}
          liveContext={
            chartDetail
              ? { symbol: chartDetail.symbol, price: chartDetail.price, percentChange: chartDetail.percentChange }
              : undefined
          }
          mode="expert"
        />
      )}

      {/* MODULE D/E: MONITORING */}
      {activeModule === 'monitoring' && (
        <div className="space-y-6">
          {/* Pre-Market & Closing Checklist for Intraday */}
          {dashboardId === 'intraday' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="text-xs font-bold text-slate-900">1. Pre-Market Research (09:00–09:15 IST)</div>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Track GIFT Nifty cues, FII/DII provisional cash flows, overnight global ADR moves, and pre-open equilibrium gap-ups/downs.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="text-xs font-bold text-slate-900">2. Live Session Breakouts (09:15–14:45 IST)</div>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  {rawListItems.filter((i) => (i.volumeRatio ?? 0) >= 1.5).length} liquid stocks currently show &ge;1.5x 20D volume surges relative to VWAP.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="text-xs font-bold text-slate-900">3. Closing Analysis (15:00–15:30 IST)</div>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Monitor 3:00 PM weighted average settlement flows and intraday high/low closure strength before BTST/carry-forward.
                </p>
              </div>
            </div>
          )}

          {/* Dynamic Expiry Calendar for F&O */}
          {dashboardId === 'fno' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-3">
              <h3 className="text-base font-bold text-slate-900">
                Upcoming NSE/BSE Expiry Calendar
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {getUpcomingExpiries().map((exp) => (
                  <div key={exp.dateStr} className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs">
                    <div className="font-bold text-slate-900">{exp.dateStr}</div>
                    <div className="mt-1 text-slate-600">{exp.label}</div>
                    <div className="mt-0.5 text-[11px] text-[#0D9488] font-medium">{exp.type}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DashboardMonitoringPanel
            dashboardId={dashboardId}
            dashboardTitle={cfg.title}
            sessionTitle={`${cfg.title} Live Session Monitor`}
            sessionHours={cfg.sessionHours}
            alertTitle={
              dashboardId === 'commodities'
                ? 'Contract Price & Expiry Alerts'
                : dashboardId === 'bonds'
                  ? 'Yield & Interest Payment Alerts'
                  : 'Live Price & Breakout Alerts'
            }
            instruments={monitorInstruments}
            extraNotes={
              dashboardId === 'gold' && payload?.parity24k10g
                ? [{ label: '24K Parity / 10g', value: formatINR(payload.parity24k10g, 0) }]
                : dashboardId === 'silver' && payload?.goldSilverRatio
                  ? [{ label: 'Gold/Silver Ratio', value: `${payload.goldSilverRatio}x` }]
                  : []
            }
          />
        </div>
      )}
    </div>
  );
};
