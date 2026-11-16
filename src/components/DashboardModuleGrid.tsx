import React from 'react';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import { MarketStatus } from '../types/market';

export interface ModuleCardSpec<T extends string = string> {
  id: T;
  code: string;
  title: string;
  subtitle: string;
  Icon: React.ComponentType<{ className?: string }>;
  cardBg: string;
  iconBg: string;
  arrowText: string;
}

export const MODULE_THEMES = [
  {
    cardBg: 'bg-[#EFF6FF] border-[#DBEAFE] hover:border-[#93C5FD]',
    activeBorder: 'ring-2 ring-[#0284C7] border-[#0284C7]',
    iconBg: 'bg-[#0284C7]',
    arrowText: 'text-[#0284C7]',
  },
  {
    cardBg: 'bg-[#ECFDF5] border-[#D1FAE5] hover:border-[#6EE7B7]',
    activeBorder: 'ring-2 ring-[#0D9488] border-[#0D9488]',
    iconBg: 'bg-[#0D9488]',
    arrowText: 'text-[#0D9488]',
  },
  {
    cardBg: 'bg-[#FFF1F2] border-[#FFE4E6] hover:border-[#FDA4AF]',
    activeBorder: 'ring-2 ring-[#E11D48] border-[#E11D48]',
    iconBg: 'bg-[#E11D48]',
    arrowText: 'text-[#E11D48]',
  },
  {
    cardBg: 'bg-[#EEF2FF] border-[#E0E7FF] hover:border-[#A5B4FC]',
    activeBorder: 'ring-2 ring-[#4F46E5] border-[#4F46E5]',
    iconBg: 'bg-[#4F46E5]',
    arrowText: 'text-[#4F46E5]',
  },
  {
    cardBg: 'bg-[#FFFBEB] border-[#FEF3C7] hover:border-[#FCD34D]',
    activeBorder: 'ring-2 ring-[#D97706] border-[#D97706]',
    iconBg: 'bg-[#D97706]',
    arrowText: 'text-[#D97706]',
  },
  {
    cardBg: 'bg-[#F5F3FF] border-[#EDE9FE] hover:border-[#C4B5FD]',
    activeBorder: 'ring-2 ring-[#7C3AED] border-[#7C3AED]',
    iconBg: 'bg-[#7C3AED]',
    arrowText: 'text-[#7C3AED]',
  },
];

interface DashboardModuleGridProps<T extends string> {
  num: string;
  title: string;
  description: string;
  marketStatus: MarketStatus | null;
  syncedAt?: string | null;
  isSyncing?: boolean;
  onSync: () => void;
  onBack: () => void;
  modules: Array<ModuleCardSpec<T>>;
  activeModule: T;
  onSelectModule: (id: T) => void;
}

export function DashboardModuleGrid<T extends string>({
  num,
  title,
  description,
  marketStatus,
  syncedAt,
  isSyncing = false,
  onSync,
  onBack,
  modules,
  activeModule,
  onSelectModule,
}: DashboardModuleGridProps<T>) {
  const syncedLabel = syncedAt
    ? new Date(syncedAt).toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
    : null;

  const gridColsClass =
    modules.length === 5
      ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
      : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <div className="space-y-6">
      {/* Luminous Hero Card matching Home Page */}
      <section className="rounded-2xl sm:rounded-3xl border border-[#CDEBE6] bg-gradient-to-br from-[#EEF7FB] via-[#EBF9F7] to-[#F2FCFA] p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>CINFI Home</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5 text-[11px] sm:text-xs text-teal-900 font-mono tabular-nums">
            <span className={marketStatus?.isLive ? 'font-semibold text-emerald-700' : 'font-medium'}>
              {marketStatus?.statusLabel || 'Auto-Sync 30s'}
            </span>
            {syncedLabel && (
              <>
                <span aria-hidden="true">·</span>
                <span>Synced {syncedLabel} IST</span>
              </>
            )}
            <button
              type="button"
              onClick={onSync}
              disabled={isSyncing}
              aria-label={`Refresh ${title} live feed`}
              className="inline-flex items-center gap-1 text-[#0D9488] hover:text-[#0F766E] font-sans font-semibold disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-2 max-w-3xl">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 text-balance">
            {num}. {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {description}
          </p>
        </div>
      </section>

      {/* 2x2 Mobile / Auto-Adjusting Desktop Module Cards matching Home Hub */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
            Explore {title} Modules
          </h2>
          <p className="text-xs text-slate-500">
            Tap any module box to open live data, official filings, auto-sync AI research, and alerts
          </p>
        </div>

        <div className={`grid ${gridColsClass} gap-3 sm:gap-4`}>
          {modules.map((mod, idx) => {
            const Icon = mod.Icon;
            const active = activeModule === mod.id;
            const theme = MODULE_THEMES[idx % MODULE_THEMES.length];
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => onSelectModule(mod.id)}
                className={`group flex flex-col justify-between rounded-2xl border p-3.5 sm:p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer focus-visible:outline-none ${mod.cardBg} ${
                  active ? theme.activeBorder : ''
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl text-white shadow-xs ${mod.iconBg}`}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <span className="font-mono tabular-nums text-[11px] font-bold text-slate-500">
                      {mod.code}
                    </span>
                  </div>

                  <h3 className="mt-3 text-xs sm:text-sm font-bold tracking-tight text-slate-900 leading-snug">
                    {mod.title}
                  </h3>
                  <p className="mt-1 text-[11px] sm:text-xs text-slate-600 line-clamp-2">
                    {mod.subtitle}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-700">
                    {active ? 'Open' : 'Explore'}
                  </span>
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-xs transition-transform duration-200 group-hover:translate-x-0.5 ${mod.arrowText}`}
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
