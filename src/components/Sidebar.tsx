import { NavLink, useNavigate } from "react-router-dom";
import { CalendarDays, FlaskConical, LayoutGrid, LogOut, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { LabScene } from "./LabScene";

const NAV_ITEMS = [
  { to: "/home", label: "Übersicht", icon: LayoutGrid },
  { to: "/protokolle", label: "Meine Protokolle", icon: FlaskConical },
  { to: "/kalender", label: "Kalender", icon: CalendarDays },
  { to: "/profil", label: "Profil", icon: UserRound },
];

export function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-1 mb-8">
        <div className="w-9 h-9 rounded-xl bg-primary-soft flex items-center justify-center shrink-0">
          <FlaskConical size={18} className="text-primary" />
        </div>
        <span className="font-display font-extrabold text-lg lg:hidden xl:inline">LabNote</span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                isActive ? "bg-primary-soft text-primary-dark" : "text-muted hover:bg-bg-soft"
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            <span className="lg:hidden xl:inline">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3 pt-6">
        <NavLink
          to="/neu"
          onClick={onNavigate}
          className="relative overflow-hidden rounded-2xl p-4 text-white lg:hidden xl:block"
          style={{ background: "linear-gradient(160deg, var(--color-primary), var(--color-primary-dark))" }}
        >
          <LabScene className="absolute inset-0 w-full h-full opacity-40" />
          <p className="relative font-display font-bold text-sm leading-snug mb-3">
            Bereit für dein nächstes Experiment?
          </p>
          <span className="relative inline-flex items-center justify-center w-full h-9 rounded-full bg-white text-primary-dark text-sm font-semibold">
            Jetzt starten
          </span>
        </NavLink>

        <NavLink
          to="/neu"
          onClick={onNavigate}
          className="hidden lg:flex xl:hidden w-11 h-11 mx-auto rounded-full items-center justify-center text-white"
          style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))" }}
          aria-label="Neues Protokoll"
        >
          <FlaskConical size={18} />
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-danger hover:bg-bg-soft transition"
        >
          <LogOut size={18} className="shrink-0" />
          <span className="lg:hidden xl:inline">Abmelden</span>
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-20 xl:w-64 shrink-0 bg-surface rounded-3xl border border-border p-5 sticky top-5 h-[calc(100dvh-2.5rem)]">
      <NavContent />
    </aside>
  );
}
