import type { ReactNode } from "react";
import { FlaskConical } from "lucide-react";
import { LabScene } from "./LabScene";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex">
      <div
        className="hidden lg:flex flex-1 flex-col justify-between overflow-hidden p-12"
        style={{ background: "linear-gradient(160deg, var(--color-primary), var(--color-primary-dark))" }}
      >
        <div className="text-white max-w-md">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
              <FlaskConical size={20} />
            </div>
            <span className="font-display font-extrabold text-lg tracking-wide">LabNote</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold leading-tight mb-3">
            Dein Experiment,
            <br />
            Schritt für Schritt.
          </h1>
          <p className="text-white/80 leading-relaxed">
            LabNote führt dich durch dein Versuchsprotokoll für den Science-Unterricht – von der
            Frage bis zum Ergebnis.
          </p>
        </div>

        <div className="h-64 -mx-12 -mb-12">
          <LabScene className="w-full h-full" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-primary-soft flex items-center justify-center">
              <FlaskConical size={16} className="text-primary" />
            </div>
            <span className="font-display font-extrabold text-lg">LabNote</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
