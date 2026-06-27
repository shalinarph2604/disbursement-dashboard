"use client";

import { useState } from "react";
import { ZodError } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction } from "@/services/transaction";
import { useToast } from "@/components/ui/ToastProvider";
import { transactionSchema } from "@/schemas/transaction.schema";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import type { CreateTransactionPayload } from "@/types/transaction";
import { isAxiosError } from "axios";

const bankOptions = [
  "BCA",
  "BRI",
  "Mandiri",
  "BSI",
  "CIMB Niaga",
  "Permata",
  "Danamon",
  "BTN",
] as const;

const initialValues = {
  sender_name: "",
  account_number: "",
  bank: "",
  amount: "",
  note: "",
};

interface TransactionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function TransactionForm({ onSuccess, onCancel }: TransactionFormProps) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: (payload: CreateTransactionPayload) => createTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      showToast("Transaksi berhasil dibuat", "success");
      setValues(initialValues);
      onSuccess?.();
    },
    onError: (error) => {
      const message =
        isAxiosError(error) && error.response?.data?.message
          ? String(error.response.data.message)
          : "Gagal membuat transaksi. Silakan coba lagi.";
      showToast(message, "error");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleChange = (field: string, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const parsed = transactionSchema.parse({
        sender_name: values.sender_name,
        account_number: values.account_number,
        bank: values.bank,
        amount: Number(values.amount),
        note: values.note || undefined,
      });

      const payload: CreateTransactionPayload = {
        sender_name: parsed.sender_name,
        account_number: Number(parsed.account_number),
        bank: parsed.bank,
        amount: parsed.amount,
        admin_fee: parsed.amount < 5000000 ? 2500 : 5000,
        status: "PENDING",
        note: parsed.note ?? "",
      };

      await mutation.mutateAsync(payload);
    } catch (error) {
      setIsSubmitting(false);

      if (error instanceof ZodError) {
        const nextErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const key = issue.path[0] as string;
          nextErrors[key] = issue.message;
        });
        setErrors(nextErrors);
      } else {
        showToast("Validasi gagal. Periksa kembali data form.", "error");
      }
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        label="Nama Pengirim"
        value={values.sender_name}
        onChange={(event) => handleChange("sender_name", event.target.value)}
        error={errors.sender_name}
        disabled={isSubmitting}
      />
      <Input
        label="Nomor Rekening"
        value={values.account_number}
        onChange={(event) => handleChange("account_number", event.target.value)}
        error={errors.account_number}
        disabled={isSubmitting}
      />
      <Select
        label="Bank Tujuan"
        value={values.bank}
        onChange={(event) => handleChange("bank", event.target.value)}
        error={errors.bank}
        disabled={isSubmitting}
      >
        <option value="">Pilih bank</option>
        {bankOptions.map((bank) => (
          <option key={bank} value={bank}>
            {bank}
          </option>
        ))}
      </Select>
      <Input
        label="Jumlah"
        type="number"
        min={10000}
        step={1000}
        value={values.amount}
        onChange={(event) => handleChange("amount", event.target.value)}
        error={errors.amount}
        disabled={isSubmitting}
      />
      <label className="block text-sm font-medium text-slate-900">
        Catatan
        <textarea
          className="mt-1 min-h-[96px] w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          value={values.note}
          onChange={(event) => handleChange("note", event.target.value)}
          maxLength={255}
          disabled={isSubmitting}
        />
        {errors.note && <p className="mt-1 text-xs text-red-600">{errors.note}</p>}
      </label>
      
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1"
          >
            Batal
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Membuat..." : "Buat Transaksi"}
        </Button>
      </div>
    </form>
  );
}
