import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WizardHeaderProps {
  step: number;
  total: number;
  onBack?: () => void;
  title: string;
}

export function WizardHeader({ step, total, onBack, title }: WizardHeaderProps) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onBack ?? (() => navigate(-1))}
          className="w-10 h-10 rounded-full bg-bg-soft border border-border flex items-center justify-center text-ink"
          aria-label="Zurück"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm text-muted font-medium">
          Schritt {step} von {total}
        </span>
      </div>

      <div className="flex gap-2 mb-6">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full"
            style={{
              background:
                i < step
                  ? "linear-gradient(90deg, var(--color-primary), var(--color-accent))"
                  : "var(--color-surface-2)",
            }}
          />
        ))}
      </div>

      <h1 className="font-display text-2xl font-bold leading-snug">{title}</h1>
    </div>
  );
}
