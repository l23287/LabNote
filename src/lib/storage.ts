import type { Protocol, User } from "../types";
import { emptyStepImages } from "../types";

const USERS_KEY = "labnote_users";
const SESSION_KEY = "labnote_session";
const PROTOCOLS_KEY = "labnote_protocols";

function normalizeProtocol(protocol: Protocol): Protocol {
  return { ...protocol, images: protocol.images ?? emptyStepImages };
}

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

export function getUsers(): User[] {
  return read<User[]>(USERS_KEY, []);
}

export function saveUsers(users: User[]) {
  write(USERS_KEY, users);
}

export function updateUser(id: string, patch: Partial<User>): User | null {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  const updated = { ...users[index], ...patch };
  users[index] = updated;
  saveUsers(users);
  return updated;
}

export function getSessionUserId(): string | null {
  return read<string | null>(SESSION_KEY, null);
}

export function setSessionUserId(id: string | null) {
  if (id) write(SESSION_KEY, id);
  else localStorage.removeItem(SESSION_KEY);
}

export function getProtocols(): Protocol[] {
  return read<Protocol[]>(PROTOCOLS_KEY, []).map(normalizeProtocol);
}

export function saveProtocols(protocols: Protocol[]) {
  write(PROTOCOLS_KEY, protocols);
}

export function getProtocolsForUser(userId: string): Protocol[] {
  return getProtocols()
    .filter((p) => p.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getProtocol(id: string): Protocol | undefined {
  return getProtocols().find((p) => p.id === id);
}

export function upsertProtocol(protocol: Protocol) {
  const protocols = getProtocols();
  const index = protocols.findIndex((p) => p.id === protocol.id);
  if (index === -1) {
    saveProtocols([...protocols, protocol]);
  } else {
    protocols[index] = protocol;
    saveProtocols(protocols);
  }
}

export function deleteProtocol(id: string) {
  saveProtocols(getProtocols().filter((p) => p.id !== id));
}
