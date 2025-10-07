import { createBrowserClient } from '@supabase/ssr';

import { Database } from '../database.types';
import { getSupabaseClientKeys } from '../get-supabase-client-keys';

/**
 * @name getSupabaseBrowserClient
 * @description Get a Supabase client for use in the Browser with enhanced reliability settings
 */
export function getSupabaseBrowserClient<GenericSchema = Database>() {
  const keys = getSupabaseClientKeys();

  return createBrowserClient<GenericSchema>(keys.url, keys.anonKey, {
    global: {
      headers: {
        'x-client-info': 'dragos-capital-web',
      },
    },
    auth: {
      // Improve auth reliability
      persistSession: true,
      storageKey: 'dragos-capital-auth-token',
      flowType: 'pkce', // Use PKCE flow for better security
      detectSessionInUrl: true,
      autoRefreshToken: true,
    },
    realtime: {
      // Optimize realtime connections
      params: {
        eventsPerSecond: 2,
      },
    },
    db: {
      schema: 'public',
    },
  });
}
