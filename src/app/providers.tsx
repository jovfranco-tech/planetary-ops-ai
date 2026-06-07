import type { ReactNode } from "react";

/**
 * Application providers. Global state currently lives in the Zustand store
 * (no provider needed), so this is a clean extension point for future
 * contexts (theme, real backend client, query cache, etc.).
 */
export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
