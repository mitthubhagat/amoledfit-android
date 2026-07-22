import type { CompletedSession, DailyChecklist } from "../models/types";
import { BOX, readBox, writeBox } from "./storage";

export function getSessions(): CompletedSession[] {
  return readBox<CompletedSession[]>(BOX.SESSIONS, []);
}

export function addSession(session: CompletedSession): void {
  const sessions = getSessions();
  sessions.push(session);
  writeBox(BOX.SESSIONS, sessions);
}

export function clearSessions(): void {
  writeBox(BOX.SESSIONS, []);
}

export function getChecklists(): Record<string, DailyChecklist> {
  return readBox<Record<string, DailyChecklist>>(BOX.CHECKLISTS, {});
}

export function getChecklistForDate(dateISO: string): DailyChecklist {
  const all = getChecklists();
  return (
    all[dateISO] || {
      dateISO,
      hydrate: false,
      warmup: false,
      workout: false,
      postWorkoutDrink: false,
      proteinTarget: false,
      waterGlasses: 0,
    }
  );
}

export function saveChecklistForDate(checklist: DailyChecklist): void {
  const all = getChecklists();
  all[checklist.dateISO] = checklist;
  writeBox(BOX.CHECKLISTS, all);
}

export function clearAllProgress(): void {
  writeBox(BOX.SESSIONS, []);
  writeBox(BOX.CHECKLISTS, {});
}
