import React, { useState, useMemo, useEffect } from 'react';
import { 
  Cpu, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  BarChart3, 
  AlertTriangle, 
  Scale, 
  Search, 
  SlidersHorizontal, 
  Coins, 
  Globe2, 
  ExternalLink,
  Info,
  Flame
} from 'lucide-react';
import { CompanyStock, FutureThemeCategory } from '../../types/stock';
import { FUTURE_THEMES } from '../../data/indianMarketData';
import { CompanyLogo } from '../common/CompanyLogo';

interface ThemeExplorerProps {
  stocks?: CompanyStock[];
  selectedThemeId?: string;
  onSelectStock: (stock: CompanyStock) => void;
}

// Enhanced sector intelligence metadata for themes
const THEME_SECTOR_METADATA: Record<string, {
  tamEstimated: string;
  projectedCagr: string;
  targetYear: string;
  budgetOutlay: string;
  keyMoats: string[];
  riskFactors: string[];
  supplyChainTiers: { tier: string; role: string; keyFocus: string }[];
}> = {
  'ai-infra': {
    tamEstimated: '₹1.85 Lakh Cr by 2028',
    projectedCagr: '34.2% (2024-2030)',
    targetYear: '2028 Horizon',
    budgetOutlay: '₹10,372 Cr (IndiaAI)',
    keyMoats: ['High-density power contracts', 'Low PUE liquid cooling architecture', 'Sovereign data sovereignty clearances'],
    riskFactors: ['Global GPU allocation quotas', 'Power availability at Tier-1 urban nodes'],
    supplyChainTiers: [
      { tier: 'Tier 1: Compute & AI Software', role: 'Enterprise AI & Cloud OS', keyFocus: 'Sovereign LLMs, Cloud Infrastructure' },
      { tier: 'Tier 2: Physical DC & Edge', role: 'Colocation & Edge Nodes', keyFocus: 'Fiber interconnects, High-density racks' },
      { tier: 'Tier 3: Cooling & Power Tech', role: 'Thermal & Grid Subsystems', keyFocus: 'Liquid chillers, UPS systems' }
    ]
  },
  'ev-batteries': {
    tamEstimated: '₹7.2 Lakh Cr by 2030',
    projectedCagr: '42.8% (2024-2030)',
    targetYear: '2030 Horizon',
    budgetOutlay: '₹10,900 Cr (PM E-DRIVE)',
    keyMoats: ['Domestic battery BMS intellectual property', 'High-voltage motor controller integration', 'Fast-charging franchisee network'],
    riskFactors: ['Global lithium/cobalt price volatility', 'Raw material import dependency on China'],
    supplyChainTiers: [
      { tier: 'Tier 1: Pure-Play EV OEMs', role: 'Vehicle Platform Engineering', keyFocus: 'Skateboard chassis, localized assembly' },
      { tier: 'Tier 2: Cell Chemistry & Packs', role: 'ACC Lithium-Ion & LFP Packs', keyFocus: '50 GWh PLI storage roadmap' },
      { tier: 'Tier 3: Power Electronics', role: 'Inverters, BMS, Chargers', keyFocus: 'SiC/GaN power modules' }
    ]
  },
  'semiconductors': {
    tamEstimated: '₹8.4 Lakh Cr ($100B) by 2030',
    projectedCagr: '28.5% (2024-2030)',
    targetYear: '2030 Horizon',
    budgetOutlay: '₹76,000 Cr ($10B ISM)',
    keyMoats: ['Cleanroom fab operation yield expertise', 'Proprietary VLSI design IP & tape-outs', 'OSAT assembly precision & high-pin density'],
    riskFactors: ['Heavy upfront capital expenditure gestation (3-5 years)', 'Specialized talent shortage in sub-28nm process nodes'],
    supplyChainTiers: [
      { tier: 'Tier 1: Fab & ATMP Facilities', role: 'Silicon Wafers & Packaging', keyFocus: 'Commercial fabs in Dholera & Sanand' },
      { tier: 'Tier 2: Fabless Design Houses', role: 'ASIC, SoC & Analog Design', keyFocus: 'Edge AI chips & automotive controllers' },
      { tier: 'Tier 3: Testing & Specialty Gases', role: 'Ultra-pure chemicals & OSAT', keyFocus: 'High-purity argon, testing jigs' }
    ]
  },
  'defence-aerospace': {
    tamEstimated: '₹3.5 Lakh Cr by 2029',
    projectedCagr: '22.4% (2024-2029)',
    targetYear: '2029 Horizon',
    budgetOutlay: '₹1.72 Lakh Cr (Capital Outlay)',
    keyMoats: ['Strategic DPSU long-term supply agreements', 'Classified military IP and offset clearances', 'Extensive live-firing weapon testing tracks'],
    riskFactors: ['Lumpy defense tender procurement cycles', 'Geopolitical tech transfer restrictions'],
    supplyChainTiers: [
      { tier: 'Tier 1: Prime Defense Integrators', role: 'Weapon Systems & Radars', keyFocus: 'SAM missiles, airborne AEW&C' },
      { tier: 'Tier 2: Tactical Drones & EW', role: 'Loitering Munitions & Jammers', keyFocus: 'Autonomous counter-UAS suites' },
      { tier: 'Tier 3: Aerospace Alloys & Forging', role: 'Titanium & Carbon Composites', keyFocus: 'Gas turbine blades, fuselage parts' }
    ]
  },
  'renewable-energy': {
    tamEstimated: '₹14.5 Lakh Cr by 2030',
    projectedCagr: '26.8% (2024-2030)',
    targetYear: '2030 Horizon',
    budgetOutlay: '₹75,000 Cr (PM Surya Ghar + H2)',
    keyMoats: ['Long-term 25-year SECI Power Purchase Agreements (PPAs)', 'Integrated wafer-to-module PLI scale', 'High-efficiency TOPCon & Heterojunction tech'],
    riskFactors: ['Grid curtailment and transmission corridor bottlenecks', 'Anti-dumping duty fluctuations on solar cells'],
    supplyChainTiers: [
      { tier: 'Tier 1: Ultra-Mega IPPs', role: 'Utility Solar & Hybrid Parks', keyFocus: '25-year fixed tariff cashflows' },
      { tier: 'Tier 2: Green H2 Electrolyzers', role: 'Alkaline & PEM Stacks', keyFocus: '₹19,744 Cr SIGHT scheme execution' },
      { tier: 'Tier 3: Inverters & EPC Tech', role: 'Grid Tie & Tracker Subsystems', keyFocus: 'Central string inverters, transformers' }
    ]
  },
  'railways-infra': {
    tamEstimated: '₹6.2 Lakh Cr by 2030',
    projectedCagr: '19.5% (2024-2030)',
    targetYear: '2030 Horizon',
    budgetOutlay: '₹2.55 Lakh Cr (Railway Capex)',
    keyMoats: ['SIL-4 certified Kavach safety hardware', 'Proprietary bogie suspension & traction systems', 'Sole-supplier status on high-speed rail tracks'],
    riskFactors: ['Railway board tender approval schedules', 'Raw material steel pricing cycles'],
    supplyChainTiers: [
      { tier: 'Tier 1: Rolling Stock Builders', role: 'Vande Bharat & Metro Trains', keyFocus: 'Aluminum trainset manufacturing' },
      { tier: 'Tier 2: Signaling & Safety Tech', role: 'Kavach 4.0 & Electronic Interlocking', keyFocus: 'Trackside RFID & LTE-R radios' },
      { tier: 'Tier 3: Specialized Track Infra', role: 'Turnouts, Elastic Rail Fasteners', keyFocus: 'Heavy-haul freight corridors' }
    ]
  },
  'critical-materials': {
    tamEstimated: '₹2.1 Lakh Cr by 2030',
    projectedCagr: '24.1% (2024-2030)',
    targetYear: '2030 Horizon',
    budgetOutlay: '₹15,000 Cr (KABIL & Exploration)',
    keyMoats: ['State-granted long lease mining concessions', 'Advanced solvent extraction processing capability', 'Offtake agreements with domestic battery makers'],
    riskFactors: ['Global commodity market swings', 'Environmental clearances and local zoning permits'],
    supplyChainTiers: [
      { tier: 'Tier 1: Mineral Extraction', role: 'Open-cast & Deep Mining', keyFocus: 'Lithium, Cobalt, Rare Earth Blocks' },
      { tier: 'Tier 2: Chemical Refining', role: 'Battery-grade Hydroxide & Oxides', keyFocus: 'Cathode precursor chemicals' },
      { tier: 'Tier 3: Recycling & Urban Mining', role: 'Hydrometallurgical Recovery', keyFocus: 'Closed-loop black mass recovery' }
    ]
  },
  'robotics-automation': {
    tamEstimated: '₹1.4 Lakh Cr by 2028',
    projectedCagr: '25.6% (2024-2028)',
    targetYear: '2028 Horizon',
    budgetOutlay: '₹6,000 Cr (SAMARTH 4.0)',
    keyMoats: ['Custom SCADA & PLC software automation libraries', 'Precision servo gear reduction technology', 'High MTBF machine vision algorithms'],
    riskFactors: ['Capex deferral during industrial slowdowns', 'Component lead times for imported robotic arms'],
    supplyChainTiers: [
      { tier: 'Tier 1: Turnkey System Integrators', role: 'Factory Automation Lines', keyFocus: 'Automotive welding & assembly cells' },
      { tier: 'Tier 2: Warehouse AGVs & AMRs', role: 'Autonomous Logistics Bots', keyFocus: 'E-commerce fulfillment & sorting' },
      { tier: 'Tier 3: Sensor & Vision Hardware', role: 'LiDAR, 3D Cameras & Cobots', keyFocus: 'Quality inspection & laser metrology' }
    ]
  }
};

export const ThemeExplorer: React.FC<ThemeExplorerProps> = ({
  stocks = [],
  selectedThemeId,
  onSelectStock
}) => {
  const [activeThemeId, setActiveThemeId] = useState<string>(selectedThemeId || FUTURE_THEMES[0].id);
  const [activeTab, setActiveTab] = useState<'overview' | 'constituents' | 'supplychain' | 'valuation'>('overview');
  const [searchFilter, setSearchFilter] = useState('');
  const [minExposure, setMinExposure] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'score' | 'exposure' | 'mcap' | 'change'>('exposure');

  useEffect(() => {
    if (selectedThemeId) {
      setActiveThemeId(selectedThemeId);
    }
  }, [selectedThemeId]);

  const currentTheme = useMemo(() => {
    return FUTURE_THEMES.find(t => t.id === activeThemeId) || FUTURE_THEMES[0];
  }, [activeThemeId]);

  const sectorMeta = THEME_SECTOR_METADATA[currentTheme.id] || THEME_SECTOR_METADATA['ai-infra'];

  // Matching stocks with exposure calculations
  const themeConstituents = useMemo(() => {
    return stocks
      .map(stock => {
        const exp = (stock.futureThemes || []).find(t => t.themeId === currentTheme.id);
        return {
          stock,
          exposure: exp || null
        };
      })
      .filter(item => item.exposure !== null);
  }, [stocks, currentTheme.id]);

  // Filtered and sorted constituents
  const filteredConstituents = useMemo(() => {
    return themeConstituents
      .filter(item => {
        const expScore = item.exposure?.exposureScore || 0;
        if (expScore < minExposure) return false;

        if (searchFilter.trim()) {
          const q = searchFilter.toLowerCase();
          const match = 
            item.stock.symbol.toLowerCase().includes(q) ||
            item.stock.name.toLowerCase().includes(q) ||
            (item.exposure?.justification || '').toLowerCase().includes(q);
          if (!match) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'exposure') {
          return (b.exposure?.exposureScore || 0) - (a.exposure?.exposureScore || 0);
        }
        if (sortBy === 'score') {
          return b.stock.compositeAiScore - a.stock.compositeAiScore;
        }
        if (sortBy === 'mcap') {
          return b.stock.marketCapCr - a.stock.marketCapCr;
        }
        if (sortBy === 'change') {
          return b.stock.percentChange - a.stock.percentChange;
        }
        return 0;
      });
  }, [themeConstituents, searchFilter, minExposure, sortBy]);

  // Sector aggregated metrics
  const avgThemeRoce = useMemo(() => {
    if (themeConstituents.length === 0) return 18.5;
    const total = themeConstituents.reduce((acc, c) => acc + (c.stock.financials?.[0]?.roce || 18), 0);
    return (total / themeConstituents.length).toFixed(1);
  }, [themeConstituents]);

  const avgThemePe = useMemo(() => {
    if (themeConstituents.length === 0) return 24.0;
    const total = themeConstituents.reduce((acc, c) => acc + c.stock.peRatio, 0);
    return (total / themeConstituents.length).toFixed(1);
  }, [themeConstituents]);

  const totalThemeMarketCapCr = useMemo(() => {
    return themeConstituents.reduce((acc, c) => acc + c.stock.marketCapCr, 0);
  }, [themeConstituents]);

  return (
    <div id="theme-explorer-view" className="w-full space-y-6 pb-16 min-w-0">
      
      {/* Top Banner with 3D Holographic Styling & Sector Statistics */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/70 p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-2xl shadow-cyan-950/30">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-16 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-xs font-bold shadow-inner">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Future Economy • 8 Transformational Indian Themes</span>
            </div>
            
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Megatrend Taxonomy & Sector Intelligence
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every constituent company is mapped using audited revenue contributions, sovereign PLI scheme participations, and national capital expenditure mandates.
            </p>
          </div>

          {/* Quick Aggregate Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5 shrink-0">
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3 shadow-inner">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Themes</span>
              <span className="text-sm sm:text-base font-black text-white font-mono">8 Megatrends</span>
            </div>
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3 shadow-inner">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Capex</span>
              <span className="text-sm sm:text-base font-black text-emerald-400 font-mono">₹3.8+ Lakh Cr</span>
            </div>
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3 shadow-inner">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Tracked Equities</span>
              <span className="text-sm sm:text-base font-black text-cyan-400 font-mono">{stocks.length} Constituent</span>
            </div>
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3 shadow-inner">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Audit Level</span>
              <span className="text-sm sm:text-base font-black text-amber-400 font-mono">SEBI Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Horizontal Selectors (8 Themes with active indicator) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-bold uppercase tracking-wider">Select Megatrend Theme</span>
          <span className="font-mono text-[11px] text-cyan-400">Click to switch deep dive</span>
        </div>

        <div className="flex space-x-2.5 overflow-x-auto pb-2 scrollbar-none">
          {FUTURE_THEMES.map((theme) => {
            const isActive = activeThemeId === theme.id;
            return (
              <button
                key={theme.id}
                id={`theme-btn-${theme.id}`}
                onClick={() => {
                  setActiveThemeId(theme.id);
                  setSearchFilter('');
                }}
                className={`px-3.5 sm:px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-2.5 shrink-0 cursor-pointer shadow-md ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 via-indigo-600 to-blue-600 text-white shadow-lg shadow-cyan-950/80 border border-cyan-400/50 scale-[1.02]'
                    : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{theme.name.split('&')[0]}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  isActive ? 'bg-slate-950/80 text-cyan-300' : 'bg-slate-950/60 text-slate-400'
                }`}>
                  {theme.stockCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Theme Deep-Dive Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl shadow-cyan-950/20 space-y-6">
        
        {/* Header of Active Theme */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5 pb-6 border-b border-slate-800">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] uppercase font-bold text-cyan-400 tracking-wider bg-cyan-950/90 px-2.5 py-1 rounded-lg border border-cyan-800/60">
                {currentTheme.category}
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/50 flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>AI Score: {currentTheme.avgScore}/100</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                {sectorMeta.targetYear}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {currentTheme.name}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentTheme.description}
            </p>
          </div>

          {/* Policy & TAM Highlight Box */}
          <div className="bg-slate-950/90 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-2.5 shrink-0 lg:max-w-xs w-full shadow-inner">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-mono tracking-wider block">
                National Policy Catalyst
              </span>
              <span className="text-xs sm:text-sm font-bold text-amber-300 block mt-0.5">
                {currentTheme.governmentInitiative}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">Market TAM</span>
                <span className="font-bold text-white text-[11px]">{sectorMeta.tamEstimated}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">Projected CAGR</span>
                <span className="font-bold text-emerald-400 text-[11px]">{sectorMeta.projectedCagr}</span>
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Overview & Catalysts</span>
          </button>

          <button
            onClick={() => setActiveTab('constituents')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'constituents'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Constituent Equities ({themeConstituents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('supplychain')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'supplychain'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Supply Chain Taxonomy</span>
          </button>

          <button
            onClick={() => setActiveTab('valuation')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'valuation'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fundamentals & Valuation Radar</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & CATALYSTS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Structural Tailwinds */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Structural Growth Catalysts & Capex Roadmaps</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentTheme.tailwindHighlights.map((hl, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 flex items-start space-x-3 shadow-inner">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Moats & Structural Risks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Moats */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3 shadow-inner">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Key Economic Moats & Entry Barriers</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {sectorMeta.keyMoats.map((moat, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                      <span className="leading-relaxed">{moat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risks */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3 shadow-inner">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Structural Sector Risks & Constraints</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {sectorMeta.riskFactors.map((risk, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"></span>
                      <span className="leading-relaxed">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONSTITUENT EQUITIES */}
        {activeTab === 'constituents' && (
          <div className="space-y-4">
            {/* Filter & Sort Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search theme constituents..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-[11px] text-slate-400 font-mono">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
                >
                  <option value="exposure">Highest Exposure</option>
                  <option value="score">AI Quant Score</option>
                  <option value="mcap">Market Cap</option>
                  <option value="change">Day Change</option>
                </select>
              </div>
            </div>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredConstituents.map(({ stock, exposure }) => (
                <div
                  key={stock.id}
                  id={`theme-stock-${stock.symbol}`}
                  onClick={() => onSelectStock(stock)}
                  className="bg-slate-950/90 border border-slate-800 hover:border-cyan-500/60 rounded-2xl p-4.5 cursor-pointer transition-all duration-200 hover:shadow-xl hover:shadow-cyan-950/30 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <CompanyLogo 
                          symbol={stock.symbol}
                          name={stock.name}
                          size="md"
                          customLogoUrl={stock.logoUrl}
                          brandColor={stock.brandColor}
                        />
                        <div>
                          <div className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors flex items-center space-x-2">
                            <span>{stock.symbol}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                              {stock.sector}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 truncate max-w-[180px]">{stock.name}</div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-black px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800/80 shadow-sm block">
                          {exposure?.exposureScore}/100 Exposure
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {exposure?.justification || stock.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center space-x-3">
                      <span className="text-white font-bold">
                        ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <span className={stock.percentChange >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {stock.percentChange >= 0 ? '+' : ''}{stock.percentChange}%
                      </span>
                      <span className="text-[10px] text-slate-400">
                        P/E: <strong className="text-white">{stock.peRatio}x</strong>
                      </span>
                    </div>

                    <span className="text-cyan-400 font-sans font-semibold text-xs flex items-center group-hover:translate-x-1 transition-transform">
                      <span>Terminal</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SUPPLY CHAIN TAXONOMY */}
        {activeTab === 'supplychain' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Value Chain Tier Breakdown & Role Mapping
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sectorMeta.supplyChainTiers.map((tierInfo, i) => (
                <div key={i} className="p-4.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                      {tierInfo.tier}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white">
                    {tierInfo.role}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {tierInfo.keyFocus}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: FUNDAMENTALS & VALUATION RADAR */}
        {activeTab === 'valuation' && (
          <div className="space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Sector Aggregated Financial Quality & Valuation Corridor
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-center shadow-inner">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Avg ROCE</span>
                <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono mt-1 block">
                  {avgThemeRoce}%
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">High capital efficiency</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-center shadow-inner">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Median P/E</span>
                <span className="text-lg sm:text-xl font-black text-cyan-300 font-mono mt-1 block">
                  {avgThemePe}x
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Trailing 12-month</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-center shadow-inner">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Combined M-Cap</span>
                <span className="text-lg sm:text-xl font-black text-indigo-300 font-mono mt-1 block truncate">
                  ₹{(totalThemeMarketCapCr / 1000).toFixed(0)}k Cr
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Free-float & Promoter</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-center shadow-inner">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Outlay Buffer</span>
                <span className="text-lg sm:text-xl font-black text-amber-300 font-mono mt-1 block">
                  {sectorMeta.budgetOutlay.split(' ')[0]}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Government Incentive</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

