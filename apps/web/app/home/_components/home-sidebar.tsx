'use client';

import type { User } from '@supabase/supabase-js';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarNavigation,
  useSidebar,
} from '@kit/ui/shadcn-sidebar';

import { AppLogo } from '~/components/app-logo';
import { ProfileAccountDropdownContainer } from '~/components/personal-account-dropdown-container';
import { Tables } from '~/lib/database.types';

import { useFilteredNavigation } from './use-filtered-navigation';

export function HomeSidebar(props: {
  account?: Tables<'accounts'>;
  user: User;
}) {
  const { state } = useSidebar();
  const filteredConfig = useFilteredNavigation(props.user.id);

  return (
    <Sidebar collapsible={'icon'}>
      <SidebarHeader className={'h-16 justify-center'}>
        <div className={'flex items-center justify-center'}>
          <div>
            <AppLogo collapsed={state == 'collapsed'} />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarNavigation config={filteredConfig} />
      </SidebarContent>

      <SidebarFooter>
        <ProfileAccountDropdownContainer
          user={props.user}
          account={props.account}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
