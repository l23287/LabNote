import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthLayout } from "../components/AuthLayout";
import { PrimaryButton } from "../components/PrimaryButton";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = login(email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate("/home");
  }

  return (
    <AuthLayout>
      <h1 className="font-display text-3xl font-extrabold mb-2">Willkommen zurück!</h1>
      <p className="text-muted mb-8">Melde dich an, um deine Protokolle zu sehen.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm text-muted font-medium">E-Mail</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="du@schule.de"
            className="h-14 rounded-2xl bg-surface border border-border px-4 outline-none focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm text-muted font-medium">Passwort</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-14 rounded-2xl bg-surface border border-border px-4 outline-none focus:border-primary"
          />
        </label>

        {error && <p className="text-danger text-sm">{error}</p>}

        <PrimaryButton type="submit" className="mt-2">
          Anmelden
        </PrimaryButton>

        <p className="text-center text-muted text-sm">
          Noch keinen Account?{" "}
          <Link to="/registrieren" className="text-primary font-semibold">
            Jetzt registrieren
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
