import Link from 'next/link';

import yahooFinance from 'yahoo-finance2';

import { Card, CardContent } from '@kit/ui/card';

export default async function CompanySummaryCard({
  ticker,
}: {
  ticker: string;
}) {
  const data = await yahooFinance.quoteSummary(ticker, {
    modules: ['summaryProfile'],
  });

  if (!data.summaryProfile) {
    return null;
  }
  const {
    longBusinessSummary,
    sector,
    industryDisp,
    country,
    fullTimeEmployees,
    website,
  } = data.summaryProfile;

  return (
    <Card className="group relative min-h-max overflow-hidden">
      <div className="bg-size-200 bg-pos-0 group-hover:bg-pos-100 absolute z-0 h-full w-full bg-gradient-to-t from-neutral-50 via-neutral-200 to-neutral-50 blur-2xl transition-all duration-500 dark:from-black dark:via-blue-950 dark:to-black" />

      <CardContent className="z-50 flex h-full w-full flex-col items-start justify-center gap-6 py-10 text-sm lg:flex-row">
        <div className="z-50 max-w-2xl font-medium text-pretty">
          {/* <ReadMoreText text={longBusinessSummary ?? ""} truncateLength={500} /> */}
        </div>
        {sector && industryDisp && country && fullTimeEmployees && website && (
          <div className="text-muted-foreground z-50 min-w-fit font-medium">
            <div>
              Sector: <span className="text-foreground">{sector}</span>
            </div>
            <div>
              Industry: <span className="text-foreground">{industryDisp}</span>
            </div>
            <div>
              Country: <span className="text-foreground">{country}</span>
            </div>
            <div>
              Employees:{' '}
              <span className="text-foreground">
                {fullTimeEmployees?.toLocaleString('en-US')}
              </span>
            </div>
            <div>
              Website:{' '}
              <span className="text-foreground">
                {website && (
                  <Link
                    href={website}
                    className="text-blue-600 hover:underline dark:text-blue-500"
                  >
                    {website}
                  </Link>
                )}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
