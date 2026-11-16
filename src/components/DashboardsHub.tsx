import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Wallet,
  Activity,
  CandlestickChart,
  Layers,
  Building2,
  Coins,
  Gem,
  Landmark,
  Box,
  ArrowRight,
  Search,
} from 'lucide-react';
import { DashboardId, MarketStatus } from '../types/market';

interface DashboardsHubProps {
  marketStatus: MarketStatus | null;
  syncedAt?: string | null;
  onOpenDashboard: (id: DashboardId) => void;
}

interface DashboardCardSpec {
  id: DashboardId;
  num: string;
  title: string;
  subtitle: string;
  keywords: string;
  Icon: React.ComponentType<{ className?: string }>;
  cardBg: string;
  iconBg: string;
  arrowText: string;
}

const DASHBOARDS: DashboardCardSpec[] = [
  {
    id: 'stocks',
    num: '01',
    title: 'Stocks',
    subtitle: 'NSE/BSE benchmarks & movers',
    keywords: 'stocks equity nifty sensex shares',
    Icon: TrendingUp,
    cardBg: 'bg-[#EFF6FF] border-[#DBEAFE] hover:border-[#93C5FD]',
    iconBg: 'bg-[#0284C7]',
    arrowText: 'text-[#0284C7]',
  },
  {
    id: 'mutual-funds',
    num: '02',
    title: 'Mutual Funds',
    subtitle: 'Live AMFI NAVs & SIP returns',
    keywords: 'mutual funds sip amfi nav flexi small cap',
    Icon: Wallet,
    cardBg: 'bg-[#ECFDF5] border-[#D1FAE5] hover:border-[#6EE7B7]',
    iconBg: 'bg-[#0D9488]',
    arrowText: 'text-[#0D9488]',
  },
  {
    id: 'intraday',
    num: '03',
    title: 'Intraday',
    subtitle: '5m momentum & VWAP desk',
    keywords: 'intraday day trading vwap 5m momentum',
    Icon: Activity,
    cardBg: 'bg-[#FFF1F2] border-[#FFE4E6] hover:border-[#FDA4AF]',
    iconBg: 'bg-[#E11D48]',
    arrowText: 'text-[#E11D48]',
  },
  {
    id: 'fno',
    num: '04',
    title: 'Futures & Options',
    subtitle: 'India VIX & ATM expected range',
    keywords: 'futures options fno derivatives vix',
    Icon: CandlestickChart,
    cardBg: 'bg-[#EEF2FF] border-[#E0E7FF] hover:border-[#A5B4FC]',
    iconBg: 'bg-[#4F46E5]',
    arrowText: 'text-[#4F46E5]',
  },
  {
    id: 'etfs',
    num: '05',
    title: 'ETFs',
    subtitle: 'Index, sectoral & gold BeES',
    keywords: 'etfs bees passive index nasdaq',
    Icon: Layers,
    cardBg: 'bg-[#F0FDF4] border-[#DCFCE7] hover:border-[#86EFAC]',
    iconBg: 'bg-[#059669]',
    arrowText: 'text-[#059669]',
  },
  {
    id: 'ipo',
    num: '06',
    title: 'IPO',
    subtitle: 'Recent listings & IPO pipeline',
    keywords: 'ipo listings mainboard gmp primary market',
    Icon: Building2,
    cardBg: 'bg-[#FFFBEB] border-[#FEF3C7] hover:border-[#FCD34D]',
    iconBg: 'bg-[#D97706]',
    arrowText: 'text-[#D97706]',
  },
  {
    id: 'gold',
    num: '07',
    title: 'Gold',
    subtitle: '24K India parity & COMEX spot',
    keywords: 'gold 24k 22k bullion goldbees comex',
    Icon: Coins,
    cardBg: 'bg-[#FFF7ED] border-[#FFEDD5] hover:border-[#FDBA74]',
    iconBg: 'bg-[#EA580C]',
    arrowText: 'text-[#EA580C]',
  },
  {
    id: 'silver',
    num: '08',
    title: 'Silver',
    subtitle: 'INR/kg parity & Gold-Silver ratio',
    keywords: 'silver bullion industrial silverbees comex',
    Icon: Gem,
    cardBg: 'bg-[#ECFEFF] border-[#CFFAFE] hover:border-[#67E8F9]',
    iconBg: 'bg-[#0891B2]',
    arrowText: 'text-[#0891B2]',
  },
  {
    id: 'bonds',
    num: '09',
    title: 'Bonds',
    subtitle: 'G-Sec yields & debt ETFs',
    keywords: 'bonds gsec fixed income rbi yield debt',
    Icon: Landmark,
    cardBg: 'bg-[#F5F3FF] border-[#EDE9FE] hover:border-[#C4B5FD]',
    iconBg: 'bg-[#7C3AED]',
    arrowText: 'text-[#7C3AED]',
  },
  {
    id: 'commodities',
    num: '10',
    title: 'Commodities',
    subtitle: 'Crude oil, gas & industrial metals',
    keywords: 'commodities crude brent wti copper gas mcx',
    Icon: Box,
    cardBg: 'bg-[#F1F5F9] border-[#E2E8F0] hover:border-[#94A3B8]',
    iconBg: 'bg-[#334155]',
    arrowText: 'text-[#334155]',
  },
];

export const DashboardsHub: React.FC<DashboardsHubProps> = ({
  marketStatus,
  syncedAt,
  onOpenDashboard,
}) => {
  const [liveMetrics, setLiveMetrics] = useState<Record<string, string>>({});
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/hub-summary')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data?.metrics) {
          setLiveMetrics(data.metrics);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [syncedAt]);

  const trimmed = filterQuery.trim().toLowerCase();
  const visibleDashboards = trimmed
    ? DASHBOARDS.filter(
        (d) =>
          d.title.toLowerCase().includes(trimmed) ||
          d.subtitle.toLowerCase().includes(trimmed) ||
          d.keywords.includes(trimmed)
      )
    : DASHBOARDS;

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (visibleDashboards.length > 0 && trimmed.length > 0) {
      onOpenDashboard(visibleDashboards[0].id);
    }
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Luminous Hero Welcome Banner (Matches Desktop Reference Structure) */}
      <section className="rounded-2xl sm:rounded-3xl border border-[#CDEBE6] bg-gradient-to-br from-[#EEF7FB] via-[#EBF9F7] to-[#F2FCFA] p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs font-medium text-teal-800">
              <span>{marketStatus?.exchange || 'NSE & BSE India'}</span>
              <span aria-hidden="true">·</span>
              <span className={marketStatus?.isLive ? 'text-emerald-700 font-semibold' : ''}>
                {marketStatus?.statusLabel || 'Live Exchange Feed'}
              </span>
              {marketStatus?.istTime && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    {marketStatus.istDate} {marketStatus.istTime} IST
                  </span>
                </>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 text-balance leading-[1.12]">
              Welcome, <span className="text-[#0D9488]">Gangadhari Akhil</span>
            </h1>

            <p className="max-w-xl text-sm sm:text-base text-slate-600 leading-relaxed">
              Explore live Indian stocks, mutual funds, intraday momentum, F&amp;O, ETFs, IPOs, bullion, bonds, and commodities — all in one place.
            </p>

            <form
              onSubmit={handleHeroSubmit}
              className="mt-2 flex max-w-lg items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xs"
            >
              <Search className="ml-2.5 h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Jump to a dashboard (e.g. Gold, Mutual Funds, IPO, F&O)..."
                className="w-full bg-transparent px-2 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-[#0D9488] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0F766E] whitespace-nowrap shrink-0 cursor-pointer"
              >
                Open
              </button>
            </form>
          </div>

          {/* Crisp minimalist market desk graphic on desktop */}
          <div className="hidden lg:flex lg:col-span-4 justify-center" aria-hidden="true">
            <svg width="240" height="175" viewBox="0 0 240 175" fill="none">
              <circle cx="130" cy="88" r="76" fill="#D8F1EE" />
              <rect x="64" y="34" width="112" height="108" rx="14" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="2" />
              <rect x="82" y="96" width="14" height="28" rx="4" fill="#CBD5E1" />
              <rect x="104" y="80" width="14" height="44" rx="4" fill="#38BDF8" />
              <rect x="126" y="66" width="14" height="58" rx="4" fill="#0D9488" />
              <rect x="148" y="50" width="14" height="74" rx="4" fill="#0284C7" />
              <path
                d="M84 74L110 60L132 66L156 42"
                stroke="#0F172A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="156" cy="42" r="4" fill="#0D9488" />
            </svg>
          </div>
        </div>
      </section>

      {/* Section Header */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Explore Our Dashboards
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              10 independent AI desks — tap any box to launch live charts &amp; research
            </p>
          </div>
          {trimmed && (
            <button
              type="button"
              onClick={() => setFilterQuery('')}
              className="self-start sm:self-auto text-xs font-medium text-[#0D9488] hover:underline cursor-pointer"
            >
              Show all 10 dashboards
            </button>
          )}
        </div>

        {/* 2x2 on Mobile (grid-cols-2), auto-adjusts to 4 columns on Desktop (lg:grid-cols-4) */}
        {visibleDashboards.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            No dashboards match &ldquo;{filterQuery}&rdquo;.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {visibleDashboards.map((item) => {
              const Icon = item.Icon;
              const liveNote = liveMetrics[item.id];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onOpenDashboard(item.id)}
                  className={`group flex flex-col justify-between rounded-2xl border p-4 sm:p-6 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] ${item.cardBg}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl text-white shadow-xs ${item.iconBg}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-mono tabular-nums text-[11px] font-semibold text-slate-400">
                        {item.num}
                      </span>
                    </div>

                    <h3 className="mt-4 text-sm sm:text-base font-bold tracking-tight text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                      {liveNote || item.subtitle}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-xs transition-transform duration-200 group-hover:translate-x-0.5 ${item.arrowText}`}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
