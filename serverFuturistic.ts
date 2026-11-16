export interface FuturisticSpecBase {
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
  currencyPrefix: '₹' | '$' | '%' | '';
  keywords: string[];
  kind: 'quote' | 'mf' | 'sgb' | 'bond-ref' | 'ipo-pipeline';
  staticPrice?: number | null;
  metricLabel?: string;
  metricValue?: string;
}

export interface DashboardEarlyNewsConfig {
  headline: string;
  subtitle: string;
  queries: string[];
}

export const DASHBOARD_EARLY_NEWS_CFG: Record<string, DashboardEarlyNewsConfig> = {
  stocks: {
    headline: 'Best 20 Futuristic Companies & Investment Reasons',
    subtitle:
      'Live NSE quotes across AI, Semiconductors, Defence Electronics, Clean Energy & Digital Rails — synced with breaking early India news.',
    queries: [
      'Indian stock market NSE breaking news today',
      'BEL HAL Dixon Kaynes Waaree defence semiconductor India news',
    ],
  },
  'mutual-funds': {
    headline: 'Best 20 Futuristic Mutual Funds & Allocation Reasons',
    subtitle:
      '20 live AMFI Direct-Growth schemes across Digital Tech, Healthcare, Flexi-Cap, Mid/Small Growth, Index & Gilt funds updated with early AMFI & SEBI news.',
    queries: [
      'India mutual funds AMFI SIP inflows SEBI news today',
      'Parag Parikh HDFC Nippon Quant mutual fund India news',
    ],
  },
  intraday: {
    headline: 'Best 20 Futuristic Intraday Leaders & Momentum Reasons',
    subtitle:
      '20 high-liquidity NSE stocks ranked for 5-minute VWAP momentum, institutional volume spikes & breaking early-morning catalysts.',
    queries: [
      'Nifty Bank Nifty intraday stocks to watch today India news',
      'NSE volume breakout stocks India market morning update',
    ],
  },
  fno: {
    headline: 'Best 20 Futuristic F&O Underlyings & Derivatives Reasons',
    subtitle:
      '20 liquid NSE F&O index and stock derivatives tracked with live ATM strikes, expected daily move, lot size & early derivative OI news.',
    queries: [
      'Nifty Bank Nifty F&O expiry option chain open interest news India',
      'India VIX NSE futures options market outlook today',
    ],
  },
  etfs: {
    headline: 'Best 20 Futuristic ETFs & Passive Strategy Reasons',
    subtitle:
      '20 live NSE ETFs spanning US Nasdaq/FANG+ AI tech, Nifty/Next-50, Sectoral IT/Auto/Pharma & Bullion with iNAV and low TER advantage.',
    queries: [
      'NSE ETF Nasdaq 100 Nifty Bees Gold ETF India news today',
      'India passive funds index ETF inflows market news',
    ],
  },
  ipo: {
    headline: 'Best 20 Futuristic IPOs & Primary Market Reasons',
    subtitle:
      '20 high-impact newly listed & upcoming DRHP innovators across Solar, EV Mobility, Quick Commerce, Market Infra & ER&D synced with early SEBI IPO news.',
    queries: [
      'India IPO SEBI DRHP GMP listing news today',
      'NSDL Zepto LG Electronics Ather Energy Waaree IPO India news',
    ],
  },
  gold: {
    headline: 'Best 20 Futuristic Gold Assets & Hedge Reasons',
    subtitle:
      '20 live Gold ETFs, global royalty/mining leaders, SGB sovereign parity, jewellery compounders & COMEX bullion updated with early RBI & gold news.',
    queries: [
      'Gold price today India MCX COMEX RBI gold reserves news',
      'Gold ETF Sovereign Gold Bond Titan Kalyan Jewellers news India',
    ],
  },
  silver: {
    headline: 'Best 20 Futuristic Silver & Solar-Tech Picks & Reasons',
    subtitle:
      '20 live Silver ETFs, solar PV glass/cell consumers, Hindustan Zinc & global primary silver miners driven by green-grid industrial demand & early news.',
    queries: [
      'Silver price today MCX COMEX solar industrial demand news',
      'Hindustan Zinc Waaree Premier Energies silver ETF India news',
    ],
  },
  bonds: {
    headline: 'Best 20 Futuristic Bonds, G-Secs & Yield Picks & Reasons',
    subtitle:
      '20 live Gilt ETFs, liquid T-Bill ETFs, Target-Maturity PSU Bharat Bonds, Sovereign G-Secs & US 10Y yield updated with early RBI policy news.',
    queries: [
      'RBI bond yield G-Sec 10 year Treasury India debt market news',
      'India government bond inclusion gilt fund interest rate news',
    ],
  },
  commodities: {
    headline: 'Best 20 Futuristic Transition & Global Commodities & Reasons',
    subtitle:
      '20 live energy-transition metals (Copper, Aluminium, Zinc), crude/natural gas & global agri contracts synced with early MCX & supply-chain news.',
    queries: [
      'Crude oil Brent copper aluminium natural gas MCX India news',
      'Hindustan Copper Hindalco ONGC GAIL commodities news today',
    ],
  },
};

export const MUTUAL_FUNDS_FUTURISTIC_SPECS: FuturisticSpecBase[] = [
  {
    rank: 1,
    id: 'mf-122639',
    schemeCode: '122639',
    ticker: 'PPFAS FLEXI',
    name: 'Parag Parikh Flexi Cap Fund (Direct Growth)',
    categoryLabel: 'Flexi Cap · Equity',
    themeGroup: 'Core Wealth & Global Tech',
    futuristicTheme: 'India Compounders + Global Big-Tech AI Allocation',
    horizon: '5–10 Years Core Holding',
    reason:
      'Blends high-ROCE Indian leaders with cash-rich global technology innovators under disciplined value-oriented stewardship and low portfolio churn.',
    currencyPrefix: '₹',
    kind: 'mf',
    keywords: ['parag parikh', 'flexi cap', 'mutual fund', 'sip'],
  },
  {
    rank: 2,
    id: 'mf-135800',
    schemeCode: '135800',
    ticker: 'TATA DIGITAL',
    name: 'Tata Digital India Fund (Direct Growth)',
    categoryLabel: 'Sectoral · Digital Tech',
    themeGroup: 'AI & Digital India',
    futuristicTheme: 'Enterprise GenAI, ER&D & Cloud Modernization',
    horizon: '5–7 Years Growth Satellite',
    reason:
      'Concentrated direct exposure to India’s IT services transformation toward GenAI engineering, software-defined mobility, and digital platform exports at a low 0.34% TER.',
    currencyPrefix: '₹',
    kind: 'mf',
    keywords: ['tata digital', 'it sector', 'technology fund', 'genai', 'tcs', 'infosys'],
  },
  {
    rank: 3,
    id: 'mf-120594',
    schemeCode: '120594',
    ticker: 'ICICI TECH',
    name: 'ICICI Prudential Technology Fund (Direct Growth)',
    categoryLabel: 'Sectoral · IT & Digital',
    themeGroup: 'AI & Digital India',
    futuristicTheme: 'Global Tech Cycle & ER&D Re-rating',
    horizon: '5–7 Years Tech Cycle',
    reason:
      'Captures global hyperscaler cloud spending recovery, Indian ER&D exporters, and digital platform winners across domestic and US tech benchmarks.',
    currencyPrefix: '₹',
    kind: 'mf',
    keywords: ['icici', 'technology', 'it', 'tech fund'],
  },
  {
    rank: 4,
    id: 'mf-118759',
    schemeCode: '118759',
    ticker: 'NIPPON PHARMA',
    name: 'Nippon India Pharma Fund (Direct Growth)',
    categoryLabel: 'Sectoral · Healthcare',
    themeGroup: 'AI & Digital India',
    futuristicTheme: 'GLP-1 CDMO, Biosimilars & India Diagnostics',
    horizon: '5–8 Years Healthcare Compounding',
    reason:
      'Positioned for India’s global CDMO contract manufacturing wave, complex specialty generics, and rising domestic hospital & diagnostics penetration.',
    currencyPrefix: '₹',
    kind: 'mf',
    keywords: ['pharma', 'healthcare', 'nippon', 'cdmo', 'biosimilar'],
  },
  {
    rank: 5,
    id: 'mf-118989',
    schemeCode: '118989',
    ticker: 'HDFC MIDCAP',
    name: 'HDFC Mid-Cap Opportunities Fund (Direct Growth)',
    categoryLabel: 'Mid Cap · Equity',
    themeGroup: 'High-Alpha Mid & Small Cap',
    futuristicTheme: 'Next-Gen Industrial, EMS & Capital Goods Leaders',
    horizon: '5–10 Years Alpha Engine',
    reason:
      'Deep institutional research in emerging mid-cap leaders powering India’s manufacturing PLI, defence electronics, and domestic capital goods expansion.',
    currencyPrefix: '₹',
    kind: 'mf',
    keywords: ['hdfc mid', 'midcap', 'mid-cap', 'equity fund'],
  },
  {
    rank: 6,
    id: 'mf-119775',
    schemeCode: '119775',
    ticker: 'KOTAK EMERGING',
    name: 'Kotak Emerging Equity Fund (Direct Growth)',
    categoryLabel: 'Mid Cap · Equity',
    themeGroup: 'High-Alpha Mid & Small Cap',
    futuristicTheme: 'Low-TER Mid-Cap Manufacturing & Chemicals',
    horizon: '5–10 Years Compounding',
    reason:
      'Ultra-competitive 0.39% expense ratio targeting scalable mid-tier leaders across precision engineering, electronics supply chains, and specialty retail.',
    currencyPrefix: '₹',
    kind: 'mf',
    keywords: ['kotak', 'emerging', 'midcap'],
  },
  {
    rank: 7,
    id: 'mf-118778',
    schemeCode: '118778',
    ticker: 'NIPPON SMALL',
    name: 'Nippon India Small Cap Fund (Direct Growth)',
    categoryLabel: 'Small Cap · Equity',
    themeGroup: 'High-Alpha Mid & Small Cap',
    futuristicTheme: 'Broad 200+ Stock Emerging Disruptor Basket',
    horizon: '7–10 Years High Growth',
    reason:
      'Widely diversified small-cap portfolio limiting single-stock liquidity risk while capturing early-stage futuristic niches in renewables, fintech, and EPC.',
    currencyPrefix: '₹',
    kind: 'mf',
    keywords: ['nippon', 'small cap', 'smallcap'],
  },
  {
    rank: 8,
    id: 'mf-120828',
    schemeCode: '120828',
    ticker: 'QUANT SMALL',
    name: 'Quant Small Cap Fund (Direct Growth)',
    categoryLabel: 'Small Cap · Equity',
    themeGroup: 'High-Alpha Mid & Small Cap',
    futuristicTheme: 'VLRT Quant-Macro Dynamic Sector Rotation',
    horizon: '7–10 Years Dynamic Alpha',
    reason:
      'Quantitative liquidity and risk-appetite models dynamically rotate into high-momentum power, infra, and industrial small-caps ahead of consensus shifts.',
    currencyPrefix: '₹',
    kind: 'mf',
    keywords: ['quant', 'small cap'],
  },
  {
    rank: 9,
    id: 'mf-120684',
    schemeCode: '120684',
    ticker: 'ICICI NEXT50',
    name: 'ICICI Prudential Nifty Next 50 Index (Direct)',
    categoryLabel: 'Next 50 · Index',
    themeGroup: 'Low-Cost Index & Factor',
    futuristicTheme: 'Future NIFTY 50 Entrants Pipeline (0.30% TER)',
    horizon: '5–10 Years Passive Growth',
    reason:
      'Systematically owns companies ranked 51–100 (Defence, New-Age Tech, Clean Utilities) graduating into NIFTY 50 with zero manager bias.',
    currencyPrefix: '₹',
    kind: 'mf',
    keywords: ['next 50', 'index fund', 'nifty', 'passive'],
  },
  {
    rank: 10,
    id: 'mf-120716',
    schemeCode: '120716',
    ticker: 'UTI NIFTY50',
    name: 'UTI Nifty 50 Index Fund (Direct Growth)',
    categoryLabel: 'Nifty 50 · Index',
    themeGroup: 'Low-Cost Index & Factor',
    futuristicTheme: 'India Top-50 Core Benchmark (0.18% TER)',
    horizon: '5–15 Years Core Beta',
    reason:
      'Lowest tracking-drag passive vehicle anchoring core retirement/SIP compounding to India’s 50 largest blue-chip balance sheets.',
    currencyPrefix: '₹',
    kind: 'mf',
    keywords: ['uti', 'nifty 50', 'index'],
  },
  {
    rank: 11,
    id: 'mf-119827',
    schemeCode: '119827',
    ticker: 'SBI NIFTY50',
    name: 'SBI Nifty Index Fund (Direct Growth)',
    categoryLabel: 'Nifty 50 · Index',
    themeGroup: 'Low-Cost Index & Factor',
    futuristicTheme: 'Institutional-Scale Nifty 50 Compounding',
    horizon: '5–15 Years Core Beta',
    reason:
      'Deep AUM liquidity and tight execution tracking India’s headline GDP-linked corporate earnings expansion at 0.19% cost.',
    currencyPrefix: '₹',
    kind: 'mf',
    keywords: ['sbi', 'nifty'],
  },
  {
    rank: 12,
    id: 'mf-149858',
    schemeCode: '149858',
    ticker: 'ICICI BANK IDX',
    name: 'ICICI Prudential Nifty Bank Index (Direct)',
    categoryLabel: 'Banking · Sectoral Index',
    themeGroup: 'Low-Cost Index & Factor',
    futuristicTheme: 'Digital Credit & UPI Banking Infrastructure',
    horizon: '3–7 Years Credit Cycle',
    reason:
      'Low-cost (0.25% TER) access to India’s formalizing credit boom, clean PSU/private bank balance sheets, and digital treasury rails.',
    currencyPrefix: '₹',
    kind: 'mf',
    keywords: ['bank', 'banking', 'credit', 'rbi'],
  },
  {
    rank: 13,
    id: 'mf-118825',
    schemeCode: '118825',
    ticker: 'MIRAE LARGECAP',
    name: 'Mirae Asset Large Cap Fund (Direct Growth)',
    categoryLabel: 'Large Cap · Equity',
    themeGroup: 'Core Wealth & Global Tech',
    futuristicTheme: 'Quality-at-Reasonable-Price Bluechips',
    horizon: '5–10 Years Core Equity',
    reason:
      'Low 0.53% TER large-cap portfolio tilted toward private financials, telecom ARPU expansion, and domestic digital consumer franchises.',
    currencyPrefix: '₹',
    kind: 'mf',
    keywords: ['mirae', 'large cap'],
  },
  {
    rank: 14,
    id: 'mf-120586',
    schemeCode: '120586',
    ticker: 'ICICI BLUECHIP',
    name: 'ICICI Prudential Bluechip Fund (Direct Growth)',
    categoryLabel: 'Large Cap · Equity',
    themeGroup: 'Core Wealth & Global Tech',
    futuristicTheme: 'Counter-Cyclical Energy, Power & Banking Leaders',
    horizon: '5–10 Years Bluechip Core',
    reason:
      'Strong risk-adjusted capture across large capex utilities, private banks, and domestic industrial heavyweights during market rotations.',
    currencyPrefix: '₹',
    kind: 'mf',
    keywords: ['bluechip', 'icici'],
  },
  {
    rank: 15,
    id: 'mf-119598',
    schemeCode: '119598',
    ticker: 'SBI BLUECHIP',
    name: 'SBI Bluechip Fund (Direct Growth)',
    categoryLabel: 'Large Cap · Equity',
    themeGroup: 'Core Wealth & Global Tech',
    futuristicTheme: 'Steady Large-Cap Compounders',
    horizon: '5–10 Years Stability',
    reason:
      'Emphasizes market-share leaders with durable competitive moats and conservative leverage across India’s formalizing economy.',
    currencyPrefix: '₹',
    kind: 'mf',
    keywords: ['sbi bluechip', 'large cap'],
  },
  {
    rank: 16,
    id: 'mf-118968',
    schemeCode: '118968',
    ticker: 'HDFC BAL ADV',
    name: 'HDFC Balanced Advantage Fund (Direct Growth)',
    categoryLabel: 'Balanced Advantage · Hybrid',
    themeGroup: 'Dynamic Hybrid & Gilt Debt',
    futuristicTheme: 'Counter-Cyclical Equity + High-Yield Debt Blend',
    horizon: '3–7 Years All-Weather',
    reason:
      'Dynamic equity allocation trims expensive valuations and buys dips while earning stable fixed-income carry with favourable equity taxation.',
    currencyPrefix: '₹',
    kind: 'mf',
    keywords: ['balanced advantage', 'hybrid', 'hdfc'],
  },
  {
    rank: 17,
    id: 'mf-120377',
    schemeCode: '120377',
    ticker: 'ICICI BAL ADV',
    name: 'ICICI Prudential Balanced Advantage (Direct)',
    categoryLabel: 'Balanced Advantage · Hybrid',
    themeGroup: 'Dynamic Hybrid & Gilt Debt',
    futuristicTheme: 'Price-to-Book Tactical Asset Allocation',
    horizon: '3–7 Years Low Volatility',
    reason:
      'Proven rule-based valuation model protecting capital during equity drawdowns while participating in structural India upswings.',
    currencyPrefix: '₹',
    kind: 'mf',
    keywords: ['balanced advantage', 'icici', 'hybrid'],
  },
  {
    rank: 18,
    id: 'mf-120605',
    schemeCode: '120605',
    ticker: 'ICICI GILT',
    name: 'ICICI Prudential All Seasons Bond / Gilt (Direct)',
    categoryLabel: 'Dynamic Gilt · Debt',
    themeGroup: 'Dynamic Hybrid & Gilt Debt',
    futuristicTheme: 'RBI Rate-Cut & Global Bond Index Inclusion',
    horizon: '2–5 Years Duration Play',
    reason:
      'Positioned to capture capital appreciation from sovereign bond yield compression as India enters easing cycles and global bond index inflows.',
    currencyPrefix: '₹',
    kind: 'mf',
    keywords: ['gilt', 'bond', 'rbi', 'rate'],
  },
  {
    rank: 19,
    id: 'mf-147857',
    schemeCode: '147857',
    ticker: 'BHARAT BOND 30',
    name: 'Edelweiss BHARAT Bond FoF April 2030 (Direct)',
    categoryLabel: 'Target Maturity · PSU Debt',
    themeGroup: 'Dynamic Hybrid & Gilt Debt',
    futuristicTheme: 'AAA Sovereign-Backed Target Maturity (0.06% TER)',
    horizon: 'Hold to April 2030',
    reason:
      'Ultra-low 0.06% TER holding exclusively AAA public sector bonds maturing in 2030 for predictable, near-sovereign fixed-income compounding.',
    currencyPrefix: '₹',
    kind: 'mf',
    keywords: ['bharat bond', 'psu', 'edelweiss', 'debt'],
  },
  {
    rank: 20,
    id: 'mf-118987',
    schemeCode: '118987',
    ticker: 'HDFC CORP BOND',
    name: 'HDFC Corporate Bond Fund (Direct Growth)',
    categoryLabel: 'Corporate Bond · Debt',
    themeGroup: 'Dynamic Hybrid & Gilt Debt',
    futuristicTheme: 'AAA Credit Carry + Low Default Risk Treasury',
    horizon: '2–5 Years Core Income',
    reason:
      'Focuses strictly on top-rated AAA corporate issuers, providing liquid yield enhancement above traditional bank fixed deposits.',
    currencyPrefix: '₹',
    kind: 'mf',
    keywords: ['corporate bond', 'hdfc', 'debt'],
  },
];

export const INTRADAY_FUTURISTIC_SPECS: FuturisticSpecBase[] = [
  { rank: 1, id: 'id-bel', symbol: 'BEL.NS', ticker: 'BEL', name: 'Bharat Electronics Ltd', categoryLabel: 'Defence Tech · High Beta Liquidity', themeGroup: 'Tech & Defence Breakouts', futuristicTheme: 'Defence Order Book Momentum & Tight Tick Spreads', horizon: 'Intraday · 5m/15m VWAP', reason: 'Strong institutional order flow and defence contract headlines frequently produce clean opening-range breakouts above VWAP.', currencyPrefix: '₹', kind: 'quote', keywords: ['bel', 'bharat electronics', 'defence'] },
  { rank: 2, id: 'id-hal', symbol: 'HAL.NS', ticker: 'HAL', name: 'Hindustan Aeronautics Ltd', categoryLabel: 'Aerospace · Momentum Leader', themeGroup: 'Tech & Defence Breakouts', futuristicTheme: 'High ADR & Aerospace News Sensitivity', horizon: 'Intraday · 5m/15m Trend', reason: 'Wide intraday ATR range paired with liquid cash and F&O depth makes HAL a premier momentum tape-reading ticker.', currencyPrefix: '₹', kind: 'quote', keywords: ['hal', 'hindustan aeronautics', 'tejas'] },
  { rank: 3, id: 'id-rel', symbol: 'RELIANCE.NS', ticker: 'RELIANCE', name: 'Reliance Industries Ltd', categoryLabel: 'Index Heavyweight · Energy/Telecom', themeGroup: 'Index Heavyweights', futuristicTheme: 'NIFTY 50 Weight Anchor & New-Energy Catalyst', horizon: 'Intraday · VWAP Reversion', reason: 'Deepest NSE institutional order book; ideal for clean VWAP support/resistance setups and index-arbitrage directional flows.', currencyPrefix: '₹', kind: 'quote', keywords: ['reliance', 'jio', 'nifty'] },
  { rank: 4, id: 'id-hdfc', symbol: 'HDFCBANK.NS', ticker: 'HDFCBANK', name: 'HDFC Bank Ltd', categoryLabel: 'Banking Heavyweight', themeGroup: 'Banking & NBFC Velocity', futuristicTheme: 'Bank Nifty Pivot & FII Flow Proxy', horizon: 'Intraday · 5m/15m Pivot', reason: 'Highest weight across Bank Nifty & NIFTY 50; FII institutional basket blocks generate predictable morning and closing swings.', currencyPrefix: '₹', kind: 'quote', keywords: ['hdfc bank', 'hdfcbank', 'bank nifty'] },
  { rank: 5, id: 'id-icici', symbol: 'ICICIBANK.NS', ticker: 'ICICIBANK', name: 'ICICI Bank Ltd', categoryLabel: 'Banking Leader', themeGroup: 'Banking & NBFC Velocity', futuristicTheme: 'Consistent Institutional Bid & Low Slippage', horizon: 'Intraday · 5m Trend', reason: 'Tight bid-ask spreads and high volume stability allow clean RSI/MACD continuation trades during RBI and banking sessions.', currencyPrefix: '₹', kind: 'quote', keywords: ['icici bank', 'icicibank'] },
  { rank: 6, id: 'id-sbin', symbol: 'SBIN.NS', ticker: 'SBIN', name: 'State Bank of India', categoryLabel: 'PSU Banking · High Volume', themeGroup: 'Banking & NBFC Velocity', futuristicTheme: 'High Retail + Institutional Turnover Spike', horizon: 'Intraday · 1m/5m Scalping', reason: 'Highest cash-market share turnover among Nifty banks; sharp G-Sec bond yield moves translate quickly into intraday SBIN momentum.', currencyPrefix: '₹', kind: 'quote', keywords: ['sbi', 'sbin', 'state bank', 'psu bank'] },
  { rank: 7, id: 'id-infy', symbol: 'INFY.NS', ticker: 'INFY', name: 'Infosys Ltd', categoryLabel: 'IT Services · AI/ADR Cue', themeGroup: 'Tech & Defence Breakouts', futuristicTheme: 'Overnight US ADR Gap & GenAI Deal Flow', horizon: 'Intraday · Opening Gap/ORB', reason: 'Overnight US ADR moves and Nasdaq cues trigger decisive 09:15 AM opening gaps and smooth intraday trend continuations.', currencyPrefix: '₹', kind: 'quote', keywords: ['infosys', 'infy', 'it', 'ai'] },
  { rank: 8, id: 'id-tcs', symbol: 'TCS.NS', ticker: 'TCS', name: 'Tata Consultancy Services Ltd', categoryLabel: 'IT Bellwether', themeGroup: 'Tech & Defence Breakouts', futuristicTheme: 'Low-Noise Mean Reversion & Defensive Hedge', horizon: 'Intraday · 15m Swing', reason: 'Acts as an intraday rupee-hedge when USD/INR weakens or global tech rallies; respected VWAP bands keep stop-losses tight.', currencyPrefix: '₹', kind: 'quote', keywords: ['tcs', 'tata consultancy', 'it'] },
  { rank: 9, id: 'id-lt', symbol: 'LT.NS', ticker: 'LT', name: 'Larsen & Toubro Ltd', categoryLabel: 'Infrastructure & Clean EPC', themeGroup: 'Index Heavyweights', futuristicTheme: 'Capex Contract Wins & Data-Center Infra', horizon: 'Intraday · News Breakout', reason: 'Frequent morning exchange order-win announcements create high-conviction volume breakouts backed by institutional buying.', currencyPrefix: '₹', kind: 'quote', keywords: ['larsen', 'l&t', 'lt', 'order'] },
  { rank: 10, id: 'id-bajfin', symbol: 'BAJFINANCE.NS', ticker: 'BAJFINANCE', name: 'Bajaj Finance Ltd', categoryLabel: 'NBFC · High Beta ATR', themeGroup: 'Banking & NBFC Velocity', futuristicTheme: 'Digital Lending Beta & High Points Range', horizon: 'Intraday · High ATR Swing', reason: 'Generous intraday point swings combined with deep derivatives liquidity deliver high reward-to-risk ratios for volatility traders.', currencyPrefix: '₹', kind: 'quote', keywords: ['bajaj finance', 'bajfinance', 'nbfc'] },
  { rank: 11, id: 'id-airtel', symbol: 'BHARTIARTL.NS', ticker: 'BHARTIARTL', name: 'Bharti Airtel Ltd', categoryLabel: '5G Telecom & Data Centers', themeGroup: 'Index Heavyweights', futuristicTheme: 'ARPU Expansion & Steady Trend Slope', horizon: 'Intraday · 15m Momentum', reason: 'Clean institutional accumulation profile with minimal whipsaw noise compared to smaller high-beta counters.', currencyPrefix: '₹', kind: 'quote', keywords: ['airtel', 'bharti', 'telecom', '5g'] },
  { rank: 12, id: 'id-axis', symbol: 'AXISBANK.NS', ticker: 'AXISBANK', name: 'Axis Bank Ltd', categoryLabel: 'Private Banking', themeGroup: 'Banking & NBFC Velocity', futuristicTheme: 'Bank Nifty Momentum Follower', horizon: 'Intraday · 5m Breakout', reason: 'Exhibits crisp technical follow-through on morning Bank Nifty trend days with strong F&O open-interest confirmation.', currencyPrefix: '₹', kind: 'quote', keywords: ['axis bank', 'axisbank'] },
  { rank: 13, id: 'id-kotak', symbol: 'KOTAKBANK.NS', ticker: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd', categoryLabel: 'Private Banking', themeGroup: 'Banking & NBFC Velocity', futuristicTheme: 'Range-Bound Mean Reversion & Breakouts', horizon: 'Intraday · VWAP Bands', reason: 'High tick liquidity and sharp institutional defense near daily support/resistance zones.', currencyPrefix: '₹', kind: 'quote', keywords: ['kotak', 'kotakbank'] },
  { rank: 14, id: 'id-maruti', symbol: 'MARUTI.NS', ticker: 'MARUTI', name: 'Maruti Suzuki India Ltd', categoryLabel: 'EV & Auto Leader', themeGroup: 'Consumer & EV Movers', futuristicTheme: 'Monthly Dispatch & Hybrid/EV Demand Proxy', horizon: 'Intraday · 15m Trend', reason: 'Monthly volume releases and commodity input cost drops trigger strong multi-hour intraday trends.', currencyPrefix: '₹', kind: 'quote', keywords: ['maruti', 'auto', 'ev'] },
  { rank: 15, id: 'id-sun', symbol: 'SUNPHARMA.NS', ticker: 'SUNPHARMA', name: 'Sun Pharmaceutical Ind', categoryLabel: 'Specialty Pharma', themeGroup: 'Consumer & EV Movers', futuristicTheme: 'Defensive Alpha During Nifty Volatility', horizon: 'Intraday · Hedge Long/Short', reason: 'Low correlation to domestic bank sell-offs gives intraday traders a reliable sector-rotation vehicle.', currencyPrefix: '₹', kind: 'quote', keywords: ['sun pharma', 'sunpharma', 'pharma'] },
  { rank: 16, id: 'id-titan', symbol: 'TITAN.NS', ticker: 'TITAN', name: 'Titan Company Ltd', categoryLabel: 'Bullion & Luxury Retail', themeGroup: 'Consumer & EV Movers', futuristicTheme: 'Gold Volatility & Festive Demand Sensitivity', horizon: 'Intraday · 5m/15m Swing', reason: 'Reacts directly to overnight COMEX gold swings and quarterly jewellery updates with clean intraday liquidity.', currencyPrefix: '₹', kind: 'quote', keywords: ['titan', 'jewellery', 'gold'] },
  { rank: 17, id: 'id-trent', symbol: 'TRENT.NS', ticker: 'TRENT', name: 'Trent Ltd', categoryLabel: 'Fast Fashion · High Momentum', themeGroup: 'Consumer & EV Movers', futuristicTheme: 'High Relative Strength & Expansion Beta', horizon: 'Intraday · High ATR Trend', reason: 'Sustained institutional interest and elevated intraday volatility offer clear momentum continuations.', currencyPrefix: '₹', kind: 'quote', keywords: ['trent', 'retail', 'zudio'] },
  { rank: 18, id: 'id-adani', symbol: 'ADANIENT.NS', ticker: 'ADANIENT', name: 'Adani Enterprises Ltd', categoryLabel: 'Green Hydrogen & Infra', themeGroup: 'Tech & Defence Breakouts', futuristicTheme: 'Highest Headline Elasticity & ATR Volatility', horizon: 'Intraday · Volatility Scalp', reason: 'Wide daily percentage ranges and rapid order-book velocity reward disciplined stop-loss intraday momentum setups.', currencyPrefix: '₹', kind: 'quote', keywords: ['adani', 'adanient'] },
  { rank: 19, id: 'id-tata', symbol: 'TATASTEEL.NS', ticker: 'TATASTEEL', name: 'Tata Steel Ltd', categoryLabel: 'Metals & Green Steel', themeGroup: 'Consumer & EV Movers', futuristicTheme: 'China Stimulus & Copper/Steel Futures Proxy', horizon: 'Intraday · High Volume Tick', reason: 'Massive cash volume with tight 5-paisa ticks lets scalpers track overnight Asian metal futures cleanly.', currencyPrefix: '₹', kind: 'quote', keywords: ['tata steel', 'tatasteel', 'steel', 'metals'] },
  { rank: 20, id: 'id-hcl', symbol: 'HCLTECH.NS', ticker: 'HCLTECH', name: 'HCL Technologies Ltd', categoryLabel: 'Cloud & AI Software', themeGroup: 'Tech & Defence Breakouts', futuristicTheme: 'AI Engineering Momentum & ER&D Strength', horizon: 'Intraday · 15m Breakout', reason: 'Consistently exhibits strong relative strength within NIFTY IT during enterprise cloud deal cycles.', currencyPrefix: '₹', kind: 'quote', keywords: ['hcl', 'hcltech', 'it'] },
];

export const FNO_FUTURISTIC_SPECS: FuturisticSpecBase[] = [
  { rank: 1, id: 'fno-nsei', symbol: '^NSEI', ticker: 'NIFTY 50', name: 'NIFTY 50 Index Derivatives', categoryLabel: 'Weekly & Monthly Index F&O · Lot 75', themeGroup: 'Core Index Derivatives', futuristicTheme: 'Deepest Option Chain Liquidity & Zero-DTE Gamma', horizon: 'Weekly / Monthly Expiry', reason: 'India’s deepest option chain; ideal for iron condors, delta hedging, PCR sentiment tracking, and systematic theta decay.', currencyPrefix: '₹', kind: 'quote', keywords: ['nifty 50', 'nifty', 'option chain', 'expiry'] },
  { rank: 2, id: 'fno-nsebank', symbol: '^NSEBANK', ticker: 'BANK NIFTY', name: 'BANK NIFTY Index Derivatives', categoryLabel: 'Monthly Index F&O · Lot 30', themeGroup: 'Core Index Derivatives', futuristicTheme: 'High-Gamma Credit Spread & Trend Volatility', horizon: 'Monthly Expiry Cycles', reason: 'Structural bank weighting amplifies RBI policy & credit-cycle moves, delivering crisp implied-volatility expansion opportunities.', currencyPrefix: '₹', kind: 'quote', keywords: ['bank nifty', 'banknifty', 'rbi', 'options'] },
  { rank: 3, id: 'fno-cnxit', symbol: '^CNXIT', ticker: 'NIFTY IT', name: 'NIFTY IT Index Derivatives', categoryLabel: 'Tech Sector Index · Lot 25', themeGroup: 'Core Index Derivatives', futuristicTheme: 'AI & US Tech Earnings Volatility Hedge', horizon: 'Quarterly Earnings Cycle', reason: 'Efficient macro vehicle to hedge portfolio tech exposure around US Fed decisions and quarterly IT guidance.', currencyPrefix: '₹', kind: 'quote', keywords: ['nifty it', 'it index', 'nasdaq', 'ai'] },
  { rank: 4, id: 'fno-bel', symbol: 'BEL.NS', ticker: 'BEL', name: 'Bharat Electronics Ltd (F&O)', categoryLabel: 'Defence Stock F&O · Lot 2850', themeGroup: 'Defence & Capex F&O', futuristicTheme: 'Covered Call Yield on Secular Defence Compounder', horizon: 'Monthly Covered Call / Bull Spread', reason: 'High open interest and orderly upward trend make BEL prime for bull call spreads and covered-call income.', currencyPrefix: '₹', kind: 'quote', keywords: ['bel', 'defence'] },
  { rank: 5, id: 'fno-hal', symbol: 'HAL.NS', ticker: 'HAL', name: 'Hindustan Aeronautics Ltd (F&O)', categoryLabel: 'Aerospace Stock F&O · Lot 150', themeGroup: 'Defence & Capex F&O', futuristicTheme: 'Elevated Implied Volatility Premium Selling', horizon: 'Monthly Option Strategies', reason: 'Healthy IV levels around defence approvals generate attractive risk-defined put credit spreads for core holders.', currencyPrefix: '₹', kind: 'quote', keywords: ['hal', 'aerospace'] },
  { rank: 6, id: 'fno-rel', symbol: 'RELIANCE.NS', ticker: 'RELIANCE', name: 'Reliance Industries Ltd (F&O)', categoryLabel: 'Heavyweight F&O · Lot 500', themeGroup: 'Heavyweight Liquid Options', futuristicTheme: 'Clean Multi-Strike Liquidity & Strangle Stability', horizon: 'Monthly Theta / Directional', reason: 'Balanced realized-vs-implied volatility and multi-strike option depth across OTM calls and puts.', currencyPrefix: '₹', kind: 'quote', keywords: ['reliance', 'agm', 'jio'] },
  { rank: 7, id: 'fno-hdfc', symbol: 'HDFCBANK.NS', ticker: 'HDFCBANK', name: 'HDFC Bank Ltd (F&O)', categoryLabel: 'Banking F&O · Lot 550', themeGroup: 'Banking & Finance F&O', futuristicTheme: 'Mean-Reverting Range Options & Low IV Cost', horizon: 'Monthly Iron Fly / Condors', reason: 'Modest realized volatility offers inexpensive debit spreads ahead of quarterly NIM updates.', currencyPrefix: '₹', kind: 'quote', keywords: ['hdfc bank', 'hdfcbank'] },
  { rank: 8, id: 'fno-icici', symbol: 'ICICIBANK.NS', ticker: 'ICICIBANK', name: 'ICICI Bank Ltd (F&O)', categoryLabel: 'Banking F&O · Lot 700', themeGroup: 'Banking & Finance F&O', futuristicTheme: 'Tight Bid-Ask Execution on Trend Futures', horizon: 'Monthly Swing Futures', reason: 'High OI depth and institutional participation minimize option execution slippage.', currencyPrefix: '₹', kind: 'quote', keywords: ['icici bank', 'icicibank'] },
  { rank: 9, id: 'fno-sbin', symbol: 'SBIN.NS', ticker: 'SBIN', name: 'State Bank of India (F&O)', categoryLabel: 'PSU Bank F&O · Lot 750', themeGroup: 'Banking & Finance F&O', futuristicTheme: 'Liquid Retail & Institutional Hedge Proxy', horizon: 'Monthly Futures & Calls', reason: 'Top-5 NSE stock option turnover; clean liquidity even 5–10% out of the money.', currencyPrefix: '₹', kind: 'quote', keywords: ['sbi', 'sbin'] },
  { rank: 10, id: 'fno-infy', symbol: 'INFY.NS', ticker: 'INFY', name: 'Infosys Ltd (F&O)', categoryLabel: 'IT Services F&O · Lot 400', themeGroup: 'Heavyweight Liquid Options', futuristicTheme: 'Quarterly Guidance IV Crush & Diagonal Spreads', horizon: 'Earnings Cycle F&O', reason: 'Predictable pre-earnings IV buildup and post-result IV crush allow structured calendar and strangle setups.', currencyPrefix: '₹', kind: 'quote', keywords: ['infosys', 'infy', 'earnings'] },
  { rank: 11, id: 'fno-tcs', symbol: 'TCS.NS', ticker: 'TCS', name: 'Tata Consultancy Services (F&O)', categoryLabel: 'IT Bellwether F&O · Lot 175', themeGroup: 'Heavyweight Liquid Options', futuristicTheme: 'Protective Collar & Low-Beta Option Writing', horizon: 'Monthly Protective Hedge', reason: 'Low beta and dependable dividend floor stabilize short put and collar hedging strategies.', currencyPrefix: '₹', kind: 'quote', keywords: ['tcs', 'dividend'] },
  { rank: 12, id: 'fno-lt', symbol: 'LT.NS', ticker: 'LT', name: 'Larsen & Toubro Ltd (F&O)', categoryLabel: 'Infra F&O · Lot 150', themeGroup: 'Defence & Capex F&O', futuristicTheme: 'India Capex & Budget Cycle Directional Play', horizon: 'Monthly Futures', reason: 'High sensitivity to sovereign infrastructure spending drives sustained multi-week futures rollover momentum.', currencyPrefix: '₹', kind: 'quote', keywords: ['l&t', 'lt', 'capex'] },
  { rank: 13, id: 'fno-bajfin', symbol: 'BAJFINANCE.NS', ticker: 'BAJFINANCE', name: 'Bajaj Finance Ltd (F&O)', categoryLabel: 'NBFC F&O · Lot 125', themeGroup: 'Banking & Finance F&O', futuristicTheme: 'Rich Option Premiums for Defined-Risk Spreads', horizon: 'Monthly Vertical Spreads', reason: 'Vibrant volatility around RBI liquidity commentary makes vertical credit and debit spreads efficient.', currencyPrefix: '₹', kind: 'quote', keywords: ['bajaj finance', 'bajfinance'] },
  { rank: 14, id: 'fno-airtel', symbol: 'BHARTIARTL.NS', ticker: 'BHARTIARTL', name: 'Bharti Airtel Ltd (F&O)', categoryLabel: 'Telecom F&O · Lot 475', themeGroup: 'Heavyweight Liquid Options', futuristicTheme: 'Steady Bull Put Spread Compounder', horizon: 'Monthly Put Writing', reason: 'Strong underlying support zones make Bharti Airtel an effective bull-put-spread cashflow generator.', currencyPrefix: '₹', kind: 'quote', keywords: ['airtel', 'bharti'] },
  { rank: 15, id: 'fno-axis', symbol: 'AXISBANK.NS', ticker: 'AXISBANK', name: 'Axis Bank Ltd (F&O)', categoryLabel: 'Banking F&O · Lot 625', themeGroup: 'Banking & Finance F&O', futuristicTheme: 'Bank-Pairs Relative Value Trading', horizon: 'Monthly Pair Spreads', reason: 'High correlation with Bank Nifty simplifies hedged pair trades against peer private banks.', currencyPrefix: '₹', kind: 'quote', keywords: ['axis bank'] },
  { rank: 16, id: 'fno-kotak', symbol: 'KOTAKBANK.NS', ticker: 'KOTAKBANK', name: 'Kotak Mahindra Bank (F&O)', categoryLabel: 'Banking F&O · Lot 400', themeGroup: 'Banking & Finance F&O', futuristicTheme: 'Tight-Range Option Theta Harvesting', horizon: 'Monthly Condors', reason: 'Well-defined institutional accumulation bands suit range-bound option strategies.', currencyPrefix: '₹', kind: 'quote', keywords: ['kotak'] },
  { rank: 17, id: 'fno-maruti', symbol: 'MARUTI.NS', ticker: 'MARUTI', name: 'Maruti Suzuki India (F&O)', categoryLabel: 'Auto & EV F&O · Lot 50', themeGroup: 'Growth & Auto F&O', futuristicTheme: 'Monthly Sales & Auto Cycle Gamma', horizon: 'Monthly Momentum', reason: 'High rupee contract value amplifies monthly sales-beat moves cleanly across ATM calls.', currencyPrefix: '₹', kind: 'quote', keywords: ['maruti', 'auto sales'] },
  { rank: 18, id: 'fno-titan', symbol: 'TITAN.NS', ticker: 'TITAN', name: 'Titan Company Ltd (F&O)', categoryLabel: 'Luxury/Gold F&O · Lot 175', themeGroup: 'Growth & Auto F&O', futuristicTheme: 'Gold & Festive Margin Hedge Vehicle', horizon: 'Seasonal Quarterly F&O', reason: 'Cleanly captures festive demand and gold price volatility within a single NSE F&O chain.', currencyPrefix: '₹', kind: 'quote', keywords: ['titan'] },
  { rank: 19, id: 'fno-trent', symbol: 'TRENT.NS', ticker: 'TRENT', name: 'Trent Ltd (F&O)', categoryLabel: 'Retail F&O · Lot 100', themeGroup: 'Growth & Auto F&O', futuristicTheme: 'High-Beta Growth Momentum Derivatives', horizon: 'Tactical Option Spreads', reason: 'Dynamic volatility and strong institutional OI allow leveraged upside participation via bull call spreads.', currencyPrefix: '₹', kind: 'quote', keywords: ['trent'] },
  { rank: 20, id: 'fno-sun', symbol: 'SUNPHARMA.NS', ticker: 'SUNPHARMA', name: 'Sun Pharma Ind (F&O)', categoryLabel: 'Pharma F&O · Lot 350', themeGroup: 'Growth & Auto F&O', futuristicTheme: 'Non-Correlated Portfolio Volatility Hedge', horizon: 'Monthly Defensive Hedge', reason: 'Low equity beta relative to banks adds uncorrelated diversification inside multi-leg F&O books.', currencyPrefix: '₹', kind: 'quote', keywords: ['sun pharma', 'sunpharma'] },
];

export const ETF_FUTURISTIC_SPECS: FuturisticSpecBase[] = [
  { rank: 1, id: 'etf-mon100', symbol: 'MON100.NS', ticker: 'MON100', name: 'Motilal Oswal Nasdaq 100 ETF', categoryLabel: 'International · US Big Tech', themeGroup: 'Global AI & Tech ETFs', futuristicTheme: 'Direct INR Access to Nvidia, Microsoft, Apple & AI Leaders', horizon: '5–10 Years Global AI', reason: 'Captures global AI hyperscalers and US semiconductor innovation directly on NSE with INR depreciation buffer.', currencyPrefix: '₹', kind: 'quote', keywords: ['nasdaq', 'mon100', 'ai', 'nvidia', 'tech'] },
  { rank: 2, id: 'etf-mafang', symbol: 'MAFANG.NS', ticker: 'MAFANG', name: 'Mirae Asset NYSE FANG+ ETF', categoryLabel: 'International · Mega-Cap AI', themeGroup: 'Global AI & Tech ETFs', futuristicTheme: 'Equal-Weighted Concentrated AI & Cloud Monopoly Basket', horizon: '5–10 Years Tech Growth', reason: 'Concentrated equal-weight ownership of the 10 most dominant global AI, cloud, and platform franchises.', currencyPrefix: '₹', kind: 'quote', keywords: ['mafang', 'fang', 'ai', 'us tech'] },
  { rank: 3, id: 'etf-masp500', symbol: 'MASPTOP50.NS', ticker: 'MASPTOP50', name: 'Mirae Asset S&P 500 Top 50 ETF', categoryLabel: 'International · US Megacap', themeGroup: 'Global AI & Tech ETFs', futuristicTheme: 'Top 50 US Global Multinationals in INR', horizon: '5–10 Years Global Core', reason: 'Balanced global diversification across US technology, biotech, and payments without active stock-picking risk.', currencyPrefix: '₹', kind: 'quote', keywords: ['s&p 500', 'masptop50', 'us market'] },
  { rank: 4, id: 'etf-itbees', symbol: 'ITBEES.NS', ticker: 'ITBEES', name: 'Nippon India ETF Nifty IT', categoryLabel: 'Sector ETF · Tech', themeGroup: 'Global AI & Tech ETFs', futuristicTheme: 'Indian GenAI Services & Digital Transformation Basket', horizon: '3–7 Years Tech Cycle', reason: 'Zero-overlap liquid passive basket of India’s top 10 IT exporters benefiting from global enterprise AI spending.', currencyPrefix: '₹', kind: 'quote', keywords: ['itbees', 'nifty it', 'tech etf'] },
  { rank: 5, id: 'etf-niftybees', symbol: 'NIFTYBEES.NS', ticker: 'NIFTYBEES', name: 'Nippon India ETF Nifty 50 BeES', categoryLabel: 'Nifty ETF · Core Index', themeGroup: 'India Core & Midcap ETFs', futuristicTheme: '0.04% TER Flagship Benchmark With Intraday Liquidity', horizon: '5–15 Years Core Wealth', reason: 'India’s oldest and most liquid equity ETF offering rock-bottom cost and tightest exchange spreads.', currencyPrefix: '₹', kind: 'quote', keywords: ['niftybees', 'nifty 50', 'etf'] },
  { rank: 6, id: 'etf-juniorbees', symbol: 'JUNIORBEES.NS', ticker: 'JUNIORBEES', name: 'Nippon India ETF Nifty Next 50', categoryLabel: 'Nifty ETF · Future Leaders', themeGroup: 'India Core & Midcap ETFs', futuristicTheme: 'Graduation Pipeline of Tomorrow’s Bluechips', horizon: '5–10 Years Secular Growth', reason: 'Owns emerging futuristic franchises in defence, renewables, and consumer tech before they enter Nifty 50.', currencyPrefix: '₹', kind: 'quote', keywords: ['juniorbees', 'next 50'] },
  { rank: 7, id: 'etf-mid150', symbol: 'MID150BEES.NS', ticker: 'MID150BEES', name: 'Nippon India ETF Nifty Midcap 150', categoryLabel: 'Nifty ETF · Midcap', themeGroup: 'India Core & Midcap ETFs', futuristicTheme: '150 Mid-Cap Industrial & Tech Compounders (0.21% TER)', horizon: '7–10 Years High Growth', reason: 'Outperforms majority of active midcap funds net of fees by capturing India’s full mid-tier growth spectrum passively.', currencyPrefix: '₹', kind: 'quote', keywords: ['midcap 150', 'mid150bees', 'midcap'] },
  { rank: 8, id: 'etf-sensex', symbol: 'SENSEXIETF.NS', ticker: 'SENSEXIETF', name: 'ICICI Prudential BSE Sensex ETF', categoryLabel: 'Sensex ETF · Top 30', themeGroup: 'India Core & Midcap ETFs', futuristicTheme: 'Ultra-Concentrated Top 30 Profit Pool (0.05% TER)', horizon: '5–15 Years Core Index', reason: 'Focuses strictly on India’s 30 premier profit generators with minimal tracking error.', currencyPrefix: '₹', kind: 'quote', keywords: ['sensex', 'sensexietf'] },
  { rank: 9, id: 'etf-hdfcsensex', symbol: 'HDFCSENSEX.NS', ticker: 'HDFCSENSEX', name: 'HDFC BSE Sensex ETF', categoryLabel: 'Sensex ETF · Top 30', themeGroup: 'India Core & Midcap ETFs', futuristicTheme: 'Institutional-Grade Sensex Tracking (0.05% TER)', horizon: '5–15 Years Core Index', reason: 'Low-cost Sensex accumulation option backed by strong market-maker liquidity on BSE & NSE.', currencyPrefix: '₹', kind: 'quote', keywords: ['hdfc sensex', 'sensex'] },
  { rank: 10, id: 'etf-niftyietf', symbol: 'NIFTYIETF.NS', ticker: 'NIFTYIETF', name: 'ICICI Prudential Nifty 50 ETF', categoryLabel: 'Nifty ETF · Core Index', themeGroup: 'India Core & Midcap ETFs', futuristicTheme: '0.05% Expense Ratio Nifty 50 Institutional Tracker', horizon: '5–15 Years Core Index', reason: 'Seamless Nifty 50 compounding with tight tracking error suitable for long-term SIP ETF strategies.', currencyPrefix: '₹', kind: 'quote', keywords: ['niftyietf', 'icici nifty'] },
  { rank: 11, id: 'etf-autobees', symbol: 'AUTOBEES.NS', ticker: 'AUTOBEES', name: 'Nippon India ETF Nifty Auto', categoryLabel: 'Sector ETF · Mobility/EV', themeGroup: 'Sectoral & Infra ETFs', futuristicTheme: 'EV Transition, Hybrid SUVs & Auto Ancillaries', horizon: '3–7 Years Mobility Shift', reason: 'Captures India’s 2-wheeler electrification, EV components, and global auto-ancillary exports in one ticker.', currencyPrefix: '₹', kind: 'quote', keywords: ['autobees', 'auto', 'ev'] },
  { rank: 12, id: 'etf-pharmabees', symbol: 'PHARMABEES.NS', ticker: 'PHARMABEES', name: 'Nippon India ETF Nifty Pharma', categoryLabel: 'Sector ETF · Healthcare', themeGroup: 'Sectoral & Infra ETFs', futuristicTheme: 'Global CDMO, Specialty Drugs & Healthcare Infra', horizon: '3–7 Years Defensive Growth', reason: 'Low-cost (0.24% TER) basket of India’s premier R&D pharma and diagnostics franchises.', currencyPrefix: '₹', kind: 'quote', keywords: ['pharmabees', 'pharma'] },
  { rank: 13, id: 'etf-infrabees', symbol: 'INFRABEES.NS', ticker: 'INFRABEES', name: 'Nippon India ETF Infra BeES', categoryLabel: 'Sector ETF · Infrastructure', themeGroup: 'Sectoral & Infra ETFs', futuristicTheme: 'High-Speed Rail, Ports, Power Grid & Data Centers', horizon: '5–10 Years Capex Supercycle', reason: 'Direct passive play on India’s multi-trillion-dollar infrastructure, power transmission, and logistics upgrade.', currencyPrefix: '₹', kind: 'quote', keywords: ['infrabees', 'infra', 'power', 'rail'] },
  { rank: 14, id: 'etf-cpse', symbol: 'CPSEETF.NS', ticker: 'CPSEETF', name: 'CPSE ETF (Strategic PSU Basket)', categoryLabel: 'Sector ETF · Sovereign PSU', themeGroup: 'Sectoral & Infra ETFs', futuristicTheme: 'BEL, NTPC & Sovereign Power/Defence Re-rating (0.07% TER)', horizon: '3–7 Years Value + Dividend', reason: 'Heavy weights in strategic defence and power PSUs paired with strong dividend yields at a tiny 0.07% cost.', currencyPrefix: '₹', kind: 'quote', keywords: ['cpse', 'psu', 'bel', 'ntpc'] },
  { rank: 15, id: 'etf-bankbees', symbol: 'BANKBEES.NS', ticker: 'BANKBEES', name: 'Nippon India ETF Bank BeES', categoryLabel: 'Sector ETF · Banking', themeGroup: 'Sectoral & Infra ETFs', futuristicTheme: 'India Formal Credit & FinTech Banking Rails', horizon: '3–7 Years Credit Cycle', reason: 'Most liquid sectoral ETF on NSE, anchoring credit growth across India’s top 12 banks.', currencyPrefix: '₹', kind: 'quote', keywords: ['bankbees', 'bank'] },
  { rank: 16, id: 'etf-consumbees', symbol: 'CONSUMBEES.NS', ticker: 'CONSUMBEES', name: 'Nippon India ETF India Consumption', categoryLabel: 'Sector ETF · Consumption', themeGroup: 'Sectoral & Infra ETFs', futuristicTheme: 'Per-Capita Income Rise & Formal Premium Retail', horizon: '5–10 Years Domestic Growth', reason: 'Tracks premiumization across Indian autos, telecom, staples, and discretionary retail as GDP/capita expands.', currencyPrefix: '₹', kind: 'quote', keywords: ['consumbees', 'consumption'] },
  { rank: 17, id: 'etf-psubnk', symbol: 'PSUBNKBEES.NS', ticker: 'PSUBNKBEES', name: 'Nippon India ETF PSU Bank BeES', categoryLabel: 'Sector ETF · PSU Banks', themeGroup: 'Sectoral & Infra ETFs', futuristicTheme: 'Cleaned Balance Sheets & Infrastructure Lending', horizon: '3–5 Years Re-rating', reason: 'Captures credit-cost normalization and corporate capex lending demand across public sector banks.', currencyPrefix: '₹', kind: 'quote', keywords: ['psubnkbees', 'psu bank'] },
  { rank: 18, id: 'etf-goldbees', symbol: 'GOLDBEES.NS', ticker: 'GOLDBEES', name: 'Nippon India ETF Gold BeES', categoryLabel: 'Gold ETF · Bullion Hedge', themeGroup: 'Precious Commodity ETFs', futuristicTheme: '24K Sovereign Currency Hedge & Zero Making Charge', horizon: 'All-Weather Macro Hedge', reason: 'India’s highest-volume Gold ETF protecting purchasing power against inflation, rupee weakness, and equity drawdowns.', currencyPrefix: '₹', kind: 'quote', keywords: ['goldbees', 'gold etf'] },
  { rank: 19, id: 'etf-setfgold', symbol: 'SETFGOLD.NS', ticker: 'SETFGOLD', name: 'SBI Gold ETF', categoryLabel: 'Gold ETF · Bullion Hedge', themeGroup: 'Precious Commodity ETFs', futuristicTheme: 'Physical-Backed Demat Gold With Low Spread', horizon: 'All-Weather Portfolio Hedge', reason: 'Sovereign-pedigree custody backing physical bullion inside demat portfolios with tight tracking.', currencyPrefix: '₹', kind: 'quote', keywords: ['setfgold', 'sbi gold'] },
  { rank: 20, id: 'etf-silverbees', symbol: 'SILVERBEES.NS', ticker: 'SILVERBEES', name: 'Nippon India Silver ETF (Silver BeES)', categoryLabel: 'Silver ETF · Solar Metal', themeGroup: 'Precious Commodity ETFs', futuristicTheme: 'EV + Solar PV Industrial Silver Play in Demat', horizon: '3–7 Years Green Metal', reason: 'Dual benefit of monetary precious-metal protection and rising industrial silver demand in solar cells and EV electronics.', currencyPrefix: '₹', kind: 'quote', keywords: ['silverbees', 'silver etf', 'solar'] },
];

export const IPO_FUTURISTIC_SPECS: FuturisticSpecBase[] = [
  { rank: 1, id: 'ipo-waaree', symbol: 'WAAREEENER.NS', ticker: 'WAAREEENER', name: 'Waaree Energies Ltd', categoryLabel: 'Listed IPO · Issue ₹1,503 (79.44x Sub)', themeGroup: 'Clean Energy & Solar IPOs', futuristicTheme: 'India #1 Solar Module & Cell/Wafer Backward Integration', horizon: '2025–2035 Solar Gigafactory', reason: 'Blockbuster 79x IPO subscription funded ingot-to-cell vertical integration and US factory expansion ahead of ALMM tailwinds.', currencyPrefix: '₹', kind: 'quote', keywords: ['waaree', 'solar', 'ipo'] },
  { rank: 2, id: 'ipo-ntpcgreen', symbol: 'NTPCGREEN.NS', ticker: 'NTPCGREEN', name: 'NTPC Green Energy Ltd', categoryLabel: 'Listed IPO · Issue ₹108 (₹10,000 Cr)', themeGroup: 'Clean Energy & Solar IPOs', futuristicTheme: '60 GW Clean Utility & Green Hydrogen Flagship', horizon: '2025–2035 Net Zero', reason: 'Landmark PSU renewable spin-off utilizing low AAA sovereign financing for gigawatt-scale solar, wind, and battery storage.', currencyPrefix: '₹', kind: 'quote', keywords: ['ntpc green', 'ntpcgreen', 'hydrogen'] },
  { rank: 3, id: 'ipo-premier', symbol: 'PREMIERENE.NS', ticker: 'PREMIERENE', name: 'Premier Energies Ltd', categoryLabel: 'Listed IPO · Issue ₹450 (75.00x Sub)', themeGroup: 'Clean Energy & Solar IPOs', futuristicTheme: 'TOPCon Domestic Solar Cell Manufacturing Leader', horizon: '2025–2033 Domestic Cell Moat', reason: 'One of India’s rare scaled TOPCon solar cell manufacturers commanding premium margins as domestic content rules tighten.', currencyPrefix: '₹', kind: 'quote', keywords: ['premier energies', 'premierene', 'solar cell'] },
  { rank: 4, id: 'ipo-tatatech', symbol: 'TATATECH.NS', ticker: 'TATATECH', name: 'Tata Technologies Ltd', categoryLabel: 'Listed IPO · Issue ₹500 (69.43x Sub)', themeGroup: 'Tech, ER&D & Precision', futuristicTheme: 'Turnkey EV Design, Aerospace & Digital Twin ER&D', horizon: '2025–2032 Global ER&D', reason: 'Pure-play engineering R&D partner designing electric platforms and digital factories for Tata Motors, JLR, and Airbus suppliers.', currencyPrefix: '₹', kind: 'quote', keywords: ['tata tech', 'tatatech', 'er&d'] },
  { rank: 5, id: 'ipo-jyoticnc', symbol: 'JYOTICNC.NS', ticker: 'JYOTICNC', name: 'Jyoti CNC Automation Ltd', categoryLabel: 'Listed IPO · Issue ₹331 (40.49x Sub)', themeGroup: 'Tech, ER&D & Precision', futuristicTheme: '5-Axis Precision Machining for Aerospace & Semiconductors', horizon: '2025–2032 Factory 4.0', reason: 'Indigenous builder of ultra-precision 5-axis CNC machines critical for EMS enclosures, defence components, and EV tooling.', currencyPrefix: '₹', kind: 'quote', keywords: ['jyoti cnc', 'jyoticnc', 'cnc'] },
  { rank: 6, id: 'ipo-indegene', symbol: 'INDGN.NS', ticker: 'INDGN', name: 'Indegene Ltd', categoryLabel: 'Listed IPO · Issue ₹452 (70.30x Sub)', themeGroup: 'Tech, ER&D & Precision', futuristicTheme: 'GenAI Commercialization SaaS for Top 20 Global Biopharma', horizon: '2025–2031 Life-Sciences AI', reason: 'Specialty digital platform automating medical affairs, regulatory submissions, and omnichannel launches for global pharma giants.', currencyPrefix: '₹', kind: 'quote', keywords: ['indegene', 'indgn', 'pharma ai'] },
  { rank: 7, id: 'ipo-olaelec', symbol: 'OLAELEC.NS', ticker: 'OLAELEC', name: 'Ola Electric Mobility Ltd', categoryLabel: 'Listed IPO · Issue ₹76 (4.45x Sub)', themeGroup: 'EV, Quick Commerce & Consumer Tech', futuristicTheme: '2W EV Vertical Integration & Domestic Cell Gigafactory', horizon: '2025–2033 EV Transition', reason: 'India’s largest E2W network building sovereign 4680 lithium-ion cell capacity under India’s ACC PLI scheme.', currencyPrefix: '₹', kind: 'quote', keywords: ['ola electric', 'olaelec', 'ev'] },
  { rank: 8, id: 'ipo-swiggy', symbol: 'SWIGGY.NS', ticker: 'SWIGGY', name: 'Swiggy Ltd', categoryLabel: 'Listed IPO · Issue ₹390 (3.59x Sub)', themeGroup: 'EV, Quick Commerce & Consumer Tech', futuristicTheme: 'Instamart Quick Commerce & AI Last-Mile Grid', horizon: '2025–2032 Urban Commerce', reason: 'Rapidly scaling 10-minute Instamart dark stores and AI-routed hyperlocal logistics across Tier-1 & Tier-2 Indian cities.', currencyPrefix: '₹', kind: 'quote', keywords: ['swiggy', 'instamart', 'quick commerce'] },
  { rank: 9, id: 'ipo-hyundai', symbol: 'HYUNDAI.NS', ticker: 'HYUNDAI', name: 'Hyundai Motor India Ltd', categoryLabel: 'Listed IPO · Issue ₹1,960 (₹27,870 Cr)', themeGroup: 'EV, Quick Commerce & Consumer Tech', futuristicTheme: 'SUV Localization & Export EV Manufacturing Hub', horizon: '2025–2032 EV Localization', reason: 'India’s largest-ever IPO backed by localized EV battery/drivetrain capex and global export hub economics.', currencyPrefix: '₹', kind: 'quote', keywords: ['hyundai', 'auto ipo'] },
  { rank: 10, id: 'ipo-bajajhfl', symbol: 'BAJAJHFL.NS', ticker: 'BAJAJHFL', name: 'Bajaj Housing Finance Ltd', categoryLabel: 'Listed IPO · Issue ₹70 (67.43x Sub)', themeGroup: 'Fintech & Financial Infra', futuristicTheme: 'Digital Prime Mortgage Compounder at Sub-1% NPA', horizon: '2025–2035 Urban Housing', reason: 'Exceptional asset quality and digital underwriting scale capturing India’s rising formal prime housing credit demand.', currencyPrefix: '₹', kind: 'quote', keywords: ['bajaj housing', 'bajajhfl'] },
  { rank: 11, id: 'ipo-mobikwik', symbol: 'MOBIKWIK.NS', ticker: 'MOBIKWIK', name: 'One MobiKwik Systems Ltd', categoryLabel: 'Listed IPO · Issue ₹279 (119.38x Sub)', themeGroup: 'Fintech & Financial Infra', futuristicTheme: 'AI-Scored Digital Credit (ZIP) & UPI Pocket Rails', horizon: '2025–2031 Consumer FinTech', reason: 'Heavily oversubscribed 119x IPO combining profitable UPI merchant rails with high-margin digital credit distribution.', currencyPrefix: '₹', kind: 'quote', keywords: ['mobikwik', 'fintech', 'upi'] },
  { rank: 12, id: 'ipo-godigit', symbol: 'GODIGIT.NS', ticker: 'GODIGIT', name: 'Go Digit General Insurance Ltd', categoryLabel: 'Listed IPO · Issue ₹272 (9.60x Sub)', themeGroup: 'Fintech & Financial Infra', futuristicTheme: 'Cloud-Native InsurTech Underwriting & AI Claims', horizon: '2025–2032 Digital Insurance', reason: 'API-first digital insurer disrupting legacy claims settlement using automated AI risk pricing across India’s under-penetrated market.', currencyPrefix: '₹', kind: 'quote', keywords: ['go digit', 'godigit', 'insurance'] },
  { rank: 13, id: 'ipo-firstcry', symbol: 'FIRSTCRY.NS', ticker: 'FIRSTCRY', name: 'Brainbees Solutions (FirstCry)', categoryLabel: 'Listed IPO · Issue ₹465 (12.22x Sub)', themeGroup: 'EV, Quick Commerce & Consumer Tech', futuristicTheme: 'Omnichannel Baby/Kids Platform & GlobalBees Roll-Up', horizon: '2025–2032 Specialty Retail', reason: 'Undisputed vertical omnichannel leader combining 1,000+ physical stores with D2C digital brand incubation.', currencyPrefix: '₹', kind: 'quote', keywords: ['firstcry', 'brainbees'] },
  { rank: 14, id: 'ipo-vmm', symbol: 'VMM.NS', ticker: 'VMM', name: 'Vishal Mega Mart Ltd', categoryLabel: 'Listed IPO · Issue ₹78 (28.75x Sub)', themeGroup: 'EV, Quick Commerce & Consumer Tech', futuristicTheme: 'Tier-2/3 Formal Value Retail & Private-Label Margin Engine', horizon: '2025–2032 Bharat Retail', reason: 'High-ROCE asset-light private-label powerhouse unlocking India’s Tier-2/3 consumption upgrade.', currencyPrefix: '₹', kind: 'quote', keywords: ['vishal mega mart', 'vmm'] },
  { rank: 15, id: 'pip-nsdl', ticker: 'NSDL (IPO)', name: 'National Securities Depository Ltd (NSDL)', categoryLabel: 'Upcoming IPO · DRHP Approved', themeGroup: 'Pipeline DRHP Watchlist', futuristicTheme: 'Core Capital Markets Demat & Institutional Custody Duopoly', horizon: 'Pipeline · SEBI Approved', reason: 'India’s foundational institutional depository powering trillions in demat assets, sovereign custody, and payment-bank rails.', currencyPrefix: '', kind: 'ipo-pipeline', staticPrice: null, metricLabel: 'Stage', metricValue: 'SEBI Approved · Est. ₹3,000+ Cr', keywords: ['nsdl', 'depository', 'sebi'] },
  { rank: 16, id: 'pip-zepto', ticker: 'ZEPTO (IPO)', name: 'Zepto (Kiranakart Technologies)', categoryLabel: 'Upcoming IPO · DRHP Prep', themeGroup: 'Pipeline DRHP Watchlist', futuristicTheme: 'AI-Driven 10-Minute Hyperlocal Quick Commerce', horizon: 'Pipeline · Est. ₹8,000 Cr', reason: 'Fastest-scaling Indian quick-commerce disruptor compressing urban grocery, electronics, and D2C fulfillment into sub-10 minutes.', currencyPrefix: '', kind: 'ipo-pipeline', staticPrice: null, metricLabel: 'Stage', metricValue: 'DRHP Prep · Est. ₹8,000 Cr', keywords: ['zepto', 'quick commerce', 'ipo'] },
  { rank: 17, id: 'pip-lg', ticker: 'LG INDIA (IPO)', name: 'LG Electronics India Ltd', categoryLabel: 'Upcoming IPO · DRHP Filed', themeGroup: 'Pipeline DRHP Watchlist', futuristicTheme: 'AI Smart Appliances & Make-in-India White Goods', horizon: 'Pipeline · Est. ₹15,000 Cr', reason: 'Market-leading consumer electronics franchise expanding domestic inverter/smart-home manufacturing and export capacity.', currencyPrefix: '', kind: 'ipo-pipeline', staticPrice: null, metricLabel: 'Stage', metricValue: 'DRHP Filed · Est. ₹15,000 Cr', keywords: ['lg electronics', 'lg india', 'drhp'] },
  { rank: 18, id: 'pip-ather', symbol: 'ATHERENERG.NS', ticker: 'ATHER', name: 'Ather Energy Ltd', categoryLabel: 'Recent / Bookbuilding · Electric 2W', themeGroup: 'Pipeline DRHP Watchlist', futuristicTheme: 'Software-Defined E2W Scooters & Fast-Charging Grid', horizon: '2025–2032 Clean Mobility', reason: 'Software-first electric two-wheeler pioneer running proprietary AtherStack OS and nationwide fast-charging infrastructure.', currencyPrefix: '₹', kind: 'ipo-pipeline', staticPrice: null, metricLabel: 'Stage', metricValue: 'EV 2W Listing Track · ₹3,100+ Cr', keywords: ['ather', 'ather energy', 'ev'] },
  { rank: 19, id: 'pip-tatacap', ticker: 'TATA CAP (IPO)', name: 'Tata Capital Ltd', categoryLabel: 'Upcoming IPO · RBI Upper-Layer Track', themeGroup: 'Pipeline DRHP Watchlist', futuristicTheme: 'AAA Diversified Clean-Tech & Enterprise FinTech NBFC', horizon: 'Pipeline · Est. ₹15,000+ Cr', reason: 'RBI mandatory listing of Tata Group’s flagship diversified lender spanning clean-tech infrastructure, MSMEs, and wealth credit.', currencyPrefix: '', kind: 'ipo-pipeline', staticPrice: null, metricLabel: 'Stage', metricValue: 'Mandatory NBFC Listing · ₹15,000+ Cr', keywords: ['tata capital', 'tata ipo'] },
  { rank: 20, id: 'pip-vikram', ticker: 'VIKRAM SOLAR', name: 'Vikram Solar Ltd', categoryLabel: 'Pipeline IPO · Solar Modules', themeGroup: 'Pipeline DRHP Watchlist', futuristicTheme: 'Domestic ALMM Solar Cell & Module Capacity Expansion', horizon: 'Pipeline · Solar Growth', reason: 'Established Tier-1 Indian solar manufacturer scaling gigawatt module/cell lines to capitalize on India & US utility solar demand.', currencyPrefix: '', kind: 'ipo-pipeline', staticPrice: null, metricLabel: 'Stage', metricValue: 'RHP / Allotment Pipeline · ₹1,500+ Cr', keywords: ['vikram solar', 'solar ipo'] },
];

export const GOLD_FUTURISTIC_SPECS: FuturisticSpecBase[] = [
  { rank: 1, id: 'gold-bees', symbol: 'GOLDBEES.NS', ticker: 'GOLDBEES', name: 'Nippon India ETF Gold BeES', categoryLabel: 'Indian Gold ETF · Demat Liquid', themeGroup: 'Indian Gold ETFs & SGB', futuristicTheme: '24K Sovereign Reserve Hedge with Instant NSE Liquidity', horizon: 'Core Inflation & INR Hedge', reason: 'Most liquid Indian gold ETF enabling frictionless fractional accumulation at 99.5% purity without making charges or locker risk.', currencyPrefix: '₹', kind: 'quote', keywords: ['goldbees', 'gold etf', 'gold'] },
  { rank: 2, id: 'gold-setf', symbol: 'SETFGOLD.NS', ticker: 'SETFGOLD', name: 'SBI Gold ETF', categoryLabel: 'Indian Gold ETF · 0.65% TER', themeGroup: 'Indian Gold ETFs & SGB', futuristicTheme: 'Institutional SBI Custody Physical Bullion Backing', horizon: 'Long-Term Macro Insurance', reason: 'Tracks domestic 24K physical gold prices cleanly with competitive expense ratios inside demat portfolios.', currencyPrefix: '₹', kind: 'quote', keywords: ['sbi gold', 'setfgold', 'gold etf'] },
  { rank: 3, id: 'gold-hdfc', symbol: 'HDFCGOLD.NS', ticker: 'HDFCGOLD', name: 'HDFC Gold ETF', categoryLabel: 'Indian Gold ETF · 0.59% TER', themeGroup: 'Indian Gold ETFs & SGB', futuristicTheme: 'Low-Cost Physical Bullion Tracker', horizon: 'Portfolio Volatility Stabilizer', reason: 'Efficient 0.59% TER physical bullion tracking backed by tight market-maker quotes during RBI and Fed macro events.', currencyPrefix: '₹', kind: 'quote', keywords: ['hdfc gold', 'hdfcgold'] },
  { rank: 4, id: 'gold-icici', symbol: 'GOLDIETF.NS', ticker: 'GOLDIETF', name: 'ICICI Prudential Gold ETF', categoryLabel: 'Indian Gold ETF · 0.50% TER', themeGroup: 'Indian Gold ETFs & SGB', futuristicTheme: 'Ultra-Low Expense Demat Bullion', horizon: 'Multi-Year Currency Hedge', reason: 'Lowest TER among major Indian gold ETFs, maximizing compounded bullion parity over multi-year holding horizons.', currencyPrefix: '₹', kind: 'quote', keywords: ['icici gold', 'goldietf'] },
  { rank: 5, id: 'gold-tata', symbol: 'TATAGOLD.NS', ticker: 'TATAGOLD', name: 'Tata Gold Exchange Traded Fund', categoryLabel: 'Indian Gold ETF · Micro-Unit', themeGroup: 'Indian Gold ETFs & SGB', futuristicTheme: 'Low-Ticket Systematic Gold Accumulation', horizon: 'Monthly SIP Bullion', reason: 'Low per-unit price structure allows retail SIP investors to rebalance gold allocations accurately every month.', currencyPrefix: '₹', kind: 'quote', keywords: ['tata gold', 'tatagold'] },
  { rank: 6, id: 'gold-kotak-alt', symbol: 'GOLD1.NS', ticker: 'GOLD1', name: 'Kotak Gold ETF', categoryLabel: 'Indian Gold ETF · NSE', themeGroup: 'Indian Gold ETFs & SGB', futuristicTheme: 'Direct Physical Bullion Parity ETF', horizon: 'All-Weather Hedge', reason: 'Tracks domestic spot gold closely with strong exchange market depth.', currencyPrefix: '₹', kind: 'quote', keywords: ['kotak gold', 'gold1'] },
  { rank: 7, id: 'gold-sgb', ticker: 'SGB 2032', name: 'Sovereign Gold Bond (Series IV 2023-24 Parity)', categoryLabel: 'RBI Sovereign Bond · 2.5% Coupon', themeGroup: 'Indian Gold ETFs & SGB', futuristicTheme: 'Tax-Free 8-Yr Maturity Capital Gains + 2.5% Govt Interest', horizon: 'Hold to Feb 2032', reason: 'Gold-standard Indian bullion asset paying extra 2.5% annual sovereign interest plus zero capital-gains tax if held to maturity.', currencyPrefix: '₹', kind: 'sgb', keywords: ['sgb', 'sovereign gold bond', 'rbi'] },
  { rank: 8, id: 'gold-mf-118663', schemeCode: '118663', ticker: 'NIPPON GOLD FOF', name: 'Nippon India Gold Savings Fund (Direct)', categoryLabel: 'AMFI Gold Mutual Fund · SIP', themeGroup: 'Indian Gold ETFs & SGB', futuristicTheme: 'Automated Monthly Gold SIP Without Demat Account', horizon: 'Automated SIP Hedge', reason: 'Lets long-term savers automate monthly gold rupee-cost averaging directly via AMFI NAV without needing intraday execution.', currencyPrefix: '₹', kind: 'mf', keywords: ['gold fund', 'sip', 'amfi'] },
  { rank: 9, id: 'gold-comex', symbol: 'GC=F', ticker: 'GC=F (COMEX)', name: 'COMEX Gold Futures Benchmark', categoryLabel: 'Global Futures · USD / oz', themeGroup: 'Global Bullion & Royalty Leaders', futuristicTheme: 'Global Central-Bank De-Dollarization Reserve Gauge', horizon: 'Global Macro Anchor', reason: 'Global benchmark pricing sovereign central-bank gold accumulation, US real yields, and geopolitical safe-haven demand.', currencyPrefix: '$', kind: 'quote', keywords: ['comex', 'gold price', 'fed', 'central bank'] },
  { rank: 10, id: 'gold-gld', symbol: 'GLD', ticker: 'GLD (SPDR)', name: 'SPDR Gold Shares (Global #1 Gold ETF)', categoryLabel: 'Global ETF · USD', themeGroup: 'Global Bullion & Royalty Leaders', futuristicTheme: 'World’s Largest Institutional Physical Gold Vault', horizon: 'Global Liquidity Signal', reason: 'Tracks real-time Western institutional ETF inflows/outflows that drive major multi-month gold bull breakouts.', currencyPrefix: '$', kind: 'quote', keywords: ['gld', 'spdr', 'gold etf'] },
  { rank: 11, id: 'gold-gdx', symbol: 'GDX', ticker: 'GDX', name: 'VanEck Gold Miners ETF', categoryLabel: 'Global Miners ETF · USD', themeGroup: 'Global Bullion & Royalty Leaders', futuristicTheme: 'Operating Leverage to Rising Gold Prices', horizon: 'Cyclical Bullion Beta', reason: 'Major gold producers expand free-cash-flow margins faster than spot bullion once prices clear all-in sustaining costs.', currencyPrefix: '$', kind: 'quote', keywords: ['gold miners', 'gdx'] },
  { rank: 12, id: 'gold-fnv', symbol: 'FNV', ticker: 'FNV', name: 'Franco-Nevada Corp (Gold Royalty)', categoryLabel: 'Global Royalty · USD', themeGroup: 'Global Bullion & Royalty Leaders', futuristicTheme: 'Zero-Mining-Cost Gold Streaming Monopoly', horizon: 'Long-Term Bullion Equity', reason: 'Asset-light royalty model earns top-line gold revenue streams without inflationary mine-operating capex risk.', currencyPrefix: '$', kind: 'quote', keywords: ['franco-nevada', 'royalty', 'gold'] },
  { rank: 13, id: 'gold-wpm', symbol: 'WPM', ticker: 'WPM', name: 'Wheaton Precious Metals (Streaming)', categoryLabel: 'Global Streaming · USD', themeGroup: 'Global Bullion & Royalty Leaders', futuristicTheme: 'High-Margin Gold & Silver Streaming Leader', horizon: '2025–2032 Precious Metals', reason: 'Fixed-cost streaming agreements convert precious-metal upside straight into 75%+ EBITDA margins.', currencyPrefix: '$', kind: 'quote', keywords: ['wheaton', 'precious metals'] },
  { rank: 14, id: 'gold-nem', symbol: 'NEM', ticker: 'NEM', name: 'Newmont Corporation', categoryLabel: 'Global Tier-1 Miner · USD', themeGroup: 'Global Bullion & Royalty Leaders', futuristicTheme: 'World’s Largest Tier-1 Gold & Copper Producer', horizon: 'Macro Bullion Cycle', reason: 'Unmatched Tier-1 jurisdiction reserves pairing gold upside with energy-transition copper byproduct output.', currencyPrefix: '$', kind: 'quote', keywords: ['newmont', 'gold mining'] },
  { rank: 15, id: 'gold-aem', symbol: 'AEM', ticker: 'AEM', name: 'Agnico Eagle Mines Ltd', categoryLabel: 'Global Tier-1 Miner · USD', themeGroup: 'Global Bullion & Royalty Leaders', futuristicTheme: 'Low-Risk North American/Nordic Bullion Compounder', horizon: 'Multi-Year Quality Miner', reason: 'Consistently industry-leading cost discipline across low geopolitical-risk mining jurisdictions.', currencyPrefix: '$', kind: 'quote', keywords: ['agnico', 'gold'] },
  { rank: 16, id: 'gold-barrick', symbol: 'GOLD', ticker: 'GOLD (Barrick)', name: 'Barrick Gold Corporation', categoryLabel: 'Global Miner · USD', themeGroup: 'Global Bullion & Royalty Leaders', futuristicTheme: 'Tier-1 Gold & Transition Copper Growth Portfolio', horizon: 'Global Metal Cycle', reason: 'Combining Tier-1 gold assets with expanding copper production creates a dual inflation and electrification hedge.', currencyPrefix: '$', kind: 'quote', keywords: ['barrick', 'gold'] },
  { rank: 17, id: 'gold-titan', symbol: 'TITAN.NS', ticker: 'TITAN', name: 'Titan Company Ltd (Tanishq)', categoryLabel: 'Indian Jewellery · Large Cap', themeGroup: 'Indian Jewellery & Gold Finance', futuristicTheme: 'Organized Retail Share Gain & Branded Omnichannel Gold', horizon: '2025–2035 India Luxury', reason: 'Captures India’s structural shift from unorganized local jewellers to BIS-hallmarked Tanishq & CaratLane chains.', currencyPrefix: '₹', kind: 'quote', keywords: ['titan', 'tanishq', 'jewellery'] },
  { rank: 18, id: 'gold-kalyan', symbol: 'KALYANKJIL.NS', ticker: 'KALYANKJIL', name: 'Kalyan Jewellers India Ltd', categoryLabel: 'Indian Jewellery · Asset-Light FOCO', themeGroup: 'Indian Jewellery & Gold Finance', futuristicTheme: 'Asset-Light Franchise Expansion & Debt Reduction', horizon: '2025–2032 Consumption', reason: 'High-ROE asset-light FOCO showroom expansion across non-South India and Candere omni-digital channels drives rapid store productivity.', currencyPrefix: '₹', kind: 'quote', keywords: ['kalyan jewellers', 'kalyan', 'jewellery'] },
  { rank: 19, id: 'gold-muthoot', symbol: 'MUTHOOTFIN.NS', ticker: 'MUTHOOTFIN', name: 'Muthoot Finance Ltd', categoryLabel: 'Gold Loan NBFC · High ROE', themeGroup: 'Indian Jewellery & Gold Finance', futuristicTheme: 'High Gold Prices Expand Collateral Loan AUM & Security', horizon: '2025–2032 Credit + Bullion', reason: 'Rising gold prices directly boost loan-to-value collateral headroom while near-zero credit losses sustain 20%+ ROE.', currencyPrefix: '₹', kind: 'quote', keywords: ['muthoot', 'gold loan', 'rbi'] },
  { rank: 20, id: 'gold-manappuram', symbol: 'MANAPPURAM.NS', ticker: 'MANAPPURAM', name: 'Manappuram Finance Ltd', categoryLabel: 'Gold Loan NBFC · Digital Pawn', themeGroup: 'Indian Jewellery & Gold Finance', futuristicTheme: 'Online Gold Loans & Bullion Collateral Appreciation', horizon: '2025–2030 Credit Cycle', reason: 'Benefits directly from higher 24K domestic gold parity boosting customer borrowing eligibility with ultra-short loan tenures.', currencyPrefix: '₹', kind: 'quote', keywords: ['manappuram', 'gold loan'] },
];

export const SILVER_FUTURISTIC_SPECS: FuturisticSpecBase[] = [
  { rank: 1, id: 'sil-bees', symbol: 'SILVERBEES.NS', ticker: 'SILVERBEES', name: 'Nippon India Silver ETF (Silver BeES)', categoryLabel: 'Indian Silver ETF · NSE Liquid', themeGroup: 'Indian Silver ETFs & FoFs', futuristicTheme: 'Pure Demat Exposure to Industrial & Monetary Silver', horizon: '3–7 Years Green Metal', reason: 'Highest liquidity NSE silver ETF letting Indian investors ride both bullion safe-haven flows and global solar PV deficits.', currencyPrefix: '₹', kind: 'quote', keywords: ['silverbees', 'silver etf', 'silver'] },
  { rank: 2, id: 'sil-hdfc', symbol: 'HDFCSILVER.NS', ticker: 'HDFCSILVER', name: 'HDFC Silver ETF', categoryLabel: 'Indian Silver ETF · NSE', themeGroup: 'Indian Silver ETFs & FoFs', futuristicTheme: 'Physical 99.9% Purity Vaulted Silver in Demat', horizon: 'Medium-to-Long Hedge', reason: 'Clean demat tracking of LBMA/domestic silver parity without storage tarnish, GST leakage, or making charges.', currencyPrefix: '₹', kind: 'quote', keywords: ['hdfc silver', 'hdfcsilver'] },
  { rank: 3, id: 'sil-icici', symbol: 'SILVERIETF.NS', ticker: 'SILVERIETF', name: 'ICICI Prudential Silver ETF', categoryLabel: 'Indian Silver ETF · NSE', themeGroup: 'Indian Silver ETFs & FoFs', futuristicTheme: 'Cost-Efficient Physical Silver ETF Benchmark', horizon: 'Multi-Year Bullion Cycle', reason: 'Tight tracking precision and high exchange market-maker support for tactical or SIP accumulation.', currencyPrefix: '₹', kind: 'quote', keywords: ['icici silver', 'silverietf'] },
  { rank: 4, id: 'sil-sbi', symbol: 'SBISILVER.NS', ticker: 'SBISILVER', name: 'SBI Silver ETF', categoryLabel: 'Indian Silver ETF · NSE', themeGroup: 'Indian Silver ETFs & FoFs', futuristicTheme: 'SBI Custodial Backing for Domestic Silver Parity', horizon: 'Long-Term Commodity Hedge', reason: 'Tracks MCX/domestic physical silver spot trends transparently inside equity brokerage accounts.', currencyPrefix: '₹', kind: 'quote', keywords: ['sbi silver', 'sbisilver'] },
  { rank: 5, id: 'sil-mf-nippon', schemeCode: '149760', ticker: 'NIPPON SIL FOF', name: 'Nippon India Silver ETF FoF (Direct)', categoryLabel: 'AMFI Silver FoF · SIP Ready', themeGroup: 'Indian Silver ETFs & FoFs', futuristicTheme: 'Systematic Monthly Silver SIP Accumulation', horizon: '3–7 Years SIP', reason: 'Enables effortless automated monthly SIP investing in silver parity without holding a demat account.', currencyPrefix: '₹', kind: 'mf', keywords: ['silver fof', 'nippon silver', 'amfi'] },
  { rank: 6, id: 'sil-mf-icici', schemeCode: '149775', ticker: 'ICICI SIL FOF', name: 'ICICI Pru Silver ETF FoF (Direct · 0.12% TER)', categoryLabel: 'AMFI Silver FoF · Low TER', themeGroup: 'Indian Silver ETFs & FoFs', futuristicTheme: 'Ultra-Low 0.12% FoF Fee for Solar-Metal Diversification', horizon: '3–7 Years SIP', reason: 'Minimal wrapper fee provides pure exposure to global structural silver supply deficits.', currencyPrefix: '₹', kind: 'mf', keywords: ['icici silver fof', 'silver mutual fund'] },
  { rank: 7, id: 'sil-comex', symbol: 'SI=F', ticker: 'SI=F (COMEX)', name: 'COMEX Silver Futures Benchmark', categoryLabel: 'Global Futures · USD / oz', themeGroup: 'Global Silver & Primary Producers', futuristicTheme: 'Gold-Silver Ratio Compression + AI Electronics Demand', horizon: 'Global Metal Cycle', reason: 'Silver is irreplaceable in next-gen TOPCon/HJT solar cells, EV contactors, and high-frequency AI data-center boards.', currencyPrefix: '$', kind: 'quote', keywords: ['silver price', 'comex silver', 'solar'] },
  { rank: 8, id: 'sil-slv', symbol: 'SLV', ticker: 'SLV (iShares)', name: 'iShares Silver Trust (Global ETF)', categoryLabel: 'Global ETF · USD', themeGroup: 'Global Silver & Primary Producers', futuristicTheme: 'Global Institutional Silver Flows Barometer', horizon: 'Global Precious Metal', reason: 'Worlds largest vaulted silver ETF reflecting global institutional positioning and physical deficit tightening.', currencyPrefix: '$', kind: 'quote', keywords: ['slv', 'ishares silver'] },
  { rank: 9, id: 'sil-hindzinc', symbol: 'HINDZINC.NS', ticker: 'HINDZINC', name: 'Hindustan Zinc Ltd (India #1 Silver)', categoryLabel: 'Indian Producer · NSE', themeGroup: 'Global Silver & Primary Producers', futuristicTheme: 'India’s Sole Integrated Primary Silver Producer + Dividend', horizon: '2025–2032 Silver & Zinc', reason: 'Produces ~700+ tonnes of refined silver annually as a high-margin byproduct alongside zinc, delivering both silver upside and cash dividends.', currencyPrefix: '₹', kind: 'quote', keywords: ['hindustan zinc', 'hindzinc', 'silver'] },
  { rank: 10, id: 'sil-vedl', symbol: 'VEDL.NS', ticker: 'VEDL', name: 'Vedanta Ltd (Silver, Zinc & Alu)', categoryLabel: 'Indian Metals · NSE', themeGroup: 'Global Silver & Primary Producers', futuristicTheme: 'Parent Leverage to Hindustan Zinc Silver + Aluminium', horizon: '2025–2030 Resource Cycle', reason: 'Controls Hindustan Zinc’s captive silver output alongside aluminium and critical mineral expansion.', currencyPrefix: '₹', kind: 'quote', keywords: ['vedanta', 'vedl', 'zinc', 'silver'] },
  { rank: 11, id: 'sil-paas', symbol: 'PAAS', ticker: 'PAAS', name: 'Pan American Silver Corp', categoryLabel: 'Global Primary Miner · USD', themeGroup: 'Global Silver & Primary Producers', futuristicTheme: 'Americas Premier Primary Silver Producer', horizon: 'Multi-Year Metal Upswing', reason: 'Pure-play operating leverage to rising global silver prices across diversified Americas underground mines.', currencyPrefix: '$', kind: 'quote', keywords: ['pan american', 'silver miner'] },
  { rank: 12, id: 'sil-hl', symbol: 'HL', ticker: 'HL (Hecla)', name: 'Hecla Mining Company', categoryLabel: 'US Primary Miner · USD', themeGroup: 'Global Silver & Primary Producers', futuristicTheme: 'Largest US Primary Silver Producer (AI/Solar Supply)', horizon: 'Long-Term Critical Silver', reason: 'Strategic North American low-jurisdiction silver reserves directly tied to US grid and solar reshoring.', currencyPrefix: '$', kind: 'quote', keywords: ['hecla', 'silver'] },
  { rank: 13, id: 'sil-ag', symbol: 'AG', ticker: 'AG (First Maj)', name: 'First Majestic Silver Corp', categoryLabel: 'High-Beta Miner · USD', themeGroup: 'Global Silver & Primary Producers', futuristicTheme: 'Highest Silver Revenue Purity & Minting Capacity', horizon: 'High-Beta Silver Play', reason: 'Exceptionally high share of total revenue derived directly from silver production offers amplified cycle beta.', currencyPrefix: '$', kind: 'quote', keywords: ['first majestic', 'silver'] },
  { rank: 14, id: 'sil-waaree', symbol: 'WAAREEENER.NS', ticker: 'WAAREEENER', name: 'Waaree Energies Ltd (Solar Silver Demand)', categoryLabel: 'Solar Gigafactory · NSE', themeGroup: 'Solar PV & Silver Consumers', futuristicTheme: 'GW-Scale Solar Cells Driving Structural Silver Paste Demand', horizon: '2025–2035 Solar Cycle', reason: 'Every gigawatt of TOPCon solar cell capacity consumes tonnes of industrial silver paste — linking India’s solar capex to silver.', currencyPrefix: '₹', kind: 'quote', keywords: ['waaree', 'solar'] },
  { rank: 15, id: 'sil-premier', symbol: 'PREMIERENE.NS', ticker: 'PREMIERENE', name: 'Premier Energies Ltd', categoryLabel: 'Solar Cell Leader · NSE', themeGroup: 'Solar PV & Silver Consumers', futuristicTheme: 'Next-Gen N-Type TOPCon Cell Expansion', horizon: '2025–2033 Solar Cells', reason: 'Transition to N-Type TOPCon solar cells increases silver intensity per watt while boosting domestic conversion efficiency.', currencyPrefix: '₹', kind: 'quote', keywords: ['premier energies', 'solar cell'] },
  { rank: 16, id: 'sil-bororenew', symbol: 'BORORENEW.NS', ticker: 'BORORENEW', name: 'Borosil Renewables Ltd', categoryLabel: 'Solar Glass Monopoly · NSE', themeGroup: 'Solar PV & Silver Consumers', futuristicTheme: 'Domestic Solar Tempered Glass Infrastructure', horizon: '2025–2032 Solar Supply Chain', reason: 'India’s pioneering domestic solar-glass manufacturer riding anti-dumping protection and GW-scale domestic module buildouts.', currencyPrefix: '₹', kind: 'quote', keywords: ['borosil', 'solar glass'] },
  { rank: 17, id: 'sil-swsolar', symbol: 'SWSOLAR.NS', ticker: 'SWSOLAR', name: 'Sterling and Wilson Renewable Energy', categoryLabel: 'Solar EPC · NSE', themeGroup: 'Solar PV & Silver Consumers', futuristicTheme: 'Utility-Scale Solar EPC & BESS Execution', horizon: '2025–2030 Clean EPC', reason: 'Backed by Reliance New Energy to construct utility solar parks and battery storage across India and MENA.', currencyPrefix: '₹', kind: 'quote', keywords: ['sterling', 'solar epc'] },
  { rank: 18, id: 'sil-tatapower', symbol: 'TATAPOWER.NS', ticker: 'TATAPOWER', name: 'Tata Power Company Ltd', categoryLabel: 'Clean Utility · NSE', themeGroup: 'Solar PV & Silver Consumers', futuristicTheme: '4.3 GW Tirunelveli Solar Cell/Module Plant & Rooftops', horizon: '2025–2034 Clean Energy', reason: 'Operating one of India’s largest solar cell & module fabs alongside PM Surya Ghar rooftop distribution.', currencyPrefix: '₹', kind: 'quote', keywords: ['tata power', 'solar'] },
  { rank: 19, id: 'sil-ntpcgreen', symbol: 'NTPCGREEN.NS', ticker: 'NTPCGREEN', name: 'NTPC Green Energy Ltd', categoryLabel: 'Utility Solar · NSE', themeGroup: 'Solar PV & Silver Consumers', futuristicTheme: '60 GW Sovereign Solar Buildout Anchor', horizon: '2025–2035 Net Zero', reason: 'Anchor buyer of gigawatt-scale solar panels underpinning structural multi-year Indian silver demand.', currencyPrefix: '₹', kind: 'quote', keywords: ['ntpc green', 'solar'] },
  { rank: 20, id: 'sil-suzlon', symbol: 'SUZLON.NS', ticker: 'SUZLON', name: 'Suzlon Energy Ltd', categoryLabel: 'Wind Hybrid · NSE', themeGroup: 'Solar PV & Silver Consumers', futuristicTheme: 'Wind-Solar Hybrid Grid Electrification Contacts', horizon: '2025–2032 Hybrid Power', reason: 'Paired with solar in India’s round-the-clock clean-energy tenders requiring silver-plated high-voltage switchgear.', currencyPrefix: '₹', kind: 'quote', keywords: ['suzlon', 'wind', 'renewable'] },
];

export const BONDS_FUTURISTIC_SPECS: FuturisticSpecBase[] = [
  { rank: 1, id: 'bnd-ltgilt', symbol: 'LTGILTBEES.NS', ticker: 'LTGILTBEES', name: 'Nippon India Nifty 8-13 Yr G-Sec ETF', categoryLabel: 'Long G-Sec ETF · NSE', themeGroup: 'Long-Duration Gilt & Rate-Cut Plays', futuristicTheme: 'High Duration Capital Gain on RBI Rate Easing', horizon: '2–5 Years Yield Cycle', reason: 'Zero credit risk sovereign 8–13Y G-Secs maximize price appreciation as global bond index inflows compress Indian yields.', currencyPrefix: '₹', kind: 'quote', keywords: ['g-sec', 'gilt', 'ltgiltbees', 'rbi', 'bond'] },
  { rank: 2, id: 'bnd-setf10', symbol: 'SETF10GILT.NS', ticker: 'SETF10GILT', name: 'SBI Nifty 10 Yr Benchmark G-Sec ETF', categoryLabel: '10Y Sovereign ETF · NSE', themeGroup: 'Long-Duration Gilt & Rate-Cut Plays', futuristicTheme: 'Pure On-The-Run 10-Year Sovereign Benchmark Liquidity', horizon: '2–5 Years Sovereign Bond', reason: 'Directly mirrors India’s flagship 10-year sovereign benchmark bond directly inside an equity demat account.', currencyPrefix: '₹', kind: 'quote', keywords: ['10 year', 'g-sec', 'sbi gilt'] },
  { rank: 3, id: 'bnd-gilt5y', symbol: 'GILT5YBEES.NS', ticker: 'GILT5YBEES', name: 'Nippon India Nifty 5 Yr Benchmark G-Sec ETF', categoryLabel: '5Y Sovereign ETF · NSE', themeGroup: 'Long-Duration Gilt & Rate-Cut Plays', futuristicTheme: 'Sweet-Spot 5Y Sovereign Yield With Lower Volatility', horizon: '2–4 Years Core Sovereign', reason: 'Balances attractive sovereign coupon accruals with lower interest-rate drawdown sensitivity than 10Y+ bonds.', currencyPrefix: '₹', kind: 'quote', keywords: ['5 yr', 'gilt5ybees', 'g-sec'] },
  { rank: 4, id: 'bnd-mf-gilt', schemeCode: '120605', ticker: 'ICICI GILT MF', name: 'ICICI Pru All Seasons / Gilt Fund (Direct)', categoryLabel: 'AMFI Dynamic Bond · Sovereign', themeGroup: 'Long-Duration Gilt & Rate-Cut Plays', futuristicTheme: 'Active Duration Management Across RBI Cycles', horizon: '2–5 Years Dynamic Debt', reason: 'Actively shifts between short T-bills and 10Y G-Secs to protect against inflation spikes and capture rate cuts.', currencyPrefix: '₹', kind: 'mf', keywords: ['gilt', 'rbi', 'bond yield'] },
  { rank: 5, id: 'bnd-liqcase', symbol: 'LIQUIDCASE.NS', ticker: 'LIQUIDCASE', name: 'Zerodha Nifty 1D Rate Liquid ETF (Growth)', categoryLabel: 'Overnight Liquid ETF · Growth NAV', themeGroup: 'Treasury Cash & Liquid Margin', futuristicTheme: 'F&O Collateral Cash Yield Without Dividend TDS Drag', horizon: 'Overnight / Cash Parking', reason: 'Growth NAV structure eliminates awkward fractional dividend units of legacy liquid ETFs while earning RBI repo overnight yield.', currencyPrefix: '₹', kind: 'quote', keywords: ['liquidcase', 'zerodha', 'liquid etf', 'repo'] },
  { rank: 6, id: 'bnd-liqbees', symbol: 'LIQUIDBEES.NS', ticker: 'LIQUIDBEES', name: 'Nippon India ETF Liquid BeES', categoryLabel: 'Overnight Liquid ETF · Collateral', themeGroup: 'Treasury Cash & Liquid Margin', futuristicTheme: 'India’s Highest-Volume Cash Margin Pledge Instrument', horizon: 'Daily Cash Management', reason: 'Zero equity-market volatility with instant intraday buy/sell settlement for parking idle brokerage cash.', currencyPrefix: '₹', kind: 'quote', keywords: ['liquidbees', 'margin', 'liquid'] },
  { rank: 7, id: 'bnd-liqietf', symbol: 'LIQUIDIETF.NS', ticker: 'LIQUIDIETF', name: 'ICICI Pru Nifty 1D Rate Liquid ETF', categoryLabel: 'Overnight Liquid ETF · NSE', themeGroup: 'Treasury Cash & Liquid Margin', futuristicTheme: 'Institutional TREPS Overnight Money-Market Rate', horizon: 'Short-Term Treasury', reason: 'Tracks MIBOR/TREPS overnight sovereign lending rates with negligible tracking error.', currencyPrefix: '₹', kind: 'quote', keywords: ['liquidietf', 'treps'] },
  { rank: 8, id: 'bnd-mf-liq', schemeCode: '118701', ticker: 'NIPPON LIQUID', name: 'Nippon India Liquid Fund (Direct Growth)', categoryLabel: 'AMFI Liquid Fund · 0.20% TER', themeGroup: 'Treasury Cash & Liquid Margin', futuristicTheme: 'Emergency & Dry-Powder Capital Deployment Engine', horizon: '0–12 Months Liquidity', reason: 'High-grade commercial paper & T-Bill parking with instant redemption flexibility during equity market corrections.', currencyPrefix: '₹', kind: 'mf', keywords: ['liquid fund', 't-bill'] },
  { rank: 9, id: 'bnd-bb30', symbol: 'EBBETF0430.NS', ticker: 'BHARATBOND 30', name: 'BHARAT Bond ETF April 2030', categoryLabel: 'AAA PSU ETF · Target Maturity', themeGroup: 'AAA Target-Maturity & Corporate', futuristicTheme: 'Sovereign-Backed AAA PSU Yield Roll-Down', horizon: 'Hold to Apr 2030', reason: 'Locks in AAA central PSU yields (PFC, REC, NTPC, PowerGrid) with predictable roll-down return if held to April 2030.', currencyPrefix: '₹', kind: 'quote', keywords: ['bharat bond', 'psu bond', 'aaa'] },
  { rank: 10, id: 'bnd-bb31', symbol: 'EBBETF0431.NS', ticker: 'BHARATBOND 31', name: 'BHARAT Bond ETF April 2031', categoryLabel: 'AAA PSU ETF · Target Maturity', themeGroup: 'AAA Target-Maturity & Corporate', futuristicTheme: '2031 Fixed-Maturity AAA Infrastructure Credit', horizon: 'Hold to Apr 2031', reason: 'Combines low 0.05% ETF cost structure with sovereign-grade PSU credit backing for retirement/goal matching.', currencyPrefix: '₹', kind: 'quote', keywords: ['bharat bond', '2031'] },
  { rank: 11, id: 'bnd-sdl26', symbol: 'SDL26BEES.NS', ticker: 'SDL26BEES', name: 'Nippon Nifty CPSE Bond Plus SDL 2026', categoryLabel: 'SDL + CPSE ETF · Sovereign State', themeGroup: 'AAA Target-Maturity & Corporate', futuristicTheme: 'State Development Loan Spread Above Central G-Secs', horizon: 'Target Maturity Stability', reason: 'Harvests extra 35–45 bps sovereign SDL spread over central government yields with minimal duration risk.', currencyPrefix: '₹', kind: 'quote', keywords: ['sdl', 'state development', 'cpse'] },
  { rank: 12, id: 'bnd-mf-bb30', schemeCode: '147857', ticker: 'EDEL BB 2030', name: 'Edelweiss BHARAT Bond FoF April 2030 (Direct)', categoryLabel: 'AMFI Target Maturity · 0.06% TER', themeGroup: 'AAA Target-Maturity & Corporate', futuristicTheme: 'Systematic Debt SIP Into AAA Central PSUs', horizon: 'Hold to Apr 2030', reason: 'Allows fixed-income SIP laddering into AAA public-sector infrastructure bonds without demat execution spread.', currencyPrefix: '₹', kind: 'mf', keywords: ['bharat bond', 'edelweiss'] },
  { rank: 13, id: 'bnd-mf-corp', schemeCode: '118987', ticker: 'HDFC CORP MF', name: 'HDFC Corporate Bond Fund (Direct Growth)', categoryLabel: 'AMFI AAA Corporate · 0.35% TER', themeGroup: 'AAA Target-Maturity & Corporate', futuristicTheme: 'High-Credit-Quality Accrual Above Bank FD Rates', horizon: '2–4 Years Accrual', reason: 'Holds predominantly AAA corporates, balancing steady quarterly accrual with high institutional liquidity.', currencyPrefix: '₹', kind: 'mf', keywords: ['corporate bond', 'hdfc'] },
  { rank: 14, id: 'bnd-tnx', symbol: '^TNX', ticker: 'US 10Y YIELD', name: 'US 10-Year Treasury Yield Benchmark', categoryLabel: 'Global Yield Benchmark · %', themeGroup: 'Sovereign Yield Curve & Global', futuristicTheme: 'Global Cost of Capital & FII Equity/Debt Flow Trigger', horizon: 'Macro Rate Gauge', reason: 'Every major shift in global US 10Y yields dictates FII capital flows into Indian equities, rupee stability, and RBI policy headroom.', currencyPrefix: '%', kind: 'quote', keywords: ['treasury', 'us 10', 'fed', 'yield'] },
  { rank: 15, id: 'bnd-gs34', ticker: '7.10% GS 2034', name: '7.10% Government of India Security 2034', categoryLabel: 'Sovereign Benchmark · 10Y G-Sec', themeGroup: 'Sovereign Yield Curve & Global', futuristicTheme: 'Global Bond Index (JPMorgan / Bloomberg) Anchor Security', horizon: '10Y Sovereign Core', reason: 'Flagship liquid G-Sec absorbing billions in foreign passive debt inflows following India’s global bond index inclusion.', currencyPrefix: '%', kind: 'bond-ref', staticPrice: 6.82, metricLabel: 'Coupon / Dur', metricValue: '7.10% · 6.9Y Mod Dur', keywords: ['gs 2034', 'g-sec', 'jpmorgan', 'bond inclusion'] },
  { rank: 16, id: 'bnd-gs33', ticker: '7.18% GS 2033', name: '7.18% Government of India Security 2033', categoryLabel: 'Sovereign G-Sec · RBI Retail Direct', themeGroup: 'Sovereign Yield Curve & Global', futuristicTheme: 'Zero-Default Semi-Annual Sovereign Coupon Flow', horizon: '7–8Y Sovereign Hold', reason: 'Accessible directly to individuals via RBI Retail Direct with zero intermediary fees and full sovereign guarantee.', currencyPrefix: '%', kind: 'bond-ref', staticPrice: 6.79, metricLabel: 'Coupon / Dur', metricValue: '7.18% · 6.4Y Mod Dur', keywords: ['rbi retail direct', 'g-sec'] },
  { rank: 17, id: 'bnd-tb91', ticker: '91D T-BILL', name: '91-Day Government of India Treasury Bill', categoryLabel: 'Short T-Bill · RBI Auction', themeGroup: 'Sovereign Yield Curve & Global', futuristicTheme: 'Short-Duration Sovereign Cash Collateral', horizon: '91 Days Maturity', reason: 'Issued weekly by RBI at a discount to par; ideal sovereign alternative to savings accounts or short FDs.', currencyPrefix: '%', kind: 'bond-ref', staticPrice: 6.45, metricLabel: 'Tenor / Rating', metricValue: '91 Days · Sovereign', keywords: ['t-bill', 'treasury bill', 'rbi'] },
  { rank: 18, id: 'bnd-tb364', ticker: '364D T-BILL', name: '364-Day Government of India Treasury Bill', categoryLabel: '1-Year T-Bill · Sovereign', themeGroup: 'Sovereign Yield Curve & Global', futuristicTheme: '1-Year Lock-In at Full Sovereign Credit', horizon: '1 Year Maturity', reason: 'Eliminates bank default and reinvestment risk for 12-month emergency reserves or upcoming tax/capex obligations.', currencyPrefix: '%', kind: 'bond-ref', staticPrice: 6.58, metricLabel: 'Tenor / Rating', metricValue: '364 Days · Sovereign', keywords: ['t-bill', 'rbi'] },
  { rank: 19, id: 'bnd-pfc', ticker: 'PFC/REC AAA', name: 'PFC / REC AAA PSU Clean-Power Bonds 2030', categoryLabel: 'Corporate PSU Debt · CRISIL AAA', themeGroup: 'Sovereign Yield Curve & Global', futuristicTheme: 'Financing India’s Grid & Renewable Buildout at ~7.4% YTM', horizon: '4–5 Years Income', reason: 'Locks in ~60 bps spread over central G-Secs while backing India’s grid and green-energy transition.', currencyPrefix: '%', kind: 'bond-ref', staticPrice: 7.42, metricLabel: 'Coupon / Rating', metricValue: '7.55% · CRISIL AAA', keywords: ['pfc', 'rec', 'aaa bond'] },
  { rank: 20, id: 'bnd-sdl', ticker: '10Y STATE SDL', name: 'Maharashtra / Gujarat 10Y State Dev Loan', categoryLabel: 'State Sovereign · Semi-Annual', themeGroup: 'Sovereign Yield Curve & Global', futuristicTheme: 'Sub-Sovereign Yield Pickup Backed by RBI Escrow', horizon: 'Long Sovereign Income', reason: 'Delivers ~35 bps yield advantage over central G-Secs with RBI automatic Consolidated Sinking Fund safeguards.', currencyPrefix: '%', kind: 'bond-ref', staticPrice: 7.18, metricLabel: 'Coupon / Rating', metricValue: '7.36% · Sovereign (State)', keywords: ['sdl', 'state loan'] },
];

export const COMMODITIES_FUTURISTIC_SPECS: FuturisticSpecBase[] = [
  { rank: 1, id: 'cmd-hg', symbol: 'HG=F', ticker: 'HG=F (COPPER)', name: 'High Grade Copper Futures (COMEX)', categoryLabel: 'Transition Metal · USD / lb', themeGroup: 'EV & Grid Transition Metals', futuristicTheme: 'AI Data Centers, EV Motors & Global Grid Copper Deficit', horizon: '2025–2035 Electrification', reason: 'Every AI data center, EV (4x copper vs ICE), and solar/wind farm multiplies copper demand against constrained global mine supply.', currencyPrefix: '$', kind: 'quote', keywords: ['copper', 'ev', 'data center', 'metal'] },
  { rank: 2, id: 'cmd-hcop', symbol: 'HINDCOPPER.NS', ticker: 'HINDCOPPER', name: 'Hindustan Copper Ltd', categoryLabel: 'Indian Copper Miner · NSE', themeGroup: 'EV & Grid Transition Metals', futuristicTheme: 'India’s Sole Integrated Copper Ore Mining Monopoly', horizon: '2025–2032 Domestic Copper', reason: 'Direct domestic beneficiation and mining expansion leveraging India’s massive high-voltage grid and EV wiring buildout.', currencyPrefix: '₹', kind: 'quote', keywords: ['hindustan copper', 'hindcopper', 'copper'] },
  { rank: 3, id: 'cmd-ali', symbol: 'ALI=F', ticker: 'ALI=F (ALUMINIUM)', name: 'Aluminium Futures (COMEX)', categoryLabel: 'Lightweight Metal · USD / MT', themeGroup: 'EV & Grid Transition Metals', futuristicTheme: 'EV Lightweighting, Overhead Grid Lines & Solar Frames', horizon: '2025–2032 Decarbonization', reason: 'Critical lightweight substitute for steel in EV chassis and solar mounting frames, tightly sensitive to green-smelting energy costs.', currencyPrefix: '$', kind: 'quote', keywords: ['aluminium', 'aluminum', 'alumina'] },
  { rank: 4, id: 'cmd-hindalco', symbol: 'HINDALCO.NS', ticker: 'HINDALCO', name: 'Hindalco Industries Ltd (Novelis)', categoryLabel: 'Indian Aluminium & Copper · NSE', themeGroup: 'EV & Grid Transition Metals', futuristicTheme: 'Recycled EV Beverage/Auto Sheet & Copper Smelting Giant', horizon: '2025–2032 Global Aluminium', reason: 'Combines lowest-quartile Indian upstream smelting with Novelis’s global recycled auto & packaging aluminium dominance.', currencyPrefix: '₹', kind: 'quote', keywords: ['hindalco', 'novelis', 'aluminium'] },
  { rank: 5, id: 'cmd-nalco', symbol: 'NATIONALUM.NS', ticker: 'NATIONALUM', name: 'National Aluminium Company Ltd (NALCO)', categoryLabel: 'Navratna Alumina · NSE', themeGroup: 'EV & Grid Transition Metals', futuristicTheme: '100% Captive Bauxite & High-Margin Alumina Exports', horizon: '2025–2030 Metal Cycle', reason: 'Integrated low-cost captive bauxite and alumina refinery benefiting immediately from tight global alumina supply.', currencyPrefix: '₹', kind: 'quote', keywords: ['nalco', 'nationalum', 'alumina'] },
  { rank: 6, id: 'cmd-hindzinc', symbol: 'HINDZINC.NS', ticker: 'HINDZINC', name: 'Hindustan Zinc Ltd', categoryLabel: 'Zinc & Silver · NSE', themeGroup: 'EV & Grid Transition Metals', futuristicTheme: 'Galvanized Steel Infra + 700T Annual Silver Optionality', horizon: '2025–2032 Dual Metal', reason: 'Lowest-cost global zinc mines paired with lucrative silver byproduct streams powering Indian infrastructure.', currencyPrefix: '₹', kind: 'quote', keywords: ['hindustan zinc', 'zinc', 'silver'] },
  { rank: 7, id: 'cmd-vedl', symbol: 'VEDL.NS', ticker: 'VEDL', name: 'Vedanta Ltd', categoryLabel: 'Multi-Metal Basket · NSE', themeGroup: 'EV & Grid Transition Metals', futuristicTheme: 'Zinc, Silver, Aluminium, Oil & Critical Minerals', horizon: '2025–2030 Resource Demerger', reason: 'Diversified Indian commodity conglomerate unlocking focused value across aluminium, oil/gas, and zinc-silver verticals.', currencyPrefix: '₹', kind: 'quote', keywords: ['vedanta', 'vedl'] },
  { rank: 8, id: 'cmd-bz', symbol: 'BZ=F', ticker: 'BRENT CRUDE', name: 'Brent Crude Oil Futures', categoryLabel: 'Global Energy · USD / bbl', themeGroup: 'Energy, LNG & India Macros', futuristicTheme: 'India Import Inflation & Refining Spread Determinant', horizon: 'Macro Inflation Watch', reason: 'Every $10/bbl swing in Brent shifts India’s current account, inflation trajectory, RBI rate flexibility, and OMC margins.', currencyPrefix: '$', kind: 'quote', keywords: ['brent', 'crude oil', 'opec', 'oil'] },
  { rank: 9, id: 'cmd-cl', symbol: 'CL=F', ticker: 'WTI CRUDE', name: 'WTI Crude Oil Futures', categoryLabel: 'US Energy · USD / bbl', themeGroup: 'Energy, LNG & India Macros', futuristicTheme: 'Global Refining Arbitrage & Petrochemical Feedstock Benchmark', horizon: 'Global Energy Cycle', reason: 'Tracks US shale supply elasticity and global inventory balances driving worldwide energy inflation.', currencyPrefix: '$', kind: 'quote', keywords: ['wti', 'crude', 'oil'] },
  { rank: 10, id: 'cmd-ng', symbol: 'NG=F', ticker: 'NATURAL GAS', name: 'Natural Gas Futures (Henry Hub)', categoryLabel: 'Bridge Fuel · USD / MMBtu', themeGroup: 'Energy, LNG & India Macros', futuristicTheme: 'AI Data-Center Baseload Power & Clean City-Gas Transition', horizon: '2025–2032 LNG/CGD', reason: 'Cleaner transition fuel powering hyperscale AI data centers and India’s nationwide CGD / LNG pipeline expansion.', currencyPrefix: '$', kind: 'quote', keywords: ['natural gas', 'lng', 'gas'] },
  { rank: 11, id: 'cmd-ongc', symbol: 'ONGC.NS', ticker: 'ONGC', name: 'Oil and Natural Gas Corporation Ltd', categoryLabel: 'Indian Energy · NSE', themeGroup: 'Energy, LNG & India Macros', futuristicTheme: 'KG Basin Deepwater Gas Ramp + Renewable Joint Ventures', horizon: '2025–2030 Domestic Energy', reason: 'Scaling domestic deepwater oil and KG-DWN gas output alongside high dividend yield and clean-energy tie-ups.', currencyPrefix: '₹', kind: 'quote', keywords: ['ongc', 'oil', 'gas'] },
  { rank: 12, id: 'cmd-gail', symbol: 'GAIL.NS', ticker: 'GAIL', name: 'GAIL (India) Ltd', categoryLabel: 'Gas Grid Monopoly · NSE', themeGroup: 'Energy, LNG & India Macros', futuristicTheme: 'India’s National Natural Gas Pipeline & Green Hydrogen Spine', horizon: '2025–2034 Energy Transition', reason: 'Monopolistic pipeline grid scaling India’s gas share from 6% toward 15% of primary energy plus hydrogen blending.', currencyPrefix: '₹', kind: 'quote', keywords: ['gail', 'pipeline', 'natural gas'] },
  { rank: 13, id: 'cmd-gc', symbol: 'GC=F', ticker: 'GOLD (COMEX)', name: 'Gold Futures (COMEX)', categoryLabel: 'Precious Metal · USD / oz', themeGroup: 'Precious & Catalyst Metals', futuristicTheme: 'Sovereign Monetary Anchor & Macro Hedge', horizon: 'All-Weather Hedge', reason: 'Central-bank reserve accumulation and real-rate sensitivity keep gold essential in macro-hedged commodity baskets.', currencyPrefix: '$', kind: 'quote', keywords: ['gold', 'comex'] },
  { rank: 14, id: 'cmd-si', symbol: 'SI=F', ticker: 'SILVER (COMEX)', name: 'Silver Futures (COMEX)', categoryLabel: 'Solar & Precious · USD / oz', themeGroup: 'Precious & Catalyst Metals', futuristicTheme: 'Structural Solar PV & Electronics Deficit Metal', horizon: 'Green Tech Metal', reason: 'Unmatched electrical conductivity embeds silver into every N-Type solar panel and high-speed EV/AI connector.', currencyPrefix: '$', kind: 'quote', keywords: ['silver', 'solar'] },
  { rank: 15, id: 'cmd-pl', symbol: 'PL=F', ticker: 'PLATINUM', name: 'Platinum Futures (NYMEX)', categoryLabel: 'Hydrogen Catalyst · USD / oz', themeGroup: 'Precious & Catalyst Metals', futuristicTheme: 'PEM Green Hydrogen Electrolyzers & Fuel-Cell Catalyst', horizon: '2025–2035 Hydrogen Economy', reason: 'Irreplaceable catalytic metal inside PEM green hydrogen electrolyzers and heavy-duty fuel cells.', currencyPrefix: '$', kind: 'quote', keywords: ['platinum', 'hydrogen', 'electrolyzer'] },
  { rank: 16, id: 'cmd-ct', symbol: 'CT=F', ticker: 'COTTON #2', name: 'Cotton #2 Futures (ICE)', categoryLabel: 'Textile Fiber · USc / lb', themeGroup: 'Agri & Food-Security Contracts', futuristicTheme: 'India Apparel Export Margins & China+1 Textile Orders', horizon: 'Textile Margin Cycle', reason: 'Directly governs raw-material spreads for Indian spinning mills and technical-textile exporters.', currencyPrefix: '$', kind: 'quote', keywords: ['cotton', 'textile'] },
  { rank: 17, id: 'cmd-zw', symbol: 'ZW=F', ticker: 'WHEAT (CBOT)', name: 'Wheat Futures (CBOT)', categoryLabel: 'Global Grain · USc / bu', themeGroup: 'Agri & Food-Security Contracts', futuristicTheme: 'Climate-Resilient Global Grain Supply Benchmark', horizon: 'Global Food Inflation', reason: 'Key barometer of global food-price inflation and monsoon/El-Niño agricultural yield pressure.', currencyPrefix: '$', kind: 'quote', keywords: ['wheat', 'agri', 'grain'] },
  { rank: 18, id: 'cmd-zc', symbol: 'ZC=F', ticker: 'CORN (CBOT)', name: 'Corn Futures (CBOT)', categoryLabel: 'Biofuel Grain · USc / bu', themeGroup: 'Agri & Food-Security Contracts', futuristicTheme: 'Ethanol Biofuel Blending & Feed Cost Proxy', horizon: 'Agri-Energy Link', reason: 'Links agricultural acreage directly with global ethanol biofuel economics and sustainable aviation fuel.', currencyPrefix: '$', kind: 'quote', keywords: ['corn', 'ethanol', 'biofuel'] },
  { rank: 19, id: 'cmd-zs', symbol: 'ZS=F', ticker: 'SOYBEANS (CBOT)', name: 'Soybeans Futures (CBOT)', categoryLabel: 'Oilseed & Protein · USc / bu', themeGroup: 'Agri & Food-Security Contracts', futuristicTheme: 'Renewable Biodiesel & Global Edible Oil Benchmark', horizon: 'Agri Supply Cycle', reason: 'Drives global vegetable-oil price parity affecting India’s edible oil import bill and rural farm realizations.', currencyPrefix: '$', kind: 'quote', keywords: ['soybean', 'edible oil'] },
  { rank: 20, id: 'cmd-kc', symbol: 'KC=F', ticker: 'COFFEE C (ICE)', name: 'Coffee C Futures (ICE)', categoryLabel: 'Soft Commodity · USc / lb', themeGroup: 'Agri & Food-Security Contracts', futuristicTheme: 'Global Café Consumption Growth & Tight Arabica Supply', horizon: 'Agri Softs Momentum', reason: 'Structural specialty-coffee demand combined with weather volatility makes Arabica a dynamic soft-commodity trend leader.', currencyPrefix: '$', kind: 'quote', keywords: ['coffee', 'arabica'] },
];

export function sortArticlesByNewest(
  articles: Array<{ title: string; link: string; pubDate: string; source: string }>
) {
  return [...articles].sort((a, b) => {
    const ta = Date.parse(a.pubDate || '') || 0;
    const tb = Date.parse(b.pubDate || '') || 0;
    return tb - ta;
  });
}

export function matchEarlyNewsToSpec(
  keywords: string[],
  ticker: string,
  name: string,
  earlyNews: Array<{ title: string; link: string; pubDate: string; source: string }>,
  fallbackIndex = 0
): {
  newsCatalyst: string;
  newsSource?: string;
  newsPubDate?: string;
  newsLink?: string;
} {
  const tokens = Array.from(
    new Set([
      ...keywords.map((k) => k.toLowerCase()),
      ticker.toLowerCase().replace(/\.(ns|bo)$/i, '').replace(/\s*\(.*\)/g, ''),
      name.split(' ')[0].toLowerCase(),
    ])
  ).filter((t) => t.length >= 3);

  const matched = earlyNews.find((art) => {
    const hay = `${art.title} ${art.source}`.toLowerCase();
    return tokens.some((tok) => hay.includes(tok));
  });

  const chosen = matched || earlyNews[fallbackIndex % Math.max(1, earlyNews.length)];
  if (chosen) {
    return {
      newsCatalyst: chosen.title,
      newsSource: chosen.source,
      newsPubDate: chosen.pubDate,
      newsLink: chosen.link,
    };
  }
  return {
    newsCatalyst: 'Live exchange pricing & morning filings continuously monitored.',
  };
}
