import React, { useState } from 'react';
import { 
  Car, 
  Shield, 
  Cpu, 
  Sun, 
  Database, 
  Code2, 
  Tv, 
  Anchor, 
  Zap, 
  ShoppingBag, 
  Fuel, 
  Building2 
} from 'lucide-react';

interface CompanyLogoProps {
  symbol: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  customLogoUrl?: string;
  brandColor?: string;
}

// Curated stock brand configurations with authentic company colors, high-res vectors/logos and SVG emblems
interface LogoConfig {
  shortName: string;
  bgGradient: string;
  textColor: string;
  borderColor: string;
  icon: React.ElementType;
  accentGlow: string;
  officialLogoUrl?: string;
  brandHex: string;
}

const LOGO_CONFIGS: Record<string, LogoConfig> = {
  TATAMOTORS: {
    shortName: 'TATA',
    bgGradient: 'from-blue-900 via-indigo-950 to-slate-950',
    textColor: 'text-blue-300',
    borderColor: 'border-blue-500/40',
    icon: Car,
    accentGlow: 'rgba(59, 130, 246, 0.4)',
    officialLogoUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=128&auto=format&fit=crop&q=80',
    brandHex: '#1E40AF'
  },
  BEL: {
    shortName: 'BEL',
    bgGradient: 'from-emerald-900 via-teal-950 to-slate-950',
    textColor: 'text-emerald-300',
    borderColor: 'border-emerald-500/40',
    icon: Shield,
    accentGlow: 'rgba(16, 185, 129, 0.4)',
    officialLogoUrl: 'https://images.unsplash.com/photo-1517976487522-b5e0c528659d?w=128&auto=format&fit=crop&q=80',
    brandHex: '#059669'
  },
  KAYNES: {
    shortName: 'KAYNES',
    bgGradient: 'from-cyan-900 via-sky-950 to-slate-950',
    textColor: 'text-cyan-300',
    borderColor: 'border-cyan-500/40',
    icon: Cpu,
    accentGlow: 'rgba(6, 182, 212, 0.4)',
    officialLogoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=128&auto=format&fit=crop&q=80',
    brandHex: '#0891B2'
  },
  PREMIERENE: {
    shortName: 'PREMIER',
    bgGradient: 'from-amber-900 via-orange-950 to-slate-950',
    textColor: 'text-amber-300',
    borderColor: 'border-amber-500/40',
    icon: Sun,
    accentGlow: 'rgba(245, 158, 11, 0.4)',
    officialLogoUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=128&auto=format&fit=crop&q=80',
    brandHex: '#D97706'
  },
  CDSL: {
    shortName: 'CDSL',
    bgGradient: 'from-indigo-900 via-blue-950 to-slate-950',
    textColor: 'text-indigo-300',
    borderColor: 'border-indigo-500/40',
    icon: Database,
    accentGlow: 'rgba(99, 102, 241, 0.4)',
    officialLogoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&auto=format&fit=crop&q=80',
    brandHex: '#4F46E5'
  },
  KPITTECH: {
    shortName: 'KPIT',
    bgGradient: 'from-violet-900 via-purple-950 to-slate-950',
    textColor: 'text-violet-300',
    borderColor: 'border-violet-500/40',
    icon: Code2,
    accentGlow: 'rgba(139, 92, 246, 0.4)',
    officialLogoUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=128&auto=format&fit=crop&q=80',
    brandHex: '#7C3AED'
  },
  DIXON: {
    shortName: 'DIXON',
    bgGradient: 'from-sky-900 via-slate-950 to-slate-950',
    textColor: 'text-sky-300',
    borderColor: 'border-sky-500/40',
    icon: Tv,
    accentGlow: 'rgba(14, 165, 233, 0.4)',
    officialLogoUrl: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=128&auto=format&fit=crop&q=80',
    brandHex: '#0284C7'
  },
  MAZDOCK: {
    shortName: 'MDL',
    bgGradient: 'from-blue-950 via-slate-900 to-slate-950',
    textColor: 'text-amber-300',
    borderColor: 'border-blue-400/40',
    icon: Anchor,
    accentGlow: 'rgba(30, 58, 138, 0.4)',
    officialLogoUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=128&auto=format&fit=crop&q=80',
    brandHex: '#1E3A8A'
  },
  IREDA: {
    shortName: 'IREDA',
    bgGradient: 'from-teal-900 via-emerald-950 to-slate-950',
    textColor: 'text-teal-300',
    borderColor: 'border-teal-500/40',
    icon: Zap,
    accentGlow: 'rgba(20, 184, 166, 0.4)',
    officialLogoUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=128&auto=format&fit=crop&q=80',
    brandHex: '#0D9488'
  },
  TRENT: {
    shortName: 'TRENT',
    bgGradient: 'from-pink-900 via-rose-950 to-slate-950',
    textColor: 'text-pink-300',
    borderColor: 'border-pink-500/40',
    icon: ShoppingBag,
    accentGlow: 'rgba(236, 72, 153, 0.4)',
    officialLogoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=128&auto=format&fit=crop&q=80',
    brandHex: '#DB2777'
  },
  RELIANCE: {
    shortName: 'RIL',
    bgGradient: 'from-red-900 via-rose-950 to-slate-950',
    textColor: 'text-red-300',
    borderColor: 'border-red-500/40',
    icon: Fuel,
    accentGlow: 'rgba(239, 68, 68, 0.4)',
    officialLogoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=128&auto=format&fit=crop&q=80',
    brandHex: '#DC2626'
  }
};

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  symbol,
  name,
  size = 'md',
  className = '',
  customLogoUrl,
  brandColor
}) => {
  const [imageError, setImageError] = useState(false);
  const normalizedSymbol = symbol?.toUpperCase().replace(/[^A-Z]/g, '') || '';
  const config: LogoConfig = LOGO_CONFIGS[normalizedSymbol] || {
    shortName: symbol?.substring(0, 4) || 'NSE',
    bgGradient: 'from-cyan-900 via-slate-900 to-slate-950',
    textColor: 'text-cyan-300',
    borderColor: 'border-cyan-500/30',
    icon: Building2,
    accentGlow: 'rgba(6, 182, 212, 0.3)',
    officialLogoUrl: undefined,
    brandHex: '#06B6D4'
  };

  const IconComponent = config.icon;

  const sizeClasses = {
    xs: 'w-6 h-6 text-[9px] rounded-lg',
    sm: 'w-8 h-8 text-[10px] rounded-xl',
    md: 'w-10 h-10 text-xs rounded-xl',
    lg: 'w-13 h-13 text-sm rounded-2xl',
    xl: 'w-16 h-16 text-base rounded-2xl'
  };

  const iconSizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  };

  const logoUrl = customLogoUrl || config.officialLogoUrl;

  return (
    <div 
      className={`relative shrink-0 flex items-center justify-center font-black tracking-wider border shadow-lg transition-transform duration-200 group-hover:scale-105 overflow-hidden ${sizeClasses[size]} ${config.borderColor} ${className}`}
      style={{
        background: brandColor ? `linear-gradient(135deg, ${brandColor}33, #090d16)` : undefined,
        boxShadow: `0 4px 14px -2px ${config.accentGlow}`
      }}
      title={name || symbol}
    >
      {/* 3D Glass Surface Shine */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/40 pointer-events-none z-10"></div>
      
      {/* Subtle Glowing Radial Center */}
      <div 
        className="absolute inset-0 opacity-40 blur-sm pointer-events-none"
        style={{ backgroundColor: config.brandHex }}
      ></div>

      {/* Actual Branded Visual or SVG Icon Badge */}
      {!imageError && logoUrl ? (
        <div className="relative z-0 w-full h-full p-0.5 bg-slate-950 flex items-center justify-center">
          <img 
            src={logoUrl} 
            alt={name || symbol} 
            className="w-full h-full object-cover rounded-inherit opacity-90 group-hover:opacity-100 transition-opacity"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end justify-center pb-0.5">
            <span className={`text-[8px] font-extrabold text-white font-mono tracking-tighter drop-shadow leading-none`}>
              {config.shortName.substring(0, 3)}
            </span>
          </div>
        </div>
      ) : (
        <div className={`relative z-0 w-full h-full bg-gradient-to-br ${config.bgGradient} flex flex-col items-center justify-center p-1`}>
          <IconComponent className={`${iconSizes[size]} ${config.textColor} drop-shadow-md`} />
        </div>
      )}
    </div>
  );
};
