import type { ReactNode } from "react";
import { FlaskConical } from "lucide-react";
import { NatureBackground } from "./NatureBackground";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <NatureBackground />
      <div className="flex-1 flex flex-col items-center justify-end px-6 py-10">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <FlaskConical size={16} className="text-white" />
            </div>
            <span className="font-display font-extrabold text-lg text-white drop-shadow-md">
              LabNote
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
