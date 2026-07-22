// ============================================================================
// Local "database" layer — a lightweight key/value store built on
// localStorage, mimicking Hive "boxes". Fully offline, no network calls.
// ============================================================================

const NAMESPACE = "amoledfit";

function key(box: string): string {
  return `${NAMESPACE}:${box}`;
}

export function readBox<T>(box: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key(box));
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeBox<T>(box: string, value: T): void {
  try {
    localStorage.setItem(key(box), JSON.stringify(value));
  } catch {
    // storage might be unavailable (private mode); fail silently, offline app
  }
}

export function clearBox(box: string): void {
  try {
    localStorage.removeItem(key(box));
  } catch {
    // ignore
  }
}

export function exportAllData(): string {
  const data: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(`${NAMESPACE}:`)) {
      try {
        data[k.replace(`${NAMESPACE}:`, "")] = JSON.parse(localStorage.getItem(k) || "null");
      } catch {
        // ignore
      }
    }
  }
  return JSON.stringify(data, null, 2);
}

export const BOX = {
  SETTINGS: "settings",
  SESSIONS: "sessions",
  CHECKLISTS: "checklists",
  ACTIVE_SESSION: "active_session",
} as const;
