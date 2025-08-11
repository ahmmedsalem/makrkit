'use client';

import { useUser } from '@kit/supabase/hooks/use-user';

import { CrispChat } from './crisp-chat';

interface CrispChatWrapperProps {
  websiteId: string;
}

export function CrispChatWrapper({ websiteId }: CrispChatWrapperProps) {
  const user = useUser();
  const userData = user.data;

  // Transform user data to the format expected by CrispChat
  const crispUser = userData ? {
    id: userData.id,
    email: userData.email || '',
    name: userData.user_metadata?.full_name || userData.user_metadata?.name || undefined,
  } : null;

  return <CrispChat websiteId={websiteId} user={crispUser} />;
}