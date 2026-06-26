import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { getToken, removeToken } from "@/lib/cookie";
import { verifyToken } from "@/lib/jwt";
import { UserRole } from "@/types/auth"

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
        const token = getToken();

        if (!token) {
            router.replace("/login");
            return;
        }

        try {
            const payload = await verifyToken(token);

            if (
            allowedRoles &&
            !allowedRoles.includes(payload.role)
            ) {
            router.replace("/transactions");
            return;
            }

            setAuthorized(true);
        } catch {
            removeToken();
            router.replace("/login");
        }
    };

    void checkAuth();
  }, [router, allowedRoles]);

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}