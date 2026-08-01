import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  FileText,
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
import { openProtocolPdf, submitProtocolAsPdf } from "../lib/pdf";
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

function ImageGallery({ images }: { images: string[] }) {
  if (images.length === 0) return null;
  return (
    <div className="flex gap-2 mt-3 flex-wrap">
      {images.map((src, i) => (
        <button
          key={i}
          type="button"
          onClick={() => window.open(src, "_blank")}
          className="w-16 h-16 rounded-xl overflow-hidden shrink-0"
        >
          <img src={src} alt="" className="w-full h-full object-cover" />
        </button>
      ))}
    </div>
  );
}

export function ProtocolDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [protocol, setProtocol] = useState(() => (id ? getProtocol(id) : undefined));
  const [submitting, setSubmitting] = useState(false);
  const [opening, setOpening] = useState(false);
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
      const result = await submitProtocolAsPdf(protocol, user.name, user.schoolClass);
      if (result === "cancelled") {
        return;
      }
      const updated = { ...protocol, submittedAt: new Date().toISOString() };
      upsertProtocol(updated);
      setProtocol(updated);

      if (result === "downloaded" && user.teacherEmail) {
        const subject = encodeURIComponent(`Protokoll: ${protocol.question || "Experiment"}`);
        const body = encodeURIComponent(
          `Hallo,\n\nanbei mein Experimentprotokoll. Das PDF wurde gerade heruntergeladen – bitte diese E-Mail damit ergänzen (Anhang hinzufügen).\n\nViele Grüße\n${user.name}`,
        );
        window.location.href = `mailto:${user.teacherEmail}?subject=${subject}&body=${body}`;
      }

      setFeedback(
        result === "shared"
          ? "Protokoll geteilt."
          : user.teacherEmail
            ? "PDF heruntergeladen. Eine E-Mail an deine Lehrkraft wird geöffnet – bitte das PDF dort manuell anhängen."
            : "PDF heruntergeladen. Sende es selbst an deine Lehrkraft, oder hinterlege ihre E-Mail-Adresse im Profil, damit wir das nächste Mal die E-Mail für dich vorbereiten.",
      );
    } catch {
      setFeedback("Das PDF konnte nicht erstellt werden.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOpenPdf() {
    if (!protocol || !user) return;
    setOpening(true);
    setFeedback(null);
    try {
      await openProtocolPdf(protocol, user.name, user.schoolClass);
    } catch {
      setFeedback("Das PDF konnte nicht geöffnet werden.");
    } finally {
      setOpening(false);
    }
  }

  return (
    <div className="min-h-dvh px-6 pt-6 pb-32">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/home")}
          aria-label="Zur Übersicht"
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
      <ImageGallery images={protocol.images.question} />

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
          <ImageGallery images={protocol.images.materials} />
        </Section>

        <Section icon={<FlaskConical size={16} />} title="Durchführung">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{protocol.procedure}</p>
          <ImageGallery images={protocol.images.procedure} />
        </Section>

        {(protocol.hypothesis || protocol.images.hypothesis.length > 0) && (
          <Section icon={<Lightbulb size={16} />} title="Vermutung">
            {protocol.hypothesis && <p className="text-sm leading-relaxed">{protocol.hypothesis}</p>}
            <ImageGallery images={protocol.images.hypothesis} />
          </Section>
        )}

        <Section icon={<Notebook size={16} />} title="Beobachtung">
          <p className="text-sm leading-relaxed">{protocol.observation}</p>
          <ImageGallery images={protocol.images.observation} />
        </Section>

        <Section icon={<Notebook size={16} />} title="Ergebnis">
          <p className="text-sm leading-relaxed">{protocol.result}</p>
          <ImageGallery images={protocol.images.result} />
        </Section>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {feedback && <p className="text-sm text-muted text-center">{feedback}</p>}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full h-14 rounded-2xl font-semibold text-white disabled:opacity-60 transition active:scale-[0.98] flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))",
            boxShadow: "0 10px 25px rgba(163,230,53,0.3)",
          }}
        >
          {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          {protocol.submittedAt ? "PDF erneut erstellen & senden" : "PDF erstellen & senden"}
        </button>

        <button
          onClick={handleOpenPdf}
          disabled={opening}
          className="w-full h-12 rounded-2xl bg-surface border border-border font-semibold text-sm disabled:opacity-60 transition flex items-center justify-center gap-2"
        >
          {opening ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
          PDF öffnen
        </button>
      </div>
    </div>
  );
}
