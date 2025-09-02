import { use } from 'react';

import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { HeaderSwitchers } from '~/components/header-switchers';
import { DashboardDemo } from '~/home/_components/dashboard-demo';
import { AccountStatusWrapper } from '~/home/_components/account-status-wrapper';
import { requireUserInServerComponent } from '~/lib/server/require-user-in-server-component';

export default function HomePage() {
  const user = use(requireUserInServerComponent());

  return (
    <>
      <PageHeader description={<Trans i18nKey="common:dashboardTabLabel" />}>
        <HeaderSwitchers />
      </PageHeader>

      <PageBody>
        <AccountStatusWrapper user={user}>
          <DashboardDemo userId={user.id} />
        </AccountStatusWrapper>
      </PageBody>
    </>
  );
}
