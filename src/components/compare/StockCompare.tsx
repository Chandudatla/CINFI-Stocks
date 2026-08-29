import React, { useState, useMemo } from 'react';
import { 
  ArrowLeftRight, 
  Plus, 
  X, 
  Sparkles, 
  Check, 
  ChevronRight, 
  Download, 
  RotateCcw, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Flame, 
  Award,
  Search
} from 'lucide-react';
import { CompanyStock } from '../../types/stock';
import { CompanyLogo } from '../common/CompanyLogo';

interface StockCompareProps {
  stocks?: CompanyStock[];
  onSelectStock: (stock: CompanyStock) => void;
}

export const StockCompare: React.FC<StockCompareProps> = ({
  stocks = [],
  onSelectStock
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    stocks[0]?.id || 'tatamotors', 
    stocks[1]?.id || 'bel',
    stocks[2]?.id || 'kaynes'
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddPickerOpen, setIsAddPickerOpen] = useState(false);

  const selectedStocks = useMemo(() => {
    return stocks.filter(s => selectedIds.includes(s.id));
  }, [stocks, selectedIds]);

  const toggleStock = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter(item => item !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const removeStock = (id: string) => {
    if (selectedIds.length > 1) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    }
  };

  const setPreset = (ids: string[]) => {
    const validIds = ids.filter(id => stocks.some(s => s.id === id)).slice(0, 4);
    if (validIds.length >= 2) {
      setSelectedIds(validIds);
    }
  };

  // Export comparison table as CSV
  const exportCSV = () => {
    if (selectedStocks.length === 0) return;
    const headers = ['Metric', ...selectedStocks.map(s => `"${s.symbol} (${s.name})"`)]
    const rows = [
      ['Current Share Price (INR)', ...selectedStocks.map(s => s.currentPrice.toString())],
      ['1-Day Price Change (%)', ...selectedStocks.map(s => `${s.percentChange}%`)],
      ['Market Capitalization (Cr)', ...selectedStocks.map(s => `₹${s.marketCapCr}`)],
      ['10-Factor AI Composite Score', ...selectedStocks.map(s => `${s.compositeAiScore}/100`)],
      ['Price to Earnings (P/E)', ...selectedStocks.map(s => `${s.peRatio}x`)],
      ['Return on Capital (ROCE %)', ...selectedStocks.map(s => `${s.financials[0]?.roce || 0}%`)],
      ['Debt to Equity Ratio', ...selectedStocks.map(s => (s.financials[0]?.debtToEquity || 0).toString())],
      ['Operating Cash Flow (Cr)', ...selectedStocks.map(s => `₹${s.financials[0]?.operatingCashFlow || 0}`)],
      ['Future Theme Exposure', ...selectedStocks.map(s => `${s.futureThemes[0]?.themeName || 'N/A'} (${s.futureThemes[0]?.exposureScore || 0}%)`)]
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CINFI_Stock_Comparison_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper winner calculations for metric rows
  const maxScore = Math.max(...selectedStocks.map(s => s.compositeAiScore));
  const maxRoce = Math.max(...selectedStocks.map(s => s.financials[0]?.roce || 0));
  const minDebt = Math.min(...selectedStocks.map(s => s.financials[0]?.debtToEquity || 0));
  const maxMcap = Math.max(...selectedStocks.map(s => s.marketCapCr));
  const max1d = Math.max(...selectedStocks.map(s => s.percentChange));

  return (
    <div id="stock-compare-view" className="w-full max-w-full space-y-6 pb-16 min-w-0 overflow-x-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <ArrowLeftRight className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 shrink-0" />
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight break-words">
              Multi-Factor Equities Head-to-Head Matrix
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
            Side-by-side comparative analysis of valuation multiples, balance sheet resilience, capital efficiency, and thematic alignment.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0 self-start sm:self-auto">
          <button
            onClick={exportCSV}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
            {selectedStocks.length} / 4 Equities
          </span>
        </div>
      </div>

      {/* Preset Strategy Buttons */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold mr-1">One-Click Presets:</span>
        <button
          onClick={() => setPreset(['tatamotors', 'bel', 'kaynes'])}
          className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors cursor-pointer font-medium"
        >
          Auto EV vs Defense vs OSAT
        </button>
        <button
          onClick={() => setPreset(['bel', 'mazdock', 'kaynes'])}
          className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors cursor-pointer font-medium"
        >
          Make-in-India Aerospace & Defense
        </button>
        <button
          onClick={() => setPreset(['premierene', 'ireda', 'tatamotors'])}
          className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors cursor-pointer font-medium"
        >
          Green Energy & Solar Transition
        </button>
        <button
          onClick={() => setPreset(['cdsl', 'tcs', 'kpittech'])}
          className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors cursor-pointer font-medium"
        >
          Digital Infrastructure & IT
        </button>
      </div>

      {/* Stock Selection Pills */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Active Comparison Basket (Select 2 to 4 Stocks)
          </span>
          <span className="text-[11px] text-slate-400">Click any badge to toggle</span>
        </div>

        <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
          {stocks.map((stock) => {
            const isSelected = selectedIds.includes(stock.id);
            return (
              <button
                key={stock.id}
                onClick={() => toggleStock(stock.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-950 border border-cyan-400/40'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <CompanyLogo 
                  symbol={stock.symbol} 
                  name={stock.name} 
                  size="xs"
                  customLogoUrl={stock.logoUrl}
                  brandColor={stock.brandColor}
                />
                <span>{stock.symbol}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Comparison Matrix Grid */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950">
                <th className="py-4 px-5 text-slate-400 font-mono w-56 uppercase tracking-wider text-[11px]">
                  Metric / Factor
                </th>
                {selectedStocks.map((stock) => (
                  <th key={stock.id} className="py-4 px-5 text-center min-w-[180px]">
                    <div className="relative flex flex-col items-center space-y-2">
                      {selectedStocks.length > 2 && (
                        <button
                          onClick={() => removeStock(stock.id)}
                          title="Remove from comparison"
                          className="absolute -top-1 right-0 p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <CompanyLogo 
                        symbol={stock.symbol}
                        name={stock.name}
                        size="md"
                        customLogoUrl={stock.logoUrl}
                        brandColor={stock.brandColor}
                      />
                      <div>
                        <div className="font-bold text-white text-sm">{stock.symbol}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{stock.name}</div>
                        <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{stock.sector}</div>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              
              {/* Share Price */}
              <tr>
                <td className="py-3.5 px-5 font-sans font-semibold text-slate-300">
                  Current Share Price
                </td>
                {selectedStocks.map((stock) => (
                  <td key={stock.id} className="py-3.5 px-5 text-center font-bold text-white text-sm">
                    ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                ))}
              </tr>

              {/* 1D Change */}
              <tr>
                <td className="py-3.5 px-5 font-sans font-semibold text-slate-300">
                  1-Day Price Change (%)
                </td>
                {selectedStocks.map((stock) => {
                  const isTopGainer = stock.percentChange === max1d && max1d > 0;
                  return (
                    <td key={stock.id} className={`py-3.5 px-5 text-center font-bold ${stock.percentChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      <div className="flex items-center justify-center space-x-1">
                        <span>{stock.percentChange >= 0 ? '+' : ''}{stock.percentChange}%</span>
                        {isTopGainer && <span className="text-[9px] px-1 rounded bg-emerald-950 border border-emerald-700 text-emerald-300">LEADER</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Market Cap */}
              <tr>
                <td className="py-3.5 px-5 font-sans font-semibold text-slate-300">
                  Market Capitalization
                </td>
                {selectedStocks.map((stock) => {
                  const isLargest = stock.marketCapCr === maxMcap;
                  return (
                    <td key={stock.id} className="py-3.5 px-5 text-center text-slate-200 font-semibold">
                      <div>₹{(stock.marketCapCr / 1000).toFixed(1)}k Cr</div>
                      {isLargest && <span className="text-[9px] font-mono text-cyan-400">Largest Cap</span>}
                    </td>
                  );
                })}
              </tr>

              {/* 10-Factor AI Composite Score */}
              <tr className="bg-cyan-950/30">
                <td className="py-3.5 px-5 font-sans font-black text-cyan-300 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>10-Factor AI Composite</span>
                </td>
                {selectedStocks.map((stock) => {
                  const isWinner = stock.compositeAiScore === maxScore;
                  return (
                    <td key={stock.id} className="py-3.5 px-5 text-center">
                      <div className="flex flex-col items-center justify-center space-y-0.5">
                        <span className={`px-3 py-1 rounded-xl font-black font-mono shadow-sm ${
                          isWinner 
                            ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-300' 
                            : 'bg-cyan-950 border border-cyan-700 text-cyan-300'
                        }`}>
                          {stock.compositeAiScore} / 100
                        </span>
                        {isWinner && (
                          <span className="text-[9px] text-cyan-300 font-bold uppercase tracking-wider flex items-center space-x-0.5">
                            <Award className="w-2.5 h-2.5" />
                            <span>Highest Conviction</span>
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Valuation: P/E Ratio */}
              <tr>
                <td className="py-3.5 px-5 font-sans font-semibold text-slate-300">
                  Price to Earnings (P/E)
                </td>
                {selectedStocks.map((stock) => (
                  <td key={stock.id} className="py-3.5 px-5 text-center font-bold text-slate-100">
                    {stock.peRatio}x
                  </td>
                ))}
              </tr>

              {/* Capital Efficiency: ROCE */}
              <tr>
                <td className="py-3.5 px-5 font-sans font-semibold text-slate-300">
                  Return on Capital (ROCE)
                </td>
                {selectedStocks.map((stock) => {
                  const roceVal = stock.financials[0]?.roce || 0;
                  const isBestRoce = roceVal === maxRoce;
                  return (
                    <td key={stock.id} className="py-3.5 px-5 text-center text-emerald-400 font-bold">
                      <div>{roceVal}%</div>
                      {isBestRoce && <span className="text-[9px] text-emerald-300 font-mono">Best Efficiency</span>}
                    </td>
                  );
                })}
              </tr>

              {/* Balance Sheet: Debt to Equity */}
              <tr>
                <td className="py-3.5 px-5 font-sans font-semibold text-slate-300">
                  Debt to Equity Ratio
                </td>
                {selectedStocks.map((stock) => {
                  const deVal = stock.financials[0]?.debtToEquity || 0;
                  const isCleanest = deVal === minDebt;
                  return (
                    <td key={stock.id} className="py-3.5 px-5 text-center text-slate-200">
                      <div className="font-semibold">{deVal}</div>
                      {isCleanest && <span className="text-[9px] text-teal-400 font-mono">Cleanest Book</span>}
                    </td>
                  );
                })}
              </tr>

              {/* Free Cash Flow / OCF */}
              <tr>
                <td className="py-3.5 px-5 font-sans font-semibold text-slate-300">
                  Operating Cash Flow (Annual)
                </td>
                {selectedStocks.map((stock) => (
                  <td key={stock.id} className="py-3.5 px-5 text-center text-slate-200">
                    ₹{stock.financials[0]?.operatingCashFlow?.toLocaleString('en-IN') || 'N/A'} Cr
                  </td>
                ))}
              </tr>

              {/* Primary Future Theme */}
              <tr>
                <td className="py-3.5 px-5 font-sans font-semibold text-slate-300">
                  Primary Future Theme & Exposure
                </td>
                {selectedStocks.map((stock) => (
                  <td key={stock.id} className="py-3.5 px-5 text-center font-sans text-xs text-cyan-400 font-semibold">
                    <div>{stock.futureThemes[0]?.themeName.split('&')[0]}</div>
                    <span className="text-[10px] font-mono text-slate-400">
                      ({stock.futureThemes[0]?.exposureScore}% Exposure)
                    </span>
                  </td>
                ))}
              </tr>

              {/* Technical RSI (14) */}
              <tr>
                <td className="py-3.5 px-5 font-sans font-semibold text-slate-300">
                  14-Day RSI Indicator
                </td>
                {selectedStocks.map((stock) => (
                  <td key={stock.id} className="py-3.5 px-5 text-center font-bold text-slate-200">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${
                      stock.technicals.rsi14 > 70 
                        ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                        : stock.technicals.rsi14 < 35 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-950 text-slate-300 border border-slate-800'
                    }`}>
                      {stock.technicals.rsi14}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Action Button: Open Terminal */}
              <tr>
                <td className="py-4 px-5 font-sans font-semibold text-slate-300">
                  Terminal Drilldown
                </td>
                {selectedStocks.map((stock) => (
                  <td key={stock.id} className="py-4 px-5 text-center font-sans">
                    <button
                      onClick={() => onSelectStock(stock)}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-cyan-950 flex items-center justify-center space-x-1 mx-auto cursor-pointer"
                    >
                      <span>Open Terminal</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
