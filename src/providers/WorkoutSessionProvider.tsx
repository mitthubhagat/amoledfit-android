import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CompletedSession, WorkoutStep } from "../models/types";
import { buildWorkoutSteps, estimateCalories } from "../services/workoutSessionService";
import { SoundService } from "../services/soundService";
import { VibrationService } from "../services/vibrationService";
import { useSettings } from "./SettingsProvider";
import { useProgress } from "./ProgressProvider";
import { BOX, readBox, writeBox, clearBox } from "../database/storage";
import { todayISO } from "../services/streakService";

export type SessionStatus = "idle" | "running" | "paused" | "finished";

interface PersistedSession {
  currentIndex: number;
  status: SessionStatus;
  totalElapsedSec: number;
  completedCount: number;
  timeLeft: number;
  repStopwatch: number;
}

interface WorkoutSessionContextValue {
  steps: WorkoutStep[];
  currentIndex: number;
  currentStep: WorkoutStep | null;
  nextStep: WorkoutStep | null;
  status: SessionStatus;
  timeLeft: number;
  repStopwatch: number;
  totalElapsedSec: number;
  completedCount: number;
  totalExerciseSteps: number;
  hasActiveSession: boolean;
  lastSummary: CompletedSession | null;
  startWorkout: () => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  goNext: () => void;
  goPrevious: () => void;
  skipRest: () => void;
  finishWorkout: () => void;
  resetSession: () => void;
}

const WorkoutSessionContext = createContext<WorkoutSessionContextValue | null>(null);

function timeForStep(step: WorkoutStep | undefined): { timeLeft: number; repStopwatch: number } {
  if (!step) return { timeLeft: 0, repStopwatch: 0 };
  if (step.type === "rest") return { timeLeft: step.restSec ?? 30, repStopwatch: 0 };
  if (step.exercise?.unit === "time") return { timeLeft: step.exercise.durationSec ?? 30, repStopwatch: 0 };
  return { timeLeft: 0, repStopwatch: 0 };
}

export function WorkoutSessionProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  const { recordSession, updateTodaysChecklist } = useProgress();

  const steps = useMemo(
    () => buildWorkoutSteps(settings.restBetweenSetsSec, settings.restAfterPairSec),
    [settings.restBetweenSetsSec, settings.restAfterPairSec]
  );
  const totalExerciseSteps = useMemo(() => steps.filter((s) => s.type === "exercise").length, [steps]);

  const persisted = readBox<PersistedSession | null>(BOX.ACTIVE_SESSION, null);

  const [currentIndex, setCurrentIndex] = useState(persisted?.currentIndex ?? 0);
  const [status, setStatus] = useState<SessionStatus>(
    persisted && persisted.status !== "finished" ? "paused" : "idle"
  );
  const [timeLeft, setTimeLeft] = useState(persisted?.timeLeft ?? timeForStep(steps[0]).timeLeft);
  const [repStopwatch, setRepStopwatch] = useState(persisted?.repStopwatch ?? 0);
  const [totalElapsedSec, setTotalElapsedSec] = useState(persisted?.totalElapsedSec ?? 0);
  const [completedCount, setCompletedCount] = useState(persisted?.completedCount ?? 0);
  const [lastSummary, setLastSummary] = useState<CompletedSession | null>(null);

  const soundOnRef = useRef(settings.soundOn);
  const vibrationOnRef = useRef(settings.vibrationOn);
  soundOnRef.current = settings.soundOn;
  vibrationOnRef.current = settings.vibrationOn;

  // Guard: prevents a stale interval tick from calling goNext() after the step was already advanced.
  const stepDoneRef = useRef(false);

  // Persist active session state
  useEffect(() => {
    if (status === "idle") {
      clearBox(BOX.ACTIVE_SESSION);
      return;
    }
    writeBox<PersistedSession>(BOX.ACTIVE_SESSION, {
      currentIndex,
      status,
      totalElapsedSec,
      completedCount,
      timeLeft,
      repStopwatch,
    });
  }, [currentIndex, status, totalElapsedSec, completedCount, timeLeft, repStopwatch]);

  const startWorkout = useCallback(() => {
    setCurrentIndex(0);
    const { timeLeft: tl, repStopwatch: rs } = timeForStep(steps[0]);
    setTimeLeft(tl);
    setRepStopwatch(rs);
    setTotalElapsedSec(0);
    setCompletedCount(0);
    setLastSummary(null);
    stepDoneRef.current = false;
    setStatus("running");
  }, [steps]);

  const pauseWorkout = useCallback(() => {
    setStatus("paused");
  }, []);

  const resumeWorkout = useCallback(() => {
    setStatus("running");
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIdx = prev + 1;
      if (nextIdx >= steps.length) {
        return prev; // handled by finishWorkout
      }
      const nextStep = steps[nextIdx];
      const { timeLeft: tl, repStopwatch: rs } = timeForStep(nextStep);
      setTimeLeft(tl);
      setRepStopwatch(rs);
      stepDoneRef.current = false;

      if (nextStep.type === "exercise") {
        setCompletedCount((c) => c + 1);
        if (soundOnRef.current) SoundService.beep();
        if (vibrationOnRef.current) VibrationService.light().catch(() => {});
      } else {
        // entering rest
        if (soundOnRef.current) SoundService.rest();
        if (vibrationOnRef.current) VibrationService.medium().catch(() => {});
      }
      return nextIdx;
    });
  }, [steps]);

  const goPrevious = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIdx = Math.max(0, prev - 1);
      const prevStep = steps[nextIdx];
      const { timeLeft: tl, repStopwatch: rs } = timeForStep(prevStep);
      setTimeLeft(tl);
      setRepStopwatch(rs);
      stepDoneRef.current = false;
      return nextIdx;
    });
  }, [steps]);

  const skipRest = useCallback(() => {
    goNext();
  }, [goNext]);

  const finishWorkout = useCallback(() => {
    setStatus("finished");
    const exercisesCompleted = completedCount;
    const durationSec = totalElapsedSec;
    const caloriesEstimate = estimateCalories(durationSec);
    const completionPct = Math.round((exercisesCompleted / Math.max(1, totalExerciseSteps)) * 100);

    const session: CompletedSession = {
      id: `${Date.now()}`,
      dateISO: todayISO(),
      timestamp: Date.now(),
      durationSec,
      exercisesCompleted,
      totalExercises: totalExerciseSteps,
      caloriesEstimate,
      completionPct,
    };
    setLastSummary(session);
    recordSession(session);
    updateTodaysChecklist({ workout: true });
    clearBox(BOX.ACTIVE_SESSION);

    if (soundOnRef.current) SoundService.success();
    if (vibrationOnRef.current) VibrationService.success().catch(() => {});
  }, [completedCount, totalElapsedSec, totalExerciseSteps, recordSession, updateTodaysChecklist]);

  const resetSession = useCallback(() => {
    setCurrentIndex(0);
    setStatus("idle");
    setTimeLeft(timeForStep(steps[0]).timeLeft);
    setRepStopwatch(0);
    setTotalElapsedSec(0);
    setCompletedCount(0);
    setLastSummary(null);
    stepDoneRef.current = false;
    clearBox(BOX.ACTIVE_SESSION);
  }, [steps]);

  // Tick timer
  useEffect(() => {
    if (status !== "running") return;
    stepDoneRef.current = false;

    const step = steps[currentIndex];
    const isTimeBased =
      step?.type === "rest" || step?.exercise?.unit === "time";

    const interval = setInterval(() => {
      setTotalElapsedSec((prev) => prev + 1);

      if (isTimeBased) {
        setTimeLeft((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            if (!stepDoneRef.current) {
              // Last 3 secs countdown warning
              if (soundOnRef.current && prev <= 3 && prev > 1) {
                SoundService.countdownWarning();
              }
              if (currentIndex >= steps.length - 1) {
                // Last step finished
                stepDoneRef.current = true;
                setTimeout(() => finishWorkout(), 0);
              } else {
                stepDoneRef.current = true;
                goNext();
              }
            }
            return 0;
          }
          // Countdown ticks for last 3 seconds
          if (soundOnRef.current && next <= 3) {
            SoundService.tick();
          }
          return next;
        });
      } else {
        setRepStopwatch((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, currentIndex, steps]);

  const currentStep = steps[currentIndex] ?? null;
  const nextStep = steps[currentIndex + 1] ?? null;
  const hasActiveSession = (status === "running" || status === "paused") && currentIndex < steps.length;

  const value: WorkoutSessionContextValue = {
    steps,
    currentIndex,
    currentStep,
    nextStep,
    status,
    timeLeft,
    repStopwatch,
    totalElapsedSec,
    completedCount,
    totalExerciseSteps,
    hasActiveSession,
    lastSummary,
    startWorkout,
    pauseWorkout,
    resumeWorkout,
    goNext,
    goPrevious,
    skipRest,
    finishWorkout,
    resetSession,
  };

  return <WorkoutSessionContext.Provider value={value}>{children}</WorkoutSessionContext.Provider>;
}

export function useWorkoutSession(): WorkoutSessionContextValue {
  const ctx = useContext(WorkoutSessionContext);
  if (!ctx) throw new Error("useWorkoutSession must be used within WorkoutSessionProvider");
  return ctx;
}
