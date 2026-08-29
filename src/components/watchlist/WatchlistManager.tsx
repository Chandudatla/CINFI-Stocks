import React, { useState } from 'react';
import { 
  Bookmark, 
  Plus, 
  Trash2, 
  Sparkles, 
  Search, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  ExternalLink, 
  BellRing, 
  ArrowLeftRight,
  Filter,
  CheckCircle2,
  FileText,
  Save,
  Edit3,
  X,
  Layers
} from 'lucide-react';
import { CompanyStock } from '../../types/stock';
import { CompanyLogo } from '../common/CompanyLogo';

interface WatchlistManagerProps {
  stocks?: CompanyStock[];
  allStocks?: CompanyStock[];
  watchlistIds: string[];
  onToggleWatchlist: (stockId: string) => void;
  onSelectStock: (stock: CompanyStock) => void;
  onNavigateToScreener?: () => void;
  onNavigateToCompare?: () => void;
  onNavigateToAlerts?: (stock?: CompanyStock) => void;
}

export const WatchlistManager: React.FC<WatchlistManagerProps> = ({
  stocks,
  allStocks,
  watchlistIds = [],
  onToggleWatchlist,
  onSelectStock,
  onNavigateToScreener,
  onNavigateToCompare,
  onNavigateToAlerts
}) => {
  const stockList = stocks || allStocks || [];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [sortBy, setSortBy] = useState<'score' | 'change' | 'mcap' | 'pe'>('score');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [stockSearchToAdd, setStockSearchToAdd] = useState('');

  // Local user notes & custom targets state persisted in localStorage
  const [customNotes, setCustomNotes] = useState<Record<string, { targetPrice?: number; notes?: string }>>(() => {
    try {
      const saved = localStorage.getItem('cinfi_watchlist_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [editTargetPrice, setEditTargetPrice] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');

  const handleSaveNotes = (stockId: string) => {
    const updated = {
      ...customNotes,
      [stockId]: {
        targetPrice: editTargetPrice ? parseFloat(editTargetPrice) : undefined,
        notes: editNotes
      }
    };
    setCustomNotes(updated);
    try {
      localStorage.setItem('cinfi_watchlist_notes', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save watchlist notes', e);
    }
    setEditingStockId(null);
  };

  const handleStartEdit = (stock: CompanyStock) => {
    setEditingStockId(stock.id);
    const existing = customNotes[stock.id];
    setEditTargetPrice(existing?.targetPrice ? existing.targetPrice.toString() : '');
    setEditNotes(existing?.notes || '');
  };

  // Watchlisted stocks objects
  const watchlistedStocks = stockList.filter(s => watchlistIds.includes(s.id));

  // Compute summary metrics
  const totalMarketCapCr = watchlistedStocks.reduce((acc, s) => acc + s.marketCapCr, 0);
  const avgAiScore = watchlistedStocks.length > 0 
    ? Math.round(watchlistedStocks.reduce((acc, s) => acc + s.compositeAiScore, 0) / watchlistedStocks.length)
    : 0;
  const avg1dChange = watchlistedStocks.length > 0
    ? (watchlistedStocks.reduce((acc, s) => acc + s.percentChange, 0) / watchlistedStocks.length).toFixed(2)
    : '0.00';
  
  const sectors = ['ALL', ...Array.from(new Set(watchlistedStocks.map(s => s.sector)))];

  // Filter & sort watchlisted stocks
  const filteredStocks = watchlistedStocks
    .filter(stock => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          stock.symbol.toLowerCase().includes(q) ||
          stock.name.toLowerCase().includes(q) ||
          stock.sector.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (selectedSector !== 'ALL' && stock.sector !== selectedSector) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.compositeAiScore - a.compositeAiScore;
      if (sortBy === 'change') return b.percentChange - a.percentChange;
      if (sortBy === 'mcap') return b.marketCapCr - a.marketCapCr;
      if (sortBy === 'pe') return a.peRatio - b.peRatio;
      return 0;
    });

  // Export Watchlist as CSV
  const handleExportCSV = () => {
    if (watchlistedStocks.length === 0) return;
    const headers = ['Symbol', 'Company Name', 'Sector', 'Current Price (INR)', '1D Change (%)', 'Composite AI Score', 'P/E Ratio', 'ROCE (%)', 'Debt to Equity', 'Market Cap (Cr)', 'Target Price', 'Personal Notes'];
    const rows = watchlistedStocks.map(s => {
      const noteData = customNotes[s.id];
      return [
        `"${s.symbol}"`,
        `"${s.name}"`,
        `"${s.sector}"`,
        s.currentPrice,
        s.percentChange,
        s.compositeAiScore,
        s.peRatio,
        s.financials[0]?.roce || '',
        s.financials[0]?.debtToEquity || '',
        s.marketCapCr,
        noteData?.targetPrice || '',
        `"${(noteData?.notes || '').replace(/"/g, '""')}"`
      ].join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CINFI_Watchlist_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="watchlist-manager-view" className="w-full max-w-full space-y-6 pb-16 min-w-0 overflow-x-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <Bookmark className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 fill-cyan-400 shrink-0" />
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight break-words">
              Active Portfolio Watchlist
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
            Real-time factor tracking, custom valuation targets, and statutory earnings alerts for your high-conviction ideas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-950/50 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Stock</span>
          </button>

          {watchlistedStocks.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Bar */}
      {watchlistedStocks.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 min-w-0">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
            <span className="text-slate-400 text-xs font-medium block">Watchlisted Equities</span>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">{watchlistedStocks.length}</div>
            <span className="text-[10px] text-cyan-400">High-conviction ideas</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
            <span className="text-slate-400 text-xs font-medium block">Avg. AI Composite Score</span>
            <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">{avgAiScore}/100</div>
            <span className="text-[10px] text-emerald-400">Institutional Factor Avg</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
            <span className="text-slate-400 text-xs font-medium block">Avg. 1D Price Delta</span>
            <div className={`text-xl sm:text-2xl font-black font-mono flex items-center space-x-1 ${parseFloat(avg1dChange) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {parseFloat(avg1dChange) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{parseFloat(avg1dChange) >= 0 ? '+' : ''}{avg1dChange}%</span>
            </div>
            <span className="text-[10px] text-slate-400">Daily equal-weight return</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
            <span className="text-slate-400 text-xs font-medium block">Total Watchlist Cap</span>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">₹{(totalMarketCapCr / 1000).toFixed(1)}k Cr</div>
            <span className="text-[10px] text-slate-400">Combined market capital</span>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      {watchlistedStocks.length > 0 ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex-1 flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[200px] flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search symbol, company or sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sector filter pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
              {sectors.map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSector(sec)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    selectedSector === sec
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {sec === 'ALL' ? 'All Sectors' : sec}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-slate-400 text-xs font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-cyan-300 font-semibold focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="score">AI Score (High to Low)</option>
              <option value="change">1D Return (High to Low)</option>
              <option value="mcap">Market Cap</option>
              <option value="pe">P/E Ratio (Lowest)</option>
            </select>
          </div>
        </div>
      ) : null}

      {/* Main Watchlist List / Empty State */}
      {watchlistedStocks.length === 0 ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-cyan-950/80 border border-cyan-700/50 flex items-center justify-center mx-auto text-cyan-400 shadow-xl shadow-cyan-950/50">
            <Bookmark className="w-8 h-8 fill-cyan-400/20" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Your Watchlist is Empty</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
              Save high-conviction companies to monitor 10-factor quant scores, earnings releases, and price target triggers in one unified dashboard.
            </p>
          </div>

          <div className="pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
              Quick Add High-Conviction Indian Market Leaders:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
              {allStocks.slice(0, 5).map((stock) => (
                <button
                  key={stock.id}
                  onClick={() => onToggleWatchlist(stock.id)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 text-slate-200 text-xs font-semibold transition-all hover:scale-105 cursor-pointer shadow-md"
                >
                  <CompanyLogo
                    symbol={stock.symbol}
                    name={stock.name}
                    size="xs"
                    customLogoUrl={stock.logoUrl}
                    brandColor={stock.brandColor}
                  />
                  <span>{stock.symbol}</span>
                  <span className="text-[10px] text-cyan-400 font-mono">({stock.compositeAiScore}/100)</span>
                  <Plus className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStocks.map((stock) => {
            const noteData = customNotes[stock.id];
            const isEditing = editingStockId === stock.id;

            return (
              <div
                key={stock.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl transition-all"
              >
                {/* Top Row: Symbol, Price, Score, and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center space-x-3.5">
                    <CompanyLogo
                      symbol={stock.symbol}
                      name={stock.name}
                      size="lg"
                      customLogoUrl={stock.logoUrl}
                      brandColor={stock.brandColor}
                    />

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span 
                          onClick={() => onSelectStock(stock)}
                          className="text-lg sm:text-xl font-black text-white hover:text-cyan-300 cursor-pointer transition-colors"
                        >
                          {stock.symbol}
                        </span>
                        <span className="text-xs text-slate-400 font-medium truncate max-w-[200px]">
                          ({stock.name})
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800 font-mono">
                          {stock.sector}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                        <span>P/E: <strong className="text-slate-200 font-mono">{stock.peRatio}x</strong></span>
                        <span>•</span>
                        <span>ROCE: <strong className="text-emerald-400 font-mono">{stock.financials[0]?.roce}%</strong></span>
                        <span>•</span>
                        <span>D/E: <strong className="text-slate-200 font-mono">{stock.financials[0]?.debtToEquity}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 sm:space-x-6 self-end sm:self-center">
                    {/* Price delta */}
                    <div className="text-right">
                      <div className="text-lg sm:text-xl font-mono font-black text-white">
                        ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                      <div className={`text-xs font-bold flex items-center justify-end space-x-1 ${stock.percentChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {stock.percentChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{stock.percentChange >= 0 ? '+' : ''}{stock.percentChange}%</span>
                      </div>
                    </div>

                    {/* AI Score Badge */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-950 to-indigo-950 border border-cyan-700 flex flex-col items-center justify-center shadow-md">
                      <span className="text-sm font-black font-mono text-cyan-300">{stock.compositeAiScore}</span>
                      <span className="text-[7px] uppercase tracking-wider text-slate-400 font-bold">Score</span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center space-x-1.5 pl-2 border-l border-slate-800">
                      {onNavigateToAlerts && (
                        <button
                          onClick={() => onNavigateToAlerts(stock)}
                          title="Set Price Alert"
                          className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 transition-colors cursor-pointer"
                        >
                          <BellRing className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleStartEdit(stock)}
                        title="Edit Target Price & Notes"
                        className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onToggleWatchlist(stock.id)}
                        title="Remove from Watchlist"
                        className="p-2 rounded-xl bg-slate-950 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-800 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Custom Notes & Price Target Display / Edit Mode */}
                {isEditing ? (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-800/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Watchlist Thesis & Target Price for {stock.symbol}</span>
                      </span>
                      <button onClick={() => setEditingStockId(null)} className="text-slate-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Target Entry / Exit Price (₹)</label>
                        <input
                          type="number"
                          placeholder="e.g. 1150"
                          value={editTargetPrice}
                          onChange={(e) => setEditTargetPrice(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[11px] text-slate-400 block mb-1">Investment Thesis / Catalyst Notes</label>
                        <input
                          type="text"
                          placeholder="e.g. Q3 earnings order backlog growth & margin expansion"
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-1">
                      <button
                        onClick={() => setEditingStockId(null)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveNotes(stock.id)}
                        className="px-3.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  (noteData?.targetPrice || noteData?.notes) && (
                    <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center space-x-2 text-slate-300">
                        <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="italic">{noteData.notes || 'No notes added'}</span>
                      </div>

                      {noteData.targetPrice && (
                        <div className="flex items-center space-x-1.5 text-[11px] font-mono shrink-0">
                          <span className="text-slate-400">Target:</span>
                          <span className="text-cyan-300 font-bold">₹{noteData.targetPrice}</span>
                          <span className={`text-[10px] ${stock.currentPrice < noteData.targetPrice ? 'text-emerald-400' : 'text-amber-400'}`}>
                            ({((noteData.targetPrice - stock.currentPrice) / stock.currentPrice * 100).toFixed(1)}% gap)
                          </span>
                        </div>
                      )}
                    </div>
                  )
                )}

                {/* Footer link to launch Terminal */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/70 text-xs">
                  <div className="flex items-center space-x-1 text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px]">{stock.futureThemes[0]?.name || 'High Factor Conviction'}</span>
                  </div>

                  <button
                    onClick={() => onSelectStock(stock)}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                  >
                    <span>Launch Intelligence Terminal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Stock Quick Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bookmark className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Add Equity to Watchlist</h3>
              </div>
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setStockSearchToAdd('');
                }}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by company name, NSE symbol or sector..."
                value={stockSearchToAdd}
                onChange={(e) => setStockSearchToAdd(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                autoFocus
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 no-scrollbar">
              {stockList
                .filter(s => {
                  if (!stockSearchToAdd.trim()) return true;
                  const q = stockSearchToAdd.toLowerCase();
                  return (
                    s.symbol.toLowerCase().includes(q) ||
                    s.name.toLowerCase().includes(q) ||
                    s.sector.toLowerCase().includes(q)
                  );
                })
                .map(stock => {
                  const isAlreadyIn = watchlistIds.includes(stock.id);
                  return (
                    <div
                      key={stock.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
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
                          <div className="font-bold text-white text-xs">{stock.symbol}</div>
                          <div className="text-[11px] text-slate-400">{stock.name}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="font-mono font-bold text-white text-xs">₹{stock.currentPrice}</div>
                          <div className="text-[10px] text-cyan-400 font-mono">Score: {stock.compositeAiScore}</div>
                        </div>

                        <button
                          onClick={() => onToggleWatchlist(stock.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer ${
                            isAlreadyIn
                              ? 'bg-rose-950/80 text-rose-300 border border-rose-800 hover:bg-rose-900'
                              : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-md'
                          }`}
                        >
                          {isAlreadyIn ? (
                            <>
                              <X className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setStockSearchToAdd('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
