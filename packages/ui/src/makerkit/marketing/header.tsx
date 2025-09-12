'use client';

import { useTranslation } from 'react-i18next';

import { cn } from '../../lib/utils';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: React.ReactNode;
  navigation?: React.ReactNode;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = function ({
  className,
  logo,
  navigation,
  actions,
  ...props
}) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <div
      className={cn(
        'site-header bg-background/80 dark:bg-black/80 sticky top-0 z-50 w-full py-1 backdrop-blur-md',
        className,
      )}
      {...props}
    >
      <div className="px-4 md:container md:mx-auto">
        <div className="grid h-14 grid-cols-[1fr_auto_1fr] md:grid-cols-3 items-center">
          <div className={cn(
            "order-1",
            "md:order-first md:flex md:items-center md:justify-start"
          )}>
            <div className="md:hidden">{navigation}</div>
            <div className={cn(
              "hidden md:block",
              isArabic ? "md:ml-auto" : ""
            )}>{logo}</div>
          </div>
          
          <div className="flex justify-center order-2">
            <div className="md:hidden">{logo}</div>
            <div className="hidden md:flex md:items-center md:justify-center">{navigation}</div>
          </div>
          
          <div className="flex items-center justify-end gap-x-2 order-3">
            {actions}
          </div>
        </div>
      </div>
    </div>
  );
};
