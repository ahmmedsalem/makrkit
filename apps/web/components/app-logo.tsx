'use client';

import Link from 'next/link';

import { cn } from '@kit/ui/utils';
import { Trans } from '@kit/ui/trans';
import { useTranslation } from 'react-i18next';

import appConfig from '~/config/app.config';
import Logo from './icons/Logo';

function LogoImage({
  className,
  width = 105,
}: {
  className?: string;
  width?: number;
}) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  
  return <p>{isArabic ? 'دراجوس كابيتال' : appConfig.name}</p>;
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
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  if (href === null) {
    return <LogoImage className={className} />;
  }

  return (
    <Link aria-label={label ?? 'Home Page'} href={href ?? '/'}>
      <div className="flex items-center gap-2.5">
        <Logo />
        {!collapsed && (
          <p className="text-2xl font-semibold dark:text-white">
            {showDashboardLabel ? (
              <Trans i18nKey={'common:dashboardTabLabel'} defaults="Dashboard" />
            ) : (
              isArabic ? 'دراجوس كابيتال' : appConfig.name
            )}
          </p>
        )}
      </div>
    </Link>
  );
}
