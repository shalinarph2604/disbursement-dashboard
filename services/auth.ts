import { USERS } from "@/data/users";

export const login = (username: string, password: string) => {
  const user = USERS.find(
    (user) =>
      user.username === username &&
      user.password === password
  );

  if (!user) {
    throw new Error("Username atau password salah.");
  }

  return user;
};