import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { NewProtocolWizard } from "./NewProtocolWizard";
import { AuthProvider } from "../context/AuthContext";
import { saveUsers, setSessionUserId } from "../lib/storage";

function renderWizard() {
  saveUsers([
    {
      id: "user-1",
      name: "Test",
      email: "test@schule.de",
      passwordHash: "hash",
      passwordSalt: "salt",
      avatar: "fox",
      createdAt: new Date().toISOString(),
    },
  ]);
  setSessionUserId("user-1");

  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/neu"]}>
        <Routes>
          <Route path="/neu" element={<NewProtocolWizard />} />
          <Route path="/home" element={<div>HOME_SCREEN</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe("NewProtocolWizard", () => {
  it("disables Weiter until a question is entered on step 1", () => {
    renderWizard();
    expect(screen.getByText("Was möchtest du herausfinden?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Weiter" })).toBeDisabled();
  });

  it("advances to step 2 once a question is entered", async () => {
    const user = userEvent.setup();
    renderWizard();

    await user.type(
      screen.getByPlaceholderText(/Siedepunkt von Wasser/),
      "Wie schnell schmilzt Eis?",
    );
    await user.click(screen.getByRole("button", { name: "Weiter" }));

    expect(screen.getByText("Welche Materialien brauchst du?")).toBeInTheDocument();
  });

  it("saves the draft and returns home via 'Später fortsetzen & speichern'", async () => {
    const user = userEvent.setup();
    renderWizard();

    await user.type(
      screen.getByPlaceholderText(/Siedepunkt von Wasser/),
      "Wie schnell schmilzt Eis?",
    );
    await user.click(screen.getByRole("button", { name: "Später fortsetzen & speichern" }));

    expect(await screen.findByText("HOME_SCREEN")).toBeInTheDocument();
  });
});
