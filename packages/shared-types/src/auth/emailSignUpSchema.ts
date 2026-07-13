import { z } from "zod";
import { emailSignInSchema } from "./emailSignInSchema";

export const emailSignUpSchema = emailSignInSchema.extend({
  confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type EmailSignUpSchema = z.infer<typeof emailSignUpSchema>;