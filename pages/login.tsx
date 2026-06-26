import { useEffect } from "react"
import { useRouter } from "next/router"

import { getToken, removeToken } from "@/lib/cookie"
import { verifyToken } from "@/lib/jwt"

export default function Login() {
    const router = useRouter()
    
    useEffect(() => {
        const token = getToken();

        if (!token) return;

        let isMounted = true

        const checkAuth = async () => {
            try {
                await verifyToken(token);

                if (isMounted) {
                    router.replace("/transactions");
                }
   
            } catch {
            removeToken();
            }
        };

        void checkAuth();

        return () => {
            isMounted = false
        }
    }, [router]);
    
    return (
        <div />
    )
}