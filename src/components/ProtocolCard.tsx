import { Check, FlaskConical, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Protocol } from "../types";

const TILE_GRADIENTS = [
  "linear-gradient(135deg, #4caf7d, #1f5c3d)",
  "linear-gradient(135deg, #ffb066, #ff9d42)",
  "linear-gradient(135deg, #ffd873, #ffc94d)",
  "linear-gradient(135deg, #6ec3e0, #3d94b8)",
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
  const status = protocol.submittedAt ? "eingereicht" : protocol.result ? "fertig" : "in Arbeit";

  return (
    <button
      onClick={() => navigate(`/protokolle/${protocol.id}`)}
      className="text-left w-full rounded-3xl bg-surface border border-border overflow-hidden flex flex-col active:scale-[0.98] transition"
    >
      <div className="relative h-24 flex items-center justify-center" style={{ background: gradient }}>
        <FlaskConical size={30} className="text-white/90" />
        <span className="absolute top-3 right-3 text-[11px] text-white bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
          {formatDate(protocol.createdAt)}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <p className="font-semibold text-sm leading-snug line-clamp-2 min-h-10">
          {protocol.question || "Ohne Titel"}
        </p>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 flex-1 rounded-full bg-bg-soft overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: protocol.result ? "100%" : "70%",
                background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
              }}
            />
          </div>
          <span className="text-[11px] text-muted-2 flex items-center gap-1 shrink-0">
            {protocol.submittedAt && <Send size={10} />}
            {!protocol.submittedAt && protocol.result && <Check size={10} />}
            {status}
          </span>
        </div>
      </div>
    </button>
  );
}
