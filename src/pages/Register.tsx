import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthLayout } from "../components/AuthLayout";
import { PrimaryButton } from "../components/PrimaryButton";

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 4) {
      setError("Das Passwort muss mindestens 4 Zeichen haben.");
      return;
    }
    const result = register(name, email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate("/home");
  }

  return (
    <AuthLayout>
      <h1 className="font-display text-3xl font-extrabold mb-2">Leg los!</h1>
      <p className="text-muted mb-8">
        Erstelle deinen Account und starte dein erstes Protokoll.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm text-muted font-medium">Dein Name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z.B. Mia"
            className="h-14 rounded-2xl bg-surface border border-border px-4 outline-none focus:border-primary"
          />
        </label>

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
          Account erstellen
        </PrimaryButton>

        <p className="text-center text-muted text-sm">
          Schon registriert?{" "}
          <Link to="/anmelden" className="text-primary font-semibold">
            Anmelden
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
