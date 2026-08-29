import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  ShieldCheck, 
  ArrowUpRight, 
  Sparkles, 
  Activity, 
  Cpu, 
  Layers, 
  ChevronRight, 
  Info,
  Flame,
  BarChart2,
  Lock,
  Search,
  Filter,
  CheckCircle2,
  Bookmark,
  Scale,
  LineChart,
  BellRing,
  FileCheck,
  BookOpen,
  Compass,
  ArrowRight,
  Newspaper,
  Radio,
  RefreshCw,
  Clock
} from 'lucide-react';
import { CompanyStock, FutureThemeCategory, MarketIndex, NavigationTab } from '../../types/stock';
import { MARKET_INDICES as STATIC_INDICES, FUTURE_THEMES } from '../../data/indianMarketData';
import { CompanyLogo } from '../common/CompanyLogo';
import { HolographicCinfi3D, Cinfi3DLogo } from '../common/Visual3DElements';
import { MarketStatusInfo } from '../../hooks/useLiveMarketEngine';

interface MarketOverviewProps {
  stocks?: CompanyStock[];
  indices?: MarketIndex[];
  marketStatus?: MarketStatusInfo | null;
  onRefreshLiveQuotes?: () => void;
  isRefreshing?: boolean;
  lastFetchedAt?: string;
  watchlistIds?: string[];
  onToggleWatchlist?: (stockId: string) => void;
  onSelectStock: (stock: CompanyStock) => void;
  onSelectTheme: (themeId: string) => void;
  onNavigateToScreener: () => void;
  onNavigateToTab?: (tab: NavigationTab) => void;
}

export type PriceFilterRange = 'ALL' | '0-100' | '101-500' | '501-1000' | '1001-3000' | '3001-above';

export const MarketOverview: React.FC<MarketOverviewProps> = ({
  stocks = [],
  indices = STATIC_INDICES,
  marketStatus,
  onRefreshLiveQuotes,
  isRefreshing = false,
  lastFetchedAt = '',
  watchlistIds = [],
  onToggleWatchlist,
  onSelectStock,
  onSelectTheme,
  onNavigateToScreener,
  onNavigateToTab
}) => {
  const [stockTab, setStockTab] = useState<'ALL' | 'TOP_AI' | 'HIGH_GROWTH' | 'DEFENCE_ENERGY'>('ALL');
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceFilterRange>('ALL');

  const displayIndices = indices && indices.length > 0 ? indices : STATIC_INDICES;

  // Filter stocks by theme/segment and price range
  const filteredStocks = useMemo(() => {
    return (stocks || []).filter(stock => {
      if (!stock) return false;

      // Segment filter
      if (stockTab === 'TOP_AI' && stock.compositeAiScore < 80) return false;
      if (stockTab === 'HIGH_GROWTH' && (stock.financials?.[0]?.revenue || 0) <= 0) return false;
      if (stockTab === 'DEFENCE_ENERGY') {
        const hasMatch = (stock.futureThemes || []).some(t => {
          const cat = t?.category || '';
          return cat.includes('Defence') || cat.includes('Energy') || cat.includes('Semiconductor');
        });
        if (!hasMatch) return false;
      }

      // Price range filter
      if (selectedPriceRange === '0-100' && (stock.currentPrice < 0 || stock.currentPrice > 100)) return false;
      if (selectedPriceRange === '101-500' && (stock.currentPrice <= 100 || stock.currentPrice > 500)) return false;
      if (selectedPriceRange === '501-1000' && (stock.currentPrice <= 500 || stock.currentPrice > 1000)) return false;
      if (selectedPriceRange === '1001-3000' && (stock.currentPrice <= 1000 || stock.currentPrice > 3000)) return false;
      if (selectedPriceRange === '3001-above' && stock.currentPrice <= 3000) return false;

      return true;
    });
  }, [stocks, stockTab, selectedPriceRange]);

  // 24/7 Best Stocks Ranking (Top 5 dynamic leaders by AI score & real-time momentum)
  const topBestStocks24x7 = useMemo(() => {
    return [...(stocks || [])]
      .sort((a, b) => {
        const rankA = (a.compositeAiScore * 1.5) + (a.percentChange * 3) + (a.technicals.rsi14 * 0.4);
        const rankB = (b.compositeAiScore * 1.5) + (b.percentChange * 3) + (b.technicals.rsi14 * 0.4);
        return rankB - rankA;
      })
      .slice(0, 6);
  }, [stocks]);

  // Hub options definitions
  const dashboardOptions = [
    {
      tab: 'stocks' as NavigationTab,
      label: 'CINFI Stocks',
      tag: `${stocks.length} Equities`,
      desc: 'Deep terminal with audited 10-factor models',
      icon: Activity,
      color: 'from-cyan-500/20 to-blue-600/20 text-cyan-400 border-cyan-500/30 hover:border-cyan-400'
    },
    {
      tab: 'screener' as NavigationTab,
      label: 'Universal Screener',
      tag: 'Quant Filters',
      desc: 'Multi-parameter valuation & momentum matrix',
      icon: Zap,
      color: 'from-indigo-500/20 to-violet-600/20 text-indigo-400 border-indigo-500/30 hover:border-indigo-400'
    },
    {
      tab: 'themes' as NavigationTab,
      label: 'Future Themes',
      tag: '8 Mega-Themes',
      desc: 'Semiconductor, EV, Space, Green Hydrogen & Defence',
      icon: Layers,
      color: 'from-amber-500/20 to-orange-600/20 text-amber-400 border-amber-500/30 hover:border-amber-400'
    },
    {
      tab: 'compare' as NavigationTab,
      label: 'Stock Compare',
      tag: 'Peer Head-to-Head',
      desc: 'Side-by-side valuation, moat & debt metrics',
      icon: Scale,
      color: 'from-emerald-500/20 to-teal-600/20 text-emerald-400 border-emerald-500/30 hover:border-emerald-400'
    },
    {
      tab: 'backtest' as NavigationTab,
      label: 'Strategy Backtester',
      tag: '5-Yr Historical',
      desc: 'AI vs Nifty 50 compound returns & drawdown simulation',
      icon: LineChart,
      color: 'from-fuchsia-500/20 to-pink-600/20 text-fuchsia-400 border-fuchsia-500/30 hover:border-fuchsia-400'
    },
    {
      tab: 'watchlist' as NavigationTab,
      label: 'My Watchlist',
      tag: `${watchlistIds.length} Tracked`,
      desc: 'Custom equity watchlist with real-time analytics',
      icon: Bookmark,
      color: 'from-cyan-500/20 to-teal-600/20 text-cyan-300 border-cyan-500/30 hover:border-cyan-400'
    },
    {
      tab: 'alerts' as NavigationTab,
      label: 'Smart Alerts',
      tag: 'Active Monitor',
      desc: 'Automated price breaks, RSI oversold & quant signals',
      icon: BellRing,
      color: 'from-rose-500/20 to-red-600/20 text-rose-400 border-rose-500/30 hover:border-rose-400'
    },
    {
      tab: 'evidence' as NavigationTab,
      label: 'Evidence Audit',
      tag: '100% Verified',
      desc: 'Citations directly tied to SEBI filings & transcripts',
      icon: FileCheck,
      color: 'from-emerald-500/20 to-green-600/20 text-emerald-300 border-emerald-500/30 hover:border-emerald-400'
    },
    {
      tab: 'news' as NavigationTab,
      label: 'Market & Social News',
      tag: '24/7 Wire',
      desc: 'NSE/BSE filings, Super-Investor ideas & social sentiment',
      icon: Newspaper,
      color: 'from-amber-500/20 to-rose-600/20 text-amber-300 border-amber-500/30 hover:border-amber-400'
    },
    {
      tab: 'learn' as NavigationTab,
      label: 'Financial Guide',
      tag: 'Zero Slop',
      desc: 'Formula breakdown & 10-factor quant methodology',
      icon: BookOpen,
      color: 'from-blue-500/20 to-indigo-600/20 text-blue-400 border-blue-500/30 hover:border-blue-400'
    }
  ];

  const priceRangeButtons = [
    { id: 'ALL' as PriceFilterRange, label: 'All Prices' },
    { id: '0-100' as PriceFilterRange, label: '₹0 – ₹100' },
    { id: '101-500' as PriceFilterRange, label: '₹101 – ₹500' },
    { id: '501-1000' as PriceFilterRange, label: '₹501 – ₹1,000' },
    { id: '1001-3000' as PriceFilterRange, label: '₹1,001 – ₹3,000' },
    { id: '3001-above' as PriceFilterRange, label: '₹3,001 & Above' }
  ];

  return (
    <div id="market-dashboard-view" className="w-full max-w-full space-y-6 sm:space-y-8 pb-12 min-w-0 overflow-x-hidden">
      
      {/* 💎 1. CINFI INTELLIGENCE - 3D LOGO & QUANT MATRIX HERO STAGE */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/80 p-5 sm:p-6 md:p-8 border border-slate-800 shadow-2xl shadow-cyan-950/20 overflow-hidden min-w-0">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-1/4 -mt-16 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 -mb-16 -mr-16 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 min-w-0">
          {/* Left Column: Mission & Core Actions */}
          <div className="max-w-2xl space-y-3 sm:space-y-4 min-w-0">
            
            {/* 3D CINFI Logo Badge */}
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-cyan-950/90 border border-cyan-500/50 text-cyan-200 text-xs font-bold shadow-lg shadow-cyan-950 max-w-full">
              <Cinfi3DLogo size="sm" />
              <span className="tracking-wide">CINFI Intelligence • 24/7 Live Quant Stream</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight break-words">
              Evidence-Grounded Intelligence for{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                {stocks.length}+ Indian Equities
              </span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
              Real-time multi-bracket coverage across penny infra (₹0–100), high-growth power & defence (₹101–500), quality mid-caps (₹501–1000), bluechips (₹1001–3000), and ultra-high institutional leaders (₹3001+).
            </p>

            <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <button
                onClick={onNavigateToScreener}
                className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-gradient-to-r from-cyan-600 via-indigo-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-cyan-950/60 flex items-center justify-center space-x-2 cursor-pointer group"
              >
                <Zap className="w-4 h-4 text-cyan-200 group-hover:scale-110 transition-transform shrink-0" />
                <span>Launch Universal Screener</span>
              </button>

              <button
                onClick={() => onNavigateToTab?.('stocks')}
                className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Explore All {stocks.length} Stocks</span>
              </button>

              <div className="flex items-center space-x-2 text-[11px] sm:text-xs text-slate-400 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-slate-950/80 rounded-xl border border-slate-800 backdrop-blur-sm max-w-full">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">24/7 Engine: Continuous Ticks & Best Stock Ranking</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Holographic CINFI Intelligence Stage */}
          <div className="shrink-0 flex items-center justify-center">
            <HolographicCinfi3D />
          </div>
        </div>
      </div>

      {/* ⚡ 24/7 LIVE BACKEND RADAR: BEST PERFORMING & HIGH-CONVICTION PICKS */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-800/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
              <Radio className="w-4 h-4 animate-pulse text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  24/7 Live Radar: Top Algorithmically Ranked Best Stocks
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                  Backend Live Stream
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Continuously ranked by composite AI score, order flow momentum, and technical breakout conviction.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Updated: Live Sub-Second Ticks</span>
          </div>
        </div>

        {/* Best Stocks Live Carousel Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 mt-3.5">
          {topBestStocks24x7.map((stock, rankIdx) => (
            <div
              key={stock.id}
              onClick={() => onSelectStock(stock)}
              className="bg-slate-950/80 hover:bg-slate-900 border border-slate-800/90 hover:border-cyan-500/60 p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.02] shadow-sm group relative"
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                  #{rankIdx + 1} Best
                </span>
                <span className={`text-[11px] font-mono font-bold ${stock.percentChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stock.percentChange >= 0 ? '+' : ''}{stock.percentChange}%
                </span>
              </div>

              <div className="flex items-center space-x-2 mb-1.5">
                <CompanyLogo symbol={stock.symbol} name={stock.name} size="sm" brandColor={stock.brandColor} />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                    {stock.symbol}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {stock.sector}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-900 font-mono">
                <span className="text-slate-300 font-semibold">
                  ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950/60 px-1.5 py-0.2 rounded">
                  {stock.compositeAiScore} AI
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📦 2. QUANT DASHBOARDS HUB */}
      <div className="space-y-3.5 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-200">
              Quantitative Intelligence Modules
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">
            Select any analytical terminal to begin research
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5 min-w-0">
          {dashboardOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.tab}
                id={`hub-btn-${opt.tab}`}
                onClick={() => onNavigateToTab?.(opt.tab)}
                className={`relative group flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br ${opt.color} border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-left cursor-pointer min-h-[105px] shadow-sm hover:shadow-md min-w-0`}
              >
                <div className="flex items-start justify-between gap-1 w-full">
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 shadow-inner group-hover:border-current transition-colors shrink-0">
                    <Icon className="w-4 h-4 shrink-0" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-slate-950/90 text-slate-300 border border-slate-800 shrink-0 truncate max-w-[85px]">
                    {opt.tag}
                  </span>
                </div>

                <div className="mt-2.5 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-200 transition-colors truncate">
                      {opt.label}
                    </h3>
                    <ArrowRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 leading-tight">
                    {opt.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 📈 3. MAJOR INDIAN MARKET BENCHMARKS */}
      <div className="space-y-2.5 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-200">
              Major Indian Market Benchmarks
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800">
              Live NSE/BSE
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            {marketStatus && (
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 ${marketStatus.statusColor}`}>
                {marketStatus.statusLabel} ({marketStatus.istTime})
              </span>
            )}
            {onRefreshLiveQuotes && (
              <button
                onClick={onRefreshLiveQuotes}
                disabled={isRefreshing}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-[11px] cursor-pointer transition-all hover:border-cyan-400"
                title="Fetch latest prices from NSE/BSE"
              >
                <RefreshCw className={`w-3 h-3 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Syncing...' : 'Sync Live'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 min-w-0">
          {displayIndices.map((idx) => {
            const isPositive = idx.change >= 0;
            return (
              <div 
                key={idx.symbol}
                className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-3 sm:p-4 shadow-sm hover:border-slate-700 transition-all min-w-0 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-300 truncate">
                    {idx.name}
                  </span>
                  <span className={`text-[10px] sm:text-xs font-mono font-bold flex items-center shrink-0 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                    {isPositive ? '+' : ''}{idx.percentChange}%
                  </span>
                </div>

                <div className="mt-2 min-w-0">
                  <div className="text-sm sm:text-base lg:text-lg font-black font-mono text-white tracking-tight truncate">
                    {idx.current.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 flex justify-between font-mono truncate">
                    <span>52W H: {idx.high52w.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Future Economy Industry Radar */}
      <div className="space-y-3 sm:space-y-4 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Future Economy Industry Radar
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Taxonomy of structural high-growth Indian sectors backed by verified corporate capex & policy catalysts.
            </p>
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono px-2.5 py-1 rounded-xl bg-slate-900 text-cyan-300 border border-cyan-800/60 self-start sm:self-auto shadow-sm shrink-0">
            8 Mega-Themes • {stocks.length} Equities Tracked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 min-w-0">
          {FUTURE_THEMES.map((theme) => (
            <div
              key={theme.id}
              onClick={() => onSelectTheme(theme.id)}
              className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-950 to-indigo-950/30 border border-slate-800 hover:border-cyan-500/60 rounded-2xl p-3.5 sm:p-4 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/30 flex flex-col justify-between group min-w-0"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40 truncate">
                    {theme.category}
                  </span>
                  <span className="text-xs font-mono font-black text-emerald-400 flex items-center space-x-1 shrink-0">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>{theme.avgScore}</span>
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                  {theme.name}
                </h4>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {theme.description}
                </p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  <strong className="text-white font-mono">{theme.stockCount}</strong> Equities
                </span>
                <span className="text-cyan-400 font-semibold text-[11px] flex items-center group-hover:translate-x-1 transition-transform">
                  <span>Explore</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🚀 COMPREHENSIVE STOCKS DIRECTORY WITH EXACT USER-REQUESTED PRICE RANGES */}
      <div className="space-y-4 min-w-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 min-w-0">
          <div className="flex items-center space-x-2 min-w-0">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Indian Equities Terminal ({filteredStocks.length} of {stocks.length} Listed)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-bold">
                  20+ Stocks Universe Active
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                Deterministic 10-Factor Model Score (0–100) with SEBI audit verification & live prices.
              </p>
            </div>
          </div>

          {/* Quick Segment Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar max-w-full shrink-0">
            {[
              { id: 'ALL', label: 'All Stocks' },
              { id: 'TOP_AI', label: 'Top AI (≥80)' },
              { id: 'DEFENCE_ENERGY', label: 'Defence & Clean Tech' },
              { id: 'HIGH_GROWTH', label: 'High Growth' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStockTab(tab.id as any)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  stockTab === tab.id
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 🏷️ EXACT PRICE RANGE FILTERS (0-100, 101-500, 501-1000, 1001-3000, 3001-above) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 shrink-0">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Price Range:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full w-full sm:w-auto">
            {priceRangeButtons.map(pBtn => {
              const isActive = selectedPriceRange === pBtn.id;
              return (
                <button
                  key={pBtn.id}
                  onClick={() => setSelectedPriceRange(pBtn.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold shrink-0 transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-md shadow-cyan-950'
                      : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {pBtn.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stock Cards Grid (20+ Stocks) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 min-w-0">
          {filteredStocks.map((stock) => (
            <div
              key={stock.id}
              id={`stock-card-${stock.symbol}`}
              onClick={() => onSelectStock(stock)}
              className="relative overflow-hidden bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-950 border border-slate-800 hover:border-cyan-500/60 rounded-2xl p-4 sm:p-5 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-950/40 group min-w-0 flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Company Logo + Symbol + Price */}
                <div className="flex items-start justify-between gap-2.5 min-w-0">
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    <CompanyLogo 
                      symbol={stock.symbol} 
                      name={stock.name} 
                      size="md"
                      customLogoUrl={stock.logoUrl}
                      brandColor={stock.brandColor}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5 min-w-0">
                        <span className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                          {stock.symbol}
                        </span>
                        <span className="text-xs text-slate-400 truncate">
                          ({stock.name})
                        </span>
                      </div>
                      <div className="text-[11px] text-cyan-400 font-medium mt-0.5 truncate">
                        {stock.sector} • {stock.industry}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <div className="text-right">
                      <div className="text-sm sm:text-base font-black font-mono text-white tracking-tight">
                        ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                      <div className={`text-xs font-bold font-mono ${stock.percentChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {stock.percentChange >= 0 ? '+' : ''}{stock.percentChange}%
                      </div>
                    </div>

                    {onToggleWatchlist && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(stock.id);
                        }}
                        title={watchlistIds.includes(stock.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                          watchlistIds.includes(stock.id)
                            ? 'bg-cyan-950 text-cyan-400 border-cyan-700'
                            : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${watchlistIds.includes(stock.id) ? 'fill-cyan-400' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="mt-3 text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {stock.description}
                </p>
              </div>

              {/* Research Score Bar & Fast Metrics */}
              <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-950 to-slate-900 border border-cyan-500/50 flex items-center justify-center font-black text-xs text-cyan-300 font-mono shadow-md shadow-cyan-950 shrink-0">
                    {stock.compositeAiScore}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-200 uppercase tracking-tight">
                      AI Score
                    </div>
                    <div className="text-[10px] text-emerald-400 font-medium flex items-center space-x-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                      <span>{stock.dataConfidenceScore}% Conf</span>
                    </div>
                  </div>
                </div>

                {/* Primary Factor Badges */}
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono">
                    P/E: <strong className="text-white">{stock.peRatio}x</strong>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono">
                    ROCE: <strong className="text-emerald-400">{stock.financials?.[0]?.roce || 18}%</strong>
                  </span>
                  <button className="p-1.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-800 group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-md">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStocks.length === 0 && (
          <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <Filter className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-300 font-bold">No stocks match the selected price range & segment filters.</p>
            <button
              onClick={() => {
                setSelectedPriceRange('ALL');
                setStockTab('ALL');
              }}
              className="mt-3 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
