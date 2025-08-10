import Link from 'next/link';

import { SignInMethodsContainer } from '@kit/auth/sign-in';
import { Button } from '@kit/ui/button';
import { Heading } from '@kit/ui/heading';
import { Trans } from '@kit/ui/trans';

import authConfig from '~/config/auth.config';
import pathsConfig from '~/config/paths.config';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

interface SignInPageProps {
  searchParams: {
    next?: string;
  };
}

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();

  return {
    title: i18n.t('auth:signIn'),
  };
};

const paths = {
  callback: pathsConfig.auth.callback,
  home: pathsConfig.app.home,
};

function SignInPage({ searchParams }: SignInPageProps) {
  // Determine where to redirect after successful sign-in
  // If 'next' parameter is a marketing page, redirect there; otherwise go to home
  const nextPath = searchParams.next;
  const returnPath = nextPath === '/' || nextPath?.startsWith('/faq') || nextPath?.startsWith('/contact') 
    ? '/' 
    : pathsConfig.app.home;

  const dynamicPaths = {
    ...paths,
    home: returnPath,
  };

  return (
    <>
      <Heading level={5} className={'tracking-tight'}>
        <Trans i18nKey={'auth:signInHeading'} />
      </Heading>

      <SignInMethodsContainer paths={dynamicPaths} providers={authConfig.providers} />

      <div className={'flex justify-center'}>
        <Button asChild variant={'link'} size={'sm'}>
          <Link href={pathsConfig.auth.signUp}>
            <Trans i18nKey={'auth:doNotHaveAccountYet'} />
          </Link>
        </Button>
      </div>
    </>
  );
}

export default withI18n(SignInPage);
