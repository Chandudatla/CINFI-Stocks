import crypto from 'crypto';
import fs from 'fs';
import nodemailer from 'nodemailer';

export type AlertDashboardId =
  | 'stocks'
  | 'mutual-funds'
  | 'intraday'
  | 'fno'
  | 'etfs'
  | 'ipo'
  | 'gold'
  | 'silver'
  | 'bonds'
  | 'commodities';

export interface TradeAlertSignal {
  id: string;
  dashboardId: AlertDashboardId;
  dashboardLabel: string;
  symbol: string;
  name: string;
  action: 'BUY' | 'SELL' | 'WATCH';
  priceLabel: string;
  changePct: number | null;
  entryZone: string;
  targetZone: string;
  stopLossZone: string;
  confidence: number;
  timeframe: string;
  rationale: string;
  newsCatalyst: string;
  newsSource?: string;
  newsLink?: string;
}

export interface MailAlertScheduleConfig {
  recipients: string[];
  intraday24x7Enabled: boolean;
  morning9AmIstEnabled: boolean;
  morningDailyEveryDay: boolean;
  minConfidence: number;
  lastMorningSentDate: string | null;
  lastIntradaySentAt: string | null;
  nextMorningRunIst: string;
}

export interface MailAlertLogEntry {
  id: string;
  sentAt: string;
  sentAtIst: string;
  kind: 'intraday' | 'morning' | 'combined';
  triggerType: 'manual' | 'session-auto' | 'scheduler-24x7' | 'scheduler-9am-ist';
  transport: 'gmail' | 'smtp' | 'queued';
  recipients: string[];
  subject: string;
  signalCount: number;
  topSignals: string[];
  status: 'sent' | 'queued' | 'failed';
  detail?: string;
}

export interface MailAlertsDependencies {
  defaultUniverse: Array<{ ticker: string; symbol: string; name: string; sector: string }>;
  intradayWatch: Array<{ symbol: string; name: string; sector: string }>;
  mfSchemes: Array<any>;
  etfList: Array<{ symbol: string; name: string; category: string; expenseRatio: number }>;
  ipoListedMeta: Array<{
    symbol: string;
    name: string;
    sector: string;
    issuePrice: number;
    subscriptionTotal: string;
  }>;
  ipoPipelineMeta: Array<{
    companyName: string;
    sector: string;
    status: string;
    priceBand: string;
    subscriptionTotal: string;
    openDate: string;
  }>;
  bondSymbols: Array<{ symbol: string; name: string; category: string }>;
  commoditySymbols: Array<{ symbol: string; name: string; unit: string; category: string }>;
  fetchSimpleQuote: (symbol: string, range?: string, interval?: string) => Promise<any>;
  fetchMutualFundSummary: (metaCfg: any) => Promise<any>;
  fetchLiveRssArticles: (
    query: string
  ) => Promise<Array<{ title: string; link: string; pubDate: string; source: string }>>;
}

const DEFAULT_RECIPIENTS = ['chandudatla23@gmail.com', 'akhilgangadhari95@gmail.com'];
const STATE_FILE_PATH = '/tmp/cinfi-mail-alerts-state.json';

// Timing-safe SHA-256 password verification (no plaintext password stored in source)
const DEFAULT_PASSCODE_SHA256 =
  '9dbd4c76a92429d8deddc899a2685e690742c99105972f6846f5deb83cf42db2';
const HMAC_SIGNING_SECRET =
  process.env.MAIL_ALERT_HMAC_SECRET?.trim() ||
  crypto
    .createHash('sha256')
    .update(
      `${process.env.MAIL_ALERT_PASSWORD || DEFAULT_PASSCODE_SHA256}:${
        process.env.GEMINI_API_KEY || 'cinfi-alerts-desk'
      }`
    )
    .digest('hex');

export function verifyMailAlertPassword(candidate: string): boolean {
  if (typeof candidate !== 'string' || !candidate) return false;
  const envOverride = process.env.MAIL_ALERT_PASSWORD?.trim();
  const expectedHex = envOverride
    ? crypto.createHash('sha256').update(envOverride).digest('hex')
    : DEFAULT_PASSCODE_SHA256;
  const actualHex = crypto.createHash('sha256').update(candidate).digest('hex');
  try {
    return crypto.timingSafeEqual(
      Buffer.from(actualHex, 'hex'),
      Buffer.from(expectedHex, 'hex')
    );
  } catch {
    return false;
  }
}

export function issueMailAlertUnlockToken(): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ scope: 'mail-alerts', exp: expiresAt })).toString(
    'base64url'
  );
  const sig = crypto
    .createHmac('sha256', HMAC_SIGNING_SECRET)
    .update(payload)
    .digest('base64url');
  return { token: `${payload}.${sig}`, expiresAt };
}

export function verifyMailAlertUnlockToken(token: string | undefined | null): boolean {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expectedSig = crypto
    .createHmac('sha256', HMAC_SIGNING_SECRET)
    .update(payload)
    .digest('base64url');
  try {
    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return false;
    }
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return decoded?.scope === 'mail-alerts' && typeof decoded?.exp === 'number' && decoded.exp > Date.now();
  } catch {
    return false;
  }
}

const alertConfigState: {
  recipients: string[];
  intraday24x7Enabled: boolean;
  morning9AmIstEnabled: boolean;
  morningDailyEveryDay: boolean;
  minConfidence: number;
  lastMorningSentDate: string | null;
  lastIntradaySentAt: string | null;
} = {
  recipients: [...DEFAULT_RECIPIENTS],
  intraday24x7Enabled: true,
  morning9AmIstEnabled: true,
  morningDailyEveryDay: false,
  minConfidence: 70,
  lastMorningSentDate: null,
  lastIntradaySentAt: null,
};

let deliveryLogs: MailAlertLogEntry[] = [];
const signalCooldownMap = new Map<string, number>();
const COOLDOWN_MS = 90 * 60 * 1000;

function loadPersistedState() {
  try {
    if (!fs.existsSync(STATE_FILE_PATH)) return;
    const raw = fs.readFileSync(STATE_FILE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed?.config) {
      if (Array.isArray(parsed.config.recipients) && parsed.config.recipients.length > 0) {
        alertConfigState.recipients = parsed.config.recipients;
      }
      if (typeof parsed.config.intraday24x7Enabled === 'boolean') {
        alertConfigState.intraday24x7Enabled = parsed.config.intraday24x7Enabled;
      }
      if (typeof parsed.config.morning9AmIstEnabled === 'boolean') {
        alertConfigState.morning9AmIstEnabled = parsed.config.morning9AmIstEnabled;
      }
      if (typeof parsed.config.morningDailyEveryDay === 'boolean') {
        alertConfigState.morningDailyEveryDay = parsed.config.morningDailyEveryDay;
      }
      if (typeof parsed.config.minConfidence === 'number') {
        alertConfigState.minConfidence = parsed.config.minConfidence;
      }
      if (typeof parsed.config.lastMorningSentDate === 'string') {
        alertConfigState.lastMorningSentDate = parsed.config.lastMorningSentDate;
      }
      if (typeof parsed.config.lastIntradaySentAt === 'string') {
        alertConfigState.lastIntradaySentAt = parsed.config.lastIntradaySentAt;
      }
    }
    if (Array.isArray(parsed?.deliveryLogs)) {
      deliveryLogs = parsed.deliveryLogs.slice(0, 40);
    }
    if (parsed?.signalCooldowns && typeof parsed.signalCooldowns === 'object') {
      const cutoff = Date.now() - COOLDOWN_MS;
      for (const [k, ts] of Object.entries(parsed.signalCooldowns)) {
        if (typeof ts === 'number' && ts > cutoff) {
          signalCooldownMap.set(k, ts);
        }
      }
    }
  } catch {
    // Non-fatal fallback to in-memory defaults
  }
}

function savePersistedState() {
  try {
    const cutoff = Date.now() - COOLDOWN_MS;
    const cooldownObj: Record<string, number> = {};
    for (const [k, ts] of signalCooldownMap.entries()) {
      if (ts > cutoff) cooldownObj[k] = ts;
    }
    fs.writeFileSync(
      STATE_FILE_PATH,
      JSON.stringify({
        config: alertConfigState,
        deliveryLogs: deliveryLogs.slice(0, 40),
        signalCooldowns: cooldownObj,
      }),
      'utf8'
    );
  } catch {
    // Ignore read-only FS errors if any
  }
}

loadPersistedState();

export function getIstClock() {
  const now = new Date();
  const istString = now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  const istDate = new Date(istString);
  const year = istDate.getFullYear();
  const month = String(istDate.getMonth() + 1).padStart(2, '0');
  const dayNum = String(istDate.getDate()).padStart(2, '0');
  const yyyyMmDd = `${year}-${month}-${dayNum}`;
  const dayOfWeek = istDate.getDay(); // 0=Sun .. 6=Sat
  const hour = istDate.getHours();
  const minute = istDate.getMinutes();
  const isTradingDay = dayOfWeek >= 1 && dayOfWeek <= 5;

  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dateStr = istDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const timeStr = istDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const nextMorning = new Date(istDate);
  const passedNineAm = hour > 9 || (hour === 9 && minute >= 1);
  if ((!alertConfigState.morningDailyEveryDay && !isTradingDay) || passedNineAm) {
    nextMorning.setDate(nextMorning.getDate() + 1);
    if (!alertConfigState.morningDailyEveryDay) {
      while (nextMorning.getDay() === 0 || nextMorning.getDay() === 6) {
        nextMorning.setDate(nextMorning.getDate() + 1);
      }
    }
  }
  const nextMorningRunIst = `${nextMorning.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })}, 09:00 AM IST`;

  return {
    now,
    istDate,
    yyyyMmDd,
    hour,
    minute,
    dayOfWeek,
    weekday: weekdayNames[dayOfWeek],
    isTradingDay,
    dateStr,
    timeStr,
    nextMorningRunIst,
  };
}

export function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim());
}

export function getAlertConfig(): MailAlertScheduleConfig {
  const clock = getIstClock();
  return {
    recipients: [...alertConfigState.recipients],
    intraday24x7Enabled: alertConfigState.intraday24x7Enabled,
    morning9AmIstEnabled: alertConfigState.morning9AmIstEnabled,
    morningDailyEveryDay: alertConfigState.morningDailyEveryDay,
    minConfidence: alertConfigState.minConfidence,
    lastMorningSentDate: alertConfigState.lastMorningSentDate,
    lastIntradaySentAt: alertConfigState.lastIntradaySentAt,
    nextMorningRunIst: clock.nextMorningRunIst,
  };
}

export function updateAlertConfig(patch: Partial<MailAlertScheduleConfig>): MailAlertScheduleConfig {
  if (Array.isArray(patch.recipients)) {
    const cleaned = Array.from(
      new Set(
        patch.recipients
          .map((e) => String(e).trim().toLowerCase())
          .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
      )
    );
    if (cleaned.length > 0) {
      alertConfigState.recipients = cleaned;
    }
  }
  if (typeof patch.intraday24x7Enabled === 'boolean') {
    alertConfigState.intraday24x7Enabled = patch.intraday24x7Enabled;
  }
  if (typeof patch.morning9AmIstEnabled === 'boolean') {
    alertConfigState.morning9AmIstEnabled = patch.morning9AmIstEnabled;
  }
  if (typeof patch.morningDailyEveryDay === 'boolean') {
    alertConfigState.morningDailyEveryDay = patch.morningDailyEveryDay;
  }
  if (typeof patch.minConfidence === 'number' && !Number.isNaN(patch.minConfidence)) {
    alertConfigState.minConfidence = Math.min(92, Math.max(55, Math.round(patch.minConfidence)));
  }
  savePersistedState();
  return getAlertConfig();
}

export function getDeliveryLogs(): MailAlertLogEntry[] {
  return [...deliveryLogs];
}

function appendLog(entry: Omit<MailAlertLogEntry, 'id' | 'sentAt' | 'sentAtIst'>): MailAlertLogEntry {
  const clock = getIstClock();
  const full: MailAlertLogEntry = {
    ...entry,
    id: `mail-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    sentAt: clock.now.toISOString(),
    sentAtIst: `${clock.dateStr} ${clock.timeStr} IST`,
  };
  deliveryLogs.unshift(full);
  if (deliveryLogs.length > 40) {
    deliveryLogs.length = 40;
  }
  savePersistedState();
  return full;
}

function matchHeadline(
  articles: Array<{ title: string; link: string; pubDate: string; source: string }>,
  keywords: string[]
) {
  const lowerKeys = keywords.map((k) => k.toLowerCase());
  const hit = articles.find((a) => {
    const text = a.title.toLowerCase();
    return lowerKeys.some((kw) => kw.length >= 3 && text.includes(kw));
  });
  return hit || articles[0] || null;
}

function fmtInr(n: number) {
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

function fmtUsd(n: number) {
  return `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

export async function buildIntradayBuySellSignals(
  deps: MailAlertsDependencies
): Promise<TradeAlertSignal[]> {
  const [nseSettled, globalSettled, equityNews, globalNews] = await Promise.all([
    Promise.allSettled(
      deps.intradayWatch.slice(0, 14).map(async (item) => {
        const q = await deps.fetchSimpleQuote(item.symbol, '1d', '5m');
        return { ...q, name: item.name, sector: item.sector };
      })
    ),
    Promise.allSettled([
      deps.fetchSimpleQuote('GC=F', '1d', '15m').then((q) => ({
        ...q,
        displayName: 'Gold COMEX / MCX Proxy',
      })),
      deps.fetchSimpleQuote('SI=F', '1d', '15m').then((q) => ({
        ...q,
        displayName: 'Silver COMEX / MCX Proxy',
      })),
      deps.fetchSimpleQuote('BZ=F', '1d', '15m').then((q) => ({
        ...q,
        displayName: 'Brent Crude Oil 24/7 Futures',
      })),
      deps.fetchSimpleQuote('NG=F', '1d', '15m').then((q) => ({
        ...q,
        displayName: 'Natural Gas 24/7 Futures',
      })),
    ]),
    deps.fetchLiveRssArticles('NSE intraday stocks rally decline India market today'),
    deps.fetchLiveRssArticles('gold silver crude oil MCX global commodity prices today'),
  ]);

  const signals: Array<TradeAlertSignal & { rankScore: number }> = [];

  for (const r of nseSettled) {
    if (r.status !== 'fulfilled') continue;
    const q = r.value;
    const vwap = q.vwap ?? q.price;
    const rsi = q.rsi14 ?? 50;
    const macdBull =
      q.macd !== null && q.macdSignal !== null ? q.macd >= q.macdSignal : q.percentChange >= 0;
    const volRatio = q.volumeRatio ?? 1.0;

    let buyScore = 50;
    if (q.price >= vwap) buyScore += 14;
    if (q.percentChange > 0.35) buyScore += 10;
    if (q.percentChange > 1.0) buyScore += 6;
    if (rsi >= 48 && rsi <= 72) buyScore += 8;
    if (macdBull) buyScore += 8;
    if (volRatio >= 1.15) buyScore += 6;

    let sellScore = 50;
    if (q.price < vwap) sellScore += 14;
    if (q.percentChange < -0.35) sellScore += 10;
    if (q.percentChange < -1.0) sellScore += 6;
    if (rsi <= 46 || rsi >= 76) sellScore += 8;
    if (!macdBull) sellScore += 8;
    if (volRatio >= 1.15 && q.percentChange < 0) sellScore += 6;

    const action: 'BUY' | 'SELL' = buyScore >= sellScore ? 'BUY' : 'SELL';
    const confidence = Math.min(93, Math.max(66, Math.max(buyScore, sellScore)));
    const entry = q.price;
    const target = action === 'BUY' ? entry * 1.018 : entry * 0.982;
    const sl =
      action === 'BUY'
        ? Math.min(entry * 0.99, vwap * 0.996)
        : Math.max(entry * 1.01, vwap * 1.004);

    const art = matchHeadline(equityNews, [q.ticker, q.sector, q.name.split(' ')[0]]);
    const vwapDiffPct = vwap > 0 ? Number((((q.price - vwap) / vwap) * 100).toFixed(2)) : 0;

    signals.push({
      id: `intraday-${q.ticker}-${action}`,
      dashboardId: 'intraday',
      dashboardLabel: '03. Intraday NSE',
      symbol: q.ticker,
      name: q.name,
      action,
      priceLabel: fmtInr(q.price),
      changePct: q.percentChange,
      entryZone: fmtInr(entry),
      targetZone: fmtInr(Number(target.toFixed(2))),
      stopLossZone: fmtInr(Number(sl.toFixed(2))),
      confidence,
      timeframe: 'Intraday 5m / 15m',
      rationale: `${
        action === 'BUY' ? 'Bullish buyer absorption' : 'Bearish supply pressure'
      }: Price trading ${vwapDiffPct >= 0 ? '+' : ''}${vwapDiffPct}% vs VWAP (${fmtInr(vwap)}), RSI(14) at ${rsi}, MACD ${
        macdBull ? 'positive crossover' : 'bearish slope'
      }, volume ${volRatio}x avg (${q.orderFlowLabel}).`,
      newsCatalyst: art ? `${art.title} (${art.source})` : 'Live NSE 5-minute order-flow breakout scan',
      newsSource: art?.source,
      newsLink: art?.link,
      rankScore: confidence + Math.abs(q.percentChange) * 4 + (volRatio >= 1.2 ? 6 : 0),
    });
  }

  for (const r of globalSettled) {
    if (r.status !== 'fulfilled') continue;
    const q = r.value;
    const rsi = q.rsi14 ?? 50;
    const vwap = q.vwap ?? q.price;
    const isBuy = q.percentChange >= 0 || (q.price >= vwap && rsi < 70);
    const action: 'BUY' | 'SELL' = isBuy ? 'BUY' : 'SELL';
    const confidence = Math.min(89, Math.round(70 + Math.abs(q.percentChange) * 5));
    const entry = q.price;
    const target = isBuy ? entry * 1.012 : entry * 0.988;
    const sl = isBuy ? entry * 0.993 : entry * 1.007;
    const art = matchHeadline(globalNews, [q.displayName.split(' ')[0], 'commodity', 'gold', 'crude']);

    signals.push({
      id: `intraday24x7-${q.ticker}-${action}`,
      dashboardId: q.symbol === 'GC=F' ? 'gold' : q.symbol === 'SI=F' ? 'silver' : 'commodities',
      dashboardLabel: '24/7 MCX / Global',
      symbol: q.symbol,
      name: q.displayName,
      action,
      priceLabel: fmtUsd(q.price),
      changePct: q.percentChange,
      entryZone: fmtUsd(entry),
      targetZone: fmtUsd(Number(target.toFixed(2))),
      stopLossZone: fmtUsd(Number(sl.toFixed(2))),
      confidence,
      timeframe: '24/7 Global 15m',
      rationale: `${
        action === 'BUY' ? '24/7 global momentum strength' : '24/7 global downside momentum'
      }: Spot ${fmtUsd(q.price)} (${q.percentChange >= 0 ? '+' : ''}${q.percentChange}%) vs session VWAP ${fmtUsd(
        vwap
      )}, RSI(14) ${rsi}.`,
      newsCatalyst: art ? `${art.title} (${art.source})` : '24/7 Global Futures Desk Scan',
      newsSource: art?.source,
      newsLink: art?.link,
      rankScore: confidence + Math.abs(q.percentChange) * 3,
    });
  }

  signals.sort((a, b) => b.rankScore - a.rankScore);
  return signals.slice(0, 8).map(({ rankScore: _rank, ...rest }) => rest);
}

export async function buildMorningAllDashboardsSignals(
  deps: MailAlertsDependencies
): Promise<TradeAlertSignal[]> {
  const [
    stockNews,
    macroNews,
    mfSettled,
    niftyR,
    bankNiftyR,
    vixR,
    etfSettled,
    ipoSettled,
    goldR,
    silverR,
    fxR,
    bondSettled,
    commSettled,
    stocksSettled,
  ] = await Promise.all([
    deps.fetchLiveRssArticles('India stocks NIFTY SENSEX RBI mutual funds morning market today'),
    deps.fetchLiveRssArticles('India IPO ETF gold silver G-Sec crude oil news today'),
    Promise.allSettled(deps.mfSchemes.slice(0, 6).map((m) => deps.fetchMutualFundSummary(m))),
    deps.fetchSimpleQuote('^NSEI', '1mo', '1d').catch(() => null),
    deps.fetchSimpleQuote('^NSEBANK', '1mo', '1d').catch(() => null),
    deps.fetchSimpleQuote('^INDIAVIX', '1mo', '1d').catch(() => null),
    Promise.allSettled(
      deps.etfList.slice(0, 5).map(async (e) => ({ ...(await deps.fetchSimpleQuote(e.symbol, '1mo', '1d')), ...e }))
    ),
    Promise.allSettled(
      deps.ipoListedMeta.slice(0, 4).map(async (i) => ({
        ...(await deps.fetchSimpleQuote(i.symbol, '3mo', '1d')),
        ...i,
      }))
    ),
    deps.fetchSimpleQuote('GC=F', '1mo', '1d').catch(() => null),
    deps.fetchSimpleQuote('SI=F', '1mo', '1d').catch(() => null),
    deps.fetchSimpleQuote('INR=X', '1mo', '1d').catch(() => null),
    Promise.allSettled(
      deps.bondSymbols
        .filter((b) => !b.symbol.startsWith('^'))
        .slice(0, 4)
        .map(async (b) => ({
          ...(await deps.fetchSimpleQuote(b.symbol, '1mo', '1d')),
          ...b,
        }))
    ),
    Promise.allSettled(
      deps.commoditySymbols.slice(0, 3).map(async (c) => ({
        ...(await deps.fetchSimpleQuote(c.symbol, '1mo', '1d')),
        ...c,
      }))
    ),
    Promise.allSettled(
      deps.defaultUniverse.slice(0, 8).map(async (s) => ({
        ...(await deps.fetchSimpleQuote(s.symbol, '3mo', '1d')),
        ...s,
      }))
    ),
  ]);

  const signals: TradeAlertSignal[] = [];

  const stockQuotes = stocksSettled
    .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
    .map((r) => r.value)
    .sort((a, b) => (b.flowScore ?? 0) - (a.flowScore ?? 0));

  for (const sq of stockQuotes.slice(0, 2)) {
    const isBuy =
      sq.percentChange >= 0 && (sq.sma20 === null || sq.price >= sq.sma20 * 0.99);
    const action: 'BUY' | 'SELL' = isBuy ? 'BUY' : 'SELL';
    const art = matchHeadline(stockNews, [sq.ticker, sq.sector, 'NIFTY']);
    signals.push({
      id: `morning-stocks-${sq.ticker}`,
      dashboardId: 'stocks',
      dashboardLabel: '01. Stocks',
      symbol: sq.ticker,
      name: sq.name,
      action,
      priceLabel: fmtInr(sq.price),
      changePct: sq.percentChange,
      entryZone: fmtInr(sq.price),
      targetZone: fmtInr(Number((sq.price * (isBuy ? 1.045 : 0.955)).toFixed(2))),
      stopLossZone: fmtInr(Number((sq.price * (isBuy ? 0.975 : 1.025)).toFixed(2))),
      confidence: Math.min(91, Math.round(74 + Math.min(14, Math.abs(sq.percentChange) * 4))),
      timeframe: '9:00 AM Swing (5–15 Days)',
      rationale: `${sq.capTier || 'NSE Core'} ${sq.sector}: Price ${fmtInr(sq.price)} vs 20-DMA ${
        sq.sma20 ? fmtInr(sq.sma20) : 'N/A'
      }, RSI(14) ${sq.rsi14 ?? 'N/A'}, flow: ${sq.orderFlowLabel}.`,
      newsCatalyst: art ? `${art.title} (${art.source})` : 'Morning institutional delivery & DMA scan',
      newsSource: art?.source,
      newsLink: art?.link,
    });
  }

  const topMf = mfSettled
    .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
    .map((r) => r.value)
    .sort((a, b) => (b.return1y ?? 0) - (a.return1y ?? 0))[0];
  if (topMf) {
    const mfAction: 'BUY' | 'WATCH' = (topMf.return1y ?? 0) >= 8 ? 'BUY' : 'WATCH';
    const art = matchHeadline(stockNews, ['mutual fund', 'SIP', 'AMFI']);
    signals.push({
      id: `morning-mf-${topMf.schemeCode}`,
      dashboardId: 'mutual-funds',
      dashboardLabel: '02. Mutual Funds',
      symbol: `AMFI ${topMf.schemeCode}`,
      name: topMf.schemeName,
      action: mfAction,
      priceLabel: `NAV ₹${topMf.nav}`,
      changePct: topMf.dayChangePct,
      entryZone: `SIP / Lumpsum @ NAV ₹${topMf.nav}`,
      targetZone: `1Y Benchmark Beat (${topMf.return1y ?? 'N/A'}% trailing 1Y)`,
      stopLossZone: `Expense ${topMf.expenseRatio}% · ${topMf.riskRating}`,
      confidence: 82,
      timeframe: 'SIP / Medium–Long Term',
      rationale: `Leading AMFI fund house ${topMf.fundHouse} (${topMf.category}) with 1Y return ${
        topMf.return1y ?? 'N/A'
      }% and 3Y CAGR ${topMf.return3y ?? 'N/A'}% vs ${topMf.benchmark}.`,
      newsCatalyst: art ? `${art.title} (${art.source})` : `AMFI daily NAV update (${topMf.navDate})`,
      newsSource: art?.source,
      newsLink: art?.link,
    });
  }

  if (niftyR) {
    const vixVal = vixR?.price ?? 14;
    const isBullFno = niftyR.percentChange >= 0;
    const atm = Math.round(niftyR.price / 50) * 50;
    const sigmaMove = Math.round((niftyR.price * (vixVal / Math.sqrt(252))) / 100);
    const art = matchHeadline(stockNews, ['NIFTY', 'F&O', 'VIX', 'expiry']);
    signals.push({
      id: 'morning-fno-nifty',
      dashboardId: 'fno',
      dashboardLabel: '04. Futures & Options',
      symbol: `NIFTY ${atm} ${isBullFno ? 'CE' : 'PE'}`,
      name: `NIFTY 50 Spot & ${bankNiftyR ? 'Bank Nifty' : 'VIX'} Desk`,
      action: isBullFno ? 'BUY' : 'SELL',
      priceLabel: niftyR.price.toLocaleString('en-IN'),
      changePct: niftyR.percentChange,
      entryZone: `${atm} ATM Strike`,
      targetZone: `${isBullFno ? atm + sigmaMove : atm - sigmaMove}`,
      stopLossZone: `${isBullFno ? atm - Math.round(sigmaMove * 0.65) : atm + Math.round(sigmaMove * 0.65)}`,
      confidence: 78,
      timeframe: '9:15 AM Opening Derivative Session',
      rationale: `India VIX at ${vixVal.toFixed(2)} implies ±${sigmaMove} pts 1-sigma daily range around ${atm} ATM; ${
        isBullFno ? 'long bias above VWAP' : 'defensive hedge below support'
      }.`,
      newsCatalyst: art ? `${art.title} (${art.source})` : 'Morning OI & VIX implied range setup',
      newsSource: art?.source,
      newsLink: art?.link,
    });
  }

  const topEtf = etfSettled
    .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
    .map((r) => r.value)
    .sort((a, b) => (b.flowScore ?? 0) - (a.flowScore ?? 0))[0];
  if (topEtf) {
    const etfAction: 'BUY' | 'SELL' = topEtf.percentChange >= -0.25 ? 'BUY' : 'SELL';
    const art = matchHeadline(macroNews, ['ETF', 'NIFTY', 'passive']);
    signals.push({
      id: `morning-etf-${topEtf.ticker}`,
      dashboardId: 'etfs',
      dashboardLabel: '05. ETFs',
      symbol: topEtf.ticker,
      name: topEtf.name,
      action: etfAction,
      priceLabel: fmtInr(topEtf.price),
      changePct: topEtf.percentChange,
      entryZone: fmtInr(topEtf.price),
      targetZone: fmtInr(Number((topEtf.price * (etfAction === 'BUY' ? 1.03 : 0.97)).toFixed(2))),
      stopLossZone: fmtInr(Number((topEtf.price * (etfAction === 'BUY' ? 0.985 : 1.015)).toFixed(2))),
      confidence: 79,
      timeframe: '9:00 AM Allocation Desk',
      rationale: `${topEtf.category} with ultra-low ${topEtf.expenseRatio}% TER and high NSE orderbook liquidity (${topEtf.orderFlowLabel}).`,
      newsCatalyst: art ? `${art.title} (${art.source})` : 'Low tracking-error NSE ETF flow signal',
      newsSource: art?.source,
      newsLink: art?.link,
    });
  }

  const openOrPipelineIpo = deps.ipoPipelineMeta.find((p) => p.status === 'Open');
  const topListedIpo = ipoSettled
    .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
    .map((r) => r.value)
    .sort((a, b) => (b.flowScore ?? 0) - (a.flowScore ?? 0))[0];
  const ipoArt = matchHeadline(macroNews, ['IPO', 'listing', 'SEBI']);
  if (openOrPipelineIpo) {
    signals.push({
      id: `morning-ipo-open`,
      dashboardId: 'ipo',
      dashboardLabel: '06. IPO',
      symbol: 'PRIMARY IPO',
      name: openOrPipelineIpo.companyName,
      action: 'BUY',
      priceLabel: openOrPipelineIpo.priceBand,
      changePct: null,
      entryZone: openOrPipelineIpo.priceBand,
      targetZone: `Watch QIB/NII demand (${openOrPipelineIpo.subscriptionTotal})`,
      stopLossZone: `Window: ${openOrPipelineIpo.openDate}`,
      confidence: 80,
      timeframe: 'Primary Subscription Morning Alert',
      rationale: `Active ${openOrPipelineIpo.sector} IPO window with subscription demand at ${openOrPipelineIpo.subscriptionTotal}.`,
      newsCatalyst: ipoArt ? `${ipoArt.title} (${ipoArt.source})` : 'Active SEBI mainboard IPO watch',
      newsSource: ipoArt?.source,
      newsLink: ipoArt?.link,
    });
  } else if (topListedIpo) {
    const isIpoBuy = topListedIpo.percentChange >= 0;
    signals.push({
      id: `morning-ipo-${topListedIpo.ticker}`,
      dashboardId: 'ipo',
      dashboardLabel: '06. IPO',
      symbol: topListedIpo.ticker,
      name: topListedIpo.name,
      action: isIpoBuy ? 'BUY' : 'SELL',
      priceLabel: fmtInr(topListedIpo.price),
      changePct: topListedIpo.percentChange,
      entryZone: fmtInr(topListedIpo.price),
      targetZone: fmtInr(Number((topListedIpo.price * (isIpoBuy ? 1.05 : 0.95)).toFixed(2))),
      stopLossZone: fmtInr(Number((topListedIpo.price * (isIpoBuy ? 0.97 : 1.03)).toFixed(2))),
      confidence: 77,
      timeframe: 'Post-Listing Flow Alert',
      rationale: `${topListedIpo.sector} recent listing (${topListedIpo.subscriptionTotal} sub) showing ${topListedIpo.orderFlowLabel} at ${fmtInr(topListedIpo.price)}.`,
      newsCatalyst: ipoArt ? `${ipoArt.title} (${ipoArt.source})` : 'Recent NSE mainboard IPO momentum',
      newsSource: ipoArt?.source,
      newsLink: ipoArt?.link,
    });
  }

  if (goldR) {
    const fxRate = fxR?.price ?? 84.5;
    const parity10g = Math.round((goldR.price / 31.1035) * 10 * fxRate);
    const goldBuy = goldR.percentChange >= -0.3;
    const goldArt = matchHeadline(macroNews, ['gold', 'COMEX', 'bullion']);
    signals.push({
      id: 'morning-gold',
      dashboardId: 'gold',
      dashboardLabel: '07. Gold',
      symbol: 'GOLD 24K',
      name: 'Gold 24K India Parity / GOLDBEES',
      action: goldBuy ? 'BUY' : 'SELL',
      priceLabel: `${fmtInr(parity10g)} / 10g`,
      changePct: goldR.percentChange,
      entryZone: fmtInr(parity10g),
      targetZone: fmtInr(Math.round(parity10g * (goldBuy ? 1.022 : 0.978))),
      stopLossZone: fmtInr(Math.round(parity10g * (goldBuy ? 0.988 : 1.012))),
      confidence: 80,
      timeframe: '9:00 AM Bullion Desk',
      rationale: `COMEX Spot $${goldR.price} (${goldR.percentChange >= 0 ? '+' : ''}${
        goldR.percentChange
      }%) with USD/INR at ₹${fxRate.toFixed(2)} sets 24K parity near ${fmtInr(parity10g)}/10g.`,
      newsCatalyst: goldArt ? `${goldArt.title} (${goldArt.source})` : 'COMEX + USD/INR parity model',
      newsSource: goldArt?.source,
      newsLink: goldArt?.link,
    });
  }

  if (silverR) {
    const fxRate = fxR?.price ?? 84.5;
    const parityKg = Math.round((silverR.price / 31.1035) * 1000 * fxRate);
    const silverBuy = silverR.percentChange >= 0;
    const silverArt = matchHeadline(macroNews, ['silver', 'precious', 'COMEX']);
    signals.push({
      id: 'morning-silver',
      dashboardId: 'silver',
      dashboardLabel: '08. Silver',
      symbol: 'SILVER 1KG',
      name: 'Silver Parity / SILVERBEES',
      action: silverBuy ? 'BUY' : 'SELL',
      priceLabel: `${fmtInr(parityKg)} / kg`,
      changePct: silverR.percentChange,
      entryZone: fmtInr(parityKg),
      targetZone: fmtInr(Math.round(parityKg * (silverBuy ? 1.03 : 0.97))),
      stopLossZone: fmtInr(Math.round(parityKg * (silverBuy ? 0.982 : 1.018))),
      confidence: 76,
      timeframe: '9:00 AM Precious Metals',
      rationale: `COMEX Silver $${silverR.price} (${silverR.percentChange >= 0 ? '+' : ''}${
        silverR.percentChange
      }%) translates to ${fmtInr(parityKg)}/kg Indian parity.`,
      newsCatalyst: silverArt ? `${silverArt.title} (${silverArt.source})` : 'Industrial solar & silver flow',
      newsSource: silverArt?.source,
      newsLink: silverArt?.link,
    });
  }

  const topBond = bondSettled
    .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
    .map((r) => r.value)[0];
  if (topBond) {
    const bondArt = matchHeadline(stockNews, ['RBI', 'bond', 'yield', 'G-Sec']);
    signals.push({
      id: `morning-bonds-${topBond.ticker}`,
      dashboardId: 'bonds',
      dashboardLabel: '09. Bonds',
      symbol: topBond.ticker,
      name: topBond.name,
      action: 'BUY',
      priceLabel: fmtInr(topBond.price),
      changePct: topBond.percentChange,
      entryZone: fmtInr(topBond.price),
      targetZone: 'Accrual + RBI duration stability',
      stopLossZone: 'AAA / Sovereign Grade',
      confidence: 81,
      timeframe: 'Fixed Income Core Morning Brief',
      rationale: `${topBond.category} holding steady at ${fmtInr(topBond.price)} (${
        topBond.percentChange >= 0 ? '+' : ''
      }${topBond.percentChange}%) for liquidity & Sovereign/G-Sec yield capture.`,
      newsCatalyst: bondArt ? `${bondArt.title} (${bondArt.source})` : 'RBI G-Sec & Debt ETF tracking',
      newsSource: bondArt?.source,
      newsLink: bondArt?.link,
    });
  }

  const topComm = commSettled
    .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
    .map((r) => r.value)
    .sort((a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange))[0];
  if (topComm) {
    const commBuy = topComm.percentChange >= 0;
    const commArt = matchHeadline(macroNews, ['crude', 'oil', 'gas', 'copper']);
    signals.push({
      id: `morning-comm-${topComm.ticker}`,
      dashboardId: 'commodities',
      dashboardLabel: '10. Commodities',
      symbol: topComm.symbol,
      name: topComm.name,
      action: commBuy ? 'BUY' : 'SELL',
      priceLabel: fmtUsd(topComm.price),
      changePct: topComm.percentChange,
      entryZone: fmtUsd(topComm.price),
      targetZone: fmtUsd(Number((topComm.price * (commBuy ? 1.022 : 0.978)).toFixed(2))),
      stopLossZone: fmtUsd(Number((topComm.price * (commBuy ? 0.985 : 1.015)).toFixed(2))),
      confidence: 77,
      timeframe: 'MCX Morning Commodities Brief',
      rationale: `${topComm.category} (${topComm.unit}) moved ${commBuy ? '+' : ''}${
        topComm.percentChange
      }% vs session close, guiding Indian upstream/OMCs & MCX parity.`,
      newsCatalyst: commArt ? `${commArt.title} (${commArt.source})` : 'Global energy & metals morning cue',
      newsSource: commArt?.source,
      newsLink: commArt?.link,
    });
  }

  return signals;
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildEmailContent(
  kind: 'intraday' | 'morning' | 'combined',
  intradaySignals: TradeAlertSignal[],
  morningSignals: TradeAlertSignal[]
) {
  const clock = getIstClock();
  const list =
    kind === 'intraday'
      ? intradaySignals
      : kind === 'morning'
        ? morningSignals
        : [...intradaySignals.slice(0, 4), ...morningSignals];

  const buyCount = list.filter((s) => s.action === 'BUY').length;
  const sellCount = list.filter((s) => s.action === 'SELL').length;

  const subject =
    kind === 'intraday'
      ? `CINFI 24/7 Intraday Alert: ${buyCount} BUY · ${sellCount} SELL Signals (${clock.timeStr} IST)`
      : kind === 'morning'
        ? `CINFI 9:00 AM Market Briefing: ${buyCount} BUY · ${sellCount} SELL Across 9 Desks (${clock.dateStr})`
        : `CINFI Buy & Sell Research Alert: ${buyCount} BUY · ${sellCount} SELL (${clock.dateStr} ${clock.timeStr} IST)`;

  const rowsHtml = list
    .map((sig) => {
      const actionBg =
        sig.action === 'BUY' ? '#059669' : sig.action === 'SELL' ? '#e11d48' : '#0284c7';
      const pctText =
        sig.changePct !== null ? `${sig.changePct >= 0 ? '+' : ''}${sig.changePct}%` : 'Primary';
      return `
        <tr>
          <td style="padding:14px;border-bottom:1px solid #e2e8f0;vertical-align:top;">
            <div style="margin-bottom:6px;">
              <span style="display:inline-block;background:${actionBg};color:#ffffff;font-weight:700;font-size:11px;padding:3px 8px;border-radius:4px;letter-spacing:0.4px;">${sig.action}</span>
              <span style="font-size:12px;color:#475569;font-weight:600;margin-left:8px;">${escapeHtml(sig.dashboardLabel)} · ${escapeHtml(sig.timeframe)}</span>
            </div>
            <div style="font-size:15px;font-weight:700;color:#0f172a;">
              ${escapeHtml(sig.symbol)} — ${escapeHtml(sig.name)}
              <span style="font-family:monospace;font-size:13px;color:#0f172a;margin-left:6px;">(${escapeHtml(sig.priceLabel)}, ${escapeHtml(pctText)})</span>
            </div>
            <div style="margin-top:6px;font-size:12px;color:#0f172a;font-family:monospace;">
              <strong>Entry:</strong> ${escapeHtml(sig.entryZone)} &nbsp;|&nbsp;
              <strong>Target:</strong> ${escapeHtml(sig.targetZone)} &nbsp;|&nbsp;
              <strong>Stop-Loss:</strong> ${escapeHtml(sig.stopLossZone)} &nbsp;|&nbsp;
              <strong>Confidence:</strong> ${sig.confidence}%
            </div>
            <div style="margin-top:6px;font-size:13px;color:#334155;line-height:1.45;">
              ${escapeHtml(sig.rationale)}
            </div>
            <div style="margin-top:5px;font-size:12px;color:#0d9488;">
              Research Catalyst: ${
                sig.newsLink
                  ? `<a href="${escapeHtml(sig.newsLink)}" style="color:#0d9488;text-decoration:underline;">${escapeHtml(sig.newsCatalyst)}</a>`
                  : escapeHtml(sig.newsCatalyst)
              }
            </div>
          </td>
        </tr>`;
    })
    .join('\n');

  const html = `
  <div style="font-family:'DM Sans',Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a;">
    <div style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <div style="background:#0B1D26;color:#ffffff;padding:20px 24px;">
        <div style="font-size:12px;color:#5eead4;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;">
          CINFI Stocks · Research-Backed Trade Desk
        </div>
        <h1 style="margin:6px 0 4px;font-size:20px;font-weight:800;color:#ffffff;">
          ${escapeHtml(subject)}
        </h1>
        <div style="font-size:12px;color:#cbd5e1;">
          Generated: ${escapeHtml(clock.dateStr)} at ${escapeHtml(clock.timeStr)} IST · Live Exchange + Quantitative Technicals + Wire News
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ${rowsHtml}
      </table>
      <div style="background:#f1f5f9;padding:16px 24px;font-size:12px;color:#475569;">
        <div><strong>CINFI Stocks - build by Chandu Datla</strong></div>
        <div style="margin-top:4px;">Automated research-backed market alerts for informational analysis. Verify live exchange quotes & risk limits before order execution.</div>
      </div>
    </div>
  </div>`;

  const text = [
    subject,
    `Generated: ${clock.dateStr} ${clock.timeStr} IST`,
    '',
    ...list.map(
      (s) =>
        `[${s.action}] ${s.symbol} (${s.name}) — ${s.priceLabel} | Entry: ${s.entryZone} | Target: ${s.targetZone} | SL: ${s.stopLossZone} | Confidence: ${s.confidence}%\n  ${s.rationale}\n  News: ${s.newsCatalyst}`
    ),
    '',
    'CINFI Stocks - build by Chandu Datla',
  ].join('\n');

  return { subject, html, text, list };
}

function encodeBase64Url(input: string): string {
  return Buffer.from(input, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function dispatchViaGmailApi(
  accessToken: string,
  recipients: string[],
  subject: string,
  html: string,
  text: string
) {
  const boundary = `cinfi_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject, 'utf8').toString('base64')}?=`;
  const rawMime = [
    `To: ${recipients.join(', ')}`,
    `Subject: ${encodedSubject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(text, 'utf8').toString('base64'),
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(html, 'utf8').toString('base64'),
    '',
    `--${boundary}--`,
  ].join('\r\n');

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: encodeBase64Url(rawMime),
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    const isAuthErr = res.status === 401 || res.status === 403;
    const err: any = new Error(`Gmail API HTTP ${res.status}: ${errText}`);
    err.needsAuth = isAuthErr;
    err.status = res.status;
    throw err;
  }

  return await res.json();
}

async function dispatchViaSmtp(
  recipients: string[],
  subject: string,
  html: string,
  text: string
) {
  const host = process.env.SMTP_HOST?.trim() || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || '465');
  const user = process.env.SMTP_USER?.trim() || '';
  const pass = process.env.SMTP_PASS?.trim() || '';
  const from = process.env.ALERT_FROM_EMAIL?.trim() || user;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return await transporter.sendMail({
    from: `"CINFI Stocks Alerts" <${from}>`,
    to: recipients.join(', '),
    subject,
    text,
    html,
  });
}

export async function dispatchResearchAlertEmail(opts: {
  kind: 'intraday' | 'morning' | 'combined';
  triggerType: MailAlertLogEntry['triggerType'];
  accessToken?: string | null;
  transport?: 'auto' | 'gmail' | 'smtp';
  deps: MailAlertsDependencies;
}) {
  const recipients = [...alertConfigState.recipients];
  if (recipients.length === 0) {
    throw new Error('No recipient email addresses configured');
  }

  const intradaySignals =
    opts.kind === 'intraday' || opts.kind === 'combined'
      ? await buildIntradayBuySellSignals(opts.deps)
      : [];
  const morningSignals =
    opts.kind === 'morning' || opts.kind === 'combined'
      ? await buildMorningAllDashboardsSignals(opts.deps)
      : [];

  const { subject, html, text, list } = buildEmailContent(
    opts.kind,
    intradaySignals,
    morningSignals
  );
  const topSignals = list.slice(0, 4).map((s) => `${s.action} ${s.symbol}`);

  const preferSmtp =
    (opts.transport === 'smtp' || (opts.transport !== 'gmail' && !opts.accessToken)) &&
    isSmtpConfigured();

  if (opts.accessToken && opts.transport !== 'smtp') {
    try {
      const result = await dispatchViaGmailApi(opts.accessToken, recipients, subject, html, text);
      if (opts.kind === 'morning' || opts.kind === 'combined') {
        alertConfigState.lastMorningSentDate = getIstClock().yyyyMmDd;
      }
      if (opts.kind === 'intraday' || opts.kind === 'combined') {
        alertConfigState.lastIntradaySentAt = new Date().toISOString();
      }
      for (const existing of deliveryLogs) {
        if (existing.status === 'queued' && (opts.kind === 'combined' || existing.kind === opts.kind)) {
          existing.status = 'sent';
          existing.detail = 'Dispatched via active Gmail session';
        }
      }
      savePersistedState();
      const log = appendLog({
        kind: opts.kind,
        triggerType: opts.triggerType,
        transport: 'gmail',
        recipients,
        subject,
        signalCount: list.length,
        topSignals,
        status: 'sent',
        detail: `Gmail Message ID: ${result?.id || 'sent'}`,
      });
      return { ok: true, log };
    } catch (err: any) {
      if (err?.needsAuth || !isSmtpConfigured()) {
        appendLog({
          kind: opts.kind,
          triggerType: opts.triggerType,
          transport: 'gmail',
          recipients,
          subject,
          signalCount: list.length,
          topSignals,
          status: 'failed',
          detail: err?.message || 'Gmail authorization required',
        });
        throw err;
      }
    }
  }

  if (preferSmtp || isSmtpConfigured()) {
    const info = await dispatchViaSmtp(recipients, subject, html, text);
    if (opts.kind === 'morning' || opts.kind === 'combined') {
      alertConfigState.lastMorningSentDate = getIstClock().yyyyMmDd;
    }
    if (opts.kind === 'intraday' || opts.kind === 'combined') {
      alertConfigState.lastIntradaySentAt = new Date().toISOString();
    }
    for (const existing of deliveryLogs) {
      if (existing.status === 'queued' && (opts.kind === 'combined' || existing.kind === opts.kind)) {
        existing.status = 'sent';
        existing.detail = 'Dispatched via background SMTP';
      }
    }
    savePersistedState();
    const log = appendLog({
      kind: opts.kind,
      triggerType: opts.triggerType,
      transport: 'smtp',
      recipients,
      subject,
      signalCount: list.length,
      topSignals,
      status: 'sent',
      detail: `SMTP Message ID: ${info?.messageId || 'delivered'}`,
    });
    return { ok: true, log };
  }

  const err: any = new Error(
    'Please sign in with Google to authorize Gmail delivery, or configure SMTP_USER/SMTP_PASS for unattended background dispatch.'
  );
  err.needsAuth = true;
  err.status = 401;
  throw err;
}

let schedulerStarted = false;
let schedulerTickInFlight: Promise<{ triggeredMorning: boolean; triggeredIntraday: boolean }> | null =
  null;

export async function runMailAlertSchedulerTick(deps: MailAlertsDependencies) {
  if (schedulerTickInFlight) {
    return schedulerTickInFlight;
  }
  schedulerTickInFlight = runMailAlertSchedulerTickInternal(deps).finally(() => {
    schedulerTickInFlight = null;
  });
  return schedulerTickInFlight;
}

async function runMailAlertSchedulerTickInternal(deps: MailAlertsDependencies) {
  const clock = getIstClock();
  let triggeredMorning = false;
  let triggeredIntraday = false;

  const isMorningDayEligible = alertConfigState.morningDailyEveryDay || clock.isTradingDay;
  // Morning 9:00 AM IST window (fires once per day at or after 09:00 AM IST if not yet generated today)
  if (
    alertConfigState.morning9AmIstEnabled &&
    isMorningDayEligible &&
    clock.hour >= 9 &&
    clock.hour < 16 &&
    alertConfigState.lastMorningSentDate !== clock.yyyyMmDd
  ) {
    alertConfigState.lastMorningSentDate = clock.yyyyMmDd;
    savePersistedState();
    triggeredMorning = true;

    if (isSmtpConfigured()) {
      await dispatchResearchAlertEmail({
        kind: 'morning',
        triggerType: 'scheduler-9am-ist',
        transport: 'smtp',
        deps,
      });
    } else {
      const morningSignals = await buildMorningAllDashboardsSignals(deps);
      const { subject, list } = buildEmailContent('morning', [], morningSignals);
      appendLog({
        kind: 'morning',
        triggerType: 'scheduler-9am-ist',
        transport: 'queued',
        recipients: [...alertConfigState.recipients],
        subject,
        signalCount: list.length,
        topSignals: list.slice(0, 4).map((s) => `${s.action} ${s.symbol}`),
        status: 'queued',
        detail:
          '09:00 AM IST briefing ready — delivers via connected Gmail session or background SMTP.',
      });
    }
  }

  // 24/7 Intraday high-conviction BUY / SELL scanner
  if (alertConfigState.intraday24x7Enabled) {
    const intradaySignals = await buildIntradayBuySellSignals(deps);
    const nowMs = Date.now();
    const freshHighConviction = intradaySignals.filter((sig) => {
      if (sig.confidence < alertConfigState.minConfidence) return false;
      const key = `${sig.symbol}:${sig.action}`;
      const prev = signalCooldownMap.get(key) || 0;
      return nowMs - prev >= COOLDOWN_MS;
    });

    if (freshHighConviction.length > 0) {
      for (const sig of freshHighConviction) {
        signalCooldownMap.set(`${sig.symbol}:${sig.action}`, nowMs);
      }
      alertConfigState.lastIntradaySentAt = new Date().toISOString();
      savePersistedState();
      triggeredIntraday = true;

      if (isSmtpConfigured()) {
        await dispatchResearchAlertEmail({
          kind: 'intraday',
          triggerType: 'scheduler-24x7',
          transport: 'smtp',
          deps,
        });
      } else {
        const { subject } = buildEmailContent('intraday', freshHighConviction, []);
        appendLog({
          kind: 'intraday',
          triggerType: 'scheduler-24x7',
          transport: 'queued',
          recipients: [...alertConfigState.recipients],
          subject,
          signalCount: freshHighConviction.length,
          topSignals: freshHighConviction.slice(0, 4).map((s) => `${s.action} ${s.symbol}`),
          status: 'queued',
          detail:
            '24/7 Intraday trigger detected — auto-delivers via connected Gmail session or background SMTP.',
        });
      }
    }
  }

  return { triggeredMorning, triggeredIntraday };
}

export function startMailAlertScheduler(deps: MailAlertsDependencies) {
  if (schedulerStarted) return;
  schedulerStarted = true;

  const safeTick = async () => {
    try {
      await runMailAlertSchedulerTick(deps);
    } catch (err) {
      console.warn('Mail alert scheduler tick warning:', err);
    }
  };

  setTimeout(() => {
    void safeTick();
  }, 12_000);
  setInterval(() => {
    void safeTick();
  }, 5 * 60 * 1000);
}
