import { z } from 'zod';

export const PhoneNumberSchema = z.object({
  phoneNumber: z.string().optional().refine((phone) => {
    // Allow empty string or valid phone number format
    if (!phone || phone.trim() === '') {
      return true;
    }
    // Basic phone number validation - should start with + and have at least 7 digits
    const phoneRegex = /^\+\d{1,4}\s?\d{6,14}$/;
    return phoneRegex.test(phone);
  }, 'Please enter a valid phone number or leave empty'),
});