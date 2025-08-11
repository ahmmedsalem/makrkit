import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Database } from '@kit/supabase/database';
import { Button } from '@kit/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { PhoneInput } from '@kit/ui/phone-input';
import { Trans } from '@kit/ui/trans';

import { useUpdateAccountData } from '../hooks/use-update-account';
import { PhoneNumberSchema } from '../schema/phone-number.schema';

type UpdateUserDataParams = Database['public']['Tables']['accounts']['Update'];

export function UpdatePhoneNumberForm({
  phoneNumber,
  onUpdate,
  userId,
}: {
  phoneNumber: string | null;
  userId: string;
  onUpdate: (user: Partial<UpdateUserDataParams>) => void;
}) {
  const updateAccountMutation = useUpdateAccountData(userId);
  const { t } = useTranslation('account');

  const form = useForm({
    resolver: zodResolver(PhoneNumberSchema),
    defaultValues: {
      phoneNumber: phoneNumber ?? '',
    },
  });

  const onSubmit = ({ phoneNumber }: { phoneNumber?: string }) => {
    const data = { phone_number: phoneNumber || null };

    const promise = updateAccountMutation.mutateAsync(data).then(() => {
      onUpdate(data);
    });

    return toast.promise(() => promise, {
      success: t(`updatePhoneNumberSuccess`),
      error: t(`updatePhoneNumberError`),
      loading: t(`updatePhoneNumberLoading`),
    });
  };

  return (
    <div className={'flex flex-col space-y-8'}>
      <Form {...form}>
        <form
          data-test={'update-phone-number-form'}
          className={'flex flex-col space-y-4'}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            name={'phoneNumber'}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Trans i18nKey={'account:phoneNumber'} />
                </FormLabel>

                <FormControl>
                  <PhoneInput
                    data-test={'account-phone-number'}
                    placeholder={t('phoneNumberPlaceholder')}
                    value={field.value}
                    onChange={field.onChange}
                    defaultCountryCode="+971"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Button disabled={updateAccountMutation.isPending}>
              <Trans i18nKey={'account:updatePhoneNumberSubmitLabel'} />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}