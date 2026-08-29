import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft,
  Search, 
  Filter, 
  ShieldCheck, 
  Activity, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  FileText,
  Zap,
  Info,
  Calculator,
  AlertTriangle,
  Table,
  Sliders,
  ChevronRight,
  ChevronLeft,
  Eye,
  X,
  Copy,
  Check,
  Scale,
  DollarSign,
  PieChart,
  BarChart3,
  Award,
  GraduationCap,
  Compass,
  BookmarkCheck,
  RefreshCw,
  Flame,
  FolderCheck
} from 'lucide-react';
import { FINANCIAL_GLOSSARY, GlossaryTerm } from '../../data/financialGlossary';
import { LEARNING_TRACKS, LearningTrack, LearningStep } from '../../data/learningPaths';

interface Concept {
  id: string;
  term: string;
  category: 'Efficiency' | 'Valuation' | 'Solvency' | 'Forensic' | 'Market Structure' | 'Cash Flow';
  difficulty: 'Core' | 'Intermediate' | 'Institutional';
  simple: string;
  analyst: string;
  goodBenchmark: string;
  dangerBenchmark: string;
  scheduleIIIPath: string;
  redFlags: string[];
  example: string;
  formula: string;
}

export const FinancialGuide: React.FC = () => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'learning-path' | 'glossary' | 'cards' | 'calculators' | 'forensics' | 'cheatsheet'>('learning-path');
  
  // Search & Filters for Cards
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [activeDetailConcept, setActiveDetailConcept] = useState<Concept | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // --- Learning Path State ---
  const [selectedTrackId, setSelectedTrackId] = useState<string>('track-1-fundamentals');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('cinfi_learning_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);

  // --- Glossary State ---
  const [glossarySearch, setGlossarySearch] = useState('');
  const [glossaryCategory, setGlossaryCategory] = useState<string>('ALL');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [expandedGlossaryId, setExpandedGlossaryId] = useState<string | null>(null);

  // --- Interactive Calculator States ---
  // ROCE
  const [roceEbit, setRoceEbit] = useState<number>(250);
  const [roceAssets, setRoceAssets] = useState<number>(1200);
  const [roceCurrLiab, setRoceCurrLiab] = useState<number>(300);

  // Piotroski
  const [fScoreChecks, setFScoreChecks] = useState<Record<string, boolean>>({
    positiveRoa: true,
    positiveCfo: true,
    cfoGreaterThanPat: true,
    increasingRoa: true,
    decreasingLeverage: true,
    increasingCurrentRatio: true,
    noDilution: true,
    increasingGrossMargin: true,
    increasingAssetTurnover: true
  });

  // Altman Z
  const [zWorkingCap, setZWorkingCap] = useState<number>(300);
  const [zRetainedEarnings, setZRetainedEarnings] = useState<number>(450);
  const [zEbit, setZEbit] = useState<number>(200);
  const [zMarketEquity, setZMarketEquity] = useState<number>(1800);
  const [zTotalLiabilities, setZTotalLiabilities] = useState<number>(400);
  const [zSales, setZSales] = useState<number>(1500);
  const [zTotalAssets, setZTotalAssets] = useState<number>(1000);

  // DuPont
  const [dpNetMargin, setDpNetMargin] = useState<number>(16);
  const [dpAssetTurnover, setDpAssetTurnover] = useState<number>(1.2);
  const [dpLeverage, setDpLeverage] = useState<number>(1.4);

  // PEG
  const [pegPe, setPegPe] = useState<number>(24);
  const [pegEpsGrowth, setPegEpsGrowth] = useState<number>(20);

  // Save learning progress
  useEffect(() => {
    try {
      localStorage.setItem('cinfi_learning_progress', JSON.stringify(completedSteps));
    } catch {
      // ignore
    }
  }, [completedSteps]);

  // Current Active Track
  const activeTrack = useMemo(() => {
    return LEARNING_TRACKS.find(t => t.id === selectedTrackId) || LEARNING_TRACKS[0];
  }, [selectedTrackId]);

  const activeStep: LearningStep = useMemo(() => {
    return activeTrack.steps[activeStepIndex] || activeTrack.steps[0];
  }, [activeTrack, activeStepIndex]);

  // Step completion key helper
  const getStepKey = (trackId: string, stepNum: number) => `${trackId}_step_${stepNum}`;

  const isCurrentStepCompleted = completedSteps[getStepKey(activeTrack.id, activeStep.stepNumber)];

  // Reset quiz state when switching step
  const handleSelectStep = (index: number) => {
    setActiveStepIndex(index);
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);
  };

  const handleSelectTrack = (trackId: string) => {
    setSelectedTrackId(trackId);
    setActiveStepIndex(0);
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);
  };

  const handleQuizSubmit = () => {
    if (selectedQuizOption !== null) {
      setIsQuizSubmitted(true);
      if (selectedQuizOption === activeStep.quiz.correctIndex) {
        setCompletedSteps(prev => ({
          ...prev,
          [getStepKey(activeTrack.id, activeStep.stepNumber)]: true
        }));
      }
    }
  };

  const handleToggleStepCompleted = (trackId: string, stepNum: number) => {
    const key = getStepKey(trackId, stepNum);
    setCompletedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const totalStepsInApp = useMemo(() => {
    return LEARNING_TRACKS.reduce((acc, t) => acc + t.steps.length, 0);
  }, []);

  const totalCompletedCount = useMemo(() => {
    return Object.values(completedSteps).filter(Boolean).length;
  }, [completedSteps]);

  const overallProgressPercentage = Math.round((totalCompletedCount / Math.max(1, totalStepsInApp)) * 100);

  // Track specific progress
  const getTrackCompletedCount = (track: LearningTrack) => {
    return track.steps.filter(s => completedSteps[getStepKey(track.id, s.stepNumber)]).length;
  };

  const getTrackProgressPercent = (track: LearningTrack) => {
    const done = getTrackCompletedCount(track);
    return Math.round((done / track.steps.length) * 100);
  };

  // --- Filtered Glossary Terms ---
  const alphabetLetters = ['ALL', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'V', 'W'];

  const filteredGlossary = useMemo(() => {
    return FINANCIAL_GLOSSARY.filter(item => {
      if (glossaryCategory !== 'ALL' && item.category !== glossaryCategory) return false;
      if (selectedLetter !== 'ALL' && !item.term.toUpperCase().startsWith(selectedLetter)) return false;
      if (glossarySearch.trim()) {
        const q = glossarySearch.toLowerCase();
        const match = 
          item.term.toLowerCase().includes(q) ||
          item.shortDef.toLowerCase().includes(q) ||
          item.detailedDef.toLowerCase().includes(q) ||
          item.example.toLowerCase().includes(q) ||
          (item.formula && item.formula.toLowerCase().includes(q)) ||
          item.tags.some(t => t.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [glossaryCategory, selectedLetter, glossarySearch]);

  // Concept cards data
  const concepts: Concept[] = [
    {
      id: 'roce',
      term: 'Return on Capital Employed (ROCE)',
      category: 'Efficiency',
      difficulty: 'Core',
      formula: 'ROCE = EBIT ÷ (Total Assets - Current Liabilities) × 100',
      simple: 'Measures how much pre-tax operational profit a business extracts for every ₹100 of total capital deployed into factories, inventory, and operations.',
      analyst: 'EBIT ÷ Capital Employed. The purest indicator of business moat and capital reinvestment efficiency, unpolluted by tax variations or financial leverage structures.',
      goodBenchmark: '> 18% (Industrial) | > 25% (Asset-Light Tech)',
      dangerBenchmark: '< 10% (Sub-cost of debt capital)',
      scheduleIIIPath: 'P&L: Operating Profit before Tax & Finance Costs ÷ Balance Sheet: Net Worth + Long-term Borrowings',
      redFlags: [
        'Consistently low ROCE despite high sales growth (value-destructive expansion)',
        'Ballooning Capital Work-in-Progress (CWIP) uncommissioned for >2 years inflating denominator',
        'High ROE but low ROCE (indicates returns driven purely by excessive debt leverage)'
      ],
      example: 'Bharat Electronics (BEL) produces ₹28.20 operating profit on every ₹100 of capital employed (28.2% ROCE).'
    },
    {
      id: 'pe-peg',
      term: 'Price to Earnings (P/E) & PEG Ratio',
      category: 'Valuation',
      difficulty: 'Core',
      formula: 'P/E = Market Price ÷ EPS | PEG = P/E ÷ Annual EPS Growth Rate (%)',
      simple: 'The price you pay for ₹1 of annual earnings. The PEG ratio adjusts this multiple against how fast those earnings are actually expanding.',
      analyst: 'TTM Price to Diluted EPS. High P/E is justified only when accompanied by structural TAM expansion, high ROCE, and secular EPS growth (PEG < 1.5).',
      goodBenchmark: 'PEG < 1.2x | P/E < 5-Yr Industry Median',
      dangerBenchmark: 'PEG > 2.5x (Severe growth overpricing)',
      scheduleIIIPath: 'NSE/BSE Market Cap ÷ P&L: Profit After Tax (PAT)',
      redFlags: [
        'Trailing P/E looking artificially cheap due to one-time asset sales or tax credits',
        'Cyclical peak earnings giving low P/E ("Value Trap" in commodities)',
        'PEG based on volatile single-quarter EPS rather than normalized 3-year CAGR'
      ],
      example: 'Tata Motors trading at ~8.4x P/E with expanding JLR EV margins represents high cyclical valuation support.'
    },
    {
      id: 'piotroski',
      term: 'Piotroski 9-Point F-Score',
      category: 'Forensic',
      difficulty: 'Intermediate',
      formula: 'Sum of 9 Binary Tests across Profitability (4), Leverage/Liquidity (3), & Operating Efficiency (2)',
      simple: 'A strict forensic scorecard grading whether a company’s fundamental balance sheet and cash flows are strengthening or deteriorating.',
      analyst: 'Academic discrete score (0–9) testing Net Income > 0, OCF > 0, ROA Δ > 0, OCF > PAT (quality of earnings), Debt/Asset Δ < 0, Current Ratio Δ > 0, Zero Equity Dilution, Gross Margin Δ > 0, and Asset Turnover Δ > 0.',
      goodBenchmark: 'Score 8–9 (Institutional Quality)',
      dangerBenchmark: 'Score 0–3 (Elevated Distress / Trap)',
      scheduleIIIPath: 'Comparative Multi-Year P&L, Balance Sheet & Cash Flow Statement',
      redFlags: [
        'Score drop below 5 driven by OCF < Net Profit (accrual manipulation)',
        'Persistent equity dilution via preferential warrants without margin expansion',
        'Gross margin contraction masked by inventory accumulation'
      ],
      example: 'CDSL commands 9/9 with pristine cash generation, zero debt, and expanding EBITDA margins.'
    },
    {
      id: 'altman-z',
      term: 'Altman Z-Score (Bankruptcy Shield)',
      category: 'Solvency',
      difficulty: 'Intermediate',
      formula: 'Z = 1.2(WC/TA) + 1.4(RE/TA) + 3.3(EBIT/TA) + 0.6(MC/TL) + 0.999(Sales/TA)',
      simple: 'A multi-variable statistical formula predicting the mathematical probability of financial distress or corporate loan default over the next 24 months.',
      analyst: 'Weighted multivariate discriminant model measuring liquidity, cumulative profitability, operating efficiency, and market leverage.',
      goodBenchmark: 'Z > 2.99 (Safe Green Zone)',
      dangerBenchmark: 'Z < 1.81 (Distress Red Zone)',
      scheduleIIIPath: 'Full Balance Sheet Capital Structure + P&L Revenue/EBIT',
      redFlags: [
        'Rapid descent from Safe Zone into Grey Zone (1.81 - 2.99) within 4 quarters',
        'Negative working capital in asset-heavy manufacturing setups',
        'Market Cap/Total Liabilities falling below 0.5'
      ],
      example: 'Kaynes Technology Z-Score > 4.2 indicates robust solvency backed by equity capitalization and low leverage.'
    },
    {
      id: 'debt-equity',
      term: 'Debt to Equity & Net Debt / EBITDA',
      category: 'Solvency',
      difficulty: 'Core',
      formula: 'D/E = Total Debt ÷ Shareholders Funds | Net Debt = Total Debt - Cash & Liquid MFs',
      simple: 'Measures how much borrowed debt a company carries compared to the money invested by shareholders and how many years of operating profit it would take to pay it off.',
      analyst: 'Total Borrowings ÷ Total Equity. Net Debt / EBITDA under 1.5x allows companies to navigate monetary tightening cycles and capex surges safely.',
      goodBenchmark: 'D/E < 0.5x | Net Debt/EBITDA < 1.5x (Net Cash is Ideal)',
      dangerBenchmark: 'D/E > 1.5x | Net Debt/EBITDA > 3.5x',
      scheduleIIIPath: 'Balance Sheet: Non-Current Borrowings + Current Borrowings ÷ Total Equity',
      redFlags: [
        'Short-term borrowings used to finance long-term CAPEX (Asset-Liability Mismatch)',
        'Off-balance sheet corporate guarantees given to subsidiaries not reflected in standalone debt',
        'Rising finance costs during flat revenue quarters'
      ],
      example: 'Premier Energies maintaining disciplined debt during its massive solar cell and module capacity expansion.'
    },
    {
      id: 'fcf-conversion',
      term: 'Free Cash Flow (FCF) & CFO/EBITDA',
      category: 'Cash Flow',
      difficulty: 'Core',
      formula: 'FCF = Cash from Operations (CFO) - CAPEX | Conversion = CFO ÷ EBITDA × 100',
      simple: 'The real cash surplus left in the company’s bank account after paying all operating suppliers, taxes, and funding new machinery and factory expansions.',
      analyst: 'Operating Cash Flow minus Capital Expenditures. An EBITDA conversion rate above 75-80% verifies true cash earnings and authentic accounting.',
      goodBenchmark: 'CFO / EBITDA > 75% | Sustained Positive FCF',
      dangerBenchmark: 'CFO / EBITDA < 40% (Poor earnings quality)',
      scheduleIIIPath: 'Cash Flow Statement: Net Cash from Operating Activities - Purchase of Property, Plant & Equipment',
      redFlags: [
        'High reported PAT with negative CFO for consecutive years (channel stuffing)',
        'Capex categorized as operational maintenance rather than growth',
        'Customer trade receivables growing 3x faster than revenue'
      ],
      example: 'TCS consistently converts ~90% of EBITDA into cash flow, supporting uninterrupted dividend distributions.'
    },
    {
      id: 'dupont',
      term: 'DuPont 3-Stage ROE Decomposition',
      category: 'Efficiency',
      difficulty: 'Intermediate',
      formula: 'ROE = (Net Profit Margin) × (Asset Turnover) × (Equity Multiplier)',
      simple: 'Breaks down Return on Equity into three distinct drivers: Pricing Moat (Margin), Speed of Operations (Turnover), and Borrowed Leverage (Multiplier).',
      analyst: 'Diagnostic framework proving whether high ROE is driven by genuine operating moat or hazardous leverage. Quality ROE comes from Margin and Turnover, not high Multipliers.',
      goodBenchmark: 'High ROE with Equity Multiplier < 2.0x',
      dangerBenchmark: 'ROE > 20% achieved purely via Leverage Multiplier > 4.0x',
      scheduleIIIPath: 'P&L (PAT/Revenue) × P&L/BS (Revenue/Assets) × BS (Assets/Equity)',
      redFlags: [
        'ROE increasing while profit margins and asset turnover are falling (debt-driven illusion)',
        'Asset turnover dropping as company expands into unrelated capital-heavy verticals'
      ],
      example: 'KPIT Technologies delivers 26% ROE primarily through strong operating margins (16%) and high asset-light turnover.'
    },
    {
      id: 'promoter-pledge',
      term: 'Promoter Share Pledge & Governance',
      category: 'Forensic',
      difficulty: 'Core',
      formula: 'Pledge % = (Pledged Promoter Shares ÷ Total Promoter Shares) × 100',
      simple: 'Checks if company founders have mortgaged their personal ownership shares with NBFCs or banks to borrow debt for other businesses.',
      analyst: 'Statutory SEBI shareholding disclosure. High pledge poses systemic margin call risks, where lenders can dump shares in the open market during stock declines.',
      goodBenchmark: '0.00% (Zero Pledge is the institutional standard)',
      dangerBenchmark: '> 15.0% (Substantial forced liquidation risk)',
      scheduleIIIPath: 'BSE/NSE Quarterly Shareholding Pattern - Table II (Encumbered Shares)',
      redFlags: [
        'Rising pledge percentage alongside falling stock price (trigger spiral risk)',
        'Promoter entities with opaque offshore holdings pledging shares to foreign trusts',
        'Frequent changes in statutory auditors or resignations before annual results'
      ],
      example: 'Zero promoter pledge across CINFI high-conviction companies eliminates sudden forced liquidation risks.'
    },
    {
      id: 'ccc',
      term: 'Cash Conversion Cycle (CCC & Working Capital Days)',
      category: 'Cash Flow',
      difficulty: 'Intermediate',
      formula: 'CCC = Inventory Days (DIO) + Debtor Days (DSO) - Payable Days (DPO)',
      simple: 'The exact number of days it takes for a company to convert its investments in inventory and raw materials back into cold hard cash from customers.',
      analyst: 'Working capital velocity metric. Negative or low CCC signifies immense bargaining power over suppliers and rapid collection from customers.',
      goodBenchmark: '< 45 Days (Industrial) | Negative CCC (Retail/FMCG/Auto OEMs)',
      dangerBenchmark: '> 150 Days (Working capital trapped/bloated)',
      scheduleIIIPath: 'P&L COGS & Sales + Balance Sheet Inventories, Trade Receivables, Trade Payables',
      redFlags: [
        'Sudden jump in Debtor Days (>120 days) indicating aggressive credit sales or uncollectible receivables',
        'Inventory piling up faster than revenue growth (unsellable obsolete stock)',
        'Extending payable days unnaturally to mask liquidity shortages'
      ],
      example: 'Premier Energies and Kaynes optimize inventory turns to minimize idle working capital during rapid scale-up.'
    },
    {
      id: 'sebi-surveillance',
      term: 'SEBI ASM & GSM Surveillance Framework',
      category: 'Market Structure',
      difficulty: 'Institutional',
      formula: 'Exchange-mandated risk criteria based on High-Low Volatility, PE Ratios & Client Concentration',
      simple: 'Regulatory monitoring lists created by SEBI and Indian stock exchanges (NSE/BSE) to safeguard retail investors from artificial price manipulation and illiquidity.',
      analyst: 'Additional Surveillance Measure (ASM) & Graded Surveillance Measure (GSM) impose 100% upfront margins, price band reductions (5% / 2%), and periodic settlement.',
      goodBenchmark: 'Clean status (Unencumbered by ASM Stage 1-4 or GSM Stage 1-4)',
      dangerBenchmark: 'ASM Stage 2+ or GSM Inclusion (100% margin & liquidity freeze)',
      scheduleIIIPath: 'NSE/BSE Daily Circulars & Surveillance Action Master Files',
      redFlags: [
        'Stock moving to ASM Long Term Stage 1 following speculative social media pump',
        'Promoter or insider trading volume spikes preceding major policy announcements',
        'Price-to-Earnings multiple exceeding 5x of sector benchmark without revenue base'
      ],
      example: 'All stocks in the CINFI high-conviction universe undergo real-time surveillance verification to ensure clean liquidity.'
    },
    {
      id: 'contingent-liabilities',
      term: 'Contingent Liabilities as % of Net Worth',
      category: 'Forensic',
      difficulty: 'Institutional',
      formula: 'Contingent Ratio = (Total Disclosed Contingent Liabilities ÷ Net Worth) × 100',
      simple: 'Potential debts or legal/tax claims against the company that are not on the main balance sheet but could suddenly become real liabilities if court or tax rulings go against them.',
      analyst: 'Footnotes to Balance Sheet (Schedule III). Significant tax disputes (GST, Income Tax, Customs) and corporate bank guarantees to group companies that could wipe out net worth.',
      goodBenchmark: '< 10% of Net Worth',
      dangerBenchmark: '> 50% of Net Worth (Severe hidden liability risk)',
      scheduleIIIPath: 'Notes to Financial Statements: Note on Commitments & Contingent Liabilities',
      redFlags: [
        'Contingent liabilities exceeding total tangible net worth',
        'Disputed direct/indirect tax liabilities growing each year without adequate escrow provisions',
        'Guarantees given to loss-making promoter group entities'
      ],
      example: 'Pristine balance sheets maintain low single-digit contingent exposure relative to equity net worth.'
    },
    {
      id: 'fii-dii-flows',
      term: 'FII vs DII Institutional Flow Dynamics',
      category: 'Market Structure',
      difficulty: 'Core',
      formula: 'Net Institutional Absorption = DII Inflows (SIPs + Insurance) - FII Open Market Selling',
      simple: 'Tracks the institutional money tug-of-war between Foreign Portfolio Investors (FPIs/FIIs) and Domestic Mutual Funds/SIPs (DIIs) in Indian equities.',
      analyst: 'Structural liquidity analysis. Consistent domestic mutual fund SIP inflows (~₹24,000+ Cr/month) create a resilient price floor for high-quality Indian equities during global risk-off events.',
      goodBenchmark: 'Rising DII + FII institutional shareholding over 4 quarters',
      dangerBenchmark: 'Institutional dumping (>5% reduction in 2 quarters)',
      scheduleIIIPath: 'BSE/NSE Shareholding Pattern - Institutional Category Summary',
      redFlags: [
        'Sharp institutional exit while retail shareholder count jumps >50% (Distribution Phase)',
        'Bulk/Block deals executed at steep discounts to market price'
      ],
      example: 'Systematic DII accumulation in Indian aerospace, defense, and railway manufacturing provides robust valuation support.'
    }
  ];

  // 10 Forensic Red Flags Traps
  const forensicTraps = [
    {
      title: 'Persistent OCF vs PAT Divergence',
      danger: 'Operating Cash Flow (CFO) is < 40% of reported PAT for 2+ consecutive years.',
      mechanism: 'Booking credit sales without collecting real cash, artificially boosting revenue while receivables balloon.',
      scheduleIII: 'Cash Flow from Operating Activities vs P&L Net Profit'
    },
    {
      title: 'Stagnant CWIP Hoarding',
      danger: 'Capital Work-in-Progress (CWIP) remains static for > 24 months without commissioning.',
      mechanism: 'Capitalizing routine operational expenses into fixed assets to avoid P&L margin degradation.',
      scheduleIII: 'Balance Sheet: Non-Current Assets -> Capital Work-in-Progress'
    },
    {
      title: 'High Promoter Share Pledge',
      danger: 'Pledged promoter holdings > 15-20% of total promoter stake.',
      mechanism: 'Promoters borrowing against shares to fund unrelated private projects, risking margin call cascades.',
      scheduleIII: 'SEBI Quarterly Shareholding Pattern - Table II'
    },
    {
      title: 'Sudden Mid-Year Auditor Resignation',
      danger: 'Statutory auditor resigns abruptly citing "preoccupations" or "lack of audit documentation".',
      mechanism: 'Auditors refusing to sign off on unsupported transactions or undisclosed related-party dealings.',
      scheduleIII: 'BSE/NSE Corporate Announcements & Reg 30 Filings'
    },
    {
      title: 'Unusually High Other Income',
      danger: 'Other Income accounts for > 30% of Total Pre-Tax Profits (PBT).',
      mechanism: 'Masking a decaying core operating business with one-time property sales or financial treasury income.',
      scheduleIII: 'P&L Statement: Note on Other Income'
    },
    {
      title: 'Surging Related-Party Transactions (RPT)',
      danger: 'Significant loans, guarantees, or high-value procurement from unlisted promoter entities.',
      mechanism: 'Siphoning company cash to private entities through inflated consulting charges or unsecured advances.',
      scheduleIII: 'Notes to Accounts: Related Party Disclosures (Ind AS 24)'
    },
    {
      title: 'Disproportionate Trade Receivables (>120 Days)',
      danger: 'Receivables growing at 2x-3x the rate of revenue growth.',
      mechanism: 'Channel-stuffing goods to dealers near quarter-end to meet artificial revenue expectations.',
      scheduleIII: 'Balance Sheet: Current Assets -> Trade Receivables Ageing'
    },
    {
      title: 'Contingent Liabilities Exceeding Net Worth',
      danger: 'Disclosed contingent claims / tax disputes > 40-50% of tangible equity net worth.',
      mechanism: 'Pending litigation or tax demands that could instantly wipe out shareholder equity upon adverse rulings.',
      scheduleIII: 'Notes to Accounts: Contingent Liabilities & Commitments'
    },
    {
      title: 'Frequent Restatements or Reclassifications',
      danger: 'Retroactive modifications to prior-year balance sheet items without regulatory mandate.',
      mechanism: 'Shifting unrecoverable bad loans or obsolete inventory out of sight into obscure reserves.',
      scheduleIII: 'P&L / Balance Sheet Prior Period Adjustments Note'
    },
    {
      title: 'High Debt-to-Equity with Low Interest Coverage',
      danger: 'Debt-to-Equity > 1.5x with Interest Coverage Ratio (EBIT ÷ Interest) < 2.0x.',
      mechanism: 'Operating profit is insufficient to service interest obligations, leading to debt trap refinancing.',
      scheduleIII: 'P&L Finance Costs vs Balance Sheet Non-Current & Current Borrowings'
    }
  ];

  // Filtered concepts
  const filteredConcepts = useMemo(() => {
    return concepts.filter(c => {
      if (selectedCategory !== 'ALL' && c.category !== selectedCategory) return false;
      if (selectedDifficulty !== 'ALL' && c.difficulty !== selectedDifficulty) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = 
          c.term.toLowerCase().includes(q) ||
          c.simple.toLowerCase().includes(q) ||
          c.analyst.toLowerCase().includes(q) ||
          c.example.toLowerCase().includes(q) ||
          c.formula.toLowerCase().includes(q) ||
          c.scheduleIIIPath.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [concepts, selectedCategory, selectedDifficulty, searchQuery]);

  // Copy formula helper
  const handleCopyFormula = (id: string, formula: string) => {
    navigator.clipboard.writeText(formula);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Copy text helper
  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- Calculations for Sandboxes ---
  // ROCE
  const capitalEmployed = Math.max(1, roceAssets - roceCurrLiab);
  const calculatedRoce = ((roceEbit / capitalEmployed) * 100).toFixed(1);

  // Piotroski Score
  const fScoreValue = Object.values(fScoreChecks).filter(Boolean).length;

  // Altman Z
  const zScoreValue = (
    1.2 * (zWorkingCap / zTotalAssets) +
    1.4 * (zRetainedEarnings / zTotalAssets) +
    3.3 * (zEbit / zTotalAssets) +
    0.6 * (zMarketEquity / zTotalLiabilities) +
    0.999 * (zSales / zTotalAssets)
  ).toFixed(2);

  // DuPont ROE
  const calculatedRoe = (dpNetMargin * dpAssetTurnover * dpLeverage).toFixed(1);

  // PEG
  const calculatedPeg = pegEpsGrowth > 0 ? (pegPe / pegEpsGrowth).toFixed(2) : 'N/A';

  return (
    <div id="financial-guide-view" className="w-full max-w-full space-y-6 pb-20 min-w-0 overflow-x-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-w-0">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-2xl bg-cyan-950 border border-cyan-800 text-cyan-400">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight break-words">
              CINFI Institutional Financial & Quant Literacy Academy
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
            Step-by-step interactive learning tracks, comprehensive stock market glossary, quantitative valuation sandboxes, and Schedule III balance sheet forensic audits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 self-start lg:self-auto">
          <div className="px-3.5 py-2 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center space-x-3 shadow-inner">
            <div className="text-right font-mono">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Academy Progress</div>
              <div className="text-xs font-bold text-cyan-300">{totalCompletedCount} / {totalStepsInApp} Modules ({overallProgressPercentage}%)</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 font-bold text-xs font-mono">
              {overallProgressPercentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Primary View Switcher Navigation */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl shadow-xl">
        <button
          onClick={() => setActiveTab('learning-path')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'learning-path'
              ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-950'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Compass className="w-4 h-4 text-cyan-300" />
          <span>Interactive Learning Paths</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-cyan-950 border border-cyan-700 text-cyan-300">4 Tracks</span>
        </button>

        <button
          onClick={() => setActiveTab('glossary')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'glossary'
              ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-950'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>Stock Market Glossary</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-950 border border-emerald-700 text-emerald-300">A-Z Index</span>
        </button>

        <button
          onClick={() => setActiveTab('cards')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'cards'
              ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-950'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-300" />
          <span>Core Concept Deep Dives</span>
        </button>

        <button
          onClick={() => setActiveTab('calculators')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'calculators'
              ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-950'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Quant Calculators</span>
        </button>

        <button
          onClick={() => setActiveTab('forensics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'forensics'
              ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-950'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Forensic Red Flags</span>
        </button>

        <button
          onClick={() => setActiveTab('cheatsheet')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
            activeTab === 'cheatsheet'
              ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-950'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Table className="w-4 h-4 text-cyan-300" />
          <span>Metric Cheatsheet</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: INTERACTIVE LEARNING PATHS (NEW UPGRADE)          */}
      {/* ======================================================== */}
      {activeTab === 'learning-path' && (
        <div className="space-y-6">
          {/* Overall Tracks Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {LEARNING_TRACKS.map((track) => {
              const isSelected = track.id === selectedTrackId;
              const progress = getTrackProgressPercent(track);
              const isDone = progress === 100;

              return (
                <div
                  key={track.id}
                  onClick={() => handleSelectTrack(track.id)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected 
                      ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-950/50 ring-1 ring-cyan-500/50' 
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-cyan-400">
                        Track {track.trackNumber} • {track.level}
                      </span>
                      {isDone ? (
                        <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-400 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Complete</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-400">
                          {track.estimatedMinutes} mins
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-white leading-snug">
                      {track.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      {track.tagline}
                    </p>
                  </div>

                  {/* Progress bar inside Track Card */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80 font-mono text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>{getTrackCompletedCount(track)} / {track.steps.length} Steps</span>
                      <span className="text-cyan-300 font-bold">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                      <div 
                        className={`h-full transition-all duration-500 ${isDone ? 'bg-emerald-400' : 'bg-cyan-500'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Track Learning Workspace */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
            {/* Track Header & Step Pills */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-md border border-cyan-800">
                    Track {activeTrack.trackNumber}: {activeTrack.level} Level
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Step {activeStepIndex + 1} of {activeTrack.steps.length}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {activeTrack.title}
                </h3>
              </div>

              {/* Step Navigation Dots / Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {activeTrack.steps.map((step, idx) => {
                  const isStepDone = completedSteps[getStepKey(activeTrack.id, step.stepNumber)];
                  const isCurrent = idx === activeStepIndex;

                  return (
                    <button
                      key={step.stepNumber}
                      onClick={() => handleSelectStep(idx)}
                      className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950 ring-2 ring-cyan-400'
                          : isStepDone
                            ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-300 hover:bg-emerald-900/50'
                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {isStepDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <span>#{step.stepNumber}</span>
                      )}
                      <span className="truncate max-w-[130px] hidden sm:inline">{step.title.split(':')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step Detail Content Card */}
            <div className="space-y-6">
              {/* Step Title & Meta Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="space-y-1">
                  <h4 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                    <span className="text-cyan-400 font-mono">#{activeStep.stepNumber}</span>
                    <span>{activeStep.title}</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    <strong className="text-slate-300">Learning Objective:</strong> {activeStep.objective}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-start sm:self-auto">
                  <button
                    onClick={() => handleToggleStepCompleted(activeTrack.id, activeStep.stepNumber)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center space-x-1.5 cursor-pointer ${
                      isCurrentStepCompleted
                        ? 'bg-emerald-950 border border-emerald-800 text-emerald-300 hover:bg-emerald-900'
                        : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <BookmarkCheck className={`w-4 h-4 ${isCurrentStepCompleted ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{isCurrentStepCompleted ? 'Completed' : 'Mark as Done'}</span>
                  </button>
                </div>
              </div>

              {/* Core Concepts Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 font-mono mr-1">Key Topics:</span>
                {activeStep.coreConcepts.map((concept, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-medium shadow-inner"
                  >
                    {concept}
                  </span>
                ))}
              </div>

              {/* Main Body Text */}
              <div className="bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-slate-800/80 text-xs sm:text-sm text-slate-200 leading-relaxed space-y-3 font-sans whitespace-pre-line">
                {activeStep.body}
              </div>

              {/* Pro Tip Box */}
              <div className="bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 p-4 sm:p-5 rounded-2xl border border-cyan-800/60 flex items-start space-x-3 text-xs text-cyan-200 shadow-inner">
                <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-white uppercase font-mono tracking-wider text-[11px] block">
                    CINFI Institutional Pro Tip:
                  </span>
                  <p className="leading-relaxed text-slate-200">{activeStep.proTip}</p>
                </div>
              </div>

              {/* Real World Case Study */}
              <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                  <Activity className="w-4 h-4" />
                  <span>Indian Market Case Study: {activeStep.caseStudy.company}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {activeStep.caseStudy.scenario}
                </p>
                <div className="pt-2 border-t border-slate-800/80 text-xs font-mono text-emerald-300">
                  <strong>Key Takeaway:</strong> {activeStep.caseStudy.takeaway}
                </div>
              </div>

              {/* Interactive Step Knowledge Check (Quiz) */}
              <div className="bg-slate-950/90 border border-indigo-900/50 p-5 sm:p-6 rounded-2xl space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="w-5 h-5 text-indigo-400" />
                    <h5 className="text-sm font-bold text-white">Interactive Step Knowledge Check</h5>
                  </div>
                  <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950 px-2.5 py-0.5 rounded border border-indigo-800">
                    Step #{activeStep.stepNumber} Test
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-200">
                  {activeStep.quiz.question}
                </p>

                {/* Options */}
                <div className="space-y-2">
                  {activeStep.quiz.options.map((opt, optIdx) => {
                    const isSelected = selectedQuizOption === optIdx;
                    const isCorrect = optIdx === activeStep.quiz.correctIndex;

                    let btnClass = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white';
                    if (isQuizSubmitted) {
                      if (isCorrect) {
                        btnClass = 'bg-emerald-950 border-emerald-700 text-emerald-200 font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnClass = 'bg-rose-950 border-rose-700 text-rose-200';
                      } else {
                        btnClass = 'bg-slate-900 border-slate-800 text-slate-500 opacity-60';
                      }
                    } else if (isSelected) {
                      btnClass = 'bg-cyan-950 border-cyan-500 text-cyan-200 font-semibold ring-1 ring-cyan-500';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isQuizSubmitted}
                        onClick={() => setSelectedQuizOption(optIdx)}
                        className={`w-full p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="w-5 h-5 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center font-mono text-[10px]">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isQuizSubmitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                        )}
                        {isQuizSubmitted && isSelected && !isCorrect && (
                          <X className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Quiz Controls & Explanation */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {!isQuizSubmitted ? (
                    <button
                      disabled={selectedQuizOption === null}
                      onClick={handleQuizSubmit}
                      className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedQuizOption !== null
                          ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-950'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <div className="text-xs space-y-1">
                      <div className={`font-bold flex items-center space-x-1.5 ${
                        selectedQuizOption === activeStep.quiz.correctIndex ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {selectedQuizOption === activeStep.quiz.correctIndex ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Correct! Step marked as complete.</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4" />
                            <span>Incorrect. Review the explanation below:</span>
                          </>
                        )}
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed font-sans bg-slate-900 p-3 rounded-xl border border-slate-800">
                        {activeStep.quiz.explanation}
                      </p>
                    </div>
                  )}

                  {/* Retry Quiz */}
                  {isQuizSubmitted && selectedQuizOption !== activeStep.quiz.correctIndex && (
                    <button
                      onClick={() => {
                        setSelectedQuizOption(null);
                        setIsQuizSubmitted(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-colors cursor-pointer self-start"
                    >
                      Retry Question
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Pagination & Progress Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  disabled={activeStepIndex === 0}
                  onClick={() => handleSelectStep(activeStepIndex - 1)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                    activeStepIndex > 0
                      ? 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                      : 'opacity-40 cursor-not-allowed text-slate-600 bg-slate-950'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Step</span>
                </button>

                <div className="text-xs font-mono text-slate-400 hidden sm:block">
                  Step {activeStepIndex + 1} of {activeTrack.steps.length}
                </div>

                {activeStepIndex < activeTrack.steps.length - 1 ? (
                  <button
                    onClick={() => handleSelectStep(activeStepIndex + 1)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-cyan-950 cursor-pointer"
                  >
                    <span>Next: Step #{activeStepIndex + 2}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const currentTrackIdx = LEARNING_TRACKS.findIndex(t => t.id === selectedTrackId);
                      if (currentTrackIdx < LEARNING_TRACKS.length - 1) {
                        handleSelectTrack(LEARNING_TRACKS[currentTrackIdx + 1].id);
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-emerald-950 cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>Next Track</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: STOCK MARKET GLOSSARY (NEW UPGRADE)               */}
      {/* ======================================================== */}
      {activeTab === 'glossary' && (
        <div className="space-y-6">
          {/* Search & Category Filter Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Search Box */}
              <div className="relative flex-1 max-w-lg">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search stock terms (e.g. Alpha, Beta, ASM, Free Float, Buyback, CWIP, Delivery %)..."
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-medium"
                />
                {glossarySearch && (
                  <button 
                    onClick={() => setGlossarySearch('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white p-1"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(['ALL', 'Valuation & Metrics', 'Trading & Mechanics', 'Corporate Actions', 'Accounting & Statements', 'Regulation & Governance'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setGlossaryCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      glossaryCategory === cat
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* A-Z Alphabet Quick Bar */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 pt-2 border-t border-slate-800/80 scrollbar-none">
              <span className="text-[11px] font-mono text-slate-400 mr-1 shrink-0">Alphabet:</span>
              {alphabetLetters.map((letter) => (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(letter)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold shrink-0 transition-colors flex items-center justify-center cursor-pointer ${
                    selectedLetter === letter
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
              <span>Showing <strong>{filteredGlossary.length}</strong> Stock Market Terms</span>
              <span className="text-[11px] text-cyan-400 font-mono">SEBI & Exchange Vocabulary</span>
            </div>
          </div>

          {/* Glossary Terms Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGlossary.map((item) => {
              const isExpanded = expandedGlossaryId === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-3xl p-5 space-y-3.5 shadow-xl transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                          {item.category}
                        </span>
                        <h4 className="font-bold text-base text-white hover:text-cyan-300 transition-colors">
                          {item.term}
                        </h4>
                      </div>

                      <button
                        onClick={() => handleCopyText(item.id, `${item.term}: ${item.shortDef}`)}
                        title="Copy Definition"
                        className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
                      >
                        {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Short Summary */}
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      {item.shortDef}
                    </p>

                    {/* Formula if present */}
                    {item.formula && (
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-300 truncate">
                        {item.formula}
                      </div>
                    )}

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="space-y-3 pt-2 border-t border-slate-800/80 text-xs">
                        <div className="space-y-1">
                          <span className="font-semibold text-slate-300 block">Detailed Explanation:</span>
                          <p className="text-slate-300 leading-relaxed">{item.detailedDef}</p>
                        </div>

                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                          <span className="font-bold text-emerald-400 block font-mono text-[11px]">Real Market Example:</span>
                          <p className="text-slate-300">{item.example}</p>
                        </div>

                        <div className="text-xs font-mono text-cyan-200 bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-900">
                          <strong>Takeaway:</strong> {item.keyTakeaway}
                        </div>
                      </div>
                    )}

                    {/* Tag Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {item.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Toggle expand button */}
                  <div className="pt-3 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => setExpandedGlossaryId(isExpanded ? null : item.id)}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 font-mono flex items-center space-x-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Show Less' : 'Deep Explanation & Example'}</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: KNOWLEDGE CARDS & DRILLDOWN                       */}
      {/* ======================================================== */}
      {activeTab === 'cards' && (
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Search Box */}
              <div className="relative flex-1 max-w-lg">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search concepts (e.g. ROCE, Piotroski, Altman Z, FCF, ASM, DuPont)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-medium"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white p-1"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(['ALL', 'Efficiency', 'Valuation', 'Solvency', 'Cash Flow', 'Forensic', 'Market Structure'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-Filters / Stats */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
              <span>Showing <strong>{filteredConcepts.length}</strong> of {concepts.length} Financial Modules</span>
              <div className="flex items-center space-x-2">
                <span className="text-[11px]">Difficulty:</span>
                {(['ALL', 'Core', 'Intermediate', 'Institutional'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition-colors ${
                      selectedDifficulty === diff 
                        ? 'bg-slate-800 text-cyan-300 font-bold border border-cyan-800' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 min-w-0">
            {filteredConcepts.map((item) => (
              <div 
                key={item.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl transition-all min-w-0 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Header Row */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3.5">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase font-bold text-cyan-400 font-mono tracking-wider bg-cyan-950 px-2.5 py-0.5 rounded-md border border-cyan-800">
                          {item.category}
                        </span>
                        <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-md border ${
                          item.difficulty === 'Core'
                            ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800'
                            : item.difficulty === 'Intermediate'
                              ? 'bg-indigo-950/70 text-indigo-300 border-indigo-800'
                              : 'bg-purple-950/70 text-purple-300 border-purple-800'
                        }`}>
                          {item.difficulty}
                        </span>
                      </div>
                      <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-cyan-300 transition-colors">
                        {item.term}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono block text-slate-400">Institutional Benchmark</span>
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-800 mt-0.5 inline-block">
                        {item.goodBenchmark}
                      </span>
                    </div>
                  </div>

                  {/* Formula Strip with Copy */}
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2 font-mono text-xs text-cyan-300">
                    <span className="truncate">{item.formula}</span>
                    <button
                      onClick={() => handleCopyFormula(item.id, item.formula)}
                      title="Copy formula"
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Plain Language Explanation */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 shrink-0" />
                      <span>Plain-Language Explanation:</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      {item.simple}
                    </p>
                  </div>

                  {/* Analyst & Quantitative Perspective */}
                  <div className="space-y-1 pt-2 border-t border-slate-800/70">
                    <div className="text-[11px] font-bold text-cyan-300 flex items-center space-x-1">
                      <Activity className="w-3 h-3 shrink-0" />
                      <span>Analyst & Quantitative Rationale:</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                      {item.analyst}
                    </p>
                  </div>

                  {/* Real World Example */}
                  <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 flex items-start space-x-2.5">
                    <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Indian Market Context:</strong> {item.example}
                    </div>
                  </div>
                </div>

                {/* Footer Action to open Deep Dive Drawer */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate max-w-[200px]">{item.scheduleIIIPath}</span>
                  </span>

                  <button
                    onClick={() => setActiveDetailConcept(item)}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-800/70 font-semibold transition-all flex items-center space-x-1 cursor-pointer shrink-0"
                  >
                    <span>Forensic Deep Dive</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: INTERACTIVE QUANT CALCULATORS                     */}
      {/* ======================================================== */}
      {activeTab === 'calculators' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-2">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-cyan-400" />
              <span>Interactive Quantitative Valuation & Solvency Sandboxes</span>
            </h3>
            <p className="text-xs text-slate-400">
              Adjust balance sheet variables in real-time to observe dynamic changes in ROCE, Piotroski F-Score health, Altman Z-Score solvency, DuPont 3-stage ROE, and PEG multiples.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. ROCE CALCULATOR */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    Capital Efficiency
                  </span>
                  <h4 className="text-base font-bold text-white mt-1">ROCE Interactive Sandbox</h4>
                </div>
                <div className="text-right font-mono">
                  <div className="text-[10px] text-slate-400">Resulting ROCE</div>
                  <div className={`text-2xl font-black ${Number(calculatedRoce) >= 18 ? 'text-emerald-400' : Number(calculatedRoce) >= 12 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {calculatedRoce}%
                  </div>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>EBIT (Operating Profit)</span>
                    <span className="text-cyan-300 font-bold">₹{roceEbit} Cr</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={1000}
                    step={10}
                    value={roceEbit}
                    onChange={(e) => setRoceEbit(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Total Balance Sheet Assets</span>
                    <span className="text-cyan-300 font-bold">₹{roceAssets} Cr</span>
                  </div>
                  <input
                    type="range"
                    min={200}
                    max={5000}
                    step={50}
                    value={roceAssets}
                    onChange={(e) => setRoceAssets(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Current Liabilities</span>
                    <span className="text-cyan-300 font-bold">₹{roceCurrLiab} Cr</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={Math.min(roceAssets - 50, 2000)}
                    step={25}
                    value={roceCurrLiab}
                    onChange={(e) => setRoceCurrLiab(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300">
                <div className="font-semibold text-white mb-0.5">Analyst Verdict:</div>
                {Number(calculatedRoce) >= 20 ? (
                  <span className="text-emerald-400">Pristine Capital Efficiency — The business generates strong economic value above the weighted average cost of capital (WACC).</span>
                ) : Number(calculatedRoce) >= 12 ? (
                  <span className="text-amber-400">Moderate Efficiency — Meets baseline industrial return hurdle but has limited pricing moat.</span>
                ) : (
                  <span className="text-rose-400">Sub-Optimal Efficiency — Capital return is below standard industrial cost of capital.</span>
                )}
              </div>
            </div>

            {/* 2. PIOTROSKI 9-CHECKLIST EVALUATOR */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                    Forensic Health
                  </span>
                  <h4 className="text-base font-bold text-white mt-1">Piotroski 9-Point Evaluator</h4>
                </div>
                <div className="text-right font-mono">
                  <div className="text-[10px] text-slate-400">Composite F-Score</div>
                  <div className={`text-2xl font-black ${fScoreValue >= 7 ? 'text-emerald-400' : fScoreValue >= 4 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {fScoreValue} / 9
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries({
                  positiveRoa: 'Positive Net ROA',
                  positiveCfo: 'Positive Cash from Operations',
                  cfoGreaterThanPat: 'OCF exceeds Reported PAT',
                  increasingRoa: 'ROA Improved YoY',
                  decreasingLeverage: 'Long-term Debt Reduced',
                  increasingCurrentRatio: 'Current Ratio Improved',
                  noDilution: 'Zero Equity Dilution (No Warrants)',
                  increasingGrossMargin: 'Gross Margin Expanded',
                  increasingAssetTurnover: 'Asset Turnover Improved'
                }).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setFScoreChecks(prev => ({ ...prev, [key]: !prev[key] }))}
                    className={`p-2 rounded-xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                      fScoreChecks[key]
                        ? 'bg-emerald-950/40 border-emerald-700 text-emerald-200'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    <span className="text-[11px] font-medium truncate">{label}</span>
                    <span className="font-mono font-bold text-xs">{fScoreChecks[key] ? '✓ (+1)' : '✗ (0)'}</span>
                  </button>
                ))}
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300">
                <div className="font-semibold text-white mb-0.5">Piotroski Classification:</div>
                {fScoreValue >= 8 ? (
                  <span className="text-emerald-400">Top Decile Quality (8-9) — Pristine fundamental momentum with zero earnings manipulation.</span>
                ) : fScoreValue >= 5 ? (
                  <span className="text-amber-400">Average Stability (5-7) — Moderate fundamental health; monitor cash conversion metrics.</span>
                ) : (
                  <span className="text-rose-400">High Fundamental Fragility (0-4) — Severe distress risk or aggressive revenue accruals.</span>
                )}
              </div>
            </div>

            {/* 3. DUPONT 3-STAGE DECOMPOSITION */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-purple-400 uppercase bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                    Quality of ROE
                  </span>
                  <h4 className="text-base font-bold text-white mt-1">DuPont 3-Stage ROE Simulator</h4>
                </div>
                <div className="text-right font-mono">
                  <div className="text-[10px] text-slate-400">Computed ROE</div>
                  <div className="text-2xl font-black text-cyan-300">{calculatedRoe}%</div>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>(1) Net Profit Margin (Moat)</span>
                    <span className="text-cyan-300 font-bold">{dpNetMargin}%</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={40}
                    step={1}
                    value={dpNetMargin}
                    onChange={(e) => setDpNetMargin(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>(2) Asset Turnover (Velocity)</span>
                    <span className="text-cyan-300 font-bold">{dpAssetTurnover}x</span>
                  </div>
                  <input
                    type="range"
                    min={0.2}
                    max={3.0}
                    step={0.1}
                    value={dpAssetTurnover}
                    onChange={(e) => setDpAssetTurnover(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>(3) Financial Leverage (Assets/Equity)</span>
                    <span className="text-purple-300 font-bold">{dpLeverage}x</span>
                  </div>
                  <input
                    type="range"
                    min={1.0}
                    max={4.5}
                    step={0.1}
                    value={dpLeverage}
                    onChange={(e) => setDpLeverage(Number(e.target.value))}
                    className="w-full accent-purple-400 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300">
                <div className="font-semibold text-white mb-0.5">DuPont Driver Analysis:</div>
                {dpLeverage > 2.8 ? (
                  <span className="text-rose-400">High Financial Leverage Warning — ROE is inflated by debt rather than true operational pricing power.</span>
                ) : dpNetMargin >= 15 ? (
                  <span className="text-emerald-400">High-Moat Quality — Driven primarily by strong net operating margins and asset efficiency.</span>
                ) : (
                  <span className="text-cyan-300">Asset-Velocity Driven — Typical for high-volume retail, manufacturing, or distribution franchises.</span>
                )}
              </div>
            </div>

            {/* 4. ALTMAN Z-SCORE SOLVENCY GAUGE */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Solvency Risk
                  </span>
                  <h4 className="text-base font-bold text-white mt-1">Altman Z-Score Solvency Radar</h4>
                </div>
                <div className="text-right font-mono">
                  <div className="text-[10px] text-slate-400">Altman Z-Score</div>
                  <div className={`text-2xl font-black ${Number(zScoreValue) >= 2.99 ? 'text-emerald-400' : Number(zScoreValue) >= 1.81 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {zScoreValue}
                  </div>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Working Capital / Total Assets</span>
                    <span className="text-cyan-300 font-bold">{(zWorkingCap / zTotalAssets).toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={-200}
                    max={600}
                    step={25}
                    value={zWorkingCap}
                    onChange={(e) => setZWorkingCap(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Market Cap / Total Liabilities</span>
                    <span className="text-cyan-300 font-bold">{(zMarketEquity / zTotalLiabilities).toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={200}
                    max={3000}
                    step={100}
                    value={zMarketEquity}
                    onChange={(e) => setZMarketEquity(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>EBIT / Total Assets</span>
                    <span className="text-cyan-300 font-bold">{(zEbit / zTotalAssets).toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={400}
                    step={10}
                    value={zEbit}
                    onChange={(e) => setZEbit(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300">
                <div className="font-semibold text-white mb-0.5">Solvency Zone:</div>
                {Number(zScoreValue) >= 2.99 ? (
                  <span className="text-emerald-400">Safe Green Zone (Z &gt; 2.99) — Negligible risk of debt default or insolvency over the next 24 months.</span>
                ) : Number(zScoreValue) >= 1.81 ? (
                  <span className="text-amber-400">Grey Warning Zone (1.81 - 2.99) — Moderate buffer; monitor debt rollover schedules and interest coverage.</span>
                ) : (
                  <span className="text-rose-400">Distress Red Zone (Z &lt; 1.81) — High statistical probability of balance sheet distress.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: FORENSIC ACCOUNTING RED FLAGS                     */}
      {/* ======================================================== */}
      {activeTab === 'forensics' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-2">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>10 Critical Forensic Accounting Red Flags & Manipulation Audits</span>
            </h3>
            <p className="text-xs text-slate-400">
              Institutional screening rules to detect earnings manipulation, hidden debt leverage, and governance breakdowns in Indian corporate filings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forensicTraps.map((trap, idx) => (
              <div 
                key={idx}
                className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 space-y-3 shadow-xl transition-all"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <span className="text-amber-400 font-mono">⚠️</span>
                    <span>{trap.title}</span>
                  </h4>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-rose-400 font-semibold block font-mono text-[11px]">Red-Flag Trigger Threshold:</span>
                    <p className="text-slate-300 mt-0.5">{trap.danger}</p>
                  </div>

                  <div>
                    <span className="text-amber-300 font-semibold block font-mono text-[11px]">Underlying Manipulation Mechanism:</span>
                    <p className="text-slate-300 mt-0.5 leading-relaxed">{trap.mechanism}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center space-x-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{trap.scheduleIII}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: INSTITUTIONAL METRIC CHEATSHEET                   */}
      {/* ======================================================== */}
      {activeTab === 'cheatsheet' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-2">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Table className="w-5 h-5 text-cyan-400" />
              <span>Institutional Metric Cheatsheet & Schedule III Mapping</span>
            </h3>
            <p className="text-xs text-slate-400">
              Quick reference guide for threshold safety benchmarks, mathematical formulas, and exact balance sheet locations.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 font-mono uppercase tracking-wider text-[11px] text-slate-400">
                    <th className="py-4 px-5 min-w-[200px]">Metric / Factor</th>
                    <th className="py-4 px-4 min-w-[120px]">Category</th>
                    <th className="py-4 px-4 min-w-[140px]">Safe Institutional Range</th>
                    <th className="py-4 px-4 min-w-[140px]">Danger Red Zone</th>
                    <th className="py-4 px-5 min-w-[260px]">Formula</th>
                    <th className="py-4 px-5 min-w-[260px]">Schedule III Annual Report Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono">
                  {concepts.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-5 font-sans font-bold text-white">
                        {c.term}
                      </td>
                      <td className="py-3.5 px-4 text-cyan-400">
                        {c.category}
                      </td>
                      <td className="py-3.5 px-4 text-emerald-400 font-semibold">
                        {c.goodBenchmark}
                      </td>
                      <td className="py-3.5 px-4 text-rose-400 font-semibold">
                        {c.dangerBenchmark}
                      </td>
                      <td className="py-3.5 px-5 text-slate-300 text-[11px]">
                        {c.formula}
                      </td>
                      <td className="py-3.5 px-5 font-sans text-slate-400 text-[11px]">
                        {c.scheduleIIIPath}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DEEP DIVE FORENSIC MODAL / DRAWER                        */}
      {/* ======================================================== */}
      {activeDetailConcept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">
                  {activeDetailConcept.category} Module
                </span>
                <h3 className="text-lg font-bold text-white mt-1.5">{activeDetailConcept.term}</h3>
              </div>
              <button
                onClick={() => setActiveDetailConcept(null)}
                className="p-1.5 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1 font-mono">
                <span className="text-slate-400 text-[11px] block">Exact Quantitative Formula:</span>
                <span className="text-cyan-300 font-bold text-sm">{activeDetailConcept.formula}</span>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-white text-sm">Detailed Institutional Context</span>
                <p className="text-slate-300 leading-relaxed font-sans">{activeDetailConcept.analyst}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="bg-emerald-950/40 border border-emerald-800 p-3 rounded-xl">
                  <span className="text-slate-400 text-[10px] block">Institutional Safe Standard</span>
                  <span className="text-emerald-300 font-bold">{activeDetailConcept.goodBenchmark}</span>
                </div>
                <div className="bg-rose-950/40 border border-rose-800 p-3 rounded-xl">
                  <span className="text-slate-400 text-[10px] block">Critical Danger Zone</span>
                  <span className="text-rose-300 font-bold">{activeDetailConcept.dangerBenchmark}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-amber-400 text-sm flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Key Forensic Red Flags to Audit:</span>
                </span>
                <ul className="space-y-1.5 pl-2">
                  {activeDetailConcept.redFlags.map((flag, idx) => (
                    <li key={idx} className="text-slate-300 flex items-start space-x-2">
                      <span className="text-rose-400 font-bold font-mono">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 font-mono text-[11px]">
                <strong className="text-slate-200">Schedule III Filing Source:</strong> {activeDetailConcept.scheduleIIIPath}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveDetailConcept(null)}
                className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Close Deep Dive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
