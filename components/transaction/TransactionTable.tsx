import { useRouter } from "next/router";
import { useState } from "react";
import StatusBadge from "@/components/transaction/StatusBadge";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import Modal from "@/components/ui/Modal";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeadRow,
  TableRow,
} from "@/components/ui/Table";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/utils/formatDate";
import { formatRupiah } from "@/utils/formatCurrency";
import type { Transaction, TransactionQuery } from "@/types/transaction";
import { updateStatus } from "@/services/transaction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/ToastProvider";

interface TransactionTableProps {
  transactions: Transaction[];
  meta?: { total: number; page: number; limit: number };
  isLoading?: boolean;
  isError?: boolean;
  error?: string | null;
  sortBy?: TransactionQuery["sortBy"];
  order?: "asc" | "desc";
  onSort?: (field: string) => void;
  onRowClick?: (transaction: Transaction) => void;
}

export default function TransactionTable({
  transactions,
  meta,
  isLoading,
  isError,
  error,
  onRowClick,
}: TransactionTableProps) {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [isActionOpen, setIsActionOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [action, setAction] = useState<"APPROVED" | "REJECTED" | null>(null);

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Transaction["status"] }) =>
      updateStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      showToast("Status transaksi berhasil diperbarui", "success");
    },
    onError: () => {
      showToast("Gagal memperbarui status transaksi", "error");
    },
  });

  if (isLoading) {
    return <div className="text-sm text-slate-600">Memuat transaksi...</div>;
  }

  if (isError) {
    return <div className="text-sm text-red-600">{error ?? "Gagal memuat transaksi."}</div>;
  }

  if (!transactions.length) {
    return <div className="text-sm text-slate-600">Belum ada transaksi.</div>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableHeadRow>
            <TableHead>ID</TableHead>
            <TableHead>Nama Pengirim</TableHead>
            <TableHead>Bank</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Biaya Admin</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tanggal</TableHead>
            {user?.role === "admin" ? <TableHead>Aksi</TableHead> : null}
          </TableHeadRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow key={transaction.id}>
              <TableCell>
                {transaction.id}
              </TableCell>
              <TableCell>
                <button
                  type="button"
                  className="text-left font-semibold text-slate-900"
                  onClick={() => onRowClick?.(transaction)}
                >
                  {transaction.sender_name}
                </button>
              </TableCell>
              <TableCell>{transaction.bank}</TableCell>
              <TableCell>{formatRupiah(transaction.amount)}</TableCell>
              <TableCell>{formatRupiah(transaction.admin_fee)}</TableCell>
              <TableCell>
                <StatusBadge status={transaction.status} />
              </TableCell>
              <TableCell>{formatDate(transaction.created_at)}</TableCell>
              {user?.role === "admin" ? (
                <TableCell>
                  {transaction.status === "PENDING" && (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="secondary" size="sm"
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setAction("APPROVED");
                          setIsActionOpen(true);
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger" size="sm"
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setAction("REJECTED");
                          setIsActionOpen(true);
                        }}>
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">Halaman {router.query.page ?? 1}</p>
        <Pagination meta={meta as any} />
      </div>

      <Modal
        open={isActionOpen}
        title={
          action === "APPROVED"
            ? "Konfirmasi Approve"
            : "Konfirmasi Reject"
        }
        onClose={() => {
          setIsActionOpen(false);
          setSelectedTransaction(null);
          setAction(null);
        }}
      >
        <div className="space-y-4 font-sans">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${action === "APPROVED"
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
                }`}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {action === "APPROVED"
                  ? "Apakah Anda yakin ingin menyetujui transaksi ini?"
                  : "Apakah Anda yakin ingin menolak transaksi ini?"}
              </p>

              {selectedTransaction && (
                <div className="mt-3 rounded-md bg-slate-50 p-3 text-sm">
                  <p>
                    <span className="font-semibold">Pengirim:</span>{" "}
                    {selectedTransaction.sender_name}
                  </p>
                  <p>
                    <span className="font-semibold">Nominal:</span>{" "}
                    {formatRupiah(selectedTransaction.amount)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setIsActionOpen(false);
                setSelectedTransaction(null);
                setAction(null);
              }}
            >
              Batal
            </Button>

            <Button
              variant={action === "APPROVED" ? "primary" : "danger"}
              loading={mutation.isPending}
              onClick={() => {
                if (!selectedTransaction || !action) return;

                mutation.mutate(
                  {
                    id: selectedTransaction.id,
                    status: action,
                  },
                  {
                    onSuccess: () => {
                      setIsActionOpen(false);
                      setSelectedTransaction(null);
                      setAction(null);
                    },
                  }
                );
              }}
            >
              {action === "APPROVED" ? "Approve" : "Reject"}
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
