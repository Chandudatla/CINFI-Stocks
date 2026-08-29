import React, { useState } from 'react';
import { 
  Filter, 
  Search, 
  Sparkles, 
  Download, 
  RotateCcw,
  Zap,
  Bookmark,
  ExternalLink,
  CheckCircle2,
  X,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { CompanyStock } from '../../types/stock';
import { FUTURE_THEMES } from '../../data/indianMarketData';
import { CompanyLogo } from '../common/CompanyLogo';

interface UniversalScreenerProps {
  stocks?: CompanyStock[];
  watchlistIds?: string[];
  onToggleWatchlist?: (stockId: string) => void;
  onSelectStock: (stock: CompanyStock) => void;
}

export const UniversalScreener: React.FC<UniversalScreenerProps> = ({
  stocks = [],
  watchlistIds = [],
  onToggleWatchlist,
  onSelectStock
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('ALL');
  const [selectedTheme, setSelectedTheme] = useState('ALL');
  const [minScore, setMinScore] = useState(70);
  const [minRoce, setMinRoce] = useState(10);
  const [maxDebtEquity, setMaxDebtEquity] = useState(2.0);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const priceRanges = [
    { id: 'ALL', label: 'All Prices (-)' },
    { id: '0-100', label: '₹0 – ₹100' },
    { id: '101-500', label: '₹101 – ₹500' },
    { id: '501-1000', label: '₹501 – ₹1,000' },
    { id: '1001-3000', label: '₹1,001 – ₹3,000' },
    { id: '3001-above', label: '₹3,001 & Above' }
  ];

  const presets = [
    {
      id: 'multibagger',
      label: 'High-Conviction Multi-Baggers',
      desc: 'Score ≥ 85, ROCE ≥ 20%, D/E ≤ 0.8',
      apply: () => {
        setMinScore(85);
        setMinRoce(20);
        setMaxDebtEquity(0.8);
        setSelectedPriceRange('ALL');
        setSelectedTheme('ALL');
        setActivePreset('multibagger');
      }
    },
    {
      id: 'clean_balance',
      label: 'Clean Balance Sheet Moats',
      desc: 'D/E ≤ 0.2, ROCE ≥ 18%',
      apply: () => {
        setMinScore(75);
        setMinRoce(18);
        setMaxDebtEquity(0.2);
        setSelectedPriceRange('ALL');
        setSelectedTheme('ALL');
        setActivePreset('clean_balance');
      }
    },
    {
      id: 'defense_osat',
      label: 'Make-in-India & Defense',
      desc: 'Aerospace, Defense & OSAT',
      apply: () => {
        setSelectedTheme('defence-aerospace');
        setMinScore(75);
        setMinRoce(15);
        setMaxDebtEquity(1.5);
        setSelectedPriceRange('ALL');
        setActivePreset('defense_osat');
      }
    },
    {
      id: 'green_ev',
      label: 'Green Energy & EV Cycle',
      desc: 'Renewable Power & Mobility',
      apply: () => {
        setSelectedTheme('renewable-energy');
        setMinScore(75);
        setMinRoce(12);
        setMaxDebtEquity(2.0);
        setSelectedPriceRange('ALL');
        setActivePreset('green_ev');
      }
    },
    {
      id: 'value',
      label: 'Value Compounders',
      desc: 'Score ≥ 80, Moderate Valuation',
      apply: () => {
        setMinScore(80);
        setMinRoce(15);
        setMaxDebtEquity(1.0);
        setSelectedPriceRange('101-500');
        setSelectedTheme('ALL');
        setActivePreset('value');
      }
    }
  ];

  const filteredStocks = stocks.filter((stock) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        stock.symbol.toLowerCase().includes(q) ||
        stock.name.toLowerCase().includes(q) ||
        stock.sector.toLowerCase().includes(q) ||
        stock.isin.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Price range
    if (selectedPriceRange === '0-100' && (stock.currentPrice < 0 || stock.currentPrice > 100)) return false;
    if (selectedPriceRange === '101-500' && (stock.currentPrice <= 100 || stock.currentPrice > 500)) return false;
    if (selectedPriceRange === '501-1000' && (stock.currentPrice <= 500 || stock.currentPrice > 1000)) return false;
    if (selectedPriceRange === '1001-3000' && (stock.currentPrice <= 1000 || stock.currentPrice > 3000)) return false;
    if (selectedPriceRange === '3001-above' && stock.currentPrice <= 3000) return false;

    // Theme
    if (selectedTheme !== 'ALL') {
      const hasTheme = stock.futureThemes.some(t => t.themeId === selectedTheme);
      if (!hasTheme) return false;
    }

    // AI Score
    if (stock.compositeAiScore < minScore) return false;

    // ROCE
    const currentRoce = stock.financials[0]?.roce || 0;
    if (currentRoce < minRoce) return false;

    // Debt/Equity
    const currentDebtEquity = stock.financials[0]?.debtToEquity || 0;
    if (currentDebtEquity > maxDebtEquity) return false;

    return true;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedPriceRange('ALL');
    setSelectedTheme('ALL');
    setMinScore(70);
    setMinRoce(10);
    setMaxDebtEquity(2.0);
    setActivePreset(null);
  };

  const handleExportCSV = () => {
    if (filteredStocks.length === 0) return;
    const headers = ['Symbol', 'Company Name', 'Sector', 'Current Price (INR)', '1D Change (%)', 'Market Cap (Cr)', 'P/E Ratio', 'ROCE (%)', 'Debt to Equity', 'Composite AI Score'];
    const rows = filteredStocks.map(s => [
      `"${s.symbol}"`,
      `"${s.name}"`,
      `"${s.sector}"`,
      s.currentPrice,
      s.percentChange,
      s.marketCapCr,
      s.peRatio,
      s.financials[0]?.roce || '',
      s.financials[0]?.debtToEquity || '',
      s.compositeAiScore
    ].join(','));
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CINFI_Screener_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="universal-screener-view" className="w-full max-w-full space-y-6 pb-16 min-w-0 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl min-w-0">
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 shrink-0" />
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight break-words">
              Universal Stock Screener & Quantitative Filter
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
            Deterministic filtering of NSE equities with fundamental ratios, 10-factor models, audited filings, and future theme mappings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="flex items-center space-x-2 font-mono text-xs text-cyan-300 bg-cyan-950/80 px-3 py-1.5 rounded-xl border border-cyan-800 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>{filteredStocks.length} of {stocks.length} Passed</span>
          </div>

          {filteredStocks.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Preset Strategy Cards */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          One-Click Quant Strategy Presets:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {presets.map((p) => {
            const isSelected = activePreset === p.id;
            return (
              <button
                key={p.id}
                onClick={p.apply}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-cyan-950 via-slate-900 to-indigo-950 border-cyan-500 text-white shadow-lg shadow-cyan-950/40'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold truncate">
                  <Sparkles className={`w-3 h-3 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className="truncate">{p.label}</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1 line-clamp-1">{p.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Filter Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
        {/* Search and Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Text Search */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Search Stock, Sector, ISIN</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActivePreset(null);
                }}
                placeholder="TATAMOTORS, BEL, Defence..."
                className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Price Range Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Price Segment (₹)</label>
            <select
              value={selectedPriceRange}
              onChange={(e) => {
                setSelectedPriceRange(e.target.value);
                setActivePreset(null);
              }}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            >
              {priceRanges.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Future Theme Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Future Economy Mega-Theme</label>
            <select
              value={selectedTheme}
              onChange={(e) => {
                setSelectedTheme(e.target.value);
                setActivePreset(null);
              }}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            >
              <option value="ALL">All Themes</option>
              {FUTURE_THEMES.map((theme) => (
                <option key={theme.id} value={theme.id}>{theme.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Numerical Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-3 border-t border-slate-800">
          {/* Min AI Score */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-300">Min 10-Factor AI Score</span>
              <span className="font-mono font-bold text-cyan-400">{minScore} / 100</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="1"
              value={minScore}
              onChange={(e) => {
                setMinScore(Number(e.target.value));
                setActivePreset(null);
              }}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Min ROCE */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-300">Min ROCE (%)</span>
              <span className="font-mono font-bold text-emerald-400">{minRoce}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              step="1"
              value={minRoce}
              onChange={(e) => {
                setMinRoce(Number(e.target.value));
                setActivePreset(null);
              }}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Max Debt/Equity */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-300">Max Debt / Equity</span>
              <span className="font-mono font-bold text-indigo-400">{maxDebtEquity}x</span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={maxDebtEquity}
              onChange={(e) => {
                setMaxDebtEquity(Number(e.target.value));
                setActivePreset(null);
              }}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Action & Result Summary Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
          <div className="text-slate-400">
            Showing <strong className="text-white font-mono">{filteredStocks.length}</strong> matching Indian stocks
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center space-x-1.5 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      </div>

      {/* Results Table with Company Logos */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800 text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Company / Symbol</th>
                <th className="py-3.5 px-4 text-right">Price (₹)</th>
                <th className="py-3.5 px-4 text-right">Day Chg</th>
                <th className="py-3.5 px-4 text-right">Market Cap</th>
                <th className="py-3.5 px-4 text-right">P/E</th>
                <th className="py-3.5 px-4 text-right">ROCE</th>
                <th className="py-3.5 px-4 text-right">Debt/Eq</th>
                <th className="py-3.5 px-4 text-center">AI Score</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {filteredStocks.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 font-sans">
                    No equities matched the active quantitative thresholds. Try relaxing the filter constraints.
                  </td>
                </tr>
              ) : (
                filteredStocks.map((stock) => {
                  const isWatchlisted = watchlistIds.includes(stock.id);

                  return (
                    <tr 
                      key={stock.id}
                      className="hover:bg-slate-800/60 transition-colors cursor-pointer group"
                      onClick={() => onSelectStock(stock)}
                    >
                      <td className="py-3.5 px-4 font-sans">
                        <div className="flex items-center space-x-3">
                          <CompanyLogo 
                            symbol={stock.symbol}
                            name={stock.name}
                            size="sm"
                            customLogoUrl={stock.logoUrl}
                            brandColor={stock.brandColor}
                          />
                          <div>
                            <div className="font-bold text-white text-xs group-hover:text-cyan-300 transition-colors">
                              {stock.symbol}
                            </div>
                            <div className="text-slate-400 text-[11px] truncate max-w-[150px] sm:max-w-[200px]">
                              {stock.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-bold text-white">
                        ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      <td className={`py-3.5 px-4 text-right font-bold ${stock.percentChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {stock.percentChange >= 0 ? '+' : ''}{stock.percentChange}%
                      </td>

                      <td className="py-3.5 px-4 text-right text-slate-300">
                        ₹{(stock.marketCapCr / 1000).toFixed(1)}k Cr
                      </td>

                      <td className="py-3.5 px-4 text-right text-slate-300 font-bold">
                        {stock.peRatio}x
                      </td>

                      <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">
                        {stock.financials[0]?.roce}%
                      </td>

                      <td className="py-3.5 px-4 text-right text-slate-300">
                        {stock.financials[0]?.debtToEquity}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 font-black border border-cyan-800 font-mono shadow-sm">
                          {stock.compositeAiScore}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-sans" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center space-x-1.5">
                          {onToggleWatchlist && (
                            <button
                              onClick={() => onToggleWatchlist(stock.id)}
                              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                isWatchlisted
                                  ? 'bg-cyan-950 text-cyan-400 border-cyan-700'
                                  : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-200'
                              }`}
                            >
                              <Bookmark className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-cyan-400' : ''}`} />
                            </button>
                          )}

                          <button 
                            onClick={() => onSelectStock(stock)}
                            className="px-2.5 py-1 bg-cyan-950 group-hover:bg-cyan-600 text-cyan-300 group-hover:text-white rounded-lg border border-cyan-700 transition-colors text-xs font-semibold flex items-center space-x-1"
                          >
                            <span>Inspect</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
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
    </div>
  );
};
