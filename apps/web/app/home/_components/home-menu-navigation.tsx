import dynamic from 'next/dynamic';

import {
  BorderedNavigationMenu,
  BorderedNavigationMenuItem,
} from '@kit/ui/bordered-navigation-menu';
import { If } from '@kit/ui/if';

import { AppLogo } from '~/components/app-logo';
import { ProfileAccountDropdownContainer } from '~/components/personal-account-dropdown-container';
import featuresFlagConfig from '~/config/feature-flags.config';
import { navigationConfig } from '~/config/navigation.config';

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

export function HomeMenuNavigation() {
  const routes = navigationConfig.routes.reduce<
    Array<{
      path: string;
      label: string;
      Icon?: React.ReactNode;
      end?: boolean | ((path: string) => boolean);
    }>
  >((acc, item) => {
    if ('children' in item) {
      return [...acc, ...item.children];
    }

    if ('divider' in item) {
      return acc;
    }

    return [...acc, item];
  }, []);

  return (
    <div className={'flex w-full flex-1 justify-between'}>
      <div className={'flex items-center space-x-8'}>
        <AppLogo />

        <BorderedNavigationMenu>
          {routes.map((route) => (
            <BorderedNavigationMenuItem {...route} key={route.path} />
          ))}
        </BorderedNavigationMenu>
      </div>

      <div className={'flex items-center justify-end space-x-2'}>
        <LanguageToggle />
        
        <If condition={featuresFlagConfig.enableThemeToggle}>
          <ModeToggle />
        </If>

        <ProfileAccountDropdownContainer showProfileName={false} />
      </div>
    </div>
  );
}
