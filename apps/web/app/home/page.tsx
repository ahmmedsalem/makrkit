import React from 'react';

import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { HeaderSwitchers } from '~/components/header-switchers';
import { DashboardDemo } from '~/home/_components/dashboard-demo';
import { AccountStatusWrapper } from '~/home/_components/account-status-wrapper';
import { getUserOptional } from '~/lib/server/get-user-optional';

export default async function HomePage() {
  const user = await getUserOptional();

  return (
    <>
      <PageHeader description={<Trans i18nKey="common:dashboardTabLabel" />}>
        <HeaderSwitchers />
      </PageHeader>

      <PageBody>
        {user ? (
          <AccountStatusWrapper user={user}>
            <DashboardDemo userId={user.id} />
          </AccountStatusWrapper>
        ) : (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">
                <Trans i18nKey="common:welcomeToDashboard" />
              </h2>
              <p className="text-muted-foreground mb-4">
                <Trans i18nKey="common:pleaseSignInToAccess" />
              </p>
              <a
                href="/auth/sign-in"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                <Trans i18nKey="auth:signIn" />
              </a>
            </div>
          </div>
        )}
      </PageBody>
    </>
  );
}
