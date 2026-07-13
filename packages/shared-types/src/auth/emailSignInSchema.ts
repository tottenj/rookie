import { z } from "zod";

export const emailSignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type EmailSignInSchema = z.infer<typeof emailSignInSchema>;
