import { createContext, useContext, useState, type ReactNode } from "react";
import type { CompletedSession, DailyChecklist } from "../models/types";
import {
  getSessions,
  addSession,
  clearAllProgress,
  getChecklistForDate,
  saveChecklistForDate,
} from "../database/progressDB";
import { todayISO } from "../services/streakService";

interface ProgressContextValue {
  sessions: CompletedSession[];
  recordSession: (session: CompletedSession) => void;
  resetProgress: () => void;
  todaysChecklist: DailyChecklist;
  updateTodaysChecklist: (patch: Partial<DailyChecklist>) => void;
  refreshChecklist: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<CompletedSession[]>(() => getSessions());
  const [todaysChecklist, setTodaysChecklist] = useState<DailyChecklist>(() =>
    getChecklistForDate(todayISO())
  );

  const recordSession = (session: CompletedSession) => {
    addSession(session);
    setSessions(getSessions());
  };

  const resetProgress = () => {
    clearAllProgress();
    setSessions([]);
    setTodaysChecklist(getChecklistForDate(todayISO()));
  };

  const updateTodaysChecklist = (patch: Partial<DailyChecklist>) => {
    setTodaysChecklist((prev) => {
      const next = { ...prev, ...patch };
      saveChecklistForDate(next);
      return next;
    });
  };

  const refreshChecklist = () => setTodaysChecklist(getChecklistForDate(todayISO()));

  return (
    <ProgressContext.Provider
      value={{ sessions, recordSession, resetProgress, todaysChecklist, updateTodaysChecklist, refreshChecklist }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
