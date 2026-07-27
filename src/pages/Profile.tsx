import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FlaskConical, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getProtocolsForUser } from "../lib/storage";

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const protocols = useMemo(
    () => (user ? getProtocolsForUser(user.id) : []),
    [user],
  );

  if (!user) return null;

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-dvh px-6 pt-8 pb-32">
      <h1 className="font-display text-2xl font-extrabold mb-6">Profil</h1>

      <div className="flex flex-col items-center text-center mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center font-display font-bold text-3xl text-white mb-4"
          style={{ background: user.avatarColor }}
        >
          {user.name[0]?.toUpperCase()}
        </div>
        <p className="font-display font-bold text-xl">{user.name}</p>
        <p className="text-muted text-sm">{user.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="rounded-3xl bg-surface border border-border p-5 flex flex-col items-center gap-2">
          <FlaskConical size={20} className="text-violet" />
          <span className="font-display font-bold text-2xl">{protocols.length}</span>
          <span className="text-muted text-xs text-center">Protokolle erstellt</span>
        </div>
        <div className="rounded-3xl bg-surface border border-border p-5 flex flex-col items-center gap-2">
          <Sparkles size={20} className="text-amber" />
          <span className="font-display font-bold text-2xl">
            {new Date(user.createdAt).toLocaleDateString("de-DE", {
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="text-muted text-xs text-center">Dabei seit</span>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full h-14 rounded-2xl bg-surface border border-border flex items-center justify-center gap-2 text-pink font-semibold"
      >
        <LogOut size={18} />
        Abmelden
      </button>
    </div>
  );
}
