import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import { DashboardId, StructuredDashboardAiResponse } from '../types/market';
import { fetchJson } from '../utils/safeFetch';

interface StructuredDashboardAIProps {
  dashboardType: DashboardId;
  title: string;
  description: string;
  focusLabel: string;
  liveContext?: Record<string, unknown>;
  mode?: 'analysis' | 'expert' | 'combined';
  syncedAt?: string | null;
}

export const StructuredDashboardAI: React.FC<StructuredDashboardAIProps> = ({
  dashboardType,
  title,
  description,
  focusLabel,
  liveContext,
  mode = 'combined',
  syncedAt,
}) => {
  const [data, setData] = useState<StructuredDashboardAiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const [autoSync, setAutoSync] = useState(true);
  const liveContextRef = useRef(liveContext);
  liveContextRef.current = liveContext;

  const runResearch = async (forceRefresh = false, signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const json = await fetchJson<StructuredDashboardAiResponse>('/api/dashboard/ai-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal,
        body: JSON.stringify({
          dashboardType,
          focusLabel,
          liveContext: liveContextRef.current,
          customQuestion: customQuestion.trim() || undefined,
          force: forceRefresh,
        }),
      });
      if (!signal?.aborted) {
        setData(json);
      }
    } catch (err: any) {
      if (err?.name === 'AbortError' || signal?.aborted) return;
      setError(err?.message || 'AI research request failed');
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  // Clear stale output immediately when switching dashboard or focus target
  useEffect(() => {
    setData(null);
    setError(null);
  }, [dashboardType, focusLabel]);

  // Auto-Sync AI automatically when dashboard, focus target, or live sync timestamp updates
  // Passes force=false so server 10-minute AI cache is used during 30s live price polls
  useEffect(() => {
    if (!autoSync) return;
    const controller = new AbortController();
    runResearch(false, controller.signal);
    return () => controller.abort();
  }, [dashboardType, focusLabel, syncedAt, autoSync]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setAutoSync((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              autoSync
                ? 'border-teal-200 bg-teal-50 text-[#0F766E]'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading && autoSync ? 'animate-spin' : ''}`} />
            <span>{autoSync ? 'Auto-Sync AI: On' : 'Auto-Sync AI: Paused'}</span>
          </button>

          <button
            type="button"
            onClick={() => runResearch(true)}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0D9488] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0F766E] disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>
              {loading
                ? 'Syncing AI Research...'
                : data
                  ? 'Refresh AI'
                  : `Analyze ${focusLabel}`}
            </span>
          </button>
        </div>
      </div>

      {/* Optional Priority Focus Question */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runResearch(true);
        }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
      >
        <input
          type="text"
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          placeholder={`Optional focus question for ${focusLabel} (e.g. "Target entry, macro risk or 1-year outlook")...`}
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0D9488] focus:bg-white focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60 whitespace-nowrap shrink-0 cursor-pointer"
        >
          Ask &amp; Analyze
        </button>
      </form>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      {loading && !data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-24 rounded-xl bg-slate-100" />
          ))}
        </div>
      )}

      {!data && !loading && !error && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-6 text-center text-xs sm:text-sm text-slate-600">
          Click <strong>Analyze {focusLabel}</strong> or enable Auto-Sync AI above to generate live search &amp; news-grounded analysis.
        </div>
      )}

      {data && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              Research Engine:{' '}
              <strong className="text-slate-700">
                {data.researchMode === 'live-quant-news'
                  ? 'Live Exchange Quant & RSS Wire Synthesis'
                  : 'Search-Grounded Institutional AI + Live Wire'}
              </strong>
            </span>
            <span className="font-mono">
              {new Date(data.generatedAt).toLocaleTimeString('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}{' '}
              IST
            </span>
          </div>

          {/* Stance / Risk / Confidence Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs text-slate-500">AI Stance</div>
              <div
                className={`mt-1 text-lg font-bold ${
                  data.stance === 'Bullish' || data.stance === 'Constructive'
                    ? 'text-emerald-700'
                    : data.stance === 'Bearish' || data.stance === 'Cautious'
                      ? 'text-rose-600'
                      : 'text-slate-900'
                }`}
              >
                {data.stance}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs text-slate-500">Risk Score</div>
              <div className="mt-1 text-lg font-bold font-mono tabular-nums text-slate-900">
                {data.riskScore}/10
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs text-slate-500">AI Confidence</div>
              <div className="mt-1 text-lg font-bold font-mono tabular-nums text-[#0D9488]">
                {data.confidence}%
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs text-slate-500">Focus Target</div>
              <div className="mt-1 text-sm font-bold text-slate-900 truncate">
                {data.focusLabel}
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">{data.summary}</p>

          {(mode === 'analysis' || mode === 'combined') && data.analysisPillars.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Detailed Analytical Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.analysisPillars.map((pillar) => (
                  <div
                    key={pillar.label}
                    className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <h4 className="text-xs font-bold text-slate-900">{pillar.label}</h4>
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {pillar.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(mode === 'expert' || mode === 'combined') && data.expertVerification.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#0D9488]" />
                <h3 className="text-sm font-bold text-slate-900">
                  Expert Research &amp; Source Verification
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.expertVerification.map((ex) => (
                  <div
                    key={ex.label}
                    className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <h4 className="text-xs font-bold text-slate-900">{ex.label}</h4>
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {ex.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.decisionReasons.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="text-xs font-bold text-slate-700">Key Decision Drivers</div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                {data.decisionReasons.map((reason, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-[#0D9488] shrink-0">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.sources.length > 0 && (
            <div className="pt-3 border-t border-slate-200">
              <div className="text-xs font-semibold text-slate-500 mb-2">Verified Citations</div>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {data.sources.map((src, idx) => (
                  <a
                    key={idx}
                    href={src.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#0284C7] hover:underline"
                  >
                    <span className="truncate max-w-[260px]">{src.title}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
