import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, FlaskConical } from "lucide-react";
import { GlowBubble } from "../components/GlowBubble";
import { WizardMock, CalendarMock } from "../components/OnboardingMocks";
import { PrimaryButton } from "../components/PrimaryButton";

interface Slide {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  visual: "wizard" | "calendar" | "bubble";
  bubbleSize: number;
  visualHeight: number;
  bubbleTop: number;
  cardTop?: number;
}

const SLIDES: Slide[] = [
  {
    eyebrow: "Geführter Wizard",
    titleLine1: "Von der Frage bis",
    titleLine2: "zum Ergebnis.",
    description:
      "Jedes Protokoll führt dich Schritt für Schritt durch Fragestellung, Materialien, Durchführung und Beobachtung.",
    visual: "wizard",
    bubbleSize: 190,
    visualHeight: 390,
    bubbleTop: 0,
    cardTop: 110,
  },
  {
    eyebrow: "Alles im Überblick",
    titleLine1: "Deine Protokolle,",
    titleLine2: "immer griffbereit.",
    description:
      "Behalte alle Experimente im Blick – als Liste oder im Kalender, sortiert nach Klasse und Datum.",
    visual: "calendar",
    bubbleSize: 190,
    visualHeight: 390,
    bubbleTop: 0,
    cardTop: 110,
  },
  {
    eyebrow: "Teilen leicht gemacht",
    titleLine1: "Ein Klick",
    titleLine2: "und teilen.",
    description:
      "Exportiere dein fertiges Protokoll als PDF und teile es direkt mit deiner Lehrkraft und mit deinen Freunden.",
    visual: "bubble",
    bubbleSize: 250,
    visualHeight: 260,
    bubbleTop: 0,
  },
];

export function Onboarding() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  function handleNext() {
    if (isLast) {
      navigate("/anmelden");
      return;
    }
    setIndex((i) => i + 1);
  }

  return (
    <div className="relative min-h-dvh flex flex-col overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 130% 55% at 50% 20%, rgba(74,222,128,0.28), transparent 60%), var(--color-bg)",
        }}
      />

      <div className="relative flex flex-col flex-1 px-6 pt-6">
        <div className="flex items-center justify-between h-10 mb-3">
          {index > 0 ? (
            <button
              onClick={() => setIndex((i) => i - 1)}
              className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center"
              aria-label="Zurück"
            >
              <ChevronLeft size={20} />
            </button>
          ) : (
            <span />
          )}
          <button
            onClick={() => navigate("/anmelden")}
            className="text-sm text-muted font-medium"
          >
            Überspringen
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-surface border border-border flex items-center justify-center">
            <FlaskConical size={18} className="text-primary" />
          </div>
          <span className="font-display font-bold text-lg tracking-wide">LabNote</span>
        </div>

        <div className="relative mb-4" style={{ height: slide.visualHeight }}>
          {slide.visual === "bubble" ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <GlowBubble size={slide.bubbleSize} />
            </div>
          ) : (
            <>
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{ top: slide.bubbleTop }}
              >
                <GlowBubble size={slide.bubbleSize} />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2" style={{ top: slide.cardTop }}>
                {slide.visual === "wizard" ? <WizardMock /> : <CalendarMock />}
              </div>
            </>
          )}
        </div>

        <div className="pb-2">
          <p className="text-sm text-muted font-medium mb-2">{slide.eyebrow}</p>
          <h1 className="font-display text-3xl font-extrabold leading-tight mb-3">
            {slide.titleLine1}
            <br />
            <span className="text-primary">{slide.titleLine2}</span>
          </h1>
          <p className="text-muted leading-relaxed mb-5">{slide.description}</p>
        </div>
      </div>

      <div className="relative px-6 pb-6 flex flex-col items-center gap-5">
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all"
              style={{
                width: i === index ? 24 : 8,
                background: i === index ? "var(--color-primary)" : "var(--color-surface-2)",
              }}
            />
          ))}
        </div>
        <PrimaryButton onClick={handleNext}>Weiter</PrimaryButton>
      </div>
    </div>
  );
}
