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

  let detectedLanguage = 'en'; // Default to English

  // Method 1: Browser Language Detection (Most Reliable)
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const browserLanguages = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().toLowerCase());

    // Check for Arabic languages
    const arabicLanguages = [
      'ar', 'ar-sa', 'ar-eg', 'ar-ae', 'ar-kw', 'ar-qa', 
      'ar-bh', 'ar-om', 'ar-ye', 'ar-sy', 'ar-jo', 'ar-lb',
      'ar-iq', 'ar-ly', 'ar-ma', 'ar-tn', 'ar-dz', 'ar-sd'
    ];

    if (browserLanguages.some(lang => arabicLanguages.includes(lang) || lang.startsWith('ar'))) {
      detectedLanguage = 'ar';
    }
  }

  // Method 2: Timezone-based Detection (Secondary)
  if (detectedLanguage === 'en') {
    const timezone = request.headers.get('cf-timezone') || request.headers.get('x-timezone');
    if (timezone) {
      // Arabic region timezones
      const arabicTimezones = [
        'Asia/Riyadh', 'Asia/Kuwait', 'Asia/Qatar', 'Asia/Bahrain',
        'Asia/Dubai', 'Asia/Muscat', 'Asia/Baghdad', 'Asia/Damascus',
        'Asia/Amman', 'Asia/Beirut', 'Africa/Cairo', 'Africa/Tripoli',
        'Africa/Tunis', 'Africa/Algiers', 'Africa/Casablanca', 'Africa/Khartoum'
      ];

      if (arabicTimezones.includes(timezone)) {
        detectedLanguage = 'ar';
      }
    }
  }

  // Method 3: Country-based detection using Cloudflare headers (if available)
  if (detectedLanguage === 'en') {
    const country = request.headers.get('cf-ipcountry');
    if (country) {
      // Arabic-speaking countries
      const arabicCountries = [
        'SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'YE', 'IQ', 
        'SY', 'JO', 'LB', 'PS', 'EG', 'LY', 'TN', 'DZ', 
        'MA', 'SD', 'MR', 'DJ', 'SO', 'KM'
      ];

      if (arabicCountries.includes(country.toUpperCase())) {
        detectedLanguage = 'ar';
      }
    }
  }

  // Set the detected language cookie
  if (detectedLanguage === 'ar') {
    response.cookies.set({
      name: I18N_COOKIE_NAME,
      value: detectedLanguage,
      httpOnly: false, // Allow client-side access for i18n
      secure: appConfig.production,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/'
    });
  }
}

/**
 * Set a unique request ID for each request.
 * @param request
 */
function setRequestId(request: Request) {
  request.headers.set('x-correlation-id', crypto.randomUUID());
}
