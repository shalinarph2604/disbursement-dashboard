import Modal from "@/components/ui/Modal";
import Skeleton from "@/components/ui/Skeleton";
import StatusBadge from "@/components/transaction/StatusBadge";
import { formatDate } from "@/utils/formatDate";
import { formatRupiah } from "@/utils/formatCurrency";
import type { Transaction } from "@/types/transaction";

interface TransactionDetailModalProps {
  open: boolean;
  transaction: Transaction | null;
  isLoading?: boolean;
  onClose: () => void;
  canManageStatus?: boolean;
}

function TransactionDetailSkeleton() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={`left-${index}`} className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-44" />
          </div>
        ))}
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`right-${index}`} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className={`h-5 ${index === 2 ? "w-24" : "w-36"}`} />
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-slate-50 p-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-3/4" />
      </div>
    </>
  );
}

export default function TransactionDetailModal({
  open,
  transaction,
  isLoading = false,
  onClose,
  canManageStatus = false,
}: TransactionDetailModalProps) {
  return (
    <Modal open={open} title="Detail Transaksi" onClose={onClose}>
      {isLoading ? (
        <TransactionDetailSkeleton />
      ) : transaction ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-500">Nama Pengirim</p>
                <p className="font-semibold text-slate-900">{transaction.sender_name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Nomor Rekening</p>
                <p className="font-semibold text-slate-900">{transaction.account_number}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Bank</p>
                <p className="font-semibold text-slate-900">{transaction.bank}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-500">Jumlah</p>
                <p className="font-semibold text-slate-900">{formatRupiah(transaction.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Biaya Admin</p>
                <p className="font-semibold text-slate-900">{formatRupiah(transaction.admin_fee)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Status</p>
                <StatusBadge status={transaction.status} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Tanggal</p>
                <p className="font-semibold text-slate-900">{formatDate(transaction.created_at)}</p>
              </div>
            </div>
          </div>
          {transaction.note ? (
            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Catatan</p>
              <p className="mt-1 text-sm text-slate-900">{transaction.note}</p>
            </div>
          ) : null}
          {canManageStatus ? (
            <div className="mt-5 text-sm text-slate-600">
              Admin dapat mengubah status dari daftar transaksi.
            </div>
          ) : null}
        </>
      ) : (
        <p className="text-sm text-red-600">Gagal memuat detail transaksi.</p>
      )}
    </Modal>
  );
}
