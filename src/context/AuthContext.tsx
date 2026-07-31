import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../types";
import { randomAnimalId } from "../lib/animals";
import { generateSalt, hashPassword } from "../lib/crypto";
import {
  deleteUser as deleteUserInStorage,
  getSessionUserId,
  getUsers,
  saveUsers,
  setSessionUserId,
  updateUser as updateUserInStorage,
} from "../lib/storage";

type AuthResult = { ok: true } | { ok: false; error: string };

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
  deleteAccount: () => void;
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
      login: async (email, password) => {
        const found = getUsers().find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
        );
        if (!found) {
          return { ok: false, error: "E-Mail oder Passwort ist falsch." };
        }
        const attemptHash = await hashPassword(password, found.passwordSalt);
        if (attemptHash !== found.passwordHash) {
          return { ok: false, error: "E-Mail oder Passwort ist falsch." };
        }
        setSessionUserId(found.id);
        setUser(found);
        return { ok: true };
      },
      register: async (name, email, password) => {
        const users = getUsers();
        const exists = users.some(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
        );
        if (exists) {
          return { ok: false, error: "Für diese E-Mail gibt es schon einen Account." };
        }
        const passwordSalt = generateSalt();
        const passwordHash = await hashPassword(password, passwordSalt);
        const newUser: User = {
          id: crypto.randomUUID(),
          name: name.trim(),
          email: email.trim(),
          passwordHash,
          passwordSalt,
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
      deleteAccount: () => {
        setUser((current) => {
          if (!current) return current;
          deleteUserInStorage(current.id);
          return current;
        });
        setSessionUserId(null);
        setUser(null);
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
