// ============================================================================
// Builds the flat, ordered list of steps (exercise sets + rest periods) that
// the Workout Player walks through, driven entirely by the extracted
// database (workoutPairs) and the user's configurable rest durations.
// ============================================================================

import { warmupItems, workoutPairs } from "../data/workoutData";
import type { WorkoutStep } from "../models/types";

export function buildWorkoutSteps(restBetweenSetsSec: number, restAfterPairSec: number): WorkoutStep[] {
  const steps: WorkoutStep[] = [];

  // Warm-up block
  warmupItems.forEach((item, idx) => {
    steps.push({
      stepId: `warmup-${item.id}`,
      type: "exercise",
      pairLabel: "Warm-Up",
      setNumber: 1,
      totalSets: 1,
      exercise: {
        id: item.id,
        name: item.name,
        description: item.description,
        tips: "Move gently and control your breathing.",
        unit: item.unit,
        targetLabel: item.targetLabel,
        durationSec: item.durationSec,
        reps: item.reps,
        illustration: item.illustration,
        videoLinks: item.videoLinks,
      },
    });
    if (idx < warmupItems.length - 1) {
      steps.push({
        stepId: `warmup-rest-${idx}`,
        type: "rest",
        pairLabel: "Warm-Up",
        restSec: 15,
        restLabel: "Quick breather",
      });
    }
  });

  steps.push({
    stepId: "warmup-to-strength-rest",
    type: "rest",
    pairLabel: "Transition",
    restSec: 30,
    restLabel: "Get ready for the strength routine",
  });

  workoutPairs.forEach((pair, pairIdx) => {
    for (let set = 1; set <= pair.sets; set++) {
      pair.exercises.forEach((exercise, exIdx) => {
        steps.push({
          stepId: `${pair.id}-set${set}-ex${exIdx}`,
          type: "exercise",
          pairLabel: pair.label,
          exercise,
          setNumber: set,
          totalSets: pair.sets,
        });

        const isLastExerciseInSet = exIdx === pair.exercises.length - 1;
        const isLastSet = set === pair.sets;
        const isLastPair = pairIdx === workoutPairs.length - 1;

        if (!(isLastExerciseInSet && isLastSet && isLastPair)) {
          const restSec =
            isLastExerciseInSet && !isLastSet
              ? restAfterPairSec
              : isLastExerciseInSet && isLastSet && !isLastPair
              ? restAfterPairSec
              : restBetweenSetsSec;

          steps.push({
            stepId: `${pair.id}-rest-set${set}-ex${exIdx}`,
            type: "rest",
            pairLabel: pair.label,
            restSec: pair.id === "core-triplet" ? pair.restBetweenExercisesSec : restSec,
            restLabel: isLastExerciseInSet ? `Rest before next set` : `Rest, then Exercise B`,
          });
        }
      });
    }
  });

  return steps;
}

export function estimateCalories(totalActiveSeconds: number): number {
  // Bodyweight circuit training burns roughly 5-6 kcal per active minute
  // for a light-frame athlete; we use 5.5 kcal/min as a reasonable estimate.
  return Math.round((totalActiveSeconds / 60) * 5.5);
}

export function estimateTotalWorkoutSeconds(restBetweenSetsSec: number, restAfterPairSec: number): number {
  const steps = buildWorkoutSteps(restBetweenSetsSec, restAfterPairSec);
  let total = 0;
  steps.forEach((step) => {
    if (step.type === "exercise" && step.exercise) {
      total += step.exercise.durationSec ?? (step.exercise.reps ?? 8) * 3.5; // ~3.5s per rep
    } else if (step.type === "rest") {
      total += step.restSec ?? 0;
    }
  });
  return Math.round(total);
}

export const TOTAL_EXERCISE_STEPS = buildWorkoutSteps(90, 90).filter((s) => s.type === "exercise").length;
