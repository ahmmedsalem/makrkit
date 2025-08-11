'use client';

import { useMemo } from 'react';

import dynamic from 'next/dynamic';

import { ThemeProvider } from 'next-themes';

import { CaptchaProvider } from '@kit/auth/captcha/client';
import { I18nProvider } from '@kit/i18n/provider';
import { If } from '@kit/ui/if';
import { VersionUpdater } from '@kit/ui/version-updater';

import { AuthProvider } from '~/components/auth-provider';
import { CrispChatWrapper } from '~/components/crisp-chat-wrapper';
import authConfig from '~/config/auth.config';
import featuresFlagConfig from '~/config/feature-flags.config';
import { i18nResolver } from '~/lib/i18n/i18n.resolver';
import { getI18nSettings } from '~/lib/i18n/i18n.settings';

import { ReactQueryProvider } from './react-query-provider';

const captchaSiteKey = authConfig.captchaTokenSiteKey;

const CaptchaTokenSetter = dynamic(async () => {
  if (!captchaSiteKey) {
    return Promise.resolve(() => null);
  }

  const { CaptchaTokenSetter } = await import('@kit/auth/captcha/client');

  return {
    default: CaptchaTokenSetter,
  };
});

export function RootProviders({
  lang,
  children,
}: React.PropsWithChildren<{
  lang: string;
}>) {
  const i18nSettings = useMemo(() => getI18nSettings(lang), [lang]);

  return (
    <ReactQueryProvider>
      <I18nProvider settings={i18nSettings} resolver={i18nResolver}>
        <CaptchaProvider>
          <CaptchaTokenSetter siteKey={captchaSiteKey} />

          <AuthProvider>
            <ThemeProvider
              attribute="class"
              enableSystem={false}
              disableTransitionOnChange
              defaultTheme="dark"
              enableColorScheme={false}
            >
              {children}
            </ThemeProvider>
          </AuthProvider>
        </CaptchaProvider>

        <If condition={featuresFlagConfig.enableVersionUpdater}>
          <VersionUpdater />
        </If>

        <CrispChatWrapper websiteId="1b7ff945-4db2-4bb2-bc94-0df82c797c9a" />
      </I18nProvider>
    </ReactQueryProvider>
  );
}
