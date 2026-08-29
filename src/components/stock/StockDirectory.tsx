import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Bookmark, 
  Grid, 
  List, 
  ExternalLink,
  CheckCircle2,
  Calendar,
  X,
  Plus
} from 'lucide-react';
import { CompanyStock } from '../../types/stock';
import { CompanyLogo } from '../common/CompanyLogo';

interface StockDirectoryProps {
  stocks?: CompanyStock[];
  watchlistIds?: string[];
  onToggleWatchlist: (stockId: string) => void;
  onSelectStock: (stock: CompanyStock) => void;
  onNavigateToCompare?: () => void;
}

export type StockPriceRange = 'ALL' | '0-100' | '101-500' | '501-1000' | '1001-3000' | '3001-above';

export const StockDirectory: React.FC<StockDirectoryProps> = ({
  stocks = [],
  watchlistIds = [],
  onToggleWatchlist,
  onSelectStock,
  onNavigateToCompare
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedPriceRange, setSelectedPriceRange] = useState<StockPriceRange>('ALL');
  const [selectedCapCategory, setSelectedCapCategory] = useState<'ALL' | 'LARGE' | 'MID' | 'SMALL'>('ALL');
  const [sortBy, setSortBy] = useState<'score' | 'mcap' | 'change' | 'pe' | 'roce' | 'price'>('score');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const sectors = useMemo(() => {
    return ['ALL', ...Array.from(new Set(stocks.map(s => s.sector)))];
  }, [stocks]);

  const priceRanges = [
    { id: 'ALL' as StockPriceRange, label: 'All Ranges (-)' },
    { id: '0-100' as StockPriceRange, label: '₹0 – ₹100' },
    { id: '101-500' as StockPriceRange, label: '₹101 – ₹500' },
    { id: '501-1000' as StockPriceRange, label: '₹501 – ₹1,000' },
    { id: '1001-3000' as StockPriceRange, label: '₹1,001 – ₹3,000' },
    { id: '3001-above' as StockPriceRange, label: '₹3,001 & Above' }
  ];

  const filteredStocks = useMemo(() => {
    return stocks
      .filter(stock => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match = 
            stock.symbol.toLowerCase().includes(q) ||
            stock.name.toLowerCase().includes(q) ||
            stock.sector.toLowerCase().includes(q) ||
            stock.isin.toLowerCase().includes(q) ||
            (stock.futureThemes || []).some(t => ((t.themeName || (t as any).name || '').toLowerCase().includes(q)));
          if (!match) return false;
        }

        // Sector
        if (selectedSector !== 'ALL' && stock.sector !== selectedSector) return false;

        // Price range
        if (selectedPriceRange === '0-100' && (stock.currentPrice < 0 || stock.currentPrice > 100)) return false;
        if (selectedPriceRange === '101-500' && (stock.currentPrice <= 100 || stock.currentPrice > 500)) return false;
        if (selectedPriceRange === '501-1000' && (stock.currentPrice <= 500 || stock.currentPrice > 1000)) return false;
        if (selectedPriceRange === '1001-3000' && (stock.currentPrice <= 1000 || stock.currentPrice > 3000)) return false;
        if (selectedPriceRange === '3001-above' && stock.currentPrice <= 3000) return false;

        // Market cap category
        if (selectedCapCategory === 'LARGE' && stock.marketCapCr < 50000) return false;
        if (selectedCapCategory === 'MID' && (stock.marketCapCr < 15000 || stock.marketCapCr >= 50000)) return false;
        if (selectedCapCategory === 'SMALL' && stock.marketCapCr >= 15000) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return b.compositeAiScore - a.compositeAiScore;
        if (sortBy === 'mcap') return b.marketCapCr - a.marketCapCr;
        if (sortBy === 'change') return b.percentChange - a.percentChange;
        if (sortBy === 'price') return b.currentPrice - a.currentPrice;
        if (sortBy === 'pe') return a.peRatio - b.peRatio;
        if (sortBy === 'roce') return (b.financials[0]?.roce || 0) - (a.financials[0]?.roce || 0);
        return 0;
      });
  }, [stocks, searchQuery, selectedSector, selectedPriceRange, selectedCapCategory, sortBy]);

  return (
    <div id="stock-directory-view" className="w-full max-w-full space-y-6 pb-16 min-w-0 overflow-x-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 shrink-0" />
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight break-words">
              Indian Equities Intelligence Directory
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
            Multi-factor quantitative profiles, statutory audit trails, and 24/7 dynamic order-flow tracking across all price ranges.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-950 text-cyan-300 border border-slate-800 font-bold">
            {filteredStocks.length} of {stocks.length} Companies Loaded
          </span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Symbol, Company Name, ISIN, Sector, or Theme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort & View mode toggles */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center space-x-1.5 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-cyan-300 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="score" className="bg-slate-900 text-white">AI Score (High to Low)</option>
                <option value="mcap" className="bg-slate-900 text-white">Market Cap (High to Low)</option>
                <option value="price" className="bg-slate-900 text-white">Price (High to Low)</option>
                <option value="change" className="bg-slate-900 text-white">1D Price Delta</option>
                <option value="roce" className="bg-slate-900 text-white">ROCE % (Highest)</option>
                <option value="pe" className="bg-slate-900 text-white">P/E Ratio (Lowest)</option>
              </select>
            </div>

            {/* Grid vs Table View */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Dense Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 🏷️ Price Range Filter Pills (Exact brackets requested) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Price Range:</span>
          {priceRanges.map(pr => (
            <button
              key={pr.id}
              onClick={() => setSelectedPriceRange(pr.id)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer border ${
                selectedPriceRange === pr.id
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
            >
              {pr.label}
            </button>
          ))}
        </div>

        {/* Sector Filter Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">Sector:</span>
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

      {/* Directory Content: Grid vs Table View */}
      {filteredStocks.length === 0 ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-300">No companies found matching your active search query or price range filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSector('ALL');
              setSelectedPriceRange('ALL');
              setSelectedCapCategory('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-semibold hover:bg-cyan-500 transition-all cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStocks.map((stock) => {
            const isWatchlisted = watchlistIds.includes(stock.id);

            return (
              <div
                key={stock.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 rounded-3xl p-5 space-y-4 shadow-xl transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Logo, Name, Price, Watchlist bookmark */}
                  <div className="flex items-start justify-between gap-3">
                    <div 
                      onClick={() => onSelectStock(stock)}
                      className="flex items-center space-x-3 cursor-pointer min-w-0"
                    >
                      <CompanyLogo
                        symbol={stock.symbol}
                        name={stock.name}
                        size="md"
                        customLogoUrl={stock.logoUrl}
                        brandColor={stock.brandColor}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-black text-white text-base group-hover:text-cyan-300 transition-colors">
                            {stock.symbol}
                          </span>
                          <span className="text-xs text-slate-400 font-medium truncate">
                            ({stock.name})
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-[11px] text-cyan-400 mt-0.5 font-medium">
                          <span>{stock.sector}</span>
                          <span>•</span>
                          <span className="text-slate-400">ISIN: {stock.isin}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <div className="text-right">
                        <div className="font-mono font-black text-white text-base">
                          ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                        <div className={`text-xs font-bold flex items-center justify-end space-x-0.5 ${stock.percentChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {stock.percentChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span>{stock.percentChange >= 0 ? '+' : ''}{stock.percentChange}%</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(stock.id);
                        }}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          isWatchlisted 
                            ? 'bg-cyan-950 text-cyan-400 border-cyan-800' 
                            : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                        }`}
                        title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-cyan-400' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mt-2">
                    {stock.description}
                  </p>

                  {/* 10-Factor Score & Key Financials Grid */}
                  <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-800/80 text-center font-mono mt-3">
                    <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">AI Score</div>
                      <div className="text-sm font-black text-cyan-400">{stock.compositeAiScore}</div>
                    </div>
                    <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">P/E</div>
                      <div className="text-sm font-bold text-slate-200">{stock.peRatio}x</div>
                    </div>
                    <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">ROCE</div>
                      <div className="text-sm font-bold text-emerald-400">{stock.financials[0]?.roce || 18}%</div>
                    </div>
                    <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">D/E</div>
                      <div className="text-sm font-bold text-slate-200">{stock.financials[0]?.debtToEquity ?? 0.5}</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-400">
                    MCap: <strong className="text-slate-200 font-mono">₹{(stock.marketCapCr / 1000).toFixed(1)}k Cr</strong>
                  </span>

                  <button
                    onClick={() => onSelectStock(stock)}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-950 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-800/80 text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <span>View Terminal</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Dense Table View */
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-3">Price</th>
                  <th className="py-3.5 px-3">1D %</th>
                  <th className="py-3.5 px-3">AI Score</th>
                  <th className="py-3.5 px-3">P/E</th>
                  <th className="py-3.5 px-3">ROCE %</th>
                  <th className="py-3.5 px-3">Market Cap</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredStocks.map((stock) => (
                  <tr 
                    key={stock.id}
                    onClick={() => onSelectStock(stock)}
                    className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 flex items-center space-x-2.5 font-sans">
                      <CompanyLogo symbol={stock.symbol} name={stock.name} size="sm" brandColor={stock.brandColor} />
                      <div>
                        <div className="font-bold text-white">{stock.symbol}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{stock.name}</div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-bold text-white">
                      ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`py-3 px-3 font-bold ${stock.percentChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stock.percentChange >= 0 ? '+' : ''}{stock.percentChange}%
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                        {stock.compositeAiScore}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{stock.peRatio}x</td>
                    <td className="py-3 px-3 text-emerald-400">{stock.financials[0]?.roce || 18}%</td>
                    <td className="py-3 px-3 text-slate-300">₹{(stock.marketCapCr / 1000).toFixed(1)}k Cr</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStock(stock);
                        }}
                        className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-600 text-cyan-300 hover:text-white rounded-lg text-[11px] font-sans font-bold border border-cyan-800 transition-all"
                      >
                        Terminal
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
