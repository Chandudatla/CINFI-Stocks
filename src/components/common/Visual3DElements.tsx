import React from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Layers, 
  Zap, 
  BarChart3,
  Flame,
  Globe2,
  Lock,
  ArrowUpRight
} from 'lucide-react';

/* 💎 3D Holographic CINFI Intelligence Brand Logo Emblem */
export const Cinfi3DLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }> = ({ 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {/* 3D Radiant Pulse Backing */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/40 via-indigo-500/30 to-teal-400/30 blur-md animate-pulse pointer-events-none"></div>
      
      {/* 3D Isometric Crystal Container */}
      <div className={`relative ${sizeClasses[size]} rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 border border-cyan-400/60 p-1 shadow-xl shadow-cyan-950/80 flex items-center justify-center transform hover:scale-105 hover:rotate-2 transition-all duration-300`}>
        {/* Custom SVG 3D Isometric CINFI Prism Logo */}
        <svg 
          viewBox="0 0 64 64" 
          className="w-full h-full drop-shadow-[0_0_12px_rgba(6,182,212,0.85)]"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* 3D Gradient Facet 1: Top Cyan Prism */}
            <linearGradient id="cinfi-top-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="50%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            {/* 3D Gradient Facet 2: Left Indigo Quantum Wall */}
            <linearGradient id="cinfi-left-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* 3D Gradient Facet 3: Right Emerald-Teal Wall */}
            <linearGradient id="cinfi-right-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="50%" stopColor="#0d9488" />
              <stop offset="100%" stopColor="#042f2e" />
            </linearGradient>

            {/* Core Gold Quantum Spark */}
            <linearGradient id="cinfi-core-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            {/* Glowing Accent Filter */}
            <filter id="cinfi-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Holographic Hex Grid Layer */}
          <polygon points="32,6 54,18 54,46 32,58 10,46 10,18" stroke="#0e7490" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.4" />

          {/* 3D Isometric "C" Prism Structure */}
          {/* Top Arch of C */}
          <path 
            d="M32 10 L50 20 L42 25 L24 15 Z" 
            fill="url(#cinfi-top-grad)" 
            stroke="#67e8f9" 
            strokeWidth="0.75" 
          />
          
          {/* Outer Left Spine (Vertical Backbone) */}
          <path 
            d="M24 15 L32 10 L14 20 L14 44 L22 49 L22 25 Z" 
            fill="url(#cinfi-left-grad)" 
            stroke="#38bdf8" 
            strokeWidth="0.75" 
          />

          {/* Bottom Arch of C */}
          <path 
            d="M14 44 L32 54 L50 44 L42 39 L22 49 Z" 
            fill="url(#cinfi-right-grad)" 
            stroke="#2dd4bf" 
            strokeWidth="0.75" 
          />

          {/* Inner Quantum Core Prism: Faceted 3D Diamond / Quantum Center */}
          <polygon points="32,22 42,28 32,34 22,28" fill="url(#cinfi-top-grad)" opacity="0.95" />
          <polygon points="22,28 32,34 32,44 22,38" fill="url(#cinfi-left-grad)" opacity="0.9" />
          <polygon points="32,34 42,28 42,38 32,44" fill="url(#cinfi-right-grad)" opacity="0.9" />

          {/* Central Holographic Spark (Golden Financial Catalyst) */}
          <circle cx="32" cy="31" r="2.5" fill="url(#cinfi-core-gold)" className="animate-pulse" filter="url(#cinfi-glow)" />
          <circle cx="32" cy="31" r="1.2" fill="#ffffff" />

          {/* Tech Data Nodes & Orbit Ticks */}
          <circle cx="50" cy="20" r="1.5" fill="#38bdf8" />
          <circle cx="50" cy="44" r="1.5" fill="#34d399" />
          <circle cx="14" cy="20" r="1.5" fill="#67e8f9" />
          <circle cx="14" cy="44" r="1.5" fill="#2dd4bf" />

          {/* Horizontal Tech Intersect Rays */}
          <line x1="28" y1="31" x2="16" y2="31" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
          <line x1="36" y1="31" x2="48" y2="31" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        </svg>
      </div>
    </div>
  );
};

// Aliased for backwards compatibility
export const BullRunner3DIcon = Cinfi3DLogo;

/* 🌟 3D Holographic CINFI Intelligence Main Stage Element */
export const HolographicCinfi3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer 3D Neon Rings */}
      <div className="absolute w-52 h-52 rounded-full border border-cyan-500/20 animate-pulse pointer-events-none"></div>
      <div className="absolute w-40 h-40 rounded-full border border-indigo-500/30 animate-spin pointer-events-none" style={{ animationDuration: '24s' }}></div>
      <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-500/25 via-teal-500/15 to-transparent blur-xl pointer-events-none"></div>
      
      {/* 3D Glassmorphic Isometric Stage */}
      <div className="relative w-44 h-44 bg-gradient-to-b from-slate-800/85 via-slate-900/90 to-slate-950/95 border border-cyan-500/40 rounded-3xl p-4 shadow-2xl shadow-cyan-950/90 backdrop-blur-md transform hover:rotate-1 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-between">
        {/* Top telemetry */}
        <div className="w-full flex justify-between items-center text-[9px] font-mono text-cyan-400">
          <span className="flex items-center space-x-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>CINFI:3D</span>
          </span>
          <span className="text-emerald-400 font-bold">QUANT LIVE</span>
        </div>

        {/* Center Hologram Graphic with 3D CINFI Logo */}
        <div className="relative my-auto flex flex-col items-center">
          <Cinfi3DLogo size="lg" />
          <div className="mt-2 text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-emerald-300 tracking-widest uppercase font-mono">
            CINFI INTELLIGENCE
          </div>
        </div>

        {/* Floating Mini 3D Stat Bar */}
        <div className="w-full bg-slate-950/90 rounded-xl p-1.5 border border-slate-800 flex items-center justify-between text-[10px] font-mono">
          <span className="text-slate-400">AI Conviction</span>
          <span className="text-emerald-400 font-bold flex items-center space-x-0.5">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>98.4%</span>
          </span>
        </div>
      </div>
    </div>
  );
};

// Aliased for backwards compatibility
export const HolographicBull3D = HolographicCinfi3D;

export const QuantumChip3D: React.FC<{ score?: number; className?: string }> = ({ score = 89, className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="relative w-36 h-36 bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-950 border border-indigo-500/40 rounded-3xl p-3.5 shadow-2xl shadow-indigo-950/80 backdrop-blur-md flex flex-col items-center justify-between transform hover:scale-105 transition-transform duration-300">
        <div className="w-full flex justify-between items-center text-[9px] font-mono text-indigo-400">
          <span className="flex items-center space-x-1">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>10-FACTOR</span>
          </span>
          <span className="text-slate-400">SEBI TIER-1</span>
        </div>

        <div className="relative flex flex-col items-center my-auto">
          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-200 to-white font-mono tracking-tighter">
            {score}
            <span className="text-xs text-indigo-400 font-normal">/100</span>
          </div>
          <span className="text-[9px] uppercase tracking-widest text-cyan-400 font-semibold mt-0.5">
            HIGH CONVICTION
          </span>
        </div>

        <div className="w-full grid grid-cols-3 gap-1 text-[8px] font-mono text-center">
          <div className="bg-slate-950/80 border border-slate-800 rounded py-0.5 text-cyan-300">ROE 27%</div>
          <div className="bg-slate-950/80 border border-slate-800 rounded py-0.5 text-emerald-300">D/E 0.2</div>
          <div className="bg-slate-950/80 border border-slate-800 rounded py-0.5 text-amber-300">RSI 54</div>
        </div>
      </div>
    </div>
  );
};

export const ThemeRadar3D: React.FC<{ name: string; count: number; category: string }> = ({ name, count, category }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/30 border border-slate-800 p-5 hover:border-cyan-500/50 transition-all duration-300 group shadow-lg">
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none"></div>
      
      <div className="flex items-start justify-between">
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 group-hover:border-cyan-700 transition-colors">
          <Layers className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300">
          {category}
        </span>
      </div>

      <div className="mt-3">
        <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
          {name}
        </h4>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Tracked Equities</span>
          <span className="text-white font-bold">{count} Companies</span>
        </div>
      </div>
    </div>
  );
};
