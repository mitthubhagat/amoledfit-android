// ============================================================================
// PRIMARY DATABASE — Extracted directly from the user's PDF screenshot
// "Bodyweight Fitness & Nutrition — Customized 4:00 AM Routine"
// This is the single source of truth for the app. Nothing here is a dummy
// placeholder — every value below was transcribed from the source document.
// ============================================================================

import type {
  Exercise,
  WorkoutPair,
  WarmupItem,
  TimelinePhase,
  UserProfile,
  NutritionData,
} from "../models/types";

export const userProfile: UserProfile = {
  age: 19,
  heightCm: 166,
  weightKg: 46,
  goal:
    "Working a demanding 9 AM – 6 PM job as a helper requires a routine that is time-efficient, energy-boosting, and builds functional strength. This plan is completed in the early morning with zero gym equipment and fueled by a highly budget-friendly vegetarian diet (₹150/week).",
  scheduleDays: [1, 3, 5], // Monday, Wednesday, Friday
  scheduleLabel: "3 Days a week (Monday, Wednesday, Friday). Rest on the other days.",
  weeklyBudgetInr: 150,
};

export const timeline: TimelinePhase[] = [
  {
    id: "wake",
    time: "4:00 AM",
    title: "Wake & Hydrate",
    durationLabel: "10 min",
    description:
      "Drink a glass of warm water and eat 1 banana or 2 dates. This provides fast-digesting carbohydrates for immediate workout energy without making your stomach feel heavy.",
    icon: "hydrate",
  },
  {
    id: "warmup",
    time: "4:10 AM",
    title: "Quick Warm-Up",
    durationLabel: "7 min",
    description:
      "Perform light joint rotations (wrists, shoulders, neck, hips), 10 jumping jacks, and 5 very slow assisted squats to prepare your joints and get rid of morning stiffness.",
    icon: "joint-rotation",
  },
  {
    id: "strength",
    time: "4:17 AM",
    title: "The Strength Routine",
    durationLabel: "40-45 min",
    description:
      'Follow the workout chart below. Perform exercises in "Pairs" (Do Set 1 of Exercise A, rest 90s, do Set 1 of Exercise B, rest 90s, and repeat for 3 sets before moving to the next pair).',
    icon: "squat",
  },
  {
    id: "post-workout",
    time: "5:00 AM",
    title: "Post-Workout Drink",
    durationLabel: "5 min",
    description:
      "Drink your Sattu Sharbat to kickstart muscle recovery before getting ready to leave for your 9 AM shift.",
    icon: "drink",
  },
];

export const warmupItems: WarmupItem[] = [
  {
    id: "warmup-joint-rotations",
    name: "Joint Rotations",
    description: "Light joint rotations: wrists, shoulders, neck, hips.",
    unit: "time",
    durationSec: 60,
    targetLabel: "60 secs",
    illustration: "joint-rotation",
  },
  {
    id: "warmup-jumping-jacks",
    name: "Jumping Jacks",
    description: "10 jumping jacks to raise your heart rate.",
    unit: "reps",
    reps: 10,
    targetLabel: "10 reps",
    illustration: "jumping-jack",
    videoLinks: [{ label: "Watch Tutorial", url: "https://youtu.be/FmnrehDxEB0?si=YmRspeuMuIblQS0a" }],
  },
  {
    id: "warmup-assisted-squats",
    name: "Slow Assisted Squats",
    description: "5 very slow assisted squats to prepare joints and reduce morning stiffness.",
    unit: "reps",
    reps: 5,
    targetLabel: "5 reps",
    illustration: "squat",
    videoLinks: [{ label: "Watch Tutorial", url: "https://youtube.com/shorts/O7n7Iu7Vph8?si=St1rI_GREl20CoTN" }],
  },
];

// ---- Strength Routine: performed in "Pairs" -------------------------------
// Do Set 1 of Exercise A, rest 90s, do Set 1 of Exercise B, rest 90s,
// repeat for 3 sets before moving to the next pair.

const bodyweightSquat: Exercise = {
  id: "ex-bodyweight-squat",
  name: "Bodyweight Squat",
  description: "A foundational lower-body movement building leg and glute strength.",
  tips: "Keep chest up, feet flat on the floor, knees aligned with toes.",
  unit: "reps",
  targetLabel: "5 to 8 reps",
  reps: 8,
  illustration: "squat",
  videoLinks: [{ label: "Watch Tutorial", url: "https://youtu.be/LLyhvvdcLB8?si=RcBpzgtrVom-E7B6" }],
};

const tableRows: Exercise = {
  id: "ex-table-rows",
  name: "Table / Bed-sheet Rows",
  description: "A bodyweight pulling exercise that builds your back and biceps with no equipment.",
  tips: "Lie under a sturdy table, grab the edge, pull chest up. Keep body stiff like a plank.",
  unit: "reps",
  targetLabel: "5 to 8 reps",
  reps: 8,
  illustration: "row",
  videoLinks: [
    { label: "Table Method", url: "https://youtu.be/FKKZRwBJDxE?t=13&si=SfwPvQ3BLbpW5e8c" },
    { label: "Bed-sheet Method", url: "https://youtu.be/bEvljMwQZIE?t=33&si=kF3aQ7loT01pJDAH" },
  ],
};

const chairDips: Exercise = {
  id: "ex-chair-dips",
  name: "Chair Dips",
  description: "A triceps and shoulder builder using the edge of a sturdy chair or bed.",
  tips: "Use the edge of a sturdy bed/chair. Lower yourself slowly and push up.",
  unit: "reps",
  targetLabel: "5 to 8 reps",
  reps: 8,
  illustration: "dip",
  videoLinks: [{ label: "Watch Tutorial", url: "https://youtube.com/shorts/4ua3MzaU0QU?si=TIF4ov7xjOiNXo_8" }],
};

const floorLSitPrep: Exercise = {
  id: "ex-floor-lsit-prep",
  name: "Floor L-Sit Prep",
  description: "A core and hip-flexor isometric that builds toward a full L-sit.",
  tips: "Sit on floor, hands by hips. Push down hard to lift butt off the floor (feet stay on ground).",
  unit: "time",
  targetLabel: "10 to 15 secs",
  durationSec: 15,
  illustration: "lsit",
  videoLinks: [{ label: "Watch Tutorial", url: "https://youtu.be/eywCpp0p7lg?si=KNnuUrttNhFyP5vy" }],
};

const pushups: Exercise = {
  id: "ex-pushups",
  name: "Push-ups",
  description: "The classic chest, shoulder and triceps builder.",
  tips: "Keep elbows tucked at 45 degrees, core tight, back straight.",
  unit: "reps",
  targetLabel: "5 to 8 reps",
  reps: 8,
  illustration: "pushup",
  videoLinks: [{ label: "Watch Tutorial", url: "https://youtube.com/shorts/c-lBErfxszs?si=I59V6YYHTg05BE0O" }],
};

const doorframePulls: Exercise = {
  id: "ex-doorframe-pulls",
  name: "Doorframe Pulls",
  description: "A back-focused pulling movement using any sturdy doorframe.",
  tips: "Hold sturdy doorframe, lean back, pull chest to frame.",
  unit: "reps",
  targetLabel: "8 to 12 reps",
  reps: 12,
  illustration: "pull",
  videoLinks: [{ label: "Watch Tutorial", url: "https://youtube.com/shorts/RO1Ge6zDb7Y?si=otoS7XIgRRn_c26n" }],
};

const plank: Exercise = {
  id: "ex-plank",
  name: "Plank",
  description: "Core stability hold that builds a strong, stable midsection.",
  tips: "Squeeze glutes, pull belly button in.",
  unit: "time",
  targetLabel: "30 to 45 secs",
  durationSec: 45,
  illustration: "plank",
  videoLinks: [{ label: "Watch Tutorial", url: "https://youtu.be/pSHjTRCQxIw?t=28&si=k4Vquw-7ukdCkaXY" }],
};

const reversePlank: Exercise = {
  id: "ex-reverse-plank",
  name: "Reverse Plank",
  description: "Posterior chain hold that strengthens glutes, hamstrings and lower back.",
  tips: "Lie on back, hands behind you, push hips up high.",
  unit: "time",
  targetLabel: "30 secs",
  durationSec: 30,
  illustration: "reverse-plank",
  videoLinks: [{ label: "Watch Tutorial", url: "https://youtu.be/T_OPGz218B4?t=27&si=F_8sD5t6PALiINZ1" }],
};

export const workoutPairs: WorkoutPair[] = [
  {
    id: "pair-1",
    label: "Pair 1",
    sets: 3,
    exercises: [bodyweightSquat, tableRows],
    restBetweenExercisesSec: 90,
    restAfterPairSec: 90,
  },
  {
    id: "pair-2",
    label: "Pair 2",
    sets: 3,
    exercises: [chairDips, floorLSitPrep],
    restBetweenExercisesSec: 90,
    restAfterPairSec: 90,
  },
  {
    id: "pair-3",
    label: "Pair 3",
    sets: 3,
    exercises: [pushups, doorframePulls],
    restBetweenExercisesSec: 90,
    restAfterPairSec: 90,
  },
  {
    id: "core-triplet",
    label: "Core Triplet (1 Set Only)",
    sets: 1,
    exercises: [plank, reversePlank],
    restBetweenExercisesSec: 20,
    restAfterPairSec: 0,
  },
];

// ---- Nutrition --------------------------------------------------------------

export const nutritionData: NutritionData = {
  dailyProteinTargetG: 73, // 70g - 75g range from source, midpoint used as target
  proteinFromMealsG: 35,
  proteinFromGroceriesG: 35,
  weeklyBudgetInr: 150,
  groceryList: [
    {
      id: "grocery-soya",
      name: "500g Soya Chunks (Soya Badi)",
      priceInr: 50,
      proteinNote: "26g protein per 50g serving — the cheapest high-protein source in India.",
      usageNote: "Boil, squeeze water, and mix into your daily dal/sabzi.",
    },
    {
      id: "grocery-sattu",
      name: "500g Chana Sattu",
      priceInr: 50,
      proteinNote: "A 50g serving provides 11g protein and ~200 clean calories.",
      usageNote: "Drink as a sharbat post-workout.",
    },
    {
      id: "grocery-banana",
      name: "1 Dozen Bananas",
      priceInr: 50,
      proteinNote: "Cheap, healthy calories to help you gain weight.",
      usageNote: "Eat before your 4 AM workout for immediate strength.",
    },
  ],
  mealSuggestions: [
    {
      id: "meal-prewokout",
      time: "4:00 AM",
      title: "Pre-Workout",
      detail: "1 banana or 2 dates with warm water.",
      proteinG: 1,
    },
    {
      id: "meal-postworkout",
      time: "5:00 AM",
      title: "Post-Workout Sattu Sharbat",
      detail: "50g Chana Sattu mixed as a sharbat to kickstart recovery.",
      proteinG: 11,
    },
    {
      id: "meal-family",
      time: "Meals",
      title: "Standard Family Meals",
      detail: "Roti, Dal, Sabzi, Rice, seasonal vegetables, paneer — mix in boiled soya chunks.",
      proteinG: 35,
    },
    {
      id: "meal-soya-topup",
      time: "Anytime",
      title: "Soya Chunks Top-up",
      detail: "50g soya chunks boiled & squeezed, mixed into dal/sabzi for the remaining protein.",
      proteinG: 26,
    },
  ],
  tip:
    "You might hear rumors online, but scientific studies prove that eating 50g of soya chunks a day is 100% safe, healthy, and highly effective for building muscle for men.",
};

export const motivationalQuote = "Consistency is your superpower. Keep showing up for yourself!";

// Flattened list of all strength exercises (used for totals / calorie estimation)
export const allStrengthExercises: Exercise[] = workoutPairs.flatMap((p) => p.exercises);
