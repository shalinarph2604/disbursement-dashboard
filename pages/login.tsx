"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ZodError } from "zod";

import { login as loginService } from "@/services/auth";
import { createToken } from "@/lib/jwt";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/schemas/login.schema";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const tokenCookie = document.cookie
      .split("; ")
      .find((item) => item.startsWith("token="));

    if (!tokenCookie) {
      setVerifying(false);
      return;
    }

    const token = tokenCookie.split("=")[1] ?? "";

    void (async () => {
      try {
        await login(token);
        router.replace("/");
      } catch {
        setVerifying(false);
      }
    })();
  }, [login, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setServerError("");
    setIsSubmitting(true);

    try {
      loginSchema.parse({ username, password });
      const user = loginService(username.trim(), password.trim());
      const token = await createToken(user.username, user.role);
      await login(token);
      router.replace("/transactions");
    } catch (error) {
      if (error instanceof ZodError) {
        const nextErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const key = issue.path[0] as string;
          nextErrors[key] = issue.message;
        });
        setErrors(nextErrors);
      } else {
        setServerError(
          error instanceof Error ? error.message : "Username atau password salah."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-sm font-semibold text-slate-600">Memeriksa sesi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-12 bg-slate-50 font-sans">
      {/* Brand Column (Desktop Only) */}
      <div className="hidden lg:col-span-5 xl:col-span-6 bg-slate-900 text-white lg:flex flex-col justify-between p-12 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl"></div>

        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-500/40">
            LP
          </div>
          <span className="text-xl font-bold tracking-tight">LintasPay</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight xl:text-5xl">
            Sistem Pengelolaan Transaksi Terintegrasi.
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Pantau, buat, dan kelola semua transaksi pembayaran Anda secara efisien, real-time, dan aman dalam satu dashboard premium.
          </p>
        </div>

        <div className="relative z-10 text-sm text-slate-400">
          &copy; 2026 LintasPay. All rights reserved.
        </div>
      </div>

      {/* Form Column */}
      <div className="col-span-1 lg:col-span-7 xl:col-span-6 flex items-center justify-center p-6 sm:p-12 md:p-16 relative">
        {/* Small background blobs for mobile */}
        <div className="absolute top-10 left-10 w-48 h-48 rounded-full bg-indigo-200/30 blur-2xl lg:hidden"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-violet-200/30 blur-2xl lg:hidden"></div>

        <div className="relative z-10 w-full max-w-md space-y-8 bg-white p-8 md:p-10 rounded-[32px] border border-slate-100 shadow-xl transition-all duration-300 hover:shadow-2xl">
          <div className="space-y-2">
            <div className="lg:hidden flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-md">
                LP
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">LintasPay</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Selamat Datang Kembali
            </h2>
            <p className="text-sm text-slate-500">
              Masuk ke akun LintasPay Anda untuk melanjutkan ke dashboard.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Username"
              placeholder="Masukkan username Anda"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              error={errors.username}
              disabled={isSubmitting}
              className="mt-1"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Masukkan password Anda"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={errors.password}
              disabled={isSubmitting}
              className="mt-1"
            />

            {serverError && (
              <div className="rounded-2xl bg-red-50 p-3 text-sm text-red-600 border border-red-100 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600 flex-shrink-0"></span>
                {serverError}
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full py-3 font-semibold rounded-2xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20">
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Memproses...
                </span>
              ) : (
                "Masuk ke Dashboard"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
