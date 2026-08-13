import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  message: z.string().optional(),
  sourcePage: z.string().optional(),
});
