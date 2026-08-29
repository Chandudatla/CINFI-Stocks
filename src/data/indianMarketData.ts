import { CompanyStock, FutureThemeCategory, MarketIndex } from '../types/stock';
import { buildCompleteStocksData } from './stockUniverse';

export const MARKET_INDICES: MarketIndex[] = [
  {
    name: 'NIFTY 50',
    symbol: '^NSEI',
    current: 24862.40,
    change: 142.80,
    percentChange: 0.58,
    high52w: 26277.35,
    low52w: 21281.45,
    volume: '24.8 Cr shares'
  },
  {
    name: 'SENSEX',
    symbol: '^BSESN',
    current: 81455.90,
    change: 485.20,
    percentChange: 0.60,
    high52w: 85978.25,
    low52w: 70001.60,
    volume: '12.4 Cr shares'
  },
  {
    name: 'BANK NIFTY',
    symbol: '^NSEBANK',
    current: 52340.15,
    change: 288.60,
    percentChange: 0.55,
    high52w: 54467.35,
    low52w: 44429.10,
    volume: '15.2 Cr shares'
  },
  {
    name: 'NIFTY IT',
    symbol: '^CNXIT',
    current: 41890.30,
    change: -110.45,
    percentChange: -0.26,
    high52w: 43250.00,
    low52w: 30850.20,
    volume: '6.8 Cr shares'
  },
  {
    name: 'NIFTY DEFENCE',
    symbol: '^CNXDEFENCE',
    current: 7850.70,
    change: 154.20,
    percentChange: 2.00,
    high52w: 8320.00,
    low52w: 4210.00,
    volume: '8.1 Cr shares'
  },
  {
    name: 'NIFTY AUTO',
    symbol: '^CNXAUTO',
    current: 25410.80,
    change: 188.10,
    percentChange: 0.75,
    high52w: 26100.00,
    low52w: 16500.00,
    volume: '9.4 Cr shares'
  }
];

export const FUTURE_THEMES: FutureThemeCategory[] = [
  {
    id: 'ai-infra',
    name: 'Artificial Intelligence & Data Centers',
    category: 'Artificial Intelligence',
    description: 'Companies building enterprise AI software, sovereign AI compute racks, high-density data centers, optical networking, and AI liquid cooling infrastructure.',
    stockCount: 14,
    avgScore: 88.4,
    tailwindHighlights: [
      'India AI Mission allocated ₹10,372 Cr for sovereign GPU compute cluster.',
      'Data center capacity expected to surge from 1.1 GW to 3.5 GW by 2028.'
    ],
    governmentInitiative: 'IndiaAI Mission & Digital India Cloud Infratech',
    iconName: 'Cpu'
  },
  {
    id: 'ev-batteries',
    name: 'Electric Vehicles & Battery Ecosystem',
    category: 'Energy & Transition',
    description: 'Electric 2W/4W OEMs, Lithium-ion cell chemistry manufacturers, battery recycling, motor controllers, and high-voltage DC fast-charging networks.',
    stockCount: 19,
    avgScore: 86.2,
    tailwindHighlights: [
      'PM E-DRIVE scheme with ₹10,900 Cr outlay supporting e-2W, e-3W, and e-buses.',
      'PLI scheme for Advanced Chemistry Cell (ACC) Battery Storage (50 GWh).'
    ],
    governmentInitiative: 'PM E-DRIVE Scheme & ACC Battery PLI',
    iconName: 'Zap'
  },
  {
    id: 'semiconductors',
    name: 'Semiconductor Fabrication & Chip Design',
    category: 'Semiconductors & DeepTech',
    description: 'Fab units, ATMP (Assembly, Testing, Marking, Packaging), OSAT facilities, VLSI chip design houses, and compound semiconductor foundries.',
    stockCount: 11,
    avgScore: 87.6,
    tailwindHighlights: [
      'India Semiconductor Mission (ISM) with $10 Billion (₹76,000 Cr) incentive package.',
      '5 major semiconductor units under construction in Gujarat and Assam.'
    ],
    governmentInitiative: 'India Semiconductor Mission (ISM) Modified Scheme',
    iconName: 'Microchip'
  },
  {
    id: 'defence-aerospace',
    name: 'Defence Indigenisation & Drones',
    category: 'Defence & Space',
    description: 'Naval electronics, radar systems, missile guidance subsystems, tactical UAVs, anti-drone jammers, and aerospace titanium alloy components.',
    stockCount: 16,
    avgScore: 88.8,
    tailwindHighlights: [
      'Defence acquisition council prioritized 99% indigenous capital procurement.',
      'Defence exports crossed record ₹21,083 Cr in FY24.'
    ],
    governmentInitiative: 'Positive Indigenisation Lists (5th Tranche) & Make-in-India DAP',
    iconName: 'ShieldAlert'
  },
  {
    id: 'renewable-energy',
    name: 'Solar, Wind & Green Hydrogen',
    category: 'Energy & Transition',
    description: 'Solar PV cell & module fabrication, offshore wind turbines, green hydrogen electrolyzers, grid-scale BESS, and ultra-mega renewable parks.',
    stockCount: 22,
    avgScore: 84.5,
    tailwindHighlights: [
      'National Green Hydrogen Mission target of 5 MMT production by 2030.',
      'PM Surya Ghar: Muft Bijli Yojana targeting 10 Million rooftop solar installations.'
    ],
    governmentInitiative: 'National Green Hydrogen Mission & PM Surya Ghar',
    iconName: 'Sun'
  },
  {
    id: 'railways-infra',
    name: 'High-Speed Rail & Smart Infrastructure',
    category: 'Infrastructure & Mobility',
    description: 'Vande Bharat trainsets, Kavach automatic train protection systems, track renewal automation, urban metro networks, and dedicated freight corridors.',
    stockCount: 15,
    avgScore: 82.1,
    tailwindHighlights: [
      'Indian Railways Capex allocation exceeding ₹2.55 Lakh Crore.',
      'Rapid rollout of Kavach 4.0 safety system across 10,000+ route km.'
    ],
    governmentInitiative: 'National Rail Plan 2030 & Kavach 4.0 Mandate',
    iconName: 'Train'
  },
  {
    id: 'critical-materials',
    name: 'Lithium, Copper & Rare Earths',
    category: 'Critical Materials',
    description: 'Mining, refining, and recycling of critical minerals for clean tech, EV motors, magnets, power grids, and aerospace alloys.',
    stockCount: 9,
    avgScore: 80.3,
    tailwindHighlights: [
      'MMDR Act amendment permitting auction of 24 critical and strategic minerals.',
      'KABIL joint ventures in Argentina & Australia for lithium and cobalt extraction.'
    ],
    governmentInitiative: 'National Critical Minerals Mission',
    iconName: 'Layers'
  },
  {
    id: 'robotics-automation',
    name: 'Industrial Robotics & Automation',
    category: 'Semiconductors & DeepTech',
    description: 'Factory automation, CNC machining centers, automated guided vehicles (AGVs), warehouse robotics, and machine vision inspection.',
    stockCount: 8,
    avgScore: 83.9,
    tailwindHighlights: [
      'Manufacturing Capex resurgence driven by electronics and automotive PLI.',
      'Adoption of Industry 4.0 across Indian tier-1 component suppliers.'
    ],
    governmentInitiative: 'SAMARTH Udyog Bharat 4.0',
    iconName: 'Bot'
  }
];

export const STOCKS_DATA: CompanyStock[] = buildCompleteStocksData();
