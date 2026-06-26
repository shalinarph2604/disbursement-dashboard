import { jwtVerify, SignJWT } from "jose";
import { AuthTokenPayload, UserRole } from "../types/auth";

const secret = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_JWT_SECRET
);

export async function createToken(
  username: string,
  role: UserRole
): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60;

  return new SignJWT({
    username,
    role,
    exp,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .sign(secret);
}

export async function verifyToken(
  token: string
 ): Promise<AuthTokenPayload> {
   const { payload } = await jwtVerify(
        token, 
        secret
    );

    if (
        typeof payload.username !== "string" || 
        (payload.role !== "admin" && payload.role !== "operator")
    ) {
        throw new Error("Invalid token payload");
    }

   return payload as AuthTokenPayload;
 }