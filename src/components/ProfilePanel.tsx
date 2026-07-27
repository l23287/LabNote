import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FlaskConical, MoreHorizontal, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getAnimal } from "../lib/animals";
import { getProtocolsForUser } from "../lib/storage";
import { LabScene } from "./LabScene";

export function ProfilePanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const protocols = useMemo(() => (user ? getProtocolsForUser(user.id) : []), [user]);
  const latest = protocols[0];

  if (!user) return null;
  const animal = getAnimal(user.avatar);

  return (
    <aside className="hidden xl:flex flex-col w-80 shrink-0 sticky top-5 h-[calc(100dvh-2.5rem)]">
      <div
        className="relative flex-1 rounded-3xl p-6 flex flex-col text-white overflow-hidden"
        style={{ background: "linear-gradient(160deg, var(--color-primary), var(--color-primary-dark))" }}
      >
        <div className="flex items-center justify-between mb-8">
          <span className="font-display font-bold">Mein Profil</span>
          <button className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
            <MoreHorizontal size={16} />
          </button>
        </div>

        <button
          onClick={() => navigate("/profil")}
          className="flex flex-col items-center text-center mb-6"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-3 ring-4 ring-white/25"
            style={{ background: animal.bg }}
          >
            {animal.emoji}
          </div>
          <p className="font-display font-bold text-lg">{user.name}</p>
          <span className="mt-1 text-xs font-medium bg-white/15 px-3 py-1 rounded-full">
            Nachwuchsforscher:in
          </span>
        </button>

        <div className="rounded-2xl bg-surface text-ink p-4 mb-6">
          <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-2">
            {latest ? "Letztes Protokoll" : "Noch kein Protokoll"}
          </p>
          {latest ? (
            <button onClick={() => navigate(`/protokolle/${latest.id}`)} className="text-left w-full">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-primary-soft flex items-center justify-center shrink-0">
                  <FlaskConical size={14} className="text-primary" />
                </div>
                <p className="text-sm font-semibold leading-snug line-clamp-2">{latest.question}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-2 bg-bg-soft px-2 py-1 rounded-full">
                {latest.submittedAt && <Send size={10} />}
                {new Date(latest.createdAt).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </button>
          ) : (
            <button
              onClick={() => navigate("/neu")}
              className="text-sm font-semibold text-primary"
            >
              Jetzt erstes Protokoll starten →
            </button>
          )}
        </div>

        <div className="relative mt-auto -mx-6 -mb-6 h-40">
          <LabScene className="absolute inset-0 w-full h-full" />
        </div>
      </div>
    </aside>
  );
}
