import type { ReactNode } from "react";

export function DemoShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh">
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-linear-to-br from-[rgb(8,71,47)] via-[rgb(4,53,34)] to-[rgb(2,25,15)]"
        aria-hidden
      />
      <div className="relative z-20 flex min-h-dvh flex-col">{children}</div>
    </div>
  );
}
