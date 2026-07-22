import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flame,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  Square,
  Timer as TimerIcon,
  Trophy,
  X,
  Youtube,
} from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { ProgressRing } from "../components/ProgressRing";
import { ExerciseIllustration } from "../components/ExerciseIllustration";
import { useWorkoutSession } from "../providers/WorkoutSessionProvider";
import { workoutPairs, warmupItems } from "../data/workoutData";
import { formatDuration, formatSecondsToClock } from "../utils/format";

export function WorkoutScreen() {
  const navigate = useNavigate();
  const session = useWorkoutSession();
  const [confirmExit, setConfirmExit] = useState(false);

  if (session.status === "idle") {
    return <WorkoutOverview onStart={session.startWorkout} />;
  }

  if (session.status === "finished" && session.lastSummary) {
    return <WorkoutSummary onDone={() => { session.resetSession(); navigate("/"); }} />;
  }

  const { currentStep, currentIndex, steps, timeLeft, repStopwatch, status, totalElapsedSec, completedCount, totalExerciseSteps } =
    session;

  if (!currentStep) return null;

  const overallPct = Math.round(((currentIndex + 1) / steps.length) * 100);
  const isRest = currentStep.type === "rest";
  const exercise = currentStep.exercise;
  const isTimeBased = exercise?.unit === "time";

  return (
    /* Full-height flex column — header + content + controls, no scrolling needed */
    <div className="flex flex-col gap-2" style={{ height: "calc(100dvh - 7rem)" }}>

      {/* ── Header ── */}
      <div className="shrink-0 flex items-center justify-between pt-2">
        <button
          onClick={() => setConfirmExit(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full glass text-white/70"
        >
          <X size={16} />
        </button>
        <div className="flex-1 px-3">
          <div className="mb-1 flex items-center justify-between text-[10px] font-semibold text-white/50">
            <span>{currentStep.pairLabel}</span>
            <span>{formatSecondsToClock(totalElapsedSec)} elapsed</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full gradient-bg transition-all duration-500" style={{ width: `${overallPct}%` }} />
          </div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full glass text-[10px] font-bold text-white/70">
          {currentIndex + 1}/{steps.length}
        </div>
      </div>

      {/* ── Confirm-exit overlay ── */}
      {confirmExit && (
        <GlassCard strong className="shrink-0 border-red-500/30">
          <p className="mb-3 text-sm font-semibold text-white">End this workout early? Your progress so far will be saved.</p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmExit(false)}
              className="flex-1 rounded-xl glass py-2.5 text-sm font-bold text-white/80"
            >
              Keep Going
            </button>
            <button
              onClick={() => session.finishWorkout()}
              className="flex-1 rounded-xl bg-red-500/80 py-2.5 text-sm font-bold text-white"
            >
              End Workout
            </button>
          </div>
        </GlassCard>
      )}

      {/* ── Main exercise / rest card — fills all remaining space ── */}
      <div className="min-h-0 flex-1 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.stepId}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {isRest ? (
              <RestView timeLeft={timeLeft} totalSec={currentStep.restSec ?? 30} restLabel={currentStep.restLabel} status={status} />
            ) : exercise ? (
              <ExerciseView
                name={exercise.name}
                tips={exercise.tips}
                targetLabel={exercise.targetLabel}
                illustration={exercise.illustration}
                setNumber={currentStep.setNumber}
                totalSets={currentStep.totalSets}
                isTimeBased={isTimeBased}
                timeLeft={timeLeft}
                totalSec={exercise.durationSec ?? 30}
                repStopwatch={repStopwatch}
                status={status}
                videoLinks={exercise.videoLinks}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Controls — always visible at bottom ── */}
      <div className="shrink-0 space-y-2 pb-1">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={session.goPrevious}
            disabled={currentIndex === 0}
            className="flex h-11 w-11 items-center justify-center rounded-2xl glass text-white/70 disabled:opacity-30"
          >
            <ChevronLeft size={20} />
          </button>

          {status === "running" ? (
            <button
              onClick={session.pauseWorkout}
              className="flex h-14 w-14 items-center justify-center rounded-full gradient-bg text-white shadow-lg shadow-violet-900/50 active:scale-95"
            >
              <Pause size={24} fill="white" />
            </button>
          ) : (
            <button
              onClick={session.resumeWorkout}
              className="flex h-14 w-14 items-center justify-center rounded-full gradient-bg text-white shadow-lg shadow-violet-900/50 active:scale-95"
            >
              <Play size={24} fill="white" />
            </button>
          )}

          <button
            onClick={isRest ? session.skipRest : session.goNext}
            className="flex h-11 w-11 items-center justify-center rounded-2xl glass text-white/70"
          >
            {isRest ? <SkipForward size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <div className="flex items-center justify-between px-1 text-[10px] font-medium text-white/40">
          <span>{completedCount}/{totalExerciseSteps} exercises done</span>
          <button onClick={() => setConfirmExit(true)} className="flex items-center gap-1 text-white/50">
            <Square size={11} /> Finish Workout
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ExerciseView — compact layout that fits in one mobile screen
───────────────────────────────────────────────────────────── */
function ExerciseView({
  name,
  tips,
  targetLabel,
  illustration,
  setNumber,
  totalSets,
  isTimeBased,
  timeLeft,
  totalSec,
  repStopwatch,
  status,
  videoLinks,
}: {
  name: string;
  tips: string;
  targetLabel: string;
  illustration: Parameters<typeof ExerciseIllustration>[0]["type"];
  setNumber?: number;
  totalSets?: number;
  isTimeBased: boolean;
  timeLeft: number;
  totalSec: number;
  repStopwatch: number;
  status: string;
  videoLinks?: { label: string; url: string }[];
}) {
  return (
    <div className="flex w-full flex-col items-center text-center">
      <ExerciseIllustration type={illustration} active={status === "running"} size={64} />

      <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-violet-300">
        Set {setNumber}/{totalSets}
      </p>
      <h2 className="mt-0.5 text-xl font-extrabold text-white leading-tight">{name}</h2>
      <p className="mt-0.5 text-xs font-semibold text-blue-300">{targetLabel}</p>

      <div className="mt-3">
        {isTimeBased ? (
          <ProgressRing
            progress={totalSec > 0 ? (timeLeft / totalSec) * 100 : 0}
            size={110}
            strokeWidth={9}
            label={formatSecondsToClock(timeLeft)}
            sublabel="remaining"
          />
        ) : (
          <ProgressRing progress={100} size={110} strokeWidth={9} label={formatSecondsToClock(repStopwatch)} sublabel="elapsed" />
        )}
      </div>

      <GlassCard className="mt-3 w-full text-left !p-3">
        <div className="rounded-lg bg-violet-500/10 p-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-violet-300">Form Tip</p>
          <p className="mt-0.5 text-xs leading-relaxed text-white/60">{tips}</p>
        </div>

        {videoLinks && videoLinks.length > 0 && (
          <div className={`mt-2 flex gap-2 ${videoLinks.length > 1 ? "flex-col" : ""}`}>
            {videoLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-600/80 px-3 py-2 text-xs font-bold text-white active:scale-95 transition-transform"
              >
                <Youtube size={13} />
                {link.label}
              </a>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   RestView — compact
───────────────────────────────────────────────────────────── */
function RestView({
  timeLeft,
  totalSec,
  restLabel,
  status,
}: {
  timeLeft: number;
  totalSec: number;
  restLabel?: string;
  status: string;
}) {
  return (
    <div className="flex w-full flex-col items-center text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full glass-strong">
        <TimerIcon size={32} className={status === "running" ? "animate-pulse-soft text-blue-300" : "text-blue-300"} />
      </div>
      <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-blue-300">Rest</p>
      <h2 className="mt-0.5 text-base font-bold text-white/80">{restLabel ?? "Take a breather"}</h2>
      <div className="mt-4">
        <ProgressRing
          progress={totalSec > 0 ? (timeLeft / totalSec) * 100 : 0}
          size={130}
          strokeWidth={11}
          label={formatSecondsToClock(timeLeft)}
          sublabel="rest left"
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   WorkoutOverview (unchanged)
───────────────────────────────────────────────────────────── */
function WorkoutOverview({ onStart }: { onStart: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="space-y-5 pb-6">
      <div className="pt-2">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-300">4:17 AM · 40-45 min</p>
        <h1 className="text-2xl font-extrabold text-white">The Strength Routine</h1>
        <p className="mt-1 text-sm text-white/50">
          Perform exercises in pairs — Set 1 of A, rest, Set 1 of B, rest, repeat for 3 sets before the next pair.
        </p>
      </div>

      <GlassCard className="!p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-white/50">Warm-Up (7 min)</p>
        <div className="space-y-2">
          {warmupItems.map((w) => (
            <div key={w.id} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5">
              <span className="text-sm font-semibold text-white/80">{w.name}</span>
              <span className="text-xs font-bold text-blue-300">{w.targetLabel}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {workoutPairs.map((pair) => (
        <GlassCard key={pair.id} className="!p-4">
          <p className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-wide text-white/50">
            <span>{pair.label}</span>
            <span>{pair.sets} set{pair.sets > 1 ? "s" : ""}</span>
          </p>
          <div className="space-y-2">
            {pair.exercises.map((ex) => (
              <div key={ex.id} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5">
                <span className="text-sm font-semibold text-white/80">{ex.name}</span>
                <span className="text-xs font-bold text-blue-300">{ex.targetLabel}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      ))}

      <div className="flex gap-3">
        <button onClick={() => navigate("/")} className="flex-1 rounded-2xl glass py-3.5 text-sm font-bold text-white/70">
          Back
        </button>
        <button
          onClick={onStart}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl gradient-bg py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-900/40 active:scale-[0.98]"
        >
          <Play size={16} fill="white" /> Start Workout
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   WorkoutSummary (unchanged)
───────────────────────────────────────────────────────────── */
function WorkoutSummary({ onDone }: { onDone: () => void }) {
  const { lastSummary } = useWorkoutSession();
  if (!lastSummary) return null;

  return (
    <div className="flex min-h-[calc(100vh-7rem)] flex-col items-center justify-center gap-6 pb-6 text-center">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex h-24 w-24 items-center justify-center rounded-full gradient-bg glow-purple"
      >
        <Trophy size={44} className="text-white" />
      </motion.div>
      <div>
        <h1 className="text-2xl font-extrabold text-white">Workout Complete!</h1>
        <p className="mt-1 text-sm text-white/50">Great job — your streak just got stronger.</p>
      </div>

      <div className="grid w-full grid-cols-3 gap-3">
        <GlassCard className="!p-3">
          <TimerIcon size={16} className="mx-auto mb-1 text-blue-300" />
          <p className="text-sm font-extrabold text-white">{formatDuration(lastSummary.durationSec)}</p>
          <p className="text-[10px] text-white/40">Duration</p>
        </GlassCard>
        <GlassCard className="!p-3">
          <Flame size={16} className="mx-auto mb-1 text-orange-300" />
          <p className="text-sm font-extrabold text-white">{lastSummary.caloriesEstimate}</p>
          <p className="text-[10px] text-white/40">kcal burned</p>
        </GlassCard>
        <GlassCard className="!p-3">
          <CheckCircle2 size={16} className="mx-auto mb-1 text-emerald-300" />
          <p className="text-sm font-extrabold text-white">{lastSummary.completionPct}%</p>
          <p className="text-[10px] text-white/40">Completed</p>
        </GlassCard>
      </div>

      <button
        onClick={onDone}
        className="flex w-full items-center justify-center gap-2 rounded-2xl gradient-bg py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-900/40 active:scale-[0.98]"
      >
        <RotateCcw size={16} /> Back to Home
      </button>
    </div>
  );
}
