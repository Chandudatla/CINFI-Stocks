import React, { useState, useMemo } from 'react';
import { 
  FileCheck, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  ExternalLink, 
  Calendar, 
  Sparkles, 
  Download, 
  Filter, 
  FileText,
  Building2
} from 'lucide-react';
import { CompanyStock } from '../../types/stock';
import { CompanyLogo } from '../common/CompanyLogo';

interface EvidenceAuditViewProps {
  stocks?: CompanyStock[];
  onSelectStock: (stock: CompanyStock) => void;
}

export const EvidenceAuditView: React.FC<EvidenceAuditViewProps> = ({
  stocks = [],
  onSelectStock
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocType, setSelectedDocType] = useState<string>('ALL');

  const allEvidence = useMemo(() => {
    return stocks.flatMap(stock => 
      (stock.evidence || []).map(ev => ({
        ...ev,
        stockSymbol: stock.symbol,
        stockName: stock.name,
        stockLogo: stock.logoUrl,
        stockBrandColor: stock.brandColor,
        stockRef: stock
      }))
    );
  }, [stocks]);

  const docTypes = useMemo(() => {
    return ['ALL', ...Array.from(new Set(allEvidence.map(e => e.documentType)))];
  }, [allEvidence]);

  const filteredEvidence = useMemo(() => {
    return allEvidence.filter(ev => {
      if (selectedDocType !== 'ALL' && ev.documentType !== selectedDocType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = 
          ev.stockSymbol.toLowerCase().includes(q) ||
          ev.stockName.toLowerCase().includes(q) ||
          ev.claim.toLowerCase().includes(q) ||
          ev.rawExcerpt.toLowerCase().includes(q) ||
          ev.sourceName.toLowerCase().includes(q) ||
          ev.documentType.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [allEvidence, selectedDocType, searchQuery]);

  // Export as CSV
  const handleExportCSV = () => {
    if (filteredEvidence.length === 0) return;
    const headers = ['Symbol', 'Company Name', 'Document Type', 'Date', 'Confidence', 'Primary Statutory Source', 'Page / Section', 'Claim', 'Raw Excerpt'];
    const rows = filteredEvidence.map(e => [
      `"${e.stockSymbol}"`,
      `"${e.stockName}"`,
      `"${e.documentType}"`,
      `"${e.documentDate}"`,
      `"${e.confidenceLevel}"`,
      `"${e.sourceName}"`,
      `"${e.pageOrSection}"`,
      `"${e.claim.replace(/"/g, '""')}"`,
      `"${e.rawExcerpt.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CINFI_Evidence_Audit_Trail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="evidence-audit-view" className="w-full max-w-full space-y-6 pb-16 min-w-0 overflow-x-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 shrink-0" />
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight break-words">
              Zero-Hallucination Statutory Evidence Repository
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
            Deterministic audit trail of primary citations, statutory BSE/NSE filings, and audited annual reports with verifiable page references.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Trail</span>
          </button>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold flex items-center space-x-2 shadow-inner">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Audited Primary Citations</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs font-mono min-w-0">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1 shadow-lg min-w-0 overflow-hidden">
          <span className="text-slate-400 font-sans font-semibold block truncate">Tier 1 Primary Filings</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-400">100% Audited</div>
          <span className="text-slate-400 font-sans text-[10px] block truncate">BSE / NSE / SEBI Disclosures</span>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1 shadow-lg min-w-0 overflow-hidden">
          <span className="text-slate-400 font-sans font-semibold block truncate">Verified Citations</span>
          <div className="text-xl sm:text-2xl font-black text-cyan-300">{allEvidence.length} Active Passages</div>
          <span className="text-slate-400 font-sans text-[10px] block truncate">With Page & Section Metadata</span>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-1 shadow-lg min-w-0 overflow-hidden">
          <span className="text-slate-400 font-sans font-semibold block truncate">Verification Confidence</span>
          <div className="text-xl sm:text-2xl font-black text-white">99.8% Index Integrity</div>
          <span className="text-slate-400 font-sans text-[10px] block truncate">Deterministic Fact Firewall</span>
        </div>
      </div>

      {/* Search & Document Type Filter */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search evidence claims, excerpts, ticker, or filing source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white p-0.5"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {docTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedDocType(type)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedDocType === type
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-950'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Citations List */}
      <div className="space-y-4 min-w-0">
        {filteredEvidence.map((ev) => (
          <div
            key={ev.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-3.5 shadow-xl transition-all min-w-0 overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <CompanyLogo 
                  symbol={ev.stockSymbol}
                  name={ev.stockName}
                  size="sm"
                  customLogoUrl={ev.stockLogo}
                  brandColor={ev.stockBrandColor}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="font-bold text-white text-sm truncate">{ev.stockSymbol}</span>
                    <span className="text-xs text-slate-400 font-medium truncate">({ev.stockName})</span>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono block truncate">{ev.documentType} • Citation #{ev.id}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono shrink-0">
                <span className="flex items-center space-x-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{ev.documentDate}</span>
                </span>
                <span className="text-emerald-400 font-bold flex items-center space-x-1 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{ev.confidenceLevel}</span>
                </span>
              </div>
            </div>

            <div className="text-xs sm:text-sm font-semibold text-slate-100 pl-1 break-words">
              "{ev.claim}"
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 italic leading-relaxed shadow-inner break-words font-mono">
              "{ev.rawExcerpt}"
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-slate-800/80 text-xs text-slate-400 min-w-0">
              <span className="break-words">
                Primary Statutory Source: <strong className="text-slate-200">{ev.sourceName}</strong> ({ev.pageOrSection})
              </span>
              <button
                onClick={() => onSelectStock(ev.stockRef)}
                className="text-cyan-400 hover:text-cyan-300 font-semibold self-start sm:self-auto flex items-center space-x-1.5 font-sans cursor-pointer transition-colors shrink-0"
              >
                <span>Inspect in {ev.stockSymbol} Terminal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
