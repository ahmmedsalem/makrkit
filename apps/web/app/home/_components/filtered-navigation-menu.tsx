'use client';

import { useUser } from '@kit/supabase/hooks/use-user';
import {
  BorderedNavigationMenu,
  BorderedNavigationMenuItem,
} from '@kit/ui/bordered-navigation-menu';

import { useFilteredNavigation } from './use-filtered-navigation';

export function FilteredNavigationMenu() {
  const user = useUser();
  const filteredConfig = useFilteredNavigation(user.data?.id || '');

  const routes = filteredConfig.routes.reduce<
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
    <BorderedNavigationMenu>
      {routes.map((route) => (
        <BorderedNavigationMenuItem {...route} key={route.path} />
      ))}
    </BorderedNavigationMenu>
  );
}