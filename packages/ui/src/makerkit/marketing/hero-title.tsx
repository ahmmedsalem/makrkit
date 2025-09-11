'use client';

import { Slot, Slottable } from '@radix-ui/react-slot';
import { useTranslation } from 'react-i18next';

import { cn } from '../../lib/utils';

export const HeroTitle: React.FC<
  React.HTMLAttributes<HTMLHeadingElement> & {
    asChild?: boolean;
  }
> = function HeroTitleComponent({ children, className, ...props }) {
  const Comp = props.asChild ? Slot : 'h1';
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <Comp
      className={cn(
        'hero-title flex flex-col text-center text-2xl font-semibold tracking-tighter sm:text-4xl lg:max-w-5xl lg:text-5xl xl:text-6xl dark:text-white',
        isArabic ? 'font-arabic' : 'font-sans',
        className,
      )}
      {...props}
    >
      <Slottable>{children}</Slottable>
    </Comp>
  );
};
