import type { CompletedSession } from "../models/types";
import { userProfile } from "../data/workoutData";

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function isScheduledDay(date: Date): boolean {
  return userProfile.scheduleDays.includes(date.getDay());
}

/** Consecutive count of scheduled days completed, walking backwards from today. */
export function computeCurrentStreak(sessions: CompletedSession[]): number {
  const completedDates = new Set(sessions.map((s) => s.dateISO));
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  // walk backwards through scheduled days only
  for (let guard = 0; guard < 400; guard++) {
    if (isScheduledDay(cursor)) {
      const key = toDateKey(cursor);
      if (completedDates.has(key)) {
        streak++;
      } else if (key === toDateKey(new Date())) {
        // today not done yet — don't break the streak, just skip
      } else {
        break;
      }
    }
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function computeWeeklyProgress(sessions: CompletedSession[]): { done: number; target: number } {
  const now = new Date();
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  const diff = (day + 6) % 7; // days since Monday
  startOfWeek.setDate(startOfWeek.getDate() - diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const doneDates = new Set(
    sessions
      .filter((s) => new Date(s.timestamp) >= startOfWeek)
      .map((s) => s.dateISO)
  );

  return { done: doneDates.size, target: userProfile.scheduleDays.length };
}

export function computeMonthlyStats(sessions: CompletedSession[], month: number, year: number) {
  const inMonth = sessions.filter((s) => {
    const d = new Date(s.timestamp);
    return d.getMonth() === month && d.getFullYear() === year;
  });
  const totalSeconds = inMonth.reduce((sum, s) => sum + s.durationSec, 0);
  return {
    workouts: inMonth.length,
    totalSeconds,
    dates: new Set(inMonth.map((s) => s.dateISO)),
  };
}

export function totalStats(sessions: CompletedSession[]) {
  const totalSeconds = sessions.reduce((sum, s) => sum + s.durationSec, 0);
  const totalCalories = sessions.reduce((sum, s) => sum + s.caloriesEstimate, 0);
  return {
    totalWorkouts: sessions.length,
    totalSeconds,
    totalCalories,
    avgCompletion:
      sessions.length === 0
        ? 0
        : Math.round(sessions.reduce((sum, s) => sum + s.completionPct, 0) / sessions.length),
  };
}

export function todayISO(): string {
  return toDateKey(new Date());
}
