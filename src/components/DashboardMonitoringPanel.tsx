import React, { useEffect, useState } from 'react';
import { Bell, ExternalLink, Newspaper, Trash2 } from 'lucide-react';
import { DashboardId, NewsArticle, PriceAlert } from '../types/market';
import { fetchJson } from '../utils/safeFetch';

export interface MonitorMetricItem {
  symbol: string;
  ticker: string;
  price: number;
}

interface DashboardMonitoringPanelProps {
  dashboardId: DashboardId;
  dashboardTitle: string;
  sessionTitle: string;
  sessionHours: string;
  alertTitle?: string;
  instruments: MonitorMetricItem[];
  extraNotes?: Array<{ label: string; value: string }>;
}

export const DashboardMonitoringPanel: React.FC<DashboardMonitoringPanelProps> = ({
  dashboardId,
  dashboardTitle,
  sessionTitle,
  sessionHours,
  alertTitle = 'Live Price & Threshold Alerts',
  instruments,
  extraNotes = [],
}) => {
  const storageKey = `cinfi_alerts_${dashboardId}_v1`;
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [alertSymbol, setAlertSymbol] = useState<string>(instruments[0]?.symbol || '');
  const [alertCondition, setAlertCondition] = useState<'above' | 'below'>('above');
  const [alertPrice, setAlertPrice] = useState<string>('');

  const [newsQuery, setNewsQuery] = useState('');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    if (instruments.length > 0 && !instruments.some((i) => i.symbol === alertSymbol)) {
      setAlertSymbol(instruments[0].symbol);
    }
  }, [instruments, alertSymbol]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(alerts));
    } catch {
      // Ignore storage errors
    }
  }, [alerts, storageKey]);

  // Evaluate active alerts whenever live instrument prices update
  useEffect(() => {
    if (instruments.length === 0 || alerts.length === 0) return;
    setAlerts((prev) => {
      let changed = false;
      const next = prev.map((al) => {
        if (al.triggeredAt) return al;
        const found = instruments.find((i) => i.symbol === al.symbol);
        if (!found) return al;
        const hit =
          (al.condition === 'above' && found.price >= al.targetPrice) ||
          (al.condition === 'below' && found.price <= al.targetPrice);
        if (hit) {
          changed = true;
          return { ...al, triggeredAt: new Date().toISOString() };
        }
        return al;
      });
      return changed ? next : prev;
    });
  }, [instruments]);

  const fetchNews = async (q = newsQuery) => {
    setNewsLoading(true);
    try {
      const params = new URLSearchParams({ dashboard: dashboardId });
      if (q.trim()) params.set('q', q.trim());
      const data = await fetchJson<{ articles?: NewsArticle[] }>(`/api/news?${params.toString()}`);
      setArticles(Array.isArray(data.articles) ? data.articles : []);
    } catch {
      setArticles([]);
    } finally {
      setNewsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews('');
  }, [dashboardId]);

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(alertPrice);
    if (Number.isNaN(num) || num <= 0) return;
    const item = instruments.find((i) => i.symbol === alertSymbol);
    if (!item) return;

    const triggeredNow =
      (alertCondition === 'above' && item.price >= num) ||
      (alertCondition === 'below' && item.price <= num);

    setAlerts((prev) => [
      {
        id: `${Date.now()}`,
        symbol: item.symbol,
        ticker: item.ticker,
        condition: alertCondition,
        targetPrice: num,
        createdAt: new Date().toISOString(),
        triggeredAt: triggeredNow ? new Date().toISOString() : undefined,
      },
      ...prev,
    ]);
    setAlertPrice('');
  };

  const triggeredCount = alerts.filter((a) => Boolean(a.triggeredAt)).length;

  return (
    <div className="space-y-6">
      {triggeredCount > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs sm:text-sm text-amber-900">
          <Bell className="h-4 w-4 text-amber-700 shrink-0" />
          <span>
            <strong>{triggeredCount} Alert(s) Triggered</strong> in {dashboardTitle} live monitor.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Live Session Monitor */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">{sessionTitle}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Auto-refreshing every 30s · {sessionHours}
              </p>
            </div>
            <span className="text-xs font-semibold text-[#0F766E]">
              24x7 Automated Alerts &amp; News Stream
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <div className="text-xs text-slate-500">Tracked Instruments</div>
              <div className="mt-1 text-lg font-bold font-mono tabular-nums text-slate-900">
                {instruments.length}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <div className="text-xs text-slate-500">Active Alerts</div>
              <div className="mt-1 text-lg font-bold font-mono tabular-nums text-emerald-700">
                {alerts.filter((a) => !a.triggeredAt).length}
              </div>
            </div>
            {extraNotes.map((n) => (
              <div key={n.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <div className="text-xs text-slate-500">{n.label}</div>
                <div className="mt-1 text-sm font-bold font-mono tabular-nums text-slate-900 truncate">
                  {n.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Local Alert Builder (Zero external DB required) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">{alertTitle}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Saved locally and checked on every live sync
            </p>
          </div>

          {instruments.length > 0 ? (
            <form onSubmit={handleAddAlert} className="grid grid-cols-12 gap-2">
              <select
                value={alertSymbol}
                onChange={(e) => setAlertSymbol(e.target.value)}
                aria-label="Select instrument for alert"
                className="col-span-5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-900"
              >
                {instruments.map((inst) => (
                  <option key={inst.symbol} value={inst.symbol}>
                    {inst.ticker}
                  </option>
                ))}
              </select>
              <select
                value={alertCondition}
                onChange={(e) => setAlertCondition(e.target.value as 'above' | 'below')}
                aria-label="Alert condition"
                className="col-span-3 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-xs font-medium text-slate-800"
              >
                <option value="above">Above</option>
                <option value="below">Below</option>
              </select>
              <input
                type="number"
                step="0.01"
                value={alertPrice}
                onChange={(e) => setAlertPrice(e.target.value)}
                placeholder="Target"
                className="col-span-4 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-mono text-slate-900 focus:border-[#0D9488] focus:outline-none"
              />
              <button
                type="submit"
                className="col-span-12 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
              >
                Create Alert
              </button>
            </form>
          ) : (
            <p className="text-xs text-slate-500">Loading instruments for alerts...</p>
          )}

          {alerts.length > 0 && (
            <div className="divide-y divide-slate-100 max-h-36 overflow-y-auto">
              {alerts.map((al) => (
                <div key={al.id} className="flex items-center justify-between py-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{al.ticker}</span>{' '}
                    <span className="text-slate-600 font-mono tabular-nums">
                      {al.condition} {al.targetPrice}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${al.triggeredAt ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {al.triggeredAt ? 'Triggered' : 'Active'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAlerts((prev) => prev.filter((x) => x.id !== al.id))}
                      aria-label="Delete alert"
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 24/7 Live RSS News Stream */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-[#0D9488]" />
            <h2 className="text-base font-bold text-slate-900">
              24/7 Live {dashboardTitle} News Monitor
            </h2>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchNews(newsQuery);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={newsQuery}
              onChange={(e) => setNewsQuery(e.target.value)}
              placeholder={`Search ${dashboardTitle} news...`}
              className="w-48 sm:w-64 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:border-[#0D9488] focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={newsLoading}
              className="rounded-lg bg-[#0D9488] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0F766E] cursor-pointer whitespace-nowrap"
            >
              {newsLoading ? 'Loading...' : 'Refresh News'}
            </button>
          </form>
        </div>

        {newsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-pulse">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-20 rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500">
            No articles found for the current query. Click Refresh News to reload.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {articles.map((art, idx) => (
              <a
                key={idx}
                href={art.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4 hover:border-[#0D9488] hover:bg-[#F0FDFA] transition-colors"
              >
                <div className="text-sm font-semibold text-slate-900 group-hover:text-[#0F766E] leading-snug">
                  {art.title}
                </div>
                <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
                  <span>{art.source}</span>
                  <span className="inline-flex items-center gap-1 text-[#0284C7]">
                    <span>Read</span>
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
