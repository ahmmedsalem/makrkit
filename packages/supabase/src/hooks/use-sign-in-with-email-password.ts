import type { SignInWithPasswordCredentials } from '@supabase/supabase-js';

import { useMutation } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';
import { retryAuthOperation } from '../utils/auth-retry';

/**
 * @name useSignInWithEmailPassword
 * @description Use Supabase to sign in a user with email and password in a React component
 */
export function useSignInWithEmailPassword() {
  const client = useSupabase();
  const mutationKey = ['auth', 'sign-in-with-email-password'];

  const mutationFn = async (credentials: SignInWithPasswordCredentials) => {
    return retryAuthOperation(async () => {
      const response = await client.auth.signInWithPassword(credentials);

      if (response.error) {
        throw new Error(response.error.message);
      }

      const user = response.data?.user;
      const identities = user?.identities ?? [];

      // if the user has no identities, it means that the email is taken
      if (identities.length === 0) {
        throw new Error('User already registered');
      }

      return response.data;
    }, 3, 1000, 'Sign in');
  };

  return useMutation({ 
    mutationKey, 
    mutationFn,
    retry: false, // We handle retries manually
  });
}
