import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

import { createAuthCallbackService } from '@kit/supabase/auth';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import pathsConfig from '~/config/paths.config';

export async function GET(request: NextRequest) {
  const service = createAuthCallbackService(getSupabaseServerClient());
  
  // Get the 'next' parameter from the URL to determine where to redirect
  const url = new URL(request.url);
  const nextParam = url.searchParams.get('next');
  
  // If 'next' parameter exists and it's a marketing page, redirect there
  // Otherwise, default to the home page for authenticated users
  const defaultRedirect = nextParam === '/' || nextParam?.startsWith('/faq') || nextParam?.startsWith('/contact') 
    ? '/' 
    : pathsConfig.app.home;

  const { nextPath } = await service.exchangeCodeForSession(request, {
    redirectPath: defaultRedirect,
  });

  return redirect(nextPath);
}
