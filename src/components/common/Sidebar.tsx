import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Cpu, 
  Filter, 
  ArrowLeftRight, 
  LineChart, 
  Bookmark, 
  FileCheck, 
  BookOpen,
  BellRing,
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe2,
  Newspaper
} from 'lucide-react';
import { NavigationTab } from '../../types/stock';
import { FUTURE_THEMES } from '../../data/indianMarketData';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onSelectThemeFastFilter?: (themeId: string) => void;
  watchlistCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onSelectThemeFastFilter,
  watchlistCount = 0
}) => {
  const navItems: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Market Dashboard', icon: LayoutDashboard },
    { id: 'stocks', label: 'Stocks Intelligence', icon: TrendingUp },
    { id: 'news', label: 'News & Social Wire', icon: Newspaper, badge: 'Live 24/7' },
    { id: 'themes', label: 'Future Themes', icon: Cpu, badge: '30+ Themes' },
    { id: 'screener', label: 'Universal Screener', icon: Filter },
    { id: 'compare', label: 'Stock Compare', icon: ArrowLeftRight },
    { id: 'backtest', label: 'Strategy Backtest', icon: LineChart, badge: 'Quant' },
    { id: 'watchlist', label: 'My Watchlist', icon: Bookmark, badge: watchlistCount > 0 ? `${watchlistCount}` : undefined },
    { id: 'alerts', label: 'Smart Alerts', icon: BellRing, badge: 'Live' },
    { id: 'evidence', label: 'Evidence & Sources', icon: FileCheck },
    { id: 'learn', label: 'Financial Guide', icon: BookOpen },
  ];

  return (
    <aside id="sidebar-navigation" className="w-64 bg-slate-900/95 border-r border-slate-800 shrink-0 hidden lg:flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 select-none overflow-y-auto">
      {/* Top Primary Navigation */}
      <div className="p-4 space-y-6">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
            Intelligence Navigation
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 shadow-sm shadow-cyan-950/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">
                      {item.badge}
                    </span>
                  ) : isActive ? (
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Future Economy Quick Radar */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2 flex items-center justify-between">
            <span>Future Economy Themes</span>
            <Zap className="w-3 h-3 text-amber-400" />
          </div>
          <div className="space-y-1">
            {FUTURE_THEMES.slice(0, 5).map((theme) => (
              <button
                key={theme.id}
                id={`sidebar-theme-${theme.id}`}
                onClick={() => {
                  if (onSelectThemeFastFilter) onSelectThemeFastFilter(theme.id);
                  onSelectTab('themes');
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-cyan-300 hover:bg-slate-800/50 transition-colors flex items-center justify-between truncate group"
              >
                <span className="truncate pr-2">{theme.name.split('&')[0]}</span>
                <span className="text-[10px] text-slate-500 group-hover:text-cyan-400 font-mono">
                  {theme.stockCount}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Status Card */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="rounded-xl p-3 bg-slate-950/90 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Anti-Hallucination Core</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            All AI insights require direct citation from Tier 1 audited filings and verified BSE/NSE feeds.
          </p>
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60 font-mono">
            <span>Engine: v1.4-IND</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 99.8% Conf.
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
