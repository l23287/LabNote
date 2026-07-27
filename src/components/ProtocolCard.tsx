import { FlaskConical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Protocol } from "../types";

const TILE_GRADIENTS = [
  "linear-gradient(135deg, #8b6bff, #5c3bfa)",
  "linear-gradient(135deg, #ff9fc4, #ff7fb0)",
  "linear-gradient(135deg, #ffd27a, #ffb648)",
  "linear-gradient(135deg, #6be8d4, #3ee6c4)",
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "short",
  });
}

export function ProtocolCard({ protocol, index = 0 }: { protocol: Protocol; index?: number }) {
  const navigate = useNavigate();
  const gradient = TILE_GRADIENTS[index % TILE_GRADIENTS.length];

  return (
    <button
      onClick={() => navigate(`/protokolle/${protocol.id}`)}
      className="text-left w-full rounded-3xl bg-surface border border-border p-4 flex flex-col gap-3 active:scale-[0.98] transition"
    >
      <div className="flex items-start justify-between">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{ background: gradient }}
        >
          <FlaskConical size={20} className="text-white" />
        </div>
        <span className="text-xs text-muted-2 bg-bg-soft px-2 py-1 rounded-full">
          {formatDate(protocol.createdAt)}
        </span>
      </div>
      <p className="font-semibold leading-snug line-clamp-2 min-h-11">
        {protocol.question || "Ohne Titel"}
      </p>
      <div className="flex items-center gap-1.5">
        <div className="h-1.5 flex-1 rounded-full bg-bg-soft overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: protocol.result ? "100%" : "70%",
              background: "linear-gradient(90deg, var(--color-violet), var(--color-pink))",
            }}
          />
        </div>
        <span className="text-[11px] text-muted-2">
          {protocol.result ? "fertig" : "in Arbeit"}
        </span>
      </div>
    </button>
  );
}
