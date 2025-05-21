import Link from 'next/link';

import { cn } from '@kit/ui/utils';

import Logo from './icons/Logo';

function LogoImage({
  className,
  width = 105,
}: {
  className?: string;
  width?: number;
}) {
  return <p>Dragos Capital</p>;
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
      <div className="flex">
        <Logo />
        {!collapsed && (
          <p className="ml-2.5 text-2xl font-semibold dark:text-white">
            {'Dragos Capital'}
          </p>
        )}
      </div>
    </Link>
  );
}
