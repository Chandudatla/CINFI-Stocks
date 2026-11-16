import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardsHub } from './components/DashboardsHub';
import { StocksDashboard } from './components/StocksDashboard';
import { StockDetailView } from './components/StockDetailView';
import { MutualFundsDashboard } from './components/MutualFundsDashboard';
import { SpecializedDashboards } from './components/SpecializedDashboards';
import { useMarketData } from './hooks/useMarketData';
import { DashboardId } from './types/market';

export function App() {
  const [activeDashboard, setActiveDashboard] = useState<DashboardId | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [requestedResearchSymbol, setRequestedResearchSymbol] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const {
    indices,
    stocks,
    marketStatus,
    syncedAt,
    loading,
    isSyncing,
    error,
    trackCustomSymbol,
    syncNow,
  } = useMarketData();

  const handleGoHome = () => {
    setSelectedSymbol(null);
    setActiveDashboard(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDashboard = (id: DashboardId) => {
    setSelectedSymbol(null);
    setActiveDashboard(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStock = (symbol: string) => {
    setSelectedSymbol(symbol);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderMainContent = () => {
    if (selectedSymbol) {
      return (
        <StockDetailView
          symbol={selectedSymbol}
          onBack={() => setSelectedSymbol(null)}
        />
      );
    }

    if (!activeDashboard) {
      return (
        <DashboardsHub
          marketStatus={marketStatus}
          syncedAt={syncedAt}
          onOpenDashboard={handleOpenDashboard}
        />
      );
    }

    if (activeDashboard === 'stocks') {
      return (
        <StocksDashboard
          indices={indices}
          stocks={stocks}
          marketStatus={marketStatus}
          syncedAt={syncedAt}
          loading={loading}
          error={error}
          requestedResearchSymbol={requestedResearchSymbol}
          onClearRequestedResearch={() => setRequestedResearchSymbol(null)}
          onSelectStock={handleSelectStock}
          onTrackSymbol={trackCustomSymbol}
          onRetry={syncNow}
          onBack={() => setActiveDashboard(null)}
        />
      );
    }

    if (activeDashboard === 'mutual-funds') {
      return <MutualFundsDashboard onBack={() => setActiveDashboard(null)} />;
    }

    return (
      <SpecializedDashboards
        dashboardId={activeDashboard}
        onBack={() => setActiveDashboard(null)}
        onOpenStock={handleSelectStock}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      <Header
        activeDashboard={activeDashboard}
        marketStatus={marketStatus}
        onGoHome={handleGoHome}
        onOpenDashboard={handleOpenDashboard}
        onSyncLive={syncNow}
        onOpenSidebar={() => setMobileSidebarOpen(true)}
        isSyncing={isSyncing}
      />

      <div className="flex flex-1">
        <Sidebar
          activeDashboard={activeDashboard}
          onSelectHome={handleGoHome}
          onSelectDashboard={handleOpenDashboard}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        <div className="flex-1 min-w-0 flex flex-col">
          <main className="mx-auto w-full max-w-[1220px] flex-1 px-4 sm:px-6 py-6 sm:py-8">
            {renderMainContent()}
          </main>

          <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-[1220px] flex-col sm:flex-row items-center justify-between gap-2 px-6 py-5 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">
                CINFI Stocks - build by Chandu Datla
              </span>
              <span>Market data for informational purposes only. Not investment advice.</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
