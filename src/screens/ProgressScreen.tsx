import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, Clock, Flame, TrendingUp } from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { StatCard } from "../components/StatCard";
import { MonthCalendar } from "../components/MonthCalendar";
import { WeeklyBarChart } from "../components/WeeklyBarChart";
import { useProgress } from "../providers/ProgressProvider";
import { userProfile } from "../data/workoutData";
import { computeCurrentStreak, computeWeeklyProgress, totalStats } from "../services/streakService";
import { formatDuration } from "../utils/format";

export function ProgressScreen() {
  const { sessions } = useProgress();
  const streak = computeCurrentStreak(sessions);
  const weekly = computeWeeklyProgress(sessions);
  const stats = totalStats(sessions);

  const completedDates = new Set(sessions.map((s) => s.dateISO));

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const daySessions = sessions.filter((s) => s.dateISO === key);
    const minutes = Math.round(daySessions.reduce((sum, s) => sum + s.durationSec, 0) / 60);
    return {
      label: d.toLocaleDateString(undefined, { weekday: "narrow" }),
      value: minutes,
      scheduled: userProfile.scheduleDays.includes(d.getDay()),
    };
  });

  const history = [...sessions].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

  return (
    <div className="space-y-5 pb-6">
      <div className="pt-2">
        <h1 className="text-2xl font-extrabold text-white">Your Progress</h1>
        <p className="mt-1 text-sm text-white/50">Consistency compounds. Here's your journey so far.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
        <StatCard icon={<Flame size={18} className="text-orange-300" />} label="Current Streak" value={`${streak} days`} accent="amber" />
        <StatCard icon={<TrendingUp size={18} className="text-blue-300" />} label="Weekly Streak" value={`${weekly.done}/${weekly.target}`} accent="blue" />
        <StatCard icon={<CheckCircle2 size={18} className="text-emerald-300" />} label="Total Workouts" value={`${stats.totalWorkouts}`} accent="green" />
        <StatCard icon={<Clock size={18} className="text-violet-300" />} label="Total Time" value={formatDuration(stats.totalSeconds)} accent="purple" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <GlassCard>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Last 7 Days</h3>
            <span className="text-[11px] font-semibold text-white/40">minutes trained</span>
          </div>
          <WeeklyBarChart data={last7} />
        </GlassCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard>
          <div className="mb-1 flex items-center gap-2">
            <CalendarDays size={16} className="text-violet-300" />
            <h3 className="text-sm font-bold text-white">Monthly Calendar</h3>
          </div>
          <MonthCalendar completedDates={completedDates} scheduledWeekdays={userProfile.scheduleDays} />
        </GlassCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <h3 className="mb-3 px-1 text-sm font-bold text-white/80">Completion History</h3>
        {history.length === 0 ? (
          <GlassCard className="text-center text-sm text-white/40">No workouts logged yet. Complete your first session!</GlassCard>
        ) : (
          <div className="space-y-2.5">
            {history.map((s) => (
              <GlassCard key={s.id} className="flex items-center justify-between !p-3.5">
                <div>
                  <p className="text-sm font-bold text-white">
                    {new Date(s.timestamp).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                  </p>
                  <p className="text-xs text-white/45">
                    {formatDuration(s.durationSec)} · {s.exercisesCompleted}/{s.totalExercises} exercises
                  </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
                  <CheckCircle2 size={13} /> {s.completionPct}%
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
