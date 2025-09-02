'use client';

import type { User } from '@supabase/supabase-js';

import { 
  AccountInactiveNotification, 
  AccountPendingNotification 
} from '@kit/accounts/components';
import { usePersonalAccountData } from '@kit/accounts/hooks/use-personal-account-data';

export interface AccountStatusWrapperProps {
  user: User;
  children: React.ReactNode;
  showForProfile?: boolean;
}

export function AccountStatusWrapper({ 
  user, 
  children, 
  showForProfile = false 
}: AccountStatusWrapperProps) {
  const personalAccountData = usePersonalAccountData(user.id);
  const status = personalAccountData?.data?.status;
  const isInactive = status === 'inactive';
  const isPending = status === 'pending';

  const shouldShowNotification = showForProfile 
    ? (isInactive || isPending)
    : (isInactive || isPending);

  return (
    <>
      {shouldShowNotification && (
        <div className="mb-6">
          {isInactive && <AccountInactiveNotification />}
          {isPending && <AccountPendingNotification />}
        </div>
      )}
      {children}
    </>
  );
}