import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../types";
import { randomAnimalId } from "../lib/animals";
import {
  getSessionUserId,
  getUsers,
  saveUsers,
  setSessionUserId,
  updateUser as updateUserInStorage,
} from "../lib/storage";

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  register: (
    name: string,
    email: string,
    password: string,
  ) => { ok: true } | { ok: false; error: string };
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const id = getSessionUserId();
    if (!id) return null;
    return getUsers().find((u) => u.id === id) ?? null;
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: (email, password) => {
        const found = getUsers().find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
        );
        if (!found || found.password !== password) {
          return { ok: false, error: "E-Mail oder Passwort ist falsch." };
        }
        setSessionUserId(found.id);
        setUser(found);
        return { ok: true };
      },
      register: (name, email, password) => {
        const users = getUsers();
        const exists = users.some(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
        );
        if (exists) {
          return { ok: false, error: "Für diese E-Mail gibt es schon einen Account." };
        }
        const newUser: User = {
          id: crypto.randomUUID(),
          name: name.trim(),
          email: email.trim(),
          password,
          avatar: randomAnimalId(),
          createdAt: new Date().toISOString(),
        };
        saveUsers([...users, newUser]);
        setSessionUserId(newUser.id);
        setUser(newUser);
        return { ok: true };
      },
      logout: () => {
        setSessionUserId(null);
        setUser(null);
      },
      updateUser: (patch) => {
        setUser((current) => {
          if (!current) return current;
          return updateUserInStorage(current.id, patch) ?? current;
        });
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
