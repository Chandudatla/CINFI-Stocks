import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  BellRing, 
  Plus, 
  Check, 
  X, 
  Trash2, 
  Play, 
  Pause, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Sparkles, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Filter, 
  SlidersHorizontal,
  ExternalLink,
  ArrowRight,
  Info,
  Clock
} from 'lucide-react';
import { CompanyStock, SmartAlert, AlertType } from '../../types/stock';
import { CompanyLogo } from '../common/CompanyLogo';

interface SmartAlertsProps {
  stocks?: CompanyStock[];
  onSelectStock: (stock: CompanyStock) => void;
}

export const SmartAlerts: React.FC<SmartAlertsProps> = ({
  stocks = [],
  onSelectStock
}) => {
  // Initial seed alerts for realistic demonstration
  const [alerts, setAlerts] = useState<SmartAlert[]>([
    {
      id: 'alt-1',
      stockId: stocks[0]?.id || '1',
      stockSymbol: stocks[0]?.symbol || 'TATAMOTORS',
      stockName: stocks[0]?.name || 'Tata Motors Ltd',
      type: 'PRICE_ABOVE',
      category: 'Price',
      targetValue: 1050,
      conditionDescription: 'Price crosses above ₹1,050.00',
      currentValueDescription: `Current: ₹${stocks[0]?.currentPrice || '1045.20'}`,
      note: 'Key technical resistance breakout zone for EV expansion cycle',
      isActive: true,
      isTriggered: false,
      createdAt: '2026-08-28 09:30 AM',
      frequency: 'recurring'
    },
    {
      id: 'alt-2',
      stockId: stocks[1]?.id || '2',
      stockSymbol: stocks[1]?.symbol || 'BEL',
      stockName: stocks[1]?.name || 'Bharat Electronics Ltd',
      type: 'GOLDEN_CROSS',
      category: 'Trend',
      conditionDescription: '50-Day SMA crosses above 200-Day SMA (Golden Cross)',
      currentValueDescription: 'SMA50: ₹312.40 | SMA200: ₹295.10 (Cross Confirmed)',
      note: 'Defence radar order book acceleration catalyst',
      isActive: true,
      isTriggered: true,
      triggeredAt: '2026-08-28 10:15 AM',
      createdAt: '2026-08-27 02:00 PM',
      frequency: 'once'
    },
    {
      id: 'alt-3',
      stockId: stocks[2]?.id || '3',
      stockSymbol: stocks[2]?.symbol || 'KAYNES',
      stockName: stocks[2]?.name || 'Kaynes Technology India Ltd',
      type: 'AI_SCORE_ABOVE',
      category: 'AI Score',
      targetValue: 85,
      conditionDescription: 'AI Composite Score reaches ≥ 85/100',
      currentValueDescription: `Current Score: ${stocks[2]?.compositeAiScore || 89}/100`,
      note: 'Semiconductor OSAT plant subsidy and revenue ramp-up',
      isActive: true,
      isTriggered: true,
      triggeredAt: '2026-08-28 10:45 AM',
      createdAt: '2026-08-26 11:20 AM',
      frequency: 'recurring'
    },
    {
      id: 'alt-4',
      stockId: stocks[3]?.id || '4',
      stockSymbol: stocks[3]?.symbol || 'PREMIERENE',
      stockName: stocks[3]?.name || 'Premier Energies Ltd',
      type: 'VOLUME_SURGE',
      category: 'Volume',
      targetValue: 2.5,
      conditionDescription: 'Trading volume surges > 2.5x 30-day average',
      currentValueDescription: 'Volume: 3.4x avg (Unusual Institutional Flow)',
      note: 'Solar TOPCon cell expansion and ALMM policy tailwind',
      isActive: true,
      isTriggered: false,
      createdAt: '2026-08-28 09:15 AM',
      frequency: 'recurring'
    },
    {
      id: 'alt-5',
      stockId: stocks[0]?.id || '1',
      stockSymbol: stocks[0]?.symbol || 'TATAMOTORS',
      stockName: stocks[0]?.name || 'Tata Motors Ltd',
      type: 'RSI_OVERSOLD',
      category: 'Trend',
      targetValue: 30,
      conditionDescription: 'RSI (14) drops below 30.00 (Oversold Dip)',
      currentValueDescription: `Current RSI: ${stocks[0]?.technicals.rsi14 || '62.40'}`,
      note: 'Long-term accumulation zone if market experiences macro volatility',
      isActive: true,
      isTriggered: false,
      createdAt: '2026-08-27 10:00 AM',
      frequency: 'once'
    }
  ]);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStockId, setSelectedStockId] = useState<string>(stocks[0]?.id || '');
  const [alertCategory, setAlertCategory] = useState<'Price' | 'Trend' | 'AI Score' | 'Volume'>('Price');
  const [alertType, setAlertType] = useState<AlertType>('PRICE_ABOVE');
  const [customTarget, setCustomTarget] = useState<string>('');
  const [customNote, setCustomNote] = useState<string>('');
  const [alertFrequency, setAlertFrequency] = useState<'once' | 'recurring'>('recurring');

  // Filter State
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTIVE' | 'TRIGGERED' | 'PRICE' | 'TREND' | 'AI_SCORE'>('ALL');
  const [searchFilter, setSearchFilter] = useState('');

  // Toast / Live Trigger Simulation Banner
  const [simulationToast, setSimulationToast] = useState<{ show: boolean; title: string; message: string; stockSymbol: string } | null>(null);

  const selectedStock = useMemo(() => {
    return stocks.find(s => s.id === selectedStockId) || stocks[0];
  }, [stocks, selectedStockId]);

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      // Search
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const match = 
          alert.stockSymbol.toLowerCase().includes(q) ||
          alert.stockName.toLowerCase().includes(q) ||
          alert.conditionDescription.toLowerCase().includes(q) ||
          (alert.note && alert.note.toLowerCase().includes(q));
        if (!match) return false;
      }

      // Tab filter
      if (activeFilter === 'ACTIVE' && (!alert.isActive || alert.isTriggered)) return false;
      if (activeFilter === 'TRIGGERED' && !alert.isTriggered) return false;
      if (activeFilter === 'PRICE' && alert.category !== 'Price') return false;
      if (activeFilter === 'TREND' && alert.category !== 'Trend') return false;
      if (activeFilter === 'AI_SCORE' && alert.category !== 'AI Score') return false;

      return true;
    });
  }, [alerts, activeFilter, searchFilter]);

  // Actions
  const handleToggleActive = (id: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, isActive: !a.isActive };
      }
      return a;
    }));
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleSimulateTrigger = (alert: SmartAlert) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === alert.id) {
        return {
          ...a,
          isTriggered: true,
          triggeredAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' (Just now)'
        };
      }
      return a;
    }));

    setSimulationToast({
      show: true,
      title: `⚡ Alert Triggered: ${alert.stockSymbol}`,
      message: `${alert.conditionDescription} met! ${alert.currentValueDescription}`,
      stockSymbol: alert.stockSymbol
    });

    setTimeout(() => {
      setSimulationToast(null);
    }, 6000);
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock) return;

    let conditionDesc = '';
    let currDesc = '';
    const numericTarget = parseFloat(customTarget) || 0;

    switch (alertType) {
      case 'PRICE_ABOVE':
        conditionDesc = `Price crosses above ₹${numericTarget.toLocaleString('en-IN')}`;
        currDesc = `Current: ₹${selectedStock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
        break;
      case 'PRICE_BELOW':
        conditionDesc = `Price drops below ₹${numericTarget.toLocaleString('en-IN')}`;
        currDesc = `Current: ₹${selectedStock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
        break;
      case 'PERCENT_CHANGE_UP':
        conditionDesc = `Day gain exceeds +${numericTarget}%`;
        currDesc = `Current: ${selectedStock.percentChange >= 0 ? '+' : ''}${selectedStock.percentChange}%`;
        break;
      case 'PERCENT_CHANGE_DOWN':
        conditionDesc = `Day decline drops below -${numericTarget}%`;
        currDesc = `Current: ${selectedStock.percentChange}%`;
        break;
      case 'RSI_OVERSOLD':
        conditionDesc = `RSI(14) drops below ${numericTarget || 30} (Oversold)`;
        currDesc = `Current RSI: ${selectedStock.technicals.rsi14}`;
        break;
      case 'RSI_OVERBOUGHT':
        conditionDesc = `RSI(14) rises above ${numericTarget || 70} (Overbought)`;
        currDesc = `Current RSI: ${selectedStock.technicals.rsi14}`;
        break;
      case 'GOLDEN_CROSS':
        conditionDesc = `50-Day SMA crosses above 200-Day SMA`;
        currDesc = `SMA50: ₹${selectedStock.technicals.sma50} | SMA200: ₹${selectedStock.technicals.sma200}`;
        break;
      case 'AI_SCORE_ABOVE':
        conditionDesc = `AI Research Score reaches ≥ ${numericTarget || 85}/100`;
        currDesc = `Current Score: ${selectedStock.compositeAiScore}/100`;
        break;
      case 'VOLUME_SURGE':
        conditionDesc = `Volume surges > ${numericTarget || 2.5}x 30-day average`;
        currDesc = `Current Volume: ${selectedStock.volume}`;
        break;
      default:
        conditionDesc = `Custom trigger on ${selectedStock.symbol}`;
        currDesc = `Price: ₹${selectedStock.currentPrice}`;
    }

    const newAlert: SmartAlert = {
      id: `alt-${Date.now()}`,
      stockId: selectedStock.id,
      stockSymbol: selectedStock.symbol,
      stockName: selectedStock.name,
      type: alertType,
      category: alertCategory,
      targetValue: numericTarget,
      conditionDescription: conditionDesc,
      currentValueDescription: currDesc,
      note: customNote.trim() || undefined,
      isActive: true,
      isTriggered: false,
      createdAt: 'Today, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      frequency: alertFrequency
    };

    setAlerts([newAlert, ...alerts]);
    setIsCreateModalOpen(false);
    setCustomTarget('');
    setCustomNote('');
  };

  const handleApplyPreset = (preset: {
    stock: CompanyStock;
    type: AlertType;
    category: 'Price' | 'Trend' | 'AI Score' | 'Volume';
    target?: number;
    desc: string;
    note: string;
  }) => {
    const newAlert: SmartAlert = {
      id: `alt-${Date.now()}`,
      stockId: preset.stock.id,
      stockSymbol: preset.stock.symbol,
      stockName: preset.stock.name,
      type: preset.type,
      category: preset.category,
      targetValue: preset.target,
      conditionDescription: preset.desc,
      currentValueDescription: `Current: ₹${preset.stock.currentPrice.toLocaleString('en-IN')}`,
      note: preset.note,
      isActive: true,
      isTriggered: false,
      createdAt: 'Today, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      frequency: 'recurring'
    };

    setAlerts([newAlert, ...alerts]);
  };

  return (
    <div id="smart-alerts-view" className="w-full max-w-full space-y-6 pb-16 min-w-0 overflow-x-hidden">
      {/* Toast Notification for Trigger Simulation */}
      {simulationToast && (
        <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-auto z-50 max-w-md bg-slate-900 border border-cyan-500/80 rounded-2xl p-4 shadow-2xl shadow-cyan-950/80 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start space-x-3 min-w-0">
              <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-700 shrink-0">
                <BellRing className="w-5 h-5 animate-bounce" />
              </div>
              <div className="space-y-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{simulationToast.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed break-words">{simulationToast.message}</p>
                <div className="pt-2 flex items-center space-x-2">
                  <button
                    onClick={() => {
                      const st = stocks.find(s => s.symbol === simulationToast.stockSymbol);
                      if (st) onSelectStock(st);
                      setSimulationToast(null);
                    }}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Open {simulationToast.stockSymbol} Terminal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSimulationToast(null)}
              className="text-slate-400 hover:text-white p-1 shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 shrink-0">
              <BellRing className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight break-words">
              Smart Alerts & Dynamic Triggers
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-relaxed">
            Real-time quantitative alerts on NSE share prices, technical breakouts, 10-factor AI scores, and volume surges.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            id="create-alert-btn"
            onClick={() => {
              setSelectedStockId(stocks[0]?.id || '');
              setIsCreateModalOpen(true);
            }}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-950 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Create Custom Alert</span>
          </button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 font-mono min-w-0">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 space-y-0.5 min-w-0 overflow-hidden">
          <span className="text-slate-500 text-[10px] sm:text-[11px] font-sans block truncate">Active Alerts</span>
          <div className="text-xl sm:text-2xl font-black text-cyan-400">
            {alerts.filter(a => a.isActive && !a.isTriggered).length}
          </div>
          <span className="text-slate-400 text-[9px] sm:text-[10px] font-sans block truncate">Monitored</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 space-y-0.5 min-w-0 overflow-hidden">
          <span className="text-slate-500 text-[10px] sm:text-[11px] font-sans block truncate">Triggered Today</span>
          <div className="text-xl sm:text-2xl font-black text-amber-400">
            {alerts.filter(a => a.isTriggered).length}
          </div>
          <span className="text-slate-400 text-[9px] sm:text-[10px] font-sans block truncate">Conditions Met</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 space-y-0.5 min-w-0 overflow-hidden">
          <span className="text-slate-500 text-[10px] sm:text-[11px] font-sans block truncate">Equities</span>
          <div className="text-xl sm:text-2xl font-black text-white">
            {new Set(alerts.map(a => a.stockSymbol)).size}
          </div>
          <span className="text-slate-400 text-[9px] sm:text-[10px] font-sans block truncate">NSE Tickers</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 space-y-0.5 min-w-0 overflow-hidden">
          <span className="text-slate-500 text-[10px] sm:text-[11px] font-sans block truncate">Radar Latency</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-400">&lt; 150ms</div>
          <span className="text-slate-400 text-[9px] sm:text-[10px] font-sans block truncate">Deterministic</span>
        </div>
      </div>

      {/* Quick 1-Click Preset Radar Templates */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 sm:space-y-4 shadow-xl min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 min-w-0">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider truncate">
              1-Click Intelligent Factor Presets
            </h3>
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-400 shrink-0">Click to track</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 min-w-0">
          <button
            onClick={() => handleApplyPreset({
              stock: stocks[0],
              type: 'PRICE_ABOVE',
              category: 'Price',
              target: Math.round(stocks[0].currentPrice * 1.05),
              desc: `Price crosses +5% (₹${Math.round(stocks[0].currentPrice * 1.05)})`,
              note: 'Breakout above key near-term resistance'
            })}
            className="p-3 bg-slate-950/80 border border-slate-800 hover:border-cyan-500/60 rounded-xl text-left transition-all group cursor-pointer min-w-0"
          >
            <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-cyan-300">
              <span className="truncate">+5% Resistance Breakout</span>
              <Plus className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-1" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">
              {stocks[0].symbol}: Target ₹{Math.round(stocks[0].currentPrice * 1.05)}
            </p>
          </button>

          <button
            onClick={() => handleApplyPreset({
              stock: stocks[1] || stocks[0],
              type: 'GOLDEN_CROSS',
              category: 'Trend',
              desc: '50-Day SMA Golden Cross Over 200-Day SMA',
              note: 'Bullish institutional trend reversal'
            })}
            className="p-3 bg-slate-950/80 border border-slate-800 hover:border-emerald-500/60 rounded-xl text-left transition-all group cursor-pointer min-w-0"
          >
            <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-emerald-300">
              <span className="truncate">Golden Cross Confirmation</span>
              <Plus className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">
              {stocks[1]?.symbol || stocks[0].symbol}: SMA 50 &gt; SMA 200
            </p>
          </button>

          <button
            onClick={() => handleApplyPreset({
              stock: stocks[2] || stocks[0],
              type: 'AI_SCORE_ABOVE',
              category: 'AI Score',
              target: 88,
              desc: 'AI Composite Score ≥ 88/100',
              note: 'Tier-1 fundamental quality upgrade'
            })}
            className="p-3 bg-slate-950/80 border border-slate-800 hover:border-indigo-500/60 rounded-xl text-left transition-all group cursor-pointer min-w-0"
          >
            <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-indigo-300">
              <span className="truncate">High Conviction AI &gt; 88</span>
              <Plus className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-1" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">
              {stocks[2]?.symbol || stocks[0].symbol}: 10-Factor Score
            </p>
          </button>

          <button
            onClick={() => handleApplyPreset({
              stock: stocks[3] || stocks[0],
              type: 'VOLUME_SURGE',
              category: 'Volume',
              target: 3.0,
              desc: 'Volume Surge &gt; 3.0x Average',
              note: 'Smart money block deal / delivery spike'
            })}
            className="p-3 bg-slate-950/80 border border-slate-800 hover:border-amber-500/60 rounded-xl text-left transition-all group cursor-pointer min-w-0"
          >
            <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-amber-300">
              <span className="truncate">Volume Anomaly Spike</span>
              <Plus className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">
              {stocks[3]?.symbol || stocks[0].symbol}: &gt; 3x Volume Surge
            </p>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 min-w-0">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 min-w-0 max-w-full">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'ACTIVE', label: 'Active' },
            { id: 'TRIGGERED', label: 'Triggered' },
            { id: 'PRICE', label: 'Price' },
            { id: 'TREND', label: 'Trend' },
            { id: 'AI_SCORE', label: 'AI Score' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-950'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64 min-w-0">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search alerts..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3 min-w-0">
        {filteredAlerts.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-3">
            <Bell className="w-8 h-8 text-slate-600 mx-auto" />
            <div className="text-sm font-bold text-slate-300">No matching alerts found</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create custom price levels, moving average crossovers, or factor score alerts to monitor equities 24/7.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-xl text-xs font-bold hover:bg-cyan-900 transition-colors cursor-pointer"
            >
              Create New Alert
            </button>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const stockRef = stocks.find(s => s.symbol === alert.stockSymbol) || stocks[0];
            return (
              <div
                key={alert.id}
                className={`bg-slate-900/90 border rounded-2xl p-3.5 sm:p-5 transition-all shadow-md min-w-0 overflow-hidden ${
                  alert.isTriggered
                    ? 'border-amber-500/60 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20'
                    : alert.isActive
                    ? 'border-slate-800 hover:border-cyan-500/50'
                    : 'border-slate-800/60 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
                  {/* Stock info & Condition */}
                  <div className="flex items-start space-x-3 min-w-0 flex-1">
                    <CompanyLogo
                      symbol={alert.stockSymbol}
                      name={alert.stockName}
                      size="sm"
                      customLogoUrl={stockRef?.logoUrl}
                      brandColor={stockRef?.brandColor}
                    />

                    <div className={`p-1.5 sm:p-2 rounded-xl shrink-0 ${
                      alert.category === 'Price' 
                        ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-800/80'
                        : alert.category === 'Trend'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                        : alert.category === 'AI Score'
                        ? 'bg-indigo-950/80 text-indigo-400 border border-indigo-800/80'
                        : 'bg-amber-950/80 text-amber-400 border border-amber-800/80'
                    }`}>
                      {alert.category === 'Price' && <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      {alert.category === 'Trend' && <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      {alert.category === 'AI Score' && <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      {alert.category === 'Volume' && <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                        <button
                          onClick={() => onSelectStock(stockRef)}
                          className="font-bold text-xs sm:text-sm text-white hover:text-cyan-300 transition-colors flex items-center space-x-1 cursor-pointer truncate max-w-[180px]"
                        >
                          <span>{alert.stockSymbol}</span>
                          <span className="text-[11px] text-slate-400 font-normal truncate hidden xs:inline">({alert.stockName})</span>
                        </button>

                        <span className="text-[9px] sm:text-[10px] uppercase font-bold px-1.5 sm:px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono">
                          {alert.category}
                        </span>

                        {alert.isTriggered ? (
                          <span className="text-[9px] sm:text-[10px] uppercase font-bold px-1.5 sm:px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                            <span>TRIGGERED</span>
                          </span>
                        ) : alert.isActive ? (
                          <span className="text-[9px] sm:text-[10px] uppercase font-bold px-1.5 sm:px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span>ACTIVE</span>
                          </span>
                        ) : (
                          <span className="text-[9px] sm:text-[10px] uppercase font-bold px-1.5 sm:px-2 py-0.5 rounded bg-slate-950 text-slate-500 border border-slate-800">
                            PAUSED
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-semibold text-slate-200 break-words">
                        {alert.conditionDescription}
                      </div>

                      <div className="text-[11px] text-slate-400 font-mono flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5 break-words">
                        <span>{alert.currentValueDescription}</span>
                        {alert.triggeredAt && (
                          <span className="text-amber-400 font-sans flex items-center space-x-1 text-[10px] sm:text-[11px]">
                            <Clock className="w-3 h-3" />
                            <span>Triggered: {alert.triggeredAt}</span>
                          </span>
                        )}
                      </div>

                      {alert.note && (
                        <p className="text-[11px] text-slate-400 italic pt-0.5 break-words">
                          "{alert.note}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions & Controls */}
                  <div className="flex items-center space-x-1.5 self-start sm:self-center shrink-0 pt-1 sm:pt-0">
                    <button
                      onClick={() => handleSimulateTrigger(alert)}
                      title="Simulate / Test Trigger Condition"
                      className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[11px]">Test</span>
                    </button>

                    <button
                      onClick={() => handleToggleActive(alert.id)}
                      title={alert.isActive ? 'Pause Alert' : 'Resume Alert'}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        alert.isActive
                          ? 'bg-slate-950 text-slate-400 hover:text-amber-300 border-slate-800'
                          : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      }`}
                    >
                      {alert.isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => onSelectStock(stockRef)}
                      title="Open Terminal"
                      className="p-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      title="Delete Alert"
                      className="p-1.5 rounded-lg bg-slate-950 hover:bg-rose-950 text-slate-500 hover:text-rose-400 border border-slate-800 hover:border-rose-800 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Educational Notice */}
      <div className="bg-gradient-to-r from-cyan-950/30 via-slate-900 to-slate-900 border border-cyan-800/40 rounded-2xl p-3.5 sm:p-4 flex items-start space-x-3 text-xs text-slate-300 min-w-0">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1 min-w-0">
          <strong className="text-cyan-300 font-semibold block">24/7 Market Radar Execution Policy:</strong>
          <p className="text-slate-400 leading-relaxed text-[11px] sm:text-xs">
            Smart alerts operate strictly for quantitative research, notification, and discovery. CINFI Stocks does not execute auto-trades. Upon receiving a trigger, review the full Company Intelligence Terminal, Bull/Bear scenarios, and verified evidence before continuing to your broker.
          </p>
        </div>
      </div>

      {/* Create Custom Alert Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 max-w-lg w-full rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-cyan-400">
                <BellRing className="w-5 h-5" />
                <h3 className="text-sm sm:text-base font-bold text-white">Create Smart Stock Alert</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-3.5 text-xs">
              {/* Select Stock */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase tracking-wider block text-[11px]">
                  Select NSE Stock
                </label>
                <select
                  value={selectedStockId}
                  onChange={(e) => setSelectedStockId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                >
                  {stocks.map((stock) => (
                    <option key={stock.id} value={stock.id}>
                      {stock.symbol} — {stock.name} (₹{stock.currentPrice})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Category */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase tracking-wider block text-[11px]">
                  Alert Category
                </label>
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                  {(['Price', 'Trend', 'AI Score', 'Volume'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setAlertCategory(cat);
                        if (cat === 'Price') setAlertType('PRICE_ABOVE');
                        if (cat === 'Trend') setAlertType('GOLDEN_CROSS');
                        if (cat === 'AI Score') setAlertType('AI_SCORE_ABOVE');
                        if (cat === 'Volume') setAlertType('VOLUME_SURGE');
                      }}
                      className={`py-1.5 sm:py-2 rounded-xl text-center font-bold text-[11px] sm:text-xs transition-all cursor-pointer ${
                        alertCategory === cat
                          ? 'bg-cyan-600 text-white shadow-md'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific Trigger Type */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase tracking-wider block text-[11px]">
                  Trigger Condition
                </label>
                <select
                  value={alertType}
                  onChange={(e) => setAlertType(e.target.value as AlertType)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                >
                  {alertCategory === 'Price' && (
                    <>
                      <option value="PRICE_ABOVE">Price Crosses Above Threshold (₹)</option>
                      <option value="PRICE_BELOW">Price Drops Below Threshold (₹)</option>
                      <option value="PERCENT_CHANGE_UP">Day Gain Exceeds (+%)</option>
                      <option value="PERCENT_CHANGE_DOWN">Day Decline Exceeds (-%)</option>
                    </>
                  )}
                  {alertCategory === 'Trend' && (
                    <>
                      <option value="GOLDEN_CROSS">50-Day SMA Crosses Above 200-Day SMA (Golden Cross)</option>
                      <option value="RSI_OVERSOLD">RSI (14) Drops Below 30 (Oversold Dip)</option>
                      <option value="RSI_OVERBOUGHT">RSI (14) Rises Above 70 (Overbought)</option>
                    </>
                  )}
                  {alertCategory === 'AI Score' && (
                    <>
                      <option value="AI_SCORE_ABOVE">AI Composite Score Rises Above (0-100)</option>
                    </>
                  )}
                  {alertCategory === 'Volume' && (
                    <>
                      <option value="VOLUME_SURGE">Unusual Volume Surge (&gt; Multiplier of 30D Avg)</option>
                    </>
                  )}
                </select>
              </div>

              {/* Target Value Input (Conditional) */}
              {alertType !== 'GOLDEN_CROSS' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <label className="font-bold text-slate-300 uppercase tracking-wider block">
                      Target Threshold
                    </label>
                    <span className="text-slate-400 font-mono text-[10px]">
                      Current: {alertType.includes('PRICE') ? `₹${selectedStock.currentPrice}` : alertType.includes('RSI') ? `RSI ${selectedStock.technicals.rsi14}` : alertType.includes('AI') ? `Score ${selectedStock.compositeAiScore}` : `Vol ${selectedStock.volume}`}
                    </span>
                  </div>
                  <input
                    type="number"
                    step="any"
                    value={customTarget}
                    onChange={(e) => setCustomTarget(e.target.value)}
                    placeholder={
                      alertType === 'PRICE_ABOVE' ? `e.g. ${Math.round(selectedStock.currentPrice * 1.05)}` :
                      alertType === 'PRICE_BELOW' ? `e.g. ${Math.round(selectedStock.currentPrice * 0.95)}` :
                      alertType.includes('PERCENT') ? 'e.g. 5.0' :
                      alertType.includes('RSI') ? '30' :
                      alertType.includes('AI') ? '85' : '2.5'
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                    required
                  />

                  {/* Fast Quick-fill Pills */}
                  {alertType === 'PRICE_ABOVE' && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setCustomTarget(Math.round(selectedStock.currentPrice * 1.02).toString())}
                        className="px-2 py-1 rounded bg-slate-950 text-[10px] text-cyan-300 border border-slate-800 hover:border-cyan-600 cursor-pointer"
                      >
                        +2% (₹{Math.round(selectedStock.currentPrice * 1.02)})
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomTarget(Math.round(selectedStock.currentPrice * 1.05).toString())}
                        className="px-2 py-1 rounded bg-slate-950 text-[10px] text-cyan-300 border border-slate-800 hover:border-cyan-600 cursor-pointer"
                      >
                        +5% (₹{Math.round(selectedStock.currentPrice * 1.05)})
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomTarget(selectedStock.high52w.toString())}
                        className="px-2 py-1 rounded bg-slate-950 text-[10px] text-cyan-300 border border-slate-800 hover:border-cyan-600 cursor-pointer"
                      >
                        52W High (₹{selectedStock.high52w})
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Custom Note */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase tracking-wider block text-[11px]">
                  Research Note / Action Plan (Optional)
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="e.g. Check order book & review quarterly results on breakout"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Frequency */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase tracking-wider block text-[11px]">
                  Alert Frequency
                </label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs text-slate-300">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="frequency"
                      checked={alertFrequency === 'recurring'}
                      onChange={() => setAlertFrequency('recurring')}
                      className="accent-cyan-500"
                    />
                    <span>Always Keep Active (Recurring)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="frequency"
                      checked={alertFrequency === 'once'}
                      onChange={() => setAlertFrequency('once')}
                      className="accent-cyan-500"
                    />
                    <span>Trigger Once & Deactivate</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2 sm:space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-950 text-slate-400 hover:text-white rounded-xl border border-slate-800 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-md shadow-cyan-950 flex items-center space-x-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Activate Alert</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
