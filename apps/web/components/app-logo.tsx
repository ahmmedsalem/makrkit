import Link from 'next/link';

import { cn } from '@kit/ui/utils';

import appConfig from '~/config/app.config';
import Logo from './icons/Logo';

function LogoImage({
  className,
  width = 105,
}: {
  className?: string;
  width?: number;
}) {
  return <p>{appConfig.name}</p>;
}

export function AppLogo({
  collapsed,
  href,
  label,
  className,
}: {
  collapsed?: boolean;
  href?: string | null;
  className?: string;
  label?: string;
}) {
  // const { state } = useSidebar();

  if (href === null) {
    return <LogoImage className={className} />;
  }

  return (
    <Link aria-label={label ?? 'Home Page'} href={href ?? '/'}>
      <div className="flex items-center gap-2.5">
        <Logo />
        {!collapsed && (
          <p className="text-2xl font-semibold dark:text-white">
            {appConfig.name}
          </p>
        )}
      </div>
    </Link>
  );
}
