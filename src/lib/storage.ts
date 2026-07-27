import type { Protocol, User } from "../types";

const USERS_KEY = "labnote_users";
const SESSION_KEY = "labnote_session";
const PROTOCOLS_KEY = "labnote_protocols";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const AVATAR_COLORS = ["#8b6bff", "#ff7fb0", "#ffb648", "#3ee6c4", "#5c3bfa"];

export function getUsers(): User[] {
  return read<User[]>(USERS_KEY, []);
}

export function saveUsers(users: User[]) {
  write(USERS_KEY, users);
}

export function getSessionUserId(): string | null {
  return read<string | null>(SESSION_KEY, null);
}

export function setSessionUserId(id: string | null) {
  if (id) write(SESSION_KEY, id);
  else localStorage.removeItem(SESSION_KEY);
}

export function getProtocols(): Protocol[] {
  return read<Protocol[]>(PROTOCOLS_KEY, []);
}

export function saveProtocols(protocols: Protocol[]) {
  write(PROTOCOLS_KEY, protocols);
}

export function getProtocolsForUser(userId: string): Protocol[] {
  return getProtocols()
    .filter((p) => p.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
