import { PageBody } from '@kit/ui/page';

import { DEFAULT_SCREENER } from '~/lib/stocklib/yahoo-finance/constants';
import { fetchScreenerStocks } from '~/lib/stocklib/yahoo-finance/fetchScreenerStocks';

import { columns } from './components/columns';
import { DataTable } from './components/data-table';

export default async function ScreenerPage({
  searchParams,
}: {
  searchParams?: {
    screener?: string;
  };
}) {
  const screener = searchParams?.screener || DEFAULT_SCREENER;

  const screenerDataResults = await fetchScreenerStocks(screener);

  return (
    <PageBody>
      <DataTable columns={columns} data={screenerDataResults.quotes} />
    </PageBody>
  );
}
