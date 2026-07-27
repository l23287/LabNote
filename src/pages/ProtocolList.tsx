import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getProtocolsForUser } from "../lib/storage";
import { ProtocolCard } from "../components/ProtocolCard";

export function ProtocolList() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const protocols = useMemo(
    () => (user ? getProtocolsForUser(user.id) : []),
    [user],
  );

  const filtered = protocols.filter((p) =>
    p.question.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-dvh px-6 pt-8 pb-32">
      <h1 className="font-display text-2xl font-extrabold mb-5">Meine Protokolle</h1>

      <div className="flex items-center gap-3 mb-6 h-12 rounded-2xl bg-surface border border-border px-4">
        <Search size={16} className="text-muted-2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Protokoll suchen…"
          className="bg-transparent flex-1 outline-none text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-6 text-center text-muted">
          Keine Protokolle gefunden.
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
