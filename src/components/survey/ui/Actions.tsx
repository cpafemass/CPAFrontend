import type { ReactNode } from "react";

export function Actions({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8 grid gap-3 border-t border-slate-100 pt-6 sm:grid-cols-2 sm:gap-4">
      {children}
    </div>
  );
}
