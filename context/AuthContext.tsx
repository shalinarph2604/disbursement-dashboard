import {
  createContext,
  ReactNode,
  useEffect,
  useState,
} from "react";

import { verifyToken } from "@/lib/jwt";
import { AuthTokenPayload } from "@/types/auth";
import { getToken, removeToken, setToken } from "@/lib/cookie";

interface AuthContextType {
  user: AuthTokenPayload | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthTokenPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const payload = await verifyToken(token);

        setUser(payload);
      } catch {
        removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void restoreSession();
  }, []);

  async function login(token: string) {
    const payload = await verifyToken(token);

    setToken(token);
    setUser(payload);
  }

  function logout() {
    removeToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}