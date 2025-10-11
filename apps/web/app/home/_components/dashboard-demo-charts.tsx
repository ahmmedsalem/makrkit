'use client';

import { usePersonalAccountData } from '@kit/accounts/hooks/use-personal-account-data';
import { LoadingOverlay } from '@kit/ui/loading-overlay';
import { useTranslation } from 'react-i18next';

import TradingViewWidget from './trading-view-widget';
import TradingViewTechnicalAnalysis from './trading-view-technical-analysis';
import TradingViewMarketQuotes from './trading-view-market-quotes';
import TradingViewAdvancedChartBTC from './trading-view-advanced-chart-btc';

type DashboardDemoChartsProps = {
  userId: string;
};

export default function DashboardDemo({ userId }: DashboardDemoChartsProps) {
  const user = usePersonalAccountData(userId);
  const { i18n } = useTranslation();

  if (!user.data || user.isPending) {
    return <LoadingOverlay fullPage />;
  }

  return (
    <div
      className={
        'animate-in fade-in flex flex-col space-y-4 pb-36 duration-500'
      }
    >
      <TradingViewWidget key={`crypto-heatmap-${i18n.language}`} />

      {/* Top row: Market Quotes table (2/3) + Technical Analysis meter (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TradingViewMarketQuotes key={`market-quotes-${i18n.language}`} />
        </div>
        <div>
          <TradingViewTechnicalAnalysis key={`btc-analysis-${i18n.language}`} />
        </div>
      </div>

      {/* Bottom row: Advanced Chart (full width) */}
      <div className="w-full" style={{ height: '600px' }}>
        <TradingViewAdvancedChartBTC key={`btc-chart-${i18n.language}`} />
      </div>
    </div>
  );
}
