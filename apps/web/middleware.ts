import type { NextRequest } from 'next/server';
import { NextResponse, URLPattern } from 'next/server';

import { CsrfError, createCsrfProtect } from '@edge-csrf/nextjs';

import { checkRequiresMultiFactorAuthentication } from '@kit/supabase/check-requires-mfa';
import { createMiddlewareClient } from '@kit/supabase/middleware-client';

import appConfig from '~/config/app.config';
import pathsConfig from '~/config/paths.config';
import { I18N_COOKIE_NAME } from '~/lib/i18n/i18n.settings';

const CSRF_SECRET_COOKIE = 'csrfSecret';
const NEXT_ACTION_HEADER = 'next-action';

export const config = {
  matcher: ['/((?!_next/static|_next/image|images|locales|assets|api/*).*)'],
};

const getUser = (request: NextRequest, response: NextResponse) => {
  const supabase = createMiddlewareClient(request, response);

  return supabase.auth.getUser();
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // set a unique request ID for each request
  // this helps us log and trace requests
  setRequestId(request);

  // Auto-detect and set language based on user's browser/region
  await handleLanguageDetection(request, response);

  // apply CSRF protection for mutating requests
  const csrfResponse = await withCsrfMiddleware(request, response);

  // handle patterns for specific routes
  const handlePattern = matchUrlPattern(request.url);

  // if a pattern handler exists, call it
  if (handlePattern) {
    const patternHandlerResponse = await handlePattern(request, csrfResponse);

    // if a pattern handler returns a response, return it
    if (patternHandlerResponse) {
      return patternHandlerResponse;
    }
  }

  // append the action path to the request headers
  // which is useful for knowing the action path in server actions
  if (isServerAction(request)) {
    csrfResponse.headers.set('x-action-path', request.nextUrl.pathname);
  }

  // if no pattern handler returned a response,
  // return the session response
  return csrfResponse;
}

async function withCsrfMiddleware(
  request: NextRequest,
  response = new NextResponse(),
) {
  // set up CSRF protection
  const csrfProtect = createCsrfProtect({
    cookie: {
      secure: appConfig.production,
      name: CSRF_SECRET_COOKIE,
    },
    // ignore CSRF errors for server actions since protection is built-in
    ignoreMethods: isServerAction(request)
      ? ['POST']
      : // always ignore GET, HEAD, and OPTIONS requests
        ['GET', 'HEAD', 'OPTIONS'],
  });

  try {
    await csrfProtect(request, response);

    return response;
  } catch (error) {
    // if there is a CSRF error, return a 403 response
    if (error instanceof CsrfError) {
      return NextResponse.json('Invalid CSRF token', {
        status: 401,
      });
    }

    throw error;
  }
}

function isServerAction(request: NextRequest) {
  const headers = new Headers(request.headers);

  return headers.has(NEXT_ACTION_HEADER);
}
/**
 * Define URL patterns and their corresponding handlers.
 */
function getPatterns() {
  return [
    {
      pattern: new URLPattern({ pathname: '/auth/*?' }),
      handler: async (req: NextRequest, res: NextResponse) => {
        const {
          data: { user },
        } = await getUser(req, res);

        // the user is logged out, so we don't need to do anything
        if (!user) {
          return;
        }

        // check if we need to verify MFA (user is authenticated but needs to verify MFA)
        const isVerifyMfa = req.nextUrl.pathname === pathsConfig.auth.verifyMfa;

        // If user is logged in and does not need to verify MFA,
        // redirect to home page.
        if (!isVerifyMfa) {
          return NextResponse.redirect(
            new URL(pathsConfig.app.home, req.nextUrl.origin).href,
          );
        }
      },
    },
    {
      pattern: new URLPattern({ pathname: '/home/*?' }),
      handler: async (req: NextRequest, res: NextResponse) => {
        const {
          data: { user },
        } = await getUser(req, res);

        const origin = req.nextUrl.origin;
        const next = req.nextUrl.pathname;

        // If user is not logged in, redirect to sign in page.
        if (!user) {
          const signIn = pathsConfig.auth.signIn;
          const redirectPath = `${signIn}?next=${next}`;

          return NextResponse.redirect(new URL(redirectPath, origin).href);
        }

        const supabase = createMiddlewareClient(req, res);

        const requiresMultiFactorAuthentication =
          await checkRequiresMultiFactorAuthentication(supabase);

        // If user requires multi-factor authentication, redirect to MFA page.
        if (requiresMultiFactorAuthentication) {
          return NextResponse.redirect(
            new URL(pathsConfig.auth.verifyMfa, origin).href,
          );
        }
      },
    },
    {
      pattern: new URLPattern({ pathname: '/' }),
      handler: async (req: NextRequest, res: NextResponse) => {
        // Marketing pages (root, faq, contact) should be accessible to all users
        // No authentication required
        return;
      },
    },
    {
      pattern: new URLPattern({ pathname: '/faq' }),
      handler: async (req: NextRequest, res: NextResponse) => {
        // Marketing pages should be accessible to all users
        return;
      },
    },
    {
      pattern: new URLPattern({ pathname: '/contact' }),
      handler: async (req: NextRequest, res: NextResponse) => {
        // Marketing pages should be accessible to all users
        return;
      },
    },
  ];
}

/**
 * Match URL patterns to specific handlers.
 * @param url
 */
function matchUrlPattern(url: string) {
  const patterns = getPatterns();
  const input = url.split('?')[0];

  for (const pattern of patterns) {
    const patternResult = pattern.pattern.exec(input);

    if (patternResult !== null && 'pathname' in patternResult) {
      return pattern.handler;
    }
  }
}

/**
 * Auto-detect user's preferred language based on multiple factors
 * @param request
 * @param response
 */
async function handleLanguageDetection(request: NextRequest, response: NextResponse) {
  // Skip if user already has a language preference set
  const existingLangCookie = request.cookies.get(I18N_COOKIE_NAME);
  if (existingLangCookie?.value) {
    return; // User already has a language preference, respect it
  }

  let detectedLanguage = 'ar'; // Default to Arabic
  let isNonArabicDetected = false;

  // Method 1: Browser Language Detection (Most Reliable)
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const browserLanguages = acceptLanguage
      .split(',')
      .map(lang => lang?.split(';')[0]?.trim()?.toLowerCase())
      .filter(Boolean);

    // Check for non-Arabic languages (major languages that indicate non-Arabic speakers)
    const nonArabicLanguages = [
      'en', 'en-us', 'en-gb', 'en-ca', 'en-au',
      'es', 'es-es', 'es-mx', 'es-ar',
      'fr', 'fr-fr', 'fr-ca',
      'de', 'de-de', 'de-at', 'de-ch',
      'it', 'it-it',
      'pt', 'pt-br', 'pt-pt',
      'ru', 'ru-ru',
      'zh', 'zh-cn', 'zh-tw',
      'ja', 'ja-jp',
      'ko', 'ko-kr',
      'hi', 'hi-in',
      'ur', 'ur-pk',
      'fa', 'fa-ir',
      'tr', 'tr-tr',
      'nl', 'nl-nl',
      'sv', 'sv-se',
      'no', 'nb-no',
      'da', 'da-dk',
      'fi', 'fi-fi',
      'pl', 'pl-pl'
    ];

    // Check if the primary language is non-Arabic
    const primaryLanguage = browserLanguages[0];
    if (primaryLanguage && (nonArabicLanguages.includes(primaryLanguage) || 
        nonArabicLanguages.some(lang => {
          const langPrefix = lang.split('-')[0];
          return langPrefix ? primaryLanguage.startsWith(langPrefix) : false;
        }))) {
      isNonArabicDetected = true;
    }
  }

  // Method 2: Timezone-based Detection (Secondary)
  if (!isNonArabicDetected) {
    const timezone = request.headers.get('cf-timezone') || request.headers.get('x-timezone');
    if (timezone) {
      // Major non-Arabic region timezones
      const nonArabicTimezones = [
        // Americas
        'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
        'America/Toronto', 'America/Vancouver', 'America/Mexico_City', 'America/Sao_Paulo',
        // Europe
        'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Rome', 'Europe/Madrid',
        'Europe/Amsterdam', 'Europe/Stockholm', 'Europe/Moscow',
        // Asia (Non-Arabic)
        'Asia/Tokyo', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Hong_Kong', 'Asia/Singapore',
        'Asia/Bangkok', 'Asia/Jakarta', 'Asia/Manila', 'Asia/Kolkata', 'Asia/Karachi',
        // Others
        'Australia/Sydney', 'Australia/Melbourne', 'Pacific/Auckland'
      ];

      if (nonArabicTimezones.includes(timezone)) {
        isNonArabicDetected = true;
      }
    }
  }

  // Method 3: Country-based detection using Cloudflare headers (if available)
  if (!isNonArabicDetected) {
    const country = request.headers.get('cf-ipcountry');
    if (country) {
      // Major non-Arabic speaking countries
      const nonArabicCountries = [
        // Americas
        'US', 'CA', 'MX', 'BR', 'AR', 'CL', 'CO',
        // Europe
        'GB', 'FR', 'DE', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK',
        'PL', 'CZ', 'RU', 'UA',
        // Asia (Non-Arabic)
        'CN', 'JP', 'KR', 'IN', 'ID', 'TH', 'VN', 'PH', 'MY', 'SG', 'BD', 'PK',
        'TR', 'IR',
        // Africa (Non-Arabic)
        'ZA', 'NG', 'KE', 'GH', 'ET',
        // Oceania
        'AU', 'NZ'
      ];

      if (nonArabicCountries.includes(country.toUpperCase())) {
        isNonArabicDetected = true;
      }
    }
  }

  // Set language based on detection (Arabic by default, English for non-Arabic regions)
  if (isNonArabicDetected) {
    detectedLanguage = 'en';
  }

  // Always set the detected language cookie
  response.cookies.set({
    name: I18N_COOKIE_NAME,
    value: detectedLanguage,
    httpOnly: false, // Allow client-side access for i18n
    secure: appConfig.production,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/'
  });

  console.log(`🌍 Language detection: ${detectedLanguage} (Non-Arabic region: ${isNonArabicDetected})`);
}

/**
 * Set a unique request ID for each request.
 * @param request
 */
function setRequestId(request: Request) {
  request.headers.set('x-correlation-id', crypto.randomUUID());
}
