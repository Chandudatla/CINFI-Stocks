import React from 'react';
import { Lock, Mail, Menu, RefreshCw } from 'lucide-react';
import { DashboardId, MarketStatus } from '../types/market';

interface HeaderProps {
  activeDashboard: DashboardId | null;
  mailAlertsActive?: boolean;
  marketStatus?: MarketStatus | null;
  onGoHome: () => void;
  onOpenMailAlerts: () => void;
  onOpenDashboard: (id: DashboardId) => void;
  onSyncLive: () => void;
  onOpenSidebar: () => void;
  isSyncing: boolean;
}

const TOP_NAV_LINKS: Array<{ id: DashboardId; label: string }> = [
  { id: 'stocks', label: 'Stocks' },
  { id: 'mutual-funds', label: 'Mutual Funds' },
  { id: 'intraday', label: 'Intraday' },
  { id: 'fno', label: 'F&O' },
  { id: 'ipo', label: 'IPO' },
];

const DASHBOARD_LABELS: Record<DashboardId, string> = {
  stocks: '01. Stocks',
  'mutual-funds': '02. Mutual Funds',
  intraday: '03. Intraday',
  fno: '04. Futures & Options',
  etfs: '05. ETFs',
  ipo: '06. IPO',
  gold: '07. Gold',
  silver: '08. Silver',
  bonds: '09. Bonds',
  commodities: '10. Commodities',
};

export const Header: React.FC<HeaderProps> = ({
  activeDashboard,
  mailAlertsActive = false,
  marketStatus,
  onGoHome,
  onOpenMailAlerts,
  onOpenDashboard,
  onSyncLive,
  onOpenSidebar,
  isSyncing,
}) => {
  const isSecondaryActive =
    !mailAlertsActive &&
    activeDashboard !== null &&
    !TOP_NAV_LINKS.some((link) => link.id === activeDashboard);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-[#0B1D26] text-white">
      <div className="mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Open navigation menu"
            className="lg:hidden p-1.5 -ml-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onGoHome}
            className="text-left text-base sm:text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded"
          >
            CINFI Stocks
          </button>
        </div>

        {/* Single-line Top Navigation Links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-5 lg:gap-6 text-sm min-w-0">
          <button
            type="button"
            onClick={onGoHome}
            className={`relative py-1 font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none ${
              activeDashboard === null && !mailAlertsActive
                ? 'text-teal-300 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            CINFI Home
          </button>

          {TOP_NAV_LINKS.map((item) => {
            const isActive = activeDashboard === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpenDashboard(item.id)}
                className={`relative py-1 font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none ${
                  isActive
                    ? 'text-teal-300 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {isSecondaryActive && activeDashboard && (
            <span className="hidden xl:inline-flex items-center gap-2 text-xs font-semibold text-teal-300 whitespace-nowrap shrink-0">
              <span className="text-slate-600" aria-hidden="true">/</span>
              <span>{DASHBOARD_LABELS[activeDashboard]}</span>
            </span>
          )}
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          {marketStatus && (
            <div className="hidden xl:flex items-center gap-2 text-xs font-mono tabular-nums text-slate-300 whitespace-nowrap">
              <span
                className={`h-2 w-2 rounded-full ${
                  marketStatus.isLive ? 'bg-emerald-400' : 'bg-teal-400/70'
                }`}
                aria-hidden="true"
              />
              <span>{marketStatus.statusLabel}</span>
            </div>
          )}

          <button
            type="button"
            onClick={onOpenMailAlerts}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 sm:px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mailAlertsActive
                ? 'border-teal-400 bg-teal-950/60 text-teal-300'
                : 'border-slate-700 bg-slate-900/50 text-slate-200 hover:border-teal-400 hover:text-white'
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Mail Alerts</span>
            <Lock className="h-3 w-3 opacity-80" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onSyncLive}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-[#0D9488] px-3.5 sm:px-4 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-[#0F766E] disabled:opacity-60 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing' : 'Sync Live'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
