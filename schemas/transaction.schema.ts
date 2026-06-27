import { z } from "zod";

export const transactionSchema = z.object({
  sender_name: z
    .string()
    .min(3, "Nama pengirim minimal 3 karakter")
    .max(100, "Nama pengirim maksimal 100 karakter"),
  account_number: z
    .string()
    .regex(/^[0-9]+$/, "Account number hanya boleh angka")
    .min(6, "Account number minimal 6 digit")
    .max(20, "Account number maksimal 20 digit"),
  bank: z.enum([
    "BCA",
    "BRI",
    "Mandiri",
    "BSI",
    "CIMB Niaga",
    "Permata",
    "Danamon",
    "BTN",
  ]),
  amount: z
    .number({ message: "Jumlah harus angka" })
    .int("Jumlah harus bilangan bulat")
    .positive("Jumlah harus positif")
    .min(10000, "Minimal Rp 10.000"),
  note: z.string().max(255, "Note maksimal 255 karakter").optional(),
});

export type TransactionSchema = z.infer<typeof transactionSchema>;
