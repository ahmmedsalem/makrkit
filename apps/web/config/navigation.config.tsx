import { Home, MonitorUp, TrendingUp, User, Wallet } from 'lucide-react';
import { z } from 'zod';

import { NavigationConfigSchema } from '@kit/ui/navigation-schema';

import pathsConfig from '~/config/paths.config';

const iconClasses = 'w-4';

const routes = [
  {
    label: 'common:routes.application',
    children: [
      {
        label: 'common:routes.home',
        path: pathsConfig.app.home,
        Icon: <Home className={iconClasses} />,
        end: true,
      },
    ],
  },
  {
    label: 'common:routes.marketNews',
    children: [
      {
        label: 'common:routes.marketNews',
        path: pathsConfig.app.marketNews,
        Icon: <TrendingUp className={iconClasses} />,
      },
    ],
  },
  {
    label: 'common:routes.screener',
    children: [
      {
        label: 'common:routes.screener',
        path: pathsConfig.app.screener,
        Icon: <MonitorUp className={iconClasses} />,
      },
    ],
  },
  {
    label: 'common:routes.settings',
    children: [
      {
        label: 'common:routes.profile',
        path: pathsConfig.app.profileSettings,
        Icon: <User className={iconClasses} />,
      },
    ],
  },
  {
    label: 'Wallet',
    children: [
      {
        label: 'Wallet',
        path: pathsConfig.app.wallet,
        Icon: <Wallet className={iconClasses} />,
      },
    ],
  },
] satisfies z.infer<typeof NavigationConfigSchema>['routes'];

export const navigationConfig = NavigationConfigSchema.parse({
  routes,
  style: process.env.NEXT_PUBLIC_NAVIGATION_STYLE,
  sidebarCollapsed: process.env.NEXT_PUBLIC_HOME_SIDEBAR_COLLAPSED,
});
