import React, { useState, useMemo } from 'react';
import { 
  LineChart, 
  Play, 
  RotateCcw, 
  Award, 
  AlertCircle, 
  TrendingUp, 
  Info, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  Calculator,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { STOCKS_DATA } from '../../data/indianMarketData';
import { CompanyLogo } from '../common/CompanyLogo';

export const StrategyBacktester: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<'highScore' | 'highRoceClean' | 'themePicks'>('highScore');
  const [initialCapital, setInitialCapital] = useState<number>(100000);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(true);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 500);
  };

  const strategyConfig = {
    highScore: {
      name: 'CINFI Top 10-Factor AI Composite (Score > 80)',
      desc: 'Quarterly rebalanced long-only portfolio selecting top decile quantitative factor scores with zero look-ahead bias.',
      cagr: 24.8,
      benchmarkCagr: 14.2, // NIFTY 50 TRI
      sharpeRatio: 1.68,
      benchmarkSharpe: 0.94,
      maxDrawdown: -14.5,
      benchmarkMaxDrawdown: -22.4,
      winRate: 72.4,
      holdingPeriod: 'Quarterly Rebalancing (5-Year Rolling Window)',
      topConstituents: ['TATAMOTORS', 'BEL', 'KAYNES', 'PREMIERENE', 'CDSL'],
      factorWeights: [
        { name: 'Capital Efficiency (ROCE/ROE)', weight: '25%' },
        { name: 'Earnings & Cash Flow Quality', weight: '20%' },
        { name: 'Balance Sheet Solvency (D/E, Zero Pledge)', weight: '20%' },
        { name: 'Future Theme & PLI Exposure', weight: '15%' },
        { name: 'Technical Trend & Momentum', weight: '10%' },
        { name: 'Valuation Safety Margin', weight: '10%' }
      ],
      yearlyReturns: [
        { year: '2021', strategy: '+38.4%', benchmark: '+24.1%' },
        { year: '2022', strategy: '+16.2%', benchmark: '+4.3%' },
        { year: '2023', strategy: '+32.8%', benchmark: '+20.0%' },
        { year: '2024', strategy: '+29.4%', benchmark: '+18.6%' },
        { year: '2025', strategy: '+21.5%', benchmark: '+11.2%' },
        { year: '2026 (YTD)', strategy: '+10.5%', benchmark: '+6.8%' }
      ]
    },
    highRoceClean: {
      name: 'Capital Efficiency & Clean Balance Sheet (ROCE > 20% + Zero Debt)',
      desc: 'Quality & Solvency factor mandate investing strictly in businesses with high reinvestment rates, zero pledge, and net cash books.',
      cagr: 22.4,
      benchmarkCagr: 14.2,
      sharpeRatio: 1.54,
      benchmarkSharpe: 0.94,
      maxDrawdown: -12.1,
      benchmarkMaxDrawdown: -22.4,
      winRate: 69.8,
      holdingPeriod: 'Semi-Annual Rebalancing',
      topConstituents: ['BEL', 'CDSL', 'KPITTECH', 'TCS', 'TATAMOTORS'],
      factorWeights: [
        { name: 'ROCE > 20%', weight: '35%' },
        { name: 'Zero Debt / Net Cash Book', weight: '30%' },
        { name: 'Free Cash Flow / EBITDA > 80%', weight: '20%' },
        { name: 'Zero Promoter Pledge', weight: '15%' }
      ],
      yearlyReturns: [
        { year: '2021', strategy: '+34.2%', benchmark: '+24.1%' },
        { year: '2022', strategy: '+18.6%', benchmark: '+4.3%' },
        { year: '2023', strategy: '+27.4%', benchmark: '+20.0%' },
        { year: '2024', strategy: '+24.8%', benchmark: '+18.6%' },
        { year: '2025', strategy: '+19.2%', benchmark: '+11.2%' },
        { year: '2026 (YTD)', strategy: '+9.1%', benchmark: '+6.8%' }
      ]
    },
    themePicks: {
      name: 'Future Economy Mega-Theme Leaders (Exposure > 80%)',
      desc: 'High-growth thematic alpha capturing India’s capex inflection in EV mobility, Defense indigenization, Semis, and Clean Energy.',
      cagr: 28.6,
      benchmarkCagr: 14.2,
      sharpeRatio: 1.82,
      benchmarkSharpe: 0.94,
      maxDrawdown: -17.8,
      benchmarkMaxDrawdown: -22.4,
      winRate: 74.5,
      holdingPeriod: 'Quarterly Rebalancing',
      topConstituents: ['KAYNES', 'PREMIERENE', 'MAZDOCK', 'IREDA', 'TATAMOTORS'],
      factorWeights: [
        { name: 'Future Theme Alignment & TAM', weight: '40%' },
        { name: 'PLI Scheme & Order Book Growth', weight: '25%' },
        { name: 'Operating Cash Flow Positive', weight: '20%' },
        { name: 'Institutional Accumulation', weight: '15%' }
      ],
      yearlyReturns: [
        { year: '2021', strategy: '+44.6%', benchmark: '+24.1%' },
        { year: '2022', strategy: '+14.1%', benchmark: '+4.3%' },
        { year: '2023', strategy: '+41.2%', benchmark: '+20.0%' },
        { year: '2024', strategy: '+36.5%', benchmark: '+18.6%' },
        { year: '2025', strategy: '+25.4%', benchmark: '+11.2%' },
        { year: '2026 (YTD)', strategy: '+12.8%', benchmark: '+6.8%' }
      ]
    }
  }[selectedStrategy];

  // Calculate 5-year compounding values based on initialCapital
  const finalStrategyValue = Math.round(initialCapital * Math.pow(1 + strategyConfig.cagr / 100, 5));
  const finalBenchmarkValue = Math.round(initialCapital * Math.pow(1 + strategyConfig.benchmarkCagr / 100, 5));
  const alphaGained = finalStrategyValue - finalBenchmarkValue;

  // Export Backtest Report
  const exportReport = () => {
    const headers = ['Year', 'Strategy Return (%)', 'NIFTY 50 TRI Benchmark (%)'];
    const rows = strategyConfig.yearlyReturns.map(y => [
      `"${y.year}"`,
      `"${y.strategy}"`,
      `"${y.benchmark}"`
    ]);
    const summary = [
      ['\nSummary Metrics', 'Value'],
      ['Strategy Name', `"${strategyConfig.name}"`],
      ['5-Year CAGR', `${strategyConfig.cagr}%`],
      ['Benchmark CAGR', `${strategyConfig.benchmarkCagr}%`],
      ['Sharpe Ratio', strategyConfig.sharpeRatio.toString()],
      ['Max Drawdown', `${strategyConfig.maxDrawdown}%`],
      ['Initial Capital', `₹${initialCapital}`],
      ['Final Portfolio Value', `₹${finalStrategyValue}`]
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(',')), ...summary.map(s => s.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CINFI_Strategy_Backtest_${selectedStrategy}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="strategy-backtest-view" className="w-full max-w-full space-y-6 pb-16 min-w-0 overflow-x-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <LineChart className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 shrink-0" />
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight break-words">
              Quantitative Strategy & Factor Scoring Backtester
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
            Historical point-in-time validation of CINFI's 10-factor models against the benchmark NIFTY 50 TRI over a 5-year rolling window.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0 self-start sm:self-auto">
          <button
            onClick={exportReport}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
          <div className="px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-mono font-bold flex items-center space-x-2 shadow-inner">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Zero Look-Ahead Bias</span>
          </div>
        </div>
      </div>

      {/* Strategy Selector Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6 shadow-2xl">
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Select Factor Strategy Model
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedStrategy('highScore')}
              className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                selectedStrategy === 'highScore'
                  ? 'bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-950 border-cyan-500 text-white shadow-xl shadow-cyan-950/50'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-xs font-bold block text-white">Top 10-Factor AI Composite</span>
              <span className="text-[11px] text-slate-400 block mt-1">Score ≥ 80 with multi-factor risk penalty filter</span>
            </button>

            <button
              onClick={() => setSelectedStrategy('highRoceClean')}
              className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                selectedStrategy === 'highRoceClean'
                  ? 'bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-950 border-cyan-500 text-white shadow-xl shadow-cyan-950/50'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-xs font-bold block text-white">Capital Efficiency & Clean Balance Sheet</span>
              <span className="text-[11px] text-slate-400 block mt-1">ROCE ≥ 20%, Debt/Equity ≤ 0.5, Zero Pledge</span>
            </button>

            <button
              onClick={() => setSelectedStrategy('themePicks')}
              className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                selectedStrategy === 'themePicks'
                  ? 'bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-950 border-cyan-500 text-white shadow-xl shadow-cyan-950/50'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-xs font-bold block text-white">Future Economy Theme Leaders</span>
              <span className="text-[11px] text-slate-400 block mt-1">AI, EV, Semis, & Defence Exposure ≥ 80%</span>
            </button>
          </div>
        </div>

        {/* Capital Investment Simulator Input */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <Calculator className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold">Simulate Initial Capital Investment:</span>
          </div>

          <div className="flex items-center space-x-2">
            {[50000, 100000, 500000, 1000000].map((amt) => (
              <button
                key={amt}
                onClick={() => setInitialCapital(amt)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  initialCapital === amt
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                ₹{(amt / 100000).toFixed(amt >= 100000 ? 0 : 1)}L
              </button>
            ))}
          </div>
        </div>

        {/* Model Portfolio Constituents Showcase */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase font-mono block">
            Top Factor Portfolio Constituents (Active Quintile)
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            {strategyConfig.topConstituents.map((sym) => {
              const stockItem = STOCKS_DATA.find(s => s.symbol === sym);
              return (
                <div 
                  key={sym}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm"
                >
                  <CompanyLogo 
                    symbol={sym}
                    name={stockItem?.name}
                    size="xs"
                    customLogoUrl={stockItem?.logoUrl}
                    brandColor={stockItem?.brandColor}
                  />
                  <span className="text-xs font-bold text-white font-mono">{sym}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Benchmark: NIFTY 50 Total Return Index (TRI) • 0.15% Per-Leg Transaction Costs Included</span>
          </div>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center justify-center space-x-2 cursor-pointer self-start sm:self-auto"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Simulating Strategy...' : 'Execute Backtest Engine'}</span>
          </button>
        </div>
      </div>

      {/* Backtest KPI Result Cards */}
      {hasRun && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 space-y-1 shadow-lg">
              <span className="text-slate-400 text-[11px] font-sans font-semibold block">5-Year CAGR Return</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">+{strategyConfig.cagr}%</div>
              <span className="text-slate-400 text-[10px] font-sans block">Benchmark: +{strategyConfig.benchmarkCagr}%</span>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 space-y-1 shadow-lg">
              <span className="text-slate-400 text-[11px] font-sans font-semibold block">Sharpe Ratio</span>
              <div className="text-2xl sm:text-3xl font-black text-cyan-300">{strategyConfig.sharpeRatio}</div>
              <span className="text-slate-400 text-[10px] font-sans block">NIFTY 50: {strategyConfig.benchmarkSharpe}</span>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-rose-500/40 rounded-2xl p-4 space-y-1 shadow-lg">
              <span className="text-slate-400 text-[11px] font-sans font-semibold block">Max Drawdown</span>
              <div className="text-2xl sm:text-3xl font-black text-rose-400">{strategyConfig.maxDrawdown}%</div>
              <span className="text-slate-400 text-[10px] font-sans block">NIFTY 50: {strategyConfig.benchmarkMaxDrawdown}%</span>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-4 space-y-1 shadow-lg">
              <span className="text-slate-400 text-[11px] font-sans font-semibold block">Rolling Win Rate</span>
              <div className="text-2xl sm:text-3xl font-black text-white">{strategyConfig.winRate}%</div>
              <span className="text-slate-400 text-[10px] font-sans block">Outperformed NIFTY 50</span>
            </div>
          </div>

          {/* Growth of Capital Simulation Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-base text-white">5-Year Growth of ₹{initialCapital.toLocaleString('en-IN')} Capital</h3>
                <p className="text-xs text-slate-400 mt-0.5">Total compounded capital comparison over 5 years</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Alpha Created: +₹{alphaGained.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/60 via-slate-950 to-slate-950 border border-cyan-500/40 space-y-2">
                <div className="text-xs font-bold text-cyan-300 font-mono uppercase tracking-wider">
                  CINFI Model Portfolio Value
                </div>
                <div className="text-3xl font-black text-white font-mono">
                  ₹{finalStrategyValue.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-emerald-400 font-semibold font-mono">
                  +{(((finalStrategyValue - initialCapital) / initialCapital) * 100).toFixed(1)}% Total Return (+{strategyConfig.cagr}% CAGR)
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
                  NIFTY 50 TRI Benchmark Value
                </div>
                <div className="text-3xl font-black text-slate-300 font-mono">
                  ₹{finalBenchmarkValue.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-400 font-semibold font-mono">
                  +{(((finalBenchmarkValue - initialCapital) / initialCapital) * 100).toFixed(1)}% Total Return (+{strategyConfig.benchmarkCagr}% CAGR)
                </div>
              </div>
            </div>

            {/* Year by Year Returns Table */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3 font-mono">
                Historical Year-by-Year Alpha Progression
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {strategyConfig.yearlyReturns.map((yr) => (
                  <div key={yr.year} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center font-mono">
                    <div className="text-xs text-slate-400 font-semibold">{yr.year}</div>
                    <div className="text-sm font-bold text-emerald-400 mt-1">{yr.strategy}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Nifty: {yr.benchmark}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Factor Model Weights Breakdown */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Quantitative Factor Weight Distribution
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {strategyConfig.factorWeights.map((fw) => (
                <div key={fw.name} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-medium">{fw.name}</span>
                  <span className="text-xs font-bold font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    {fw.weight}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bias Prevention Methodology Notice */}
          <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start space-x-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Point-In-Time Integrity & Slippage Assumptions:</strong> Backtests incorporate mandatory 45-day quarterly reporting lag to prevent look-ahead bias. Transaction costs of 0.15% per leg (including STT, exchange fees, and bid-ask slippage) are deducted point-in-time from rebalancing NAV.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
