import "@radix-ui/themes/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";

import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/ToastProvider";
import ProtectedRoute from "@/pages/ProtectedRoute";
import { Theme } from "@radix-ui/themes";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isProtectedRoute = router.pathname !== "/login";

  return (
    <Theme>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            {isProtectedRoute ? (
              <ProtectedRoute>
                <Component {...pageProps} />
              </ProtectedRoute>
            ) : (
              <Component {...pageProps} />
            )}
          </ToastProvider>
        </QueryClientProvider>
      </AuthProvider>
    </Theme>
  );
}
