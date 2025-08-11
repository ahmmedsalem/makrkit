'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

import type { User } from '@supabase/supabase-js';

import { PersonalAccountDropdown } from '@kit/accounts/personal-account-dropdown';
import { useSignOut } from '@kit/supabase/hooks/use-sign-out';
import { useUser } from '@kit/supabase/hooks/use-user';
import { Button } from '@kit/ui/button';
import { If } from '@kit/ui/if';
import { Trans } from '@kit/ui/trans';

import featuresFlagConfig from '~/config/feature-flags.config';
import pathsConfig from '~/config/paths.config';

const ModeToggle = dynamic(() =>
  import('@kit/ui/mode-toggle').then((mod) => ({
    default: mod.ModeToggle,
  })),
);

const LanguageToggle = dynamic(() =>
  import('@kit/ui/language-toggle').then((mod) => ({
    default: mod.LanguageToggle,
  })),
);

const paths = {
  home: pathsConfig.app.home,
};

const features = {
  enableThemeToggle: featuresFlagConfig.enableThemeToggle,
};

export function SiteHeaderAccountSection({
  user,
}: React.PropsWithChildren<{
  user: User | null;
}>) {
  if (!user) {
    return <AuthButtons />;
  }

  return <SuspendedPersonalAccountDropdown user={user} />;
}

function SuspendedPersonalAccountDropdown(props: { user: User | null }) {
  const signOut = useSignOut();
  const user = useUser(props.user);
  const userData = user.data ?? props.user ?? null;

  if (userData) {
    return (
      <div className={'flex items-center space-x-2'}>
        <LanguageToggle />
        
        <If condition={features.enableThemeToggle}>
          <ModeToggle />
        </If>

        <PersonalAccountDropdown
          showProfileName={false}
          paths={paths}
          user={userData}
          signOutRequested={() => signOut.mutateAsync()}
        />
      </div>
    );
  }

  return <AuthButtons />;
}

function AuthButtons() {
  return (
    <div className={'flex space-x-2'}>
      <div className={'hidden space-x-0.5 md:flex'}>
        <LanguageToggle />
        
        <If condition={features.enableThemeToggle}>
          <ModeToggle />
        </If>

        <Button asChild variant={'ghost'}>
          <Link href={pathsConfig.auth.signIn}>
            <Trans i18nKey={'auth:signIn'} />
          </Link>
        </Button>
      </div>

      <Button asChild className="group" variant={'default'}>
        <Link href={pathsConfig.auth.signUp}>
          <Trans i18nKey={'auth:signUp'} />
        </Link>
      </Button>
    </div>
  );
}
