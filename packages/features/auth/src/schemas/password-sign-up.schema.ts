import { z } from 'zod';

import { RefinedPasswordSchema, refineRepeatPassword } from './password.schema';

export const PasswordSignUpSchema = z
  .object({
    email: z.string().email(),
    password: RefinedPasswordSchema,
    repeatPassword: RefinedPasswordSchema,
    phoneNumber: z.string().min(1, 'Phone number is required').refine((phone) => {
      // Basic phone number validation - should start with + and have at least 7 digits
      const phoneRegex = /^\+\d{1,4}\s?\d{6,14}$/;
      return phoneRegex.test(phone);
    }, 'Please enter a valid phone number'),
  })
  .superRefine(refineRepeatPassword);
