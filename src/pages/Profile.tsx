import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, FlaskConical, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getProtocolsForUser } from "../lib/storage";
import { ANIMALS, getAnimal } from "../lib/animals";

export function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const protocols = useMemo(
    () => (user ? getProtocolsForUser(user.id) : []),
    [user],
  );
  const [teacherEmail, setTeacherEmail] = useState(user?.teacherEmail ?? "");
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const animal = getAnimal(user.avatar);

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleTeacherEmailSave() {
    updateUser({ teacherEmail: teacherEmail.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="flex flex-col gap-6 pb-8 max-w-4xl">
      <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-white drop-shadow-md">
        Profil
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 items-start">
        <div className="rounded-3xl bg-surface border border-border p-6 flex flex-col items-center text-center gap-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
            style={{ background: animal.bg }}
          >
            {animal.emoji}
          </div>
          <div>
            <p className="font-display font-bold text-xl">{user.name}</p>
            <p className="text-muted text-sm">{user.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="rounded-2xl bg-bg-soft p-4 flex flex-col items-center gap-1">
              <FlaskConical size={18} className="text-primary" />
              <span className="font-display font-bold text-xl">{protocols.length}</span>
              <span className="text-muted text-[11px] text-center">Protokolle</span>
            </div>
            <div className="rounded-2xl bg-bg-soft p-4 flex flex-col items-center gap-1">
              <Sparkles size={18} className="text-sun" />
              <span className="font-display font-bold text-xl">
                {new Date(user.createdAt).toLocaleDateString("de-DE", {
                  month: "short",
                  year: "2-digit",
                })}
              </span>
              <span className="text-muted text-[11px] text-center">Dabei seit</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full h-12 rounded-2xl bg-bg-soft flex items-center justify-center gap-2 text-danger font-semibold text-sm"
          >
            <LogOut size={16} />
            Abmelden
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-3xl bg-surface border border-border p-6">
            <h2 className="font-display font-bold mb-1">Wähle dein Tier</h2>
            <p className="text-muted text-sm mb-4">
              Such dir ein Profilbild für deinen Account aus.
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {ANIMALS.map((a) => {
                const isSelected = a.id === user.avatar;
                return (
                  <button
                    key={a.id}
                    onClick={() => updateUser({ avatar: a.id })}
                    className="relative aspect-square rounded-2xl flex items-center justify-center text-2xl transition"
                    style={{
                      background: a.bg,
                      outline: isSelected ? "3px solid var(--color-primary)" : "none",
                      outlineOffset: "2px",
                    }}
                    aria-label={a.label}
                  >
                    {a.emoji}
                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl bg-surface border border-border p-6">
            <h2 className="font-display font-bold mb-1">E-Mail deiner Lehrkraft</h2>
            <p className="text-muted text-sm mb-4">
              Wird beim Einreichen eines Protokolls als Empfänger vorgeschlagen.
            </p>
            <div className="flex gap-2 max-w-sm">
              <input
                type="email"
                value={teacherEmail}
                onChange={(e) => setTeacherEmail(e.target.value)}
                placeholder="lehrer@schule.de"
                className="flex-1 h-12 rounded-2xl bg-bg-soft border border-border px-4 outline-none focus:border-primary"
              />
              <button
                onClick={handleTeacherEmailSave}
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-primary text-white font-semibold"
              >
                {saved ? <Check size={20} /> : "OK"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
