import React from 'react';
import { Building2, ExternalLink } from 'lucide-react';
import { OfficialSourceLink } from '../types/market';

interface OfficialSourcesGridProps {
  title: string;
  subtitle: string;
  sources: OfficialSourceLink[];
}

export const OfficialSourcesGrid: React.FC<OfficialSourcesGridProps> = ({
  title,
  subtitle,
  sources,
}) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">{title}</h2>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map((src) => (
          <a
            key={src.title}
            href={src.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 hover:border-[#0D9488] hover:bg-[#F0FDFA] transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0D9488]">
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span>{src.category}</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-[#0D9488] shrink-0" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900">{src.title}</h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">{src.description}</p>
            </div>
            <div className="mt-3 text-xs font-medium text-[#0284C7] group-hover:underline">
              Open Official Portal
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
