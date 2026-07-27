import type { ReactNode } from "react";
import { NatureBackground } from "./NatureBackground";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <NatureBackground />
      <div className="tablet-shell px-5 sm:px-8 pt-8 sm:pt-10 pb-32">{children}</div>
      <BottomNav />
    </div>
  );
}
