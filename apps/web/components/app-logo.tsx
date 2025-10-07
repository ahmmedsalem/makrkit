'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { cn } from '@kit/ui/utils';
import { Trans } from '@kit/ui/trans';
import { useTranslation } from 'react-i18next';

import appConfig from '~/config/app.config';

function LogoImage({
  className,
  width = 180,
}: {
  className?: string;
  width?: number;
}) {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  return (
    <Image
      src={isDarkMode ? '/images/logo-white.png' : '/images/logo-dark.png'}
      alt={appConfig.name}
      width={width}
      height={60}
      className={cn('h-auto', className)}
      priority
    />
  );
}

export function AppLogo({
  collapsed,
  href,
  label,
  className,
  showDashboardLabel,
}: {
  collapsed?: boolean;
  href?: string | null;
  className?: string;
  label?: string;
  showDashboardLabel?: boolean;
}) {
  if (href === null) {
    return <LogoImage className={className} />;
  }

  return (
    <Link aria-label={label ?? 'Home Page'} href={href ?? '/'}>
      <div className="flex items-center">
        <LogoImage 
          className={className}
          width={collapsed ? 48 : 180}
        />
        {!collapsed && showDashboardLabel && (
          <span className="ml-3 text-sm md:text-lg font-medium dark:text-white">
            <Trans i18nKey={'common:dashboardTabLabel'} defaults="Dashboard" />
          </span>
        )}
      </div>
    </Link>
  );
}
