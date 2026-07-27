import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { PrimaryButton } from "../components/PrimaryButton";

export function Onboarding() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <p className="text-white/80 text-sm font-medium mb-1 drop-shadow">Willkommen bei LabNote</p>
      <h1 className="font-display text-3xl font-extrabold leading-tight mb-3 text-white drop-shadow-md">
        Los geht's mit
        <br />
        deinem <span className="text-sun">Experiment.</span>
      </h1>
      <p className="text-white/90 leading-relaxed mb-8 drop-shadow">
        Erstelle einen Account, um Schritt für Schritt durch dein Versuchsprotokoll geführt zu
        werden – mitten in der Natur.
      </p>

      <div className="flex flex-col gap-3">
        <PrimaryButton onClick={() => navigate("/registrieren")}>Account erstellen</PrimaryButton>
        <button
          onClick={() => navigate("/anmelden")}
          className="h-12 text-white font-medium drop-shadow"
        >
          Ich habe schon einen Account
        </button>
      </div>
    </AuthLayout>
  );
}
