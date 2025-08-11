'use client';

import { useRevalidatePersonalAccountDataQuery } from '../hooks/use-personal-account-data';
import { UpdatePhoneNumberForm } from './update-phone-number-form';

export function UpdatePhoneNumberFormContainer({
  user,
}: {
  user: {
    phone_number: string | null;
    id: string;
  };
}) {
  const revalidateUserDataQuery = useRevalidatePersonalAccountDataQuery();

  return (
    <UpdatePhoneNumberForm
      phoneNumber={user.phone_number}
      userId={user.id}
      onUpdate={() => revalidateUserDataQuery(user.id)}
    />
  );
}