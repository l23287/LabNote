import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, FlaskConical } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { PrimaryButton } from "../components/PrimaryButton";

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 4) {
      setError("Das Passwort muss mindestens 4 Zeichen haben.");
      return;
    }
    const result = await register(name, email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate("/home");
  }

  return (
    <div className="relative min-h-dvh flex flex-col px-6 pt-6">
      <button
        onClick={() => navigate(-1)}
        className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center mb-8"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center mb-6">
        <FlaskConical size={22} className="text-primary" />
      </div>

      <h1 className="font-display text-3xl font-extrabold mb-2">Leg los!</h1>
      <p className="text-muted mb-8">
        Erstelle deinen Account und starte dein erstes Protokoll.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
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

        <div className="flex-1" />

        <PrimaryButton type="submit">Account erstellen</PrimaryButton>

        <p className="text-center text-muted text-sm pb-6">
          Schon registriert?{" "}
          <Link to="/anmelden" className="text-primary font-semibold">
            Anmelden
          </Link>
        </p>
      </form>
    </div>
  );
}
