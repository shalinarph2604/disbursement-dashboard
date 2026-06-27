import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/layout/Header";
import SearchInput from "@/components/transaction/SearchInput";
import StatusFilter from "@/components/transaction/StatusFilter";
import TransactionTable from "@/components/transaction/TransactionTable";
import TransactionForm from "@/components/transaction/TransactionForm";
import TransactionDetailModal from "@/components/transaction/TransactionDetailModal";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useTransaction } from "@/hooks/useTransaction";
import { useTransactions } from "@/hooks/useTransactions";
import type { Transaction, TransactionQuery } from "@/types/transaction";

export default function Transactions() {
  const router = useRouter();
  const { user } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const {
    data: transactionDetailResponse,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useTransaction(selectedTransactionId);

  const queryParams = useMemo(() => {
    const page = typeof router.query.page === "string" ? Number(router.query.page) : 1;
    const limit = typeof router.query.limit === "string" ? Number(router.query.limit) : 10;
    const status = typeof router.query.status === "string" ? router.query.status : undefined;
    const search = typeof router.query.search === "string" ? router.query.search : undefined;
    const sortBy = typeof router.query.sortBy === "string" ? router.query.sortBy : undefined;
    const order = typeof router.query.order === "string" ? (router.query.order as "asc" | "desc") : "asc";

    return {
      page: Number.isNaN(page) || page <= 0 ? 1 : page,
      limit: Number.isNaN(limit) || limit <= 0 ? 10 : limit,
      status: status as TransactionQuery["status"] | undefined,
      search,
      sortBy,
      order,
    } as TransactionQuery;
  }, [router.query]);

  const { data, isLoading, isError } = useTransactions(queryParams);

  const handleSort = (field: string) => {
    const nextOrder = queryParams.sortBy === field && queryParams.order === "asc" ? "desc" : "asc";

    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          sortBy: field,
          order: nextOrder,
          page: "1",
        },
      },
      undefined,
      { shallow: true }
    );
  };

  const openDetail = (transaction: Transaction) => {
    setSelectedTransactionId(transaction.id);
  };

  const selectedTransaction = transactionDetailResponse?.data ?? null;

  const currentPage = queryParams.page ?? 1;
  const currentLimit = queryParams.limit ?? 10;
  const totalCount = data?.meta?.total ?? 0;
  const startIndex = totalCount === 0 ? 0 : (currentPage - 1) * currentLimit + 1;
  const endIndex = totalCount === 0 ? 0 : Math.min(totalCount, currentPage * currentLimit);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-[1500px] gap-0 px-4 py-6 sm:px-6 md:gap-6">
        <main className="flex-1 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 grid gap-4 grid-cols-1 sm:grid-cols-[2fr_1fr]">
              <SearchInput />
              <StatusFilter />
            </div>
            {user?.role === "operator" ? (
              <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 justify-center py-2.5 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Buat Transaksi
              </Button>
            ) : null}
          </div>

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Daftar Transaksi</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Menampilkan {startIndex}–{endIndex} dari {totalCount} transaksi
                </p>
              </div>
            </div>
            <div className="px-6 pb-6 pt-4">
              <TransactionTable
                transactions={data?.data ?? []}
                meta={data?.meta}
                isLoading={isLoading}
                isError={isError}
                error={null}
                sortBy={queryParams.sortBy}
                order={queryParams.order}
                onSort={handleSort}
                onRowClick={openDetail}
              />
            </div>
          </section>
        </main>
      </div>
      <TransactionDetailModal
        open={Boolean(selectedTransactionId)}
        transaction={isDetailError ? null : selectedTransaction}
        isLoading={isDetailLoading}
        onClose={() => setSelectedTransactionId(null)}
        canManageStatus={user?.role === "admin"}
      />
      <Modal open={isCreateOpen} title="Buat Transaksi Baru" onClose={() => setIsCreateOpen(false)}>
        <TransactionForm onSuccess={() => setIsCreateOpen(false)} onCancel={() => setIsCreateOpen(false)} />
      </Modal>
    </div>
  );
}
