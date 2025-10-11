import React from 'react';

import { cookies } from 'next/headers';

import {
  Page,
  PageLayoutStyle,
  PageMobileNavigation,
  PageNavigation,
} from '@kit/ui/page';
import { SidebarProvider } from '@kit/ui/shadcn-sidebar';

import { AppLogo } from '~/components/app-logo';
import Logo from '~/components/icons/Logo';
import { navigationConfig } from '~/config/navigation.config';
import { withI18n } from '~/lib/i18n/with-i18n';
import { getUserOptional } from '~/lib/server/get-user-optional';

// home imports
import { HomeMenuNavigation } from './_components/home-menu-navigation';
import { HomeMobileNavigation } from './_components/home-mobile-navigation';
import { HomeSidebar } from './_components/home-sidebar';

async function HomeLayout({ children }: React.PropsWithChildren) {
  const style = await getLayoutStyle();

  if (style === 'sidebar') {
    return <SidebarLayout>{children}</SidebarLayout>;
  }

  return <HeaderLayout>{children}</HeaderLayout>;
}

export default withI18n(HomeLayout);

async function SidebarLayout({ children }: React.PropsWithChildren) {
  const sidebarMinimized = navigationConfig.sidebarCollapsed;
  const user = await getUserOptional();

  return (
    <SidebarProvider defaultOpen={sidebarMinimized}>
      <Page style={'sidebar'}>
        {user && (
          <PageNavigation>
            <HomeSidebar user={user} />
          </PageNavigation>
        )}

        <PageMobileNavigation className={'flex items-center justify-between'}>
          <MobileNavigation />
        </PageMobileNavigation>

        {children}
      </Page>
    </SidebarProvider>
  );
}

function HeaderLayout({ children }: React.PropsWithChildren) {
  return (
    <Page style={'header'}>
      <PageNavigation>
        <HomeMenuNavigation />
      </PageNavigation>

      <PageMobileNavigation className={'flex items-center justify-between'}>
        <MobileNavigation />
      </PageMobileNavigation>

      {children}
    </Page>
  );
}

function MobileNavigation() {
  return (
    <>
      <Logo />

      <HomeMobileNavigation />
    </>
  );
}

async function getLayoutStyle() {
  const cookieStore = await cookies();

  return (
    (cookieStore.get('layout-style')?.value as PageLayoutStyle) ??
    navigationConfig.style
  );
}
