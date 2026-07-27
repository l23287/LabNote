import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getProtocolsForUser } from "../lib/storage";
import { ProtocolCard } from "../components/ProtocolCard";
import { BlobBackground } from "../components/BlobBackground";

export function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const protocols = useMemo(
    () => (user ? getProtocolsForUser(user.id) : []),
    [user],
  );

  return (
    <div className="relative min-h-dvh pb-32">
      <BlobBackground />

      <div className="relative px-6 pt-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center font-display font-bold text-white"
              style={{ background: user?.avatarColor ?? "var(--color-violet)" }}
            >
              {user?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div>
              <p className="text-muted text-xs">Willkommen zurück</p>
              <p className="font-semibold">{user?.name}</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
            <Search size={18} className="text-muted" />
          </button>
        </div>

        <h1 className="font-display text-3xl font-extrabold leading-tight mb-1">
          Lass uns dein
          <br />
          nächstes <span className="text-violet">Experiment</span> starten.
        </h1>

        <button
          onClick={() => navigate("/neu")}
          className="w-full mt-6 rounded-3xl p-5 flex items-center justify-between text-left"
          style={{
            background: "linear-gradient(135deg, var(--color-violet), var(--color-violet-2))",
          }}
        >
          <div>
            <p className="text-white/80 text-sm mb-1">Neues Protokoll</p>
            <p className="text-white font-display font-bold text-lg">
              Schritt für Schritt starten
            </p>
          </div>
          <Sparkles size={28} className="text-white" />
        </button>

        <div className="flex items-center justify-between mt-8 mb-4">
          <h2 className="font-display font-bold text-lg">Deine letzten Protokolle</h2>
          <button
            onClick={() => navigate("/protokolle")}
            className="text-sm text-violet font-semibold"
          >
            Alle
          </button>
        </div>

        {protocols.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-6 text-center text-muted">
            Du hast noch kein Protokoll erstellt. Tippe auf „Schritt für Schritt
            starten“, um loszulegen!
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {protocols.slice(0, 4).map((p, i) => (
              <ProtocolCard key={p.id} protocol={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
