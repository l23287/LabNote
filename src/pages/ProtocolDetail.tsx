import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, FlaskConical, Lightbulb, ListChecks, Notebook, Trash2 } from "lucide-react";
import { getProtocols, saveProtocols } from "../lib/storage";
import { useMemo } from "react";

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-surface border border-border p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl bg-bg-soft flex items-center justify-center text-violet">
          {icon}
        </div>
        <h2 className="font-display font-bold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export function ProtocolDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const protocol = useMemo(() => getProtocols().find((p) => p.id === id), [id]);

  if (!protocol) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-muted">Dieses Protokoll wurde nicht gefunden.</p>
        <button onClick={() => navigate("/protokolle")} className="text-violet font-semibold">
          Zurück zur Übersicht
        </button>
      </div>
    );
  }

  function handleDelete() {
    if (!protocol) return;
    if (!confirm("Dieses Protokoll wirklich löschen?")) return;
    saveProtocols(getProtocols().filter((p) => p.id !== protocol.id));
    navigate("/protokolle");
  }

  return (
    <div className="min-h-dvh px-6 pt-6 pb-32">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-surface flex items-center justify-center"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleDelete}
          className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-pink"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <span className="text-xs text-muted-2">
        {new Date(protocol.createdAt).toLocaleDateString("de-DE", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </span>
      <h1 className="font-display text-2xl font-extrabold leading-snug mt-1 mb-6">
        {protocol.question}
      </h1>

      <div className="flex flex-col gap-4">
        <Section icon={<ListChecks size={16} />} title="Materialien">
          <ul className="space-y-2">
            {protocol.materials.map((m, i) => (
              <li key={i} className="text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet shrink-0" /> {m}
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={<FlaskConical size={16} />} title="Durchführung">
          <ol className="space-y-2">
            {protocol.procedure.map((s, i) => (
              <li key={i} className="text-sm flex gap-3">
                <span className="w-5 h-5 rounded-full bg-bg-soft text-[11px] flex items-center justify-center text-muted font-semibold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </Section>

        {protocol.hypothesis && (
          <Section icon={<Lightbulb size={16} />} title="Vermutung">
            <p className="text-sm leading-relaxed">{protocol.hypothesis}</p>
          </Section>
        )}

        <Section icon={<Notebook size={16} />} title="Beobachtung">
          <p className="text-sm leading-relaxed">{protocol.observation}</p>
        </Section>

        <Section icon={<Notebook size={16} />} title="Ergebnis">
          <p className="text-sm leading-relaxed">{protocol.result}</p>
        </Section>
      </div>
    </div>
  );
}
