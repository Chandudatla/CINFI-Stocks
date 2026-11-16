import type {
  CapTier,
  ChartPoint,
  FundamentalProfile,
  InvestorProfile,
  TechnicalSummary,
} from '../types/market';

interface FundamentalSeed {
  marketCapCr: number;
  epsTtm: number;
  bookValuePerShare: number;
  roePct: number;
  rocePct: number;
  revenueGrowthPct: number;
  profitGrowthPct: number;
  debtToEquity: number;
  dividendYieldPct: number;
  operatingCashFlowCr: number;
  freeCashFlowCr: number;
  balanceSheetSummary: string;
  cashFlowSummary: string;
  companyProfile: string;
  fiiFlowNote: string;
  diiFlowNote: string;
  shareholding: {
    promoter: number;
    fii: number;
    dii: number;
    public: number;
  };
}

const FUNDAMENTAL_SEEDS: Record<string, FundamentalSeed> = {
  'RELIANCE.NS': {
    marketCapCr: 1818000,
    epsTtm: 52.8,
    bookValuePerShare: 585,
    roePct: 9.4,
    rocePct: 10.6,
    revenueGrowthPct: 8.6,
    profitGrowthPct: 7.4,
    debtToEquity: 0.39,
    dividendYieldPct: 0.4,
    operatingCashFlowCr: 158000,
    freeCashFlowCr: 28500,
    balanceSheetSummary: 'Net worth above ₹8.1L Cr; disciplined capex across Jio 5G, Retail & New Energy Giga Complex.',
    cashFlowSummary: 'Strong ₹1.58L Cr operating cash generation covering multi-year energy transition capex.',
    companyProfile: 'India’s largest private sector conglomerate spanning O2C refining, Jio Digital Services, Reliance Retail, and Solar/Battery giga-manufacturing.',
    fiiFlowNote: 'Core Nifty heavy; FII stake ~19% sensitive to global EM passive flows.',
    diiFlowNote: 'Steady mutual fund & LIC accumulation across digital/retail value unlocking.',
    shareholding: { promoter: 50.1, fii: 19.2, dii: 17.8, public: 12.9 },
  },
  'TCS.NS': {
    marketCapCr: 1412000,
    epsTtm: 134.5,
    bookValuePerShare: 268,
    roePct: 51.2,
    rocePct: 64.5,
    revenueGrowthPct: 6.1,
    profitGrowthPct: 8.8,
    debtToEquity: 0.08,
    dividendYieldPct: 1.9,
    operatingCashFlowCr: 46800,
    freeCashFlowCr: 43200,
    balanceSheetSummary: 'Virtually zero debt with ₹45,000+ Cr cash & liquid investments.',
    cashFlowSummary: 'Over 95% OCF-to-PAT conversion funding consistent buybacks & special dividends.',
    companyProfile: 'Flagship Tata Group global IT consulting, cloud, BFSI core modernization, and enterprise AI services leader.',
    fiiFlowNote: 'FII positioning tied to US/BFSI discretionary tech spend recovery.',
    diiFlowNote: 'Held consistently by major domestic flexi-cap and index schemes.',
    shareholding: { promoter: 71.8, fii: 12.6, dii: 10.9, public: 4.7 },
  },
  'HDFCBANK.NS': {
    marketCapCr: 1335000,
    epsTtm: 88.4,
    bookValuePerShare: 618,
    roePct: 16.4,
    rocePct: 14.8,
    revenueGrowthPct: 14.5,
    profitGrowthPct: 13.8,
    debtToEquity: 0.88,
    dividendYieldPct: 1.1,
    operatingCashFlowCr: 82000,
    freeCashFlowCr: 74000,
    balanceSheetSummary: 'Post-merger credit-deposit ratio normalizing with healthy CET-1 capital adequacy (~16.8%).',
    cashFlowSummary: 'Granular retail CASA deposit franchise sustaining sector-leading net interest income.',
    companyProfile: 'India’s largest private sector bank offering retail lending, corporate banking, wealth management, and treasury services.',
    fiiFlowNote: 'Top FII weight in MSCI & Nifty; sensitive to foreign headroom & NIM stability.',
    diiFlowNote: 'Largest institutional holding across Indian equity mutual funds.',
    shareholding: { promoter: 0.0, fii: 47.2, dii: 34.4, public: 18.4 },
  },
  'ICICIBANK.NS': {
    marketCapCr: 912000,
    epsTtm: 64.2,
    bookValuePerShare: 378,
    roePct: 18.7,
    rocePct: 15.9,
    revenueGrowthPct: 16.2,
    profitGrowthPct: 17.9,
    debtToEquity: 0.72,
    dividendYieldPct: 0.8,
    operatingCashFlowCr: 68500,
    freeCashFlowCr: 61200,
    balanceSheetSummary: 'Clean asset quality (NNPA <0.45%) with strong provision coverage and 16.3%+ CAR.',
    cashFlowSummary: 'Consistent core operating profit growth led by business banking & retail fee streams.',
    companyProfile: 'Universal private sector banking powerhouse with top-tier digital ecosystem (iMobile) and asset-management/insurance subsidiaries.',
    fiiFlowNote: 'Consistent FII overweight on superior return ratios and benign credit costs.',
    diiFlowNote: 'Top conviction core bank across domestic equity AMCs.',
    shareholding: { promoter: 0.0, fii: 45.1, dii: 36.8, public: 18.1 },
  },
  'INFY.NS': {
    marketCapCr: 765000,
    epsTtm: 65.4,
    bookValuePerShare: 215,
    roePct: 31.8,
    rocePct: 40.4,
    revenueGrowthPct: 5.4,
    profitGrowthPct: 7.2,
    debtToEquity: 0.09,
    dividendYieldPct: 2.3,
    operatingCashFlowCr: 28900,
    freeCashFlowCr: 25600,
    balanceSheetSummary: 'Debt-free balance sheet with ₹35,000+ Cr cash & cash equivalents.',
    cashFlowSummary: 'Commits 85% of cumulative 5-year free cash flow to shareholders via dividends/buybacks.',
    companyProfile: 'Global digital transformation, Topaz enterprise AI platform, and cloud consulting major.',
    fiiFlowNote: 'High ADR & FII ownership reacting swiftly to US Fed rate & BFSI guidance.',
    diiFlowNote: 'Defensive IT allocation with strong dividend cash yield support.',
    shareholding: { promoter: 14.6, fii: 33.8, dii: 36.4, public: 15.2 },
  },
  'BHARTIARTL.NS': {
    marketCapCr: 948000,
    epsTtm: 34.8,
    bookValuePerShare: 168,
    roePct: 19.6,
    rocePct: 15.4,
    revenueGrowthPct: 15.8,
    profitGrowthPct: 42.5,
    debtToEquity: 1.48,
    dividendYieldPct: 0.5,
    operatingCashFlowCr: 84200,
    freeCashFlowCr: 39400,
    balanceSheetSummary: 'Rapid deleveraging as India wireless capex intensity moderates post 5G rollout.',
    cashFlowSummary: 'Surge in free cash flow driven by ARPU expansion toward ₹245+ and enterprise fiber growth.',
    companyProfile: 'India’s premier telecom and digital infrastructure giant across 5G mobility, Airtel Payments Bank, broadband, and Nxtra data centers.',
    fiiFlowNote: 'High global telecom fund ownership tracking ARPU & India FCF inflection.',
    diiFlowNote: 'Sustained DII buying on structural duopoly pricing power.',
    shareholding: { promoter: 53.1, fii: 24.4, dii: 18.2, public: 4.3 },
  },
  'SBIN.NS': {
    marketCapCr: 725000,
    epsTtm: 78.5,
    bookValuePerShare: 465,
    roePct: 17.6,
    rocePct: 13.8,
    revenueGrowthPct: 12.1,
    profitGrowthPct: 15.4,
    debtToEquity: 1.12,
    dividendYieldPct: 1.7,
    operatingCashFlowCr: 96000,
    freeCashFlowCr: 88000,
    balanceSheetSummary: 'Multi-decade low Net NPA (<0.6%) with ₹50L+ Cr deposit base and strong sovereign backing.',
    cashFlowSummary: 'Treasury & corporate credit recovery supporting high capital self-sufficiency.',
    companyProfile: 'India’s largest public sector bank commanding ~23% domestic deposit/loan market share plus SBI Life, SBI Card & SBI Mutual Fund.',
    fiiFlowNote: 'FIIs steadily rebuilt PSU bank weight alongside sovereign capex cycle.',
    diiFlowNote: 'Strong domestic institutional & PSU ETF ownership.',
    shareholding: { promoter: 57.5, fii: 11.1, dii: 24.2, public: 7.2 },
  },
  'LT.NS': {
    marketCapCr: 492000,
    epsTtm: 102.4,
    bookValuePerShare: 640,
    roePct: 15.8,
    rocePct: 14.9,
    revenueGrowthPct: 17.4,
    profitGrowthPct: 14.2,
    debtToEquity: 1.18,
    dividendYieldPct: 0.8,
    operatingCashFlowCr: 22800,
    freeCashFlowCr: 17500,
    balanceSheetSummary: 'Record ₹4.9L+ Cr order book with improving net working capital cycle (~12% of sales).',
    cashFlowSummary: 'Hyderabad Metro & financial services asset-light transition lifting consolidated FCF.',
    companyProfile: 'India’s bellwether EPC infrastructure, defence engineering, green hydrogen electrolyzer, and precision manufacturing conglomerate.',
    fiiFlowNote: 'Preferred proxy for India’s sovereign infrastructure and Middle East capex cycle.',
    diiFlowNote: 'Anchor industrial holding across Indian infrastructure & diversified funds.',
    shareholding: { promoter: 0.0, fii: 22.8, dii: 41.2, public: 36.0 },
  },
  'ITC.NS': {
    marketCapCr: 598000,
    epsTtm: 16.4,
    bookValuePerShare: 59,
    roePct: 27.6,
    rocePct: 36.2,
    revenueGrowthPct: 7.5,
    profitGrowthPct: 6.4,
    debtToEquity: 0.01,
    dividendYieldPct: 3.1,
    operatingCashFlowCr: 19200,
    freeCashFlowCr: 16400,
    balanceSheetSummary: 'Debt-free fortress balance sheet with ₹30,000+ Cr treasury surplus; ITC Hotels demerger unlocks ROCE.',
    cashFlowSummary: 'High 80%+ payout policy delivering industry-leading cash dividend yield.',
    companyProfile: 'Diversified Indian FMCG, Hotels, Paperboards, Agribusiness, and Consumer staples giant with deep rural distribution.',
    fiiFlowNote: 'BAT stake rationalization absorbed smoothly by global passive & value buyers.',
    diiFlowNote: 'High LIC & DII defensive allocation.',
    shareholding: { promoter: 0.0, fii: 40.5, dii: 42.1, public: 17.4 },
  },
  'SUNPHARMA.NS': {
    marketCapCr: 432000,
    epsTtm: 46.2,
    bookValuePerShare: 275,
    roePct: 16.9,
    rocePct: 20.4,
    revenueGrowthPct: 11.4,
    profitGrowthPct: 19.8,
    debtToEquity: 0.05,
    dividendYieldPct: 0.8,
    operatingCashFlowCr: 12800,
    freeCashFlowCr: 10900,
    balanceSheetSummary: 'Net-cash specialty pharma balance sheet (~$2B+ net cash) funding global Ilumya/Winlevi R&D.',
    cashFlowSummary: 'High-margin US specialty franchise expanding consolidated EBITDA margins past 27%.',
    companyProfile: 'India’s largest and world’s fourth-largest specialty generic & dermatology/oncology pharmaceutical leader.',
    fiiFlowNote: 'FII healthcare favorite driven by global specialty pipeline ramp-up.',
    diiFlowNote: 'Core defensive healthcare overweight in domestic funds.',
    shareholding: { promoter: 54.5, fii: 18.1, dii: 18.9, public: 8.5 },
  },
  'MARUTI.NS': {
    marketCapCr: 386000,
    epsTtm: 468.0,
    bookValuePerShare: 2740,
    roePct: 16.8,
    rocePct: 21.2,
    revenueGrowthPct: 11.2,
    profitGrowthPct: 16.5,
    debtToEquity: 0.01,
    dividendYieldPct: 1.0,
    operatingCashFlowCr: 16800,
    freeCashFlowCr: 9400,
    balanceSheetSummary: 'Debt-free with ₹45,000+ Cr cash funding EV platform & Kharkhoda greenfield expansion.',
    cashFlowSummary: 'UV/SUV mix upgrade supporting higher ASP and cash accumulation.',
    companyProfile: 'India’s dominant passenger vehicle manufacturer (~41% market share) scaling CNG, Strong Hybrid, and EV models.',
    fiiFlowNote: 'Sensitive to rural demand recovery and Suzuki global hybrid/EV export plans.',
    diiFlowNote: 'Held across major large-cap auto & value funds.',
    shareholding: { promoter: 58.2, fii: 18.6, dii: 19.4, public: 3.8 },
  },
  'TITAN.NS': {
    marketCapCr: 298000,
    epsTtm: 42.5,
    bookValuePerShare: 118,
    roePct: 35.4,
    rocePct: 24.8,
    revenueGrowthPct: 19.2,
    profitGrowthPct: 11.5,
    debtToEquity: 0.82,
    dividendYieldPct: 0.35,
    operatingCashFlowCr: 4200,
    freeCashFlowCr: 3400,
    balanceSheetSummary: 'Efficient gold metal-loan hedging balance sheet supporting Tanishq & CaratLane store expansion.',
    cashFlowSummary: 'High working-capital velocity in organized jewellery market-share consolidation.',
    companyProfile: 'Tata Group lifestyle leader commanding Tanishq jewellery, Titan watches, EyePlus, and Taneira ethnic wear.',
    fiiFlowNote: 'Structurally held by global quality-growth funds alongside Jhunjhunwala Estate anchor stake.',
    diiFlowNote: 'Premium consumer discretionary holding across mutual funds.',
    shareholding: { promoter: 52.9, fii: 18.4, dii: 11.2, public: 17.5 },
  },
  'BEL.NS': {
    marketCapCr: 218000,
    epsTtm: 6.45,
    bookValuePerShare: 23.8,
    roePct: 26.8,
    rocePct: 35.6,
    revenueGrowthPct: 17.8,
    profitGrowthPct: 24.6,
    debtToEquity: 0.0,
    dividendYieldPct: 0.75,
    operatingCashFlowCr: 5200,
    freeCashFlowCr: 4300,
    balanceSheetSummary: 'Zero debt, ₹10,000+ Cr cash surplus & ₹74,000+ Cr multi-year sovereign defence backlog.',
    cashFlowSummary: 'Advance customer payments yield negative working capital and elite cash conversion.',
    companyProfile: 'Navratna defence electronics leader manufacturing radars, electronic warfare suites, Akash missile systems, and avionics.',
    fiiFlowNote: 'Increasing global defence ETF and FII participation on export visibility.',
    diiFlowNote: 'Strong domestic PSU & defence fund conviction.',
    shareholding: { promoter: 51.1, fii: 17.4, dii: 22.8, public: 8.7 },
  },
  'HAL.NS': {
    marketCapCr: 286000,
    epsTtm: 121.0,
    bookValuePerShare: 468,
    roePct: 27.9,
    rocePct: 36.8,
    revenueGrowthPct: 14.5,
    profitGrowthPct: 21.8,
    debtToEquity: 0.0,
    dividendYieldPct: 0.85,
    operatingCashFlowCr: 9100,
    freeCashFlowCr: 6900,
    balanceSheetSummary: 'Debt-free aerospace monopoly with ₹1.2L+ Cr order book spanning Tejas Mk1A, LCH Prachand & MRO.',
    cashFlowSummary: 'Milestone advances and high-margin spares/MRO drive ₹26,000+ Cr treasury cash.',
    companyProfile: 'India’s sole fixed-wing & rotorcraft aerospace prime contractor building fighter jets, combat helicopters, and aero-engines.',
    fiiFlowNote: 'Rising FII coverage tied to GE F404/F414 engine delivery ramp-up.',
    diiFlowNote: 'Top DII defence & manufacturing allocation.',
    shareholding: { promoter: 71.6, fii: 12.1, dii: 10.4, public: 5.9 },
  },
  'DIXON.NS': {
    marketCapCr: 92000,
    epsTtm: 118.0,
    bookValuePerShare: 365,
    roePct: 28.4,
    rocePct: 33.5,
    revenueGrowthPct: 68.0,
    profitGrowthPct: 62.0,
    debtToEquity: 0.19,
    dividendYieldPct: 0.05,
    operatingCashFlowCr: 1180,
    freeCashFlowCr: 480,
    balanceSheetSummary: 'Low leverage with fast asset turns (~6x) backed by PLI incentives across smartphones & IT hardware.',
    cashFlowSummary: 'High operating cash reinvested into backward-integrated display modules and component JVs.',
    companyProfile: 'India’s largest Electronics Manufacturing Services (EMS) leader producing smartphones, laptops, TVs, and telecom hardware.',
    fiiFlowNote: 'High foreign growth-fund ownership betting on China+1 India assembly shift.',
    diiFlowNote: 'Core mid/large-cap domestic electronics PLI play.',
    shareholding: { promoter: 32.9, fii: 22.8, dii: 23.6, public: 20.7 },
  },
  'PERSISTENT.NS': {
    marketCapCr: 84000,
    epsTtm: 88.5,
    bookValuePerShare: 342,
    roePct: 26.2,
    rocePct: 32.4,
    revenueGrowthPct: 19.6,
    profitGrowthPct: 23.4,
    debtToEquity: 0.05,
    dividendYieldPct: 0.45,
    operatingCashFlowCr: 1380,
    freeCashFlowCr: 1190,
    balanceSheetSummary: 'Clean net-cash digital ER&D balance sheet with rapid organic growth.',
    cashFlowSummary: 'Consistent >85% EBITDA-to-OCF conversion financing tuck-in AI acquisitions.',
    companyProfile: 'High-growth digital engineering, enterprise SaaS, and GenAI software modernization firm.',
    fiiFlowNote: 'Strong FII IT midcap preference on consecutive quarterly beat streaks.',
    diiFlowNote: 'Core midcap IT growth anchor in Indian mutual funds.',
    shareholding: { promoter: 30.8, fii: 24.5, dii: 27.6, public: 17.1 },
  },
  'TRENT.NS': {
    marketCapCr: 215000,
    epsTtm: 46.2,
    bookValuePerShare: 148,
    roePct: 31.2,
    rocePct: 29.8,
    revenueGrowthPct: 44.0,
    profitGrowthPct: 52.0,
    debtToEquity: 0.28,
    dividendYieldPct: 0.1,
    operatingCashFlowCr: 1850,
    freeCashFlowCr: 1120,
    balanceSheetSummary: 'Self-funded Zudio & Westside hyper-expansion with industry-best inventory turnover.',
    cashFlowSummary: 'Strong store unit economics generating rapid working-capital payback.',
    companyProfile: 'Tata Group fashion & lifestyle retailer operating Zudio, Westside, and Star Bazaar.',
    fiiFlowNote: 'Added to Nifty 50; attracts global consumer retail funds.',
    diiFlowNote: 'High DII retention despite premium valuation multiples.',
    shareholding: { promoter: 37.0, fii: 25.4, dii: 15.8, public: 21.8 },
  },
  'COFORGE.NS': {
    marketCapCr: 53000,
    epsTtm: 142.0,
    bookValuePerShare: 710,
    roePct: 21.4,
    rocePct: 26.5,
    revenueGrowthPct: 24.5,
    profitGrowthPct: 19.2,
    debtToEquity: 0.12,
    dividendYieldPct: 0.9,
    operatingCashFlowCr: 980,
    freeCashFlowCr: 760,
    balanceSheetSummary: 'Healthy capital structure post Cigniti acquisition with rising executable order book.',
    cashFlowSummary: 'Improving operating cash flow on large travel, BFSI & AI ops multi-year deals.',
    companyProfile: 'Tier-2 IT services leader specialized in airline/travel platforms, insurance tech, and enterprise cloud automation.',
    fiiFlowNote: 'Active FII participation around executable 12-month order book growth.',
    diiFlowNote: 'Broadly owned across domestic mid-cap equity schemes.',
    shareholding: { promoter: 0.0, fii: 42.1, dii: 44.8, public: 13.1 },
  },
  'POLYCAB.NS': {
    marketCapCr: 96000,
    epsTtm: 128.0,
    bookValuePerShare: 585,
    roePct: 21.9,
    rocePct: 28.4,
    revenueGrowthPct: 19.4,
    profitGrowthPct: 16.8,
    debtToEquity: 0.02,
    dividendYieldPct: 0.5,
    operatingCashFlowCr: 1650,
    freeCashFlowCr: 820,
    balanceSheetSummary: 'Virtually debt-free balance sheet with ₹2,100+ Cr net cash funding EHV & greenfield plants.',
    cashFlowSummary: 'Robust cash flows backed by backward integration in copper/aluminium rod processing.',
    companyProfile: 'India’s largest wires, power cables, and FMEG electricals manufacturer powering data centers, EV infra & power transmission.',
    fiiFlowNote: 'Foreign industrial funds tracking India power grid capex.',
    diiFlowNote: 'Steady DII ownership in electrical equipment theme.',
    shareholding: { promoter: 63.2, fii: 12.1, dii: 9.8, public: 14.9 },
  },
  'KAYNES.NS': {
    marketCapCr: 34500,
    epsTtm: 41.2,
    bookValuePerShare: 415,
    roePct: 12.4,
    rocePct: 15.8,
    revenueGrowthPct: 52.0,
    profitGrowthPct: 56.0,
    debtToEquity: 0.24,
    dividendYieldPct: 0.0,
    operatingCashFlowCr: 210,
    freeCashFlowCr: -240,
    balanceSheetSummary: 'Low debt post QIP raise; deploying subsidy-backed capex into Sanand OSAT & HDI PCBs.',
    cashFlowSummary: 'Capex-heavy OSAT investment phase backed by central/state semiconductor fiscal grants.',
    companyProfile: 'End-to-end IoT/EMS and pioneering OSAT semiconductor assembly player serving EV, aerospace & industrial clients.',
    fiiFlowNote: 'FII tech funds participating in India’s nascent chip packaging value chain.',
    diiFlowNote: 'High domestic small/mid-cap institutional ownership.',
    shareholding: { promoter: 57.8, fii: 14.5, dii: 16.4, public: 11.3 },
  },
  'KPITTECH.NS': {
    marketCapCr: 38500,
    epsTtm: 29.4,
    bookValuePerShare: 96,
    roePct: 31.2,
    rocePct: 38.9,
    revenueGrowthPct: 21.8,
    profitGrowthPct: 28.4,
    debtToEquity: 0.03,
    dividendYieldPct: 0.55,
    operatingCashFlowCr: 940,
    freeCashFlowCr: 790,
    balanceSheetSummary: 'Zero-debt R&D balance sheet with ~₹1,000+ Cr net cash.',
    cashFlowSummary: 'Strong working-capital collection across top 25 global automotive OEMs.',
    companyProfile: 'Pure-play automotive software & mobility ER&D leader building SDV middleware, autonomous stacks & EV powertrains.',
    fiiFlowNote: 'Selective FII conviction balancing European OEM softness vs SDV multi-year mandates.',
    diiFlowNote: 'Core technology ER&D holding.',
    shareholding: { promoter: 39.5, fii: 21.8, dii: 18.2, public: 20.5 },
  },
  'IREDA.NS': {
    marketCapCr: 52000,
    epsTtm: 6.1,
    bookValuePerShare: 36,
    roePct: 17.1,
    rocePct: 9.8,
    revenueGrowthPct: 34.0,
    profitGrowthPct: 32.0,
    debtToEquity: 5.8,
    dividendYieldPct: 0.0,
    operatingCashFlowCr: -4200,
    freeCashFlowCr: -4300,
    balanceSheetSummary: 'NBFC leverage financing ₹64,000+ Cr green loan book with sub-1.2% Net NPA & Navratna status.',
    cashFlowSummary: 'Disbursement growth outpacing repayments; net interest margins (~3.1%) expanding steadily.',
    companyProfile: 'Dedicated Government of India Navratna NBFC financing solar, wind, battery storage, and green hydrogen infrastructure.',
    fiiFlowNote: 'ESG-mandated FIIs tracking green bond spreads & loan growth.',
    diiFlowNote: 'High retail & domestic PSU participation.',
    shareholding: { promoter: 75.0, fii: 2.4, dii: 4.1, public: 18.5 },
  },
  'CDSL.NS': {
    marketCapCr: 31200,
    epsTtm: 26.8,
    bookValuePerShare: 81,
    roePct: 34.8,
    rocePct: 44.2,
    revenueGrowthPct: 38.0,
    profitGrowthPct: 41.0,
    debtToEquity: 0.0,
    dividendYieldPct: 0.8,
    operatingCashFlowCr: 520,
    freeCashFlowCr: 470,
    balanceSheetSummary: 'Zero debt, asset-light market infrastructure holding ₹1,400+ Cr liquid investments.',
    cashFlowSummary: '55%+ EBITDA margins convert into recurring free cash and annual dividends.',
    companyProfile: 'India’s leading securities depository hosting 14+ crore demat accounts, e-voting, and digital KYC infrastructure.',
    fiiFlowNote: 'Structural Indian capital market financialization favorite.',
    diiFlowNote: 'Widely held by DIIs and retail investors.',
    shareholding: { promoter: 15.0, fii: 14.2, dii: 26.4, public: 44.4 },
  },
  'TEJASNET.NS': {
    marketCapCr: 18400,
    epsTtm: 28.5,
    bookValuePerShare: 215,
    roePct: 14.2,
    rocePct: 18.5,
    revenueGrowthPct: 145.0,
    profitGrowthPct: 165.0,
    debtToEquity: 0.58,
    dividendYieldPct: 0.0,
    operatingCashFlowCr: 410,
    freeCashFlowCr: 180,
    balanceSheetSummary: 'Backed by Tata Sons; working capital scaling alongside BSNL 4G/5G & BharatNet equipment shipments.',
    cashFlowSummary: 'Collections normalize as milestone deliveries complete across domestic & export carriers.',
    companyProfile: 'Tata Group optical & wireless telecom OEM building indigenous 4G/5G RAN and high-capacity optical backhaul.',
    fiiFlowNote: 'Tracked alongside sovereign telecom tender pipeline.',
    diiFlowNote: 'Held alongside veteran investor Vijay Kedia’s long-standing stake.',
    shareholding: { promoter: 53.8, fii: 8.6, dii: 6.4, public: 31.2 },
  },
  'TATAELXSI.NS': {
    marketCapCr: 41200,
    epsTtm: 129.0,
    bookValuePerShare: 418,
    roePct: 31.4,
    rocePct: 39.2,
    revenueGrowthPct: 6.5,
    profitGrowthPct: 4.8,
    debtToEquity: 0.0,
    dividendYieldPct: 1.05,
    operatingCashFlowCr: 820,
    freeCashFlowCr: 740,
    balanceSheetSummary: 'Zero debt with ₹1,500+ Cr cash balance and zero goodwill impairment risk.',
    cashFlowSummary: 'Clean cash profit generation supporting high ~60% dividend payouts.',
    companyProfile: 'Design-led engineering R&D specialist across SDV automotive, connected healthcare/MedTech, and OTT media AI.',
    fiiFlowNote: 'Watching European auto & global media engineering cycle bottoming.',
    diiFlowNote: 'High retail & domestic quality-ER&D following.',
    shareholding: { promoter: 43.9, fii: 13.8, dii: 7.4, public: 34.9 },
  },
  'TATAPOWER.NS': {
    marketCapCr: 132000,
    epsTtm: 12.8,
    bookValuePerShare: 112,
    roePct: 11.9,
    rocePct: 11.4,
    revenueGrowthPct: 10.2,
    profitGrowthPct: 14.8,
    debtToEquity: 1.38,
    dividendYieldPct: 0.5,
    operatingCashFlowCr: 12600,
    freeCashFlowCr: 2800,
    balanceSheetSummary: 'Capex pivoting heavily into Tirunelveli 4.3GW solar cell/module, pumped hydro & transmission.',
    cashFlowSummary: 'Regulated Odisha discoms and Mundra stability bolster consolidated cash generation.',
    companyProfile: 'Integrated clean power utility spanning utility renewables, rooftop solar, EV charging grids, and power distribution.',
    fiiFlowNote: 'FII clean-grid transition play.',
    diiFlowNote: 'Broadly held by domestic utility and thematic funds.',
    shareholding: { promoter: 46.9, fii: 9.6, dii: 16.5, public: 27.0 },
  },
  'NTPCGREEN.NS': {
    marketCapCr: 94000,
    epsTtm: 0.72,
    bookValuePerShare: 22.5,
    roePct: 5.8,
    rocePct: 6.9,
    revenueGrowthPct: 28.0,
    profitGrowthPct: 34.0,
    debtToEquity: 0.92,
    dividendYieldPct: 0.0,
    operatingCashFlowCr: 1580,
    freeCashFlowCr: -3200,
    balanceSheetSummary: 'IPO proceeds de-leveraged balance sheet; enjoys AAA-linked borrowing cost via parent NTPC.',
    cashFlowSummary: 'Aggressive GW-scale solar/wind/hydrogen pipeline commissioning across 25-year PPAs.',
    companyProfile: 'Pure-play PSU renewable energy platform of NTPC developing India’s largest solar, wind & green hydrogen hubs.',
    fiiFlowNote: 'Index inclusion & global sovereign clean-energy interest.',
    diiFlowNote: 'Anchored by LIC, SBI MF & domestic PSU allocations.',
    shareholding: { promoter: 89.0, fii: 2.1, dii: 4.8, public: 4.1 },
  },
  'WAAREEENER.NS': {
    marketCapCr: 74000,
    epsTtm: 62.5,
    bookValuePerShare: 342,
    roePct: 26.8,
    rocePct: 29.4,
    revenueGrowthPct: 48.0,
    profitGrowthPct: 64.0,
    debtToEquity: 0.14,
    dividendYieldPct: 0.0,
    operatingCashFlowCr: 2450,
    freeCashFlowCr: 920,
    balanceSheetSummary: 'Post-IPO net cash financing 5.4GW solar cell + ingot/wafer + US Texas module plants.',
    cashFlowSummary: 'Domestic ALMM protection & export orders drive strong operating cash surplus.',
    companyProfile: 'India’s largest solar PV module manufacturer expanding into integrated solar cells, wafers, and green electrolyzers.',
    fiiFlowNote: 'High global clean-tech interest tracking US tariff & domestic ALMM spread.',
    diiFlowNote: 'Active institutional buying on execution scale.',
    shareholding: { promoter: 64.3, fii: 6.8, dii: 8.9, public: 20.0 },
  },
  'MAZDOCK.NS': {
    marketCapCr: 98000,
    epsTtm: 68.4,
    bookValuePerShare: 185,
    roePct: 34.2,
    rocePct: 43.8,
    revenueGrowthPct: 24.0,
    profitGrowthPct: 45.0,
    debtToEquity: 0.0,
    dividendYieldPct: 0.95,
    operatingCashFlowCr: 2800,
    freeCashFlowCr: 2400,
    balanceSheetSummary: 'Zero debt with ₹14,000+ Cr cash & customer advances backing P-75/P-17A defence vessels.',
    cashFlowSummary: 'High treasury income plus milestone execution yields outsized free cash flow.',
    companyProfile: 'Premier Ministry of Defence shipyard constructing stealth destroyers, frigates, and Scorpene submarines.',
    fiiFlowNote: 'Low float PSU defence shipbuilder sensitive to submarine contract milestones.',
    diiFlowNote: 'Selective PSU institutional ownership.',
    shareholding: { promoter: 84.8, fii: 2.8, dii: 1.9, public: 10.5 },
  },
  'SUZLON.NS': {
    marketCapCr: 79000,
    epsTtm: 0.96,
    bookValuePerShare: 3.4,
    roePct: 22.8,
    rocePct: 24.5,
    revenueGrowthPct: 54.0,
    profitGrowthPct: 78.0,
    debtToEquity: 0.04,
    dividendYieldPct: 0.0,
    operatingCashFlowCr: 1120,
    freeCashFlowCr: 840,
    balanceSheetSummary: 'Turnaround net-cash balance sheet with ~5+ GW wind turbine order book.',
    cashFlowSummary: 'High-margin OMS service division (15+ GW installed) provides recurring cash floor.',
    companyProfile: 'India’s leading wind energy OEM manufacturing 3MW+ S144 turbines and operating renewable O&M services.',
    fiiFlowNote: 'FIIs steadily scaled from <8% toward 22%+ post balance-sheet turnaround.',
    diiFlowNote: 'Strong domestic mid-cap & energy transition inflow.',
    shareholding: { promoter: 13.3, fii: 22.4, dii: 9.8, public: 54.5 },
  },
  'ABB.NS': {
    marketCapCr: 142000,
    epsTtm: 88.2,
    bookValuePerShare: 332,
    roePct: 27.6,
    rocePct: 36.8,
    revenueGrowthPct: 17.5,
    profitGrowthPct: 36.0,
    debtToEquity: 0.0,
    dividendYieldPct: 0.4,
    operatingCashFlowCr: 1940,
    freeCashFlowCr: 1680,
    balanceSheetSummary: 'Zero-debt MNC balance sheet with ₹5,200+ Cr cash & record order backlog.',
    cashFlowSummary: 'Operating leverage across Electrification & Motion lifting margins above 17%.',
    companyProfile: 'Swiss MNC leader in India supplying smart power distribution, robotics, EV chargers & industrial automation.',
    fiiFlowNote: 'High MNC quality-industrial valuation anchored by ABB Ltd Zurich promoter.',
    diiFlowNote: 'Core capital goods holding across domestic growth funds.',
    shareholding: { promoter: 75.0, fii: 12.1, dii: 6.8, public: 6.1 },
  },
  'SIEMENS.NS': {
    marketCapCr: 218000,
    epsTtm: 78.4,
    bookValuePerShare: 432,
    roePct: 18.6,
    rocePct: 24.8,
    revenueGrowthPct: 14.8,
    profitGrowthPct: 24.2,
    debtToEquity: 0.0,
    dividendYieldPct: 0.25,
    operatingCashFlowCr: 2350,
    freeCashFlowCr: 1980,
    balanceSheetSummary: 'Debt-free with ~₹8,800 Cr cash; Energy business demerger unlocks pure-play grid & mobility multiples.',
    cashFlowSummary: 'Vande Bharat / rail propulsion & HVDC grid orders underpin multi-year cash flow visibility.',
    companyProfile: 'Industrial technology giant powering smart grids, high-speed rail mobility, digital factories, and energy equipment.',
    fiiFlowNote: 'Tracked for Siemens Energy India spin-off & HVDC grid capex awards.',
    diiFlowNote: 'High institutional retention on sovereign rail & T&D capex.',
    shareholding: { promoter: 75.0, fii: 8.6, dii: 8.2, public: 8.2 },
  },
  'ETERNAL.NS': {
    marketCapCr: 218000,
    epsTtm: 1.45,
    bookValuePerShare: 34,
    roePct: 4.9,
    rocePct: 6.2,
    revenueGrowthPct: 64.0,
    profitGrowthPct: 92.0,
    debtToEquity: 0.02,
    dividendYieldPct: 0.0,
    operatingCashFlowCr: 1240,
    freeCashFlowCr: 620,
    balanceSheetSummary: 'Net cash treasury exceeding ₹18,000 Cr funding Blinkit dark-store rollout & B2B Hyperpure.',
    cashFlowSummary: 'Consolidated adjusted EBITDA expansion driving steady operating cash inflow.',
    companyProfile: 'India’s leading consumer internet & quick-commerce group operating Zomato food delivery, Blinkit 10-min commerce, and District.',
    fiiFlowNote: 'Flagship FII consumer-tech proxy; added to BSE Sensex & Nifty 50.',
    diiFlowNote: 'Domestic mutual fund stake expanded past 20%+ post profitability inflection.',
    shareholding: { promoter: 0.0, fii: 47.4, dii: 21.8, public: 30.8 },
  },
};

export function getFundamentalProfile(
  symbol: string,
  livePrice?: number | null,
  capTier?: CapTier,
  sector?: string
): FundamentalProfile {
  const seed = FUNDAMENTAL_SEEDS[symbol];
  if (seed) {
    const peRatio =
      typeof livePrice === 'number' && livePrice > 0 && seed.epsTtm > 0
        ? Number((livePrice / seed.epsTtm).toFixed(1))
        : null;
    const pbRatio =
      typeof livePrice === 'number' && livePrice > 0 && seed.bookValuePerShare > 0
        ? Number((livePrice / seed.bookValuePerShare).toFixed(1))
        : null;
    return {
      symbol,
      ...seed,
      peRatio,
      pbRatio,
    };
  }

  const baseCap = capTier === 'Large Cap' ? 185000 : capTier === 'Mid Cap' ? 42000 : 12500;
  const estEps = typeof livePrice === 'number' && livePrice > 0 ? Number((livePrice / 24.5).toFixed(1)) : 18.0;
  const estBv = typeof livePrice === 'number' && livePrice > 0 ? Number((livePrice / 3.8).toFixed(1)) : 120;
  return {
    symbol,
    marketCapCr: baseCap,
    peRatio: typeof livePrice === 'number' && livePrice > 0 && estEps > 0 ? Number((livePrice / estEps).toFixed(1)) : 24.5,
    pbRatio: typeof livePrice === 'number' && livePrice > 0 && estBv > 0 ? Number((livePrice / estBv).toFixed(1)) : 3.8,
    epsTtm: estEps,
    bookValuePerShare: estBv,
    roePct: 16.4,
    rocePct: 19.8,
    revenueGrowthPct: 14.2,
    profitGrowthPct: 16.5,
    debtToEquity: 0.28,
    dividendYieldPct: 0.8,
    operatingCashFlowCr: Math.round(baseCap * 0.035),
    freeCashFlowCr: Math.round(baseCap * 0.021),
    balanceSheetSummary: `Standard NSE/BSE corporate balance sheet profile (${sector || 'Listed Equity'}). Check NSE/BSE filings for latest audited half-year figures.`,
    cashFlowSummary: `Operating cash flows aligned with ${capTier || 'NSE Listed'} peer sector dynamics.`,
    companyProfile: `${symbol.replace(/\.(NS|BO)$/i, '')} — Listed Indian equity tracked live via NSE/BSE exchange price and technical feeds.`,
    fiiFlowNote: 'Monitor quarterly shareholding updates via BSE/NSE disclosures.',
    diiFlowNote: 'Track domestic institutional fund factsheets for monthly stake shifts.',
    shareholding: { promoter: 51.0, fii: 15.0, dii: 16.0, public: 18.0 },
  };
}

export const INVESTOR_TRACKING_PROFILES: InvestorProfile[] = [
  {
    id: 'rakesh-estate',
    name: 'Rakesh Jhunjhunwala Estate Holdings',
    category: 'Famous Indian Investor',
    subType: 'Legacy Concentrated Value',
    styleSummary: 'Long-horizon compounders in consumer retail, private banking, PSU banks, and healthcare managed under Rare Enterprises Estate.',
    rssQuery: 'Rakesh Jhunjhunwala estate Rare Enterprises portfolio holdings NSE',
    holdings: [
      { ticker: 'TITAN', symbol: 'TITAN.NS', companyName: 'Titan Company Ltd', sector: 'Consumer & FMCG', stakePct: '5.1%', changeType: 'Steady', quarterLabel: 'Latest Filing', trendNote: 'Core multi-decade flagship position held across market cycles' },
      { ticker: 'TATAMOTORS', symbol: 'TATAMOTORS.NS', companyName: 'Tata Motors Ltd', sector: 'Defence & Auto', stakePct: '1.3%', changeType: 'Reduced', quarterLabel: 'Latest Filing', trendNote: 'Trimmed marginally while retaining core EV/JLR upside' },
      { ticker: 'CANBK', symbol: 'CANBK.NS', companyName: 'Canara Bank', sector: 'Banking & Finance', stakePct: '1.4%', changeType: 'Steady', quarterLabel: 'Latest Filing', trendNote: 'Retained PSU banking value turnaround allocation' },
      { ticker: 'METROBRAND', symbol: 'METROBRAND.NS', companyName: 'Metro Brands Ltd', sector: 'Consumer & FMCG', stakePct: '14.4%', changeType: 'Steady', quarterLabel: 'Latest Filing', trendNote: 'Strategic promoter-like family stake in organized footwear retail' },
      { ticker: 'STARHEALTH', symbol: 'STARHEALTH.NS', companyName: 'Star Health & Allied Insurance', sector: 'Banking & Finance', stakePct: '17.2%', changeType: 'Steady', quarterLabel: 'Latest Filing', trendNote: 'Anchor long-term retail health insurance conviction bet' },
      { ticker: 'NCC', symbol: 'NCC.NS', companyName: 'NCC Ltd', sector: 'Infrastructure', stakePct: '12.5%', changeType: 'Increased', quarterLabel: 'Latest Filing', trendNote: 'Sustained infrastructure & water/building capex beneficiary' },
    ],
  },
  {
    id: 'rekha-jhunjhunwala',
    name: 'Rekha Jhunjhunwala',
    category: 'Famous Indian Investor',
    subType: 'Quality Growth & Turnarounds',
    styleSummary: 'High-conviction concentrated stakes in Indian branded retail, telecom infrastructure, PSU defence/infra, and rating agencies.',
    rssQuery: 'Rekha Jhunjhunwala portfolio latest shareholding NSE BSE',
    holdings: [
      { ticker: 'TITAN', symbol: 'TITAN.NS', companyName: 'Titan Company Ltd', sector: 'Consumer & FMCG', stakePct: '5.1%', changeType: 'Steady', quarterLabel: 'Latest Filing', trendNote: 'Anchor family wealth creator alongside Tata Group retail scale' },
      { ticker: 'CRISIL', symbol: 'CRISIL.NS', companyName: 'CRISIL Ltd', sector: 'Banking & Finance', stakePct: '5.5%', changeType: 'Steady', quarterLabel: 'Latest Filing', trendNote: 'Long-term ratings & global analytics cash compounder' },
      { ticker: 'TATACOMM', symbol: 'TATACOMM.NS', companyName: 'Tata Communications Ltd', sector: 'Telecom & Digital', stakePct: '1.8%', changeType: 'Increased', quarterLabel: 'Latest Filing', trendNote: 'Increased exposure to enterprise cloud fabric & subsea data' },
      { ticker: 'ESCORTS', symbol: 'ESCORTS.NS', companyName: 'Escorts Kubota Ltd', sector: 'Defence & Auto', stakePct: '1.6%', changeType: 'Steady', quarterLabel: 'Latest Filing', trendNote: 'Retained farm mechanization & railway equipment bet' },
      { ticker: 'FORTIS', symbol: 'FORTIS.NS', companyName: 'Fortis Healthcare Ltd', sector: 'Pharma & Health', stakePct: '4.1%', changeType: 'Increased', quarterLabel: 'Latest Filing', trendNote: 'Hospital operating-leverage & occupancy expansion play' },
      { ticker: 'RALLIS', symbol: 'RALLIS.NS', companyName: 'Rallis India Ltd', sector: 'Energy & Materials', stakePct: '0.0%', changeType: 'Exited', quarterLabel: 'Prior Filing', trendNote: 'Rotated capital away from agrochemical cyclicality toward consumer/healthcare' },
    ],
  },
  {
    id: 'vijay-kedia',
    name: 'Vijay Kedia',
    category: 'Famous Indian Investor',
    subType: 'SMILE Framework (Small-to-Large)',
    styleSummary: 'Focuses on clean management teams capturing multi-year structural inflections in telecom OEM, precision engineering, and auto.',
    rssQuery: 'Vijay Kedia portfolio shareholding latest filing NSE BSE',
    holdings: [
      { ticker: 'TEJASNET', symbol: 'TEJASNET.NS', companyName: 'Tejas Networks Ltd', sector: 'Telecom & Digital', stakePct: '1.3%', changeType: 'Steady', quarterLabel: 'Latest Filing', trendNote: 'Held since pre-Tata buyout; sovereign 4G/5G telecom hardware thesis' },
      { ticker: 'ELECON', symbol: 'ELECON.NS', companyName: 'Elecon Engineering Co. Ltd', sector: 'Infrastructure', stakePct: '1.3%', changeType: 'Reduced', quarterLabel: 'Latest Filing', trendNote: 'Partial profit booking after multi-bagger industrial gearbox rally' },
      { ticker: 'ATULAUTO', symbol: 'ATULAUTO.NS', companyName: 'Atul Auto Ltd', sector: 'Defence & Auto', stakePct: '20.9%', changeType: 'Increased', quarterLabel: 'Latest Filing', trendNote: 'High promoter-like conviction in EV three-wheeler transition' },
      { ticker: 'NEULANDLAB', symbol: 'NEULANDLAB.NS', companyName: 'Neuland Laboratories Ltd', sector: 'Pharma & Health', stakePct: '1.0%', changeType: 'Reduced', quarterLabel: 'Latest Filing', trendNote: 'Trimmed slice following sharp CDMO valuation expansion' },
      { ticker: 'TAC', symbol: 'TAC.NS', companyName: 'TAC Infosec Ltd', sector: 'IT & Tech', stakePct: '14.6%', changeType: 'Newly Added', quarterLabel: 'Recent Listing', trendNote: 'Early-stage cybersecurity SaaS investment retained post SME IPO' },
    ],
  },
  {
    id: 'ashish-kacholia',
    name: 'Ashish Kacholia',
    category: 'Famous Indian Investor',
    subType: 'Emerging Mid & Small Cap Leaders',
    styleSummary: 'Identifies niche B2B specialty manufacturing, CDMO chemicals, precision components, and consumption compounders early.',
    rssQuery: 'Ashish Kacholia portfolio new stake shareholding NSE BSE',
    holdings: [
      { ticker: 'SAFARI', symbol: 'SAFARI.NS', companyName: 'Safari Industries (India) Ltd', sector: 'Consumer & FMCG', stakePct: '1.8%', changeType: 'Reduced', quarterLabel: 'Latest Filing', trendNote: 'Booked partial gains after multi-year travel luggage expansion' },
      { ticker: 'AMIORG', symbol: 'AMIORG.NS', companyName: 'Ami Organics Ltd', sector: 'Pharma & Health', stakePct: '1.9%', changeType: 'Increased', quarterLabel: 'Latest Filing', trendNote: 'Backing pharma intermediates + semiconductor/battery electrolyte chemicals' },
      { ticker: 'PCBL', symbol: 'PCBL.NS', companyName: 'PCBL Chemical Ltd', sector: 'Energy & Materials', stakePct: '1.2%', changeType: 'Steady', quarterLabel: 'Latest Filing', trendNote: 'Specialty carbon black & water-treatment chemical diversification' },
      { ticker: 'BALUFORGE', symbol: 'BALUFORGE.NS', companyName: 'Balu Forge Industries Ltd', sector: 'Defence & Auto', stakePct: '1.8%', changeType: 'Newly Added', quarterLabel: 'Latest Filing', trendNote: 'Fresh exposure to precision defence, rail & heavy-chassis forgings' },
      { ticker: 'FCL', symbol: 'FCL.NS', companyName: 'Fineotex Chemical Ltd', sector: 'Energy & Materials', stakePct: '2.8%', changeType: 'Steady', quarterLabel: 'Latest Filing', trendNote: 'Asset-light specialty textile & hygiene chemicals compounder' },
    ],
  },
  {
    id: 'radhakishan-damani',
    name: 'Radhakishan Damani',
    category: 'Famous Indian Investor',
    subType: 'Bright Star Investments / Retail Legend',
    styleSummary: 'Ultra-patient value discipline emphasizing high inventory velocity, clean governance, and durable pricing power.',
    rssQuery: 'Radhakishan Damani Bright Star Investments portfolio NSE BSE',
    holdings: [
      { ticker: 'DMART', symbol: 'DMART.NS', companyName: 'Avenue Supermarts Ltd', sector: 'Consumer & FMCG', stakePct: '74.6%', changeType: 'Steady', quarterLabel: 'Latest Filing', trendNote: 'Core promoter holding in India’s lowest-cost organized grocery retailer' },
      { ticker: 'TRENT', symbol: 'TRENT.NS', companyName: 'Trent Ltd', sector: 'Consumer & FMCG', stakePct: '1.5%', changeType: 'Steady', quarterLabel: 'Latest Filing', trendNote: 'Long-standing retail conviction benefitting from Zudio scale' },
      { ticker: 'VSTIND', symbol: 'VSTIND.NS', companyName: 'VST Industries Ltd', sector: 'Consumer & FMCG', stakePct: '32.3%', changeType: 'Increased', quarterLabel: 'Latest Filing', trendNote: 'High dividend-yield & negative working capital cash cow stake' },
      { ticker: 'SUNDARMFIN', symbol: 'SUNDARMFIN.NS', companyName: 'Sundaram Finance Ltd', sector: 'Banking & Finance', stakePct: '2.4%', changeType: 'Steady', quarterLabel: 'Latest Filing', trendNote: 'Conservative South India CV financing compounder' },
      { ticker: 'BFUTILITIE', symbol: 'BFUTILITIE.NS', companyName: 'BF Utilities Ltd', sector: 'Infrastructure', stakePct: '1.2%', changeType: 'Steady', quarterLabel: 'Latest Filing', trendNote: 'Deep-value infrastructure toll & wind asset holding' },
    ],
  },
  {
    id: 'other-public-investors',
    name: 'Other Publicly Disclosed Investors',
    category: 'Famous Indian Investor',
    subType: 'Mukul Agrawal · Dolly Khanna · Abakkus',
    styleSummary: 'Tracks >1% publicly disclosed quarterly shareholding & bulk-deal filings by top active Indian market veterans.',
    rssQuery: 'Mukul Agrawal Dolly Khanna Sunil Singhania portfolio stake NSE',
    holdings: [
      { ticker: 'BSE', symbol: 'BSE.NS', companyName: 'BSE Ltd (Mukul Agrawal)', sector: 'Banking & Finance', stakePct: '1.2%', changeType: 'Steady', quarterLabel: 'Latest Filing', trendNote: 'Capital market derivatives & Star MF exchange platform leader' },
      { ticker: 'RADICO', symbol: 'RADICO.NS', companyName: 'Radico Khaitan Ltd (Mukul Agrawal)', sector: 'Consumer & FMCG', stakePct: '1.1%', changeType: 'Increased', quarterLabel: 'Latest Filing', trendNote: 'Premium spirits margin expansion & luxury brand scaling' },
      { ticker: 'CHENNPETRO', symbol: 'CHENNPETRO.NS', companyName: 'Chennai Petroleum (Dolly Khanna)', sector: 'Energy & Materials', stakePct: '1.1%', changeType: 'Reduced', quarterLabel: 'Latest Filing', trendNote: 'Cyclical refining margin play trimmed after outperformance' },
      { ticker: 'MASTEK', symbol: 'MASTEK.NS', companyName: 'Mastek Ltd (Abakkus / Singhania)', sector: 'IT & Tech', stakePct: '2.8%', changeType: 'Steady', quarterLabel: 'Latest Filing', trendNote: 'UK public sector & US healthcare digital engineering value pick' },
      { ticker: 'KAYNES', symbol: 'KAYNES.NS', companyName: 'Kaynes Technology India (Institutional / HNI)', sector: 'IT & Tech', stakePct: '1.4%', changeType: 'Newly Added', quarterLabel: 'Latest Filing', trendNote: 'HNI & growth funds rotating into India OSAT semiconductor supply chain' },
    ],
  },
  {
    id: 'inst-mutual-funds',
    name: 'Mutual Funds (Domestic AMCs)',
    category: 'Institutional Investor',
    subType: 'SEBI Equity & Hybrid Schemes',
    styleSummary: 'Supported by record ₹25,000+ Cr/month structural SIP inflows creating steady domestic floor under NSE blue-chips & mid-caps.',
    rssQuery: 'Indian mutual fund buying selling top stocks AMFI monthly NSE',
    holdings: [
      { ticker: 'HDFCBANK', symbol: 'HDFCBANK.NS', companyName: 'HDFC Bank Ltd', sector: 'Banking & Finance', stakePct: '24.6%', changeType: 'Increased', quarterLabel: 'Latest Filing', trendNote: 'Highest rupee exposure across Indian equity AMCs' },
      { ticker: 'ICICIBANK', symbol: 'ICICIBANK.NS', companyName: 'ICICI Bank Ltd', sector: 'Banking & Finance', stakePct: '28.9%', changeType: 'Increased', quarterLabel: 'Latest Filing', trendNote: 'Consistent overweight on core operating ROE delivery' },
      { ticker: 'RELIANCE', symbol: 'RELIANCE.NS', companyName: 'Reliance Industries Ltd', sector: 'Energy & Materials', stakePct: '8.4%', changeType: 'Increased', quarterLabel: 'Latest Filing', trendNote: 'Steady accumulation on digital/retail & green energy optionality' },
      { ticker: 'PERSISTENT', symbol: 'PERSISTENT.NS', companyName: 'Persistent Systems Ltd', sector: 'IT & Tech', stakePct: '21.8%', changeType: 'Increased', quarterLabel: 'Latest Filing', trendNote: 'Preferred mid-cap IT GenAI compounder' },
      { ticker: 'DIXON', symbol: 'DIXON.NS', companyName: 'Dixon Technologies (India) Ltd', sector: 'IT & Tech', stakePct: '18.2%', changeType: 'Increased', quarterLabel: 'Latest Filing', trendNote: 'Strong domestic institutional alignment with PLI electronics scale' },
    ],
  },
  {
    id: 'inst-fii',
    name: 'Foreign Institutional Investors (FIIs)',
    category: 'Institutional Investor',
    subType: 'FPI / Sovereign Wealth / Global EM Funds',
    styleSummary: 'Global capital flows sensitive to US Treasury yields, USD/INR, and India MSCI weight shifts across financials, telecom & consumer tech.',
    rssQuery: 'FII FPI buying selling Indian stock market NSE activity',
    holdings: [
      { ticker: 'ETERNAL', symbol: 'ETERNAL.NS', companyName: 'Eternal Ltd (Zomato & Blinkit)', sector: 'Consumer & FMCG', stakePct: '47.4%', changeType: 'Steady', quarterLabel: 'Latest Filing', trendNote: 'Highest FII institutional ownership in Indian quick-commerce' },
      { ticker: 'BHARTIARTL', symbol: 'BHARTIARTL.NS', companyName: 'Bharti Airtel Ltd', sector: 'Telecom & Digital', stakePct: '24.4%', changeType: 'Increased', quarterLabel: 'Latest Filing', trendNote: 'FIIs adding exposure on wireless ARPU expansion & deleveraging' },
      { ticker: 'TRENT', symbol: 'TRENT.NS', companyName: 'Trent Ltd', sector: 'Consumer & FMCG', stakePct: '25.4%', changeType: 'Increased', quarterLabel: 'Latest Filing', trendNote: 'Global passive Nifty & MSCI inflows lifting foreign ownership' },
      { ticker: 'COFORGE', symbol: 'COFORGE.NS', companyName: 'Coforge Ltd', sector: 'IT & Tech', stakePct: '42.1%', changeType: 'Increased', quarterLabel: 'Latest Filing', trendNote: 'Concentrated global tech fund conviction post order-book expansion' },
      { ticker: 'HDFCBANK', symbol: 'HDFCBANK.NS', companyName: 'HDFC Bank Ltd', sector: 'Banking & Finance', stakePct: '47.2%', changeType: 'Reduced', quarterLabel: 'Latest Filing', trendNote: 'Periodic tactical rotation balanced by MSCI weight expansion' },
    ],
  },
  {
    id: 'inst-dii',
    name: 'Domestic Institutional Investors (DIIs)',
    category: 'Institutional Investor',
    subType: 'AMCs + Pension + Banks + Financial Institutions',
    styleSummary: 'Counter-cyclical domestic liquidity engine offsetting FII selling across infrastructure, PSU banks, power & staples.',
    rssQuery: 'DII buying activity Indian equities NSE cash market today',
    holdings: [
      { ticker: 'LT', symbol: 'LT.NS', companyName: 'Larsen & Toubro Ltd', sector: 'Infrastructure', stakePct: '41.2%', changeType: 'Increased', quarterLabel: 'Latest Filing', trendNote: 'Flagship domestic capex and engineering benchmark holding' },
      { ticker: 'SBIN', symbol: 'SBIN.NS', companyName: 'State Bank of India', sector: 'Banking & Finance', stakePct: '24.2%', changeType: 'Increased', quarterLabel: 'Latest Filing', trendNote: 'Strong domestic bank conviction backed by low credit costs' },
      { ticker: 'BEL', symbol: 'BEL.NS', companyName: 'Bharat Electronics Ltd', sector: 'Defence & Auto', stakePct: '22.8%', changeType: 'Increased', quarterLabel: 'Latest Filing', trendNote: 'Rising DII ownership across sovereign defence order visibility' },
      { ticker: 'TATAPOWER', symbol: 'TATAPOWER.NS', companyName: 'Tata Power Company Ltd', sector: 'Energy & Materials', stakePct: '16.5%', changeType: 'Increased', quarterLabel: 'Latest Filing', trendNote: 'Steady allocation to grid transition and EV charging rollout' },
      { ticker: 'CDSL', symbol: 'CDSL.NS', companyName: 'Central Depository Services Ltd', sector: 'Banking & Finance', stakePct: '26.4%', changeType: 'Increased', quarterLabel: 'Latest Filing', trendNote: 'Beneficiary of capital market demat & financialization flows' },
    ],
  },
  {
    id: 'inst-insurance',
    name: 'Insurance Companies (LIC & Private Insurers)',
    category: 'Institutional Investor',
    subType: 'Long-Duration Value & Sovereign Anchors',
    styleSummary: 'Patient multi-decade insurance balance sheets anchoring high-dividend PSU utilities, blue-chip banks, staples, and infrastructure.',
    rssQuery: 'LIC insurance companies equity stake buying selling NSE BSE',
    holdings: [
      { ticker: 'ITC', symbol: 'ITC.NS', companyName: 'ITC Ltd', sector: 'Consumer & FMCG', stakePct: '15.2%', changeType: 'Steady', quarterLabel: 'Latest Filing', trendNote: 'Largest domestic institutional anchor capturing steady cash dividends' },
      { ticker: 'RELIANCE', symbol: 'RELIANCE.NS', companyName: 'Reliance Industries Ltd', sector: 'Energy & Materials', stakePct: '6.3%', changeType: 'Steady', quarterLabel: 'Latest Filing', trendNote: 'Core Nifty blue-chip policyholder portfolio weight' },
      { ticker: 'LT', symbol: 'LT.NS', companyName: 'Larsen & Toubro Ltd', sector: 'Infrastructure', stakePct: '12.1%', changeType: 'Reduced', quarterLabel: 'Latest Filing', trendNote: 'Periodic tactical profit booking into sovereign capex rallies' },
      { ticker: 'NTPCGREEN', symbol: 'NTPCGREEN.NS', companyName: 'NTPC Green Energy Ltd', sector: 'Energy & Materials', stakePct: '3.2%', changeType: 'Newly Added', quarterLabel: 'IPO Anchor', trendNote: 'IPO anchor investment backing sovereign green power annuities' },
      { ticker: 'INFY', symbol: 'INFY.NS', companyName: 'Infosys Ltd', sector: 'IT & Tech', stakePct: '9.4%', changeType: 'Increased', quarterLabel: 'Latest Filing', trendNote: 'Value accumulation on free-cash-flow and dividend yield support' },
    ],
  },
];

function computeEma(values: number[], period: number): number[] {
  if (values.length === 0) return [];
  const k = 2 / (period + 1);
  const out = [values[0]];
  for (let i = 1; i < values.length; i++) {
    out.push(values[i] * k + out[i - 1] * (1 - k));
  }
  return out;
}

export function computeFullTechnicals(
  points: ChartPoint[],
  livePrice?: number | null,
  previousClose?: number | null,
  high52w?: number | null,
  low52w?: number | null,
  fallback?: {
    sma20?: number | null;
    sma50?: number | null;
    rsi14?: number | null;
    volumeRatio?: number | null;
  }
): TechnicalSummary {
  const validPoints = points.filter((p) => typeof p.close === 'number' && !Number.isNaN(p.close));
  const closes = validPoints.map((p) => p.close);
  const lastClose = livePrice ?? closes[closes.length - 1] ?? null;

  // RSI(14)
  let rsi14: number | null = fallback?.rsi14 ?? null;
  if (closes.length >= 15) {
    const recent = closes.slice(-15);
    let gains = 0;
    let losses = 0;
    for (let i = 1; i < recent.length; i++) {
      const diff = recent[i] - recent[i - 1];
      if (diff > 0) gains += diff;
      else losses += Math.abs(diff);
    }
    const ag = gains / 14;
    const al = losses / 14;
    rsi14 = al === 0 ? 100 : Number((100 - 100 / (1 + ag / al)).toFixed(1));
  }
  const rsiZone =
    rsi14 === null
      ? 'Insufficient bars (switch to 1M/3M)'
      : rsi14 >= 70
        ? 'Overbought (≥ 70) — Extended momentum'
        : rsi14 >= 55
          ? 'Bullish Zone (55–70) — Healthy uptrend'
          : rsi14 <= 30
            ? 'Oversold (≤ 30) — Potential rebound zone'
            : rsi14 <= 45
              ? 'Bearish Pressure (30–45)'
              : 'Neutral Equilibrium (45–55)';

  // SMA & EMA
  const sma20 =
    closes.length >= 20
      ? Number((closes.slice(-20).reduce((a, b) => a + b, 0) / 20).toFixed(2))
      : (fallback?.sma20 ?? null);
  const sma50 =
    closes.length >= 50
      ? Number((closes.slice(-50).reduce((a, b) => a + b, 0) / 50).toFixed(2))
      : (fallback?.sma50 ?? null);

  const ema20Series = closes.length >= 10 ? computeEma(closes, Math.min(20, closes.length)) : [];
  const ema50Series = closes.length >= 25 ? computeEma(closes, Math.min(50, closes.length)) : [];
  const ema20 = ema20Series.length ? Number(ema20Series[ema20Series.length - 1].toFixed(2)) : null;
  const ema50 = ema50Series.length ? Number(ema50Series[ema50Series.length - 1].toFixed(2)) : null;

  // MACD (12, 26, 9)
  let macd: number | null = null;
  let macdSignal: number | null = null;
  let macdHistogram: number | null = null;
  let macdCrossover = 'Needs 26+ bars (select 3M/1Y range)';
  if (closes.length >= 26) {
    const ema12 = computeEma(closes, 12);
    const ema26 = computeEma(closes, 26);
    const line = ema12.map((v, i) => v - ema26[i]);
    const sig = computeEma(line, 9);
    macd = Number(line[line.length - 1].toFixed(2));
    macdSignal = Number(sig[sig.length - 1].toFixed(2));
    macdHistogram = Number((macd - macdSignal).toFixed(2));
    macdCrossover =
      macd > macdSignal
        ? macd > 0
          ? 'Bullish Above Signal & Zero Line'
          : 'Bullish Crossover Forming'
        : macd < 0
          ? 'Bearish Below Signal & Zero Line'
          : 'Bearish Momentum Cooling';
  }

  // Bollinger Bands (20, 2)
  let bollingerUpper: number | null = null;
  let bollingerMiddle: number | null = null;
  let bollingerLower: number | null = null;
  let bollingerSignal = 'Needs 20+ bars';
  if (closes.length >= 20) {
    const win = closes.slice(-20);
    const mean = win.reduce((a, b) => a + b, 0) / 20;
    const variance = win.reduce((acc, val) => acc + (val - mean) ** 2, 0) / 20;
    const sd = Math.sqrt(variance);
    bollingerMiddle = Number(mean.toFixed(2));
    bollingerUpper = Number((mean + 2 * sd).toFixed(2));
    bollingerLower = Number((mean - 2 * sd).toFixed(2));
    if (lastClose !== null) {
      if (lastClose >= bollingerUpper) bollingerSignal = 'Testing Upper Band (Expansion / Overbought)';
      else if (lastClose <= bollingerLower) bollingerSignal = 'Near Lower Band (Mean-Reversion Support)';
      else if ((bollingerUpper - bollingerLower) / mean < 0.045) bollingerSignal = 'Tight Bollinger Squeeze — Breakout Watch';
      else if (lastClose >= bollingerMiddle) bollingerSignal = 'Upper Half Channel (Constructive)';
      else bollingerSignal = 'Lower Half Channel (Defensive)';
    }
  }

  // VWAP
  let pvSum = 0;
  let vSum = 0;
  for (const p of validPoints) {
    if (typeof p.volume === 'number' && p.volume > 0) {
      const typical =
        typeof p.high === 'number' && typeof p.low === 'number'
          ? (p.high + p.low + p.close) / 3
          : p.close;
      pvSum += typical * p.volume;
      vSum += p.volume;
    }
  }
  const vwap = vSum > 0 ? Number((pvSum / vSum).toFixed(2)) : null;

  // ADX (14)
  let adx14: number | null = null;
  let adxStrength = 'Insufficient OHLC bars (use 3M/1Y)';
  const ohlcPoints = validPoints.filter(
    (p) => typeof p.high === 'number' && typeof p.low === 'number'
  );
  if (ohlcPoints.length >= 20) {
    const trList: number[] = [];
    const plusDmList: number[] = [];
    const minusDmList: number[] = [];
    for (let i = 1; i < ohlcPoints.length; i++) {
      const curr = ohlcPoints[i];
      const prev = ohlcPoints[i - 1];
      const h = curr.high as number;
      const l = curr.low as number;
      const ph = prev.high as number;
      const pl = prev.low as number;
      const pc = prev.close;
      const tr = Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc));
      const upMove = h - ph;
      const downMove = pl - l;
      plusDmList.push(upMove > downMove && upMove > 0 ? upMove : 0);
      minusDmList.push(downMove > upMove && downMove > 0 ? downMove : 0);
      trList.push(tr);
    }
    const period = Math.min(14, trList.length);
    const dxSeries: number[] = [];
    for (let i = period; i <= trList.length; i++) {
      const sumTr = trList.slice(i - period, i).reduce((a, b) => a + b, 0);
      const sumPlus = plusDmList.slice(i - period, i).reduce((a, b) => a + b, 0);
      const sumMinus = minusDmList.slice(i - period, i).reduce((a, b) => a + b, 0);
      if (sumTr > 0) {
        const diPlus = (sumPlus / sumTr) * 100;
        const diMinus = (sumMinus / sumTr) * 100;
        const denom = diPlus + diMinus;
        dxSeries.push(denom > 0 ? (Math.abs(diPlus - diMinus) / denom) * 100 : 0);
      }
    }
    if (dxSeries.length > 0) {
      const sliceDx = dxSeries.slice(-14);
      adx14 = Number((sliceDx.reduce((a, b) => a + b, 0) / sliceDx.length).toFixed(1));
      adxStrength =
        adx14 >= 40
          ? 'Very Strong Directional Trend (≥ 40)'
          : adx14 >= 25
            ? 'Confirmed Active Trend (25–40)'
            : adx14 >= 18
              ? 'Emerging / Moderate Trend (18–25)'
              : 'Weak / Rangebound (< 18)';
    }
  }

  // Classic Pivot Support & Resistance from last session / recent swing
  let pivot: number | null = null;
  let s1: number | null = null;
  let s2: number | null = null;
  let r1: number | null = null;
  let r2: number | null = null;
  const refBar = ohlcPoints[ohlcPoints.length - 1];
  if (refBar && typeof refBar.high === 'number' && typeof refBar.low === 'number') {
    const H = refBar.high;
    const L = refBar.low;
    const C = refBar.close;
    const P = (H + L + C) / 3;
    pivot = Number(P.toFixed(2));
    r1 = Number((2 * P - L).toFixed(2));
    s1 = Number((2 * P - H).toFixed(2));
    r2 = Number((P + (H - L)).toFixed(2));
    s2 = Number((P - (H - L)).toFixed(2));
  } else if (typeof low52w === 'number' && typeof high52w === 'number' && lastClose) {
    pivot = Number(lastClose.toFixed(2));
    s1 = Number((lastClose * 0.96).toFixed(2));
    s2 = Number(low52w.toFixed(2));
    r1 = Number((lastClose * 1.04).toFixed(2));
    r2 = Number(high52w.toFixed(2));
  }

  // Trend Detection
  let trendSignal = 'Neutral / Consolidating';
  if (lastClose !== null && sma20 !== null) {
    if (sma50 !== null) {
      if (lastClose > sma20 && sma20 > sma50) trendSignal = 'Strong Uptrend (Price > 20-DMA > 50-DMA)';
      else if (lastClose > sma20 && lastClose > sma50) trendSignal = 'Constructive Uptrend';
      else if (lastClose < sma20 && sma20 < sma50) trendSignal = 'Downtrend (Price < 20-DMA < 50-DMA)';
      else trendSignal = 'Mixed / Consolidation Phase';
    } else {
      trendSignal = lastClose >= sma20 ? 'Short-Term Uptrend (Above 20-DMA)' : 'Short-Term Softness (Below 20-DMA)';
    }
  } else if (lastClose !== null && typeof previousClose === 'number') {
    trendSignal = lastClose >= previousClose ? 'Positive Session Bias' : 'Soft Session Bias';
  }

  // Volume Analysis
  const vols = validPoints
    .map((p) => p.volume)
    .filter((v): v is number => typeof v === 'number' && v > 0);
  let volumeRatio = fallback?.volumeRatio ?? null;
  if (vols.length >= 10) {
    const avg = vols.slice(-20).reduce((a, b) => a + b, 0) / Math.min(20, vols.length);
    const latest = vols[vols.length - 1];
    if (avg > 0) volumeRatio = Number((latest / avg).toFixed(2));
  }
  const volumeBias =
    volumeRatio === null
      ? 'Normal Session Participation'
      : volumeRatio >= 1.5
        ? `Surge (${volumeRatio}x avg) — High Institutional Conviction`
        : volumeRatio >= 1.15
          ? `Above Average (${volumeRatio}x avg) — Active Accumulation/Flow`
          : volumeRatio <= 0.7
            ? `Light Turnover (${volumeRatio}x avg) — Low-Conviction Drift`
            : `Balanced Turnover (${volumeRatio}x avg)`;

  // Candlestick Patterns (from real latest OHLC bars)
  const candlestickPatterns: TechnicalSummary['candlestickPatterns'] = [];
  if (ohlcPoints.length >= 2) {
    const cur = ohlcPoints[ohlcPoints.length - 1];
    const prev = ohlcPoints[ohlcPoints.length - 2];
    const o = cur.open ?? cur.close;
    const h = cur.high as number;
    const l = cur.low as number;
    const c = cur.close;
    const body = Math.abs(c - o);
    const range = Math.max(0.01, h - l);
    const upperWick = h - Math.max(o, c);
    const lowerWick = Math.min(o, c) - l;

    const po = prev.open ?? prev.close;
    const pc = prev.close;
    const pBody = Math.abs(pc - po);

    if (c > o && pc < po && c >= po && o <= pc && body > pBody) {
      candlestickPatterns.push({
        name: 'Bullish Engulfing',
        bias: 'Bullish',
        description: 'Latest green candle body completely engulfs the prior red session, signaling buyer absorption.',
      });
    } else if (c < o && pc > po && o >= pc && c <= po && body > pBody) {
      candlestickPatterns.push({
        name: 'Bearish Engulfing',
        bias: 'Bearish',
        description: 'Latest red candle body engulfs the prior green bar, indicating supply overhang at highs.',
      });
    }

    if (lowerWick >= body * 2 && upperWick <= range * 0.2 && body > 0) {
      candlestickPatterns.push({
        name: 'Hammer / Lower-Wick Rejection',
        bias: 'Bullish',
        description: 'Intraday sellers pushed below open before strong demand lifted price back toward session highs.',
      });
    } else if (upperWick >= body * 2 && lowerWick <= range * 0.2 && body > 0) {
      candlestickPatterns.push({
        name: 'Shooting Star / Upper-Wick Rejection',
        bias: 'Bearish',
        description: 'Intraday breakout attempt faced overhead supply, pulling close back near session lows.',
      });
    } else if (body / range <= 0.14) {
      candlestickPatterns.push({
        name: 'Doji Indecision',
        bias: 'Neutral',
        description: 'Open and close converged tightly near the midpoint, signaling equilibrium ahead of next directional move.',
      });
    }

    if (typeof prev.high === 'number' && typeof prev.low === 'number' && h <= prev.high && l >= prev.low) {
      candlestickPatterns.push({
        name: 'Inside Bar Consolidation',
        bias: 'Neutral',
        description: 'Range contracted inside the prior candle high-low envelope; watch break of prior bar extremes.',
      });
    }

    if (candlestickPatterns.length === 0) {
      if (c >= o && body / range >= 0.65) {
        candlestickPatterns.push({
          name: 'Strong Bullish Momentum Candle',
          bias: 'Bullish',
          description: 'Wide green body closing near session high shows sustained buyer control.',
        });
      } else if (c < o && body / range >= 0.65) {
        candlestickPatterns.push({
          name: 'Strong Bearish Distribution Candle',
          bias: 'Bearish',
          description: 'Wide red body closing near session low reflects persistent selling pressure.',
        });
      } else {
        candlestickPatterns.push({
          name: c >= o ? 'Balanced Accumulation Candle' : 'Measured Pullback Candle',
          bias: c >= o ? 'Bullish' : 'Neutral',
          description: 'Orderly price action within normal daily ATR bounds without extreme reversal wicks.',
        });
      }
    }
  }

  return {
    rsi14,
    rsiZone,
    macd,
    macdSignal,
    macdHistogram,
    macdCrossover,
    sma20,
    sma50,
    ema20,
    ema50,
    bollingerUpper,
    bollingerMiddle,
    bollingerLower,
    bollingerSignal,
    vwap,
    adx14,
    adxStrength,
    pivot,
    s1,
    s2,
    r1,
    r2,
    trendSignal,
    volumeBias,
    candlestickPatterns,
  };
}
