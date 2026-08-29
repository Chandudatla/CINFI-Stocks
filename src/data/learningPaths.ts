export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LearningStep {
  stepNumber: number;
  title: string;
  durationMinutes: number;
  objective: string;
  coreConcepts: string[];
  body: string;
  proTip: string;
  caseStudy: {
    company: string;
    scenario: string;
    takeaway: string;
  };
  quiz: QuizQuestion;
}

export interface LearningTrack {
  id: string;
  trackNumber: number;
  title: string;
  tagline: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Institutional';
  totalSteps: number;
  estimatedMinutes: number;
  iconName: string;
  colorTheme: string;
  steps: LearningStep[];
}

export const LEARNING_TRACKS: LearningTrack[] = [
  {
    id: 'track-1-fundamentals',
    trackNumber: 1,
    title: 'Financial Statements & Balance Sheet Forensics',
    tagline: 'Master the 3 financial statements and learn to verify real business cash generation.',
    level: 'Beginner',
    totalSteps: 4,
    estimatedMinutes: 25,
    iconName: 'BookOpen',
    colorTheme: 'cyan',
    steps: [
      {
        stepNumber: 1,
        title: 'Decoding the P&L Statement: Revenue, EBITDA & Real PAT',
        durationMinutes: 6,
        objective: 'Understand how top-line sales transform into bottom-line earnings and where profits can be distorted.',
        coreConcepts: ['Top-Line Revenue', 'EBITDA Margin', 'Depreciation & Amortization', 'PAT & Diluted EPS'],
        body: `The Profit & Loss (P&L) statement reflects a company's operational performance over a specific financial period (Quarterly or Annual). 
        
Key Flow:
1. **Revenue from Operations**: Gross billings minus GST/excise. Look for organic volume growth versus mere price hikes.
2. **Operating Expenses**: Raw materials (COGS), employee expenses, and manufacturing costs.
3. **EBITDA**: Core operating cash profit. A stable or expanding EBITDA margin (>18-25%) indicates pricing power and cost discipline.
4. **Depreciation & Finance Costs**: Non-cash asset wear & tear, plus interest paid on debt.
5. **Profit After Tax (PAT) & Diluted EPS**: Net bottom-line available to shareholders.`,
        proTip: 'Always check "Other Income". If PAT is high only because of one-off property sales or treasury gains, the core operating business may be stalling.',
        caseStudy: {
          company: 'Indian IT Sector (e.g. TCS/Infosys)',
          scenario: 'High EBITDA margins (24-27%) with negligible raw material costs and almost zero long-term debt allow majority of EBIT to flow directly into net profit and cash reserves.',
          takeaway: 'High operating margin businesses with low debt convert higher percentage of revenue to shareholder wealth.'
        },
        quiz: {
          question: 'If a company reports high Net Profit (PAT) growth but its Operating Profit (EBITDA) is declining, what is the most likely cause?',
          options: [
            'Exceptional one-time gains or non-operating other income',
            'Strong product pricing power',
            'Rapid organic market share expansion',
            'Reduction in raw material costs'
          ],
          correctIndex: 0,
          explanation: 'When PAT rises while EBITDA falls, the growth is usually driven by non-recurring items like asset sales, tax write-backs, or treasury gains rather than core business operations.'
        }
      },
      {
        stepNumber: 2,
        title: 'Balance Sheet Mastery: Assets, Debt & CWIP Traps',
        durationMinutes: 7,
        objective: 'Learn how to evaluate balance sheet solvency, working capital health, and capital investments.',
        coreConcepts: ['Equity vs Debt', 'Working Capital', 'Capital Work-In-Progress (CWIP)', 'Debt-to-Equity'],
        body: `The Balance Sheet is a snapshot of financial strength at a specific date.

Critical Balance Sheet Sections:
• **Shareholders Equity & Reserves**: Total net worth accumulated over years.
• **Borrowings (Debt)**: Distinguish between Long-Term Borrowings (for factories) and Short-Term Borrowings (for working capital). Debt-to-Equity should ideally be under 0.5x.
• **Capital Work-In-Progress (CWIP)**: Money invested into ongoing factory projects.
• **Trade Receivables & Inventory**: Working capital locked in customer dues and warehouse stock.`,
        proTip: 'Beware of "Asset-Liability Mismatch"—using short-term bank overdrafts to fund long-term factory construction is a major cause of corporate insolvency.',
        caseStudy: {
          company: 'Premier Energies / Kaynes',
          scenario: 'Rapid capacity scale-up in solar and semiconductor electronics requires significant capital expenditure. Successful execution transitions CWIP smoothly into operational Gross Fixed Assets without debt distress.',
          takeaway: 'Monitor CWIP commissioning timelines; assets that start commercial production quickly generate revenue to service capex debt.'
        },
        quiz: {
          question: 'What is a significant forensic warning sign regarding Capital Work-in-Progress (CWIP)?',
          options: [
            'CWIP is swiftly capitalized into commercial production within 12 months',
            'CWIP remains stagnant and uncommissioned for over 3 years without revenue generation',
            'CWIP is funded entirely by internal cash accruals',
            'CWIP decreases as new manufacturing lines go live'
          ],
          correctIndex: 1,
          explanation: 'Stagnant CWIP for extended periods often masks failed or stalled projects, capital cost overruns, or improper capitalization of operational expenses.'
        }
      },
      {
        stepNumber: 3,
        title: 'Cash Flow Statement: The Ultimate Reality Check',
        durationMinutes: 6,
        objective: 'Differentiate between accounting accounting accruals and cold hard cash in the bank.',
        coreConcepts: ['Cash from Operations (CFO)', 'Free Cash Flow (FCF)', 'EBITDA to CFO Conversion', 'CAPEX'],
        body: `Revenue and PAT are accounting opinions; Cash Flow is a certified fact.

The Three Cash Flow Streams:
1. **Cash from Operations (CFO)**: The actual cash generated by selling goods and collecting payments after paying suppliers, employees, and direct taxes.
2. **Cash from Investing (CFI)**: Capital expenditure (CAPEX) for new plants and machinery.
3. **Cash from Financing (CFF)**: Dividends paid, debt raised or repaid, and share buybacks.

**Free Cash Flow (FCF)** = CFO - Capital Expenditures (CAPEX). Sustained positive FCF is the lifeblood of dividend payouts and self-funded growth.`,
        proTip: 'Look for CFO / EBITDA > 75-80%. If CFO is persistently negative while PAT is positive for 3 consecutive years, run away!',
        caseStudy: {
          company: 'High-Growth Manufacturing vs Cash Bleeders',
          scenario: 'Aggressive companies book high paper profits by granting 180-day credit to dealers, causing Trade Receivables to balloon while actual CFO turns negative.',
          takeaway: 'Healthy businesses collect customer cash within 45-60 days and convert operating profits directly into cash.'
        },
        quiz: {
          question: 'How is Free Cash Flow (FCF) calculated?',
          options: [
            'Total Revenue minus Cost of Goods Sold',
            'Net Profit After Tax plus Depreciation',
            'Cash Flow from Operations (CFO) minus Capital Expenditure (CAPEX)',
            'EBITDA multiplied by Price-to-Earnings Ratio'
          ],
          correctIndex: 2,
          explanation: 'Free Cash Flow is the residual surplus cash generated from core operations after funding the maintenance and growth capital expenditures (CFO - CAPEX).'
        }
      },
      {
        stepNumber: 4,
        title: 'Capital Efficiency: ROCE vs ROE and Why ROCE is King',
        durationMinutes: 6,
        objective: 'Discover why institutional fund managers prioritize ROCE over ROE to identify true business moats.',
        coreConcepts: ['ROCE Formula', 'ROE vs ROCE', 'Cost of Capital (WACC)', 'Economic Value Added (EVA)'],
        body: `Return on Capital Employed (ROCE) measures how efficiently a company allocates all capital at its disposal—both equity and debt.

**Formula**: ROCE = EBIT ÷ (Total Assets - Current Liabilities) × 100

Why ROCE Trumps ROE:
• **ROE can be artificially inflated with debt**: A company with ₹10 Cr equity and ₹90 Cr debt making ₹5 Cr profit shows a 50% ROE, but carries huge insolvency risk.
• **ROCE evaluates operational prowess**: It measures returns on the entire ₹100 Cr capital pool regardless of financing structure.`,
        proTip: 'A great business consistently earns ROCE > 20% while reinvesting retained profits back into high-return expansion projects.',
        caseStudy: {
          company: 'Bharat Electronics (BEL) / CDSL',
          scenario: 'BEL generates ~28% ROCE with near zero debt, extracting strong operational profits from sovereign defense contracts with disciplined asset turnover.',
          takeaway: 'High ROCE businesses create compounding flywheels because each rupee retained can be reinvested at premium rates.'
        },
        quiz: {
          question: 'Why can Return on Equity (ROE) sometimes give a misleadingly high impression of business quality?',
          options: [
            'ROE ignores income tax payments',
            'ROE can be magnified artificially by taking on massive debt leverage',
            'ROE only measures short-term inventory turns',
            'ROE is calculated using market capitalization instead of book value'
          ],
          correctIndex: 1,
          explanation: 'Because Equity is in the denominator of ROE, taking on heavy debt reduces the equity base and can artificially inflate ROE even when core operating efficiency is mediocre.'
        }
      }
    ]
  },
  {
    id: 'track-2-valuation-moats',
    trackNumber: 2,
    title: 'Valuation Multiples, Growth PEG & DuPont Moats',
    tagline: 'Learn how to value equities accurately, spot cyclical value traps, and dissect ROE drivers.',
    level: 'Intermediate',
    totalSteps: 4,
    estimatedMinutes: 28,
    iconName: 'Activity',
    colorTheme: 'indigo',
    steps: [
      {
        stepNumber: 1,
        title: 'P/E, Cyclical Earnings & The PEG Growth Rule',
        durationMinutes: 7,
        objective: 'Master P/E multiple valuation and understand when high P/E is justified by PEG growth.',
        coreConcepts: ['Trailing P/E vs Forward P/E', 'PEG Ratio', 'Cyclical Peak P/E Trap', 'Earnings Normalization'],
        body: `Price-to-Earnings (P/E) tells you how much the market is willing to pay for ₹1 of annual net profit.

**The Golden PEG Rule**:
• **PEG Ratio** = P/E Ratio ÷ Expected Annual EPS Growth Rate (%).
• PEG < 1.0 indicates undervalued growth.
• PEG 1.0 – 1.5 indicates fair institutional pricing.
• PEG > 2.5 warns of expensive growth optimism.

**The Commodity / Cyclical Trap**:
At the peak of a steel or sugar commodity cycle, earnings are massive, making P/E appear low (e.g. 5x). Buying at peak cyclical earnings is dangerous as earnings collapse next year!`,
        proTip: 'Always evaluate P/E against historical 5-year medians and adjust for sustainable future EPS growth rather than single-year cyclical spikes.',
        caseStudy: {
          company: 'Tata Motors vs High-Growth EMS',
          scenario: 'Tata Motors trading at 8.4x P/E with expanding JLR EV margins provides strong cyclical value, whereas high-growth tech companies trade at 35-45x P/E justified by 30%+ compounding earnings.',
          takeaway: 'Contextualize P/E with the structural stage of the industry.'
        },
        quiz: {
          question: 'A stock is trading at a P/E of 30x and its earnings are expected to compound at 30% annually. What is its PEG ratio?',
          options: [
            '0.50 (Deep Discount)',
            '1.00 (Fair / Attractive Growth at Reasonable Price)',
            '3.00 (Overpriced)',
            '9.00 (Severe Bubble)'
          ],
          correctIndex: 1,
          explanation: 'PEG = P/E (30) ÷ EPS Growth Rate (30) = 1.00, representing classic GARP (Growth At Reasonable Price).'
        }
      },
      {
        stepNumber: 2,
        title: 'Enterprise Value (EV/EBITDA) & Capital Structure Neutrality',
        durationMinutes: 7,
        objective: 'Understand why institutional M&A and equity analysts rely on EV/EBITDA rather than P/E.',
        coreConcepts: ['Enterprise Value', 'EV/EBITDA Multiple', 'Net Debt Adjustment', 'Cross-Company Comparisons'],
        body: `Enterprise Value (EV) represents the total theoretical takeover price of a company.

**Formula**:
• **EV** = Market Cap + Total Debt + Minority Interest - Cash & Liquid Investments
• **EV/EBITDA** = Enterprise Value ÷ EBITDA

Why EV/EBITDA is superior:
1. Two companies with the same market cap may have vastly different balance sheets (one has ₹5,000 Cr debt, the other has ₹2,000 Cr cash).
2. P/E ignores debt burden; EV/EBITDA accounts for both debt and cash directly.`,
        proTip: 'In capital-heavy industries (Telecom, Power, Capital Goods), always use EV/EBITDA and EV/Capital Employed to eliminate depreciation and leverage distortions.',
        caseStudy: {
          company: 'Telecommunications & Infrastructure Comparison',
          scenario: 'Comparing a debt-heavy utility against a cash-rich engineering firm using P/E gives distorted conclusions; EV/EBITDA normalizes the debt burden instantly.',
          takeaway: 'EV reveals the real enterprise price an acquirer must pay to own 100% of the operating business and its debt.'
        },
        quiz: {
          question: 'What happens to a company’s Enterprise Value (EV) if it uses surplus cash to pay down its long-term debt?',
          options: [
            'EV increases significantly',
            'EV remains essentially unchanged (cash decreases by same amount debt decreases)',
            'EV drops to zero',
            'Market cap immediately doubles'
          ],
          correctIndex: 1,
          explanation: 'Because EV = Market Cap + Debt - Cash, paying down debt using existing cash balances reduces Debt and Cash equally, leaving net EV constant.'
        }
      },
      {
        stepNumber: 3,
        title: 'DuPont 3-Stage Analysis: Dissecting ROE Quality',
        durationMinutes: 7,
        objective: 'Break down ROE into Operating Margin, Asset Turnover, and Financial Leverage.',
        coreConcepts: ['Net Profit Margin (Moat)', 'Asset Turnover (Efficiency)', 'Equity Multiplier (Leverage)', 'DuPont Model'],
        body: `The DuPont model splits ROE into 3 distinct operational and financial levers:

**ROE = (Net Profit Margin) × (Asset Turnover) × (Financial Leverage Multiplier)**
1. **Net Profit Margin** (PAT ÷ Revenue): Measures pricing power and brand moat.
2. **Asset Turnover** (Revenue ÷ Total Assets): Measures how fast assets are sweat to generate sales.
3. **Financial Leverage Multiplier** (Assets ÷ Equity): Measures how much debt is used to magnify returns.

High-quality ROE is driven by high Net Margin and high Asset Turnover, NOT high Leverage!`,
        proTip: 'If a company’s ROE is rising while its Net Profit Margin and Asset Turnover are falling, the return is driven purely by dangerous debt borrowing.',
        caseStudy: {
          company: 'KPIT Technologies vs Leveraged Infrastructure',
          scenario: 'KPIT delivers ~26% ROE through strong operating margin (16%) and high asset turnover with an equity multiplier of just 1.4x (pristine quality).',
          takeaway: 'Prioritize companies that achieve 20%+ ROE with low leverage multipliers (<1.8x).'
        },
        quiz: {
          question: 'According to DuPont 3-Stage analysis, which of the following is the most sustainable and high-quality driver of high ROE?',
          options: [
            'Maximizing the Financial Leverage Multiplier with short-term bank borrowings',
            'Expanding Net Profit Margins through pricing power and high Asset Turnover',
            'Reducing tax provisions by postponing statutory filings',
            'Increasing account receivables days'
          ],
          correctIndex: 1,
          explanation: 'Sustainable ROE is driven by operating excellence (strong margins and asset velocity) rather than financial engineering through debt leverage.'
        }
      },
      {
        stepNumber: 4,
        title: 'Working Capital Cycles & Cash Conversion Cycle (CCC)',
        durationMinutes: 7,
        objective: 'Analyze how fast investments in inventory turn back into liquid cash.',
        coreConcepts: ['Days Inventory Outstanding (DIO)', 'Days Sales Outstanding (DSO)', 'Days Payable Outstanding (DPO)', 'Negative CCC'],
        body: `Working capital velocity determines how much liquidity a business needs to expand.

**Cash Conversion Cycle (CCC)** = DIO (Inventory Days) + DSO (Debtor Days) - DPO (Payable Days)

• **Low / Negative CCC**: Giant retail/FMCG/Auto players collect cash immediately from buyers while paying suppliers in 60-90 days, essentially funding growth using suppliers' money for free!
• **Bloated CCC (>150 Days)**: Traps capital in inventory warehouses and uncollected bills, starving the company of free cash flow.`,
        proTip: 'Look out for sudden jumps in Debtor Days (DSO > 120 days)—it often signals aggressive channel-stuffing or uncollectible receivables.',
        caseStudy: {
          company: 'Auto OEMs vs Trapped Ancillaries',
          scenario: 'Major automotive OEMs operate with near zero or negative working capital cycles, while sub-tier suppliers often bear the burden of extended receivable terms.',
          takeaway: 'Bargaining power in the supply chain directly reflects in a shorter Cash Conversion Cycle.'
        },
        quiz: {
          question: 'What does a Negative Cash Conversion Cycle (CCC) indicate about a company?',
          options: [
            'The company is on the verge of bankruptcy',
            'The company collects cash from customers before it has to pay its suppliers, using supplier capital for free',
            'The company has zero sales revenue',
            'The company cannot obtain short-term bank loans'
          ],
          correctIndex: 1,
          explanation: 'A negative CCC is a sign of immense bargaining power, allowing the business to operate using suppliers\' interest-free credit.'
        }
      }
    ]
  },
  {
    id: 'track-3-forensics',
    trackNumber: 3,
    title: 'Forensic Accounting, Red Flags & Solvency Shield',
    tagline: 'Equip yourself with institutional forensic frameworks (Piotroski, Altman Z, Pledge & Auditor Audits).',
    level: 'Advanced',
    totalSteps: 4,
    estimatedMinutes: 30,
    iconName: 'ShieldCheck',
    colorTheme: 'emerald',
    steps: [
      {
        stepNumber: 1,
        title: 'Piotroski 9-Point Score: Quantifying Fundamental Momentum',
        durationMinutes: 8,
        objective: 'Learn the exact 9 binary tests used by quant funds to screen out financial statement manipulation.',
        coreConcepts: ['Piotroski F-Score', 'Earnings Quality Test', 'Leverage Trends', 'Operating Efficiency'],
        body: `Created by Stanford accounting professor Joseph Piotroski, the F-Score grades companies from 0 to 9 across three core categories:

1. **Profitability (4 Points)**:
   • Positive Net Income (ROA > 0)
   • Positive Operating Cash Flow (CFO > 0)
   • Higher ROA YoY (ΔROA > 0)
   • **Accrual Quality**: CFO > Net Income (Confirms earnings are real cash)

2. **Leverage & Liquidity (3 Points)**:
   • Long-term Debt decreased YoY
   • Current Ratio increased YoY
   • Zero equity dilution (No new share issuance)

3. **Operating Efficiency (2 Points)**:
   • Gross Margin expanded YoY
   • Asset Turnover improved YoY`,
        proTip: 'Stocks scoring 8 or 9 historically demonstrate significant outperformance and minimal downside blowup risk.',
        caseStudy: {
          company: 'CDSL / Premier Energies',
          scenario: 'CDSL scores 9/9 with pristine cash generation, expanding operating margins, zero long-term debt, and zero dilution.',
          takeaway: 'High F-score provides a quantitative moat against corporate governance accidents.'
        },
        quiz: {
          question: 'In the Piotroski F-Score, what does the test "CFO > Net Income" evaluate?',
          options: [
            'Whether the company pays higher taxes than peers',
            'Earnings quality — verifying that reported profits are backed by actual operating cash collections rather than aggressive accruals',
            'Whether the stock price is above its 200-day moving average',
            'The total percentage of institutional ownership'
          ],
          correctIndex: 1,
          explanation: 'When CFO exceeds Net Income, it confirms high earnings quality and proves that profits are not mere accounting paper accruals.'
        }
      },
      {
        stepNumber: 2,
        title: 'Altman Z-Score: The 24-Month Bankruptcy Solvency Shield',
        durationMinutes: 7,
        objective: 'Calculate the mathematical probability of corporate distress or loan default.',
        coreConcepts: ['Altman Z Formula', 'Discriminant Analysis', 'Safe vs Distress Zones', 'Working Capital Buffer'],
        body: `The Altman Z-Score is a multi-variable statistical formula developed to predict corporate insolvency within a 2-year horizon.

**The Z-Score Zones**:
• **Safe Green Zone (Z > 2.99)**: Financially rock-solid. Minimal distress probability.
• **Grey Warning Zone (1.81 - 2.99)**: Moderate buffer; vulnerability during liquidity squeezes.
• **Distress Red Zone (Z < 1.81)**: High statistical risk of debt restructuring or default within 24 months.

Factors evaluated include Working Capital / Assets, Retained Earnings / Assets, EBIT / Assets, Market Cap / Total Liabilities, and Sales / Assets.`,
        proTip: 'Watch out for companies whose Z-Score drops continuously over 4 consecutive quarters from the Green into the Grey zone.',
        caseStudy: {
          company: 'Kaynes Technology (Z-Score > 4.2)',
          scenario: 'Strong equity capitalization, healthy working capital buffer, and disciplined short-term liabilities place Kaynes well inside the institutional Safe Green Zone.',
          takeaway: 'A high Z-score allows growth compounders to survive macro downturns and interest rate spikes without equity impairment.'
        },
        quiz: {
          question: 'An Altman Z-Score above 2.99 indicates which category of corporate financial health?',
          options: [
            'Distress Red Zone (High probability of default)',
            'Grey Warning Zone (Moderate risk)',
            'Safe Green Zone (Low statistical distress risk)',
            'Regulatory Delisting Zone'
          ],
          correctIndex: 2,
          explanation: 'Z > 2.99 places a company in the Safe Green Zone, indicating solid balance sheet liquidity and solvency.'
        }
      },
      {
        stepNumber: 3,
        title: 'Promoter Pledges, Auditor Resignations & Related Party Deals',
        durationMinutes: 8,
        objective: 'Identify the top corporate governance red flags before they lead to catastrophic stock collapses.',
        coreConcepts: ['Promoter Share Pledge', 'Auditor Resignations', 'Related Party Transactions (RPT)', 'Contingent Liabilities'],
        body: `Top Forensic Red Flags in Indian Equities:

1. **Promoter Pledge > 15-20%**: Founders borrowing against shares. In a market correction, NBFCs sell pledged shares, causing an uncontrollable cascading crash.
2. **Sudden Auditor Resignations**: When a reputable Big-4 or statutory auditor resigns midway through an audit citing "lack of information", fraud or undisclosed liabilities are often present.
3. **High Related-Party Transactions**: Diverting corporate profits to unlisted promoter-owned entities through opaque consulting fees or loans.
4. **Contingent Liabilities > 30-50% of Net Worth**: Hidden off-balance-sheet court disputes or tax claims that can suddenly wipe out equity.`,
        proTip: 'Zero promoter pledge and clean audit opinions without qualifications are non-negotiable filters for long-term wealth creation.',
        caseStudy: {
          company: 'Indian Corporate Governance Case Histories',
          scenario: 'Multiple historical mid-cap crashes were triggered when high promoter pledges met falling stock prices, forcing lenders to liquidate millions of shares at distressed market prices.',
          takeaway: 'Never compromise on promoter integrity and pledge levels.'
        },
        quiz: {
          question: 'Why is a sudden midterm resignation by a statutory auditor considered a major red flag?',
          options: [
            'It means the company is going to double its dividend payout',
            'It indicates the company is merging with a public sector bank',
            'It frequently points to governance disputes, lack of document transparency, or accounting irregularities',
            'It indicates the stock will be split 1:10'
          ],
          correctIndex: 2,
          explanation: 'Auditors rarely resign midway through a tenure unless they uncover serious accounting disagreements, unsupported transactions, or non-cooperation from management.'
        }
      },
      {
        stepNumber: 4,
        title: 'SEBI ASM & GSM Surveillance Frameworks',
        durationMinutes: 7,
        objective: 'Navigate exchange surveillance lists and understand liquidity and margin constraints.',
        coreConcepts: ['ASM Long-Term & Short-Term', 'GSM Stages 1-4', '100% Margin Requirements', 'Price Band Freezes'],
        body: `Indian exchanges (NSE & BSE) under SEBI guidelines maintain proactive surveillance frameworks to protect retail capital:

• **Additional Surveillance Measure (ASM)**: Imposed on stocks exhibiting abnormal price-volume spikes, high PE-to-sector variations, and extreme client concentration.
  - Stage 1: 100% upfront margin requirement (no intraday broker leverage).
  - Stage 2+: Price band capped at 5% with daily settlement.
• **Graded Surveillance Measure (GSM)**: Applied to micro-caps where prices have surged without fundamental revenue backing.
  - Higher stages require additional cash deposits (ASDs) and permit trading only once a week or month!`,
        proTip: 'Always check the NSE/BSE Daily Surveillance circulars before buying high-momentum breakout stocks to avoid liquidity traps.',
        caseStudy: {
          company: 'Speculative Social Media Pump vs Clean Universe',
          scenario: 'Speculative operators pump illiquid stocks until SEBI flags them under GSM Stage 2, instantly freezing speculative leverage and locking trapped retail buyers in lower circuits.',
          takeaway: 'Stick to clean, surveillance-free high-conviction companies with verifiable statutory filings.'
        },
        quiz: {
          question: 'What immediate operational restriction occurs when a stock is placed under SEBI ASM Stage 1?',
          options: [
            'The company is delisted immediately',
            '100% upfront cash margin is mandated, eliminating intraday broker leverage',
            'Foreign investors are barred from trading permanently',
            'The company must issue bonus shares'
          ],
          correctIndex: 1,
          explanation: 'Under ASM Stage 1, 100% cash margins are enforced for all trading, preventing speculative leverage from inflating volatility.'
        }
      }
    ]
  },
  {
    id: 'track-4-institutional-strategy',
    trackNumber: 4,
    title: 'Institutional Portfolio Construction & Thematic Megatrends',
    tagline: 'Structure concentrated portfolios, manage drawdowns, and ride multi-year secular Indian themes.',
    level: 'Institutional',
    totalSteps: 4,
    estimatedMinutes: 30,
    iconName: 'PieChart',
    colorTheme: 'purple',
    steps: [
      {
        stepNumber: 1,
        title: 'Multi-Factor Quant Scoring: Combining Quality, Value & Momentum',
        durationMinutes: 8,
        objective: 'Understand how institutional quants assign mathematical factor weights to rank equities.',
        coreConcepts: ['Multi-Factor Models', 'Factor Weights', 'Quality (ROCE/Debt)', 'Momentum (RSI/Moving Averages)', 'Valuation (P/E/PEG)'],
        body: `Quantitative institutional investing does not rely on subjective tips. It evaluates multi-factor cross-sectional scores:

**CINFI 10-Factor Architecture**:
1. **Core Quality (35%)**: ROCE, ROE, Net Debt-to-EBITDA, OCF/EBITDA Conversion.
2. **Growth & Moat (25%)**: 3-Year Sales & PAT CAGR, EBITDA Margin expansion.
3. **Forensic Safety (20%)**: Piotroski F-Score (8-9), Altman Z-Score, Zero Promoter Pledge.
4. **Valuation & Value (10%)**: PEG Multiple, Historical P/E Discount.
5. **Technical Momentum (10%)**: 200-DMA alignment, Relative Strength vs NIFTY 500.`,
        proTip: 'Stocks in the top 90th percentile across both Quality and Momentum consistently demonstrate superior risk-adjusted Sharpe ratios over 3-5 year cycles.',
        caseStudy: {
          company: 'CINFI High-Conviction Universe',
          scenario: 'Combining 20%+ ROCE with clean balance sheets and secular thematic tailwinds produces resilient alpha through market cycles.',
          takeaway: 'Systematic factor discipline removes emotional bias and FOMO from investment decisions.'
        },
        quiz: {
          question: 'Why do institutional quant models combine Quality factors (like ROCE) with Momentum factors (like Relative Strength)?',
          options: [
            'To guarantee that a stock will never experience a red day',
            'To capture fundamentally superior businesses when market capital flows are actively validating their growth',
            'To eliminate all government corporate taxes',
            'Because momentum alone is sufficient without fundamental data'
          ],
          correctIndex: 1,
          explanation: 'Combining Quality with Momentum ensures you invest in fundamentally pristine companies at times when institutional capital is actively entering the stock.'
        }
      },
      {
        stepNumber: 2,
        title: 'Institutional Liquidity: Reading FII vs DII Ownership Trends',
        durationMinutes: 7,
        objective: 'Track domestic mutual fund SIP absorption versus foreign portfolio allocation cycles.',
        coreConcepts: ['DII SIP Absorption', 'FII Risk-On/Risk-Off Cycles', 'Institutional Shareholding Trajectories', 'Distribution vs Accumulation'],
        body: `Indian equity market dynamics have fundamentally shifted:

• **The Domestic SIP Pillar**: Indian domestic mutual fund SIP inflows (~₹24,000+ Cr per month) provide uninterrupted, price-insensitive liquidity.
• **FII Liquidity Swings**: FII flows respond to US 10-Year Treasury Yields and USD/INR currency moves.
• **Accumulation Phase**: Rising FII + DII holding over 4 consecutive quarters while total number of retail shareholders remains flat or decreases.
• **Distribution Phase (Warning)**: Institutional holdings drop by >3-5% while retail shareholder count surges by 50%+ following aggressive media promotion.`,
        proTip: 'Always inspect the quarterly Shareholding Pattern table on BSE/NSE. Continuous institutional accumulation is one of the strongest bullish confirmations.',
        caseStudy: {
          company: 'Aerospace, Defense & Clean Energy Institutional Holdings',
          scenario: 'Systematic quarterly accumulation by top domestic mutual funds in high-conviction defense and green energy leaders provided strong valuation resilience during global macro sell-offs.',
          takeaway: 'Align your long-term portfolio with domestic institutional accumulation trends.'
        },
        quiz: {
          question: 'What shareholding pattern shift often signals an "Institutional Distribution Phase"?',
          options: [
            'Mutual funds increasing stake while retail investor count stays flat',
            'Promoters buying back shares from the open market',
            'Institutional (FII/DII) stakes declining while retail shareholder count spikes drastically',
            'Zero promoter pledge and insider buying'
          ],
          correctIndex: 2,
          explanation: 'When smart institutional money reduces stake while retail investor counts jump significantly, it signifies a distribution phase where institutions are offloading to retail buyers.'
        }
      },
      {
        stepNumber: 3,
        title: 'Position Sizing, Capital Allocation & Drawdown Management',
        durationMinutes: 7,
        objective: 'Protect your capital from ruin using professional risk management rules.',
        coreConcepts: ['Position Sizing Rules', 'Maximum Portfolio Allocation (10-15%)', 'Stop-Loss Discipline', 'Max Drawdown (MDD)'],
        body: `Even the best stock pick will destroy your portfolio if your position sizing is reckless.

**Golden Institutional Capital Allocation Rules**:
1. **Never allocate more than 10-15% of total capital to a single high-conviction stock** (avoids catastrophic single-stock risk).
2. **Cap single-sector exposure at 25-30%** (prevents sector-wide regulatory shocks from wrecking returns).
3. **Define Invalidation Thresholds**: If a company's core fundamental thesis breaks (e.g. governance scandal, CWIP failure, OCF turning negative), exit ruthlessly rather than averaging down blindly.
4. **Pyramiding (Adding on Strengths)**: Add to winning positions as they hit fundamental milestones, not to losing stocks experiencing deteriorating fundamentals.`,
        proTip: 'Professional fund managers focus on downside risk containment first; compounding returns take care of themselves when fatal losses are prevented.',
        caseStudy: {
          company: 'Portfolio Compounding Architecture',
          scenario: 'A disciplined 12-15 stock portfolio with max 10% per stock limits portfolio volatility and ensures no single unexpected negative event causes more than a 1-2% total portfolio dent.',
          takeaway: 'Survival and capital preservation are the prerequisites for long-term compound interest.'
        },
        quiz: {
          question: 'What is the recommended maximum portfolio allocation for a single high-conviction stock in a disciplined growth portfolio?',
          options: [
            '100% (All-in on one stock)',
            '60% to 75%',
            '10% to 15%',
            '0.5%'
          ],
          correctIndex: 2,
          explanation: 'Limiting individual stock sizing to 10-15% ensures that a rare single-company mishap cannot critically impair total portfolio net worth.'
        }
      },
      {
        stepNumber: 4,
        title: 'Thematic Megatrends: Clean Tech, Defense, Electronics & Railway Capex',
        durationMinutes: 8,
        objective: 'Identify multi-year structural secular themes backed by government capex and policy tailwinds.',
        coreConcepts: ['Thematic Investing', 'Government Capex Allocation', 'Make in India & PLI Schemes', 'Energy Transition'],
        body: `Secular themes are multi-year macroeconomic shifts that generate tailwinds irrespective of short-term GDP fluctuations:

**Key Indian Thematic Pillars**:
1. **Renewable Energy Transition**: 500 GW non-fossil target by 2030 (Solar cells/modules, Green Hydrogen, Smart Grid transmission).
2. **Indigenous Aerospace & Defense**: High defense indigenization lists, export expansion, radar/avionics modernization (e.g. BEL).
3. **Electronics Manufacturing Services (EMS)**: Semiconductor ecosystem, PLI incentives, global supply chain diversification (e.g. Kaynes).
4. **Railway & High-Speed Transit Modernization**: Vande Bharat rollout, dedicated freight corridors, signaling automation.`,
        proTip: 'Invest in the picks and shovels of the theme (e.g. precision electronic component makers, grid infrastructure) with high ROCE and pricing moats.',
        caseStudy: {
          company: 'Solar & Clean Tech Leaders',
          scenario: 'Integrated solar cell and module manufacturers benefit from ALMM (Approved List of Module Manufacturers) domestic content mandates and heavy national capex.',
          takeaway: 'Combining secular policy tailwinds with high capital efficiency creates multi-year compounders.'
        },
        quiz: {
          question: 'What makes "Picks and Shovels" providers attractive when investing in secular thematic trends (like Clean Energy or Electronics)?',
          options: [
            'They avoid paying corporate income taxes',
            'They provide essential high-moat components and infrastructure to the entire industry regardless of which end-brand wins',
            'They never face any supply chain changes',
            'They rely exclusively on speculative intraday trading'
          ],
          correctIndex: 1,
          explanation: 'Essential component, EMS, and equipment suppliers profit from the broad adoption of a secular megatrend regardless of which consumer brand captures retail market share.'
        }
      }
    ]
  }
];
