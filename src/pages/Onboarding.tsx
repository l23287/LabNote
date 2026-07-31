import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, FlaskConical } from "lucide-react";
import { BlobBackground } from "../components/BlobBackground";
import { PrimaryButton } from "../components/PrimaryButton";

interface Slide {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
}

const SLIDES: Slide[] = [
  {
    eyebrow: "Geführter Wizard",
    titleLine1: "Von der Frage bis",
    titleLine2: "zum Ergebnis.",
    description:
      "Jedes Protokoll führt dich Schritt für Schritt durch Fragestellung, Materialien, Durchführung und Beobachtung.",
  },
  {
    eyebrow: "Alles im Überblick",
    titleLine1: "Deine Protokolle,",
    titleLine2: "immer griffbereit.",
    description:
      "Behalte alle Experimente im Blick – als Liste oder im Kalender, sortiert nach Klasse und Datum.",
  },
  {
    eyebrow: "Willkommen bei",
    titleLine1: "Dein Experiment,",
    titleLine2: "Schritt für Schritt.",
    description:
      "LabNote führt dich durch dein Versuchsprotokoll für den Science-Unterricht – von der Frage bis zum Ergebnis.",
  },
];

export function Onboarding() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  return (
    <div className="relative min-h-dvh flex flex-col">
      <BlobBackground variant="onboarding" />

      <div className="relative flex-1 flex flex-col px-6 pt-16">
        {index > 0 && (
          <button
            onClick={() => setIndex((i) => i - 1)}
            aria-label="Zurück"
            className="absolute top-3 left-6 z-10 w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {!isLast && (
          <button
            onClick={() => navigate("/anmelden")}
            className="absolute top-6 right-6 z-10 text-sm font-semibold text-muted"
          >
            Überspringen
          </button>
        )}

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
          <p className="text-muted text-sm font-medium mb-1">{slide.eyebrow}</p>
          <h1 className="font-display text-4xl font-extrabold leading-tight mb-3">
            {slide.titleLine1}
            <br />
            <span className="text-primary">{slide.titleLine2}</span>
          </h1>
          <p className="text-muted text-base leading-relaxed mb-8">{slide.description}</p>
        </div>
      </div>

      <div className="relative px-6 pb-10 flex flex-col gap-3">
        <div className="flex justify-center gap-2 mb-2">
          {SLIDES.map((dotSlide, i) => (
            <button
              key={dotSlide.eyebrow}
              onClick={() => setIndex(i)}
              aria-label={`Zu Seite ${i + 1}`}
              className="h-2 rounded-full transition-all"
              style={{
                width: i === index ? 24 : 8,
                background: i === index ? "var(--color-primary)" : "var(--color-surface-2)",
              }}
            />
          ))}
        </div>

        {isLast ? (
          <>
            <PrimaryButton onClick={() => navigate("/registrieren")}>
              Account erstellen
            </PrimaryButton>
            <button
              onClick={() => navigate("/anmelden")}
              className="h-12 text-muted font-medium"
            >
              Ich habe schon einen Account
            </button>
          </>
        ) : (
          <PrimaryButton onClick={() => setIndex((i) => i + 1)}>Weiter</PrimaryButton>
        )}
      </div>
    </div>
  );
}
