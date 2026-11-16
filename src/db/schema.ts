import { relations } from 'drizzle-orm';
import {
  boolean,
  doublePrecision,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// 1. Users (linked to Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').notNull().default('analyst'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Dashboard Configurations (per-user & global defaults for 10 dashboards)
export const dashboardConfigs = pgTable(
  'dashboard_configs',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
    dashboardKey: text('dashboard_key').notNull(),
    title: text('title').notNull(),
    isEnabled: boolean('is_enabled').notNull().default(true),
    refreshIntervalSec: integer('refresh_interval_sec').notNull().default(30),
    preferencesJson: jsonb('preferences_json').$type<Record<string, unknown>>().default({}),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [uniqueIndex('dashboard_configs_user_key_idx').on(table.userId, table.dashboardKey)]
);

// 3. Instruments (Master instrument registry across all 10 dashboards)
export const instruments = pgTable('instruments', {
  id: serial('id').primaryKey(),
  dashboardKey: text('dashboard_key').notNull(),
  symbol: text('symbol').notNull().unique(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  exchange: text('exchange').notNull().default('NSE'),
  dataOrigin: text('data_origin').notNull().default('DEMO'), // 'LIVE' | 'DEMO'
  isActive: boolean('is_active').notNull().default(true),
  metadataJson: jsonb('metadata_json').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. Companies (Dashboard 01: Stocks AI)
export const companies = pgTable('companies', {
  id: serial('id').primaryKey(),
  instrumentId: integer('instrument_id')
    .references(() => instruments.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  ticker: text('ticker').notNull(),
  sector: text('sector').notNull(),
  industry: text('industry').notNull(),
  isin: text('isin'),
  marketCapCr: doublePrecision('market_cap_cr'),
  peRatio: doublePrecision('pe_ratio'),
  roePercent: doublePrecision('roe_percent'),
  debtToEquity: doublePrecision('debt_to_equity'),
  revenueCr: doublePrecision('revenue_cr'),
  profitCr: doublePrecision('profit_cr'),
  irUrl: text('ir_url').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 5. Mutual Funds (Dashboard 02: Mutual Funds AI)
export const mutualFunds = pgTable('mutual_funds', {
  id: serial('id').primaryKey(),
  instrumentId: integer('instrument_id')
    .references(() => instruments.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  schemeCode: text('scheme_code').notNull(),
  amcName: text('amc_name').notNull(),
  category: text('category').notNull(), // Equity | Debt | Hybrid | Index
  subCategory: text('sub_category').notNull(),
  nav: doublePrecision('nav'),
  expenseRatio: doublePrecision('expense_ratio'),
  aumCr: doublePrecision('aum_cr'),
  fundManager: text('fund_manager'),
  benchmark: text('benchmark').notNull(),
  return1y: doublePrecision('return_1y'),
  return3y: doublePrecision('return_3y'),
  return5y: doublePrecision('return_5y'),
  riskLevel: text('risk_level').notNull(),
  amcUrl: text('amc_url').notNull(),
  holdingsJson: jsonb('holdings_json').$type<string[]>().default([]),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 6. IPO Records (Dashboard 06: IPO AI)
export const ipoRecords = pgTable('ipo_records', {
  id: serial('id').primaryKey(),
  instrumentId: integer('instrument_id')
    .references(() => instruments.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  companyName: text('company_name').notNull(),
  status: text('status').notNull(), // Upcoming | Open | Closed | Listed
  priceBand: text('price_band').notNull(),
  lotSize: integer('lot_size').notNull(),
  issueSizeCr: doublePrecision('issue_size_cr').notNull(),
  openDate: text('open_date'),
  closeDate: text('close_date'),
  allotmentDate: text('allotment_date'),
  listingDate: text('listing_date'),
  subscriptionTotalX: doublePrecision('subscription_total_x'),
  drhpUrl: text('drhp_url').notNull(),
  registrarName: text('registrar_name').notNull(),
  registrarUrl: text('registrar_url').notNull(),
  revenueCr: doublePrecision('revenue_cr'),
  profitCr: doublePrecision('profit_cr'),
  debtCr: doublePrecision('debt_cr'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 7. ETFs (Dashboard 05: ETF AI)
export const etfs = pgTable('etfs', {
  id: serial('id').primaryKey(),
  instrumentId: integer('instrument_id')
    .references(() => instruments.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  ticker: text('ticker').notNull(),
  category: text('category').notNull(), // Index | Sector | Gold | International
  underlyingIndex: text('underlying_index').notNull(),
  nav: doublePrecision('nav'),
  trackingError: doublePrecision('tracking_error'),
  expenseRatio: doublePrecision('expense_ratio'),
  aumCr: doublePrecision('aum_cr'),
  premiumDiscountPct: doublePrecision('premium_discount_pct'),
  issuerName: text('issuer_name').notNull(),
  issuerUrl: text('issuer_url').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 8. Bonds (Dashboard 09: Bonds AI)
export const bonds = pgTable('bonds', {
  id: serial('id').primaryKey(),
  instrumentId: integer('instrument_id')
    .references(() => instruments.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  isin: text('isin').notNull(),
  issuerName: text('issuer_name').notNull(),
  bondType: text('bond_type').notNull(), // G-Sec | T-Bill | Corporate | SDL | Listed Debt
  couponRate: doublePrecision('coupon_rate').notNull(),
  yieldToMaturity: doublePrecision('yield_to_maturity').notNull(),
  creditRating: text('credit_rating').notNull(),
  maturityDate: text('maturity_date').notNull(),
  paymentFrequency: text('payment_frequency').notNull(),
  faceValue: doublePrecision('face_value').notNull(),
  durationYears: doublePrecision('duration_years').notNull(),
  defaultRisk: text('default_risk').notNull(),
  issuerUrl: text('issuer_url').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 9. Commodity Contracts (Dashboard 07, 08, 10)
export const commodityContracts = pgTable('commodity_contracts', {
  id: serial('id').primaryKey(),
  instrumentId: integer('instrument_id')
    .references(() => instruments.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  commodity: text('commodity').notNull(),
  exchange: text('exchange').notNull(), // MCX | NCDEX | COMEX
  contractExpiry: text('contract_expiry').notNull(),
  unit: text('unit').notNull(),
  lotSize: text('lot_size').notNull(),
  spotBenchmark: text('spot_benchmark').notNull(),
  globalInventoryNote: text('global_inventory_note'),
  demandDriver: text('demand_driver'),
  volatilityLevel: text('volatility_level').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 10. Market Data (Latest snapshots & technical indicators)
export const marketData = pgTable('market_data', {
  id: serial('id').primaryKey(),
  instrumentId: integer('instrument_id')
    .references(() => instruments.id, { onDelete: 'cascade' })
    .notNull(),
  price: doublePrecision('price').notNull(),
  previousClose: doublePrecision('previous_close'),
  change: doublePrecision('change'),
  percentChange: doublePrecision('percent_change'),
  open: doublePrecision('open'),
  dayHigh: doublePrecision('day_high'),
  dayLow: doublePrecision('day_low'),
  volume: doublePrecision('volume'),
  openInterest: doublePrecision('open_interest'),
  impliedVolatility: doublePrecision('implied_volatility'),
  pcr: doublePrecision('pcr'),
  vwap: doublePrecision('vwap'),
  rsi14: doublePrecision('rsi14'),
  macdSignal: text('macd_signal'),
  sourceTag: text('source_tag').notNull(),
  dataOrigin: text('data_origin').notNull().default('DEMO'),
  recordedAt: timestamp('recorded_at').defaultNow().notNull(),
});

// 11. Historical Data (OHLCV candles)
export const historicalData = pgTable('historical_data', {
  id: serial('id').primaryKey(),
  instrumentId: integer('instrument_id')
    .references(() => instruments.id, { onDelete: 'cascade' })
    .notNull(),
  timeframe: text('timeframe').notNull(), // 1m | 5m | 15m | 1d | 1mo
  timestamp: integer('timestamp').notNull(),
  open: doublePrecision('open'),
  high: doublePrecision('high'),
  low: doublePrecision('low'),
  close: doublePrecision('close').notNull(),
  volume: doublePrecision('volume'),
  dataOrigin: text('data_origin').notNull().default('DEMO'),
});

// 12. Official Websites Directory
export const officialWebsites = pgTable('official_websites', {
  id: serial('id').primaryKey(),
  dashboardKey: text('dashboard_key').notNull(),
  websiteName: text('website_name').notNull(),
  officialUrl: text('official_url').notNull(),
  sourceCategory: text('source_category').notNull(),
  relevantInstruments: text('relevant_instruments').notNull(),
  dataProvided: text('data_provided').notNull(),
  lastCheckedAt: timestamp('last_checked_at').defaultNow().notNull(),
  verificationStatus: text('verification_status').notNull().default('Verified'),
  reliabilityClass: text('reliability_class').notNull().default('Tier-1 Regulatory/Exchange'),
  apiAvailability: text('api_availability').notNull(),
  updateFrequency: text('update_frequency').notNull(),
});

// 13. Expert Profiles (SEBI / Institutional Registry)
export const expertProfiles = pgTable('expert_profiles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  entityName: text('entity_name').notNull(),
  sebiRegNumber: text('sebi_reg_number').notNull(),
  roleType: text('role_type').notNull(), // SEBI Research Analyst | Investment Adviser | Institutional Portal
  registrationStatus: text('registration_status').notNull(),
  disclosureText: text('disclosure_text').notNull(),
  sourceUrl: text('source_url').notNull(),
  verifiedAt: timestamp('verified_at').defaultNow().notNull(),
});

// 14. Expert Opinions (Strictly separate from AI analysis)
export const expertOpinions = pgTable('expert_opinions', {
  id: serial('id').primaryKey(),
  expertId: integer('expert_id')
    .references(() => expertProfiles.id, { onDelete: 'cascade' })
    .notNull(),
  instrumentId: integer('instrument_id').references(() => instruments.id, {
    onDelete: 'set null',
  }),
  dashboardKey: text('dashboard_key').notNull(),
  stance: text('stance').notNull(),
  summary: text('summary').notNull(),
  publicationDate: text('publication_date').notNull(),
  sourceUrl: text('source_url').notNull(),
  conflictDisclosure: text('conflict_disclosure').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 15. AI Research Outputs (Consistent 16-field structure per dashboard)
export const aiResearch = pgTable('ai_research', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  dashboardKey: text('dashboard_key').notNull(),
  instrumentId: integer('instrument_id').references(() => instruments.id, {
    onDelete: 'set null',
  }),
  instrumentName: text('instrument_name').notNull(),
  instrumentCategory: text('instrument_category').notNull(),
  latestDataTimestamp: text('latest_data_timestamp').notNull(),
  officialSource: text('official_source').notNull(),
  marketInfo: text('market_info').notNull(),
  fundamentalAnalysis: text('fundamental_analysis').notNull(),
  technicalAnalysis: text('technical_analysis').notNull(),
  expertOpinionSummary: text('expert_opinion_summary').notNull(),
  independentAnalysis: text('independent_analysis').notNull(),
  stance: text('stance').notNull(), // Bullish | Bearish | Neutral
  riskLevel: text('risk_level').notNull(), // Low | Moderate | High | Very High
  confidenceScore: integer('confidence_score').notNull(),
  supportingReasonsJson: jsonb('supporting_reasons_json').$type<string[]>().default([]),
  conflictingEvidenceJson: jsonb('conflicting_evidence_json').$type<string[]>().default([]),
  missingInfoJson: jsonb('missing_info_json').$type<string[]>().default([]),
  dataOrigin: text('data_origin').notNull().default('LIVE'),
  modelUsed: text('model_used').notNull().default('gemini-4-hydrogen'),
  sourcesJson: jsonb('sources_json').$type<Array<{ title: string; uri: string }>>().default([]),
  lastVerifiedAt: timestamp('last_verified_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 16. AI Verification Records (Master AI vs Individual Dashboard Agent audit)
export const aiVerificationRecords = pgTable('ai_verification_records', {
  id: serial('id').primaryKey(),
  researchId: integer('research_id')
    .references(() => aiResearch.id, { onDelete: 'cascade' })
    .notNull(),
  dashboardKey: text('dashboard_key').notNull(),
  verificationStatus: text('verification_status').notNull(), // Verified | Conflict Flagged | Pending Review
  conflictFlag: boolean('conflict_flag').notNull().default(false),
  verifierNote: text('verifier_note').notNull(),
  checkedAt: timestamp('checked_at').defaultNow().notNull(),
});

// 17. Watchlists (User-owned per dashboard)
export const watchlists = pgTable(
  'watchlists',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    dashboardKey: text('dashboard_key').notNull(),
    instrumentId: integer('instrument_id')
      .references(() => instruments.id, { onDelete: 'cascade' })
      .notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [uniqueIndex('watchlists_user_inst_idx').on(table.userId, table.instrumentId)]
);

// 18. Alerts (User-owned price/volatility/expiry alerts)
export const alerts = pgTable('alerts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  dashboardKey: text('dashboard_key').notNull(),
  instrumentId: integer('instrument_id').references(() => instruments.id, {
    onDelete: 'set null',
  }),
  symbolLabel: text('symbol_label').notNull(),
  alertType: text('alert_type').notNull(), // Price | Volatility | Expiry | NAV | Policy
  conditionText: text('condition_text').notNull(),
  thresholdValue: doublePrecision('threshold_value'),
  status: text('status').notNull().default('Active'), // Active | Triggered | Paused
  triggeredAt: timestamp('triggered_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 19. Reports (Daily / Weekly / Monthly / Historical per dashboard or Master AI)
export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  dashboardKey: text('dashboard_key').notNull(),
  reportType: text('report_type').notNull(), // Daily | Weekly | Monthly | Post-Market | Consolidated
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  contentJson: jsonb('content_json').$type<Record<string, unknown>>().default({}),
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
});

// 20. Monitoring Jobs (24/7 Background Scheduler Queue)
export const monitoringJobs = pgTable('monitoring_jobs', {
  id: serial('id').primaryKey(),
  dashboardKey: text('dashboard_key').notNull(),
  category: text('category').notNull(),
  scheduleSpec: text('schedule_spec').notNull(),
  status: text('status').notNull().default('Scheduled'), // Running | Healthy | Degraded | Scheduled
  lastRunAt: timestamp('last_run_at'),
  nextRunAt: timestamp('next_run_at'),
  retryCount: integer('retry_count').notNull().default(0),
  freshnessOk: boolean('freshness_ok').notNull().default(true),
  lastMessage: text('last_message').notNull(),
});

// 21. Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  dashboardKey: text('dashboard_key').notNull(),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  details: text('details').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  watchlists: many(watchlists),
  alerts: many(alerts),
  dashboardConfigs: many(dashboardConfigs),
}));

export const instrumentsRelations = relations(instruments, ({ one, many }) => ({
  company: one(companies, { fields: [instruments.id], references: [companies.instrumentId] }),
  mutualFund: one(mutualFunds, { fields: [instruments.id], references: [mutualFunds.instrumentId] }),
  ipo: one(ipoRecords, { fields: [instruments.id], references: [ipoRecords.instrumentId] }),
  etf: one(etfs, { fields: [instruments.id], references: [etfs.instrumentId] }),
  bond: one(bonds, { fields: [instruments.id], references: [bonds.instrumentId] }),
  commodity: one(commodityContracts, {
    fields: [instruments.id],
    references: [commodityContracts.instrumentId],
  }),
  marketData: many(marketData),
  aiResearch: many(aiResearch),
}));

export const aiResearchRelations = relations(aiResearch, ({ many }) => ({
  verifications: many(aiVerificationRecords),
}));
