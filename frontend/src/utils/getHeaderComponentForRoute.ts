import { routeConfig } from "../routes/routeConfig";
import type { PageTitleEntry } from "../routes/routeConfig";

/**
 * Gibt die passende Header-Komponente für einen Pfad zurück, falls vorhanden.
 * Unterstützt auch verschachtelte Children (z.B. Demos).
 */
export function getHeaderComponentForRoute(pathname: string): React.FC | undefined {
  function findEntry(path: string, entries: Record<string, PageTitleEntry>): PageTitleEntry | undefined {
    for (const [key, entry] of Object.entries(entries)) {
      if (key === path) return entry;
      if (entry.children) {
        const child = findEntry(path, entry.children);
        if (child) return child;
      }
    }
    return undefined;
  }
  const entry = findEntry(pathname, routeConfig);
  return entry?.headerComponent;
} 