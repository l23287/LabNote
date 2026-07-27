import { useState } from "react";
import { FlaskConical, Menu, X } from "lucide-react";
import { NavContent } from "./Sidebar";

export function MobileTopBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex lg:hidden items-center justify-between bg-surface rounded-2xl border border-border px-4 h-14 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center">
            <FlaskConical size={16} className="text-primary" />
          </div>
          <span className="font-display font-extrabold">LabNote</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="w-9 h-9 rounded-full bg-bg-soft flex items-center justify-center"
          aria-label="Menü öffnen"
        >
          <Menu size={18} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-surface p-5 flex flex-col">
            <button
              onClick={() => setOpen(false)}
              className="w-9 h-9 rounded-full bg-bg-soft flex items-center justify-center self-end mb-4"
              aria-label="Menü schließen"
            >
              <X size={18} />
            </button>
            <NavContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
