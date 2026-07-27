import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  FlaskConical,
  Lightbulb,
  ListChecks,
  Loader2,
  Notebook,
  Pencil,
  Send,
  Trash2,
} from "lucide-react";
import { deleteProtocol, getProtocol, upsertProtocol } from "../lib/storage";
import { submitProtocolAsPdf } from "../lib/pdf";
import { useAuth } from "../context/AuthContext";

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
        <div className="w-8 h-8 rounded-xl bg-bg-soft flex items-center justify-center text-primary">
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
  const { user } = useAuth();
  const [protocol, setProtocol] = useState(() => (id ? getProtocol(id) : undefined));
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!protocol) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-muted">Dieses Protokoll wurde nicht gefunden.</p>
        <button onClick={() => navigate("/protokolle")} className="text-primary font-semibold">
          Zurück zur Übersicht
        </button>
      </div>
    );
  }

  function handleDelete() {
    if (!protocol) return;
    if (!confirm("Dieses Protokoll wirklich löschen?")) return;
    deleteProtocol(protocol.id);
    navigate("/protokolle");
  }

  async function handleSubmit() {
    if (!protocol || !user) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      const result = await submitProtocolAsPdf(protocol, user.name);
      if (result === "cancelled") {
        return;
      }
      const updated = { ...protocol, submittedAt: new Date().toISOString() };
      upsertProtocol(updated);
      setProtocol(updated);
      setFeedback(
        result === "shared"
          ? "Protokoll geteilt."
          : "PDF heruntergeladen – jetzt an deine Lehrkraft senden.",
      );
    } catch {
      setFeedback("Das PDF konnte nicht erstellt werden.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-dvh px-6 pt-6 pb-32">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/protokolle/${protocol.id}/bearbeiten`)}
            className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-primary"
            aria-label="Bearbeiten"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-danger"
            aria-label="Löschen"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <span className="text-xs text-muted-2">
        {new Date(protocol.createdAt).toLocaleDateString("de-DE", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </span>
      <h1 className="font-display text-2xl font-extrabold leading-snug mt-1 mb-4">
        {protocol.question}
      </h1>

      {protocol.submittedAt && (
        <div className="flex items-center gap-2 rounded-2xl bg-primary-soft text-primary px-4 py-3 mb-4 text-sm font-medium">
          <Send size={14} />
          Eingereicht am{" "}
          {new Date(protocol.submittedAt).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "long",
          })}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <Section icon={<ListChecks size={16} />} title="Materialien">
          <ul className="space-y-2">
            {protocol.materials.map((m, i) => (
              <li key={i} className="text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> {m}
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

      <div className="mt-6">
        {feedback && <p className="text-sm text-muted text-center mb-3">{feedback}</p>}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full h-14 rounded-2xl font-semibold text-white disabled:opacity-60 transition active:scale-[0.98] flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))",
            boxShadow: "0 10px 25px rgba(163,230,53,0.3)",
          }}
        >
          {submitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
          {protocol.submittedAt ? "Erneut als PDF einreichen" : "Als PDF einreichen"}
        </button>
      </div>
    </div>
  );
}
