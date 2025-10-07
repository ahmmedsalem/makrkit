import type { SignInWithPasswordlessCredentials } from '@supabase/supabase-js';

import { useMutation } from '@tanstack/react-query';

import { useSupabase } from './use-supabase';
import { retryAuthOperation } from '../utils/auth-retry';

/**
 * @name useSignInWithOtp
 * @description Use Supabase to sign in a user with an OTP in a React component
 */
export function useSignInWithOtp() {
  const client = useSupabase();
  const mutationKey = ['auth', 'sign-in-with-otp'];

  const mutationFn = async (credentials: SignInWithPasswordlessCredentials) => {
    return retryAuthOperation(async () => {
      const result = await client.auth.signInWithOtp(credentials);

      if (result.error) {
        if (shouldIgnoreError(result.error.message)) {
          console.warn(
            `Ignoring error during development: ${result.error.message}`,
          );

          return {} as never;
        }

        throw new Error(result.error.message);
      }

      return result.data;
    }, 3, 1000, 'OTP sign in');
  };

  return useMutation({
    mutationFn,
    mutationKey,
    retry: false, // We handle retries manually
  });
}

function shouldIgnoreError(error: string) {
  return isSmsProviderNotSetupError(error);
}

function isSmsProviderNotSetupError(error: string) {
  return error.includes(`sms Provider could not be found`);
}
