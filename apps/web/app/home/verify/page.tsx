import { use } from 'react';

import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { VerificationForm } from '~/home/verify/_components/verification-form';
import { requireUserInServerComponent } from '~/lib/server/require-user-in-server-component';

export default function VerifyPage() {
  const user = use(requireUserInServerComponent());

  return (
    <>
      <PageHeader 
        title={<Trans i18nKey="account:verifyAccount" defaults="Verify Your Account" />}
        description={<Trans i18nKey="account:verificationDescription" defaults="Complete the verification process to activate your account" />}
      />

      <PageBody>
        <div className="mx-auto max-w-2xl">
          <VerificationForm user={user} />
        </div>
      </PageBody>
    </>
  );
}