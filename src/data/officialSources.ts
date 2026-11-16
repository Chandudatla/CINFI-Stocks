import { DashboardId, OfficialSourceLink } from '../types/market';

export function getOfficialSourcesForDashboard(
  dashboardId: Exclude<DashboardId, 'stocks' | 'mutual-funds'>,
  selectedSymbol?: string
): OfficialSourceLink[] {
  const ticker = (selectedSymbol || 'RELIANCE.NS').replace(/\.(NS|BO)$/i, '');

  switch (dashboardId) {
    case 'intraday':
      return [
        {
          title: 'NSE India — Volume Spurts & Live Market',
          category: 'NSE India',
          description: 'Official exchange intraday gainers, losers, volume breakouts, and market depth.',
          url: 'https://www.nseindia.com/market-data/volume-gainers-spurts',
        },
        {
          title: 'BSE India — Intraday Equity Quotes',
          category: 'BSE India',
          description: 'Live Bombay Stock Exchange order book, circuit limits, and intraday turnover.',
          url: 'https://www.bseindia.com/markets/Equity/EQReports/MarketWatch.html',
        },
        {
          title: 'Authorized Live Market Data Feeds (NSE)',
          category: 'Authorized Feeds',
          description: 'NSE Data & Analytics official real-time broadcast and tick-by-tick data specs.',
          url: 'https://www.nseindia.com/market-data/market-watch',
        },
        {
          title: `${ticker} — Exchange Corporate Announcements`,
          category: 'Announcements',
          description: `Real-time NSE Regulation 30 material filings and intraday triggers for ${ticker}.`,
          url: `https://www.nseindia.com/companies-listing/corporate-filings-announcements?symbol=${encodeURIComponent(ticker)}`,
        },
      ];

    case 'fno':
      return [
        {
          title: 'NSE Derivatives — Live Option Chain',
          category: 'NSE Derivatives',
          description: 'Official NIFTY, BANK NIFTY & Stock Option Chain OI, IV, and Change in OI.',
          url: 'https://www.nseindia.com/option-chain',
        },
        {
          title: 'BSE Derivatives — Sensex & Bankex F&O',
          category: 'BSE Derivatives',
          description: 'Official BSE equity derivatives quotes, Sensex weekly/monthly contracts, and OI.',
          url: 'https://www.bseindia.com/markets/Derivatives/DeriReports/DeriMarketWatch.html',
        },
        {
          title: 'F&O Lot Sizes & Contract Specifications',
          category: 'Contract Specs',
          description: 'Official NSE market lots, freeze quantities, tick sizes, and F&O eligible lists.',
          url: 'https://www.nseindia.com/products-services/equity-derivatives-contract-specification',
        },
        {
          title: 'NSE & SEBI Derivatives Circulars',
          category: 'Exchange Circulars',
          description: 'Margin frameworks, SEBI F&O lot-size revisions, and MWPL ban period notices.',
          url: 'https://www.nseindia.com/resources/exchange-communication-circulars',
        },
      ];

    case 'etfs':
      return [
        {
          title: 'NSE India — Live ETF Market Watch',
          category: 'NSE / BSE',
          description: 'Official NSE Exchange Traded Funds quotes, iNAV benchmarks, and daily volumes.',
          url: 'https://www.nseindia.com/market-data/exchange-traded-funds-etf',
        },
        {
          title: 'Nippon India & SBI ETF Issuer Portals',
          category: 'ETF Issuers',
          description: 'Official India BeES and SBI ETF sponsor websites with real-time iNAV feeds.',
          url: 'https://etf.nipponindiaim.com/',
        },
        {
          title: 'AMFI & AMC ETF Monthly Factsheets',
          category: 'Fund Factsheets',
          description: 'Official basket compositions, creation units, expense ratios, and tracking error logs.',
          url: 'https://www.amfiindia.com/investor-corner/knowledge-center/exchange-traded-funds.html',
        },
        {
          title: 'SEBI & AMC iNAV Disclosures',
          category: 'NAV Disclosures',
          description: 'Statutory end-of-day NAV and intraday indicative NAV transparency filings.',
          url: 'https://www.bseindia.com/markets/etf/etf_marketwatch.html',
        },
      ];

    case 'ipo':
      return [
        {
          title: 'SEBI Public Issue Filings (DRHP / RHP)',
          category: 'SEBI Filings',
          description: 'Official Securities and Exchange Board of India draft and final offer documents.',
          url: 'https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=10',
        },
        {
          title: 'NSE India — Active & Upcoming IPOs',
          category: 'NSE IPO Section',
          description: 'Live QIB, NII, and Retail subscription status during active IPO bidding windows.',
          url: 'https://www.nseindia.com/market-data/all-upcoming-issues-ipo',
        },
        {
          title: 'BSE India — Primary Market IPO Watch',
          category: 'BSE IPO Section',
          description: 'Live BSE cumulative bid details, anchor investor books, and SME/Mainboard listings.',
          url: 'https://www.bseindia.com/publicissue.html',
        },
        {
          title: 'KFin Technologies — IPO Allotment Status',
          category: 'Registrar Portal',
          description: 'Official registrar portal for checking PAN-based IPO allotment status.',
          url: 'https://ris.kfintech.com/ipostatus/',
        },
        {
          title: 'Link Intime (MUFG) — IPO Allotment Portal',
          category: 'Registrar Portal',
          description: 'Check mainboard & SME IPO application allotment and refund status.',
          url: 'https://linkintime.co.in/initial_offer/public-issues.html',
        },
      ];

    case 'gold':
      return [
        {
          title: 'MCX India — Gold & Gold Mini Futures',
          category: 'MCX',
          description: 'Multi Commodity Exchange live domestic gold futures, open interest, and contract specs.',
          url: 'https://www.mcxindia.com/market-data/market-watch',
        },
        {
          title: 'RBI — Sovereign Gold Bond (SGB) Portal',
          category: 'RBI',
          description: 'Reserve Bank of India official SGB tranche schedules, redemption prices, and rules.',
          url: 'https://www.rbi.org.in/commonperson/English/Scripts/FAQs.aspx?Id=1658',
        },
        {
          title: 'SEBI Gold Exchange & ETF Guidelines',
          category: 'SEBI',
          description: 'Regulatory framework for Gold ETFs, Electronic Gold Receipts (EGR), and bullion vaults.',
          url: 'https://www.sebi.gov.in/',
        },
        {
          title: 'Nippon / SBI / HDFC Gold ETF Disclosures',
          category: 'ETF Issuers',
          description: 'Physical 995-purity vault audit reports and daily Gold ETF NAV disclosures.',
          url: 'https://etf.nipponindiaim.com/',
        },
        {
          title: 'World Gold Council & CME COMEX Benchmarks',
          category: 'International',
          description: 'Global central bank gold reserves data, LBMA fixings, and COMEX bullion pricing.',
          url: 'https://www.gold.org/goldhub/data',
        },
      ];

    case 'silver':
      return [
        {
          title: 'MCX India — Silver 30kg & Mini Futures',
          category: 'MCX',
          description: 'Official MCX domestic silver contracts, turnover, and margin parameters.',
          url: 'https://www.mcxindia.com/market-data/market-watch',
        },
        {
          title: 'SEBI Bullion & Commodity Derivatives Rules',
          category: 'SEBI',
          description: 'SEBI guidelines governing Silver ETFs, mutual fund FoFs, and commodity exchanges.',
          url: 'https://www.sebi.gov.in/',
        },
        {
          title: 'Silver ETF Issuers (Nippon / HDFC / ICICI / SBI)',
          category: 'ETF Issuers',
          description: 'Official daily Silver ETF NAVs, vault bar lists, and tracking error disclosures.',
          url: 'https://www.nseindia.com/market-data/exchange-traded-funds-etf',
        },
        {
          title: 'CME COMEX & LBMA Global Silver Benchmarks',
          category: 'Global Exchanges',
          description: 'International spot & futures silver reference quotes and warehouse inventories.',
          url: 'https://www.cmegroup.com/markets/metals/precious/silver.html',
        },
        {
          title: 'The Silver Institute — Solar & Industrial Reports',
          category: 'Industry Reports',
          description: 'Global World Silver Survey covering photovoltaic solar, EV, and electronics demand.',
          url: 'https://www.silverinstitute.org/',
        },
      ];

    case 'bonds':
      return [
        {
          title: 'RBI Retail Direct — G-Sec, T-Bills & SDL',
          category: 'RBI',
          description: 'Official Reserve Bank of India primary auctions for T-Bills, Dated G-Secs & SDLs.',
          url: 'https://rbiretaildirect.org.in/',
        },
        {
          title: 'SEBI Corporate Bonds & OBPP Regulations',
          category: 'SEBI',
          description: 'Online Bond Platform Providers framework, credit rating rules, and debt disclosures.',
          url: 'https://www.sebi.gov.in/',
        },
        {
          title: 'NSE Debt Market & NCB Bidding Segment',
          category: 'NSE Debt',
          description: 'Live NSE Corporate Bond trades, G-Sec Request-for-Quote (RFQ), and Debt ETFs.',
          url: 'https://www.nseindia.com/market-data/bonds-traded-in-capital-market',
        },
        {
          title: 'BSE Debt Segment & Listed NCDs',
          category: 'BSE Debt',
          description: 'BSE Bond platform order book, public NCD issues, and daily yield settlements.',
          url: 'https://www.bseindia.com/markets/debt/debt_marketwatch.aspx',
        },
        {
          title: 'CCIL & NSDL Corporate Bond Disclosures',
          category: 'Issuer Disclosures',
          description: 'Clearing Corporation of India NDS-OM yield curve and ISIN maturity database.',
          url: 'https://www.ccilindia.com/',
        },
      ];

    case 'commodities':
      return [
        {
          title: 'MCX India — Energy & Base Metals Exchange',
          category: 'MCX',
          description: 'Official Multi Commodity Exchange quotes for Crude Oil, Natural Gas, Copper, Aluminium & Zinc.',
          url: 'https://www.mcxindia.com/market-data/market-watch',
        },
        {
          title: 'NCDEX — Indian Agri Commodity Exchange',
          category: 'NCDEX',
          description: 'Official National Commodity & Derivatives Exchange live spot/futures for Cotton, Spices & Grains.',
          url: 'https://www.ncdex.com/markets/livespot',
        },
        {
          title: 'CME / ICE / LME Contract Specifications',
          category: 'Exchange Contracts',
          description: 'Global contract units, tick sizes, delivery months, and inventory reports.',
          url: 'https://www.cmegroup.com/markets/energy.html',
        },
        {
          title: 'Agmarknet & USDA / EIA Commodity Reports',
          category: 'Government Reports',
          description: 'Indian Ministry of Agriculture spot mandis plus US EIA Crude Inventory & USDA WASDE data.',
          url: 'https://agmarknet.gov.in/',
        },
        {
          title: 'World Bank Commodity Markets Pink Sheet',
          category: 'Global Sources',
          description: 'Monthly global commodity price indices, supply balances, and energy/metal forecasts.',
          url: 'https://www.worldbank.org/en/research/commodity-markets',
        },
      ];
  }
}
