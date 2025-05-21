import { z } from 'zod';

import { RefinedPasswordSchema, refineRepeatPassword } from './password.schema';

export const PasswordSignUpSchema = z
  .object({
    fullName: z.string().min(1, {}),
    email: z.string().email(),
    password: RefinedPasswordSchema,
    repeatPassword: RefinedPasswordSchema,
  })
  .superRefine(refineRepeatPassword);
