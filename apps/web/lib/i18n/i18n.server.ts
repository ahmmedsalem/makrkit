import { cache } from 'react';

import { cookies, headers } from 'next/headers';

import {
  initializeServerI18n,
  parseAcceptLanguageHeader,
} from '@kit/i18n/server';

import featuresFlagConfig from '~/config/feature-flags.config';
import {
  I18N_COOKIE_NAME,
  getI18nSettings,
  languages,
} from '~/lib/i18n/i18n.settings';

import { i18nResolver } from './i18n.resolver';

/**
 * @name priority
 * @description The language priority setting from the feature flag configuration.
 */
const priority = featuresFlagConfig.languagePriority;

/**
 * @name createI18nServerInstance
 * @description Creates an instance of the i18n server.
 * It uses the language from the cookie if it exists, otherwise it uses the language from the accept-language header.
 * If neither is available, it will default to the provided environment variable.
 *
 * Initialize the i18n instance for every RSC server request (eg. each page/layout)
 */
async function createInstance() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(I18N_COOKIE_NAME)?.value;

  let selectedLanguage: string | undefined = undefined;

  // Priority 1: If language priority is 'application', always start with Arabic as default
  if (priority === 'application') {
    selectedLanguage = 'ar'; // Always start with Arabic for application priority
  }

  // Priority 2: If we have a cookie and it's different from default, use it
  if (cookie && priority === 'application') {
    // Only override Arabic default if cookie explicitly has a different language
    // This allows the middleware to set the language properly
    selectedLanguage = getLanguageOrFallback(cookie);
  } else if (cookie && priority === 'user') {
    // For user priority, always respect the cookie
    selectedLanguage = getLanguageOrFallback(cookie);
  }

  // Priority 3: If no cookie and priority is user, check browser language  
  if (!selectedLanguage && priority === 'user') {
    const userPreferredLanguage = await getPreferredLanguageFromBrowser();

    selectedLanguage = getLanguageOrFallback(userPreferredLanguage);
  }

  const settings = getI18nSettings(selectedLanguage);

  return initializeServerI18n(settings, i18nResolver);
}

export const createI18nServerInstance = cache(createInstance);

async function getPreferredLanguageFromBrowser() {
  const headersStore = await headers();
  const acceptLanguage = headersStore.get('accept-language');

  if (!acceptLanguage) {
    return;
  }

  return parseAcceptLanguageHeader(acceptLanguage, languages)[0];
}

function getLanguageOrFallback(language: string | undefined) {
  let selectedLanguage = language;

  if (!languages.includes(language ?? '')) {
    console.warn(
      `Language "${language}" is not supported. Falling back to "${languages[0]}"`,
    );

    selectedLanguage = languages[0];
  }

  return selectedLanguage;
}
