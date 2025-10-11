import 'server-only';

import { cache } from 'react';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

/**
 * @name getUserOptional
 * @description Get the current user if authenticated, or null if not.
 * This allows pages to be accessed by both authenticated and non-authenticated users.
 */
export const getUserOptional = cache(async () => {
  const client = getSupabaseServerClient();
  const { data: { user } } = await client.auth.getUser();

  return user;
});
