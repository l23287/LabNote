import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getProtocolsForUser } from "../lib/storage";
import { ProtocolCard } from "../components/ProtocolCard";

export function ProtocolList() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const protocols = useMemo(() => (user ? getProtocolsForUser(user.id) : []), [user]);

  const filtered = protocols.filter((p) =>
    p.question.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6 pb-8">
      <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-white drop-shadow-md">
        Meine Protokolle
      </h1>

      <div className="flex items-center gap-3 h-12 rounded-2xl bg-surface border border-border px-4 max-w-md">
        <Search size={16} className="text-muted-2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Protokoll suchen…"
          className="bg-transparent flex-1 outline-none text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl bg-surface border border-dashed border-white/40 p-8 text-center text-muted">
          Keine Protokolle gefunden.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <ProtocolCard key={p.id} protocol={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
