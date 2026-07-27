import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Check, FlaskConical, Search, Send, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getProtocolsForUser } from "../lib/storage";
import { ProtocolCard } from "../components/ProtocolCard";

export function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const protocols = useMemo(() => (user ? getProtocolsForUser(user.id) : []), [user]);

  const submittedCount = protocols.filter((p) => p.submittedAt).length;
  const thisWeekCount = protocols.filter((p) => {
    const diffDays = (Date.now() - new Date(p.createdAt).getTime()) / 86_400_000;
    return diffDays <= 7;
  }).length;

  return (
    <div className="flex flex-col gap-8 pb-8">
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-3 h-12 rounded-2xl bg-surface border border-border px-4">
          <Search size={16} className="text-muted-2" />
          <input
            placeholder="Protokoll suchen…"
            onFocus={() => navigate("/protokolle")}
            className="bg-transparent flex-1 outline-none text-sm"
            readOnly
          />
        </div>
        <button
          onClick={() => navigate("/neu")}
          className="h-12 px-5 rounded-2xl text-white font-semibold text-sm hidden sm:flex items-center gap-2 shrink-0"
          style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))" }}
        >
          <Sparkles size={16} />
          Neues Protokoll
        </button>
      </div>

      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-extrabold leading-tight">
          Hallo {user?.name} 👋
        </h1>
        <p className="text-muted mt-1">
          Lass uns dein nächstes <span className="text-primary font-semibold">Experiment</span>{" "}
          starten.
        </p>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg">Deine Protokolle</h2>
          <button
            onClick={() => navigate("/protokolle")}
            className="text-sm text-primary font-semibold"
          >
            Alle ansehen
          </button>
        </div>

        {protocols.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-8 text-center text-muted">
            Du hast noch kein Protokoll erstellt.{" "}
            <button onClick={() => navigate("/neu")} className="text-primary font-semibold">
              Jetzt starten
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {protocols.slice(0, 6).map((p, i) => (
              <ProtocolCard key={p.id} protocol={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {protocols.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-4">
          <div className="rounded-3xl bg-surface border border-border p-5">
            <h2 className="font-display font-bold mb-4">Letzte Aktivität</h2>
            <div className="flex flex-col divide-y divide-border">
              {protocols.slice(0, 5).map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/protokolle/${p.id}`)}
                  className="flex items-center gap-3 py-3 text-left first:pt-0 last:pb-0"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary-soft flex items-center justify-center shrink-0">
                    <FlaskConical size={15} className="text-primary" />
                  </div>
                  <span className="flex-1 text-sm font-medium line-clamp-1">{p.question}</span>
                  <span className="text-xs text-muted-2 shrink-0">
                    {new Date(p.createdAt).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-3xl bg-surface border border-border p-5 flex flex-col items-center gap-1 text-center">
              <Check size={18} className="text-primary mb-1" />
              <span className="font-display font-bold text-2xl">{thisWeekCount}</span>
              <span className="text-muted text-xs">diese Woche erstellt</span>
            </div>
            <div className="rounded-3xl bg-surface border border-border p-5 flex flex-col items-center gap-1 text-center">
              <Send size={18} className="text-accent mb-1" />
              <span className="font-display font-bold text-2xl">{submittedCount}</span>
              <span className="text-muted text-xs">eingereicht</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
