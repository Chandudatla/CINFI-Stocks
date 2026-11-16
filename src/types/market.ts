export type MarketSessionState = 'OPEN' | 'PRE_OPEN' | 'POST_CLOSE' | 'CLOSED';

export type DashboardId =
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

export type CapTier = 'Large Cap' | 'Mid Cap' | 'Small Cap';

export interface OfficialLinks {
  nse: string;
  bse: string;
  investorRelations: string;
  annualReports: string;
  announcements: string;
}

export interface OfficialSourceLink {
  title: string;
  category: string;
  description: string;
  url: string;
}

export interface MarketStatus {
  status: MarketSessionState;
  statusLabel: string;
  isLive: boolean;
  istTime: string;
  istDate: string;
  tradingHours: string;
  exchange: string;
}

export interface IndexQuote {
  symbol: string;
  name: string;
  price: number;
  previousClose: number;
  change: number;
  percentChange: number;
  high52w: number | null;
  low52w: number | null;
  sparkline: number[];
  updatedAt: string;
}

export interface StockQuote {
  symbol: string;
  ticker: string;
  name: string;
  sector: string;
  capTier?: CapTier;
  exchange: string;
  price: number;
  previousClose: number;
  change: number;
  percentChange: number;
  dayHigh: number | null;
  dayLow: number | null;
  high52w: number | null;
  low52w: number | null;
  volume: number | null;
  vwap?: number | null;
  sma20?: number | null;
  sma50?: number | null;
  rsi14?: number | null;
  macd?: number | null;
  macdSignal?: number | null;
  volatilityPct?: number | null;
  volumeRatio?: number | null;
  officialLinks?: OfficialLinks;
  sparkline: number[];
  updatedAt: string;
  isCustom?: boolean;
  category?: string;
  unit?: string;
  currency?: string;
  inrEquivalent?: number | null;
  expenseRatio?: number | null;
  trackingError?: number | null;
  inav?: number | null;
  premiumDiscountPct?: number | null;
  lotSize?: number;
  orderFlowType?: 'buying' | 'selling' | 'neutral';
  orderFlowLabel?: string;
  flowScore?: number;
}

export interface MarketPulseItem {
  id: string;
  label: string;
  value: string;
  changeLabel: string;
  positive: boolean;
  dashboardId: DashboardId;
}

export interface ChartPoint {
  timestamp: number;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number;
  volume: number | null;
}

export type ChartRange = '1m' | '5m' | '15m' | '1d' | '5d' | '1mo' | '3mo' | '1y' | '5y';

export interface StockDetail {
  symbol: string;
  ticker: string;
  name: string;
  exchange: string;
  currency: string;
  price: number;
  previousClose: number;
  open: number | null;
  dayHigh: number | null;
  dayLow: number | null;
  high52w: number | null;
  low52w: number | null;
  volume: number | null;
  change: number;
  percentChange: number;
  vwap?: number | null;
  rsi14?: number | null;
  macd?: number | null;
  macdSignal?: number | null;
  volatilityPct?: number | null;
  range: ChartRange;
  points: ChartPoint[];
  updatedAt: string;
}

export interface SearchHit {
  symbol: string;
  ticker: string;
  name: string;
  exchange: string;
  type: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AiBriefSection {
  title: string;
  points: string[];
}

export interface AiBriefResponse {
  headline: string;
  sentiment: 'Bullish' | 'Constructive' | 'Neutral' | 'Cautious' | 'Bearish';
  summary: string;
  sections: AiBriefSection[];
  sources: GroundingSource[];
  model: string;
  researchMode?: 'ai-grounded' | 'live-quant-news';
  generatedAt: string;
}

export interface StructuredAiBlock {
  label: string;
  content: string;
}

export interface StructuredDashboardAiResponse {
  dashboardType: DashboardId;
  focusLabel: string;
  stance: 'Bullish' | 'Constructive' | 'Neutral' | 'Cautious' | 'Bearish';
  riskScore: number;
  confidence: number;
  summary: string;
  analysisPillars: StructuredAiBlock[];
  expertVerification: StructuredAiBlock[];
  decisionReasons: string[];
  sources: GroundingSource[];
  model: string;
  researchMode?: 'ai-grounded' | 'live-quant-news';
  generatedAt: string;
}

export interface StocksResearchResponse {
  symbol: string;
  companyName: string;
  stockAnalysis: {
    livePriceAnalysis: string;
    technicalAnalysis: string;
    fundamentalAnalysis: string;
    volumeAnalysis: string;
    financialResults: string;
    newsAnalysis: string;
  };
  expertResearch: {
    sebiAnalysts: string;
    verifiedResearch: string;
    opinionTracking: string;
    sourceVerification: string;
    conflictCheck: string;
  };
  decisionEngine: {
    stance: 'Bullish' | 'Bearish' | 'Neutral';
    riskScore: number;
    riskLabel: string;
    investmentHorizon: string;
    confidence: number;
    reasons: string[];
  };
  sources: GroundingSource[];
  model: string;
  researchMode?: 'ai-grounded' | 'live-quant-news';
  generatedAt: string;
}

export interface NewsArticle {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

export interface FuturisticCompany {
  rank: number;
  symbol: string;
  ticker: string;
  name: string;
  sector: string;
  capTier: CapTier;
  themeGroup: string;
  futuristicTheme: string;
  horizon: string;
  reason: string;
  price: number;
  previousClose: number;
  change: number;
  percentChange: number;
  sma20: number | null;
  sma50: number | null;
  rsi14: number | null;
  high52w: number | null;
  low52w: number | null;
  volumeRatio: number | null;
  sparkline: number[];
  officialLinks?: OfficialLinks;
}

export interface FuturisticPick {
  rank: number;
  id: string;
  symbol?: string;
  schemeCode?: string;
  ticker: string;
  name: string;
  categoryLabel: string;
  themeGroup: string;
  futuristicTheme: string;
  horizon: string;
  reason: string;
  price: number | null;
  currencyPrefix: '₹' | '$' | '%' | '';
  change: number | null;
  percentChange: number | null;
  metricLabel?: string;
  metricValue?: string;
  sparkline: number[];
  newsCatalyst: string;
  newsSource?: string;
  newsPubDate?: string;
  newsLink?: string;
  volumeRatio?: number | null;
  orderFlowType?: 'buying' | 'selling' | 'neutral';
  orderFlowLabel?: string;
  flowScore?: number;
}

export interface FuturisticDashboardResponse {
  dashboardType: DashboardId;
  headline: string;
  subtitle: string;
  items: FuturisticPick[];
  earlyNews: NewsArticle[];
  total: number;
  syncedAt: string;
  marketStatus?: MarketStatus;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  ticker: string;
  condition: 'above' | 'below';
  targetPrice: number;
  createdAt: string;
  triggeredAt?: string;
}

export type MfBroadCategory = 'Equity' | 'Debt' | 'Hybrid' | 'Index' | 'Sectoral';

export interface MutualFundSummary {
  schemeCode: string;
  schemeName: string;
  fundHouse: string;
  category: string;
  broadCategory: MfBroadCategory;
  expenseRatio: number;
  benchmark: string;
  fundManager: string;
  riskRating: string;
  amcUrl: string;
  factsheetUrl: string;
  nav: number;
  navDate: string;
  dayChangePct: number;
  return1m: number | null;
  return6m: number | null;
  return1y: number | null;
  return3y: number | null;
  volatilityPct: number | null;
  sparkline: number[];
  orderFlowType?: 'buying' | 'selling' | 'neutral';
  orderFlowLabel?: string;
  flowScore?: number;
}

export interface MutualFundDetail extends MutualFundSummary {
  schemeType?: string;
  schemeCategory?: string;
  points: ChartPoint[];
}

export interface FnoIndexItem extends StockQuote {
  instrumentType: 'Index' | 'Stock';
  lotSize: number;
  levels: {
    atmStrike: number;
    step: number;
    dailySigmaPct: number;
    dailyRange: [number, number];
    weeklyRange: [number, number];
  } | null;
}

export type IpoStatus = 'Upcoming' | 'Open' | 'Closed' | 'Listed';

export interface IpoRecord {
  id: string;
  symbol?: string;
  companyName: string;
  sector: string;
  status: IpoStatus;
  priceBand: string;
  issuePrice: number | null;
  lotSize: number | null;
  issueSizeCr: string;
  openDate: string;
  closeDate: string;
  allotmentDate: string;
  listingDate: string;
  registrar: string;
  registrarUrl: string;
  subscriptionTotal: string;
  livePrice?: number | null;
  listingGainPct?: number | null;
  dayChangePct?: number | null;
  sparkline?: number[];
  volumeRatio?: number | null;
  orderFlowType?: 'buying' | 'selling' | 'neutral';
  orderFlowLabel?: string;
  flowScore?: number;
}

export interface SgbRecord {
  series: string;
  issuePrice: number;
  couponPct: number;
  maturityDate: string;
  liveParity24kPerGram: number | null;
  unrealizedGainPct: number | null;
}

export interface BondReferenceRecord {
  isinName: string;
  issuerType: 'Government Security' | 'Treasury Bill' | 'Corporate Bond' | 'State Development Loan' | 'Listed Debt';
  couponPct: number;
  ytmPct: number;
  maturityDate: string;
  durationYears: number;
  rating: string;
  interestFrequency: string;
}

export interface TradeAlertSignal {
  id: string;
  dashboardId: DashboardId;
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

export interface MailAlertsOverview {
  config: MailAlertScheduleConfig;
  smtpConfigured: boolean;
  istNow: {
    dateStr: string;
    timeStr: string;
    weekday: string;
    isTradingDay: boolean;
  };
  intradaySignals: TradeAlertSignal[];
  morningSignals: TradeAlertSignal[];
  deliveryLogs: MailAlertLogEntry[];
  syncedAt: string;
}

