import { motion } from "framer-motion";
import { CheckSquare, Droplets, Minus, Plus, ShoppingBasket, Square, Utensils, Wallet } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { ProgressRing } from "../components/ProgressRing";
import { nutritionData } from "../data/workoutData";
import { useProgress } from "../providers/ProgressProvider";
import { cn } from "../utils/cn";

const WATER_TARGET = 8;

export function NutritionScreen() {
  const { todaysChecklist, updateTodaysChecklist } = useProgress();

  const proteinTotal = nutritionData.proteinFromMealsG + nutritionData.proteinFromGroceriesG;
  const proteinPct = Math.min(100, Math.round((proteinTotal / nutritionData.dailyProteinTargetG) * 100));
  const waterPct = Math.min(100, Math.round((todaysChecklist.waterGlasses / WATER_TARGET) * 100));

  const checklistItems: { key: keyof typeof todaysChecklist; label: string }[] = [
    { key: "hydrate", label: "Morning hydration (water + banana/dates)" },
    { key: "warmup", label: "Completed warm-up" },
    { key: "workout", label: "Completed strength routine" },
    { key: "postWorkoutDrink", label: "Post-workout Sattu Sharbat" },
    { key: "proteinTarget", label: `Hit ${nutritionData.dailyProteinTargetG}g protein target` },
  ];

  const adjustWater = (delta: number) => {
    const next = Math.max(0, Math.min(20, todaysChecklist.waterGlasses + delta));
    updateTodaysChecklist({ waterGlasses: next });
  };

  return (
    <div className="space-y-5 pb-6">
      <div className="pt-2">
        <h1 className="text-2xl font-extrabold text-white">Nutrition</h1>
        <p className="mt-1 text-sm text-white/50">Budget-friendly vegetarian fuel — ₹{nutritionData.weeklyBudgetInr}/week.</p>
      </div>

      {/* Protein target */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard strong className="flex items-center gap-5">
          <ProgressRing progress={proteinPct} size={104} strokeWidth={10} label={`${proteinTotal}g`} sublabel={`of ${nutritionData.dailyProteinTargetG}g`} />
          <div className="flex-1 space-y-1.5">
            <h3 className="text-sm font-bold text-white">Daily Protein Target</h3>
            <p className="text-xs leading-relaxed text-white/50">
              {nutritionData.proteinFromMealsG}g from family meals + {nutritionData.proteinFromGroceriesG}g from your grocery
              top-ups = {proteinTotal}g / {nutritionData.dailyProteinTargetG}g goal.
            </p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Water tracker */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <GlassCard>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold text-white">
              <Droplets size={16} className="text-blue-300" /> Water Tracker
            </h3>
            <span className="text-xs font-bold text-blue-300">
              {todaysChecklist.waterGlasses}/{WATER_TARGET} glasses
            </span>
          </div>
          <div className="mb-3 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-500" style={{ width: `${waterPct}%` }} />
          </div>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => adjustWater(-1)} className="flex h-10 w-10 items-center justify-center rounded-full glass text-white/70">
              <Minus size={16} />
            </button>
            <div className="flex gap-1">
              {Array.from({ length: WATER_TARGET }).map((_, i) => (
                <Droplets key={i} size={16} className={i < todaysChecklist.waterGlasses ? "text-blue-300" : "text-white/15"} />
              ))}
            </div>
            <button onClick={() => adjustWater(1)} className="flex h-10 w-10 items-center justify-center rounded-full glass text-white/70">
              <Plus size={16} />
            </button>
          </div>
        </GlassCard>
      </motion.div>

      {/* Meal suggestions */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 className="mb-3 flex items-center gap-2 px-1 text-sm font-bold text-white/80">
          <Utensils size={15} className="text-violet-300" /> Daily Meal Suggestions
        </h3>
        <div className="space-y-2.5">
          {nutritionData.mealSuggestions.map((meal) => (
            <GlassCard key={meal.id} className="flex items-center justify-between !p-3.5">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wide text-violet-300">{meal.time}</p>
                <p className="truncate text-sm font-bold text-white">{meal.title}</p>
                <p className="mt-0.5 text-xs text-white/45">{meal.detail}</p>
              </div>
              {meal.proteinG && (
                <span className="ml-2 whitespace-nowrap rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-300">
                  +{meal.proteinG}g
                </span>
              )}
            </GlassCard>
          ))}
        </div>
      </motion.div>

      {/* Grocery list */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <GlassCard>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold text-white">
              <ShoppingBasket size={16} className="text-emerald-300" /> Weekly Grocery List
            </h3>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-300">
              <Wallet size={12} /> ₹{nutritionData.weeklyBudgetInr}
            </span>
          </div>
          <div className="space-y-3">
            {nutritionData.groceryList.map((item) => (
              <div key={item.id} className="rounded-xl bg-white/5 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-white">{item.name}</p>
                  <span className="whitespace-nowrap text-xs font-bold text-emerald-300">₹{item.priceInr}</span>
                </div>
                <p className="mt-1 text-xs text-white/50">{item.proteinNote}</p>
                <p className="mt-1 text-xs italic text-white/35">{item.usageNote}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3">
            <p className="text-xs leading-relaxed text-amber-200/80">{nutritionData.tip}</p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Daily checklist */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="mb-3 px-1 text-sm font-bold text-white/80">Today's Checklist</h3>
        <GlassCard className="space-y-1">
          {checklistItems.map((item) => {
            const checked = Boolean(todaysChecklist[item.key]);
            return (
              <button
                key={item.key}
                onClick={() => updateTodaysChecklist({ [item.key]: !checked } as never)}
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-white/5"
              >
                {checked ? (
                  <CheckSquare size={19} className="shrink-0 text-violet-300" />
                ) : (
                  <Square size={19} className="shrink-0 text-white/30" />
                )}
                <span className={cn("text-sm", checked ? "text-white/50 line-through" : "text-white/80")}>{item.label}</span>
              </button>
            );
          })}
        </GlassCard>
      </motion.div>
    </div>
  );
}
