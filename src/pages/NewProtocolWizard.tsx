import { useMemo, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, X, Check, Pencil, Beaker } from "lucide-react";
import { WizardHeader } from "../components/WizardHeader";
import { SortableStepList } from "../components/SortableStepList";
import { PrimaryButton } from "../components/PrimaryButton";
import { useAuth } from "../context/AuthContext";
import { getProtocol, upsertProtocol } from "../lib/storage";
import type { Protocol, ProtocolDraft } from "../types";
import { emptyDraft } from "../types";

const TOTAL_STEPS = 6;

function toDraft(protocol: Protocol): ProtocolDraft {
  return {
    question: protocol.question,
    materials: protocol.materials,
    procedure: protocol.procedure,
    hypothesis: protocol.hypothesis,
    observation: protocol.observation,
    result: protocol.result,
  };
}

function ListEditor({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [value, setValue] = useState("");

  function add() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setValue("");
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          className="flex-1 h-14 rounded-2xl bg-surface border border-border px-4 outline-none focus:border-primary"
        />
        <button
          onClick={add}
          type="button"
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
          }}
        >
          <Plus className="text-white" />
        </button>
      </div>

      {items.length > 0 && (
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-surface border border-border rounded-2xl px-4 py-3"
            >
              <span className="flex-1 text-sm">{item}</span>
              <button onClick={() => remove(i)} type="button" className="text-muted-2">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function NewProtocolWizard() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const existing = useMemo(() => (id ? getProtocol(id) : undefined), [id]);

  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<ProtocolDraft>(() =>
    existing ? toDraft(existing) : emptyDraft,
  );
  const { user } = useAuth();
  const navigate = useNavigate();

  if (isEditing && !existing) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-white drop-shadow">Dieses Protokoll wurde nicht gefunden.</p>
        <button onClick={() => navigate("/protokolle")} className="text-white font-semibold underline">
          Zurück zur Übersicht
        </button>
      </div>
    );
  }

  function update<K extends keyof ProtocolDraft>(key: K, value: ProtocolDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function goBack() {
    if (step === 1) {
      navigate(-1);
    } else {
      setStep((s) => s - 1);
    }
  }

  function goNext(e?: FormEvent) {
    e?.preventDefault();
    setStep((s) => Math.min(s + 1, TOTAL_STEPS + 1));
  }

  function handleSave() {
    if (!user) return;
    const now = new Date().toISOString();

    if (isEditing && existing) {
      const updated: Protocol = {
        ...existing,
        ...draft,
        updatedAt: now,
        submittedAt: undefined,
      };
      upsertProtocol(updated);
      navigate(`/protokolle/${updated.id}`);
      return;
    }

    const protocol: Protocol = {
      id: crypto.randomUUID(),
      userId: user.id,
      ...draft,
      createdAt: now,
      updatedAt: now,
    };
    upsertProtocol(protocol);
    navigate(`/protokolle/${protocol.id}`);
  }

  const canContinue = (() => {
    switch (step) {
      case 1:
        return draft.question.trim().length > 0;
      case 2:
        return draft.materials.length > 0;
      case 3:
        return draft.procedure.length > 0;
      case 4:
        return true;
      case 5:
        return draft.observation.trim().length > 0;
      case 6:
        return draft.result.trim().length > 0;
      default:
        return true;
    }
  })();

  if (step > TOTAL_STEPS) {
    return (
      <div className="max-w-2xl mx-auto w-full bg-surface border border-border rounded-3xl p-6 lg:p-8 flex flex-col min-h-[600px]">
        <WizardHeader
          step={TOTAL_STEPS}
          total={TOTAL_STEPS}
          onBack={() => setStep(TOTAL_STEPS)}
          title="Fertig! Schau dir dein Protokoll an."
        />

        <div className="flex-1 flex flex-col gap-4 mt-6 overflow-y-auto no-scrollbar">
          <SummaryBlock title="Fragestellung" onEdit={() => setStep(1)}>
            <p className="text-sm">{draft.question}</p>
          </SummaryBlock>
          <SummaryBlock title="Materialien" onEdit={() => setStep(2)}>
            <ul className="text-sm list-disc list-inside space-y-1">
              {draft.materials.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </SummaryBlock>
          <SummaryBlock title="Durchführung" onEdit={() => setStep(3)}>
            <ol className="text-sm list-decimal list-inside space-y-1">
              {draft.procedure.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </SummaryBlock>
          {draft.hypothesis && (
            <SummaryBlock title="Vermutung" onEdit={() => setStep(4)}>
              <p className="text-sm">{draft.hypothesis}</p>
            </SummaryBlock>
          )}
          <SummaryBlock title="Beobachtung" onEdit={() => setStep(5)}>
            <p className="text-sm">{draft.observation}</p>
          </SummaryBlock>
          <SummaryBlock title="Ergebnis" onEdit={() => setStep(6)}>
            <p className="text-sm">{draft.result}</p>
          </SummaryBlock>
        </div>

        <div className="pt-4">
          <PrimaryButton onClick={handleSave}>
            <span className="flex items-center justify-center gap-2">
              <Check size={20} /> {isEditing ? "Änderungen speichern" : "Protokoll speichern"}
            </span>
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={goNext}
      className="max-w-2xl mx-auto w-full bg-surface border border-border rounded-3xl p-6 lg:p-8 flex flex-col min-h-[600px]"
    >
      <WizardHeader
        step={step}
        total={TOTAL_STEPS}
        onBack={goBack}
        title={STEP_META[step - 1].title}
      />

      <p className="px-0 text-muted text-sm mt-3 mb-5">{STEP_META[step - 1].hint}</p>

      <div className="flex-1">
        {step === 1 && (
          <textarea
            autoFocus
            value={draft.question}
            onChange={(e) => update("question", e.target.value)}
            placeholder="z.B. Wie wirkt sich Salz auf den Siedepunkt von Wasser aus?"
            className="w-full h-40 rounded-2xl bg-surface border border-border p-4 outline-none focus:border-primary resize-none"
          />
        )}

        {step === 2 && (
          <ListEditor
            items={draft.materials}
            onChange={(items) => update("materials", items)}
            placeholder="z.B. Becherglas"
          />
        )}

        {step === 3 && (
          <SortableStepList
            items={draft.procedure}
            onChange={(items) => update("procedure", items)}
            placeholder="z.B. Wasser in den Topf füllen"
          />
        )}

        {step === 4 && (
          <textarea
            autoFocus
            value={draft.hypothesis}
            onChange={(e) => update("hypothesis", e.target.value)}
            placeholder="z.B. Ich vermute, dass das Salzwasser später kocht."
            className="w-full h-40 rounded-2xl bg-surface border border-border p-4 outline-none focus:border-primary resize-none"
          />
        )}

        {step === 5 && (
          <textarea
            autoFocus
            value={draft.observation}
            onChange={(e) => update("observation", e.target.value)}
            placeholder="Was ist während des Versuchs passiert?"
            className="w-full h-40 rounded-2xl bg-surface border border-border p-4 outline-none focus:border-primary resize-none"
          />
        )}

        {step === 6 && (
          <textarea
            autoFocus
            value={draft.result}
            onChange={(e) => update("result", e.target.value)}
            placeholder="Was bedeutet dein Ergebnis? Hattest du recht mit deiner Vermutung?"
            className="w-full h-40 rounded-2xl bg-surface border border-border p-4 outline-none focus:border-primary resize-none"
          />
        )}
      </div>

      <div className="pt-4 flex flex-col gap-2">
        <PrimaryButton type="submit" disabled={!canContinue}>
          {step === TOTAL_STEPS ? "Zur Übersicht" : "Weiter"}
        </PrimaryButton>
        {step === 4 && (
          <button
            type="button"
            onClick={() => goNext()}
            className="h-10 text-muted text-sm font-medium"
          >
            Überspringen
          </button>
        )}
      </div>
    </form>
  );
}

const STEP_META = [
  {
    title: "Was möchtest du herausfinden?",
    hint: "Formuliere deine Fragestellung – das ist der Start jedes guten Experiments.",
  },
  {
    title: "Welche Materialien brauchst du?",
    hint: "Füge alle Dinge hinzu, die du für den Versuch benötigst.",
  },
  {
    title: "Wie führst du den Versuch durch?",
    hint: "Schreibe die einzelnen Schritte der Durchführung auf und bring sie in die richtige Reihenfolge.",
  },
  {
    title: "Was vermutest du?",
    hint: "Bevor du testest: Was denkst du, wird passieren? (optional)",
  },
  {
    title: "Was hast du beobachtet?",
    hint: "Beschreibe genau, was während des Versuchs passiert ist.",
  },
  {
    title: "Was bedeutet dein Ergebnis?",
    hint: "Erkläre, was du herausgefunden hast und was das Ergebnis bedeutet.",
  },
];

function SummaryBlock({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-surface border border-border p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Beaker size={14} className="text-primary" />
          <span className="text-xs font-semibold text-muted uppercase tracking-wide">
            {title}
          </span>
        </div>
        <button onClick={onEdit} type="button" className="text-muted-2">
          <Pencil size={14} />
        </button>
      </div>
      {children}
    </div>
  );
}
