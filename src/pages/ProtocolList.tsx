import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getProtocolsForUser } from "../lib/storage";
import { ProtocolCard } from "../components/ProtocolCard";

export function ProtocolList() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const protocols = useMemo(
    () => (user ? getProtocolsForUser(user.id) : []),
    [user],
  );

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = normalizedQuery
    ? protocols.filter((p) => {
        const haystack = [
          p.question,
          ...p.materials,
          ...p.procedure,
          p.hypothesis,
          p.observation,
          p.result,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : protocols;

  return (
    <div className="min-h-dvh px-6 pt-8 pb-32">
      <h1 className="font-display text-2xl font-extrabold mb-5">Meine Protokolle</h1>

      <div className="flex items-center gap-3 mb-6 h-12 rounded-2xl bg-surface border border-border px-4">
        <Search size={16} className="text-muted-2 shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Protokoll suchen…"
          className="bg-transparent flex-1 outline-none text-sm min-w-0"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-muted-2 shrink-0"
            aria-label="Suche zurücksetzen"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-6 text-center text-muted">
          {normalizedQuery ? "Keine Protokolle gefunden." : "Du hast noch kein Protokoll erstellt."}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((p, i) => (
            <ProtocolCard key={p.id} protocol={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
