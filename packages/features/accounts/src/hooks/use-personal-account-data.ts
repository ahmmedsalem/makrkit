import { useCallback } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useSupabase } from '@kit/supabase/hooks/use-supabase';

// Define a type for the account data returned from Supabase
export interface AccountData {
  id: string;
  name: string | null;
  picture_url: string | null;
  amount_invested: number | null;
  total_profit: number | null;
  return_percentage: number | null;
  status: 'active' | 'inactive' | 'pending';
  phone_number: string | null;
}

// Define a partial version for initial hydration (optional)
export type PartialAccountData = Partial<AccountData> & { id: string };

export function usePersonalAccountData(
  userId: string,
  partialAccount?: PartialAccountData,
) {
  const client = useSupabase();
  const queryKey = ['account:data', userId];

  const queryFn = async (): Promise<AccountData | null> => {
    if (!userId) {
      return null;
    }

    const { data, error } = await client
      .from('accounts')
      .select(
        `
        id,
        name,
        picture_url,
        amount_invested,
        total_profit,
        return_percentage,
        status,
        phone_number
      `,
      )
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }
    return data;
  };

  return useQuery<AccountData | null>({
    queryKey,
    queryFn,
    enabled: !!userId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    initialData: partialAccount?.id
      ? {
          id: partialAccount.id,
          name: partialAccount.name ?? null,
          picture_url: partialAccount.picture_url ?? null,
          amount_invested: partialAccount.amount_invested ?? null,
          total_profit: partialAccount.total_profit ?? null,
          return_percentage: partialAccount.return_percentage ?? null,
          status: partialAccount.status ?? 'pending',
          phone_number: partialAccount.phone_number ?? null,
        }
      : undefined,
  });
}

export function useRevalidatePersonalAccountDataQuery() {
  const queryClient = useQueryClient();

  return useCallback(
    (userId: string) =>
      queryClient.invalidateQueries({
        queryKey: ['account:data', userId],
      }),
    [queryClient],
  );
}
