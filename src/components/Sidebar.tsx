import React from 'react';
import {
  Home,
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
  Lock,
  Mail,
  X,
} from 'lucide-react';
import { DashboardId } from '../types/market';

interface SidebarProps {
  activeDashboard: DashboardId | null;
  mailAlertsActive?: boolean;
  onSelectHome: () => void;
  onSelectMailAlerts: () => void;
  onSelectDashboard: (id: DashboardId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const SIDEBAR_ITEMS: Array<{
  id: DashboardId;
  num: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'stocks', num: '01', label: 'Stocks', Icon: TrendingUp },
  { id: 'mutual-funds', num: '02', label: 'Mutual Funds', Icon: Wallet },
  { id: 'intraday', num: '03', label: 'Intraday', Icon: Activity },
  { id: 'fno', num: '04', label: 'Futures & Options', Icon: CandlestickChart },
  { id: 'etfs', num: '05', label: 'ETFs', Icon: Layers },
  { id: 'ipo', num: '06', label: 'IPO', Icon: Building2 },
  { id: 'gold', num: '07', label: 'Gold', Icon: Coins },
  { id: 'silver', num: '08', label: 'Silver', Icon: Gem },
  { id: 'bonds', num: '09', label: 'Bonds', Icon: Landmark },
  { id: 'commodities', num: '10', label: 'Commodities', Icon: Box },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeDashboard,
  mailAlertsActive = false,
  onSelectHome,
  onSelectMailAlerts,
  onSelectDashboard,
  mobileOpen,
  onCloseMobile,
}) => {
  const navContent = (
    <div className="flex h-full flex-col justify-between bg-white border-r border-slate-200 px-3 py-5">
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 tracking-wide">
            Workspace
          </div>
          <button
            type="button"
            onClick={() => {
              onSelectHome();
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeDashboard === null && !mailAlertsActive
                ? 'bg-[#F0FDFA] text-[#0D9488]'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Home className="h-4 w-4 shrink-0" />
            <span>CINFI Home</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectMailAlerts();
              onCloseMobile();
            }}
            className={`w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              mailAlertsActive
                ? 'bg-[#F0FDFA] text-[#0D9488]'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-3 min-w-0">
              <Mail className="h-4 w-4 shrink-0" />
              <span className="truncate">Mail Alerts</span>
            </span>
            <span className="inline-flex items-center gap-1 font-mono tabular-nums text-[11px] text-slate-400 shrink-0">
              <Lock className="h-3 w-3" aria-hidden="true" />
              24/7
            </span>
          </button>
        </div>

        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 tracking-wide">
            AI Dashboards
          </div>
          <nav aria-label="Dashboard directory" className="space-y-1">
            {SIDEBAR_ITEMS.map(({ id, num, label, Icon }) => {
              const isActive = activeDashboard === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    onSelectDashboard(id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#F0FDFA] text-[#0D9488] font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{label}</span>
                  </span>
                  <span className="font-mono tabular-nums text-[11px] text-slate-400 shrink-0">
                    {num}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-4 px-3">
        <div className="text-xs font-semibold text-slate-800 truncate">
          Gangadhari Akhil
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5">NSE &amp; BSE India</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop persistent sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-[61px] h-[calc(100vh-61px)] overflow-y-auto">
          {navContent}
        </div>
      </aside>

      {/* Mobile slide-over drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5 bg-[#0B1D26] text-white">
              <span className="text-sm font-bold tracking-tight">CINFI Stocks</span>
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close navigation menu"
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="h-[calc(100%-53px)]">{navContent}</div>
          </div>
        </div>
      )}
    </>
  );
};
