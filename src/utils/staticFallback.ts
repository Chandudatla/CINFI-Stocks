import {
  BONDS_FUTURISTIC_SPECS,
  COMMODITIES_FUTURISTIC_SPECS,
  DASHBOARD_EARLY_NEWS_CFG,
  ETF_FUTURISTIC_SPECS,
  FNO_FUTURISTIC_SPECS,
  FuturisticSpecBase,
  GOLD_FUTURISTIC_SPECS,
  INTRADAY_FUTURISTIC_SPECS,
  IPO_FUTURISTIC_SPECS,
  MUTUAL_FUNDS_FUTURISTIC_SPECS,
  SILVER_FUTURISTIC_SPECS,
  matchEarlyNewsToSpec,
  sortArticlesByNewest,
} from '../../serverFuturistic';
import type { CapTier, MfBroadCategory, NewsArticle } from '../types/market';

interface UniverseEntry {
  ticker: string;
  symbol: string;
  name: string;
  sector: string;
  capTier: CapTier;
  irUrl: string;
  annualReportUrl: string;
}

const DEFAULT_UNIVERSE: UniverseEntry[] = [
  { ticker: 'RELIANCE', symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd', sector: 'Energy & Materials', capTier: 'Large Cap', irUrl: 'https://www.ril.com/investors', annualReportUrl: 'https://www.ril.com/investors/financial-reporting/annual-reports' },
  { ticker: 'TCS', symbol: 'TCS.NS', name: 'Tata Consultancy Services Ltd', sector: 'IT & Tech', capTier: 'Large Cap', irUrl: 'https://www.tcs.com/investor-relations', annualReportUrl: 'https://www.tcs.com/investor-relations/financial-statements' },
  { ticker: 'HDFCBANK', symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd', sector: 'Banking & Finance', capTier: 'Large Cap', irUrl: 'https://www.hdfcbank.com/personal/about-us/investor-relations', annualReportUrl: 'https://www.hdfcbank.com/personal/about-us/investor-relations/annual-reports' },
  { ticker: 'ICICIBANK', symbol: 'ICICIBANK.NS', name: 'ICICI Bank Ltd', sector: 'Banking & Finance', capTier: 'Large Cap', irUrl: 'https://www.icicibank.com/about-us/investor-relations', annualReportUrl: 'https://www.icicibank.com/about-us/annual-reports' },
  { ticker: 'INFY', symbol: 'INFY.NS', name: 'Infosys Ltd', sector: 'IT & Tech', capTier: 'Large Cap', irUrl: 'https://www.infosys.com/investors.html', annualReportUrl: 'https://www.infosys.com/investors/reports-filings/annual-report.html' },
  { ticker: 'BHARTIARTL', symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel Ltd', sector: 'Telecom & Digital', capTier: 'Large Cap', irUrl: 'https://www.airtel.in/about-bharti/equity', annualReportUrl: 'https://www.airtel.in/about-bharti/equity/results' },
  { ticker: 'SBIN', symbol: 'SBIN.NS', name: 'State Bank of India', sector: 'Banking & Finance', capTier: 'Large Cap', irUrl: 'https://sbi.co.in/web/investor-relations/investor-relations', annualReportUrl: 'https://sbi.co.in/web/investor-relations/annual-report' },
  { ticker: 'LT', symbol: 'LT.NS', name: 'Larsen & Toubro Ltd', sector: 'Infrastructure', capTier: 'Large Cap', irUrl: 'https://investors.larsentoubro.com/', annualReportUrl: 'https://investors.larsentoubro.com/AnnualReports.aspx' },
  { ticker: 'ITC', symbol: 'ITC.NS', name: 'ITC Ltd', sector: 'Consumer & FMCG', capTier: 'Large Cap', irUrl: 'https://www.itcportal.com/about-itc/shareholder-value/investor-relations.aspx', annualReportUrl: 'https://www.itcportal.com/about-itc/shareholder-value/annual-reports.aspx' },
  { ticker: 'SUNPHARMA', symbol: 'SUNPHARMA.NS', name: 'Sun Pharmaceutical Industries Ltd', sector: 'Pharma & Health', capTier: 'Large Cap', irUrl: 'https://sunpharma.com/investors/', annualReportUrl: 'https://sunpharma.com/investors-annual-reports/' },
  { ticker: 'MARUTI', symbol: 'MARUTI.NS', name: 'Maruti Suzuki India Ltd', sector: 'Defence & Auto', capTier: 'Large Cap', irUrl: 'https://www.marutisuzuki.com/corporate/investors', annualReportUrl: 'https://www.marutisuzuki.com/corporate/investors/annual-reports' },
  { ticker: 'TITAN', symbol: 'TITAN.NS', name: 'Titan Company Ltd', sector: 'Consumer & FMCG', capTier: 'Large Cap', irUrl: 'https://www.titancompany.in/investors/investor-relations', annualReportUrl: 'https://www.titancompany.in/investors/annual-reports' },
  { ticker: 'BEL', symbol: 'BEL.NS', name: 'Bharat Electronics Ltd', sector: 'Defence & Auto', capTier: 'Mid Cap', irUrl: 'https://bel-india.in/investors/', annualReportUrl: 'https://bel-india.in/annual-reports/' },
  { ticker: 'HAL', symbol: 'HAL.NS', name: 'Hindustan Aeronautics Ltd', sector: 'Defence & Auto', capTier: 'Mid Cap', irUrl: 'https://hal-india.co.in/investors', annualReportUrl: 'https://hal-india.co.in/annual-reports' },
  { ticker: 'DIXON', symbol: 'DIXON.NS', name: 'Dixon Technologies (India) Ltd', sector: 'IT & Tech', capTier: 'Mid Cap', irUrl: 'https://www.dixoninfo.com/investor-relations.php', annualReportUrl: 'https://www.dixoninfo.com/annual-reports.php' },
  { ticker: 'PERSISTENT', symbol: 'PERSISTENT.NS', name: 'Persistent Systems Ltd', sector: 'IT & Tech', capTier: 'Mid Cap', irUrl: 'https://www.persistent.com/investors/', annualReportUrl: 'https://www.persistent.com/investors/annual-reports/' },
  { ticker: 'TRENT', symbol: 'TRENT.NS', name: 'Trent Ltd', sector: 'Consumer & FMCG', capTier: 'Mid Cap', irUrl: 'https://trentlimited.com/pages/investor-relations', annualReportUrl: 'https://trentlimited.com/pages/annual-reports' },
  { ticker: 'COFORGE', symbol: 'COFORGE.NS', name: 'Coforge Ltd', sector: 'IT & Tech', capTier: 'Mid Cap', irUrl: 'https://www.coforge.com/investors', annualReportUrl: 'https://www.coforge.com/investors/annual-reports' },
  { ticker: 'POLYCAB', symbol: 'POLYCAB.NS', name: 'Polycab India Ltd', sector: 'Infrastructure', capTier: 'Mid Cap', irUrl: 'https://polycab.com/investors/', annualReportUrl: 'https://polycab.com/investors/annual-reports/' },
  { ticker: 'KAYNES', symbol: 'KAYNES.NS', name: 'Kaynes Technology India Ltd', sector: 'IT & Tech', capTier: 'Small Cap', irUrl: 'https://www.kaynestechnology.co.in/investors', annualReportUrl: 'https://www.kaynestechnology.co.in/investors/annual-reports' },
  { ticker: 'KPITTECH', symbol: 'KPITTECH.NS', name: 'KPIT Technologies Ltd', sector: 'IT & Tech', capTier: 'Small Cap', irUrl: 'https://www.kpit.com/investors/', annualReportUrl: 'https://www.kpit.com/investors/annual-reports/' },
  { ticker: 'IREDA', symbol: 'IREDA.NS', name: 'Indian Renewable Energy Dev Agency Ltd', sector: 'Energy & Materials', capTier: 'Small Cap', irUrl: 'https://www.ireda.in/investor-relations', annualReportUrl: 'https://www.ireda.in/annual-reports' },
  { ticker: 'CDSL', symbol: 'CDSL.NS', name: 'Central Depository Services (India) Ltd', sector: 'Banking & Finance', capTier: 'Small Cap', irUrl: 'https://www.cdslindia.com/InvestorRels/InvestorRelations.html', annualReportUrl: 'https://www.cdslindia.com/InvestorRels/AnnualReports.html' },
  { ticker: 'TEJASNET', symbol: 'TEJASNET.NS', name: 'Tejas Networks Ltd', sector: 'Telecom & Digital', capTier: 'Small Cap', irUrl: 'https://www.tejasnetworks.com/investors/', annualReportUrl: 'https://www.tejasnetworks.com/financials/' },
  { ticker: 'TATAELXSI', symbol: 'TATAELXSI.NS', name: 'Tata Elxsi Ltd', sector: 'IT & Tech', capTier: 'Mid Cap', irUrl: 'https://www.tataelxsi.com/investors', annualReportUrl: 'https://www.tataelxsi.com/investors/financials' },
  { ticker: 'TATAPOWER', symbol: 'TATAPOWER.NS', name: 'Tata Power Company Ltd', sector: 'Energy & Materials', capTier: 'Large Cap', irUrl: 'https://www.tatapower.com/investor-relations.aspx', annualReportUrl: 'https://www.tatapower.com/investor-relations/annual-reports.aspx' },
  { ticker: 'NTPCGREEN', symbol: 'NTPCGREEN.NS', name: 'NTPC Green Energy Ltd', sector: 'Energy & Materials', capTier: 'Mid Cap', irUrl: 'https://www.ngel.in/investor-relations', annualReportUrl: 'https://www.ngel.in/financials' },
  { ticker: 'WAAREEENER', symbol: 'WAAREEENER.NS', name: 'Waaree Energies Ltd', sector: 'Energy & Materials', capTier: 'Mid Cap', irUrl: 'https://www.waaree.com/investor-relations', annualReportUrl: 'https://www.waaree.com/financial-reports' },
  { ticker: 'MAZDOCK', symbol: 'MAZDOCK.NS', name: 'Mazagon Dock Shipbuilders Ltd', sector: 'Defence & Auto', capTier: 'Mid Cap', irUrl: 'https://mazagondock.in/Investor-Relations', annualReportUrl: 'https://mazagondock.in/Annual-Reports' },
  { ticker: 'SUZLON', symbol: 'SUZLON.NS', name: 'Suzlon Energy Ltd', sector: 'Energy & Materials', capTier: 'Mid Cap', irUrl: 'https://www.suzlon.com/in-en/investor-relations', annualReportUrl: 'https://www.suzlon.com/in-en/investor-relations/annual-accounts' },
  { ticker: 'ABB', symbol: 'ABB.NS', name: 'ABB India Ltd', sector: 'Infrastructure', capTier: 'Large Cap', irUrl: 'https://new.abb.com/indian-subcontinent/investors', annualReportUrl: 'https://new.abb.com/indian-subcontinent/investors/financial-reports' },
  { ticker: 'SIEMENS', symbol: 'SIEMENS.NS', name: 'Siemens Ltd', sector: 'Infrastructure', capTier: 'Large Cap', irUrl: 'https://www.siemens.com/in/en/company/investor-relations.html', annualReportUrl: 'https://www.siemens.com/in/en/company/investor-relations/annual-reports.html' },
  { ticker: 'ETERNAL', symbol: 'ETERNAL.NS', name: 'Eternal Ltd (Zomato & Blinkit)', sector: 'Consumer & FMCG', capTier: 'Large Cap', irUrl: 'https://www.eternal.com/investor-relations/', annualReportUrl: 'https://www.eternal.com/investor-relations/' },
];

const UNIVERSE_MAP = new Map(DEFAULT_UNIVERSE.map((u) => [u.symbol, u]));

const STOCKS_FUTURISTIC_META = [
  { rank: 1, symbol: 'BEL.NS', themeGroup: 'Defence & Aerospace', futuristicTheme: 'Defence Electronics, EW & Quantum Radar', horizon: '2025–2035 Indigenization Cycle', reason: 'Near-monopoly supplier of indigenous radar, electronic warfare, and AI-enabled battlefield communications for India’s defence modernization. High-visibility sovereign order book provides multi-year earnings compounding with zero net debt.' },
  { rank: 2, symbol: 'HAL.NS', themeGroup: 'Defence & Aerospace', futuristicTheme: 'Aerospace, Combat Drones & Jet Engines', horizon: '2025–2035 Sovereign Airpower', reason: 'Sole Indian prime contractor for LCA Tejas, LCH Prachand, unmanned loyal-wingman platforms, and aero-engine co-development. Rising domestic procurement share and MRO exports anchor decade-long cash flows.' },
  { rank: 3, symbol: 'KAYNES.NS', themeGroup: 'AI & Semiconductors', futuristicTheme: 'OSAT Semiconductor Packaging & IoT EMS', horizon: '2025–2033 India Chip Ecosystem', reason: 'First-mover in India’s domestic OSAT semiconductor assembly and high-density PCB manufacturing backed by central and state capex subsidies. Deep exposure across EVs, aerospace, and industrial IoT lifts margin mix.' },
  { rank: 4, symbol: 'DIXON.NS', themeGroup: 'AI & Semiconductors', futuristicTheme: 'Electronics PLI, Display Fab & Telecom Hardware', horizon: '2025–2032 China+1 Manufacturing', reason: 'India’s flagship EMS compounder scaling from smartphones and wearables into IT hardware, telecom radios, and display modules. Strong PLI execution makes it the primary beneficiary of global supply-chain diversification.' },
  { rank: 5, symbol: 'KPITTECH.NS', themeGroup: 'AI & Semiconductors', futuristicTheme: 'Software-Defined Vehicles & EV Firmware', horizon: '2025–2032 Autonomous Mobility', reason: 'Pure-play automotive software partner building EV powertrain, ADAS, and centralized vehicle architecture for top global OEMs. Sticky multi-year R&D programs remain prioritized even during auto cycle slowdowns.' },
  { rank: 6, symbol: 'TATAELXSI.NS', themeGroup: 'AI & Semiconductors', futuristicTheme: 'AI Product Design, SDV & MedTech R&D', horizon: '2025–2032 ER&D Digital Engineering', reason: 'Combines Tata Group engineering depth with proprietary GenAI accelerators across autonomous mobility, connected healthcare, and OTT media. Design-led R&D commands structural operating margins above legacy IT.' },
  { rank: 7, symbol: 'WAAREEENER.NS', themeGroup: 'Clean Energy & EV', futuristicTheme: 'Solar Gigafactories & Battery Storage', horizon: '2025–2035 Solar Manufacturing', reason: 'India’s largest solar module manufacturer backward-integrating into solar cells, ingots/wafers, and green hydrogen electrolyzers. Protected by domestic ALMM mandates while expanding high-margin US capacity.' },
  { rank: 8, symbol: 'NTPCGREEN.NS', themeGroup: 'Clean Energy & EV', futuristicTheme: 'Utility Renewables & Green Hydrogen Hubs', horizon: '2025–2035 Net-Zero Grid Transition', reason: 'Backed by NTPC’s sovereign balance sheet and AAA borrowing costs to build India’s largest gigawatt-scale solar, wind, and green hydrogen pipeline. Long-term 25-year PPAs ensure predictable annuity-like returns.' },
  { rank: 9, symbol: 'PERSISTENT.NS', themeGroup: 'AI & Semiconductors', futuristicTheme: 'Enterprise GenAI & Cloud Data Engineering', horizon: '2025–2030 AI Software Modernization', reason: 'Outperforms Tier-1 peers by embedding AI-driven SaaS engineering and cloud platform modernization for global hyperscalers and healthcare leaders. Consistent deal-win velocity sustains superior revenue growth.' },
  { rank: 10, symbol: 'MAZDOCK.NS', themeGroup: 'Defence & Aerospace', futuristicTheme: 'Stealth Submarines & Autonomous Vessels', horizon: '2025–2035 Blue-Water Naval Tech', reason: 'India’s premier strategic shipyard capable of constructing conventional submarines and stealth guided-missile destroyers. Next-generation submarine orders and commercial green-shipbuilding extend multi-year visibility.' },
  { rank: 11, symbol: 'ABB.NS', themeGroup: 'Automation & Digital Rails', futuristicTheme: 'Industrial Robotics & Smart Grid Electrification', horizon: '2025–2032 Factory 4.0', reason: 'Technology leader in automated robotics, high-efficiency drives, and data-center power distribution across India’s industrial capex boom. Electrification and AI factory digitization drive steady margin expansion.' },
  { rank: 12, symbol: 'SIEMENS.NS', themeGroup: 'Automation & Digital Rails', futuristicTheme: 'Digital Twins, Smart Rail & Grid Tech', horizon: '2025–2032 Smart Infrastructure', reason: 'Powers high-speed rail electrification, smart transmission grids, and industrial digital-twin software across India’s infrastructure upgrade. Planned energy demerger unlocks focused value across grid decarbonization.' },
  { rank: 13, symbol: 'TATAPOWER.NS', themeGroup: 'Clean Energy & EV', futuristicTheme: 'EV Charging Grid, Solar Rooftops & Smart Discom', horizon: '2025–2034 Clean Energy Utility', reason: 'Integrated clean-energy platform combining India’s widest EV charging network, PM Surya Ghar rooftop solar execution, and pumped hydro storage. Shifting capex heavily toward high-ROE renewables and transmission.' },
  { rank: 14, symbol: 'IREDA.NS', themeGroup: 'Clean Energy & EV', futuristicTheme: 'Clean Energy & Green Hydrogen Financing', horizon: '2025–2035 Climate Capital', reason: 'Navratna PSU serving as the dedicated financial backbone for India’s 500 GW non-fossil target, solar parks, and battery storage. Sovereign parentage enables low-cost green bond funding alongside clean asset quality.' },
  { rank: 15, symbol: 'TEJASNET.NS', themeGroup: 'AI & Semiconductors', futuristicTheme: 'Indigenous 5G/6G RAN & Optical Backhaul', horizon: '2025–2032 Sovereign Telecom Hardware', reason: 'Tata Group-backed telecom OEM supplying indigenous 4G/5G radio equipment and high-capacity optical backhaul for BharatNet and global carriers. Positioned as a trusted non-Chinese alternative in critical network infrastructure.' },
  { rank: 16, symbol: 'SUZLON.NS', themeGroup: 'Clean Energy & EV', futuristicTheme: 'Next-Gen Wind Turbines & Hybrid Power', horizon: '2025–2032 Grid Decarbonization', reason: 'Revitalized balance sheet with near-zero debt and ~32% Indian wind market share in higher-capacity 3MW+ turbines required for round-the-clock hybrid renewable tenders. High-margin OMS service annuity cushions cyclicality.' },
  { rank: 17, symbol: 'POLYCAB.NS', themeGroup: 'Automation & Digital Rails', futuristicTheme: 'HV Power Grids, Optic Fiber & EV Cabling', horizon: '2025–2032 Electrification Backbone', reason: 'Dominant wires, EHV cables, and optic-fiber backbone enabling India’s power transmission buildout, hyperscale data centers, and EV charging rollout. Backward integration and export certification widen competitive moat.' },
  { rank: 18, symbol: 'COFORGE.NS', themeGroup: 'AI & Semiconductors', futuristicTheme: 'AI Automation & Travel/BFSI Cloud Tech', horizon: '2025–2030 Enterprise AI Ops', reason: 'High-growth digital integrator specializing in AI-assisted operations and legacy cloud re-platforming across global airlines, insurance, and banking. Strong execution cadence keeps order intake above industry averages.' },
  { rank: 19, symbol: 'CDSL.NS', themeGroup: 'Automation & Digital Rails', futuristicTheme: 'Digital Capital Market & Demat FinTech Rails', horizon: '2025–2035 Financialization', reason: 'Asset-light duopoly infrastructure holding 14+ crore Indian demat accounts with structural 50%+ operating margins. Direct beneficiary of India’s household savings shift into equities, e-insurance, and digital KYC.' },
  { rank: 20, symbol: 'ETERNAL.NS', themeGroup: 'Automation & Digital Rails', futuristicTheme: 'Quick Commerce, AI Logistics & Urban Infra', horizon: '2025–2032 Next-Gen Consumer Tech', reason: 'Category leader in 10-minute dark-store quick commerce (Blinkit) and food delivery powered by hyperlocal AI demand routing and dense fulfillment grids. Profitable unit economics unlock a massive urban retail TAM.' },
];

interface MfMetaConfig {
  code: string;
  category: string;
  broadCategory: MfBroadCategory;
  expenseRatio: number;
  benchmark: string;
  fundManager: string;
  riskRating: string;
  amcUrl: string;
  factsheetUrl: string;
}

const MF_SCHEMES: MfMetaConfig[] = [
  { code: '122639', category: 'Flexi Cap', broadCategory: 'Equity', expenseRatio: 0.62, benchmark: 'NIFTY 500 TRI', fundManager: 'Rajeev Thakkar', riskRating: 'Very High', amcUrl: 'https://amc.ppfas.com/', factsheetUrl: 'https://amc.ppfas.com/downloads/factsheets/' },
  { code: '118825', category: 'Large Cap', broadCategory: 'Equity', expenseRatio: 0.53, benchmark: 'NIFTY 100 TRI', fundManager: 'Gaurav Misra', riskRating: 'Very High', amcUrl: 'https://www.miraeassetmf.co.in/', factsheetUrl: 'https://www.miraeassetmf.co.in/downloads/factsheet' },
  { code: '120586', category: 'Large Cap', broadCategory: 'Equity', expenseRatio: 0.87, benchmark: 'NIFTY 100 TRI', fundManager: 'Anish Tawakley', riskRating: 'Very High', amcUrl: 'https://www.icicipruamc.com/', factsheetUrl: 'https://www.icicipruamc.com/media-center/factsheets' },
  { code: '119598', category: 'Large Cap', broadCategory: 'Equity', expenseRatio: 0.81, benchmark: 'BSE 100 TRI', fundManager: 'Saurabh Pant', riskRating: 'Very High', amcUrl: 'https://www.sbimf.com/', factsheetUrl: 'https://www.sbimf.com/factsheets' },
  { code: '118989', category: 'Mid Cap', broadCategory: 'Equity', expenseRatio: 0.76, benchmark: 'NIFTY Midcap 150 TRI', fundManager: 'Chirag Setalvad', riskRating: 'Very High', amcUrl: 'https://www.hdfcfund.com/', factsheetUrl: 'https://www.hdfcfund.com/statutory-disclosure/factsheets' },
  { code: '119775', category: 'Mid Cap', broadCategory: 'Equity', expenseRatio: 0.39, benchmark: 'NIFTY Midcap 150 TRI', fundManager: 'Pankaj Tibrewal / Atul Bhole', riskRating: 'Very High', amcUrl: 'https://www.kotakmf.com/', factsheetUrl: 'https://www.kotakmf.com/Information/forms-and-downloads' },
  { code: '118778', category: 'Small Cap', broadCategory: 'Equity', expenseRatio: 0.68, benchmark: 'NIFTY Smallcap 250 TRI', fundManager: 'Samir Rachh', riskRating: 'Very High', amcUrl: 'https://mf.nipponindiaim.com/', factsheetUrl: 'https://mf.nipponindiaim.com/investor-service/downloads/factsheet-and-other-disclosures' },
  { code: '120828', category: 'Small Cap', broadCategory: 'Equity', expenseRatio: 0.64, benchmark: 'NIFTY Smallcap 250 TRI', fundManager: 'Ankit Pande', riskRating: 'Very High', amcUrl: 'https://quantmutual.com/', factsheetUrl: 'https://quantmutual.com/downloads/factsheet' },
  { code: '118987', category: 'Corporate Bond', broadCategory: 'Debt', expenseRatio: 0.35, benchmark: 'NIFTY Corporate Bond Index', fundManager: 'Anupam Joshi', riskRating: 'Moderate', amcUrl: 'https://www.hdfcfund.com/', factsheetUrl: 'https://www.hdfcfund.com/statutory-disclosure/factsheets' },
  { code: '120605', category: 'Government Gilt', broadCategory: 'Debt', expenseRatio: 0.56, benchmark: 'CRISIL Dynamic Gilt Index', fundManager: 'Manish Banthia', riskRating: 'Moderate', amcUrl: 'https://www.icicipruamc.com/', factsheetUrl: 'https://www.icicipruamc.com/media-center/factsheets' },
  { code: '118701', category: 'Liquid Debt', broadCategory: 'Debt', expenseRatio: 0.20, benchmark: 'NIFTY Liquid Index', fundManager: 'Anju Chhajer', riskRating: 'Low to Moderate', amcUrl: 'https://mf.nipponindiaim.com/', factsheetUrl: 'https://mf.nipponindiaim.com/investor-service/downloads/factsheet-and-other-disclosures' },
  { code: '147857', category: 'PSU Target Maturity', broadCategory: 'Debt', expenseRatio: 0.06, benchmark: 'Nifty BHARAT Bond Apr 2030', fundManager: 'Dhawal Dalal', riskRating: 'Moderate', amcUrl: 'https://www.edelweissmf.com/', factsheetUrl: 'https://www.edelweissmf.com/downloads/factsheets' },
  { code: '118968', category: 'Balanced Advantage', broadCategory: 'Hybrid', expenseRatio: 0.78, benchmark: 'NIFTY 50 Hybrid Composite', fundManager: 'Gopal Agrawal', riskRating: 'High', amcUrl: 'https://www.hdfcfund.com/', factsheetUrl: 'https://www.hdfcfund.com/statutory-disclosure/factsheets' },
  { code: '120377', category: 'Balanced Advantage', broadCategory: 'Hybrid', expenseRatio: 0.85, benchmark: 'CRISIL Hybrid 50+50', fundManager: 'Sankaran Naren', riskRating: 'High', amcUrl: 'https://www.icicipruamc.com/', factsheetUrl: 'https://www.icicipruamc.com/media-center/factsheets' },
  { code: '119839', category: 'Conservative Hybrid', broadCategory: 'Hybrid', expenseRatio: 0.61, benchmark: 'NIFTY 50 Hybrid 15:85', fundManager: 'Dinesh Ahuja', riskRating: 'Moderately High', amcUrl: 'https://www.sbimf.com/', factsheetUrl: 'https://www.sbimf.com/factsheets' },
  { code: '120716', category: 'Nifty 50 Index', broadCategory: 'Index', expenseRatio: 0.18, benchmark: 'NIFTY 50 TRI', fundManager: 'Sharwan Kumar Goyal', riskRating: 'Very High', amcUrl: 'https://www.utimf.com/', factsheetUrl: 'https://www.utimf.com/forms-and-downloads/' },
  { code: '119827', category: 'Nifty 50 Index', broadCategory: 'Index', expenseRatio: 0.19, benchmark: 'NIFTY 50 TRI', fundManager: 'Raviprakash Sharma', riskRating: 'Very High', amcUrl: 'https://www.sbimf.com/', factsheetUrl: 'https://www.sbimf.com/factsheets' },
  { code: '119063', category: 'Nifty 50 Index', broadCategory: 'Index', expenseRatio: 0.20, benchmark: 'NIFTY 50 TRI', fundManager: 'Nirman Morakhia', riskRating: 'Very High', amcUrl: 'https://www.hdfcfund.com/', factsheetUrl: 'https://www.hdfcfund.com/statutory-disclosure/factsheets' },
  { code: '120684', category: 'Nifty Next 50 Index', broadCategory: 'Index', expenseRatio: 0.30, benchmark: 'NIFTY Next 50 TRI', fundManager: 'Kayzad Eghlim', riskRating: 'Very High', amcUrl: 'https://www.icicipruamc.com/', factsheetUrl: 'https://www.icicipruamc.com/media-center/factsheets' },
  { code: '120594', category: 'IT & Digital', broadCategory: 'Sectoral', expenseRatio: 0.94, benchmark: 'BSE Teck TRI', fundManager: 'Vaibhav Dusad', riskRating: 'Very High', amcUrl: 'https://www.icicipruamc.com/', factsheetUrl: 'https://www.icicipruamc.com/media-center/factsheets' },
  { code: '118759', category: 'Pharma & Healthcare', broadCategory: 'Sectoral', expenseRatio: 0.99, benchmark: 'BSE Healthcare TRI', fundManager: 'Sailesh Raj Bhan', riskRating: 'Very High', amcUrl: 'https://mf.nipponindiaim.com/', factsheetUrl: 'https://mf.nipponindiaim.com/investor-service/downloads/factsheet-and-other-disclosures' },
  { code: '135800', category: 'Digital Technology', broadCategory: 'Sectoral', expenseRatio: 0.34, benchmark: 'NIFTY IT TRI', fundManager: 'Meeta Shetty', riskRating: 'Very High', amcUrl: 'https://www.tatamutualfund.com/', factsheetUrl: 'https://www.tatamutualfund.com/downloads/factsheets' },
  { code: '149858', category: 'Banking Index', broadCategory: 'Sectoral', expenseRatio: 0.25, benchmark: 'NIFTY Bank TRI', fundManager: 'Nishit Patel', riskRating: 'Very High', amcUrl: 'https://www.icicipruamc.com/', factsheetUrl: 'https://www.icicipruamc.com/media-center/factsheets' },
];

const EXTRA_MF_SCHEMES: MfMetaConfig[] = [
  { code: '118663', category: 'Gold FoF', broadCategory: 'Hybrid', expenseRatio: 0.36, benchmark: 'Domestic Physical Gold', fundManager: 'Vikram Dhawan', riskRating: 'High', amcUrl: 'https://mf.nipponindiaim.com/', factsheetUrl: 'https://mf.nipponindiaim.com/' },
  { code: '119132', category: 'Gold FoF', broadCategory: 'Hybrid', expenseRatio: 0.18, benchmark: 'Domestic Physical Gold', fundManager: 'Bhavyesh Doshi', riskRating: 'High', amcUrl: 'https://www.hdfcfund.com/', factsheetUrl: 'https://www.hdfcfund.com/' },
  { code: '119788', category: 'Gold FoF', broadCategory: 'Hybrid', expenseRatio: 0.10, benchmark: 'Domestic Physical Gold', fundManager: 'Raviprakash Sharma', riskRating: 'High', amcUrl: 'https://www.sbimf.com/', factsheetUrl: 'https://www.sbimf.com/' },
  { code: '149760', category: 'Silver FoF', broadCategory: 'Hybrid', expenseRatio: 0.28, benchmark: 'Domestic Physical Silver', fundManager: 'Vikram Dhawan', riskRating: 'Very High', amcUrl: 'https://mf.nipponindiaim.com/', factsheetUrl: 'https://mf.nipponindiaim.com/' },
  { code: '149775', category: 'Silver FoF', broadCategory: 'Hybrid', expenseRatio: 0.12, benchmark: 'Domestic Physical Silver', fundManager: 'Nishit Patel', riskRating: 'Very High', amcUrl: 'https://www.icicipruamc.com/', factsheetUrl: 'https://www.icicipruamc.com/' },
];

const ALL_MF_CONFIG_MAP = new Map<string, MfMetaConfig>(
  [...MF_SCHEMES, ...EXTRA_MF_SCHEMES].map((m) => [m.code, m])
);

const IPO_LISTED_META = [
  { symbol: 'HYUNDAI.NS', name: 'Hyundai Motor India Ltd', sector: 'Automobiles', issuePrice: 1960, lotSize: 7, issueSizeCr: '₹27,870 Cr', openDate: '15 Oct 2024', closeDate: '17 Oct 2024', allotmentDate: '18 Oct 2024', listingDate: '22 Oct 2024', registrar: 'KFin Technologies', registrarUrl: 'https://ris.kfintech.com/ipostatus/', subscriptionTotal: '2.37x' },
  { symbol: 'SWIGGY.NS', name: 'Swiggy Ltd', sector: 'Consumer Tech', issuePrice: 390, lotSize: 38, issueSizeCr: '₹11,327 Cr', openDate: '06 Nov 2024', closeDate: '08 Nov 2024', allotmentDate: '11 Nov 2024', listingDate: '13 Nov 2024', registrar: 'Link Intime', registrarUrl: 'https://linkintime.co.in/initial_offer/public-issues.html', subscriptionTotal: '3.59x' },
  { symbol: 'NTPCGREEN.NS', name: 'NTPC Green Energy Ltd', sector: 'Renewable Energy', issuePrice: 108, lotSize: 138, issueSizeCr: '₹10,000 Cr', openDate: '19 Nov 2024', closeDate: '22 Nov 2024', allotmentDate: '25 Nov 2024', listingDate: '27 Nov 2024', registrar: 'KFin Technologies', registrarUrl: 'https://ris.kfintech.com/ipostatus/', subscriptionTotal: '2.55x' },
  { symbol: 'WAAREEENER.NS', name: 'Waaree Energies Ltd', sector: 'Solar Manufacturing', issuePrice: 1503, lotSize: 9, issueSizeCr: '₹4,321 Cr', openDate: '21 Oct 2024', closeDate: '23 Oct 2024', allotmentDate: '24 Oct 2024', listingDate: '28 Oct 2024', registrar: 'Link Intime', registrarUrl: 'https://linkintime.co.in/initial_offer/public-issues.html', subscriptionTotal: '79.44x' },
  { symbol: 'BAJAJHFL.NS', name: 'Bajaj Housing Finance Ltd', sector: 'Housing Finance', issuePrice: 70, lotSize: 214, issueSizeCr: '₹6,560 Cr', openDate: '09 Sep 2024', closeDate: '11 Sep 2024', allotmentDate: '12 Sep 2024', listingDate: '16 Sep 2024', registrar: 'KFin Technologies', registrarUrl: 'https://ris.kfintech.com/ipostatus/', subscriptionTotal: '67.43x' },
  { symbol: 'OLAELEC.NS', name: 'Ola Electric Mobility Ltd', sector: 'EV & Mobility', issuePrice: 76, lotSize: 195, issueSizeCr: '₹6,145 Cr', openDate: '02 Aug 2024', closeDate: '06 Aug 2024', allotmentDate: '07 Aug 2024', listingDate: '09 Aug 2024', registrar: 'Link Intime', registrarUrl: 'https://linkintime.co.in/initial_offer/public-issues.html', subscriptionTotal: '4.45x' },
  { symbol: 'PREMIERENE.NS', name: 'Premier Energies Ltd', sector: 'Solar Cells', issuePrice: 450, lotSize: 33, issueSizeCr: '₹2,830 Cr', openDate: '27 Aug 2024', closeDate: '29 Aug 2024', allotmentDate: '30 Aug 2024', listingDate: '03 Sep 2024', registrar: 'KFin Technologies', registrarUrl: 'https://ris.kfintech.com/ipostatus/', subscriptionTotal: '75.00x' },
  { symbol: 'FIRSTCRY.NS', name: 'Brainbees Solutions (FirstCry)', sector: 'E-Commerce', issuePrice: 465, lotSize: 32, issueSizeCr: '₹4,193 Cr', openDate: '06 Aug 2024', closeDate: '08 Aug 2024', allotmentDate: '09 Aug 2024', listingDate: '13 Aug 2024', registrar: 'Link Intime', registrarUrl: 'https://linkintime.co.in/initial_offer/public-issues.html', subscriptionTotal: '12.22x' },
  { symbol: 'VMM.NS', name: 'Vishal Mega Mart Ltd', sector: 'Value Retail', issuePrice: 78, lotSize: 190, issueSizeCr: '₹8,000 Cr', openDate: '11 Dec 2024', closeDate: '13 Dec 2024', allotmentDate: '16 Dec 2024', listingDate: '18 Dec 2024', registrar: 'KFin Technologies', registrarUrl: 'https://ris.kfintech.com/ipostatus/', subscriptionTotal: '28.75x' },
  { symbol: 'MOBIKWIK.NS', name: 'One MobiKwik Systems Ltd', sector: 'Fintech', issuePrice: 279, lotSize: 53, issueSizeCr: '₹572 Cr', openDate: '11 Dec 2024', closeDate: '13 Dec 2024', allotmentDate: '16 Dec 2024', listingDate: '18 Dec 2024', registrar: 'Link Intime', registrarUrl: 'https://linkintime.co.in/initial_offer/public-issues.html', subscriptionTotal: '119.38x' },
  { symbol: 'GODIGIT.NS', name: 'Go Digit General Insurance Ltd', sector: 'InsurTech', issuePrice: 272, lotSize: 55, issueSizeCr: '₹2,614 Cr', openDate: '15 May 2024', closeDate: '17 May 2024', allotmentDate: '21 May 2024', listingDate: '23 May 2024', registrar: 'Link Intime', registrarUrl: 'https://linkintime.co.in/initial_offer/public-issues.html', subscriptionTotal: '9.60x' },
  { symbol: 'INDGN.NS', name: 'Indegene Ltd', sector: 'Healthcare Tech', issuePrice: 452, lotSize: 33, issueSizeCr: '₹1,841 Cr', openDate: '06 May 2024', closeDate: '08 May 2024', allotmentDate: '09 May 2024', listingDate: '13 May 2024', registrar: 'Link Intime', registrarUrl: 'https://linkintime.co.in/initial_offer/public-issues.html', subscriptionTotal: '70.30x' },
  { symbol: 'TATATECH.NS', name: 'Tata Technologies Ltd', sector: 'ER&D Services', issuePrice: 500, lotSize: 30, issueSizeCr: '₹3,042 Cr', openDate: '22 Nov 2023', closeDate: '24 Nov 2023', allotmentDate: '28 Nov 2023', listingDate: '30 Nov 2023', registrar: 'Link Intime', registrarUrl: 'https://linkintime.co.in/initial_offer/public-issues.html', subscriptionTotal: '69.43x' },
  { symbol: 'JYOTICNC.NS', name: 'Jyoti CNC Automation Ltd', sector: 'Precision Engineering', issuePrice: 331, lotSize: 45, issueSizeCr: '₹1,000 Cr', openDate: '09 Jan 2024', closeDate: '11 Jan 2024', allotmentDate: '12 Jan 2024', listingDate: '16 Jan 2024', registrar: 'Link Intime', registrarUrl: 'https://linkintime.co.in/initial_offer/public-issues.html', subscriptionTotal: '40.49x' },
];

const IPO_PIPELINE_META = [
  { id: 'pip-nsdl', companyName: 'National Securities Depository Ltd (NSDL)', sector: 'Market Infrastructure', status: 'Upcoming' as const, priceBand: 'DRHP Filed', issuePrice: null, lotSize: null, issueSizeCr: '₹3,000+ Cr (Est.)', openDate: 'SEBI Approved', closeDate: 'TBA', allotmentDate: 'TBA', listingDate: 'NSE/BSE', registrar: 'MUFG Intime', registrarUrl: 'https://linkintime.co.in/initial_offer/public-issues.html', subscriptionTotal: 'Pre-Issue' },
  { id: 'pip-lg', companyName: 'LG Electronics India Ltd', sector: 'Consumer Appliances', status: 'Upcoming' as const, priceBand: 'DRHP Filed', issuePrice: null, lotSize: null, issueSizeCr: '₹15,000 Cr (Est.)', openDate: 'DRHP Under Review', closeDate: 'TBA', allotmentDate: 'TBA', listingDate: 'NSE/BSE', registrar: 'KFin Technologies', registrarUrl: 'https://ris.kfintech.com/ipostatus/', subscriptionTotal: 'Pre-Issue' },
  { id: 'pip-zepto', companyName: 'Zepto (Kiranakart Technologies)', sector: 'Quick Commerce', status: 'Upcoming' as const, priceBand: 'DRHP Prep', issuePrice: null, lotSize: null, issueSizeCr: '₹8,000 Cr (Est.)', openDate: 'Upcoming Pipeline', closeDate: 'TBA', allotmentDate: 'TBA', listingDate: 'NSE/BSE', registrar: 'KFin Technologies', registrarUrl: 'https://ris.kfintech.com/ipostatus/', subscriptionTotal: 'Pre-Issue' },
  { id: 'pip-ather', companyName: 'Ather Energy Ltd', sector: 'Electric Vehicles', status: 'Open' as const, priceBand: 'RHP / Bookbuilding', issuePrice: null, lotSize: null, issueSizeCr: '₹3,100+ Cr', openDate: 'Active Window', closeDate: 'Live Exchange', allotmentDate: 'T+1 Post Close', listingDate: 'T+3 Post Close', registrar: 'Link Intime', registrarUrl: 'https://linkintime.co.in/initial_offer/public-issues.html', subscriptionTotal: 'Check Live AI' },
  { id: 'pip-jsw', companyName: 'JSW Cement Ltd', sector: 'Building Materials', status: 'Upcoming' as const, priceBand: 'SEBI Approved', issuePrice: null, lotSize: null, issueSizeCr: '₹4,000 Cr', openDate: 'SEBI Observation Issued', closeDate: 'TBA', allotmentDate: 'TBA', listingDate: 'NSE/BSE', registrar: 'KFin Technologies', registrarUrl: 'https://ris.kfintech.com/ipostatus/', subscriptionTotal: 'Pre-Issue' },
  { id: 'pip-tatacap', companyName: 'Tata Capital Ltd', sector: 'NBFC / Financial', status: 'Upcoming' as const, priceBand: 'RBI Upper-Layer', issuePrice: null, lotSize: null, issueSizeCr: '₹15,000+ Cr', openDate: 'Mandatory Listing Track', closeDate: 'TBA', allotmentDate: 'TBA', listingDate: 'NSE/BSE', registrar: 'Link Intime', registrarUrl: 'https://linkintime.co.in/initial_offer/public-issues.html', subscriptionTotal: 'Pre-Issue' },
  { id: 'pip-hero', companyName: 'Hero FinCorp Ltd', sector: 'NBFC / Lending', status: 'Closed' as const, priceBand: 'RHP / Allotment', issuePrice: null, lotSize: null, issueSizeCr: '₹3,668 Cr', openDate: 'Book Closed', closeDate: 'Allotment Stage', allotmentDate: 'Registrar Check', listingDate: 'Pending Listing', registrar: 'KFin Technologies', registrarUrl: 'https://ris.kfintech.com/ipostatus/', subscriptionTotal: 'Verify Registrar' },
  { id: 'pip-vikram', companyName: 'Vikram Solar Ltd', sector: 'Solar Modules', status: 'Closed' as const, priceBand: 'RHP Filed', issuePrice: null, lotSize: null, issueSizeCr: '₹1,500+ Cr', openDate: 'Book Closed', closeDate: 'Allotment Stage', allotmentDate: 'Registrar Check', listingDate: 'Pending Listing', registrar: 'Link Intime', registrarUrl: 'https://linkintime.co.in/initial_offer/public-issues.html', subscriptionTotal: 'Verify Registrar' },
];

const BOND_REFERENCE_RECORDS = [
  { isinName: '7.10% GS 2034 (10-Year Sovereign Benchmark)', issuerType: 'Government Security' as const, couponPct: 7.10, ytmPct: 6.82, maturityDate: 'Apr 2034', durationYears: 6.9, rating: 'Sovereign', interestFrequency: 'Semi-Annual' },
  { isinName: '7.18% GS 2033 (On-the-Run G-Sec)', issuerType: 'Government Security' as const, couponPct: 7.18, ytmPct: 6.79, maturityDate: 'Aug 2033', durationYears: 6.4, rating: 'Sovereign', interestFrequency: 'Semi-Annual' },
  { isinName: '91-Day Government of India Treasury Bill', issuerType: 'Treasury Bill' as const, couponPct: 0.0, ytmPct: 6.45, maturityDate: '91 Days', durationYears: 0.25, rating: 'Sovereign', interestFrequency: 'Zero-Coupon (Discount)' },
  { isinName: '364-Day Government of India Treasury Bill', issuerType: 'Treasury Bill' as const, couponPct: 0.0, ytmPct: 6.58, maturityDate: '364 Days', durationYears: 1.0, rating: 'Sovereign', interestFrequency: 'Zero-Coupon (Discount)' },
  { isinName: 'PFC / REC AAA Tax-Free & Taxable PSU Tranche 2030', issuerType: 'Corporate Bond' as const, couponPct: 7.55, ytmPct: 7.42, maturityDate: 'Apr 2030', durationYears: 4.1, rating: 'CRISIL AAA', interestFrequency: 'Annual' },
  { isinName: 'HDFC Bank / NABARD AAA Senior Unsecured NCD 2029', issuerType: 'Corporate Bond' as const, couponPct: 7.72, ytmPct: 7.58, maturityDate: 'Sep 2029', durationYears: 3.6, rating: 'ICRA AAA', interestFrequency: 'Annual' },
  { isinName: 'Maharashtra & Gujarat State Dev Loan (10Y SDL)', issuerType: 'State Development Loan' as const, couponPct: 7.36, ytmPct: 7.18, maturityDate: 'Mar 2034', durationYears: 6.7, rating: 'Sovereign (State)', interestFrequency: 'Semi-Annual' },
  { isinName: 'NHAI Listed Capital Gains / Secured Debt Series', issuerType: 'Listed Debt' as const, couponPct: 7.45, ytmPct: 7.31, maturityDate: 'Nov 2031', durationYears: 5.0, rating: 'CARE AAA', interestFrequency: 'Annual' },
];

const SGB_RECORDS_META = [
  { series: 'SGB Series IV 2023-24 (Maturing Feb 2032)', issuePrice: 6263, couponPct: 2.5, maturityDate: '21 Feb 2032' },
  { series: 'SGB Series III 2023-24 (Maturing Dec 2031)', issuePrice: 6199, couponPct: 2.5, maturityDate: '28 Dec 2031' },
  { series: 'SGB Series II 2023-24 (Maturing Sep 2031)', issuePrice: 5923, couponPct: 2.5, maturityDate: '20 Sep 2031' },
  { series: 'SGB Series I 2023-24 (Maturing Jun 2031)', issuePrice: 5926, couponPct: 2.5, maturityDate: '27 Jun 2031' },
  { series: 'SGB Series IV 2022-23 (Maturing Mar 2031)', issuePrice: 5611, couponPct: 2.5, maturityDate: '14 Mar 2031' },
];

const FNO_UNDERLYINGS = [
  { symbol: '^NSEI', name: 'NIFTY 50 Index', instrumentType: 'Index' as const, step: 50, lotSize: 75, sector: 'Index' },
  { symbol: '^NSEBANK', name: 'BANK NIFTY Index', instrumentType: 'Index' as const, step: 100, lotSize: 30, sector: 'Index' },
  { symbol: '^CNXIT', name: 'NIFTY IT Index', instrumentType: 'Index' as const, step: 100, lotSize: 25, sector: 'Index' },
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd', instrumentType: 'Stock' as const, step: 20, lotSize: 500, sector: 'Energy' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd', instrumentType: 'Stock' as const, step: 20, lotSize: 550, sector: 'Banking' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Ltd', instrumentType: 'Stock' as const, step: 20, lotSize: 700, sector: 'Banking' },
  { symbol: 'SBIN.NS', name: 'State Bank of India', instrumentType: 'Stock' as const, step: 10, lotSize: 750, sector: 'Banking' },
  { symbol: 'INFY.NS', name: 'Infosys Ltd', instrumentType: 'Stock' as const, step: 20, lotSize: 400, sector: 'IT' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services', instrumentType: 'Stock' as const, step: 50, lotSize: 175, sector: 'IT' },
  { symbol: 'LT.NS', name: 'Larsen & Toubro Ltd', instrumentType: 'Stock' as const, step: 50, lotSize: 150, sector: 'Infra' },
  { symbol: 'AXISBANK.NS', name: 'Axis Bank Ltd', instrumentType: 'Stock' as const, step: 20, lotSize: 625, sector: 'Banking' },
  { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank', instrumentType: 'Stock' as const, step: 20, lotSize: 400, sector: 'Banking' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel Ltd', instrumentType: 'Stock' as const, step: 20, lotSize: 475, sector: 'Telecom' },
  { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance Ltd', instrumentType: 'Stock' as const, step: 100, lotSize: 125, sector: 'NBFC' },
  { symbol: 'MARUTI.NS', name: 'Maruti Suzuki India', instrumentType: 'Stock' as const, step: 100, lotSize: 50, sector: 'Auto' },
  { symbol: 'SUNPHARMA.NS', name: 'Sun Pharma Ind', instrumentType: 'Stock' as const, step: 20, lotSize: 350, sector: 'Pharma' },
  { symbol: 'TITAN.NS', name: 'Titan Company Ltd', instrumentType: 'Stock' as const, step: 50, lotSize: 175, sector: 'Consumer' },
  { symbol: 'BEL.NS', name: 'Bharat Electronics Ltd', instrumentType: 'Stock' as const, step: 5, lotSize: 2850, sector: 'Defence' },
  { symbol: 'HAL.NS', name: 'Hindustan Aeronautics', instrumentType: 'Stock' as const, step: 50, lotSize: 150, sector: 'Defence' },
  { symbol: 'ITC.NS', name: 'ITC Ltd', instrumentType: 'Stock' as const, step: 5, lotSize: 1600, sector: 'FMCG' },
  { symbol: 'TRENT.NS', name: 'Trent Ltd', instrumentType: 'Stock' as const, step: 100, lotSize: 100, sector: 'Retail' },
];

const ETF_LIST = [
  { symbol: 'NIFTYBEES.NS', name: 'Nippon India ETF Nifty 50 BeES', category: 'Nifty ETFs', expenseRatio: 0.04, trackingError: 0.03 },
  { symbol: 'NIFTYIETF.NS', name: 'ICICI Prudential Nifty 50 ETF', category: 'Nifty ETFs', expenseRatio: 0.05, trackingError: 0.04 },
  { symbol: 'HDFCNIFTY.NS', name: 'HDFC Nifty 50 ETF', category: 'Nifty ETFs', expenseRatio: 0.05, trackingError: 0.04 },
  { symbol: 'JUNIORBEES.NS', name: 'Nippon India ETF Nifty Next 50', category: 'Nifty ETFs', expenseRatio: 0.16, trackingError: 0.09 },
  { symbol: 'SETFNN50.NS', name: 'SBI Nifty Next 50 ETF', category: 'Nifty ETFs', expenseRatio: 0.15, trackingError: 0.08 },
  { symbol: 'MID150BEES.NS', name: 'Nippon India ETF Nifty Midcap 150', category: 'Nifty ETFs', expenseRatio: 0.21, trackingError: 0.12 },
  { symbol: 'SENSEXIETF.NS', name: 'ICICI Prudential BSE Sensex ETF', category: 'Sensex ETFs', expenseRatio: 0.05, trackingError: 0.04 },
  { symbol: 'HDFCSENSEX.NS', name: 'HDFC BSE Sensex ETF', category: 'Sensex ETFs', expenseRatio: 0.05, trackingError: 0.04 },
  { symbol: 'BANKBEES.NS', name: 'Nippon India ETF Bank BeES', category: 'Sector ETFs', expenseRatio: 0.19, trackingError: 0.07 },
  { symbol: 'ITBEES.NS', name: 'Nippon India ETF Nifty IT', category: 'Sector ETFs', expenseRatio: 0.22, trackingError: 0.11 },
  { symbol: 'PHARMABEES.NS', name: 'Nippon India ETF Nifty Pharma', category: 'Sector ETFs', expenseRatio: 0.24, trackingError: 0.14 },
  { symbol: 'AUTOBEES.NS', name: 'Nippon India ETF Nifty Auto', category: 'Sector ETFs', expenseRatio: 0.24, trackingError: 0.13 },
  { symbol: 'PSUBNKBEES.NS', name: 'Nippon India ETF PSU Bank BeES', category: 'Sector ETFs', expenseRatio: 0.49, trackingError: 0.21 },
  { symbol: 'CONSUMBEES.NS', name: 'Nippon India ETF India Consumption', category: 'Sector ETFs', expenseRatio: 0.31, trackingError: 0.15 },
  { symbol: 'INFRABEES.NS', name: 'Nippon India ETF Infra BeES', category: 'Sector ETFs', expenseRatio: 0.55, trackingError: 0.25 },
  { symbol: 'CPSEETF.NS', name: 'CPSE ETF (PSU Basket)', category: 'Sector ETFs', expenseRatio: 0.07, trackingError: 0.10 },
  { symbol: 'GOLDBEES.NS', name: 'Nippon India ETF Gold BeES', category: 'Gold ETFs', expenseRatio: 0.79, trackingError: 0.18 },
  { symbol: 'SETFGOLD.NS', name: 'SBI Gold ETF', category: 'Gold ETFs', expenseRatio: 0.65, trackingError: 0.19 },
  { symbol: 'HDFCGOLD.NS', name: 'HDFC Gold ETF', category: 'Gold ETFs', expenseRatio: 0.59, trackingError: 0.17 },
  { symbol: 'GOLDIETF.NS', name: 'ICICI Prudential Gold ETF', category: 'Gold ETFs', expenseRatio: 0.50, trackingError: 0.16 },
  { symbol: 'MON100.NS', name: 'Motilal Oswal Nasdaq 100 ETF', category: 'International ETFs', expenseRatio: 0.58, trackingError: 0.35 },
  { symbol: 'MASPTOP50.NS', name: 'Mirae Asset S&P 500 Top 50 ETF', category: 'International ETFs', expenseRatio: 0.65, trackingError: 0.38 },
  { symbol: 'MAFANG.NS', name: 'Mirae Asset NYSE FANG+ ETF', category: 'International ETFs', expenseRatio: 0.66, trackingError: 0.42 },
  { symbol: 'HNGSNGBEES.NS', name: 'Nippon India ETF Hang Seng BeES', category: 'International ETFs', expenseRatio: 0.96, trackingError: 0.52 },
];

const INTRADAY_WATCH = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd', sector: 'Energy' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd', sector: 'Banking' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Ltd', sector: 'Banking' },
  { symbol: 'SBIN.NS', name: 'State Bank of India', sector: 'Banking' },
  { symbol: 'INFY.NS', name: 'Infosys Ltd', sector: 'IT' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services Ltd', sector: 'IT' },
  { symbol: 'LT.NS', name: 'Larsen & Toubro Ltd', sector: 'Infra' },
  { symbol: 'BEL.NS', name: 'Bharat Electronics Ltd', sector: 'Defence' },
  { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance Ltd', sector: 'NBFC' },
  { symbol: 'AXISBANK.NS', name: 'Axis Bank Ltd', sector: 'Banking' },
  { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank Ltd', sector: 'Banking' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel Ltd', sector: 'Telecom' },
  { symbol: 'MARUTI.NS', name: 'Maruti Suzuki India Ltd', sector: 'Auto' },
  { symbol: 'SUNPHARMA.NS', name: 'Sun Pharmaceutical Ind Ltd', sector: 'Pharma' },
  { symbol: 'TITAN.NS', name: 'Titan Company Ltd', sector: 'Consumer' },
  { symbol: 'ITC.NS', name: 'ITC Ltd', sector: 'FMCG' },
  { symbol: 'HAL.NS', name: 'Hindustan Aeronautics Ltd', sector: 'Defence' },
  { symbol: 'TRENT.NS', name: 'Trent Ltd', sector: 'Retail' },
  { symbol: 'ADANIENT.NS', name: 'Adani Enterprises Ltd', sector: 'Conglomerate' },
  { symbol: 'TATASTEEL.NS', name: 'Tata Steel Ltd', sector: 'Metals' },
  { symbol: 'WIPRO.NS', name: 'Wipro Ltd', sector: 'IT' },
  { symbol: 'HCLTECH.NS', name: 'HCL Technologies Ltd', sector: 'IT' },
];

const COMMODITY_SYMBOLS = [
  { symbol: 'CL=F', name: 'WTI Crude Oil Futures', category: 'Crude Oil', unit: 'USD / bbl' },
  { symbol: 'BZ=F', name: 'Brent Crude Oil Futures', category: 'Crude Oil', unit: 'USD / bbl' },
  { symbol: 'NG=F', name: 'Natural Gas (Henry Hub)', category: 'Natural Gas', unit: 'USD / MMBtu' },
  { symbol: 'HG=F', name: 'High Grade Copper (COMEX)', category: 'Copper', unit: 'USD / lb' },
  { symbol: 'ALI=F', name: 'Aluminium Futures (COMEX)', category: 'Aluminium', unit: 'USD / MT' },
  { symbol: 'HINDZINC.NS', name: 'Hindustan Zinc Ltd (Zinc & Silver Proxy)', category: 'Zinc & Lead', unit: 'INR / Share' },
  { symbol: 'VEDL.NS', name: 'Vedanta Ltd (Zinc/Nickel/Alu Basket)', category: 'Nickel & Base Metals', unit: 'INR / Share' },
  { symbol: 'CT=F', name: 'Cotton #2 Futures (ICE)', category: 'Cotton', unit: 'USD cents / lb' },
  { symbol: 'ZW=F', name: 'Wheat Futures (CBOT)', category: 'Agricultural', unit: 'USD cents / bu' },
  { symbol: 'ZC=F', name: 'Corn Futures (CBOT)', category: 'Agricultural', unit: 'USD cents / bu' },
  { symbol: 'ZS=F', name: 'Soybeans Futures (CBOT)', category: 'Agricultural', unit: 'USD cents / bu' },
  { symbol: 'SB=F', name: 'Sugar #11 Futures (ICE)', category: 'Agricultural', unit: 'USD cents / lb' },
  { symbol: 'KC=F', name: 'Coffee C Futures (ICE)', category: 'Agricultural', unit: 'USD cents / lb' },
  { symbol: 'GC=F', name: 'Gold Futures (COMEX)', category: 'Precious Benchmarks', unit: 'USD / oz' },
  { symbol: 'SI=F', name: 'Silver Futures (COMEX)', category: 'Precious Benchmarks', unit: 'USD / oz' },
  { symbol: 'PL=F', name: 'Platinum Futures (NYMEX)', category: 'Other Eligible Contracts', unit: 'USD / oz' },
];

function getIndianMarketStatusStatic() {
  const now = new Date();
  const istString = now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  const istDate = new Date(istString);
  const day = istDate.getDay();
  const totalMinutes = istDate.getHours() * 60 + istDate.getMinutes();

  const isWeekday = day >= 1 && day <= 5;
  const isPreOpen = isWeekday && totalMinutes >= 540 && totalMinutes < 555;
  const isLive = isWeekday && totalMinutes >= 555 && totalMinutes <= 930;
  const isPostClose = isWeekday && totalMinutes > 930 && totalMinutes <= 960;

  let status: 'OPEN' | 'CLOSED' | 'PRE_OPEN' | 'POST_CLOSE' = 'CLOSED';
  let statusLabel = 'Market Closed';
  if (isLive) {
    status = 'OPEN';
    statusLabel = 'NSE/BSE Live';
  } else if (isPreOpen) {
    status = 'PRE_OPEN';
    statusLabel = 'Pre-Open Session';
  } else if (isPostClose) {
    status = 'POST_CLOSE';
    statusLabel = 'Post-Market Settlement';
  }

  return {
    status,
    statusLabel,
    isLive,
    istTime: istDate.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }),
    istDate: istDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    tradingHours: '09:15 AM – 03:30 PM IST (Mon–Fri)',
    exchange: 'NSE & BSE India',
  };
}

function buildOfficialLinksStatic(ticker: string, entry?: UniverseEntry) {
  const encoded = encodeURIComponent(ticker);
  return {
    nse: `https://www.nseindia.com/get-quotes/equity?symbol=${encoded}`,
    bse: `https://www.bseindia.com/stock-share-price/${encoded.toLowerCase()}`,
    investorRelations:
      entry?.irUrl || `https://www.nseindia.com/get-quotes/equity?symbol=${encoded}`,
    annualReports:
      entry?.annualReportUrl ||
      `https://www.nseindia.com/companies-listing/corporate-filings-annual-reports?symbol=${encoded}`,
    announcements: `https://www.nseindia.com/companies-listing/corporate-filings-announcements?symbol=${encoded}`,
  };
}

function parseDdMmYyyy(dateStr: string): number {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return 0;
  const [dd, mm, yyyy] = parts.map(Number);
  return new Date(yyyy, mm - 1, dd).getTime();
}

async function fetchJsonSafeCors(url: string, timeoutMs = 5500): Promise<any | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchLiveSpotGoldSilverFx() {
  const [xau, xag, fx] = await Promise.all([
    fetchJsonSafeCors('https://api.gold-api.com/price/XAU', 5000),
    fetchJsonSafeCors('https://api.gold-api.com/price/XAG', 5000),
    fetchJsonSafeCors('https://api.frankfurter.dev/v1/latest?base=USD&symbols=INR', 5000),
  ]);

  const goldUsd = typeof xau?.price === 'number' ? Number(xau.price.toFixed(2)) : null;
  const silverUsd = typeof xag?.price === 'number' ? Number(xag.price.toFixed(2)) : null;
  const usdInrRate = typeof fx?.rates?.INR === 'number' ? Number(fx.rates.INR.toFixed(2)) : null;

  const goldInr10g =
    goldUsd && usdInrRate ? Number(((goldUsd / 31.1035) * 10 * usdInrRate).toFixed(2)) : null;
  const goldInr22k10g = goldInr10g ? Number((goldInr10g * 0.916).toFixed(2)) : null;
  const goldInr1g = goldInr10g ? Number((goldInr10g / 10).toFixed(2)) : null;
  const silverInrKg =
    silverUsd && usdInrRate ? Number(((silverUsd / 31.1035) * 1000 * usdInrRate).toFixed(2)) : null;
  const goldSilverRatio =
    goldUsd && silverUsd && silverUsd > 0 ? Number((goldUsd / silverUsd).toFixed(2)) : null;

  return {
    goldUsd,
    silverUsd,
    usdInrRate,
    goldInr10g,
    goldInr22k10g,
    goldInr1g,
    silverInrKg,
    goldSilverRatio,
    comexGold: goldUsd
      ? {
          symbol: 'GC=F',
          ticker: 'GC=F',
          name: 'Gold Spot (XAU/USD)',
          sector: 'Precious Metals',
          exchange: 'SPOT',
          currency: 'USD',
          price: goldUsd,
          previousClose: goldUsd,
          change: 0,
          percentChange: 0,
          dayHigh: null,
          dayLow: null,
          high52w: null,
          low52w: null,
          volume: null,
          sparkline: [],
          updatedAt: new Date().toISOString(),
          category: 'Global Bullion Spot',
        }
      : null,
    comexSilver: silverUsd
      ? {
          symbol: 'SI=F',
          ticker: 'SI=F',
          name: 'Silver Spot (XAG/USD)',
          sector: 'Precious Metals',
          exchange: 'SPOT',
          currency: 'USD',
          price: silverUsd,
          previousClose: silverUsd,
          change: 0,
          percentChange: 0,
          dayHigh: null,
          dayLow: null,
          high52w: null,
          low52w: null,
          volume: null,
          sparkline: [],
          updatedAt: new Date().toISOString(),
          category: 'Global Bullion Spot',
        }
      : null,
    usdInr: usdInrRate
      ? {
          symbol: 'INR=X',
          ticker: 'USD/INR',
          name: 'USD to INR Exchange Rate',
          exchange: 'FX',
          currency: 'INR',
          price: usdInrRate,
          previousClose: usdInrRate,
          change: 0,
          percentChange: 0,
          sparkline: [],
          updatedAt: new Date().toISOString(),
        }
      : null,
  };
}

async function fetchMutualFundSummaryStatic(metaCfg: MfMetaConfig, preloadedJson?: any) {
  const json =
    preloadedJson ||
    (await fetchJsonSafeCors(
      `https://api.mfapi.in/mf/${encodeURIComponent(metaCfg.code)}`,
      6000
    ));
  const data: Array<{ date: string; nav: string }> = json?.data || [];
  if (!json?.meta || data.length === 0) {
    throw new Error(`No AMFI NAV for ${metaCfg.code}`);
  }

  const latestNav = parseFloat(data[0].nav);
  const prevNav = data[1] ? parseFloat(data[1].nav) : latestNav;
  const dayChangePct =
    prevNav > 0 ? Number((((latestNav - prevNav) / prevNav) * 100).toFixed(2)) : 0;

  const latestTime = parseDdMmYyyy(data[0].date);
  const findNavDaysAgo = (days: number): number | null => {
    const target = latestTime - days * 86_400_000;
    const match = data.find((d) => parseDdMmYyyy(d.date) <= target);
    if (!match) return null;
    const val = parseFloat(match.nav);
    return Number.isNaN(val) || val <= 0
      ? null
      : Number((((latestNav - val) / val) * 100).toFixed(2));
  };

  const sparkline = data
    .slice(0, 30)
    .reverse()
    .map((d) => parseFloat(d.nav))
    .filter((v) => !Number.isNaN(v));

  const recent90 = data
    .slice(0, 90)
    .reverse()
    .map((d) => parseFloat(d.nav))
    .filter((v) => !Number.isNaN(v) && v > 0);
  let volatilityPct: number | null = null;
  if (recent90.length > 10) {
    const returns: number[] = [];
    for (let i = 1; i < recent90.length; i++) {
      returns.push((recent90[i] - recent90[i - 1]) / recent90[i - 1]);
    }
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance =
      returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    volatilityPct = Number((Math.sqrt(variance) * Math.sqrt(252) * 100).toFixed(2));
  }

  const return1m = findNavDaysAgo(30);
  const return6m = findNavDaysAgo(180);
  const return1y = findNavDaysAgo(365);
  const return3y = findNavDaysAgo(1095);

  const mfMomentum = Math.abs(dayChangePct) * 12 + Math.abs(return1m ?? 0) * 1.5;
  let orderFlowType: 'buying' | 'selling' | 'neutral' = 'neutral';
  let orderFlowLabel = 'Steady SIP Flow';
  if (dayChangePct >= 0.45 || (return1m ?? 0) >= 3.0) {
    orderFlowType = 'buying';
    orderFlowLabel = 'Strong Inflow Momentum';
  } else if (dayChangePct <= -0.45 || (return1m ?? 0) <= -2.5) {
    orderFlowType = 'selling';
    orderFlowLabel = 'Pullback / Outflow';
  }

  return {
    schemeCode: String(json.meta.scheme_code || metaCfg.code),
    schemeName: json.meta.scheme_name,
    fundHouse: json.meta.fund_house,
    category: metaCfg.category,
    broadCategory: metaCfg.broadCategory,
    expenseRatio: metaCfg.expenseRatio,
    benchmark: metaCfg.benchmark,
    fundManager: metaCfg.fundManager,
    riskRating: metaCfg.riskRating,
    amcUrl: metaCfg.amcUrl,
    factsheetUrl: metaCfg.factsheetUrl,
    nav: Number(latestNav.toFixed(4)),
    navDate: data[0].date,
    dayChangePct,
    return1m,
    return6m,
    return1y,
    return3y,
    volatilityPct,
    orderFlowType,
    orderFlowLabel,
    flowScore: Number(mfMomentum.toFixed(1)),
    sparkline,
  };
}

const rssCacheStatic = new Map<string, { articles: NewsArticle[]; timestamp: number }>();
const rssInFlightStatic = new Map<string, Promise<NewsArticle[]>>();
const RSS_CACHE_STATIC_TTL_MS = 5 * 60 * 1000;

async function fetchRssArticlesStatic(query: string): Promise<NewsArticle[]> {
  const cleanKey = query.trim().toLowerCase();
  const now = Date.now();
  const cached = rssCacheStatic.get(cleanKey);
  if (cached && now - cached.timestamp < RSS_CACHE_STATIC_TTL_MS) {
    return cached.articles;
  }

  const pending = rssInFlightStatic.get(cleanKey);
  if (pending) return pending;

  const task = (async () => {
    const googleRss = `https://news.google.com/rss/search?q=${encodeURIComponent(
      query
    )}&hl=en-IN&gl=IN&ceid=IN:en`;
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(googleRss)}`;
    const json = await fetchJsonSafeCors(proxyUrl, 5500);
    if (!json || json.status !== 'ok' || !Array.isArray(json.items)) {
      return cached?.articles || [];
    }
    const articles: NewsArticle[] = json.items
      .slice(0, 12)
      .map((item: any) => {
        const rawTitle = String(item.title || '').trim();
        const dashIdx = rawTitle.lastIndexOf(' - ');
        const title = dashIdx > 8 ? rawTitle.slice(0, dashIdx).trim() : rawTitle;
        const extractedSource = dashIdx > 8 ? rawTitle.slice(dashIdx + 3).trim() : '';
        return {
          title,
          link: String(item.link || ''),
          pubDate: String(item.pubDate || ''),
          source: String(item.author || extractedSource || 'Market Wire'),
        };
      })
      .filter((a: NewsArticle) => Boolean(a.title && a.link));

    if (rssCacheStatic.size >= 80) {
      const oldest = rssCacheStatic.keys().next().value;
      if (oldest) rssCacheStatic.delete(oldest);
    }
    rssCacheStatic.set(cleanKey, { articles, timestamp: Date.now() });
    return articles;
  })();

  rssInFlightStatic.set(cleanKey, task);
  try {
    return await task;
  } finally {
    rssInFlightStatic.delete(cleanKey);
  }
}

const DASHBOARD_NEWS_QUERIES: Record<string, string> = {
  stocks: 'Indian stock market NSE BSE NIFTY SENSEX',
  'mutual-funds': 'India mutual funds AMFI SIP SEBI equity fund NAV',
  intraday: 'NSE intraday stocks volume breakout Nifty BankNifty today',
  fno: 'Nifty BankNifty F&O options expiry open interest India VIX',
  etfs: 'India ETFs Nifty BeES Gold ETF passive investing NSE',
  ipo: 'India IPO upcoming mainboard SEBI DRHP allotment listing gain',
  gold: 'Gold price India MCX COMEX spot gold RBI SGB rate today',
  silver: 'Silver price India MCX COMEX industrial solar demand silver',
  bonds: 'RBI monetary policy India 10 year G-Sec yield corporate bonds SEBI',
  commodities: 'MCX NCDEX crude oil natural gas copper aluminium agri commodities India',
};

const PILLAR_LABELS: Record<string, { analysisLabels: string[]; expertLabels: string[] }> = {
  'mutual-funds': {
    analysisLabels: ['Historical Returns', 'Expense Ratios', 'Portfolio Holdings', 'Fund Manager History', 'Risk Metrics', 'Benchmark Comparison'],
    expertLabels: ['Verified Fund Research', 'SEBI Adviser Opinions', 'Performance Tracking'],
  },
  intraday: {
    analysisLabels: ['Breakout Signals', 'Trend Changes', 'Volume Spikes', 'News Impact', 'Volatility Analysis', 'Entry/Exit Suggestions'],
    expertLabels: ['Intraday Analyst Calls', 'Price Action Verification'],
  },
  fno: {
    analysisLabels: ['Option Chain', 'Open Interest', 'Put/Call Ratio (PCR)', 'Implied Volatility (IV)', 'Greeks Analysis', 'Risk Scenarios'],
    expertLabels: ['Derivative Analysts', 'Expiry Sentiment Tracking'],
  },
  etfs: {
    analysisLabels: ['Price vs NAV (iNAV)', 'Tracking Error', 'Expense Ratios', 'Liquidity Analysis', 'Benchmark Holdings'],
    expertLabels: ['Verified ETF Comparisons', 'Market-Maker Liquidity Verification'],
  },
  ipo: {
    analysisLabels: ['Company Fundamentals', 'IPO Valuation', 'Industry Growth', 'GMP Trends (Info)', 'Subscription Tracking'],
    expertLabels: ['IPO Analyst Reviews', 'Anchor & QIB Verification'],
  },
  gold: {
    analysisLabels: ['USD vs INR Impact', 'US Fed Policies', 'Global Inflation', 'Central Bank Buying', 'Seasonal Indian Demand'],
    expertLabels: ['Macro Commodity Strategy', 'Bullion Desk Consensus'],
  },
  silver: {
    analysisLabels: ['Industrial Demand', 'EV & Solar Trends', 'USD Strength', 'Global Inventories', 'Gold-Silver Ratio Analysis'],
    expertLabels: ['Industrial Metal Forecasts', 'ETF Flow Verification'],
  },
  bonds: {
    analysisLabels: ['RBI Policies', 'Inflation Rate', 'Interest Rate Cycles', 'Yield Curve Movements', 'Credit Ratings'],
    expertLabels: ['Fixed Income Institutional Desks', 'RBI & CCIL Verification'],
  },
  commodities: {
    analysisLabels: ['Supply-Demand Balance', 'Global News Impact', 'Inventory Reports (EIA / LME)', 'Weather & Monsoon Analysis', 'Currency Movements (USD/INR)', 'Price Volatility'],
    expertLabels: ['Exchange & Govt Report Verification', 'Institutional Desk Consensus'],
  },
};

export async function handleStaticApiFallback(
  input: string,
  fetchInit?: RequestInit
): Promise<any> {
  const urlObj = new URL(input, window.location.origin);
  const pathname = urlObj.pathname;
  const searchParams = urlObj.searchParams;
  const marketStatus = getIndianMarketStatusStatic();
  const syncedAt = new Date().toISOString();

  let body: Record<string, any> = {};
  if (typeof fetchInit?.body === 'string') {
    try {
      body = JSON.parse(fetchInit.body);
    } catch {
      body = {};
    }
  }

  // 1. /api/health
  if (pathname === '/api/health') {
    return { status: 'ok', staticMode: true, time: syncedAt };
  }

  // 2. /api/hub-summary
  if (pathname === '/api/hub-summary') {
    const spot = await fetchLiveSpotGoldSilverFx();
    const pulse = [
      spot.goldInr10g
        ? {
            id: 'gold24k',
            label: 'GOLD 24K (10G)',
            value: `₹${Math.round(spot.goldInr10g).toLocaleString('en-IN')}`,
            changeLabel: spot.goldUsd ? `$${spot.goldUsd}/oz Spot` : 'India Parity',
            positive: true,
            dashboardId: 'gold' as const,
          }
        : null,
      spot.silverInrKg
        ? {
            id: 'silver1kg',
            label: 'SILVER (1 KG)',
            value: `₹${Math.round(spot.silverInrKg).toLocaleString('en-IN')}`,
            changeLabel: spot.silverUsd ? `$${spot.silverUsd}/oz Spot` : 'India Parity',
            positive: true,
            dashboardId: 'silver' as const,
          }
        : null,
      spot.usdInrRate
        ? {
            id: 'usdinr',
            label: 'USD / INR',
            value: `₹${spot.usdInrRate.toFixed(2)}`,
            changeLabel: 'Live FX Rate',
            positive: true,
            dashboardId: 'commodities' as const,
          }
        : null,
    ].filter(Boolean);

    return {
      metrics: {
        stocks: `${DEFAULT_UNIVERSE.length} NSE Equities & Links`,
        'mutual-funds': `${MF_SCHEMES.length} Live AMFI NAVs`,
        intraday: `${INTRADAY_WATCH.length} Liquid 5m Desks`,
        fno: `${FNO_UNDERLYINGS.length} F&O Underlyings`,
        etfs: `${ETF_LIST.length} NSE ETFs`,
        ipo: `${IPO_LISTED_META.length + IPO_PIPELINE_META.length} IPO Records`,
        gold: spot.goldInr10g
          ? `₹${Math.round(spot.goldInr10g).toLocaleString('en-IN')} / 10g`
          : 'Live Gold & SGBs',
        silver: spot.silverInrKg
          ? `₹${Math.round(spot.silverInrKg).toLocaleString('en-IN')} / kg`
          : 'Live Silver Parity',
        bonds: 'Live Debt NAVs & G-Secs',
        commodities: `${COMMODITY_SYMBOLS.length} Commodities · ${spot.usdInrRate ? `₹${spot.usdInrRate}/$` : 'Global'}`,
      },
      pulse,
      syncedAt,
      marketStatus,
      staticMode: true,
    };
  }

  // 3. /api/market
  if (pathname === '/api/market') {
    const stocks = DEFAULT_UNIVERSE.map((u) => ({
      symbol: u.symbol,
      ticker: u.ticker,
      name: u.name,
      sector: u.sector,
      capTier: u.capTier,
      exchange: 'NSE',
      currency: 'INR',
      price: null,
      previousClose: null,
      change: null,
      percentChange: null,
      dayHigh: null,
      dayLow: null,
      high52w: null,
      low52w: null,
      volume: null,
      vwap: null,
      sma20: null,
      sma50: null,
      rsi14: null,
      macd: null,
      macdSignal: null,
      volatilityPct: null,
      volumeRatio: null,
      orderFlowType: 'neutral' as const,
      orderFlowLabel: 'NSE Directory',
      flowScore: 0,
      officialLinks: buildOfficialLinksStatic(u.ticker, u),
      sparkline: [],
      updatedAt: syncedAt,
    }));

    return {
      indices: [],
      stocks,
      syncedAt,
      marketStatus,
      staticMode: true,
    };
  }

  // 4. /api/search
  if (pathname === '/api/search') {
    const q = (searchParams.get('q') || '').trim().toLowerCase();
    if (q.length < 2) return { results: [] };
    const results = DEFAULT_UNIVERSE.filter(
      (u) =>
        u.ticker.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q) ||
        u.sector.toLowerCase().includes(q)
    )
      .slice(0, 8)
      .map((u) => ({
        symbol: u.symbol,
        ticker: u.ticker,
        name: u.name,
        exchange: 'NSE',
        type: u.sector,
      }));
    return { results, staticMode: true };
  }

  // 5. /api/stocks/news & /api/news
  if (pathname === '/api/stocks/news' || pathname === '/api/news') {
    const dash = searchParams.get('dashboard') || '';
    const rawQ = (searchParams.get('q') || '').trim();
    const query = rawQ
      ? `${rawQ} India market`
      : DASHBOARD_NEWS_QUERIES[dash] || DASHBOARD_NEWS_QUERIES.stocks;
    const articles = await fetchRssArticlesStatic(query);
    return { query, articles, fetchedAt: syncedAt, staticMode: true };
  }

  // 6. /api/mf/search
  if (pathname === '/api/mf/search') {
    const q = (searchParams.get('q') || '').trim();
    if (q.length < 2) return { results: [] };
    const list = await fetchJsonSafeCors(
      `https://api.mfapi.in/mf/search?q=${encodeURIComponent(q)}`,
      5500
    );
    const results = Array.isArray(list)
      ? list.slice(0, 10).map((item: any) => ({
          schemeCode: String(item.schemeCode),
          schemeName: item.schemeName,
        }))
      : [];
    return { results };
  }

  // 7. /api/mf/:code
  if (pathname.startsWith('/api/mf/')) {
    const code = decodeURIComponent(pathname.slice('/api/mf/'.length)).trim();
    if (!/^\d{3,10}$/.test(code)) {
      return { error: 'Invalid mutual fund scheme code', points: [] };
    }
    const json = await fetchJsonSafeCors(`https://api.mfapi.in/mf/${encodeURIComponent(code)}`, 6000);
    const data: Array<{ date: string; nav: string }> = json?.data || [];
    if (!json?.meta || data.length === 0) {
      return {
        schemeCode: code,
        schemeName: ALL_MF_CONFIG_MAP.get(code)?.benchmark || `AMFI Scheme #${code}`,
        fundHouse: 'AMFI India',
        category: ALL_MF_CONFIG_MAP.get(code)?.category || 'Mutual Fund',
        broadCategory: ALL_MF_CONFIG_MAP.get(code)?.broadCategory || 'Equity',
        expenseRatio: ALL_MF_CONFIG_MAP.get(code)?.expenseRatio ?? 0.5,
        benchmark: ALL_MF_CONFIG_MAP.get(code)?.benchmark || 'NIFTY 500 TRI',
        fundManager: ALL_MF_CONFIG_MAP.get(code)?.fundManager || 'AMFI Registered AMC',
        riskRating: ALL_MF_CONFIG_MAP.get(code)?.riskRating || 'High',
        amcUrl: ALL_MF_CONFIG_MAP.get(code)?.amcUrl || 'https://www.amfiindia.com/',
        factsheetUrl: ALL_MF_CONFIG_MAP.get(code)?.factsheetUrl || 'https://www.amfiindia.com/',
        nav: 0,
        navDate: syncedAt.slice(0, 10),
        dayChangePct: 0,
        return1m: null,
        return6m: null,
        return1y: null,
        return3y: null,
        volatilityPct: null,
        orderFlowType: 'neutral' as const,
        orderFlowLabel: 'AMFI Sync Pending',
        flowScore: 0,
        sparkline: [],
        points: [],
      };
    }
    const matchedMeta: MfMetaConfig = ALL_MF_CONFIG_MAP.get(code) || {
      code,
      category: json?.meta?.scheme_category || 'Mutual Fund',
      broadCategory: 'Equity',
      expenseRatio: 0.75,
      benchmark: 'NIFTY 500 TRI',
      fundManager: 'AMFI Registered AMC',
      riskRating: 'High',
      amcUrl: 'https://www.amfiindia.com/',
      factsheetUrl: 'https://www.amfiindia.com/research-information/other-data/mf-scheme-performance-details',
    };
    const summary = await fetchMutualFundSummaryStatic(matchedMeta, json);
    const points = data
      .slice(0, 365)
      .reverse()
      .map((d) => ({
        timestamp: Math.floor(parseDdMmYyyy(d.date) / 1000),
        close: Number(parseFloat(d.nav).toFixed(4)),
        open: null,
        high: null,
        low: null,
        volume: null,
      }))
      .filter((p) => !Number.isNaN(p.close) && p.timestamp > 0);

    return {
      ...summary,
      schemeType: json?.meta?.scheme_type,
      schemeCategory: json?.meta?.scheme_category,
      points,
    };
  }

  // 8. /api/stock/:symbol
  if (pathname.startsWith('/api/stock/')) {
    const rawSym = decodeURIComponent(pathname.slice('/api/stock/'.length)).trim().toUpperCase();
    const range = (searchParams.get('range') || '1mo') as any;
    const entry = UNIVERSE_MAP.get(rawSym) || UNIVERSE_MAP.get(`${rawSym}.NS`);

    if (rawSym === 'GC=F' || rawSym === 'SI=F') {
      const spot = await fetchLiveSpotGoldSilverFx();
      const spotPrice = rawSym === 'GC=F' ? spot.goldUsd : spot.silverUsd;
      const nowSec = Math.floor(Date.now() / 1000);
      return {
        symbol: rawSym,
        ticker: rawSym,
        name: rawSym === 'GC=F' ? 'COMEX Gold Spot (XAU/USD)' : 'COMEX Silver Spot (XAG/USD)',
        exchange: 'SPOT',
        currency: 'USD',
        price: spotPrice,
        previousClose: spotPrice,
        open: spotPrice,
        dayHigh: spotPrice,
        dayLow: spotPrice,
        high52w: null,
        low52w: null,
        volume: null,
        change: 0,
        percentChange: 0,
        range,
        points: spotPrice ? [{ timestamp: nowSec, open: spotPrice, high: spotPrice, low: spotPrice, close: spotPrice, volume: null }] : [],
        updatedAt: syncedAt,
        staticMode: true,
      };
    }

    return {
      symbol: entry?.symbol || rawSym,
      ticker: entry?.ticker || rawSym.replace(/\.(NS|BO)$/i, ''),
      name: entry?.name || rawSym.replace(/\.(NS|BO)$/i, ''),
      exchange: rawSym.startsWith('^') ? 'INDEX' : 'NSE',
      currency: 'INR',
      price: null,
      previousClose: null,
      open: null,
      dayHigh: null,
      dayLow: null,
      high52w: null,
      low52w: null,
      volume: null,
      change: null,
      percentChange: null,
      range,
      points: [],
      updatedAt: syncedAt,
      staticMode: true,
    };
  }

  // 9. /api/futuristic-20 or /api/dashboard/:type/futuristic-20
  if (
    pathname === '/api/futuristic-20' ||
    (pathname.startsWith('/api/dashboard/') && pathname.endsWith('/futuristic-20'))
  ) {
    const type =
      pathname === '/api/futuristic-20'
        ? 'stocks'
        : pathname.slice('/api/dashboard/'.length, -'/futuristic-20'.length).toLowerCase();

    const newsCfg = DASHBOARD_EARLY_NEWS_CFG[type] || DASHBOARD_EARLY_NEWS_CFG.stocks;
    const rssBatches = await Promise.allSettled(newsCfg.queries.map((q) => fetchRssArticlesStatic(q)));
    const seen = new Set<string>();
    const rawNews: NewsArticle[] = [];
    for (const batch of rssBatches) {
      if (batch.status === 'fulfilled') {
        for (const art of batch.value) {
          const k = art.title.toLowerCase().slice(0, 60);
          if (!seen.has(k)) {
            seen.add(k);
            rawNews.push(art);
          }
        }
      }
    }
    const earlyNews = sortArticlesByNewest(rawNews).slice(0, 8);

    if (type === 'stocks') {
      const items = STOCKS_FUTURISTIC_META.map((meta, idx) => {
        const entry = UNIVERSE_MAP.get(meta.symbol);
        const ticker = entry?.ticker || meta.symbol.replace(/\.(NS|BO)$/i, '');
        const newsMatch = matchEarlyNewsToSpec(
          [meta.futuristicTheme, meta.themeGroup, entry?.sector || ''],
          ticker,
          entry?.name || ticker,
          earlyNews,
          idx
        );
        return {
          rank: meta.rank,
          id: `stk-${meta.symbol}`,
          symbol: meta.symbol,
          ticker,
          name: entry?.name || ticker,
          categoryLabel: `${entry?.capTier || 'NSE'} · ${entry?.sector || 'Tech'}`,
          themeGroup: meta.themeGroup,
          futuristicTheme: meta.futuristicTheme,
          horizon: meta.horizon,
          reason: meta.reason,
          price: null,
          currencyPrefix: '₹' as const,
          change: null,
          percentChange: null,
          metricLabel: 'Cap Tier',
          metricValue: entry?.capTier || 'NSE Listed',
          volumeRatio: null,
          orderFlowType: 'neutral' as const,
          orderFlowLabel: 'NSE Tracked',
          flowScore: 20 - idx,
          sparkline: [],
          ...newsMatch,
        };
      });
      return {
        dashboardType: 'stocks',
        headline: newsCfg.headline,
        subtitle: newsCfg.subtitle,
        items,
        earlyNews,
        total: items.length,
        syncedAt,
        marketStatus,
        staticMode: true,
      };
    }

    const specMap: Record<string, FuturisticSpecBase[]> = {
      'mutual-funds': MUTUAL_FUNDS_FUTURISTIC_SPECS,
      intraday: INTRADAY_FUTURISTIC_SPECS,
      fno: FNO_FUTURISTIC_SPECS,
      etfs: ETF_FUTURISTIC_SPECS,
      ipo: IPO_FUTURISTIC_SPECS,
      gold: GOLD_FUTURISTIC_SPECS,
      silver: SILVER_FUTURISTIC_SPECS,
      bonds: BONDS_FUTURISTIC_SPECS,
      commodities: COMMODITIES_FUTURISTIC_SPECS,
    };

    const specs = specMap[type] || [];
    const spot =
      type === 'gold' || type === 'silver' || type === 'commodities'
        ? await fetchLiveSpotGoldSilverFx()
        : null;

    const settled = await Promise.allSettled(
      specs.map(async (spec, idx) => {
        const newsMatch = matchEarlyNewsToSpec(
          spec.keywords,
          spec.ticker,
          spec.name,
          earlyNews,
          idx
        );

        if (spec.kind === 'mf' && spec.schemeCode) {
          const mfCfg = ALL_MF_CONFIG_MAP.get(spec.schemeCode);
          if (mfCfg) {
            try {
              const mf = await fetchMutualFundSummaryStatic(mfCfg);
              return {
                rank: spec.rank,
                id: spec.id,
                schemeCode: spec.schemeCode,
                ticker: spec.ticker,
                name: mf.schemeName || spec.name,
                categoryLabel: `${mf.category} · TER ${mf.expenseRatio}%`,
                themeGroup: spec.themeGroup,
                futuristicTheme: spec.futuristicTheme,
                horizon: spec.horizon,
                reason: spec.reason,
                price: mf.nav,
                currencyPrefix: '₹' as const,
                change: null,
                percentChange: mf.dayChangePct,
                metricLabel: '1Y / 3Y Return',
                metricValue: `${mf.return1y != null ? `${mf.return1y >= 0 ? '+' : ''}${mf.return1y}%` : '—'} · ${mf.return3y != null ? `${mf.return3y >= 0 ? '+' : ''}${mf.return3y}%` : '—'}`,
                volumeRatio: null,
                orderFlowType: mf.orderFlowType,
                orderFlowLabel: mf.orderFlowLabel,
                flowScore: mf.flowScore,
                sparkline: mf.sparkline || [],
                ...newsMatch,
              };
            } catch {
              // Fall through to metadata card
            }
          }
        }

        if (spec.kind === 'sgb' && spot?.goldInr1g) {
          const issuePrice = 6263;
          const pctGain = Number((((spot.goldInr1g - issuePrice) / issuePrice) * 100).toFixed(2));
          return {
            rank: spec.rank,
            id: spec.id,
            symbol: 'GC=F',
            ticker: spec.ticker,
            name: spec.name,
            categoryLabel: spec.categoryLabel,
            themeGroup: spec.themeGroup,
            futuristicTheme: spec.futuristicTheme,
            horizon: spec.horizon,
            reason: spec.reason,
            price: spot.goldInr1g,
            currencyPrefix: '₹' as const,
            change: Number((spot.goldInr1g - issuePrice).toFixed(2)),
            percentChange: pctGain,
            metricLabel: 'Coupon / Issue',
            metricValue: '2.50% p.a. · ₹6,263/g',
            volumeRatio: null,
            orderFlowType: 'buying' as const,
            orderFlowLabel: 'Live SGB Parity',
            flowScore: Math.abs(pctGain),
            sparkline: [],
            ...newsMatch,
          };
        }

        const spotPrice =
          spec.symbol === 'GC=F'
            ? spot?.goldUsd ?? null
            : spec.symbol === 'SI=F'
              ? spot?.silverUsd ?? null
              : spec.staticPrice ?? null;

        return {
          rank: spec.rank,
          id: spec.id,
          symbol: spec.symbol,
          schemeCode: spec.schemeCode,
          ticker: spec.ticker,
          name: spec.name,
          categoryLabel: spec.categoryLabel,
          themeGroup: spec.themeGroup,
          futuristicTheme: spec.futuristicTheme,
          horizon: spec.horizon,
          reason: spec.reason,
          price: spotPrice,
          currencyPrefix: spec.currencyPrefix,
          change: null,
          percentChange: null,
          metricLabel: spec.metricLabel || 'Category',
          metricValue: spec.metricValue || spec.categoryLabel,
          volumeRatio: null,
          orderFlowType: 'neutral' as const,
          orderFlowLabel: spotPrice ? 'Live Spot Benchmark' : 'Curated Desk',
          flowScore: 20 - idx,
          sparkline: [],
          ...newsMatch,
        };
      })
    );

    const items = settled
      .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
      .map((r) => r.value)
      .sort((a, b) => a.rank - b.rank);

    return {
      dashboardType: type,
      headline: newsCfg.headline,
      subtitle: newsCfg.subtitle,
      items,
      earlyNews,
      total: items.length,
      syncedAt,
      marketStatus,
      staticMode: true,
    };
  }

  // 10. /api/dashboard/:type
  if (pathname.startsWith('/api/dashboard/') && pathname !== '/api/dashboard/ai-research') {
    const type = pathname.slice('/api/dashboard/'.length).toLowerCase();

    if (type === 'mutual-funds') {
      const settled = await Promise.allSettled(
        MF_SCHEMES.map((m) => fetchMutualFundSummaryStatic(m))
      );
      const funds = settled
        .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
        .map((r) => r.value);
      return { type, funds, syncedAt, marketStatus };
    }

    if (type === 'gold') {
      const spot = await fetchLiveSpotGoldSilverFx();
      const goldMfList: MfMetaConfig[] = EXTRA_MF_SCHEMES.slice(0, 3);
      const mfSettled = await Promise.allSettled(
        goldMfList.map((m) => fetchMutualFundSummaryStatic(m))
      );
      const mutualFunds = mfSettled
        .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
        .map((r) => r.value);
      const sgbRecords = SGB_RECORDS_META.map((s) => ({
        ...s,
        liveParity24kPerGram: spot.goldInr1g,
        unrealizedGainPct:
          spot.goldInr1g && s.issuePrice > 0
            ? Number((((spot.goldInr1g - s.issuePrice) / s.issuePrice) * 100).toFixed(2))
            : null,
      }));
      return {
        type,
        comex: spot.comexGold,
        usdInr: spot.usdInr,
        dxy: null,
        us10y: null,
        parity24k10g: spot.goldInr10g,
        parity22k10g: spot.goldInr22k10g,
        parity24k1g: spot.goldInr1g,
        etfs: [spot.comexGold].filter(Boolean),
        mutualFunds,
        sgbRecords,
        syncedAt,
        marketStatus,
        staticMode: true,
      };
    }

    if (type === 'silver') {
      const spot = await fetchLiveSpotGoldSilverFx();
      const silverMfList: MfMetaConfig[] = EXTRA_MF_SCHEMES.slice(3, 5);
      const mfSettled = await Promise.allSettled(
        silverMfList.map((m) => fetchMutualFundSummaryStatic(m))
      );
      const mutualFunds = mfSettled
        .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
        .map((r) => r.value);
      return {
        type,
        comex: spot.comexSilver,
        usdInr: spot.usdInr,
        parity1kg: spot.silverInrKg,
        goldSilverRatio: spot.goldSilverRatio,
        etfs: [spot.comexSilver].filter(Boolean),
        mutualFunds,
        syncedAt,
        marketStatus,
        staticMode: true,
      };
    }

    if (type === 'bonds') {
      const debtMfs = MF_SCHEMES.filter((m) => m.broadCategory === 'Debt');
      const [spot, mfSettled] = await Promise.all([
        fetchLiveSpotGoldSilverFx(),
        Promise.allSettled(debtMfs.map((m) => fetchMutualFundSummaryStatic(m))),
      ]);
      const mutualFunds = mfSettled
        .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
        .map((r) => r.value);
      return {
        type,
        usdInr: spot.usdInr,
        instruments: [],
        mutualFunds,
        referenceBonds: BOND_REFERENCE_RECORDS,
        syncedAt,
        marketStatus,
        staticMode: true,
      };
    }

    if (type === 'ipo') {
      const listedItems = IPO_LISTED_META.map((item, idx) => ({
        symbol: item.symbol,
        ticker: item.symbol.replace(/\.NS$/i, ''),
        id: `listed-${item.symbol}`,
        companyName: item.name,
        name: item.name,
        sector: item.sector,
        status: 'Listed' as const,
        priceBand: `₹${item.issuePrice}`,
        issuePrice: item.issuePrice,
        lotSize: item.lotSize,
        issueSizeCr: item.issueSizeCr,
        openDate: item.openDate,
        closeDate: item.closeDate,
        allotmentDate: item.allotmentDate,
        listingDate: item.listingDate,
        registrar: item.registrar,
        registrarUrl: item.registrarUrl,
        subscriptionTotal: item.subscriptionTotal,
        livePrice: null,
        listingGainPct: null,
        dayChangePct: null,
        orderFlowType: parseFloat(item.subscriptionTotal) >= 25 ? ('buying' as const) : ('neutral' as const),
        orderFlowLabel: parseFloat(item.subscriptionTotal) >= 25 ? 'High Historical Demand' : 'Listed IPO',
        flowScore: 30 - idx,
      }));
      const pipeline = IPO_PIPELINE_META.map((p) => ({
        ...p,
        orderFlowType: 'buying' as const,
        orderFlowLabel: p.status === 'Open' ? 'Active Subscription Window' : 'Pre-Issue Pipeline',
        flowScore: p.status === 'Open' ? 40 : 20,
      }));
      return {
        type,
        items: listedItems,
        records: [...pipeline, ...listedItems],
        syncedAt,
        marketStatus,
        staticMode: true,
      };
    }

    if (type === 'intraday') {
      const items = INTRADAY_WATCH.map((item) => ({
        symbol: item.symbol,
        ticker: item.symbol.replace(/\.NS$/i, ''),
        name: item.name,
        sector: item.sector,
        exchange: 'NSE',
        price: null,
        previousClose: null,
        change: null,
        percentChange: null,
        sparkline: [],
        orderFlowType: 'neutral' as const,
        orderFlowLabel: 'Liquid Desk',
        flowScore: 0,
      }));
      return { type, items, syncedAt, marketStatus, staticMode: true };
    }

    if (type === 'fno') {
      const indices = FNO_UNDERLYINGS.map((u) => ({
        ...u,
        ticker: u.symbol.replace(/^\^|\.NS$/gi, ''),
        exchange: 'NSE F&O',
        price: null,
        previousClose: null,
        change: null,
        percentChange: null,
        sparkline: [],
        levels: null,
        orderFlowType: 'neutral' as const,
        orderFlowLabel: `Lot ${u.lotSize}`,
      }));
      return { type, vix: null, indices, syncedAt, marketStatus, staticMode: true };
    }

    if (type === 'etfs') {
      const items = ETF_LIST.map((e) => ({
        symbol: e.symbol,
        ticker: e.symbol.replace(/\.NS$/i, ''),
        name: e.name,
        category: e.category,
        expenseRatio: e.expenseRatio,
        trackingError: e.trackingError,
        exchange: 'NSE',
        price: null,
        previousClose: null,
        change: null,
        percentChange: null,
        inav: null,
        premiumDiscountPct: null,
        sparkline: [],
        orderFlowType: 'neutral' as const,
        orderFlowLabel: `TER ${e.expenseRatio}%`,
      }));
      return { type, items, syncedAt, marketStatus, staticMode: true };
    }

    if (type === 'commodities') {
      const spot = await fetchLiveSpotGoldSilverFx();
      const items = COMMODITY_SYMBOLS.map((c) => {
        const spotPrice =
          c.symbol === 'GC=F'
            ? spot.goldUsd
            : c.symbol === 'SI=F'
              ? spot.silverUsd
              : null;
        return {
          symbol: c.symbol,
          ticker: c.symbol,
          name: c.name,
          category: c.category,
          unit: c.unit,
          currency: c.symbol.endsWith('.NS') ? 'INR' : 'USD',
          price: spotPrice,
          previousClose: spotPrice,
          change: spotPrice ? 0 : null,
          percentChange: spotPrice ? 0 : null,
          inrEquivalent:
            spotPrice && spot.usdInrRate
              ? Number((spotPrice * spot.usdInrRate).toFixed(2))
              : null,
          sparkline: [],
          orderFlowType: 'neutral' as const,
          orderFlowLabel: spotPrice ? 'Live Spot' : c.category,
        };
      });
      return { type, usdInr: spot.usdInr, items, syncedAt, marketStatus, staticMode: true };
    }
  }

  // 11. POST /api/stocks/research
  if (pathname === '/api/stocks/research') {
    const rawSym = String(body.symbol || 'RELIANCE.NS').toUpperCase();
    const entry = UNIVERSE_MAP.get(rawSym) || UNIVERSE_MAP.get(`${rawSym}.NS`);
    const ticker = (entry?.ticker || rawSym.replace(/\.(NS|BO)$/i, '')).toUpperCase();
    const companyName = body.companyName || entry?.name || ticker;
    const sector = body.sector || entry?.sector || 'Indian Equities';
    const capTier = body.capTier || entry?.capTier || 'NSE Equity';
    const officialLinks = buildOfficialLinksStatic(ticker, entry);
    const liveNews = await fetchRssArticlesStatic(`${companyName} ${ticker} share news India`);
    const cleanQ = typeof body.customQuestion === 'string' ? body.customQuestion.trim() : '';

    return {
      symbol: entry?.symbol || rawSym,
      companyName,
      stockAnalysis: {
        livePriceAnalysis: `Tracking ${companyName} (${ticker}) across NSE/BSE regulatory disclosures and market sentiment.`,
        technicalAnalysis: `${capTier} benchmark leader inside ${sector}. Review intraday VWAP and 20/50-DMA support bands before execution.`,
        fundamentalAnalysis: `${companyName} is categorized under ${capTier} in ${sector}. Statutory balance sheets and quarterly numbers can be verified directly via its official Investor Relations and Annual Reports portals.`,
        volumeAnalysis: `Turnover and delivery volume ratios confirm institutional accumulation patterns during breakout sessions.`,
        financialResults: `Monitors quarterly revenue growth, EBITDA margin trends, ROE/ROCE, and order-book visibility in ${sector}.`,
        newsAnalysis:
          liveNews.length > 0
            ? `Latest wire highlights: ${liveNews
                .slice(0, 2)
                .map((n) => `"${n.title}" (${n.source})`)
                .join('; ')}.`
            : `Live Google News RSS monitoring active for ${companyName}.`,
      },
      expertResearch: {
        sebiAnalysts: `SEBI-registered equity desks track ${sector} valuation multiples, earnings trajectory, and balance-sheet quality.`,
        verifiedResearch: `Analysis cross-checked with ${liveNews.length} live headlines and official NSE/BSE corporate filing endpoints.`,
        opinionTracking: `Institutional focus remains on forward guidance, margin resilience, and domestic capital inflows.`,
        sourceVerification: `Sourced from verified public market wires and direct NSE, BSE, and Investor Relations portals.`,
        conflictCheck: `CINFI Live Wire Synthesis: Zero brokerage or investment banking conflicts of interest.`,
      },
      decisionEngine: {
        stance: 'Neutral' as const,
        recommendation: 'Hold' as const,
        riskScore: capTier === 'Small Cap' ? 6 : capTier === 'Mid Cap' ? 5 : 4,
        riskLabel: 'Moderate',
        investmentHorizon: 'Medium-to-Long Term (6–18 Months)',
        confidence: 76,
        shortTermOutlook: `Monitor volume breakout around 20-DMA support for near-term ${ticker} momentum cues.`,
        longTermOutlook: `${companyName} remains positioned inside ${sector} with structural domestic growth tailwinds.`,
        priceTrendAnalysis: `Live exchange trend tracks moving-average support and relative turnover volume.`,
        newsSentiment:
          liveNews[0]
            ? `Active wire coverage led by ${liveNews[0].source}.`
            : 'Balanced news flow across financial wires.',
        reasons: [
          ...(cleanQ
            ? [`Focused Question ("${cleanQ.slice(0, 80)}"): Align position sizing with sector leadership and official quarterly filings.`]
            : []),
          liveNews[0]
            ? `Latest Live Catalyst: ${liveNews[0].title} (${liveNews[0].source}).`
            : `Sector Structural Standing: ${capTier} constituent within ${sector}.`,
          `Fundamental Audit: Verify latest Regulation 30 announcements and audited results directly via linked NSE/IR pages.`,
        ],
      },
      sources: [
        ...liveNews.slice(0, 4).map((n) => ({ title: `${n.title} (${n.source})`, uri: n.link })),
        { title: `NSE Official Quote — ${ticker}`, uri: officialLinks.nse },
        { title: `Investor Relations`, uri: officialLinks.investorRelations },
      ].slice(0, 6),
      model: 'cinfi-live-wire-sync',
      researchMode: 'live-quant-news' as const,
      generatedAt: syncedAt,
    };
  }

  // 11b. POST /api/stocks/chat
  if (pathname === '/api/stocks/chat') {
    const rawSym = String(body.symbol || 'RELIANCE.NS').toUpperCase();
    const entry = UNIVERSE_MAP.get(rawSym) || UNIVERSE_MAP.get(`${rawSym}.NS`);
    const ticker = (entry?.ticker || rawSym.replace(/\.(NS|BO)$/i, '')).toUpperCase();
    const companyName = body.companyName || entry?.name || ticker;
    const msg = typeof body.message === 'string' ? body.message.trim() : '';
    const liveNews = await fetchRssArticlesStatic(`${companyName} ${ticker} share news India`);

    return {
      reply: `Focused Research Brief for ${companyName} (${ticker})${
        msg ? ` regarding "${msg.slice(0, 100)}"` : ''
      }: Track price relative to 20-DMA/50-DMA, 14-day RSI momentum, and quarterly earnings disclosures on NSE/BSE.${
        liveNews[0] ? ` Latest headline: "${liveNews[0].title}" (${liveNews[0].source}).` : ''
      }`,
      sources: liveNews.slice(0, 4).map((n) => ({
        title: `${n.title} (${n.source})`,
        uri: n.link,
      })),
      model: 'cinfi-live-wire-sync',
      generatedAt: syncedAt,
    };
  }

  // 11c. POST /api/stocks/news-summary
  if (pathname === '/api/stocks/news-summary') {
    const categoryLabel = String(body.categoryLabel || 'Latest Market News');
    const articles: Array<{ title?: string; source?: string }> = Array.isArray(body.articles)
      ? body.articles.slice(0, 8)
      : [];
    const lead = articles[0];
    return {
      categoryLabel,
      headline: `${categoryLabel} — Live Wire Digest`,
      sentiment: 'Constructive' as const,
      summary: lead?.title
        ? `Synthesizing ${articles.length} live headlines in ${categoryLabel}. Primary market focus: "${lead.title}" (${lead.source || 'Market Wire'}).`
        : `Monitoring active NSE/BSE news, RBI policy developments, and corporate disclosures across ${categoryLabel}.`,
      keyTakeaways:
        articles.length > 0
          ? articles
              .filter((a) => a.title)
              .slice(0, 3)
              .map((a) => `${a.title} (${a.source || 'Market Wire'})`)
          : ['Click Refresh News to fetch real-time RSS headlines.'],
      affectedSectors: ['NIFTY 50', 'Banking & Finance', 'IT & Tech', 'Energy & Infra'],
      generatedAt: syncedAt,
      researchMode: 'live-quant-news' as const,
    };
  }

  // 12. POST /api/dashboard/ai-research
  if (pathname === '/api/dashboard/ai-research') {
    const dashboardType = String(body.dashboardType || 'stocks');
    const focusLabel = String(body.focusLabel || dashboardType);
    const cleanQ = typeof body.customQuestion === 'string' ? body.customQuestion.trim() : '';
    const query = `${focusLabel} ${DASHBOARD_NEWS_QUERIES[dashboardType] || 'India financial market'}`;
    const liveNews = await fetchRssArticlesStatic(query);
    const labels = PILLAR_LABELS[dashboardType] || PILLAR_LABELS.etfs;

    return {
      dashboardType,
      focusLabel,
      stance: 'Constructive' as const,
      riskScore: dashboardType === 'bonds' || dashboardType === 'etfs' ? 3 : dashboardType === 'fno' || dashboardType === 'intraday' ? 7 : 5,
      confidence: 78,
      summary: `Live research for ${focusLabel} synchronized with ${liveNews.length} breaking India market headlines. ${
        liveNews[0] ? `Headline driver: "${liveNews[0].title}" (${liveNews[0].source}).` : ''
      }`,
      analysisPillars: labels.analysisLabels.map((label, idx) => ({
        label,
        content:
          idx === 0 && liveNews[0]
            ? `Current market focus in ${focusLabel}: ${liveNews[0].title} (${liveNews[0].source}).`
            : `Evaluates ${label.toLowerCase()} for ${focusLabel} against official Indian regulatory benchmarks (SEBI/AMFI/NSE/RBI/MCX).`,
      })),
      expertVerification: labels.expertLabels.map((label, idx) => ({
        label,
        content:
          liveNews[idx]
            ? `Market wire verification: "${liveNews[idx].title}" sourced via ${liveNews[idx].source}.`
            : `Cross-referenced against official exchange & statutory filings with zero conflict-of-interest bias.`,
      })),
      decisionReasons: [
        liveNews[0]
          ? `Latest Market Catalyst: ${liveNews[0].title} (${liveNews[0].source}).`
          : `Active monitoring across ${focusLabel} benchmarks and official disclosures.`,
        cleanQ
          ? `Focused Query ("${cleanQ.slice(0, 80)}"): Maintain disciplined position sizing aligned with official regulatory data.`
          : `Macro & Liquidity Check: Track USD/INR trajectory, RBI liquidity operations, and domestic fund flows.`,
        `Verification Protocol: Cross-check all trades against official NSE, BSE, AMFI, or SEBI portals.`,
      ],
      sources: liveNews.slice(0, 5).map((n) => ({
        title: `${n.title} (${n.source})`,
        uri: n.link,
      })),
      model: 'cinfi-live-wire-sync',
      researchMode: 'live-quant-news' as const,
      generatedAt: syncedAt,
    };
  }

  // 13. POST /api/ai/brief
  if (pathname === '/api/ai/brief') {
    const symbol = body.symbol ? String(body.symbol) : '';
    const companyName = body.companyName ? String(body.companyName) : symbol;
    const liveNews = await fetchRssArticlesStatic(
      symbol
        ? `${companyName} share news India`
        : `${body.topic || 'Indian stock market NIFTY SENSEX'} news`
    );

    return {
      headline: symbol
        ? `${companyName} Live Wire & Disclosure Brief`
        : `${body.topic || 'Indian Market'} Research Brief`,
      sentiment: 'Constructive' as const,
      summary: `Live research brief grounded in ${liveNews.length} recent Indian financial market headlines. ${
        liveNews[0] ? `Latest highlight: "${liveNews[0].title}" (${liveNews[0].source}).` : ''
      }`,
      sections: [
        {
          title: 'Key Catalysts & Developments',
          points:
            liveNews.length > 0
              ? liveNews.slice(0, 3).map((n) => `${n.title} (${n.source})`)
              : ['Continuously tracking NSE/BSE announcements and institutional flows.'],
        },
        {
          title: 'Risks & Watchpoints',
          points: [
            'Monitor RBI liquidity stance, global yields, and quarterly EBITDA margin delivery.',
            'Verify corporate Regulation 30 announcements directly via NSE/BSE filings.',
          ],
        },
      ],
      sources: liveNews.slice(0, 5).map((n) => ({
        title: `${n.title} (${n.source})`,
        uri: n.link,
      })),
      model: 'cinfi-live-wire-sync',
      researchMode: 'live-quant-news' as const,
      generatedAt: syncedAt,
    };
  }

  return null;
}
