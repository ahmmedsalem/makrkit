'use client';

import { useMemo } from 'react';

import { usePersonalAccountData } from '@kit/accounts/hooks/use-personal-account-data';
import { canAccessProtectedRoutes } from '@kit/accounts/utils/account-access';

import { navigationConfig } from '~/config/navigation.config';
import pathsConfig from '~/config/paths.config';

const PROTECTED_ROUTES = [
  pathsConfig.app.marketNews,
  pathsConfig.app.screener,
  pathsConfig.app.wallet,
];

export function useFilteredNavigation(userId: string) {
  const personalAccountData = usePersonalAccountData(userId);
  const accountStatus = personalAccountData?.data?.status;
  const hasAccess = canAccessProtectedRoutes(accountStatus);

  return useMemo(() => {
    if (hasAccess) {
      return navigationConfig;
    }

    const filteredRoutes = navigationConfig.routes.map((section) => {
      if ('children' in section) {
        return {
          ...section,
          children: section.children.filter((route) => {
            if ('path' in route) {
              return !PROTECTED_ROUTES.includes(route.path);
            }
            return true;
          }),
        };
      }
      return section;
    }).filter((section) => {
      if ('children' in section) {
        return section.children.length > 0;
      }
      return true;
    });

    return {
      ...navigationConfig,
      routes: filteredRoutes,
    };
  }, [hasAccess]);
}