import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Flame, Play, PauseCircle, Quote, Sparkles, Timer, Zap } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { StatCard } from "../components/StatCard";
import { ProgressRing } from "../components/ProgressRing";
import { useProgress } from "../providers/ProgressProvider";
import { useWorkoutSession } from "../providers/WorkoutSessionProvider";
import { useSettings } from "../providers/SettingsProvider";
import { motivationalQuote, timeline, userProfile } from "../data/workoutData";
import { estimateTotalWorkoutSeconds, estimateCalories } from "../services/workoutSessionService";
import { computeCurrentStreak, computeWeeklyProgress, isScheduledDay, todayISO } from "../services/streakService";
import { formatDuration, formatDateLabel, greetingForNow } from "../utils/format";

export function HomeScreen() {
  const navigate = useNavigate();
  const { sessions } = useProgress();
  const { settings } = useSettings();
  const { hasActiveSession, status, startWorkout, resumeWorkout } = useWorkoutSession();

  const today = new Date();
  const scheduledToday = isScheduledDay(today);
  const streak = computeCurrentStreak(sessions);
  const weekly = computeWeeklyProgress(sessions);
  const weeklyPct = weekly.target === 0 ? 0 : Math.round((weekly.done / weekly.target) * 100);
  const completedToday = sessions.some((s) => s.dateISO === todayISO());

  const estimatedSeconds = estimateTotalWorkoutSeconds(settings.restBetweenSetsSec, settings.restAfterPairSec);
  const estimatedCalories = estimateCalories(estimatedSeconds);

  const handlePrimaryAction = () => {
    if (hasActiveSession) {
      if (status === "paused") resumeWorkout();
      navigate("/workout");
      return;
    }
    startWorkout();
    navigate("/workout");
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between pt-2"
      >
        <div>
          <p className="text-sm font-medium text-white/50">{formatDateLabel(today)}</p>
          <h1 className="text-2xl font-extrabold text-white">
            {greetingForNow()}, <span className="gradient-text">Champion</span>
          </h1>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-bg text-lg font-extrabold text-white glow-purple">
          {userProfile.age}
        </div>
      </motion.div>

      {/* Today's workout hero card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <GlassCard strong className="relative overflow-hidden">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full gradient-bg opacity-20 blur-3xl" />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-300">
                <Sparkles size={13} /> {scheduledToday ? "Today's Workout" : "Rest Day"}
              </p>
              <h2 className="text-xl font-extrabold text-white">
                {scheduledToday ? "The Strength Routine" : "Recovery & Mobility"}
              </h2>
              <p className="mt-1 text-sm text-white/55">
                {scheduledToday
                  ? "4 Pairs · Bodyweight · No Equipment"
                  : "No strength training scheduled — let your muscles recover."}
              </p>
            </div>
          </div>

          {scheduledToday && (
            <>
              <div className="relative z-10 mt-5 flex items-center gap-4 text-sm text-white/70">
                <span className="flex items-center gap-1.5">
                  <Timer size={15} className="text-blue-300" /> {formatDuration(estimatedSeconds)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap size={15} className="text-amber-300" /> ~{estimatedCalories} kcal
                </span>
              </div>

              <button
                onClick={handlePrimaryAction}
                className="relative z-10 mt-5 flex w-full items-center justify-center gap-2 rounded-2xl gradient-bg py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-900/40 transition-transform active:scale-[0.98]"
              >
                {completedToday ? (
                  <>
                    <Flame size={17} /> Workout Completed — Go Again
                  </>
                ) : hasActiveSession ? (
                  <>
                    <PauseCircle size={17} /> Continue Workout
                  </>
                ) : (
                  <>
                    <Play size={17} fill="white" /> Quick Start
                  </>
                )}
              </button>
            </>
          )}
        </GlassCard>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-3"
      >
        <StatCard icon={<Flame size={18} className="text-orange-300" />} label="Current Streak" value={`${streak} days`} accent="amber" />
        <StatCard
          icon={<Timer size={18} className="text-blue-300" />}
          label="This Week"
          value={`${weekly.done}/${weekly.target} workouts`}
          accent="blue"
        />
      </motion.div>

      {/* Weekly completion ring */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <GlassCard className="flex items-center gap-5">
          <ProgressRing progress={weeklyPct} size={104} strokeWidth={10} label={`${weeklyPct}%`} sublabel="weekly" />
          <div className="flex-1 space-y-2">
            <h3 className="text-sm font-bold text-white">Weekly Completion</h3>
            <p className="text-xs leading-relaxed text-white/50">
              You've completed {weekly.done} of {weekly.target} scheduled sessions this week. Keep the momentum going!
            </p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full gradient-bg transition-all duration-700"
                style={{ width: `${weeklyPct}%` }}
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Timeline preview */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="mb-3 px-1 text-sm font-bold text-white/80">Morning Timeline</h3>
        <div className="space-y-2.5">
          {timeline.map((phase) => (
            <GlassCard key={phase.id} className="flex items-center gap-3 !p-3.5">
              <div className="flex h-10 min-w-[3.5rem] flex-col items-center justify-center rounded-xl bg-white/5 py-1.5 text-center">
                <span className="text-[11px] font-bold text-violet-300">{phase.time}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{phase.title}</p>
                <p className="truncate text-xs text-white/45">{phase.durationLabel}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>

      {/* Quote */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <GlassCard className="relative overflow-hidden border-violet-500/20">
          <Quote size={26} className="mb-2 text-violet-400/60" />
          <p className="text-sm font-semibold italic leading-relaxed text-white/80">{motivationalQuote}</p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
