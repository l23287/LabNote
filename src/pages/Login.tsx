import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, FlaskConical } from "lucide-react";
import { useAuth } from "../context/AuthContext";
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
    <div className="relative min-h-dvh flex flex-col px-6 pt-6">
      <button
        onClick={() => navigate(-1)}
        className="w-10 h-10 rounded-full bg-surface flex items-center justify-center mb-8"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center mb-6">
        <FlaskConical size={22} className="text-violet" />
      </div>

      <h1 className="font-display text-3xl font-extrabold mb-2">Willkommen zurück!</h1>
      <p className="text-muted mb-8">Melde dich an, um deine Protokolle zu sehen.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
        <label className="flex flex-col gap-2">
          <span className="text-sm text-muted font-medium">E-Mail</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="du@schule.de"
            className="h-14 rounded-2xl bg-surface border border-border px-4 outline-none focus:border-violet"
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
            className="h-14 rounded-2xl bg-surface border border-border px-4 outline-none focus:border-violet"
          />
        </label>

        {error && <p className="text-pink text-sm">{error}</p>}

        <div className="flex-1" />

        <PrimaryButton type="submit">Anmelden</PrimaryButton>

        <p className="text-center text-muted text-sm pb-6">
          Noch keinen Account?{" "}
          <Link to="/registrieren" className="text-violet font-semibold">
            Jetzt registrieren
          </Link>
        </p>
      </form>
    </div>
  );
}
