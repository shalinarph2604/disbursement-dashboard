import { useRouter } from "next/router";
import type { ListMeta } from "@/types/transaction";

interface PaginationProps {
  meta?: ListMeta;
}

export default function Pagination({ meta }: PaginationProps) {
  const router = useRouter();
  const currentPage = Number(router.query.page ?? 1);
  const limit = Number(router.query.limit ?? 10);

  if (!meta || meta.total === 0) {
    return null;
  }

  const totalPages = Math.max(1, Math.ceil(meta.total / limit));

  const updatePage = (page: number) => {
    const query = { ...router.query, page: String(page) } as Record<string, string>;
    router.replace({ pathname: router.pathname, query }, undefined, { shallow: true });
  };

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-700">
      <button
        type="button"
        onClick={() => updatePage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="rounded-2xl border border-slate-200 bg-white px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Sebelumnya
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => updatePage(page)}
          className={`rounded-2xl border px-3 py-2 transition ${
            page === currentPage
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        onClick={() => updatePage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded-2xl border border-slate-200 bg-white px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Selanjutnya
      </button>
    </div>
  );
}
