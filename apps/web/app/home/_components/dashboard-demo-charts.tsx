'use client';

import { useMemo, useState } from 'react';

import {
  Bar,
  BarChart,
  CartesianGrid, XAxis
} from 'recharts';

import { usePersonalAccountData } from '@kit/accounts/hooks/use-personal-account-data';
import {
  Card,
  CardContent,
  CardDescription, CardHeader,
  CardTitle
} from '@kit/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@kit/ui/chart';
import { LoadingOverlay } from '@kit/ui/loading-overlay';
import { Trans } from '@kit/ui/trans';

import TradingViewWidget from './trading-view-widget';
import TradingViewWidgetSecond from './trading-view-widget-second';
import TradingViewScreener from './trading-view-screener';
import TradingViewAdvancedChart from './trading-view-advanced-chart';
import TradingViewSymbolInfo from './trading-view-symbol-info';
import TradingViewTimeline from './trading-view-timeline';

type DashboardDemoChartsProps = {
  userId: string;
};

export default function DashboardDemo({ userId }: DashboardDemoChartsProps) {
  const user = usePersonalAccountData(userId);

  if (!user.data || user.isPending) {
    return <LoadingOverlay fullPage />;
  }

  return (
    <div
      className={
        'animate-in fade-in flex flex-col space-y-4 pb-36 duration-500'
      }
    >
      <div
        className={
          'grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
        }
      >
        <Card>
          <CardHeader>
            <CardTitle className={'flex items-center gap-2.5'}>
              <Trans i18nKey={'common:amountInvested'} />
              {/* <Trend trend={'up'}>20%</Trend> */}
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
          {/* 
          <CardContent className={'space-y-4'}>
            <Chart data={mrr[0]} />
          </CardContent> */}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={'flex items-center gap-2.5'}>
              <Trans i18nKey={'common:revenue'} />
              {/* <Trend trend={'up'}>12%</Trend> */}
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

          {/* <CardContent>
            <Chart data={netRevenue[0]} />
          </CardContent> */}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={'flex items-center gap-2.5'}>
              <Trans i18nKey={'common:returnPercentage'} />
              {/* <Trend trend={'up'}>9%</Trend> */}
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

      <TradingViewTimeline />

      <TradingViewAdvancedChart />

      <TradingViewWidget />

      <TradingViewScreener />

      {/* Symbol Info Grid */}
      <div
        className={
          'grid grid-cols-1 gap-4 md:grid-cols-2 mb-3'
        }
      >
        <TradingViewSymbolInfo symbol="NASDAQ:AAPL" />
        <TradingViewSymbolInfo symbol="NASDAQ:GOOGL" />
      </div>
      <div
        className={
          'mt-6'
        }
      >
        <TradingViewWidgetSecond />
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

