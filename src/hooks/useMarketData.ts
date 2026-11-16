import { useState, useEffect, useCallback } from 'react';
import { IndexQuote, MarketStatus, StockQuote } from '../types/market';

const CUSTOM_SYMBOLS_KEY = 'cinfi_custom_symbols_v2';

export function useMarketData() {
  const [indices, setIndices] = useState<IndexQuote[]>([]);
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [marketStatus, setMarketStatus] = useState<MarketStatus | null>(null);
  const [syncedAt, setSyncedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [customSymbols, setCustomSymbols] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_SYMBOLS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_SYMBOLS_KEY, JSON.stringify(customSymbols));
    } catch {
      // Ignore storage quota errors
    }
  }, [customSymbols]);

  const fetchMarket = useCallback(
    async (force = false, symbolsList = customSymbols) => {
      setIsSyncing(true);
      try {
        const params = new URLSearchParams();
        if (force) params.set('force', 'true');
        if (symbolsList.length > 0) params.set('symbols', symbolsList.join(','));
        const qs = params.toString();
        const url = qs ? `/api/market?${qs}` : '/api/market';
        const res = await fetch(url);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || 'Failed to sync market feed');
        }
        setIndices(Array.isArray(data.indices) ? data.indices : []);
        setStocks(Array.isArray(data.stocks) ? data.stocks : []);
        setMarketStatus(data.marketStatus || null);
        setSyncedAt(data.syncedAt || new Date().toISOString());
        setError(null);
      } catch (err: any) {
        setError(err?.message || 'Unable to connect to live market feed');
      } finally {
        setLoading(false);
        setIsSyncing(false);
      }
    },
    [customSymbols]
  );

  useEffect(() => {
    fetchMarket(false);
    const interval = setInterval(() => {
      fetchMarket(false);
    }, 30_000);
    return () => clearInterval(interval);
  }, [fetchMarket]);

  const trackCustomSymbol = useCallback(
    (symbol: string) => {
      const normalized = symbol.trim().toUpperCase();
      if (!normalized) return;
      setCustomSymbols((prev) => {
        if (prev.includes(normalized)) return prev;
        const next = [...prev, normalized];
        fetchMarket(true, next);
        return next;
      });
    },
    [fetchMarket]
  );

  return {
    indices,
    stocks,
    marketStatus,
    syncedAt,
    loading,
    isSyncing,
    error,
    trackCustomSymbol,
    syncNow: () => fetchMarket(true),
  };
}
