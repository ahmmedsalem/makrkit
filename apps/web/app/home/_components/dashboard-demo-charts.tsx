'use client';

import { usePersonalAccountData } from '@kit/accounts/hooks/use-personal-account-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import { LoadingOverlay } from '@kit/ui/loading-overlay';
import { Trans } from '@kit/ui/trans';
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
      {/* Stats Cards */}
      <div
        className={
          'grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
        }
      >
        <Card>
          <CardHeader>
            <CardTitle className={'flex items-center gap-2.5'}>
              <Trans i18nKey={'common:amountInvested'} />
            </CardTitle>

            <CardDescription>
              <Trans i18nKey={'common:amountInvestedDescription'} />
            </CardDescription>

            <div>
              <Figure>
                {'$'}
                {user.data.amount_invested}
              </Figure>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={'flex items-center gap-2.5'}>
              <Trans i18nKey={'common:revenue'} />
            </CardTitle>

            <CardDescription>
              <Trans i18nKey={'common:revenueDescription'} />
            </CardDescription>

            <div>
              <Figure>
                {'$'}
                {user.data.total_profit}
              </Figure>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={'flex items-center gap-2.5'}>
              <Trans i18nKey={'common:returnPercentage'} />
            </CardTitle>

            <CardDescription>
              <Trans i18nKey={'common:returnPercentageDescription'} />
            </CardDescription>

            <div>
              <Figure>
                {'%'}
                {user.data.return_percentage}
              </Figure>
            </div>
          </CardHeader>
        </Card>
      </div>

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

function Figure(props: React.PropsWithChildren) {
  return (
    <div className={'font-heading text-2xl font-semibold'}>
      {props.children}
    </div>
  );
}
