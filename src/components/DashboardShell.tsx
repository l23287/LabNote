import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { ProfilePanel } from "./ProfilePanel";
import { MobileTopBar } from "./MobileTopBar";

export function DashboardShell({
  children,
  panel = true,
}: {
  children: ReactNode;
  panel?: boolean;
}) {
  return (
    <div className="min-h-dvh max-w-[1440px] mx-auto p-4 lg:p-5 flex gap-5">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <MobileTopBar />
        {children}
      </main>
      {panel && <ProfilePanel />}
    </div>
  );
}
