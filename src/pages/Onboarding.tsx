import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { PrimaryButton } from "../components/PrimaryButton";

export function Onboarding() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <p className="text-muted text-sm font-medium mb-1">Willkommen bei LabNote</p>
      <h1 className="font-display text-3xl font-extrabold leading-tight mb-3">
        Los geht's mit
        <br />
        deinem <span className="text-primary">Experiment.</span>
      </h1>
      <p className="text-muted leading-relaxed mb-10">
        Erstelle einen Account, um Schritt für Schritt durch dein Versuchsprotokoll geführt zu
        werden.
      </p>

      <div className="flex flex-col gap-3">
        <PrimaryButton onClick={() => navigate("/registrieren")}>Account erstellen</PrimaryButton>
        <button onClick={() => navigate("/anmelden")} className="h-12 text-muted font-medium">
          Ich habe schon einen Account
        </button>
      </div>
    </AuthLayout>
  );
}
