import React from 'react';
import { ShieldAlert, X, Check, ShieldCheck } from 'lucide-react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 max-w-2xl w-full rounded-2xl p-6 shadow-2xl space-y-5 text-xs text-slate-300">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2 text-amber-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">
              SEBI Educational & Research Disclosure
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 leading-relaxed text-slate-300">
          <p>
            <strong className="text-white">CINFI Stocks</strong> (developed by <strong className="text-white">RUINNERS</strong>) is an automated financial data analytics and quantitative research platform designed solely for educational, screening, and analytical purposes.
          </p>

          <p>
            1. <strong className="text-white">Not Investment Advice:</strong> Nothing contained in this application constitutes personalized investment advice, financial advisory, recommendation, or solicitation to buy or sell securities under the SEBI (Investment Advisers) Regulations, 2013 or SEBI (Research Analysts) Regulations, 2014.
          </p>

          <p>
            2. <strong className="text-white">Deterministic Scoring Models:</strong> The 10-Factor AI Research Scores and theme exposure calculations are algorithmic quantitative indicators based on historical and trailing statutory filings submitted to the National Stock Exchange of India (NSE) and Bombay Stock Exchange (BSE).
          </p>

          <p>
            3. <strong className="text-white">Market Risk:</strong> Investments in securities market are subject to market risks. Please read all related offer documents carefully and consult a SEBI-registered financial advisor before making any investment decisions.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-md shadow-cyan-950 flex items-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>I Understand & Acknowledge</span>
          </button>
        </div>
      </div>
    </div>
  );
};
