import { describe, expect, it } from "vitest";
import { generateSalt, hashPassword } from "./crypto";

describe("crypto", () => {
  it("generates salts that look random and unique", () => {
    const a = generateSalt();
    const b = generateSalt();
    expect(a).not.toEqual(b);
    expect(a).toMatch(/^[0-9a-f]{32}$/);
  });

  it("produces the same hash for the same password and salt", async () => {
    const salt = generateSalt();
    const first = await hashPassword("hunter2", salt);
    const second = await hashPassword("hunter2", salt);
    expect(first).toEqual(second);
  });

  it("produces a different hash for a different password", async () => {
    const salt = generateSalt();
    const a = await hashPassword("hunter2", salt);
    const b = await hashPassword("hunter3", salt);
    expect(a).not.toEqual(b);
  });

  it("produces a different hash for a different salt", async () => {
    const a = await hashPassword("hunter2", generateSalt());
    const b = await hashPassword("hunter2", generateSalt());
    expect(a).not.toEqual(b);
  });

  it("never contains the plaintext password", async () => {
    const salt = generateSalt();
    const hash = await hashPassword("hunter2", salt);
    expect(hash).not.toContain("hunter2");
  });
});
