import { use } from 'react';

import { PageBody } from '@kit/ui/page';

import { DEFAULT_SCREENER } from '~/lib/stocklib/yahoo-finance/constants';
import { fetchScreenerStocks } from '~/lib/stocklib/yahoo-finance/fetchScreenerStocks';
import { RequireActiveAccount } from '~/home/_components/require-active-account';
import { requireUserInServerComponent } from '~/lib/server/require-user-in-server-component';

import { columns } from './components/columns';
import { DataTable } from './components/data-table';

export default async function ScreenerPage({
  searchParams,
}: {
  searchParams?: {
    screener?: string;
  };
}) {
  const user = use(requireUserInServerComponent());
  const screener = searchParams?.screener || DEFAULT_SCREENER;

  const screenerDataResults = await fetchScreenerStocks(screener);

  return (
    <PageBody>
      <RequireActiveAccount user={user}>
        <DataTable columns={columns} data={screenerDataResults.quotes} />
      </RequireActiveAccount>
    </PageBody>
  );
}
