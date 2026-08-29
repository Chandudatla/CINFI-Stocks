export type NavigationTab = 
  | 'dashboard'
  | 'stocks'
  | 'themes'
  | 'screener'
  | 'compare'
  | 'backtest'
  | 'watchlist'
  | 'alerts'
  | 'evidence'
  | 'news'
  | 'learn';

export type AlertType = 'PRICE_ABOVE' | 'PRICE_BELOW' | 'PERCENT_CHANGE_UP' | 'PERCENT_CHANGE_DOWN' | 'RSI_OVERSOLD' | 'RSI_OVERBOUGHT' | 'GOLDEN_CROSS' | 'AI_SCORE_ABOVE' | 'VOLUME_SURGE';

export interface SmartAlert {
  id: string;
  stockId: string;
  stockSymbol: string;
  stockName: string;
  type: AlertType;
  category: 'Price' | 'Trend' | 'AI Score' | 'Volume';
  targetValue?: number;
  conditionDescription: string;
  currentValueDescription: string;
  note?: string;
  isActive: boolean;
  isTriggered: boolean;
  triggeredAt?: string;
  createdAt: string;
  frequency: 'once' | 'recurring';
}

export type UserMode = 'beginner' | 'analyst';

export interface MarketIndex {
  name: string;
  symbol: string;
  current: number;
  change: number;
  percentChange: number;
  high52w: number;
  low52w: number;
  volume: string;
}

export interface ScoreComponent {
  name: string;
  weight: number;
  score: number;
  benchmarkScore: number;
  description: string;
  methodology: string;
  sourceData: string;
  confidence: 'Very High' | 'High' | 'Medium';
}

export interface FutureThemeExposure {
  themeId: string;
  themeName: string;
  category: string;
  exposureScore: number; // 0-100
  confidence: number;
  justification: string;
  revenueContributionPct?: number;
  evidenceRef: string;
}

export interface EvidenceCitation {
  id: string;
  claim: string;
  sourceTier: 1 | 2 | 3;
  sourceName: string;
  documentType: string;
  documentDate: string;
  pageOrSection: string;
  rawExcerpt: string;
  confidenceLevel: 'VERY_HIGH' | 'HIGH' | 'MEDIUM';
  verified: boolean;
}

export interface FinancialMetricYear {
  year: string;
  revenue: number; // In Cr
  ebitda: number;
  netProfit: number;
  eps: number;
  roce: number;
  roe: number;
  debtToEquity: number;
  freeCashFlow: number;
  operatingCashFlow: number;
}

export interface ShareholdingPattern {
  quarter: string;
  promoter: number;
  promoterPledged: number;
  fii: number;
  dii: number;
  mutualFunds: number;
  publicRetail: number;
}

export interface TechnicalIndicators {
  rsi14: number;
  rsiSignal: 'Oversold' | 'Neutral' | 'Overbought';
  macd: { value: number; signal: number; histogram: number; trend: 'Bullish' | 'Bearish' };
  sma50: number;
  sma200: number;
  goldenCross: boolean;
  bollingerBands: { upper: number; middle: number; lower: number };
  atr: number;
  trend: 'Strong Bullish' | 'Bullish' | 'Neutral' | 'Bearish';
  support: number;
  resistance: number;
}

export interface AiScenario {
  thesis: string;
  targetHorizon: string;
  probability: number;
  keyDrivers: string[];
  evidenceIds: string[];
}

export interface NewsItem {
  id: string;
  headline: string;
  date: string;
  source: string;
  sourceTier: 1 | 2 | 3;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  impact: 'High' | 'Medium' | 'Low';
  themeTag?: string;
  summary: string;
  url?: string;
}

export interface CompanyStock {
  id: string;
  symbol: string;
  name: string;
  isin: string;
  sector: string;
  industry: string;
  description: string;
  beginnerSummary: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  marketCapCr: number;
  peRatio: number;
  pbRatio: number;
  evEbitda: number;
  dividendYield: number;
  high52w: number;
  low52w: number;
  volume: string;
  compositeAiScore: number;
  scoreComponents: ScoreComponent[];
  futureThemes: FutureThemeExposure[];
  financials: FinancialMetricYear[];
  shareholding: ShareholdingPattern[];
  technicals: TechnicalIndicators;
  bullCase: AiScenario;
  baseCase: AiScenario;
  bearCase: AiScenario;
  keyRisks: string[];
  evidence: EvidenceCitation[];
  news: NewsItem[];
  socialSentiment: {
    positivePct: number;
    neutralPct: number;
    negativePct: number;
    volumeConfidence: 'High' | 'Medium' | 'Low';
    manipulationRisk: 'Low' | 'Moderate' | 'Elevated';
    organicNotes: string;
  };
  logoUrl?: string;
  brandColor?: string;
  lastUpdated: string;
  dataConfidenceScore: number; // e.g. 96%
}

export interface FutureThemeCategory {
  id: string;
  name: string;
  category: 'Artificial Intelligence' | 'Energy & Transition' | 'Semiconductors & DeepTech' | 'Infrastructure & Mobility' | 'Defence & Space' | 'Critical Materials';
  description: string;
  stockCount: number;
  avgScore: number;
  tailwindHighlights: string[];
  governmentInitiative: string;
  iconName: string;
}

export interface ScreenerFilterState {
  searchQuery: string;
  priceRange: string;
  sector: string;
  theme: string;
  minAiScore: number;
  minRoce: number;
  maxDebtEquity: number;
  minSalesGrowth: number;
  sortBy: 'compositeAiScore' | 'marketCapCr' | 'currentPrice' | 'percentChange' | 'peRatio' | 'roce';
  sortOrder: 'asc' | 'desc';
}
