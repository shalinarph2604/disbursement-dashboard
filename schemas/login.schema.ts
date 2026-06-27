import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Username wajib diisi")
    .refine((value) => value.trim().length > 0, "Username tidak boleh spasi saja"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .refine((value) => value.trim().length > 0, "Password tidak boleh spasi saja"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
