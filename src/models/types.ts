// ============================================================================
// Core domain models for the offline workout app.
// This mirrors a clean-architecture "entities" layer.
// ============================================================================

export type ExerciseUnit = "reps" | "time";

export type IllustrationKey =
  | "squat"
  | "row"
  | "dip"
  | "lsit"
  | "pushup"
  | "pull"
  | "plank"
  | "reverse-plank"
  | "jumping-jack"
  | "joint-rotation"
  | "hydrate"
  | "drink";

export interface VideoLink {
  label: string;
  url: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  tips: string;
  unit: ExerciseUnit;
  /** Human readable target, e.g. "5 to 8 reps" or "30 to 45 secs" */
  targetLabel: string;
  /** Numeric duration used to drive the timer (seconds) when unit === 'time' */
  durationSec?: number;
  /** Numeric rep count used for calorie/duration estimation when unit === 'reps' */
  reps?: number;
  illustration: IllustrationKey;
  /** YouTube tutorial links shown as a button during the exercise */
  videoLinks?: VideoLink[];
}

export interface WorkoutPair {
  id: string;
  label: string; // "Pair 1", "Core Triplet"
  sets: number;
  exercises: Exercise[]; // 2 exercises performed alternately (A, B)
  restBetweenExercisesSec: number;
  restAfterPairSec: number;
}

export interface WarmupItem {
  id: string;
  name: string;
  description: string;
  unit: ExerciseUnit;
  durationSec?: number;
  reps?: number;
  targetLabel: string;
  illustration: IllustrationKey;
  videoLinks?: VideoLink[];
}

export interface TimelinePhase {
  id: string;
  time: string; // "4:00 AM"
  title: string;
  durationLabel: string; // "10 min"
  description: string;
  icon: IllustrationKey;
}

export interface WorkoutStep {
  stepId: string;
  type: "exercise" | "rest";
  pairLabel: string;
  exercise?: Exercise;
  setNumber?: number;
  totalSets?: number;
  restSec?: number;
  restLabel?: string;
}

export interface UserProfile {
  age: number;
  heightCm: number;
  weightKg: number;
  goal: string;
  scheduleDays: number[]; // 0 = Sunday ... 6 = Saturday
  scheduleLabel: string;
  weeklyBudgetInr: number;
}

export interface GroceryItem {
  id: string;
  name: string;
  priceInr: number;
  proteinNote: string;
  usageNote: string;
}

export interface MealSuggestion {
  id: string;
  time: string;
  title: string;
  detail: string;
  proteinG?: number;
}

export interface NutritionData {
  dailyProteinTargetG: number;
  proteinFromMealsG: number;
  proteinFromGroceriesG: number;
  weeklyBudgetInr: number;
  groceryList: GroceryItem[];
  mealSuggestions: MealSuggestion[];
  tip: string;
}

export interface AppSettings {
  darkMode: boolean;
  reminderEnabled: boolean;
  reminderTime: string; // "04:00"
  restBetweenSetsSec: number;
  restAfterPairSec: number;
  soundOn: boolean;
  vibrationOn: boolean;
}

export interface CompletedSession {
  id: string;
  dateISO: string; // yyyy-mm-dd
  timestamp: number;
  durationSec: number;
  exercisesCompleted: number;
  totalExercises: number;
  caloriesEstimate: number;
  completionPct: number;
}

export interface DailyChecklist {
  dateISO: string;
  hydrate: boolean;
  warmup: boolean;
  workout: boolean;
  postWorkoutDrink: boolean;
  proteinTarget: boolean;
  waterGlasses: number;
}
