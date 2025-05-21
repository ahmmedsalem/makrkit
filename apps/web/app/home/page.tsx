import { use } from 'react';

import { PageBody, PageHeader } from '@kit/ui/page';

import { DashboardDemo } from '~/home/_components/dashboard-demo';
import { requireUserInServerComponent } from '~/lib/server/require-user-in-server-component';

export default function HomePage() {
  const userId = use(requireUserInServerComponent()).id;

  return (
    <>
      <PageHeader description={'Dashboard'} />

      <PageBody>
        <DashboardDemo userId={userId} />
      </PageBody>
    </>
  );
}
