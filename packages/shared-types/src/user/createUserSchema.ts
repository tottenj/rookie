import z from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type CreateUser = z.infer<typeof createUserSchema>;
