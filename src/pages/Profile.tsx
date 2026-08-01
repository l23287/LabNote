import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Download, FlaskConical, LogOut, Sparkles, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getProtocolsForUser } from "../lib/storage";
import { ANIMALS, getAnimal } from "../lib/animals";

export function Profile() {
  const { user, logout, updateUser, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const protocols = useMemo(
    () => (user ? getProtocolsForUser(user.id) : []),
    [user],
  );
  const [teacherEmail, setTeacherEmail] = useState(user?.teacherEmail ?? "");
  const [teacherEmailSaved, setTeacherEmailSaved] = useState(false);
  const [schoolClass, setSchoolClass] = useState(user?.schoolClass ?? "");
  const [schoolClassSaved, setSchoolClassSaved] = useState(false);

  if (!user) return null;

  const animal = getAnimal(user.avatar);

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleExportData() {
    const data = {
      profil: { name: user!.name, email: user!.email, schoolClass: user!.schoolClass, teacherEmail: user!.teacherEmail, createdAt: user!.createdAt },
      protokolle: protocols,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "labnote-meine-daten.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Möchtest du deinen Account und alle deine Protokolle wirklich unwiderruflich löschen?",
    );
    if (!confirmed) return;
    deleteAccount();
    navigate("/");
  }

  function handleTeacherEmailSave() {
    updateUser({ teacherEmail: teacherEmail.trim() });
    setTeacherEmailSaved(true);
    setTimeout(() => setTeacherEmailSaved(false), 1500);
  }

  function handleSchoolClassSave() {
    updateUser({ schoolClass: schoolClass.trim() });
    setSchoolClassSaved(true);
    setTimeout(() => setSchoolClassSaved(false), 1500);
  }

  return (
    <div className="min-h-dvh px-6 pt-8 pb-32">
      <h1 className="font-display text-2xl font-extrabold mb-6">Profil</h1>

      <div className="flex flex-col items-center text-center mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4"
          style={{ background: animal.bg }}
        >
          {animal.emoji}
        </div>
        <p className="font-display font-bold text-xl">{user.name}</p>
        <p className="text-muted text-sm">{user.email}</p>
        {user.schoolClass && (
          <span className="mt-2 text-xs font-semibold text-primary bg-primary-soft px-3 py-1 rounded-full">
            Klasse {user.schoolClass}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="rounded-3xl bg-surface border border-border p-5 flex flex-col items-center gap-2">
          <FlaskConical size={20} className="text-primary" />
          <span className="font-display font-bold text-2xl">{protocols.length}</span>
          <span className="text-muted text-xs text-center">Protokolle erstellt</span>
        </div>
        <div className="rounded-3xl bg-surface border border-border p-5 flex flex-col items-center gap-2">
          <Sparkles size={20} className="text-sun" />
          <span className="font-display font-bold text-2xl">
            {new Date(user.createdAt).toLocaleDateString("de-DE", {
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="text-muted text-xs text-center">Dabei seit</span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-display font-bold mb-1">Wähle dein Tier</h2>
        <p className="text-muted text-sm mb-4">
          Such dir ein Profilbild für deinen Account aus.
        </p>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
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

      <div className="mb-8">
        <h2 className="font-display font-bold mb-1">Deine Klasse</h2>
        <p className="text-muted text-sm mb-4">
          Wird auf deinem Protokoll und beim Einreichen angezeigt.
        </p>
        <div className="flex gap-2">
          <input
            value={schoolClass}
            onChange={(e) => setSchoolClass(e.target.value)}
            placeholder="z.B. 7b"
            className="flex-1 h-14 rounded-2xl bg-surface border border-border px-4 outline-none focus:border-primary"
          />
          <button
            onClick={handleSchoolClassSave}
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-primary text-white font-semibold"
          >
            {schoolClassSaved ? <Check size={20} /> : "OK"}
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-display font-bold mb-1">E-Mail deiner Lehrkraft</h2>
        <p className="text-muted text-sm mb-4">
          Wird beim Einreichen eines Protokolls als Empfänger vorgeschlagen.
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            value={teacherEmail}
            onChange={(e) => setTeacherEmail(e.target.value)}
            placeholder="lehrer@schule.de"
            className="flex-1 h-14 rounded-2xl bg-surface border border-border px-4 outline-none focus:border-primary"
          />
          <button
            onClick={handleTeacherEmailSave}
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-primary text-white font-semibold"
          >
            {teacherEmailSaved ? <Check size={20} /> : "OK"}
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-display font-bold mb-1">Deine Daten</h2>
        <p className="text-muted text-sm mb-4">
          Lade eine Kopie deiner Daten herunter oder lösche deinen Account unwiderruflich.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleExportData}
            className="w-full h-14 rounded-2xl bg-surface border border-border flex items-center justify-center gap-2 font-semibold"
          >
            <Download size={18} />
            Meine Daten exportieren
          </button>
          <button
            onClick={handleDeleteAccount}
            className="w-full h-14 rounded-2xl bg-surface border border-border flex items-center justify-center gap-2 text-danger font-semibold"
          >
            <Trash2 size={18} />
            Konto löschen
          </button>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full h-14 rounded-2xl bg-surface border border-border flex items-center justify-center gap-2 text-danger font-semibold"
      >
        <LogOut size={18} />
        Abmelden
      </button>
    </div>
  );
}
