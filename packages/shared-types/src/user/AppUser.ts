import z from "zod";

export const appUserSchema = z.object({
  id: z.string(),
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  createdAt: z.string(),
});

export type AppUser = z.infer<typeof appUserSchema>;