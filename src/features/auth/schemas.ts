import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    full_name: z.string().trim().min(1, 'Full name is required').max(200),
    email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
    password: z.string().min(8, 'Use at least 8 characters').max(128),
    confirm_password: z.string().min(1, 'Confirm your password'),
    workspace_name: z.string().trim().max(200).optional(),
  })
  .refine((value) => value.password === value.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
