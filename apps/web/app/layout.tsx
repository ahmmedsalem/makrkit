import { cookies } from 'next/headers';

import { Toaster } from '@kit/ui/sonner';
import { cn } from '@kit/ui/utils';

import { RootProviders } from '~/components/root-providers';
import { heading, sans, arabic, headingArabic } from '~/lib/fonts';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { generateRootMetadata } from '~/lib/root-metdata';

import '../styles/globals.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = await createI18nServerInstance();
  const theme = await getTheme();
  const className = getClassName(theme, language);
  const direction = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={language} dir={direction} className={className}>
      <body>
        <RootProviders theme={theme} lang={language}>
          {children}
        </RootProviders>

        <Toaster richColors={true} theme={theme} position="top-center" />
      </body>
    </html>
  );
}

function getClassName(theme?: string, language?: string) {
  const dark = theme === 'dark';
  const light = !dark;
  const isArabic = language === 'ar';

  // Select fonts based on language
  const fontVariables = isArabic 
    ? [arabic.variable, headingArabic.variable, sans.variable, heading.variable]
    : [sans.variable, heading.variable, arabic.variable, headingArabic.variable];

  const font = fontVariables.reduce<string[]>(
    (acc, curr) => {
      if (acc.includes(curr)) return acc;

      return [...acc, curr];
    },
    [],
  );

  return cn('bg-background min-h-screen antialiased', ...font, {
    dark,
    light,
    'font-arabic': isArabic,
    'font-sans': !isArabic,
  });
}

async function getTheme() {
  const cookiesStore = await cookies();
  return cookiesStore.get('theme')?.value as 'light' | 'dark' | 'system';
}

export const generateMetadata = generateRootMetadata;
