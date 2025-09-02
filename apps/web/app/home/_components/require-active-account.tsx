'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import type { User } from '@supabase/supabase-js';

import { usePersonalAccountData } from '@kit/accounts/hooks/use-personal-account-data';
import { canAccessProtectedRoutes } from '@kit/accounts/utils/account-access';

export interface RequireActiveAccountProps {
  user: User;
  children: React.ReactNode;
  fallbackPath?: string;
}

export function RequireActiveAccount({ 
  user, 
  children, 
  fallbackPath = '/home' 
}: RequireActiveAccountProps) {
  const router = useRouter();
  const personalAccountData = usePersonalAccountData(user.id);
  const accountStatus = personalAccountData?.data?.status;
  const hasAccess = canAccessProtectedRoutes(accountStatus);

  useEffect(() => {
    if (personalAccountData?.data && !hasAccess) {
      router.replace(fallbackPath);
    }
  }, [personalAccountData?.data, hasAccess, router, fallbackPath]);

  // Don't render protected content if user doesn't have access
  if (personalAccountData?.data && !hasAccess) {
    return null;
  }

  // Show loading state while checking account status
  if (!personalAccountData?.data) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}