import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, FlaskConical } from "lucide-react";
import { BlobBackground } from "../components/BlobBackground";
import { GlowBubble } from "../components/GlowBubble";
import { PrimaryButton } from "../components/PrimaryButton";
import wizardShot from "../assets/onboarding-wizard.png";
import calendarShot from "../assets/onboarding-calendar.png";

const BLOB = [
  { left: 10, top: -10, size: 200 },
  { left: 130, top: 0, size: 225 },
  { left: 20, top: 75, size: 250 },
  { left: 48, top: 40, size: 260 },
];

interface Panel {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
}

const PANELS: Panel[] = [
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
    eyebrow: "Teilen leicht gemacht",
    titleLine1: "Ein Klick",
    titleLine2: "und teilen.",
    description:
      "Exportiere dein fertiges Protokoll als PDF und teile es direkt mit deiner Lehrkraft und mit deinen Freunden.",
  },
  {
    eyebrow: "Willkommen bei",
    titleLine1: "Dein Experiment,",
    titleLine2: "Schritt für Schritt.",
    description:
      "LabNote führt dich durch dein Versuchsprotokoll für den Science-Unterricht – von der Frage bis zum Ergebnis.",
  },
];

const EASE = "cubic-bezier(.4,0,.2,1)";

export function Onboarding() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);

  const goNext = () => setIndex((i) => Math.min(3, i + 1));
  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const skip = () => setIndex(3);

  function onPointerDown(e: PointerEvent) {
    startX.current = e.clientX;
  }
  function onPointerUp(e: PointerEvent) {
    if (startX.current == null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (dx < -60) goNext();
    else if (dx > 60) goPrev();
  }

  const blob = BLOB[index];

  return (
    <div
      className="relative min-h-dvh flex flex-col overflow-hidden touch-none select-none"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <BlobBackground variant="onboarding" />

      <div className="relative z-10 flex flex-col flex-1 px-6" style={{ paddingTop: 64 }}>
        {index > 0 && (
          <button
            onClick={goPrev}
            aria-label="Zurück"
            className="absolute z-20 w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center"
            style={{ top: 11, left: 16 }}
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {index < 3 && (
          <button
            onClick={skip}
            className="absolute z-20 text-sm font-semibold text-muted"
            style={{ top: 38, right: 24 }}
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

        <div
          className="relative w-full max-w-[356px] mx-auto shrink-0 mb-8"
          style={{ height: 340 }}
        >
          <GlowBubble size={blob.size} left={blob.left} top={blob.top} />

          <div
            className="absolute pointer-events-none"
            style={{
              left: 28,
              top: 55,
              width: 300,
              height: 230,
              opacity: index === 0 ? 1 : 0,
              transition: `opacity 400ms ${EASE}`,
            }}
          >
            <img
              src={wizardShot}
              alt="Materialien-Schritt"
              className="absolute inset-0 m-auto max-w-full max-h-full w-auto h-auto object-contain rounded-2xl"
              style={{ boxShadow: "0 14px 34px rgba(0,0,0,.45)" }}
            />
          </div>
          <div
            className="absolute pointer-events-none"
            style={{
              left: 28,
              top: 55,
              width: 300,
              height: 230,
              opacity: index === 1 ? 1 : 0,
              transition: `opacity 400ms ${EASE}`,
            }}
          >
            <img
              src={calendarShot}
              alt="Kalender"
              className="absolute inset-0 m-auto max-w-full max-h-full w-auto h-auto object-contain rounded-2xl"
              style={{ boxShadow: "0 14px 34px rgba(0,0,0,.45)" }}
            />
          </div>
        </div>

        <div className="relative flex-1 min-h-0">
          {PANELS.map((panel, i) => (
            <div
              key={panel.eyebrow}
              aria-hidden={i !== index}
              className="absolute inset-0 flex flex-col"
              style={{
                opacity: i === index ? 1 : 0,
                pointerEvents: i === index ? "auto" : "none",
                transform: `translateY(${i === index ? 0 : 8}px)`,
                transition: `opacity 400ms ${EASE}, transform 400ms ${EASE}`,
              }}
            >
              <div>
                <p className="text-muted text-sm font-medium mb-1">{panel.eyebrow}</p>
                <h1 className="font-display text-3xl font-extrabold leading-snug mb-3">
                  {panel.titleLine1}
                  <br />
                  <span className="text-primary">{panel.titleLine2}</span>
                </h1>
                <p className="text-muted leading-relaxed">{panel.description}</p>
              </div>

              <div className="flex-1" />

              <div className="flex justify-center gap-2 mb-4">
                {PANELS.map((dotPanel, dotIndex) => (
                  <button
                    key={dotPanel.eyebrow}
                    onClick={() => setIndex(dotIndex)}
                    aria-label={`Zu Schritt ${dotIndex + 1}`}
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: dotIndex === index ? 24 : 8,
                      background: dotIndex === index ? "var(--color-primary)" : "var(--color-border)",
                    }}
                  />
                ))}
              </div>

              <div className="pb-10">
                {i < 3 ? (
                  <PrimaryButton onClick={goNext}>Weiter</PrimaryButton>
                ) : (
                  <div className="flex flex-col gap-3">
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
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
