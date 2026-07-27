import { NavLink } from "react-router-dom";
import { CalendarDays, FlaskConical, House, Plus, UserRound } from "lucide-react";

const navItemBase =
  "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors";

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 flex justify-center px-4 pb-6 pt-2 pointer-events-none">
      <div
        className="pointer-events-auto flex items-center gap-1 h-16 px-3 rounded-full backdrop-blur-xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.35)]"
        style={{ background: "rgba(20, 26, 22, 0.65)" }}
      >
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `${navItemBase} w-14 ${isActive ? "text-sun" : "text-white/60"}`
          }
        >
          <House size={20} strokeWidth={2.2} />
        </NavLink>
        <NavLink
          to="/protokolle"
          className={({ isActive }) =>
            `${navItemBase} w-14 ${isActive ? "text-sun" : "text-white/60"}`
          }
        >
          <FlaskConical size={20} strokeWidth={2.2} />
        </NavLink>

        <NavLink
          to="/neu"
          className="w-14 h-14 mx-1 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))",
          }}
        >
          <Plus size={24} className="text-white" strokeWidth={2.5} />
        </NavLink>

        <NavLink
          to="/kalender"
          className={({ isActive }) =>
            `${navItemBase} w-14 ${isActive ? "text-sun" : "text-white/60"}`
          }
        >
          <CalendarDays size={20} strokeWidth={2.2} />
        </NavLink>
        <NavLink
          to="/profil"
          className={({ isActive }) =>
            `${navItemBase} w-14 ${isActive ? "text-sun" : "text-white/60"}`
          }
        >
          <UserRound size={20} strokeWidth={2.2} />
        </NavLink>
      </div>
    </nav>
  );
}
