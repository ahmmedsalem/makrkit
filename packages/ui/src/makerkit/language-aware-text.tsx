'use client';

import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';

interface LanguageAwareTextProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
}

/**
 * A wrapper component that applies the appropriate font family based on the current language
 */
export function LanguageAwareText({ 
  children, 
  as: Component = 'div',
  className,
  ...props 
}: LanguageAwareTextProps) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <Component 
      className={cn(
        isArabic ? 'font-arabic' : 'font-sans',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

// Convenience components for common use cases
export function LanguageAwareHeading({ 
  children, 
  className, 
  ...props 
}: Omit<LanguageAwareTextProps, 'as'>) {
  return (
    <LanguageAwareText as="h2" className={cn('text-2xl font-bold', className)} {...props}>
      {children}
    </LanguageAwareText>
  );
}

export function LanguageAwareParagraph({ 
  children, 
  className, 
  ...props 
}: Omit<LanguageAwareTextProps, 'as'>) {
  return (
    <LanguageAwareText as="p" className={className} {...props}>
      {children}
    </LanguageAwareText>
  );
}