import { NavLink } from "react-router-dom";
import { CalendarDays, FlaskConical, House, Plus, UserRound } from "lucide-react";

const navItemBase =
  "flex flex-col items-center justify-center gap-1 flex-1 h-full text-xs transition-colors";

export function BottomNav() {
  return (
    <nav className="sticky bottom-0 inset-x-0 z-30 px-4 pb-4 pt-2">
      <div className="mx-auto flex items-center h-16 rounded-[28px] bg-surface/95 backdrop-blur border border-border shadow-[0_10px_30px_rgba(38,48,31,0.15)]">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `${navItemBase} ${isActive ? "text-primary" : "text-muted"}`
          }
        >
          <House size={20} strokeWidth={2.2} />
        </NavLink>
        <NavLink
          to="/protokolle"
          className={({ isActive }) =>
            `${navItemBase} ${isActive ? "text-primary" : "text-muted"}`
          }
        >
          <FlaskConical size={20} strokeWidth={2.2} />
        </NavLink>

        <div className="flex-1 flex justify-center">
          <NavLink
            to="/neu"
            className="w-14 h-14 -mt-8 rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(255,157,66,0.45)]"
            style={{
              background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))",
            }}
          >
            <Plus size={26} className="text-white" strokeWidth={2.5} />
          </NavLink>
        </div>

        <NavLink
          to="/kalender"
          className={({ isActive }) =>
            `${navItemBase} ${isActive ? "text-primary" : "text-muted"}`
          }
        >
          <CalendarDays size={20} strokeWidth={2.2} />
        </NavLink>
        <NavLink
          to="/profil"
          className={({ isActive }) =>
            `${navItemBase} ${isActive ? "text-primary" : "text-muted"}`
          }
        >
          <UserRound size={20} strokeWidth={2.2} />
        </NavLink>
      </div>
    </nav>
  );
}
