import { beforeEach, describe, expect, it } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";

beforeEach(() => {
  localStorage.clear();
});

function renderAuth() {
  return renderHook(() => useAuth(), { wrapper: AuthProvider });
}

describe("AuthContext", () => {
  it("registers a new user and logs them in automatically", async () => {
    const { result } = renderAuth();

    let response: { ok: true } | { ok: false; error: string } | undefined;
    await act(async () => {
      response = await result.current.register("Mia", "mia@schule.de", "geheim123");
    });

    expect(response).toEqual({ ok: true });
    await waitFor(() => expect(result.current.user?.email).toBe("mia@schule.de"));
  });

  it("rejects registering the same email twice", async () => {
    const { result } = renderAuth();

    await act(async () => {
      await result.current.register("Mia", "mia@schule.de", "geheim123");
    });

    let response: { ok: true } | { ok: false; error: string } | undefined;
    await act(async () => {
      response = await result.current.register("Anderer Name", "mia@schule.de", "andereswort");
    });

    expect(response?.ok).toBe(false);
  });

  it("logs in with the correct password", async () => {
    const { result: registerResult } = renderAuth();
    await act(async () => {
      await registerResult.current.register("Mia", "mia@schule.de", "geheim123");
      registerResult.current.logout();
    });

    const { result } = renderAuth();
    let response: { ok: true } | { ok: false; error: string } | undefined;
    await act(async () => {
      response = await result.current.login("mia@schule.de", "geheim123");
    });

    expect(response).toEqual({ ok: true });
  });

  it("rejects login with a wrong password", async () => {
    const { result: registerResult } = renderAuth();
    await act(async () => {
      await registerResult.current.register("Mia", "mia@schule.de", "geheim123");
      registerResult.current.logout();
    });

    const { result } = renderAuth();
    let response: { ok: true } | { ok: false; error: string } | undefined;
    await act(async () => {
      response = await result.current.login("mia@schule.de", "falschesPasswort");
    });

    expect(response?.ok).toBe(false);
  });

  it("rejects login for an unknown email", async () => {
    const { result } = renderAuth();
    let response: { ok: true } | { ok: false; error: string } | undefined;
    await act(async () => {
      response = await result.current.login("unbekannt@schule.de", "irgendwas");
    });

    expect(response?.ok).toBe(false);
  });
});
