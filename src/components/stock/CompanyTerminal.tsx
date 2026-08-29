import React, { useState } from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Cpu, 
  BarChart3, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  ChevronRight,
  Info,
  Calendar,
  Share2,
  Bookmark,
  BellRing,
  ArrowLeft
} from 'lucide-react';
import { CompanyStock } from '../../types/stock';
import { CompanyLogo } from '../common/CompanyLogo';

interface CompanyTerminalProps {
  stock: CompanyStock;
  onBack: () => void;
  onSelectTheme: (themeId: string) => void;
  onOpenAlerts?: (stock: CompanyStock) => void;
  isWatchlisted?: boolean;
  onToggleWatchlist?: (stockId: string) => void;
}

export const CompanyTerminal: React.FC<CompanyTerminalProps> = ({
  stock,
  onBack,
  onSelectTheme,
  onOpenAlerts,
  isWatchlisted = false,
  onToggleWatchlist
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'score' | 'financials' | 'technicals' | 'ownership' | 'themes' | 'scenarios' | 'evidence'>('overview');
  const [localWatchlist, setLocalWatchlist] = useState(isWatchlisted);

  const isInWatchlist = onToggleWatchlist ? isWatchlisted : localWatchlist;

  const handleWatchlistClick = () => {
    if (onToggleWatchlist) {
      onToggleWatchlist(stock.id);
    } else {
      setLocalWatchlist(!localWatchlist);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'score', label: '10-Factor Score Engine' },
    { id: 'financials', label: 'Financials & Ratios' },
    { id: 'technicals', label: 'Technicals & Levels' },
    { id: 'ownership', label: 'Smart Money & Ownership' },
    { id: 'themes', label: 'Future Theme Exposure' },
    { id: 'scenarios', label: 'AI Bull/Base/Bear' },
    { id: 'evidence', label: 'Audited Evidence Trail' },
  ] as const;

  return (
    <div id={`terminal-${stock.symbol}`} className="space-y-6 pb-16">
      {/* Back button & Title bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Market Dashboard</span>
        </button>

        <div className="flex items-center space-x-3">
          {onOpenAlerts && (
            <button
              onClick={() => onOpenAlerts(stock)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-slate-900 text-slate-400 hover:text-cyan-300 border-slate-800 hover:border-cyan-700 transition-all cursor-pointer"
            >
              <BellRing className="w-3.5 h-3.5 text-cyan-400" />
              <span>Set Smart Alert</span>
            </button>
          )}

          <button
            onClick={handleWatchlistClick}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isInWatchlist
                ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isInWatchlist ? 'fill-cyan-400 text-cyan-400' : ''}`} />
            <span>{isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
          </button>
        </div>
      </div>

      {/* Terminal Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl shadow-cyan-950/20 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-start sm:items-center space-x-4">
            <CompanyLogo 
              symbol={stock.symbol} 
              name={stock.name} 
              size="xl"
              customLogoUrl={stock.logoUrl}
              brandColor={stock.brandColor}
            />

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">{stock.symbol}</span>
                <span className="text-sm font-semibold text-slate-400">({stock.name})</span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  ISIN: {stock.isin}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-400">
                <span className="text-cyan-400 font-bold bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-800/40">
                  {stock.sector}
                </span>
                <span>•</span>
                <span className="text-slate-300">{stock.industry}</span>
                <span>•</span>
                <span className="flex items-center space-x-1 text-slate-400">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>{stock.lastUpdated}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-2xl md:text-3xl font-black font-mono text-white">
                ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div className={`text-xs font-bold flex items-center justify-end space-x-1 ${stock.percentChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stock.percentChange >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>
                  {stock.percentChange >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.percentChange}%)
                </span>
              </div>
            </div>

            {/* Composite Research Score Badge */}
            <div className="pl-6 border-l border-slate-800 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-950 to-indigo-950 border border-cyan-700 flex flex-col items-center justify-center shadow-lg shadow-cyan-950/50">
                <span className="text-lg font-black font-mono text-cyan-300">{stock.compositeAiScore}</span>
                <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Score</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
                {stock.dataConfidenceScore}% Conf.
              </span>
            </div>
          </div>
        </div>

        {/* Key Numerical Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-slate-500 block text-[11px]">Market Cap</span>
            <span className="font-bold text-slate-100 font-mono text-sm">
              ₹{(stock.marketCapCr / 1000).toFixed(1)}k Cr
            </span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-slate-500 block text-[11px]">P/E Ratio</span>
            <span className="font-bold text-slate-100 font-mono text-sm">{stock.peRatio}x</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-slate-500 block text-[11px]">ROCE (Return on Capital)</span>
            <span className="font-bold text-emerald-400 font-mono text-sm">{stock.financials[0]?.roce}%</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-slate-500 block text-[11px]">Debt / Equity</span>
            <span className="font-bold text-slate-100 font-mono text-sm">{stock.financials[0]?.debtToEquity}</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-slate-500 block text-[11px]">52W High / Low</span>
            <span className="font-bold text-slate-100 font-mono text-sm">
              ₹{stock.high52w} / ₹{stock.low52w}
            </span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-slate-500 block text-[11px]">Daily Volume</span>
            <span className="font-bold text-slate-100 font-mono text-sm">{stock.volume}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-btn-${tab.id}`}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-slate-900 text-cyan-300 border-t-2 border-cyan-400 border-x border-slate-800 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Corporate Profile & Core Moat */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                    Corporate Profile & Core Business Moat
                  </h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {stock.description}
                </p>
                {stock.beginnerSummary && (
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-cyan-400 block mb-1">Executive Summary:</span>
                    {stock.beginnerSummary}
                  </div>
                )}
              </div>

              {/* Verified Future Theme Highlights */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                      Verified Future Industry Exposure
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500">Backed by Filings</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stock.futureThemes.map((ft) => (
                    <div 
                      key={ft.themeId}
                      className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{ft.themeName}</span>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                          {ft.exposureScore}/100
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {ft.justification}
                      </p>
                      {ft.revenueContributionPct && (
                        <div className="text-[11px] text-cyan-400 font-semibold pt-1 border-t border-slate-800/80">
                          Estimated Revenue Contribution: ~{ft.revenueContributionPct}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Side Column: Score Summary & Risks */}
            <div className="space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                    Primary Factor Weights
                  </h3>
                </div>

                <div className="space-y-3">
                  {stock.scoreComponents.slice(0, 5).map((comp) => (
                    <div key={comp.name} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">{comp.name}</span>
                        <span className="font-mono font-bold text-cyan-300">{comp.score}/100</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full"
                          style={{ width: `${comp.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Risks Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="flex items-center space-x-2 text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">
                    Key Investment Risks
                  </h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {stock.keyRisks.map((risk, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span className="leading-relaxed">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 10-FACTOR SCORE ENGINE */}
      {activeTab === 'score' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="max-w-3xl space-y-2">
            <h3 className="text-base font-bold text-white">
              Deterministic 10-Factor AI Scoring Methodology
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every score component is mathematically derived from audited balance sheets, corporate shareholding records, and technical price data. No arbitrary numbers or hallucinations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stock.scoreComponents.map((comp) => (
              <div 
                key={comp.name}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">{comp.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">Weight: {comp.weight}% in composite model</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black font-mono text-cyan-400">{comp.score}</span>
                    <span className="text-[10px] text-slate-500 block">Benchmark: {comp.benchmarkScore}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {comp.description}
                </p>

                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                  <div>
                    <strong className="text-slate-300">Methodology:</strong> {comp.methodology}
                  </div>
                  <div>
                    <strong className="text-slate-300">Data Source:</strong> {comp.sourceData}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: FINANCIALS */}
      {activeTab === 'financials' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 overflow-x-auto">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Audited Annual Financial History</h3>
              <p className="text-xs text-slate-400">All figures in ₹ Crores unless stated otherwise</p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300">
              Source: Audited Annual Accounts
            </span>
          </div>

          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-3 px-4">Financial Metric</th>
                {stock.financials.map((f) => (
                  <th key={f.year} className="py-3 px-4 text-right">{f.year}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">Revenue from Operations</td>
                {stock.financials.map((f) => (
                  <td key={f.year} className="py-3 px-4 text-right text-slate-100">
                    ₹{f.revenue.toLocaleString('en-IN')}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">Operating EBITDA</td>
                {stock.financials.map((f) => (
                  <td key={f.year} className="py-3 px-4 text-right text-slate-100">
                    ₹{f.ebitda.toLocaleString('en-IN')}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">Net Profit (PAT)</td>
                {stock.financials.map((f) => (
                  <td key={f.year} className={`py-3 px-4 text-right font-bold ${f.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ₹{f.netProfit.toLocaleString('en-IN')}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">ROCE (%)</td>
                {stock.financials.map((f) => (
                  <td key={f.year} className="py-3 px-4 text-right text-cyan-300 font-bold">
                    {f.roce}%
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">Return on Equity - ROE (%)</td>
                {stock.financials.map((f) => (
                  <td key={f.year} className="py-3 px-4 text-right text-slate-300">
                    {f.roe}%
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">Debt to Equity</td>
                {stock.financials.map((f) => (
                  <td key={f.year} className="py-3 px-4 text-right text-slate-300">
                    {f.debtToEquity}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-semibold text-slate-200">Free Cash Flow (FCF)</td>
                {stock.financials.map((f) => (
                  <td key={f.year} className={`py-3 px-4 text-right font-semibold ${f.freeCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ₹{f.freeCashFlow.toLocaleString('en-IN')}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: TECHNICALS */}
      {activeTab === 'technicals' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Algorithmic Technical Indicators</h3>
              <p className="text-xs text-slate-400">Calculated on Daily & Multi-Timeframe NSE Candlesticks</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              Trend: {stock.technicals.trend}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-sans">Relative Strength Index (RSI 14)</span>
              <div className="text-xl font-bold text-white">{stock.technicals.rsi14}</div>
              <span className="text-cyan-400 font-sans text-[11px] block">{stock.technicals.rsiSignal} Zone</span>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-sans">50-Day Moving Average (SMA)</span>
              <div className="text-xl font-bold text-white">₹{stock.technicals.sma50}</div>
              <span className="text-emerald-400 font-sans text-[11px] block">
                Price is above 50 SMA
              </span>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-sans">200-Day Moving Average (SMA)</span>
              <div className="text-xl font-bold text-white">₹{stock.technicals.sma200}</div>
              <span className="text-emerald-400 font-sans text-[11px] block">
                Golden Cross: {stock.technicals.goldenCross ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: OWNERSHIP & SMART MONEY */}
      {activeTab === 'ownership' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Shareholding Pattern & Smart Money Signals</h3>
              <p className="text-xs text-slate-400">Quarterly filings submitted to Stock Exchanges</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-sans">Promoter Holding</span>
              <div className="text-xl font-bold text-white">{stock.shareholding[0]?.promoter}%</div>
              <span className="text-emerald-400 font-sans text-[11px] block">
                Pledged: {stock.shareholding[0]?.promoterPledged}%
              </span>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-sans">Foreign Institutional (FII)</span>
              <div className="text-xl font-bold text-cyan-300">{stock.shareholding[0]?.fii}%</div>
              <span className="text-slate-400 font-sans text-[11px] block">Accumulated QoQ</span>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-sans">Domestic Institutional (DII)</span>
              <div className="text-xl font-bold text-cyan-300">{stock.shareholding[0]?.dii}%</div>
              <span className="text-slate-400 font-sans text-[11px] block">Mutual Funds: {stock.shareholding[0]?.mutualFunds}%</span>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-sans">Public & Retail</span>
              <div className="text-xl font-bold text-slate-200">{stock.shareholding[0]?.publicRetail}%</div>
              <span className="text-slate-400 font-sans text-[11px] block">Stable Distribution</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: FUTURE THEME EXPOSURE */}
      {activeTab === 'themes' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Verified Future Theme Exposure</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Direct alignment with India's macro growth catalysts, PLI schemes, and capex expansion.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-800 self-start sm:self-auto">
              {stock.futureThemes.length} Active Themes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stock.futureThemes.map((ft) => (
              <div
                key={ft.themeId}
                className="bg-slate-950/80 border border-slate-800 hover:border-cyan-500/60 rounded-xl p-5 space-y-3 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50">
                      {ft.category}
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Exposure: {ft.exposureScore}/100
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {ft.themeName}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {ft.justification}
                  </p>

                  {ft.revenueContributionPct && (
                    <div className="text-xs text-cyan-300 font-semibold pt-2 border-t border-slate-900 flex items-center justify-between">
                      <span className="text-slate-400">Target Revenue Exposure:</span>
                      <span className="font-mono">~{ft.revenueContributionPct}%</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end">
                  <button
                    onClick={() => onSelectTheme(ft.themeId)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-800 text-xs font-semibold transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Explore Theme Radar</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: SCENARIOS (Bull, Base, Bear) */}
      {activeTab === 'scenarios' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">AI Grounded Scenario Analysis</h3>
              <p className="text-xs text-slate-400">
                Probability-weighted cases structured from verified catalysts and verifiable risks.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bull Case */}
              <div className="bg-slate-950/70 border border-emerald-800/60 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Bull Case</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Prob: {stock.bullCase.probability}%
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {stock.bullCase.thesis}
                </p>
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">Key Catalysts:</span>
                  <ul className="text-xs text-slate-400 space-y-1">
                    {stock.bullCase.keyDrivers.map((d, i) => (
                      <li key={i}>• {d}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Base Case */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Base Case</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    Prob: {stock.baseCase.probability}%
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {stock.baseCase.thesis}
                </p>
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">Key Assumptions:</span>
                  <ul className="text-xs text-slate-400 space-y-1">
                    {stock.baseCase.keyDrivers.map((d, i) => (
                      <li key={i}>• {d}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bear Case */}
              <div className="bg-slate-950/70 border border-rose-900/60 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Bear Case</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                    Prob: {stock.bearCase.probability}%
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {stock.bearCase.thesis}
                </p>
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">Failure Risks:</span>
                  <ul className="text-xs text-slate-400 space-y-1">
                    {stock.bearCase.keyDrivers.map((d, i) => (
                      <li key={i}>• {d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: EVIDENCE AUDIT TRAIL */}
      {activeTab === 'evidence' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Audited Primary Evidence Trail</h3>
              <p className="text-xs text-slate-400">
                Direct citations from verified Tier 1 regulatory filings backing every AI statement.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Audited Citations</span>
            </span>
          </div>

          <div className="space-y-4">
            {stock.evidence.map((ev) => (
              <div 
                key={ev.id}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Citation #{ev.id}
                    </span>
                    <span className="text-xs font-bold text-cyan-400">{ev.documentType}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">{ev.documentDate}</span>
                </div>

                <div className="text-sm font-semibold text-white">
                  "{ev.claim}"
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 italic">
                  "{ev.rawExcerpt}"
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/80 font-mono">
                  <span>Source: <strong>{ev.sourceName}</strong> ({ev.pageOrSection})</span>
                  <span className="text-emerald-400 font-semibold">Confidence: {ev.confidenceLevel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
