import { useNavigate } from "react-router-dom";
import { FlaskConical } from "lucide-react";
import { BlobBackground } from "../components/BlobBackground";
import { PrimaryButton } from "../components/PrimaryButton";

export function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-dvh flex flex-col">
      <BlobBackground variant="onboarding" />

      <div className="relative flex-1 flex flex-col px-6 pt-16">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-10 h-10 rounded-2xl bg-surface border border-border flex items-center justify-center">
            <FlaskConical size={20} className="text-primary" />
          </div>
          <span className="font-display font-bold text-lg tracking-wide">LabNote</span>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <div
              className="absolute inset-0 rounded-[40%_60%_60%_40%/50%_40%_60%_50%] blob-float"
              style={{
                background:
                  "conic-gradient(from 180deg, var(--color-primary), var(--color-accent), var(--color-sun), var(--color-primary))",
                filter: "blur(2px)",
                opacity: 0.9,
              }}
            />
            <div className="absolute inset-6 rounded-[45%_55%_65%_35%/55%_45%_55%_45%] bg-bg/40 backdrop-blur-sm" />
          </div>
        </div>

        <div className="pb-4">
          <p className="text-muted text-sm font-medium mb-1">Willkommen bei</p>
          <h1 className="font-display text-4xl font-extrabold leading-tight mb-3">
            Dein Experiment,
            <br />
            <span className="text-primary">Schritt für Schritt.</span>
          </h1>
          <p className="text-muted text-base leading-relaxed mb-8">
            LabNote führt dich durch dein Versuchsprotokoll für den
            Science-Unterricht – von der Frage bis zum Ergebnis.
          </p>
        </div>
      </div>

      <div className="relative px-6 pb-10 flex flex-col gap-3">
        <PrimaryButton onClick={() => navigate("/registrieren")}>
          Account erstellen
        </PrimaryButton>
        <button
          onClick={() => navigate("/anmelden")}
          className="h-12 text-muted font-medium"
        >
          Ich habe schon einen Account
        </button>
      </div>
    </div>
  );
}
