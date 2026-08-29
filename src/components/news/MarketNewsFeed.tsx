import React, { useState, useMemo } from 'react';
import { 
  Newspaper, 
  TrendingUp, 
  Globe2, 
  Building2, 
  FileCheck2, 
  Sparkles, 
  Search, 
  Filter, 
  ArrowRight, 
  Share2, 
  Bookmark, 
  ExternalLink, 
  Flame, 
  ThumbsUp, 
  MessageSquare, 
  Repeat, 
  ShieldCheck, 
  UserCheck, 
  Award, 
  AlertCircle,
  Radio,
  Zap,
  Clock
} from 'lucide-react';
import { CompanyStock } from '../../types/stock';
import { 
  OFFICIAL_EXCHANGE_NEWS, 
  MARKET_GURU_SUGGESTIONS, 
  SOCIAL_MEDIA_SIGNALS,
  OfficialExchangeNews,
  MarketGuruSuggestion,
  SocialMediaSignal
} from '../../data/marketNewsData';
import { CompanyLogo } from '../common/CompanyLogo';

interface MarketNewsFeedProps {
  stocks: CompanyStock[];
  onSelectStock: (stock: CompanyStock) => void;
}

export const MarketNewsFeed: React.FC<MarketNewsFeedProps> = ({
  stocks = [],
  onSelectStock
}) => {
  const [activeSection, setActiveSection] = useState<'official' | 'gurus' | 'social'>('official');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['news-1', 'guru-1']);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Helper to find stock object by symbol
  const findStockBySymbol = (symbol: string): CompanyStock | undefined => {
    return stocks.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
  };

  // Filtered Official News
  const filteredOfficialNews = useMemo(() => {
    return OFFICIAL_EXCHANGE_NEWS.filter(item => {
      if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = 
          item.title.toLowerCase().includes(q) ||
          item.symbol.toLowerCase().includes(q) ||
          item.companyName.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.filingRef.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [categoryFilter, searchQuery]);

  // Filtered Guru Suggestions
  const filteredGuruSuggestions = useMemo(() => {
    return MARKET_GURU_SUGGESTIONS.filter(item => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = 
          item.guruName.toLowerCase().includes(q) ||
          item.stockSymbol.toLowerCase().includes(q) ||
          item.stockName.toLowerCase().includes(q) ||
          item.coreThesis.toLowerCase().includes(q) ||
          item.themeOrSector.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [searchQuery]);

  // Filtered Social Signals
  const filteredSocialSignals = useMemo(() => {
    return SOCIAL_MEDIA_SIGNALS.filter(item => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = 
          item.targetSymbol.toLowerCase().includes(q) ||
          item.postContent.toLowerCase().includes(q) ||
          item.handleOrChannel.toLowerCase().includes(q) ||
          item.trendingHashtags.some(tag => tag.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [searchQuery]);

  return (
    <div id="market-news-feed-view" className="w-full max-w-full space-y-6 sm:space-y-8 pb-16 min-w-0">
      
      {/* 📰 Hero Banner: 24/7 Multi-Source Intelligence Center */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/80 p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-2xl shadow-cyan-950/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 -mb-16 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-xs font-bold shadow-inner">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
              <span>Live News & Intelligence Wire • 24/7 Stream</span>
            </div>
            
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Market Intelligence, Official Filings & Super-Investor Wire
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Consolidated 3-pillar intelligence stream: Verified NSE/BSE regulatory disclosures, portfolio moves & thesis from India's ace market veterans, and real-time social sentiment signals.
            </p>
          </div>

          {/* Aggregate Stream Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2.5 shrink-0">
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3 shadow-inner text-center">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Exchange Wire</span>
              <span className="text-sm sm:text-base font-black text-white font-mono flex items-center justify-center space-x-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>NSE / BSE Direct</span>
              </span>
            </div>
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3 shadow-inner text-center">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Ace Investors</span>
              <span className="text-sm sm:text-base font-black text-amber-300 font-mono mt-0.5 block">
                6 Top Gurus
              </span>
            </div>
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3 shadow-inner text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Social Sentiment</span>
              <span className="text-sm sm:text-base font-black text-cyan-400 font-mono mt-0.5 block">
                Quant Aligned
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🎛️ Navigation Pillars: 3 Primary News Channels */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Channel Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="news-tab-official"
              onClick={() => setActiveSection('official')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                activeSection === 'official'
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-950/80 border border-cyan-400/50'
                  : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Building2 className="w-4 h-4 text-cyan-300" />
              <span>1. NSE / BSE & Official Filings</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950/80 font-mono text-cyan-300">
                {OFFICIAL_EXCHANGE_NEWS.length}
              </span>
            </button>

            <button
              id="news-tab-gurus"
              onClick={() => setActiveSection('gurus')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                activeSection === 'gurus'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-950/80 border border-amber-400/50'
                  : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>2. Super-Investor & Guru Ideas</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950/80 font-mono text-amber-300">
                {MARKET_GURU_SUGGESTIONS.length}
              </span>
            </button>

            <button
              id="news-tab-social"
              onClick={() => setActiveSection('social')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                activeSection === 'social'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-950/80 border border-indigo-400/50'
                  : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Flame className="w-4 h-4 text-pink-400" />
              <span>3. Web Data & Social Signals</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950/80 font-mono text-pink-300">
                {SOCIAL_MEDIA_SIGNALS.length}
              </span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search news, stock, guru or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner"
            />
          </div>
        </div>

        {/* Category Sub-Filters for Official News */}
        {activeSection === 'official' && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-slate-400 font-mono text-[11px] shrink-0">Filter By:</span>
            {['ALL', 'Order Win', 'Capex Expansion', 'Board Action', 'Credit Rating'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  categoryFilter === cat
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 🏛️ TAB 1: OFFICIAL EXCHANGE FILINGS & REGULATORY DISCLOSURES (NSE/BSE/SEBI) */}
      {/* ========================================================================= */}
      {activeSection === 'official' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Verified Exchange Wire & Corporate Actions ({filteredOfficialNews.length})
              </h2>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">
              Direct SEBI / NSE / BSE Filing Registry
            </span>
          </div>

          <div className="space-y-4">
            {filteredOfficialNews.map((item) => {
              const matchedStock = findStockBySymbol(item.symbol);
              const isSaved = bookmarkedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  id={`official-news-${item.id}`}
                  className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 sm:p-5 transition-all shadow-xl space-y-3.5 group"
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-black border ${
                        item.source === 'NSE' ? 'bg-cyan-950 text-cyan-300 border-cyan-700/60' :
                        item.source === 'BSE' ? 'bg-indigo-950 text-indigo-300 border-indigo-700/60' :
                        'bg-amber-950 text-amber-300 border-amber-700/60'
                      }`}>
                        {item.source} OFFICIAL
                      </span>

                      <span className="text-[11px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                        Ref: {item.filingRef}
                      </span>

                      <span className="text-[11px] font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/40">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.timeAgo}</span>
                      </span>

                      <button
                        onClick={() => toggleBookmark(item.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isSaved 
                            ? 'bg-cyan-950 text-cyan-400 border-cyan-800' 
                            : 'bg-slate-950/80 text-slate-500 border-slate-800 hover:text-slate-300'
                        }`}
                        title="Bookmark disclosure"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  {/* Key Highlights Bullets */}
                  <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">
                      Audited Disclosure Highlights:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {item.keyHighlights.map((hl, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                          <span className="leading-relaxed">{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer with Stock Navigation */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      {matchedStock && (
                        <CompanyLogo
                          symbol={matchedStock.symbol}
                          name={matchedStock.name}
                          size="sm"
                          customLogoUrl={matchedStock.logoUrl}
                          brandColor={matchedStock.brandColor}
                        />
                      )}
                      <div>
                        <span className="font-bold text-xs text-white">{item.companyName}</span>
                        <span className="text-[11px] text-cyan-400 font-mono ml-2">({item.symbol})</span>
                      </div>
                    </div>

                    {matchedStock && (
                      <button
                        onClick={() => onSelectStock(matchedStock)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <span>Open Stock Terminal</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 👑 TAB 2: TOP MARKET GURUS & SUPER-INVESTOR SUGGESTIONS */}
      {/* ========================================================================= */}
      {activeSection === 'gurus' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Ace Super-Investor Commentary, Stakes & High-Conviction Theses ({filteredGuruSuggestions.length})
              </h2>
            </div>
            <span className="text-[11px] font-mono text-amber-400">
              SEBI Filing & Official Media Confirmed
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredGuruSuggestions.map((guru) => {
              const matchedStock = findStockBySymbol(guru.stockSymbol);

              return (
                <div
                  key={guru.id}
                  id={`guru-card-${guru.id}`}
                  className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 transition-all shadow-xl flex flex-col justify-between space-y-4 group"
                >
                  {/* Guru Profile Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-600 to-yellow-600 flex items-center justify-center text-white font-black text-sm shadow-md border border-amber-400/40 shrink-0">
                        {guru.guruAvatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors flex items-center space-x-2">
                          <span>{guru.guruName}</span>
                          <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                        </h3>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{guru.designation}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-black border ${
                        guru.stance === 'STRONG_BUY' ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60' :
                        guru.stance === 'LONG_TERM_COMPOUNDER' ? 'bg-indigo-950 text-indigo-300 border-indigo-700/60' :
                        'bg-amber-950 text-amber-300 border-amber-700/60'
                      }`}>
                        {guru.stance.replace('_', ' ')}
                      </span>
                      {guru.approxHoldingPct && (
                        <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                          {guru.approxHoldingPct}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stock Tagged & Sector Horizon */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2.5">
                      {matchedStock && (
                        <CompanyLogo
                          symbol={matchedStock.symbol}
                          name={matchedStock.name}
                          size="sm"
                          customLogoUrl={matchedStock.logoUrl}
                          brandColor={matchedStock.brandColor}
                        />
                      )}
                      <div>
                        <span className="font-bold text-white">{guru.stockSymbol}</span>
                        <span className="text-slate-400 text-[11px] ml-1.5">({guru.stockName})</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-cyan-400 block">Horizon: {guru.investmentHorizon}</span>
                      <span className="text-[10px] text-slate-500 font-mono block">{guru.themeOrSector}</span>
                    </div>
                  </div>

                  {/* Core Investment Thesis */}
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-amber-400 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Investment Thesis & Strategic Rationale:</span>
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                      "{guru.coreThesis}"
                    </p>
                  </div>

                  {/* Catalyst Bullets */}
                  <ul className="space-y-1 text-xs text-slate-300">
                    {guru.keyCatalysts.map((cat, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                        <span className="leading-relaxed">{cat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Footer & Source Citation */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <div className="text-slate-400 text-[10px] truncate max-w-[200px]">
                      Source: {guru.sourceMedia} ({guru.sourceDate})
                    </div>

                    {matchedStock && (
                      <button
                        onClick={() => onSelectStock(matchedStock)}
                        className="px-3 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-700/60 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <span>Analyze Stock</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🌐 TAB 3: WEB DATA & SOCIAL MEDIA SENTIMENT SIGNALS */}
      {/* ========================================================================= */}
      {activeSection === 'social' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-pink-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Web Data, FinTech Social Buzz & Quant Conviction vs Hype ({filteredSocialSignals.length})
              </h2>
            </div>
            <span className="text-[11px] font-mono text-pink-400">
              Aggregated from X, Reddit & YouTube
            </span>
          </div>

          <div className="space-y-4">
            {filteredSocialSignals.map((signal) => {
              const matchedStock = findStockBySymbol(signal.targetSymbol);

              return (
                <div
                  key={signal.id}
                  id={`social-signal-${signal.id}`}
                  className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 hover:border-pink-500/50 rounded-2xl p-4 sm:p-5 transition-all shadow-xl space-y-3.5 group"
                >
                  {/* Top Channel Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-pink-950 text-pink-300 border border-pink-700/60">
                        {signal.platform}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {signal.handleOrChannel}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {signal.authorReputation.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{signal.timeAgo}</span>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                    {signal.postContent}
                  </p>

                  {/* Trending Hashtags */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {signal.trendingHashtags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-cyan-400 border border-slate-800">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Quant Conviction vs Social Hype Matrix */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">AI Quant Score:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {signal.quantScoreVsHype.aiQuantScore}/100
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Social Hype Score:</span>
                      <span className="font-mono font-bold text-pink-400">
                        {signal.quantScoreVsHype.socialHypeScore}/100
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Divergence:</span>
                      <span className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded ${
                        signal.quantScoreVsHype.divergenceAlert === 'UNDERVALUED_BY_CROWD'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      }`}>
                        {signal.quantScoreVsHype.divergenceAlert.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Footer with Social Metrics & Stock Terminal Link */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-4 text-slate-400 font-mono text-[11px]">
                      <span className="flex items-center space-x-1">
                        <ThumbsUp className="w-3.5 h-3.5 text-slate-500" />
                        <span>{signal.socialEngagement.likesOrUpvotes.toLocaleString()}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Repeat className="w-3.5 h-3.5 text-slate-500" />
                        <span>{signal.socialEngagement.sharesOrRetweets}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                        <span>{signal.socialEngagement.commentsCount}</span>
                      </span>
                    </div>

                    {matchedStock && (
                      <button
                        onClick={() => onSelectStock(matchedStock)}
                        className="px-3 py-1.5 rounded-xl bg-pink-950/60 hover:bg-pink-900/80 text-pink-300 border border-pink-700/60 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <span>Open {signal.targetSymbol} Terminal</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
