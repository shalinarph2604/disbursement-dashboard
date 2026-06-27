import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6 font-sans">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 font-bold text-white shadow-md shadow-indigo-500/20">
            LP
          </div>
          <div>
            <p className="text-base font-bold text-slate-900 leading-tight">LintasPay Dashboard</p>
            <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10 mt-1 capitalize">
              Role: {user?.role ?? "-"}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsLogoutOpen(true)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 cursor-pointer shadow-sm hover:border-slate-300"
        >
          Logout
        </button>
      </header>

      <Modal open={isLogoutOpen} title="Konfirmasi Keluar" onClose={() => setIsLogoutOpen(false)}>
        <div className="space-y-4 font-sans">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin keluar dari akun Anda? Sesi Anda akan berakhir dan Anda harus masuk kembali untuk mengakses dashboard.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsLogoutOpen(false)}>
              Batal
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                logout();
                router.push("/login");
              }}
            >
              Keluar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
