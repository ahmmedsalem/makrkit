import { Suspense } from 'react';

import type { Metadata } from 'next';

import { Interval } from 'types/yahoo-finance';

import { Card, CardContent } from '@kit/ui/card';

import StockChart from '~/components/chart/StockChart';
import {
  DEFAULT_INTERVAL,
  DEFAULT_RANGE,
} from '~/lib/stocklib/yahoo-finance/constants';
import {
  validateInterval,
  validateRange,
} from '~/lib/stocklib/yahoo-finance/fetchChartData';
import { fetchQuote } from '~/lib/stocklib/yahoo-finance/fetchQuote';

import CompanySummaryCard from './components/CompanySummaryCard';
import FinanceSummary from './components/FinanceSummary';
import News from './components/News';

type Props = {
  params: {
    ticker: string;
  };
  searchParams?: {
    ticker?: string;
    range?: string;
    interval?: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ticker = params.ticker;

  const quoteData = await fetchQuote(ticker);
  const regularMarketPrice = quoteData.regularMarketPrice?.toLocaleString(
    'en-US',
    {
      style: 'currency',
      currency: 'USD',
    },
  );

  return {
    title: `${ticker} ${regularMarketPrice}`,
    description: `Stocks page for ${ticker}`,
    keywords: [ticker, 'stocks'],
  };
}

export default async function StocksPage({ params, searchParams }: Props) {
  const ticker = params.ticker;
  const range = validateRange(searchParams?.range || DEFAULT_RANGE);
  const interval = validateInterval(
    range,
    (searchParams?.interval as Interval) || DEFAULT_INTERVAL,
  );

  return (
    <div>
      <Card>
        <CardContent className="space-y-10 pt-6 lg:px-40 lg:py-14">
          <Suspense
            fallback={
              <div className="text-muted-foreground flex h-[27.5rem] items-center justify-center">
                Loading...
              </div>
            }
          >
            <StockChart ticker={ticker} range={range} interval={interval} />
          </Suspense>
          <Suspense
            fallback={
              <div className="text-muted-foreground flex h-[10rem] items-center justify-center">
                Loading...
              </div>
            }
          >
            <FinanceSummary ticker={ticker} />
          </Suspense>
          <Suspense
            fallback={
              <div className="text-muted-foreground flex h-[10rem] items-center justify-center">
                Loading...
              </div>
            }
          >
            <CompanySummaryCard ticker={ticker} />
          </Suspense>
          <Suspense
            fallback={
              <div className="text-muted-foreground flex h-[20rem] items-center justify-center">
                Loading...
              </div>
            }
          >
            <News ticker={ticker} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
