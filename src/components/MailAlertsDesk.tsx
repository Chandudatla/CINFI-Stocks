import React, { useCallback, useEffect, useRef, useState } from 'react';
import { User } from 'firebase/auth';
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  ExternalLink,
  Lock,
  LogOut,
  Mail,
  Plus,
  RefreshCw,
  Send,
  ShieldCheck,
  Trash2,
  TrendingDown,
  TrendingUp,
  Unlock,
  X,
} from 'lucide-react';
import {
  clearGmailAccessToken,
  getGmailAccessToken,
  initGmailAuth,
  logoutGmail,
  signInWithGmail,
} from '../lib/firebase';
import { MailAlertsOverview, TradeAlertSignal } from '../types/market';

interface MailAlertsDeskProps {
  onBack: () => void;
}

interface PendingConfirmAction {
  mode: 'send-intraday' | 'send-morning' | 'enable-auto';
  title: string;
  description: string;
  subjectPreview: string;
  signalCount: number;
  confirmLabel: string;
}

// In-memory unlock token (never persisted to localStorage/sessionStorage)
let cachedUnlockToken: string | null = null;

const GoogleSignInButton: React.FC<{ onClick: () => void; loading: boolean }> = ({
  onClick,
  loading,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className="gsi-material-button"
  >
    <div className="gsi-material-button-state" />
    <div className="gsi-material-button-content-wrapper">
      <div className="gsi-material-button-icon">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          style={{ display: 'block' }}
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
          <path fill="none" d="M0 0h48v48H0z" />
        </svg>
      </div>
      <span className="gsi-material-button-contents">
        {loading ? 'Connecting Gmail...' : 'Sign in with Google'}
      </span>
      <span style={{ display: 'none' }}>Sign in with Google</span>
    </div>
  </button>
);

export const MailAlertsDesk: React.FC<MailAlertsDeskProps> = ({ onBack }) => {
  // Security Gate state
  const [unlockToken, setUnlockToken] = useState<string | null>(() => cachedUnlockToken);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);

  // Desk state
  const [overview, setOverview] = useState<MailAlertsOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'intraday' | 'morning'>('intraday');

  // Gmail client-side in-memory OAuth state
  const [user, setUser] = useState<User | null>(null);
  const [gmailToken, setGmailToken] = useState<string | null>(() => getGmailAccessToken());
  const [needsAuth, setNeedsAuth] = useState<boolean>(() => !getGmailAccessToken());
  const [authLoading, setAuthLoading] = useState(false);

  // Dispatch & UI feedback states
  const [sendingKind, setSendingKind] = useState<'intraday' | 'morning' | null>(null);
  const [sessionAutoApproved, setSessionAutoApproved] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirmAction | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  // Recipient editing
  const [newEmailInput, setNewEmailInput] = useState('');
  const [savingConfig, setSavingConfig] = useState(false);

  const lastDispatchedQueueIdRef = useRef<string | null>(null);
  const overviewRef = useRef<MailAlertsOverview | null>(overview);
  overviewRef.current = overview;

  const handleLockDesk = () => {
    cachedUnlockToken = null;
    setUnlockToken(null);
    setOverview(null);
    setPasswordInput('');
    setUnlockError(null);
  };

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setUnlockError('Enter your Mail Alert security password.');
      return;
    }
    setUnlocking(true);
    setUnlockError(null);
    try {
      const res = await fetch('/api/mail-alerts/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (!res.ok || !data?.unlockToken) {
        throw new Error(data?.error || 'Incorrect security password.');
      }
      cachedUnlockToken = data.unlockToken;
      setUnlockToken(data.unlockToken);
      setPasswordInput('');
    } catch (err: any) {
      setUnlockError(err?.message || 'Unable to verify password.');
    } finally {
      setUnlocking(false);
    }
  };

  const loadOverview = useCallback(
    async (force = false) => {
      if (!unlockToken) return;
      try {
        if (force) setRefreshing(true);
        else setLoading((prev) => (overviewRef.current === null ? true : prev));

        const res = await fetch(`/api/mail-alerts/overview${force ? '?force=true' : ''}`, {
          headers: { 'X-Mail-Alert-Key': unlockToken },
        });
        const data = await res.json();
        if (res.status === 401 && data?.locked) {
          cachedUnlockToken = null;
          setUnlockToken(null);
          setUnlockError('Security session expired. Re-enter password.');
          return;
        }
        if (!res.ok) throw new Error(data?.error || 'Failed to load researched mail alerts');
        setOverview(data);
      } catch (err: any) {
        setStatusMessage({
          type: 'error',
          text: err?.message || 'Unable to load alert signals right now.',
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [unlockToken]
  );

  useEffect(() => {
    if (unlockToken) {
      void loadOverview(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlockToken]);

  useEffect(() => {
    const unsub = initGmailAuth(
      (signedUser, token) => {
        setUser(signedUser);
        setGmailToken(token);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setGmailToken(null);
        setNeedsAuth(true);
        setSessionAutoApproved(false);
      }
    );
    return () => unsub();
  }, []);

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setStatusMessage(null);
    try {
      const { user: signedUser, accessToken } = await signInWithGmail();
      setUser(signedUser);
      setGmailToken(accessToken);
      setNeedsAuth(false);
      setStatusMessage({
        type: 'success',
        text: `Connected Gmail (${signedUser.email || 'Authorized'}). Click Enable Everyday Auto-Mail to activate automatic dispatch for queued 9 AM & 24/7 alerts.`,
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Google sign-in was cancelled or failed.',
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogout = async () => {
    await logoutGmail();
    setUser(null);
    setGmailToken(null);
    setNeedsAuth(true);
    setSessionAutoApproved(false);
    setStatusMessage({
      type: 'info',
      text: 'Signed out of Gmail session.',
    });
  };

  const executeSendEmail = useCallback(
    async (
      kind: 'intraday' | 'morning',
      triggerType: 'manual' | 'session-auto' = 'manual'
    ) => {
      if (!unlockToken) return;
      const token = getGmailAccessToken();
      if (!token && !overview?.smtpConfigured) {
        setNeedsAuth(true);
        setStatusMessage({
          type: 'error',
          text: 'Please Sign in with Google first to authorize Gmail sending.',
        });
        return;
      }

      setSendingKind(kind);
      setStatusMessage(null);
      try {
        const res = await fetch('/api/mail-alerts/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Mail-Alert-Key': unlockToken,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            kind,
            triggerType,
          }),
        });
        const data = await res.json();
        if (res.status === 401 && data?.locked) {
          cachedUnlockToken = null;
          setUnlockToken(null);
          return;
        }
        if (!res.ok) {
          if (res.status === 401 || data?.needsAuth) {
            clearGmailAccessToken();
            setGmailToken(null);
            setNeedsAuth(true);
            setSessionAutoApproved(false);
          }
          throw new Error(data?.error || 'Failed to send alert email');
        }

        setStatusMessage({
          type: 'success',
          text: `Delivered ${kind === 'intraday' ? '24/7 Intraday' : '9:00 AM Morning Briefing'} alert (${data.log?.signalCount ?? 0} signals) to ${overview?.config.recipients.join(', ')}.`,
        });
        await loadOverview(false);
      } catch (err: any) {
        setStatusMessage({
          type: 'error',
          text: err?.message || 'Email dispatch failed.',
        });
      } finally {
        setSendingKind(null);
      }
    },
    [loadOverview, overview?.config.recipients, overview?.smtpConfigured, unlockToken]
  );

  // Active-session automated everyday & 24/7 dispatch watcher
  useEffect(() => {
    if (!unlockToken || !sessionAutoApproved || !gmailToken) return;
    const poll = setInterval(async () => {
      try {
        const res = await fetch('/api/mail-alerts/overview', {
          headers: { 'X-Mail-Alert-Key': unlockToken },
        });
        if (!res.ok) return;
        const data: MailAlertsOverview = await res.json();
        setOverview(data);

        const latestQueued = data.deliveryLogs.find(
          (log) =>
            log.status === 'queued' &&
            (log.kind === 'intraday' || log.kind === 'morning')
        );
        if (latestQueued && latestQueued.id !== lastDispatchedQueueIdRef.current) {
          lastDispatchedQueueIdRef.current = latestQueued.id;
          await executeSendEmail(
            latestQueued.kind === 'morning' ? 'morning' : 'intraday',
            'session-auto'
          );
        }
      } catch {
        // Silent retry on next cycle
      }
    }, 30_000);

    return () => clearInterval(poll);
  }, [executeSendEmail, gmailToken, sessionAutoApproved, unlockToken]);

  const requestSendWithConfirm = (mode: 'send-intraday' | 'send-morning' | 'enable-auto') => {
    if (!overview) return;
    const recipientsText = overview.config.recipients.join(', ');
    if (mode === 'send-intraday') {
      setPendingConfirm({
        mode,
        title: 'Confirm 24/7 Intraday Buy/Sell Alert Mail',
        description: `This will compose and send a live research-backed Intraday Buy & Sell alert email from your Gmail account to: ${recipientsText}.`,
        subjectPreview: `CINFI 24/7 Intraday Alert: ${
          overview.intradaySignals.filter((s) => s.action === 'BUY').length
        } BUY · ${overview.intradaySignals.filter((s) => s.action === 'SELL').length} SELL Signals`,
        signalCount: overview.intradaySignals.length,
        confirmLabel: 'Confirm & Send Mail',
      });
    } else if (mode === 'send-morning') {
      setPendingConfirm({
        mode,
        title: 'Confirm 9:00 AM Market Briefing Mail',
        description: `This will send the all-9-dashboards morning Buy/Sell research digest (Stocks, Mutual Funds, F&O, ETFs, IPO, Gold, Silver, Bonds, Commodities) via Gmail to: ${recipientsText}.`,
        subjectPreview: `CINFI 9:00 AM Market Briefing (${overview.istNow.dateStr})`,
        signalCount: overview.morningSignals.length,
        confirmLabel: 'Confirm & Send Briefing',
      });
    } else {
      setPendingConfirm({
        mode,
        title: 'Authorize Everyday & 24/7 Automated Gmail Dispatch',
        description: `While your Google session stays active, queued 24/7 Intraday Buy/Sell triggers and daily 9:00 AM IST morning briefings will automatically send through your Gmail account to: ${recipientsText}.`,
        subjectPreview: 'Automated 24/7 Intraday & 09:00 AM IST Research Alerts',
        signalCount: overview.intradaySignals.length + overview.morningSignals.length,
        confirmLabel: 'Confirm & Enable Auto-Mail',
      });
    }
  };

  const handleConfirmProceed = async () => {
    if (!pendingConfirm) return;
    const chosen = pendingConfirm.mode;
    setPendingConfirm(null);
    if (chosen === 'send-intraday') {
      await executeSendEmail('intraday', 'manual');
    } else if (chosen === 'send-morning') {
      await executeSendEmail('morning', 'manual');
    } else {
      setSessionAutoApproved(true);
      // Immediately drain any queued trigger if present
      const queued = overview?.deliveryLogs.find((l) => l.status === 'queued');
      if (queued) {
        lastDispatchedQueueIdRef.current = queued.id;
        await executeSendEmail(queued.kind === 'morning' ? 'morning' : 'intraday', 'session-auto');
      } else {
        setStatusMessage({
          type: 'success',
          text: 'Automated session Gmail watcher enabled for 24/7 Intraday & 9:00 AM IST alerts.',
        });
      }
    }
  };

  const handleUpdateConfig = async (
    patch: Partial<{
      recipients: string[];
      intraday24x7Enabled: boolean;
      morning9AmIstEnabled: boolean;
      morningDailyEveryDay: boolean;
    }>
  ) => {
    if (!unlockToken) return;
    setSavingConfig(true);
    try {
      const res = await fetch('/api/mail-alerts/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Mail-Alert-Key': unlockToken,
        },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (res.status === 401 && data?.locked) {
        cachedUnlockToken = null;
        setUnlockToken(null);
        return;
      }
      if (!res.ok) throw new Error(data?.error || 'Could not update alert config');
      setOverview((prev) => (prev ? { ...prev, config: data.config } : prev));
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Unable to save schedule configuration.',
      });
    } finally {
      setSavingConfig(false);
    }
  };

  const handleAddRecipient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overview) return;
    const clean = newEmailInput.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setStatusMessage({ type: 'error', text: 'Enter a valid email address.' });
      return;
    }
    if (overview.config.recipients.includes(clean)) {
      setNewEmailInput('');
      return;
    }
    await handleUpdateConfig({ recipients: [...overview.config.recipients, clean] });
    setNewEmailInput('');
  };

  const handleRemoveRecipient = async (email: string) => {
    if (!overview || overview.config.recipients.length <= 1) return;
    await handleUpdateConfig({
      recipients: overview.config.recipients.filter((r) => r !== email),
    });
  };

  // RENDER SECURITY PASSWORD GATE IF LOCKED
  if (!unlockToken) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D9488] hover:underline cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to CINFI Home
        </button>

        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B1D26] text-teal-300 shrink-0">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Mail Alerts Protected Desk
              </h1>
              <p className="text-xs text-slate-500">
                Enter your unique security password to access recipients, schedules &amp; live alerts.
              </p>
            </div>
          </div>

          {unlockError && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-800">
              {unlockError}
            </div>
          )}

          <form onSubmit={handleUnlockSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="mail-alert-password"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Security Password
              </label>
              <div className="relative">
                <input
                  id="mail-alert-password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter unique Mail Alert password"
                  autoComplete="current-password"
                  autoFocus
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0D9488] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={unlocking}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#0D9488] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0F766E] disabled:opacity-60 cursor-pointer"
            >
              <Unlock className="h-4 w-4" />
              <span>{unlocking ? 'Verifying...' : 'Unlock Mail Alerts'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  const visibleSignals: TradeAlertSignal[] = overview
    ? activeTab === 'intraday'
      ? overview.intradaySignals
      : overview.morningSignals
    : [];

  return (
    <div className="space-y-6">
      {/* Header Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D9488] hover:underline cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to CINFI Home
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Buy &amp; Sell Research Mail Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            24/7 Intraday VWAP &amp; momentum triggers plus 9:00 AM IST morning briefings across all 9 dashboards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleLockDesk}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-slate-400 cursor-pointer"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Lock Desk</span>
          </button>

          <button
            type="button"
            onClick={() => void loadOverview(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-[#0D9488] hover:text-[#0D9488] disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Scanning Live Data...' : 'Rescan Signals'}</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {statusMessage && (
        <div
          role="status"
          className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-xs sm:text-sm ${
            statusMessage.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : statusMessage.type === 'error'
                ? 'border-rose-200 bg-rose-50 text-rose-900'
                : 'border-sky-200 bg-sky-50 text-sky-900'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            aria-label="Dismiss message"
            className="p-0.5 opacity-70 hover:opacity-100 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Top Setup Grid: Gmail Connection + Recipients & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Gmail Authorization & Dispatch Card */}
        <section className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col justify-between gap-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Mail className="h-4 w-4 text-[#0D9488]" />
                <span>Gmail Dispatch Authorization</span>
              </div>
              <span className="font-mono tabular-nums text-[11px] font-semibold text-slate-500">
                {overview?.istNow.timeStr || '--:--'} IST
              </span>
            </div>

            {needsAuth || !gmailToken ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sign in with Google to authorize Gmail delivery for instant Buy/Sell dispatch and active-session automated everyday alerts.
                </p>
                <div className="pt-1">
                  <GoogleSignInButton onClick={handleGoogleSignIn} loading={authLoading} />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-2.5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <span>Gmail Connected</span>
                    </div>
                    <div className="text-xs text-slate-700 truncate mt-0.5">
                      {user?.email || 'Authorized Google Account'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleGoogleLogout}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shrink-0"
                  >
                    <LogOut className="h-3 w-3" />
                    Sign out
                  </button>
                </div>

                {/* Active-session automated dispatch control */}
                <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-800">
                      Session Auto-Mail Watcher
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {sessionAutoApproved
                        ? 'Active: auto-sends queued 24/7 & 9 AM alerts'
                        : 'Click Enable to auto-send queued alerts in session'}
                    </div>
                  </div>
                  {sessionAutoApproved ? (
                    <button
                      type="button"
                      onClick={() => setSessionAutoApproved(false)}
                      className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-50 cursor-pointer shrink-0"
                    >
                      Pause
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => requestSendWithConfirm('enable-auto')}
                      className="rounded-lg bg-[#0D9488] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#0F766E] cursor-pointer shrink-0"
                    >
                      Enable
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-2.5">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={sendingKind !== null || !overview || (!gmailToken && !overview.smtpConfigured)}
                onClick={() => requestSendWithConfirm('send-intraday')}
                className="flex-1 min-w-[170px] inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#0B1D26] px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>
                  {sendingKind === 'intraday' ? 'Sending Intraday...' : 'Send 24/7 Intraday Mail'}
                </span>
              </button>

              <button
                type="button"
                disabled={sendingKind !== null || !overview || (!gmailToken && !overview.smtpConfigured)}
                onClick={() => requestSendWithConfirm('send-morning')}
                className="flex-1 min-w-[170px] inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#0D9488] px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-[#0F766E] disabled:opacity-50 cursor-pointer"
              >
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {sendingKind === 'morning' ? 'Sending 9 AM Digest...' : 'Send 9 AM Digest Now'}
                </span>
              </button>
            </div>
            <div className="text-[11px] text-slate-500 leading-relaxed">
              {overview?.smtpConfigured
                ? 'Server 24/7 & daily 9:00 AM IST background SMTP relay is active even when no browser is open.'
                : 'Runs automatically while Gmail session is connected. For browser-closed 24/7 unattended sending after publish, configure SMTP_USER & SMTP_PASS in app environment secrets.'}
            </div>
          </div>
        </section>

        {/* Recipients & Dual Schedule Configuration */}
        <section className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Recipients &amp; Automated Schedules
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Researched Buy &amp; Sell triggers deliver to all configured mailboxes automatically.
              </p>
            </div>
            {overview && (
              <span className="text-[11px] font-mono tabular-nums text-slate-600">
                Next 9 AM Run: {overview.config.nextMorningRunIst}
              </span>
            )}
          </div>

          {/* Configured Mailboxes */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-700">
              Active Recipient Mailboxes ({overview?.config.recipients.length ?? 0})
            </div>
            <div className="flex flex-wrap gap-2">
              {overview?.config.recipients.map((email) => (
                <div
                  key={email}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-800"
                >
                  <span>{email}</span>
                  {overview.config.recipients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => void handleRemoveRecipient(email)}
                      disabled={savingConfig}
                      aria-label={`Remove ${email}`}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleAddRecipient} className="flex gap-2 pt-1">
              <input
                type="email"
                value={newEmailInput}
                onChange={(e) => setNewEmailInput(e.target.value)}
                placeholder="Add another recipient email..."
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0D9488] focus:outline-none"
              />
              <button
                type="submit"
                disabled={savingConfig}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </form>
          </div>

          {/* Mandate Schedules */}
          {overview && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    24/7 Intraday Buy/Sell Alerts
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    NSE 5m VWAP/RSI/MACD + 24/7 global cues scanned every 5 mins (90m cooldown).
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={overview.config.intraday24x7Enabled}
                  onChange={(e) =>
                    void handleUpdateConfig({ intraday24x7Enabled: e.target.checked })
                  }
                  className="mt-0.5 h-4 w-4 accent-[#0D9488] cursor-pointer"
                />
              </label>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-2.5">
                <label className="flex items-start justify-between gap-3 cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      9:00 AM IST Morning Digest
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      All 9 remaining dashboards briefing sent at 09:00 AM IST.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={overview.config.morning9AmIstEnabled}
                    onChange={(e) =>
                      void handleUpdateConfig({ morning9AmIstEnabled: e.target.checked })
                    }
                    className="mt-0.5 h-4 w-4 accent-[#0D9488] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between gap-2 border-t border-slate-200 pt-2 text-[11px] text-slate-700 cursor-pointer">
                  <span>Include weekends (run all 7 days)</span>
                  <input
                    type="checkbox"
                    checked={overview.config.morningDailyEveryDay}
                    onChange={(e) =>
                      void handleUpdateConfig({ morningDailyEveryDay: e.target.checked })
                    }
                    className="h-3.5 w-3.5 accent-[#0D9488] cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Researched Buy & Sell Signal Feed */}
      <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#0D9488]" />
            <h2 className="text-base font-bold text-slate-900">
              Live Research-Backed Buy &amp; Sell Signals
            </h2>
          </div>

          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('intraday')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'intraday'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              24/7 Intraday ({overview?.intradaySignals.length ?? 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('morning')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'morning'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              9:00 AM All 9 Desks ({overview?.morningSignals.length ?? 0})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Scanning live exchange feeds, VWAP/RSI/MACD indicators, and wire news...
          </div>
        ) : visibleSignals.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No researched signals returned yet. Click Rescan Signals to refresh.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:gap-px bg-slate-200">
            {visibleSignals.map((sig) => {
              const isBuy = sig.action === 'BUY';
              const isSell = sig.action === 'SELL';
              return (
                <article
                  key={sig.id}
                  className="bg-white p-5 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500">
                          <span
                            className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[11px] font-bold ${
                              isBuy
                                ? 'bg-emerald-600 text-white'
                                : isSell
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-sky-600 text-white'
                            }`}
                          >
                            {isBuy ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {sig.action}
                          </span>
                          <span>{sig.dashboardLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">
                            {sig.confidence}% Confidence
                          </span>
                        </div>
                        <h3 className="mt-1.5 text-sm sm:text-base font-bold text-slate-900">
                          {sig.symbol} — {sig.name}
                        </h3>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm sm:text-base font-bold font-mono tabular-nums text-slate-900">
                          {sig.priceLabel}
                        </div>
                        {sig.changePct !== null && (
                          <div
                            className={`text-xs font-mono tabular-nums font-semibold ${
                              sig.changePct >= 0 ? 'text-emerald-700' : 'text-rose-600'
                            }`}
                          >
                            {sig.changePct >= 0 ? '+' : ''}
                            {sig.changePct}%
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Trade Plan Metrics */}
                    <div className="grid grid-cols-3 gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-[11px]">
                      <div>
                        <div className="text-slate-500">Entry</div>
                        <div className="font-mono tabular-nums font-bold text-slate-900 truncate">
                          {sig.entryZone}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">Target</div>
                        <div className="font-mono tabular-nums font-bold text-emerald-700 truncate">
                          {sig.targetZone}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">Stop Loss</div>
                        <div className="font-mono tabular-nums font-bold text-rose-700 truncate">
                          {sig.stopLossZone}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">{sig.rationale}</p>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-[11px]">
                    <span className="text-slate-500 truncate">{sig.timeframe}</span>
                    {sig.newsLink ? (
                      <a
                        href={sig.newsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-[#0D9488] hover:underline truncate max-w-[65%]"
                      >
                        <span className="truncate">{sig.newsCatalyst}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-slate-500 truncate">{sig.newsCatalyst}</span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Mail Dispatch Log */}
      <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4 flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-slate-900">Recent Alert Activity &amp; Mail Log</h2>
          <span className="text-xs font-mono tabular-nums text-slate-500">
            {overview?.deliveryLogs.length ?? 0} Events
          </span>
        </div>
        {!overview || overview.deliveryLogs.length === 0 ? (
          <div className="p-6 text-xs text-slate-500">
            No mails dispatched yet. Connect Gmail above and enable Auto-Mail or click Send 24/7 Intraday Mail / Send 9 AM Digest Now.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {overview.deliveryLogs.map((log) => (
              <div
                key={log.id}
                className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="font-semibold text-slate-900 truncate">{log.subject}</div>
                  <div className="text-[11px] text-slate-500">
                    <span className="font-mono tabular-nums">{log.sentAtIst}</span>
                    <span aria-hidden="true"> · </span>
                    <span>To: {log.recipients.join(', ')}</span>
                    {log.detail && (
                      <>
                        <span aria-hidden="true"> · </span>
                        <span>{log.detail}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 font-mono text-[11px] font-bold">
                  <span className="text-slate-600 uppercase">{log.transport}</span>
                  <span
                    className={
                      log.status === 'sent'
                        ? 'text-emerald-700'
                        : log.status === 'queued'
                          ? 'text-amber-700'
                          : 'text-rose-600'
                    }
                  >
                    {log.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MANDATORY Explicit Confirmation Dialog Before Sending Email */}
      {pendingConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mail-confirm-title"
        >
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-slate-900">
                <ShieldCheck className="h-5 w-5 text-[#0D9488] shrink-0" />
                <h3 id="mail-confirm-title" className="text-base font-bold">
                  {pendingConfirm.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPendingConfirm(null)}
                aria-label="Cancel confirmation"
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {pendingConfirm.description}
            </p>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-1.5 text-xs">
              <div>
                <span className="font-semibold text-slate-700">Recipients: </span>
                <span className="font-mono text-slate-900">
                  {overview?.config.recipients.join(', ')}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Subject: </span>
                <span className="text-slate-900">{pendingConfirm.subjectPreview}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Included Signals: </span>
                <span className="font-mono tabular-nums text-slate-900">
                  {pendingConfirm.signalCount} researched Buy/Sell alerts
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPendingConfirm(null)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmProceed()}
                className="rounded-lg bg-[#0D9488] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0F766E] cursor-pointer"
              >
                {pendingConfirm.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
