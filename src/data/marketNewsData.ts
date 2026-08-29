export interface OfficialExchangeNews {
  id: string;
  source: 'NSE' | 'BSE' | 'SEBI' | 'CORPORATE';
  title: string;
  symbol: string;
  companyName: string;
  filingRef: string;
  category: 'Order Win' | 'Capex Expansion' | 'Financial Results' | 'Board Action' | 'Block Deal' | 'Credit Rating' | 'PLI Approval';
  impact: 'HIGH_POSITIVE' | 'POSITIVE' | 'NEUTRAL' | 'HIGH_VOLATILITY';
  summary: string;
  keyHighlights: string[];
  timestamp: string;
  timeAgo: string;
  isVerified: boolean;
  docUrl?: string;
}

export interface MarketGuruSuggestion {
  id: string;
  guruName: string;
  designation: string;
  guruAvatar: string;
  stockSymbol: string;
  stockName: string;
  stance: 'ACCUMULATE' | 'STRONG_BUY' | 'HIGH_CONVICTION' | 'LONG_TERM_COMPOUNDER';
  investmentHorizon: string;
  themeOrSector: string;
  coreThesis: string;
  keyCatalysts: string[];
  sourceMedia: string;
  sourceDate: string;
  approxHoldingPct?: string;
  convictionScore: number; // 0 - 100
}

export interface SocialMediaSignal {
  id: string;
  platform: 'Twitter / X' | 'Reddit (r/IndianStreetBets)' | 'YouTube Research' | 'Telegram Channel';
  handleOrChannel: string;
  authorReputation: 'VERIFIED_ANALYST' | 'SEBI_REGISTERED_RA' | 'COMMUNITY_TOP_CONTRIBUTOR' | 'QUANT_DESK';
  targetSymbol: string;
  targetCompany: string;
  postContent: string;
  sentiment: 'BULLISH' | 'HIGHLY_BULLISH' | 'NEUTRAL' | 'CAUTIOUS';
  socialEngagement: {
    likesOrUpvotes: number;
    sharesOrRetweets: number;
    commentsCount: number;
  };
  trendingHashtags: string[];
  quantScoreVsHype: {
    aiQuantScore: number;
    socialHypeScore: number;
    divergenceAlert: 'ALIGNED' | 'UNDERVALUED_BY_CROWD' | 'OVERHYPED_RETAIL';
  };
  timeAgo: string;
}

export const OFFICIAL_EXCHANGE_NEWS: OfficialExchangeNews[] = [
  {
    id: 'news-1',
    source: 'NSE',
    title: 'Bharat Electronics bags ₹2,670 Cr order for next-gen Air Defense Fire Control Radars',
    symbol: 'BEL',
    companyName: 'Bharat Electronics Ltd',
    filingRef: 'NSE/LIST/C/2026/0824/BEL',
    category: 'Order Win',
    impact: 'HIGH_POSITIVE',
    summary: 'The Ministry of Defence has awarded BEL a major turnkey contract for indigenous 3D surveillance and fire-control radar systems with complete indigenous software algorithms.',
    keyHighlights: [
      'Total contract value ₹2,670 Cr executable over 36 months',
      'Indigenous content exceeds 82% under Atmanirbhar Bharat mandate',
      'Gross order book position now stands above ₹78,500 Cr'
    ],
    timestamp: '2026-08-28 10:45 AM',
    timeAgo: '18 mins ago',
    isVerified: true,
    docUrl: 'https://nsearchives.nseindia.com'
  },
  {
    id: 'news-2',
    source: 'BSE',
    title: 'Kaynes Technology commences commercial production at Sanand Semiconductor OSAT plant',
    symbol: 'KAYNES',
    companyName: 'Kaynes Technology India Ltd',
    filingRef: 'BSE/SCRIP/543664/DISCL',
    category: 'Capex Expansion',
    impact: 'HIGH_POSITIVE',
    summary: 'Kaynes Semicon Private Limited has successfully powered up its advanced high-density multi-chip packaging lines under the India Semiconductor Mission (ISM) subsidy framework.',
    keyHighlights: [
      'Sanand facility capacity rated at 6 million chips per day',
      'Secured supply contracts with top 3 automotive Tier-1 ECUs',
      'Receiving 50% central fiscal support + 20% state incentive'
    ],
    timestamp: '2026-08-28 09:30 AM',
    timeAgo: '1 hr ago',
    isVerified: true
  },
  {
    id: 'news-3',
    source: 'NSE',
    title: 'Tata Motors EV subsidiary achieves 150,000 unit annual production run-rate at Sanand plant',
    symbol: 'TATAMOTORS',
    companyName: 'Tata Motors Ltd',
    filingRef: 'NSE/LIST/CORP/2026/0828/TATAMOTORS',
    category: 'Capex Expansion',
    impact: 'POSITIVE',
    summary: 'TPEML reports record EV penetration reaching 16.4% of total passenger vehicle volumes driven by Curvv EV and Nexon EV LR deliveries.',
    keyHighlights: [
      'Localization of battery pack modules reaches 88%',
      'Exports to European markets to commence in Q3 FY27',
      'EBITDA margin in passenger EV division turned positive at 7.2%'
    ],
    timestamp: '2026-08-28 08:50 AM',
    timeAgo: '2 hrs ago',
    isVerified: true
  },
  {
    id: 'news-4',
    source: 'NSE',
    title: 'Premier Energies secures ₹1,140 Cr TOPCon Solar Module supply agreement from SECI partner',
    symbol: 'PREMIERENE',
    companyName: 'Premier Energies Ltd',
    filingRef: 'NSE/LIST/C/2026/0827/PREMIERENE',
    category: 'Order Win',
    impact: 'HIGH_POSITIVE',
    summary: 'Premier Energies signs binding supply pact for 650 MW N-type TOPCon bifacial modules for an ultra-mega solar park in Rajasthan.',
    keyHighlights: [
      'Module delivery scheduled between October 2026 and March 2027',
      'Average module conversion efficiency certified at 22.8%',
      'Order pipeline exceeds 5.2 GW across domestic and export markets'
    ],
    timestamp: '2026-08-28 07:15 AM',
    timeAgo: '4 hrs ago',
    isVerified: true
  },
  {
    id: 'news-5',
    source: 'SEBI',
    title: 'SEBI clears revised index inclusion norms for High-Growth Technology & Manufacturing stocks',
    symbol: 'TCS',
    companyName: 'Tata Consultancy Services Ltd',
    filingRef: 'SEBI/HO/MRD/CIR/2026/14',
    category: 'Board Action',
    impact: 'POSITIVE',
    summary: 'SEBI and NSE Indices introduce updated free-float liquidity criteria, enabling faster index weight adjustments for profitable AI, OSAT, and renewable companies.',
    keyHighlights: [
      'Improves passive FII tracking inflows for top 50 momentum equities',
      'Mandatory algorithmic surveillance against circular trading and pump schemes',
      'Effective date slated for September quarterly rebalancing'
    ],
    timestamp: '2026-08-27 06:30 PM',
    timeAgo: 'Yesterday',
    isVerified: true
  },
  {
    id: 'news-6',
    source: 'BSE',
    title: 'CRISIL upgrades long-term debt rating of Dixon Technologies to AAA/Stable',
    symbol: 'DIXON',
    companyName: 'Dixon Technologies (India) Ltd',
    filingRef: 'BSE/SCRIP/540699/RATING',
    category: 'Credit Rating',
    impact: 'POSITIVE',
    summary: 'Rating agency cites robust operating leverage, debt-free balance sheet, and dominant 40%+ market share in domestic smartphone manufacturing as primary upgrade drivers.',
    keyHighlights: [
      'Debt-to-Equity maintained at 0.08x with high liquidity buffers',
      'RoCE expanded to 27.4% on high asset turnover of 4.8x',
      'Component localization roadmap progressing ahead of PLI schedules'
    ],
    timestamp: '2026-08-27 04:15 PM',
    timeAgo: 'Yesterday',
    isVerified: true
  },
  {
    id: 'news-7',
    source: 'NSE',
    title: 'Tata Elxsi partners with leading Global Tier-1 for Software-Defined Vehicle (SDV) platform',
    symbol: 'TATAELXSI',
    companyName: 'Tata Elxsi Ltd',
    filingRef: 'NSE/LIST/C/2026/0827/TATAELXSI',
    category: 'Order Win',
    impact: 'HIGH_POSITIVE',
    summary: 'Tata Elxsi chosen as prime engineering partner to architect next-generation AUTOSAR adaptive middleware and autonomous driving L2+ vision algorithms.',
    keyHighlights: [
      'Multi-year engagement estimated at $65M over 4 years',
      'Integration of proprietary AIVA AI testing suites',
      'Reinforces leadership in high-margin transportation R&D'
    ],
    timestamp: '2026-08-27 02:20 PM',
    timeAgo: 'Yesterday',
    isVerified: true
  }
];

export const MARKET_GURU_SUGGESTIONS: MarketGuruSuggestion[] = [
  {
    id: 'guru-1',
    guruName: 'Vijay Kedia',
    designation: 'Managing Director, Kedia Securities • Ace Investor',
    guruAvatar: 'VK',
    stockSymbol: 'KAYNES',
    stockName: 'Kaynes Technology India Ltd',
    stance: 'STRONG_BUY',
    investmentHorizon: '3 - 5 Years (Compounder)',
    themeOrSector: 'Semiconductors & OSAT / EMS',
    coreThesis: 'India is entering the golden era of electronics manufacturing and chip packaging. Companies with proven high-density cleanroom execution and sticky aerospace-grade defense clients will see explosive multi-year margin expansion.',
    keyCatalysts: [
      'Sanand OSAT commercialization is a massive structural game changer',
      'Backward integration into PCB fabrication and box-build assembly',
      'Order book growing at >45% CAGR with 14%+ EBITDA margins'
    ],
    sourceMedia: 'CNBC-TV18 Market Masters Interview & BSE Shareholding Pattern',
    sourceDate: 'August 2026',
    approxHoldingPct: '2.14% Stake',
    convictionScore: 94
  },
  {
    id: 'guru-2',
    guruName: 'Radhakishan Damani',
    designation: 'Founder, DMart • Veteran Value Investor',
    guruAvatar: 'RKD',
    stockSymbol: 'BEL',
    stockName: 'Bharat Electronics Ltd',
    stance: 'LONG_TERM_COMPOUNDER',
    investmentHorizon: '5+ Years',
    themeOrSector: 'Defence Electronics & Radars',
    coreThesis: 'Public Sector champions with net cash balance sheets, zero debt, and multi-year sovereign order backlogs offer immense margin of safety with structural upside from military indigenization.',
    keyCatalysts: [
      'Zero debt balance sheet with ₹8,500+ Cr treasury surplus',
      'Virtually impenetrable moat in naval sonar and electronic warfare',
      'Consistent ROCE above 26% and steady dividend payout ratios'
    ],
    sourceMedia: 'Public Portfolio Filing & Annual General Meeting Remarks',
    sourceDate: 'Q1 FY27 Disclosures',
    approxHoldingPct: 'Institutional / HNIs Holdings',
    convictionScore: 96
  },
  {
    id: 'guru-3',
    guruName: 'Ashish Kacholia',
    designation: 'Ace Micro/Small-Cap Investor • Lucky Investments',
    guruAvatar: 'AK',
    stockSymbol: 'PREMIERENE',
    stockName: 'Premier Energies Ltd',
    stance: 'ACCUMULATE',
    investmentHorizon: '2 - 4 Years',
    themeOrSector: 'Solar Cells & Renewable Infrastructure',
    coreThesis: 'The transition from basic assembly to high-efficiency N-Type TOPCon cells inside India creates a structural moat against dumping. Pure-play cell manufacturers with PLI tranche II allocation will capture supernormal returns.',
    keyCatalysts: [
      'Fully integrated cell-to-module lines in Hyderabad',
      'ALMM mandatory domestic content list protection from Govt of India',
      'Global export diversification to US and European utility developers'
    ],
    sourceMedia: 'ET Now Wealth Creators Conclave & Bulk Deal Disclosures',
    sourceDate: 'August 2026',
    approxHoldingPct: '1.85% Stake',
    convictionScore: 91
  },
  {
    id: 'guru-4',
    guruName: 'Saurabh Mukherjea',
    designation: 'Founder & CIO, Marcellus Investment Managers',
    guruAvatar: 'SM',
    stockSymbol: 'TCS',
    stockName: 'Tata Consultancy Services Ltd',
    stance: 'HIGH_CONVICTION',
    investmentHorizon: '5 - 10 Years Compounder',
    themeOrSector: 'Enterprise AI & Cloud Infrastructure',
    coreThesis: 'In times of technological disruption, fortress cashflow generators with unmatched client intimacy, 40%+ return on equity, and massive internal retraining capacity win the enterprise AI modernization contracts.',
    keyCatalysts: [
      'Enterprise AI pipelines surpassed $1.5B in active annual bookings',
      'Highest operating margins (26%+) among global IT peers',
      'Consistent 100% free cash flow conversion into dividends and buybacks'
    ],
    sourceMedia: 'Marcellus Global Newsletter & Thought Leadership Series',
    sourceDate: 'August 2026',
    approxHoldingPct: 'Core Fund Allocation',
    convictionScore: 89
  },
  {
    id: 'guru-5',
    guruName: 'Ramesh Damani',
    designation: 'Member, BSE • Veteran Market Strategist',
    guruAvatar: 'RD',
    stockSymbol: 'TATAMOTORS',
    stockName: 'Tata Motors Ltd',
    stance: 'STRONG_BUY',
    investmentHorizon: '3 - 5 Years',
    themeOrSector: 'Electric Vehicles & Global Mobility',
    coreThesis: 'The corporate demerger separating commercial vehicles from passenger EV/JLR unlocks deep hidden value. JLR cash generation is funding the entire Indian EV charging and localized skateboard ecosystem.',
    keyCatalysts: [
      'Demerger unlocks pure-play value for international institutional investors',
      'Dominant 65%+ market share in domestic Indian passenger EVs',
      'Net automotive debt eliminated with record free cash flows'
    ],
    sourceMedia: 'BSE Strategy Forum & National Financial Media Roundtables',
    sourceDate: 'August 2026',
    approxHoldingPct: 'High-Conviction Track',
    convictionScore: 92
  },
  {
    id: 'guru-6',
    guruName: 'Porinju Veliyath',
    designation: 'MD & Portfolio Manager, Equity Intelligence',
    guruAvatar: 'PV',
    stockSymbol: 'DIXON',
    stockName: 'Dixon Technologies (India) Ltd',
    stance: 'HIGH_CONVICTION',
    investmentHorizon: '2 - 3 Years',
    themeOrSector: 'Consumer Tech & Mobile Hardware PLI',
    coreThesis: 'Scale is the ultimate moat in EMS. Dixon has replicated the Hon Hai (Foxconn) playbook in India with precision, capturing global smartphone giants and IT hardware contracts.',
    keyCatalysts: [
      'Joint ventures with global component makers for precision display modules',
      'Massive export ramp-up under revised PLI incentives',
      'Working capital cycle reduced to less than 15 days'
    ],
    sourceMedia: 'Equity Intelligence Client Letter & TV Debate',
    sourceDate: 'July 2026',
    approxHoldingPct: 'Sector Allocation',
    convictionScore: 88
  }
];

export const SOCIAL_MEDIA_SIGNALS: SocialMediaSignal[] = [
  {
    id: 'social-1',
    platform: 'Twitter / X',
    handleOrChannel: '@QuantIndiaAlpha (SEBI Reg. Research)',
    authorReputation: 'SEBI_REGISTERED_RA',
    targetSymbol: 'BEL',
    targetCompany: 'Bharat Electronics Ltd',
    postContent: '$BEL continues to break out on weekly institutional accumulation volumes. Q1 order intake confirms defense electronics runway is safe for the next 5 years. Zero debt, 28% ROCE, 80%+ gross margin on software payloads.',
    sentiment: 'HIGHLY_BULLISH',
    socialEngagement: {
      likesOrUpvotes: 1840,
      sharesOrRetweets: 420,
      commentsCount: 165
    },
    trendingHashtags: ['#DefenceStocks', '#AtmanirbharBharat', '#BEL', '#NiftyQuant'],
    quantScoreVsHype: {
      aiQuantScore: 92,
      socialHypeScore: 78,
      divergenceAlert: 'ALIGNED'
    },
    timeAgo: '25 mins ago'
  },
  {
    id: 'social-2',
    platform: 'Reddit (r/IndianStreetBets)',
    handleOrChannel: 'u/SemiconBulls_DD (Top Contributor)',
    authorReputation: 'COMMUNITY_TOP_CONTRIBUTOR',
    targetSymbol: 'KAYNES',
    targetCompany: 'Kaynes Technology India Ltd',
    postContent: 'Deep Dive on $KAYNES Sanand OSAT Unit 1: Why the market is still mispricing the high-margin multi-die packaging revenue. While EMS trades at 10-12% margins, OSAT chip packaging will yield 22-26% EBITDA. Capex gestation is officially ending.',
    sentiment: 'HIGHLY_BULLISH',
    socialEngagement: {
      likesOrUpvotes: 950,
      sharesOrRetweets: 310,
      commentsCount: 190
    },
    trendingHashtags: ['#Semiconductor', '#Kaynes', '#ISMScheme', '#HighGrowth'],
    quantScoreVsHype: {
      aiQuantScore: 88,
      socialHypeScore: 82,
      divergenceAlert: 'UNDERVALUED_BY_CROWD'
    },
    timeAgo: '1 hr ago'
  },
  {
    id: 'social-3',
    platform: 'YouTube Research',
    handleOrChannel: 'FinTech Quant Desk (450K Subs)',
    authorReputation: 'VERIFIED_ANALYST',
    targetSymbol: 'TATAMOTORS',
    targetCompany: 'Tata Motors Ltd',
    postContent: 'Demerger Valuation Breakdown: What is the fair value of Tata EV + JLR standalone? We model the cashflow curves post-2026. Domestic commercial vehicle cycle is turning up while EV market share stays above 60%.',
    sentiment: 'BULLISH',
    socialEngagement: {
      likesOrUpvotes: 4200,
      sharesOrRetweets: 620,
      commentsCount: 380
    },
    trendingHashtags: ['#TataMotors', '#EVRevolution', '#DemergerValuation'],
    quantScoreVsHype: {
      aiQuantScore: 89,
      socialHypeScore: 85,
      divergenceAlert: 'ALIGNED'
    },
    timeAgo: '3 hrs ago'
  },
  {
    id: 'social-4',
    platform: 'Twitter / X',
    handleOrChannel: '@EnergyTransitionIND',
    authorReputation: 'QUANT_DESK',
    targetSymbol: 'PREMIERENE',
    targetCompany: 'Premier Energies Ltd',
    postContent: 'Solar Cell Pricing Alert: China export rebates reduction + Indian ALMM compliance means domestic TOPCon cell realisations are up 8% QoQ. $PREMIERENE is the purest high-capacity play in this cycle.',
    sentiment: 'BULLISH',
    socialEngagement: {
      likesOrUpvotes: 1220,
      sharesOrRetweets: 280,
      commentsCount: 95
    },
    trendingHashtags: ['#SolarEnergy', '#PremierEnergies', '#GreenCapex'],
    quantScoreVsHype: {
      aiQuantScore: 86,
      socialHypeScore: 72,
      divergenceAlert: 'UNDERVALUED_BY_CROWD'
    },
    timeAgo: '5 hrs ago'
  },
  {
    id: 'social-5',
    platform: 'Telegram Channel',
    handleOrChannel: 'Institutional Flow Tracker (Verified)',
    authorReputation: 'QUANT_DESK',
    targetSymbol: 'TATAELXSI',
    targetCompany: 'Tata Elxsi Ltd',
    postContent: 'FII Block deal in Software-Defined Vehicle space recorded today at 11:15 AM. Over 3.2 lakh shares changed hands at ₹7,480. Structural demand for automotive ECU AI software remains resilient.',
    sentiment: 'NEUTRAL',
    socialEngagement: {
      likesOrUpvotes: 810,
      sharesOrRetweets: 140,
      commentsCount: 52
    },
    trendingHashtags: ['#TataElxsi', '#BlockDeal', '#AutoTech'],
    quantScoreVsHype: {
      aiQuantScore: 82,
      socialHypeScore: 68,
      divergenceAlert: 'ALIGNED'
    },
    timeAgo: '6 hrs ago'
  }
];
