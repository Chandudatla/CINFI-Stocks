import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  SlidersHorizontal,
  ChevronDown,
  Activity,
  AlertCircle,
  BellRing,
  Newspaper,
  Radio,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import { CompanyStock, NavigationTab } from '../../types/stock';
import { CompanyLogo } from './CompanyLogo';
import { MarketEngineStatus } from '../../hooks/useLiveMarketEngine';
import { Cinfi3DLogo } from './Visual3DElements';

interface HeaderProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  stocks?: CompanyStock[];
  onSelectStock: (stock: CompanyStock) => void;
  onOpenDisclaimer: () => void;
  engineStatus?: MarketEngineStatus;
  toggleStreaming?: () => void;
  onRefreshLiveQuotes?: () => void;
  lastChangedSymbol?: string | null;
  tickDirection?: 'UP' | 'DOWN';
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  stocks = [],
  onSelectStock,
  onOpenDisclaimer,
  engineStatus,
  toggleStreaming,
  onRefreshLiveQuotes,
  lastChangedSymbol,
  tickDirection = 'UP'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredStocks = searchQuery.trim() === '' 
    ? [] 
    : stocks.filter(s => 
        s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.futureThemes || []).some(t => (t.themeName || (t as any).name || '').toLowerCase().includes(searchQuery.toLowerCase()))
      );

  return (
    <header id="main-header" className="sticky top-0 z-40 w-full max-w-full bg-slate-900/95 border-b border-slate-800 text-slate-100 shadow-xl backdrop-blur-md overflow-x-hidden">
      {/* Top Banner / Live Status Indicator */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-3 sm:px-4 py-1 text-[10px] sm:text-xs border-b border-slate-800/80 flex items-center justify-between gap-2 overflow-hidden">
        <div className="flex items-center space-x-2 shrink-0">
          <div 
            onClick={toggleStreaming}
            className="flex items-center space-x-1.5 cursor-pointer bg-slate-900/80 px-2 py-0.5 rounded-lg border border-slate-800 hover:border-emerald-500/40 transition-colors"
            title="Toggle 24/7 Live Stream"
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${engineStatus?.isStreaming ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${engineStatus?.isStreaming ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className={`font-bold tracking-wide uppercase text-[9px] sm:text-[10px] ${engineStatus?.isStreaming ? 'text-emerald-400' : 'text-amber-400'}`}>
              {engineStatus?.isStreaming ? '24/7 Live Stream' : 'Stream Paused'}
            </span>
          </div>

          {onRefreshLiveQuotes && (
            <button
              onClick={onRefreshLiveQuotes}
              disabled={engineStatus?.isRefreshing}
              className="flex items-center space-x-1 font-mono text-[9px] sm:text-[10px] bg-slate-950/90 hover:bg-slate-800 text-cyan-300 px-2 py-0.5 rounded-lg border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer"
              title="Sync real-time prices directly from NSE/BSE"
            >
              <RefreshCw className={`w-3 h-3 text-cyan-400 ${engineStatus?.isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">{engineStatus?.isRefreshing ? 'Syncing Live...' : 'Sync Live Prices'}</span>
            </button>
          )}

          {lastChangedSymbol && (
            <div className="hidden sm:flex items-center space-x-1 font-mono text-[10px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-slate-300">
              <span className="text-slate-400">Tick:</span>
              <span className="text-white font-bold">{lastChangedSymbol}</span>
              {tickDirection === 'UP' ? (
                <TrendingUp className="w-3 h-3 text-emerald-400" />
              ) : (
                <TrendingDown className="w-3 h-3 text-rose-400" />
              )}
            </div>
          )}

          <span className="text-slate-600 hidden xs:inline">|</span>
          <span className="text-slate-400 hidden lg:inline text-[11px] truncate">
            {engineStatus?.marketStatus ? (
              <span className="text-slate-300">
                NSE/BSE Status: <strong className={engineStatus.marketStatus.statusColor}>{engineStatus.marketStatus.statusLabel}</strong> ({engineStatus.marketStatus.istTime})
              </span>
            ) : (
              'Audited Corporate Filings & Live Bhavcopy Stream'
            )}
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
          {engineStatus?.lastFetchedAt && (
            <span className="text-slate-400 hidden md:inline text-[10px] font-mono">
              Live Sync: <strong className="text-emerald-400">{engineStatus.lastFetchedAt}</strong>
            </span>
          )}

          <button 
            id="disclaimer-trigger-btn"
            onClick={onOpenDisclaimer}
            className="flex items-center space-x-1 text-slate-400 hover:text-amber-300 transition-colors text-[10px] sm:text-[11px] cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Disclaimer</span>
          </button>

          <span className="text-slate-700 hidden sm:inline">•</span>
          
          <span className="text-slate-400 hidden sm:inline text-[11px]">
            Data: <strong className="text-emerald-400">100% Real Live</strong>
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Developer Attribution with 3D Logo */}
        <div 
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center space-x-2 sm:space-x-3 shrink-0 cursor-pointer group"
        >
          <Cinfi3DLogo size="md" className="group-hover:scale-105 transition-transform" />
          <div className="flex flex-col justify-center">
            <h1 className="text-base sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent leading-none">
              CINFI Stocks
            </h1>
            <p className="text-[9px] sm:text-[11px] text-slate-400 font-medium mt-1 leading-none">
              Developed by <span className="text-cyan-300 font-semibold tracking-wide">RUINNERS</span>
            </p>
          </div>
        </div>

        {/* Global Search Bar with Live Suggestions and Company Logos */}
        <div className="relative flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-cyan-400" />
            </div>
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search NSE stock, symbol (TATAMOTORS, BEL, KAYNES), sector, or theme..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Search Dropdown Results with Company Logos */}
          {isSearchOpen && filteredStocks.length > 0 && (
            <div 
              id="search-results-dropdown"
              className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="px-3.5 py-2 bg-slate-950/80 text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex justify-between">
                <span>Matching Verified Indian Equities</span>
                <span>Select Stock to Open Terminal</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {filteredStocks.map((stock) => (
                  <button
                    key={stock.id}
                    id={`search-item-${stock.symbol}`}
                    onClick={() => {
                      onSelectStock(stock);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-slate-800/80 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <CompanyLogo 
                        symbol={stock.symbol}
                        name={stock.name}
                        size="sm"
                        customLogoUrl={stock.logoUrl}
                        brandColor={stock.brandColor}
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                            {stock.symbol}
                          </span>
                          <span className="text-xs text-slate-400">({stock.name})</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                          <span className="text-cyan-400 font-medium">{stock.sector}</span>
                          <span>•</span>
                          <span className="text-slate-400">{stock.industry}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-sm text-slate-100">
                        ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                      <div className={`text-xs font-bold ${stock.percentChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {stock.percentChange >= 0 ? '+' : ''}{stock.percentChange}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Action Tools: News & Smart Alerts */}
        <div className="flex items-center space-x-2">
          {/* News Wire Quick Button */}
          <button
            id="header-news-btn"
            onClick={() => onSelectTab('news')}
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              currentTab === 'news'
                ? 'bg-amber-950 text-amber-300 border-amber-500 shadow-md shadow-amber-950'
                : 'bg-slate-950 text-slate-300 hover:text-amber-300 border-slate-800'
            }`}
            title="Open Live News & Guru Wire"
          >
            <Newspaper className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">News Wire</span>
          </button>

          {/* Smart Alerts Quick Trigger Button */}
          <button
            id="header-alerts-btn"
            onClick={() => onSelectTab('alerts')}
            className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              currentTab === 'alerts'
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-md shadow-cyan-950'
                : 'bg-slate-950 text-slate-300 hover:text-cyan-300 border-slate-800'
            }`}
            title="Open Smart Alerts & Threshold Monitors"
          >
            <div className="relative">
              <BellRing className="w-4 h-4 text-cyan-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-500"></span>
            </div>
            <span className="hidden sm:inline">Alerts</span>
          </button>
        </div>
      </div>
    </header>
  );
};

