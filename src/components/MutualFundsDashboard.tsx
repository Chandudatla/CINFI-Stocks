import React, { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Database,
  Globe,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  MarketStatus,
  MfBroadCategory,
  MutualFundDetail,
  MutualFundSummary,
  OfficialSourceLink,
} from '../types/market';
import { formatINR, formatSignedPercent } from '../utils/format';
import { fetchJson } from '../utils/safeFetch';
import { Sparkline } from './Sparkline';
import { PriceChart } from './PriceChart';
import { DashboardModuleGrid, MODULE_THEMES, ModuleCardSpec } from './DashboardModuleGrid';
import { OfficialSourcesGrid } from './OfficialSourcesGrid';
import { StructuredDashboardAI } from './StructuredDashboardAI';
import { DashboardMonitoringPanel } from './DashboardMonitoringPanel';
import { FuturisticTop20 } from './FuturisticTop20';

interface MutualFundsDashboardProps {
  onBack: () => void;
}

type MfTab = 'database' | 'official' | 'analysis' | 'expert' | 'monitoring';

interface SavedSipPlan {
  id: string;
  schemeCode: string;
  schemeName: string;
  monthlyAmount: number;
  startNav: number;
  monthsActive: number;
}

const SIP_STORAGE_KEY = 'cinfi_mf_sip_plans_v1';

export const MutualFundsDashboard: React.FC<MutualFundsDashboardProps> = ({
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<MfTab>('database');
  const [databaseView, setDatabaseView] = useState<'all' | 'futuristic'>('all');
  const [funds, setFunds] = useState<MutualFundSummary[]>([]);
  const [marketStatus, setMarketStatus] = useState<MarketStatus | null>(null);
  const [syncedAt, setSyncedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Module A: Category filter + Flow filter + Unified AMFI Search
  const [broadFilter, setBroadFilter] = useState<'All' | MfBroadCategory>('All');
  const [flowFilter, setFlowFilter] = useState<'all' | 'buying' | 'selling'>('all');
  const [selectedCode, setSelectedCode] = useState<string>('122639');
  const [fundDetail, setFundDetail] = useState<MutualFundDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(true);

  const [amfiQuery, setAmfiQuery] = useState('');
  const [searchResults, setSearchResults] = useState<
    Array<{ schemeCode: string; schemeName: string }>
  >([]);
  const [searching, setSearching] = useState(false);

  // SIP Projection & Monitoring state (zero external DB — persisted in localStorage)
  const [monthlySip, setMonthlySip] = useState<number>(15000);
  const [sipYears, setSipYears] = useState<number>(5);
  const [sipStepUpPct, setSipStepUpPct] = useState<number>(0);
  const [sipPlans, setSipPlans] = useState<SavedSipPlan[]>(() => {
    try {
      const raw = localStorage.getItem(SIP_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SIP_STORAGE_KEY, JSON.stringify(sipPlans));
    } catch {
      // Ignore storage errors
    }
  }, [sipPlans]);

  const loadFunds = async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchJson<any>(
        `/api/dashboard/mutual-funds${force ? '?force=true' : ''}`
      );
      setFunds(Array.isArray(data.funds) ? data.funds : []);
      if (data.marketStatus) setMarketStatus(data.marketStatus);
      if (data.syncedAt) setSyncedAt(data.syncedAt);
    } catch (err: any) {
      setError(err?.message || 'Unable to reach AMFI feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFunds(false);
    const timer = setInterval(() => loadFunds(false), 30_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!selectedCode) return;
    let cancelled = false;
    setDetailLoading(true);
    fetchJson<MutualFundDetail>(`/api/mf/${encodeURIComponent(selectedCode)}`)
      .then((data) => {
        if (!cancelled && data) setFundDetail(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setDetailLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedCode]);

  useEffect(() => {
    const trimmed = amfiQuery.trim();
    if (trimmed.length < 2) {
      setSearchResults([]);
      return;
    }
    let cancelled = false;
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await fetchJson<{ results?: Array<{ schemeCode: number; schemeName: string }> }>(
          `/api/mf/search?q=${encodeURIComponent(trimmed)}`
        );
        if (!cancelled) {
          setSearchResults(Array.isArray(data.results) ? data.results : []);
        }
      } catch {
        if (!cancelled) setSearchResults([]);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 280);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [amfiQuery]);

  const buyingCount = useMemo(
    () => funds.filter((f) => f.orderFlowType === 'buying').length,
    [funds]
  );
  const sellingCount = useMemo(
    () => funds.filter((f) => f.orderFlowType === 'selling').length,
    [funds]
  );

  const filteredFunds = useMemo(() => {
    const q = amfiQuery.trim().toLowerCase();
    const list = funds.filter((f) => {
      const matchCat = broadFilter === 'All' || f.broadCategory === broadFilter;
      const matchFlow = flowFilter === 'all' || f.orderFlowType === flowFilter;
      const matchQ =
        !q ||
        f.schemeName.toLowerCase().includes(q) ||
        f.fundHouse.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q);
      return matchCat && matchFlow && matchQ;
    });
    return [...list].sort(
      (a, b) => (b.flowScore ?? 0) - (a.flowScore ?? 0) || (b.return1m ?? 0) - (a.return1m ?? 0)
    );
  }, [funds, broadFilter, flowFilter, amfiQuery]);

  const activeFund = funds.find((f) => f.schemeCode === selectedCode) || funds[0] || null;

  const effectiveAnnualRate =
    fundDetail?.return1y !== null && fundDetail?.return1y !== undefined
      ? Math.max(-25, Math.min(35, fundDetail.return1y))
      : 12;
  const monthlyRate = effectiveAnnualRate / 100 / 12;
  const totalMonths = sipYears * 12;
  let totalInvested = 0;
  let projectedValue = 0;
  for (let yr = 0; yr < sipYears; yr++) {
    const curMonthly = monthlySip * Math.pow(1 + sipStepUpPct / 100, yr);
    for (let m = 0; m < 12; m++) {
      totalInvested += curMonthly;
      projectedValue = (projectedValue + curMonthly) * (1 + monthlyRate);
    }
  }
  totalInvested = Math.round(totalInvested);

  const handleTrackSip = () => {
    const target = fundDetail || activeFund;
    if (!target) return;
    setSipPlans((prev) => [
      {
        id: `${Date.now()}`,
        schemeCode: target.schemeCode,
        schemeName: target.schemeName,
        monthlyAmount: monthlySip,
        startNav: target.nav,
        monthsActive: 1,
      },
      ...prev,
    ]);
    setActiveTab('monitoring');
  };

  const MODULE_CARDS: Array<ModuleCardSpec<MfTab>> = [
    {
      id: 'database',
      code: 'A',
      title: 'Fund Database',
      subtitle: `${funds.length || 23} AMFI Equity, Debt, Hybrid, Index & Sectoral`,
      Icon: Database,
      cardBg: MODULE_THEMES[0].cardBg,
      iconBg: MODULE_THEMES[0].iconBg,
      arrowText: MODULE_THEMES[0].arrowText,
    },
    {
      id: 'official',
      code: 'B',
      title: 'Official Sources',
      subtitle: 'AMFI India, SEBI, AMC portals, Factsheets & NAV',
      Icon: Globe,
      cardBg: MODULE_THEMES[1].cardBg,
      iconBg: MODULE_THEMES[1].iconBg,
      arrowText: MODULE_THEMES[1].arrowText,
    },
    {
      id: 'analysis',
      code: 'C',
      title: 'Fund Analysis AI',
      subtitle: 'Auto-Sync Returns, TER, Manager, Risk & Benchmark',
      Icon: Sparkles,
      cardBg: MODULE_THEMES[2].cardBg,
      iconBg: MODULE_THEMES[2].iconBg,
      arrowText: MODULE_THEMES[2].arrowText,
    },
    {
      id: 'expert',
      code: 'D',
      title: 'Expert AI',
      subtitle: 'Verified research, SEBI RIA opinions & tracking',
      Icon: ShieldCheck,
      cardBg: MODULE_THEMES[3].cardBg,
      iconBg: MODULE_THEMES[3].iconBg,
      arrowText: MODULE_THEMES[3].arrowText,
    },
    {
      id: 'monitoring',
      code: 'E',
      title: 'Monitoring',
      subtitle: 'Daily NAVs, SIP tracker & portfolio insights',
      Icon: Bell,
      cardBg: MODULE_THEMES[4].cardBg,
      iconBg: MODULE_THEMES[4].iconBg,
      arrowText: MODULE_THEMES[4].arrowText,
    },
  ];

  const officialSources: OfficialSourceLink[] = [
    {
      title: 'AMFI India — Official Mutual Funds Portal',
      category: 'AMFI India',
      description: 'Association of Mutual Funds in India daily NAV files, AUM disclosures, and TER notices.',
      url: 'https://www.amfiindia.com/net-asset-value',
    },
    {
      title: 'SEBI Mutual Funds Regulatory Section',
      category: 'SEBI',
      description: 'SEBI circulars, categorization rules, KIM/SID filings, and registered RIA directories.',
      url: 'https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=1&ssid=6&smid=0',
    },
    {
      title: `${activeFund?.fundHouse || 'AMC'} Official Website`,
      category: 'AMC Website',
      description: `Direct AMC portal for ${activeFund?.schemeName || 'selected scheme'} SID, KIM & portfolio disclosures.`,
      url: activeFund?.amcUrl || 'https://www.amfiindia.com/',
    },
    {
      title: 'Monthly Fund Factsheets & Portfolio',
      category: 'Fund Factsheets',
      description: `Download official monthly equity/debt holding disclosures and manager commentary.`,
      url: activeFund?.factsheetUrl || 'https://www.amfiindia.com/research-information/other-data/mf-scheme-performance-details',
    },
    {
      title: 'Daily AMFI NAV Disclosures Archive',
      category: 'NAV Disclosures',
      description: 'Official historical and daily NAV archive for all Direct & Regular Indian MF schemes.',
      url: 'https://www.amfiindia.com/nav-history-download',
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardModuleGrid
        num="02"
        title="Mutual Funds"
        description="Live official AMFI Direct-Growth NAVs across Equity, Debt, Hybrid, Index, and Sectoral categories with inflow momentum, Auto-Sync AI, and SIP monitoring."
        marketStatus={marketStatus}
        syncedAt={syncedAt}
        isSyncing={loading}
        onSync={() => loadFunds(true)}
        onBack={onBack}
        modules={MODULE_CARDS}
        activeModule={activeTab}
        onSelectModule={setActiveTab}
      />

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          {error}
        </div>
      )}

      {/* MODULE A: FUND DATABASE (Min 20 Mutual Funds across 5 categories + Best 20 Futuristic) */}
      {activeTab === 'database' && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDatabaseView('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  databaseView === 'all'
                    ? 'bg-[#0D9488] text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                All AMFI Funds ({funds.length})
              </button>
              <button
                type="button"
                onClick={() => setDatabaseView('futuristic')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  databaseView === 'futuristic'
                    ? 'bg-[#0D9488] text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Best 20 Futuristic + Early News
              </button>
            </div>
            <span className="text-xs text-slate-500">
              {databaseView === 'futuristic'
                ? '20 futuristic Direct-Growth mutual funds updated with early AMFI & market news'
                : 'Equity, Debt, Hybrid, Index & Sectoral Direct Growth schemes'}
            </span>
          </div>

          {databaseView === 'futuristic' ? (
            <FuturisticTop20
              dashboardId="mutual-funds"
              dashboardTitle="Mutual Funds"
              compactHeader
              onOpenChart={(item) => {
                if (item.schemeCode) {
                  setSelectedCode(item.schemeCode);
                  setActiveTab('analysis');
                }
              }}
              onAnalyzeItem={(item) => {
                if (item.schemeCode) {
                  setSelectedCode(item.schemeCode);
                }
                setActiveTab('analysis');
              }}
            />
          ) : (
            <>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFlowFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      flowFilter === 'all'
                        ? 'bg-[#0D9488] text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All Inflow / Flow ({funds.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlowFilter('buying')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      flowFilter === 'buying'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    High Buying Inflow ({buyingCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlowFilter('selling')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      flowFilter === 'selling'
                        ? 'bg-rose-600 text-white'
                        : 'bg-white border border-slate-200 text-rose-600 hover:bg-rose-50'
                    }`}
                  >
                    Redemption / Selling ({sellingCount})
                  </button>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {(['All', 'Equity', 'Debt', 'Hybrid', 'Index', 'Sectoral'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setBroadFilter(cat)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                          broadFilter === cat
                            ? 'bg-slate-900 text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {cat === 'All' ? `All (${funds.length})` : `${cat} Funds`}
                      </button>
                    ))}
                  </div>

                  {/* Unified filter & global AMFI search across 14,000+ schemes */}
                  <div className="relative w-full lg:w-[380px]">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={amfiQuery}
                      onChange={(e) => setAmfiQuery(e.target.value)}
                      placeholder="Filter funds or search any AMFI scheme..."
                      className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0D9488] focus:outline-none"
                    />
                    {amfiQuery.trim().length >= 2 && (
                      <div className="absolute left-0 right-0 top-full z-20 mt-1.5 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                        <div className="border-b border-slate-100 px-4 py-2 text-xs text-slate-500 flex justify-between">
                          <span>Global AMFI Scheme Directory</span>
                          {searching && <span>Searching...</span>}
                        </div>
                        <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                          {searchResults.length === 0 && !searching ? (
                            <div className="px-4 py-3 text-xs text-slate-500">No external AMFI schemes found.</div>
                          ) : (
                            searchResults.map((hit) => (
                              <button
                                key={hit.schemeCode}
                                type="button"
                                onClick={() => {
                                  setSelectedCode(hit.schemeCode);
                                  setAmfiQuery('');
                                  setSearchResults([]);
                                  setActiveTab('analysis');
                                }}
                                className="w-full px-4 py-2.5 text-left text-xs text-slate-800 hover:bg-slate-50 cursor-pointer"
                              >
                                <div className="font-semibold truncate">{hit.schemeName}</div>
                                <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                                  AMFI Code #{hit.schemeCode}
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                        <th className="py-3 pl-5 pr-3">Scheme Name</th>
                        <th className="py-3 px-3">Type</th>
                        <th className="py-3 px-3 text-right">NAV</th>
                        <th className="py-3 px-3 text-right">TER %</th>
                        <th className="py-3 px-3 text-right">1M</th>
                        <th className="py-3 px-3 text-right">1Y</th>
                        <th className="py-3 px-3 text-right hidden md:table-cell">3Y</th>
                        <th className="py-3 pl-3 pr-5 text-right hidden sm:table-cell">30D Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {loading && funds.length === 0 ? (
                        Array.from({ length: 10 }).map((_, i) => (
                          <tr key={i}>
                            <td colSpan={8} className="px-5 py-3">
                              <div className="h-5 rounded bg-slate-100 animate-pulse" />
                            </td>
                          </tr>
                        ))
                      ) : filteredFunds.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-10 text-center text-sm text-slate-500">
                            No mutual funds match the selected filter.
                          </td>
                        </tr>
                      ) : (
                        filteredFunds.map((f) => {
                          const isSelected = f.schemeCode === selectedCode;
                          return (
                            <tr
                              key={f.schemeCode}
                              onClick={() => {
                                setSelectedCode(f.schemeCode);
                                setActiveTab('analysis');
                              }}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? 'bg-[#F0FDFA]' : 'hover:bg-slate-50'
                              }`}
                            >
                              <td className="py-3 pl-5 pr-3">
                                <div className="font-semibold text-slate-900 truncate max-w-[280px]">
                                  {f.schemeName}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {f.fundHouse} · {f.category}
                                  {f.orderFlowLabel && (
                                    <span
                                      className={`ml-1.5 font-semibold ${
                                        f.orderFlowType === 'buying'
                                          ? 'text-emerald-700'
                                          : f.orderFlowType === 'selling'
                                            ? 'text-rose-600'
                                            : 'text-slate-500'
                                      }`}
                                    >
                                      · {f.orderFlowLabel}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-3 text-xs font-medium text-slate-700 whitespace-nowrap">
                                {f.broadCategory}
                              </td>
                              <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">
                                {formatINR(f.nav, 2)}
                              </td>
                              <td className="py-3 px-3 text-right font-mono tabular-nums text-xs text-slate-600 whitespace-nowrap">
                                {f.expenseRatio.toFixed(2)}%
                              </td>
                              <td
                                className={`py-3 px-3 text-right font-mono tabular-nums whitespace-nowrap ${
                                  (f.return1m ?? 0) >= 0 ? 'text-emerald-700' : 'text-rose-600'
                                }`}
                              >
                                {formatSignedPercent(f.return1m)}
                              </td>
                              <td
                                className={`py-3 px-3 text-right font-mono tabular-nums font-semibold whitespace-nowrap ${
                                  (f.return1y ?? 0) >= 0 ? 'text-emerald-700' : 'text-rose-600'
                                }`}
                              >
                                {formatSignedPercent(f.return1y)}
                              </td>
                              <td
                                className={`py-3 px-3 text-right font-mono tabular-nums hidden md:table-cell whitespace-nowrap ${
                                  (f.return3y ?? 0) >= 0 ? 'text-emerald-700' : 'text-rose-600'
                                }`}
                              >
                                {formatSignedPercent(f.return3y)}
                              </td>
                              <td className="py-3 pl-3 pr-5 text-right hidden sm:table-cell">
                                <div className="inline-flex justify-end">
                                  <Sparkline
                                    values={f.sparkline}
                                    positive={(f.return1m ?? 0) >= 0}
                                    width={72}
                                    height={22}
                                  />
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
            </>
          )}
        </section>
      )}

      {/* MODULE B: OFFICIAL SOURCES */}
      {activeTab === 'official' && (
        <OfficialSourcesGrid
          title="Official Mutual Funds Regulatory & AMC Directory"
          subtitle="Verified direct links to AMFI India, SEBI, AMC official websites, monthly factsheets, and daily NAV disclosures"
          sources={officialSources}
        />
      )}

      {/* MODULE C: FUND ANALYSIS AI (Live Chart + Metrics + SIP Calculator + Gemini Search AI) */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-500">
                    {fundDetail?.fundHouse || 'AMFI Scheme'} · {fundDetail?.broadCategory || 'Mutual Fund'} · Benchmark: {fundDetail?.benchmark || 'NIFTY 500 TRI'}
                  </div>
                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    {fundDetail?.schemeName || 'Loading scheme...'}
                  </h2>
                </div>
                {fundDetail && (
                  <div className="text-right font-mono tabular-nums">
                    <div className="text-2xl font-bold text-slate-900">
                      {formatINR(fundDetail.nav, 4)}
                    </div>
                    <div className="text-xs text-slate-500">NAV as of {fundDetail.navDate}</div>
                  </div>
                )}
              </div>

              <PriceChart
                points={fundDetail?.points || []}
                range="1y"
                height={240}
                loading={detailLoading}
              />

              {fundDetail && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 pt-4 border-t border-slate-200">
                  <div>
                    <div className="text-xs text-slate-500">1M / 6M Return</div>
                    <div className="mt-1 text-xs font-bold font-mono tabular-nums text-slate-900">
                      {formatSignedPercent(fundDetail.return1m)} / {formatSignedPercent(fundDetail.return6m)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">1Y / 3Y Return</div>
                    <div className="mt-1 text-xs font-bold font-mono tabular-nums text-emerald-700">
                      {formatSignedPercent(fundDetail.return1y)} / {formatSignedPercent(fundDetail.return3y)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Expense Ratio</div>
                    <div className="mt-1 text-sm font-bold font-mono tabular-nums text-slate-900">
                      {fundDetail.expenseRatio}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Annual Volatility</div>
                    <div className="mt-1 text-sm font-bold font-mono tabular-nums text-slate-900">
                      {fundDetail.volatilityPct ? `${fundDetail.volatilityPct}%` : '—'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Fund Manager</div>
                    <div className="mt-1 text-xs font-semibold text-slate-900 truncate">
                      {fundDetail.fundManager}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Riskometer</div>
                    <div className="mt-1 text-xs font-semibold text-slate-900">
                      {fundDetail.riskRating}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">SIP Projection &amp; Tracker</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Anchored to 1Y return ({effectiveAnnualRate.toFixed(1)}% p.a.)
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-600">Monthly SIP</span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900">
                      {formatINR(monthlySip, 0)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1000}
                    max={100000}
                    step={1000}
                    value={monthlySip}
                    onChange={(e) => setMonthlySip(Number(e.target.value))}
                    className="w-full accent-[#0D9488] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-600">Horizon</span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900">
                      {sipYears} Years
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    step={1}
                    value={sipYears}
                    onChange={(e) => setSipYears(Number(e.target.value))}
                    className="w-full accent-[#0D9488] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-600">Annual Step-Up</span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900">
                      {sipStepUpPct}% / yr
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[0, 5, 10, 15].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setSipStepUpPct(pct)}
                        className={`rounded-lg py-1.5 text-xs font-mono font-semibold cursor-pointer ${
                          sipStepUpPct === pct
                            ? 'bg-[#0D9488] text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200 space-y-3 font-mono tabular-nums">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Total Invested</span>
                  <span className="text-slate-800 font-medium">{formatINR(totalInvested, 0)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-800">Estimated Value</span>
                  <span className="text-emerald-700">{formatINR(Math.round(projectedValue), 0)}</span>
                </div>
                <button
                  type="button"
                  onClick={handleTrackSip}
                  className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-sans font-semibold text-white hover:bg-slate-800 cursor-pointer"
                >
                  Save SIP to Monitor
                </button>
              </div>
            </div>
          </div>

          <StructuredDashboardAI
            dashboardType="mutual-funds"
            title="C. Fund Analysis AI"
            description="Historical returns, expense ratios, portfolio holdings, manager track record, risk metrics & benchmark comparison"
            focusLabel={fundDetail?.schemeName || activeFund?.schemeName || 'Indian Mutual Funds'}
            syncedAt={syncedAt}
            liveContext={
              fundDetail
                ? {
                    nav: fundDetail.nav,
                    return1y: fundDetail.return1y,
                    return3y: fundDetail.return3y,
                    expenseRatio: fundDetail.expenseRatio,
                    benchmark: fundDetail.benchmark,
                    volatilityPct: fundDetail.volatilityPct,
                  }
                : undefined
            }
            mode="analysis"
          />
        </div>
      )}

      {/* MODULE D: EXPERT AI */}
      {activeTab === 'expert' && (
        <StructuredDashboardAI
          dashboardType="mutual-funds"
          title="D. Mutual Funds Expert AI"
          description="Verified fund research, SEBI-registered adviser opinions, and longitudinal performance verification"
          focusLabel={fundDetail?.schemeName || activeFund?.schemeName || 'AMFI Direct Growth Funds'}
          syncedAt={syncedAt}
          liveContext={
            fundDetail
              ? { nav: fundDetail.nav, return1y: fundDetail.return1y, benchmark: fundDetail.benchmark }
              : undefined
          }
          mode="expert"
        />
      )}

      {/* MODULE E: MONITORING (Daily NAV Updates, SIP Monitor, Portfolio Changes & Monthly Report) */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          {/* Active SIP Plans Saved Locally */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900">Active SIP &amp; Portfolio Monitor</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automatically re-valued against live AMFI NAVs on every sync
                </p>
              </div>
            </div>

            {sipPlans.length === 0 ? (
              <p className="text-xs text-slate-500 py-3">
                No SIPs tracked yet. Open any scheme in <strong>Fund Analysis AI</strong> and click <strong>Save SIP to Monitor</strong>.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {sipPlans.map((plan) => {
                  const live = funds.find((f) => f.schemeCode === plan.schemeCode);
                  const currentNav = live?.nav ?? plan.startNav;
                  const navDiffPct =
                    plan.startNav > 0 ? ((currentNav - plan.startNav) / plan.startNav) * 100 : 0;
                  return (
                    <div key={plan.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs">
                      <div>
                        <div className="font-semibold text-slate-900">{plan.schemeName}</div>
                        <div className="text-slate-500 font-mono tabular-nums mt-0.5">
                          SIP: {formatINR(plan.monthlyAmount, 0)}/mo · Entry NAV: ₹{plan.startNav} · Live NAV: ₹{currentNav} ({formatSignedPercent(Number(navDiffPct.toFixed(2)))})
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSipPlans((prev) => prev.filter((p) => p.id !== plan.id))}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        aria-label="Remove SIP plan"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <DashboardMonitoringPanel
            dashboardId="mutual-funds"
            dashboardTitle="Mutual Funds"
            sessionTitle="Daily AMFI NAV & SIP Session Monitor"
            sessionHours="AMFI Daily NAV Declaration (09:00 PM – 11:00 PM IST)"
            alertTitle="NAV Change Alerts"
            instruments={funds.map((f) => ({
              symbol: f.schemeCode,
              ticker: f.schemeName.split(' - ')[0],
              price: f.nav,
            }))}
            extraNotes={[
              { label: 'Tracked Schemes', value: `${funds.length} AMFI` },
              { label: 'Tracked SIPs', value: `${sipPlans.length} Active` },
            ]}
          />
        </div>
      )}
    </div>
  );
};
