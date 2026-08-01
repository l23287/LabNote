import { beforeEach, describe, expect, it } from "vitest";
import {
  getProtocol,
  getProtocolsForUser,
  getUsers,
  saveUsers,
  upsertProtocol,
  deleteProtocol,
} from "./storage";
import { emptyStepImages } from "../types";
import type { Protocol, User } from "../types";

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: "user-1",
    name: "Test",
    email: "test@schule.de",
    passwordHash: "hash",
    passwordSalt: "salt",
    avatar: "fox",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function makeProtocol(overrides: Partial<Protocol> = {}): Protocol {
  const now = new Date().toISOString();
  return {
    id: "proto-1",
    userId: "user-1",
    question: "Testfrage?",
    materials: [],
    procedure: "",
    hypothesis: "",
    observation: "",
    result: "",
    images: emptyStepImages,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

beforeEach(() => {
  localStorage.clear();
});

describe("storage", () => {
  it("saves and reads users", () => {
    saveUsers([makeUser()]);
    expect(getUsers()).toHaveLength(1);
    expect(getUsers()[0].email).toBe("test@schule.de");
  });

  it("upserts a new protocol and finds it by id", () => {
    upsertProtocol(makeProtocol());
    expect(getProtocol("proto-1")?.question).toBe("Testfrage?");
  });

  it("updates an existing protocol instead of duplicating it", () => {
    upsertProtocol(makeProtocol());
    upsertProtocol(makeProtocol({ question: "Neue Frage?" }));
    expect(getProtocolsForUser("user-1")).toHaveLength(1);
    expect(getProtocol("proto-1")?.question).toBe("Neue Frage?");
  });

  it("only returns protocols for the requesting user", () => {
    upsertProtocol(makeProtocol({ id: "proto-1", userId: "user-1" }));
    upsertProtocol(makeProtocol({ id: "proto-2", userId: "user-2" }));
    expect(getProtocolsForUser("user-1")).toHaveLength(1);
    expect(getProtocolsForUser("user-1")[0].id).toBe("proto-1");
  });

  it("deletes a protocol", () => {
    upsertProtocol(makeProtocol());
    deleteProtocol("proto-1");
    expect(getProtocol("proto-1")).toBeUndefined();
  });
});
