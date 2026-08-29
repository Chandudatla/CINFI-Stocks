import React, { useState, useEffect } from 'react';
import { CompanyStock, NavigationTab } from './types/stock';
import { STOCKS_DATA } from './data/indianMarketData';
import { useLiveMarketEngine } from './hooks/useLiveMarketEngine';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { MarketOverview } from './components/dashboard/MarketOverview';
import { CompanyTerminal } from './components/stock/CompanyTerminal';
import { StockDirectory } from './components/stock/StockDirectory';
import { UniversalScreener } from './components/screener/UniversalScreener';
import { ThemeExplorer } from './components/themes/ThemeExplorer';
import { StockCompare } from './components/compare/StockCompare';
import { StrategyBacktester } from './components/backtest/StrategyBacktester';
import { WatchlistManager } from './components/watchlist/WatchlistManager';
import { SmartAlerts } from './components/alerts/SmartAlerts';
import { EvidenceAuditView } from './components/evidence/EvidenceAuditView';
import { MarketNewsFeed } from './components/news/MarketNewsFeed';
import { FinancialGuide } from './components/learn/FinancialGuide';
import { DisclaimerModal } from './components/common/DisclaimerModal';
import { Cinfi3DLogo } from './components/common/Visual3DElements';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Cpu, 
  Filter, 
  ArrowLeftRight, 
  LineChart, 
  Bookmark, 
  FileCheck, 
  BookOpen,
  BellRing,
  Newspaper
} from 'lucide-react';

const WATCHLIST_STORAGE_KEY = 'cinfi_user_watchlist_ids';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [selectedStock, setSelectedStock] = useState<CompanyStock | null>(null);
  const [selectedThemeFilter, setSelectedThemeFilter] = useState<string | undefined>(undefined);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  // 24/7 Real-Time Live Market Engine
  const {
    stocks,
    marketIndices,
    marketStatus,
    engineStatus,
    toggleStreaming,
    refreshLiveQuotes,
    lastChangedSymbol,
    tickDirection
  } = useLiveMarketEngine(STOCKS_DATA);

  // Persistent Watchlist state
  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved watchlist from localStorage', e);
    }
    return ['tatamotors', 'bel', 'tcs'];
  });

  // Sync Watchlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlistIds));
    } catch (e) {
      console.warn('Failed to save watchlist to localStorage', e);
    }
  }, [watchlistIds]);

  const toggleWatchlist = (stockId: string) => {
    setWatchlistIds(prev => 
      prev.includes(stockId) ? prev.filter(id => id !== stockId) : [...prev, stockId]
    );
  };

  const handleSelectStock = (stock: CompanyStock) => {
    // Keep reference updated with the live stock data
    const liveStock = stocks.find(s => s.id === stock.id) || stock;
    setSelectedStock(liveStock);
    setCurrentTab('stocks');
  };

  const handleSelectTheme = (themeId: string) => {
    setSelectedThemeFilter(themeId);
    setCurrentTab('themes');
  };

  return (
    <div className="min-h-screen w-full max-w-full bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      {/* Header with 24/7 Live Stream Telemetry & Quick News */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab !== 'stocks') setSelectedStock(null);
          setCurrentTab(tab);
        }}
        stocks={stocks}
        onSelectStock={handleSelectStock}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        engineStatus={engineStatus}
        toggleStreaming={toggleStreaming}
        onRefreshLiveQuotes={refreshLiveQuotes}
        lastChangedSymbol={lastChangedSymbol}
        tickDirection={tickDirection}
      />

      {/* Body Area with Sidebar + Main Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto overflow-x-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          watchlistCount={watchlistIds.length}
          onSelectTab={(tab) => {
            if (tab !== 'stocks') setSelectedStock(null);
            setCurrentTab(tab);
          }}
          onSelectThemeFastFilter={(themeId) => {
            setSelectedThemeFilter(themeId);
            setCurrentTab('themes');
          }}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 min-w-0 w-full overflow-x-hidden">
          {currentTab === 'dashboard' && (
            <MarketOverview
              stocks={stocks}
              indices={marketIndices}
              marketStatus={marketStatus}
              onRefreshLiveQuotes={refreshLiveQuotes}
              isRefreshing={engineStatus.isRefreshing}
              lastFetchedAt={engineStatus.lastFetchedAt}
              watchlistIds={watchlistIds}
              onToggleWatchlist={toggleWatchlist}
              onSelectStock={handleSelectStock}
              onSelectTheme={handleSelectTheme}
              onNavigateToScreener={() => setCurrentTab('screener')}
              onNavigateToTab={(tab) => {
                if (tab !== 'stocks') setSelectedStock(null);
                setCurrentTab(tab);
              }}
            />
          )}

          {currentTab === 'stocks' && (
            selectedStock ? (
              <CompanyTerminal
                stock={stocks.find(s => s.id === selectedStock.id) || selectedStock}
                isWatchlisted={watchlistIds.includes(selectedStock.id)}
                onToggleWatchlist={toggleWatchlist}
                onBack={() => {
                  setSelectedStock(null);
                  setCurrentTab('stocks');
                }}
                onSelectTheme={handleSelectTheme}
                onOpenAlerts={() => {
                  setCurrentTab('alerts');
                }}
              />
            ) : (
              <StockDirectory
                stocks={stocks}
                watchlistIds={watchlistIds}
                onToggleWatchlist={toggleWatchlist}
                onSelectStock={handleSelectStock}
                onNavigateToCompare={() => setCurrentTab('compare')}
              />
            )
          )}

          {currentTab === 'themes' && (
            <ThemeExplorer
              stocks={stocks}
              selectedThemeId={selectedThemeFilter}
              onSelectStock={handleSelectStock}
            />
          )}

          {currentTab === 'screener' && (
            <UniversalScreener
              stocks={stocks}
              watchlistIds={watchlistIds}
              onToggleWatchlist={toggleWatchlist}
              onSelectStock={handleSelectStock}
            />
          )}

          {currentTab === 'compare' && (
            <StockCompare
              stocks={stocks}
              onSelectStock={handleSelectStock}
            />
          )}

          {currentTab === 'backtest' && (
            <StrategyBacktester />
          )}

          {currentTab === 'watchlist' && (
            <WatchlistManager
              stocks={stocks}
              watchlistIds={watchlistIds}
              onToggleWatchlist={toggleWatchlist}
              onSelectStock={handleSelectStock}
              onNavigateToScreener={() => setCurrentTab('screener')}
              onNavigateToCompare={() => setCurrentTab('compare')}
              onNavigateToAlerts={(stk) => {
                if (stk) setSelectedStock(stk);
                setCurrentTab('alerts');
              }}
            />
          )}

          {currentTab === 'alerts' && (
            <SmartAlerts
              stocks={stocks}
              onSelectStock={handleSelectStock}
            />
          )}

          {currentTab === 'evidence' && (
            <EvidenceAuditView
              stocks={stocks}
              onSelectStock={handleSelectStock}
            />
          )}

          {currentTab === 'news' && (
            <MarketNewsFeed
              stocks={stocks}
              onSelectStock={handleSelectStock}
            />
          )}

          {currentTab === 'learn' && (
            <FinancialGuide />
          )}

          {/* Footer Attribution Banner */}
          <footer className="mt-12 pt-6 pb-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center space-x-3">
              <Cinfi3DLogo size="sm" />
              <div>
                <div className="font-extrabold text-slate-200 text-sm tracking-tight">
                  CINFI Stocks
                </div>
                <div className="text-[11px] text-slate-400">
                  Developed by <strong className="text-cyan-300 font-semibold">RUINNERS</strong>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px]">
              <button
                onClick={() => setIsDisclaimerOpen(true)}
                className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                SEBI Statutory Disclaimer
              </button>
              <span className="text-slate-700">•</span>
              <span className="text-slate-400">Zero-Hallucination Quant Architecture</span>
              <span className="text-slate-700">•</span>
              <span className="text-slate-400">24/7 Live Engine</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Visible on mobile screens) */}
      <div className="lg:hidden sticky bottom-0 z-40 w-full max-w-full bg-slate-900/95 border-t border-slate-800 backdrop-blur px-1.5 py-1.5 flex items-center justify-around text-[10px] overflow-x-auto no-scrollbar gap-0.5 shadow-2xl">
        <button
          onClick={() => {
            setSelectedStock(null);
            setCurrentTab('dashboard');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl shrink-0 transition-colors ${currentTab === 'dashboard' ? 'text-cyan-400 font-bold bg-slate-800/80 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => {
            setSelectedStock(null);
            setCurrentTab('stocks');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl shrink-0 transition-colors ${currentTab === 'stocks' ? 'text-cyan-400 font-bold bg-slate-800/80 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <TrendingUp className="w-4 h-4 mb-0.5" />
          <span>Stocks</span>
        </button>

        <button
          onClick={() => setCurrentTab('news')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl shrink-0 transition-colors ${currentTab === 'news' ? 'text-amber-300 font-bold bg-slate-800/80 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <div className="relative">
            <Newspaper className="w-4 h-4 mb-0.5 text-amber-400" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
          </div>
          <span>News Wire</span>
        </button>

        <button
          onClick={() => setCurrentTab('watchlist')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl shrink-0 transition-colors ${currentTab === 'watchlist' ? 'text-cyan-400 font-bold bg-slate-800/80 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <div className="relative">
            <Bookmark className="w-4 h-4 mb-0.5" />
            {watchlistIds.length > 0 && (
              <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-cyan-500 text-[8px] font-mono text-slate-950 font-black">
                {watchlistIds.length}
              </span>
            )}
          </div>
          <span>Watchlist</span>
        </button>

        <button
          onClick={() => setCurrentTab('themes')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl shrink-0 transition-colors ${currentTab === 'themes' ? 'text-cyan-400 font-bold bg-slate-800/80 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Cpu className="w-4 h-4 mb-0.5" />
          <span>Themes</span>
        </button>

        <button
          onClick={() => setCurrentTab('screener')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl shrink-0 transition-colors ${currentTab === 'screener' ? 'text-cyan-400 font-bold bg-slate-800/80 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Filter className="w-4 h-4 mb-0.5" />
          <span>Screener</span>
        </button>

        <button
          onClick={() => setCurrentTab('alerts')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl shrink-0 transition-colors ${currentTab === 'alerts' ? 'text-cyan-400 font-bold bg-slate-800/80 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <div className="relative">
            <BellRing className="w-4 h-4 mb-0.5" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          </div>
          <span>Alerts</span>
        </button>
      </div>

      {/* SEBI Educational & Research Disclaimer Modal */}
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
    </div>
  );
}

