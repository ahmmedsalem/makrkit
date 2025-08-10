import { use } from 'react';

import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { DashboardDemo } from '~/home/_components/dashboard-demo';
import { requireUserInServerComponent } from '~/lib/server/require-user-in-server-component';

export default function HomePage() {
  const userId = use(requireUserInServerComponent()).id;

  return (
    <>
      <PageHeader description={<Trans i18nKey="common:dashboardTabLabel" />} />

      <PageBody>
        <DashboardDemo userId={userId} />
      </PageBody>
    </>
  );
}
