import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AlarmClock,
  AlertTriangle,
  Download,
  Info,
  Moon,
  RotateCcw,
  Timer,
  Vibrate,
  Volume2,
} from "lucide-react";
import { GlassCard } from "../components/GlassCard";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { useSettings } from "../providers/SettingsProvider";
import { useProgress } from "../providers/ProgressProvider";
import {
  notificationsSupported,
  notificationPermission,
  requestNotificationPermission,
} from "../services/notificationService";
import { exportAllData } from "../database/storage";

export function SettingsScreen() {
  const { settings, updateSettings } = useSettings();
  const { resetProgress } = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const [exported, setExported] = useState(false);
  const [permDenied, setPermDenied] = useState(false);
  const fileTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const perm = notificationPermission();
  const notifSupported = notificationsSupported();

  const handleReminderToggle = async (value: boolean) => {
    setPermDenied(false);
    if (value) {
      if (perm === "denied") {
        setPermDenied(true);
        return;
      }
      const granted = await requestNotificationPermission();
      if (!granted) {
        setPermDenied(true);
        return;
      }
    }
    updateSettings({ reminderEnabled: value });
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fitness-progress-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExported(true);
    if (fileTimeoutRef.current) clearTimeout(fileTimeoutRef.current);
    fileTimeoutRef.current = setTimeout(() => setExported(false), 2500);
  };

  const handleReset = () => {
    resetProgress();
    setConfirmReset(false);
  };

  return (
    <div className="space-y-5 pb-6">
      <div className="pt-2">
        <h1 className="text-2xl font-extrabold text-white">Settings</h1>
        <p className="mt-1 text-sm text-white/50">Everything runs 100% offline on this device.</p>
      </div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        <SectionLabel>Appearance</SectionLabel>
        <GlassCard className="divide-y divide-white/5">
          <Row
            icon={<Moon size={17} className="text-violet-300" />}
            label="AMOLED Dark Mode"
            description="Always on for battery savings & premium feel"
          >
            <ToggleSwitch checked={settings.darkMode} onChange={(v) => updateSettings({ darkMode: v })} />
          </Row>
        </GlassCard>
      </motion.div>

      {/* Reminder */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="space-y-3"
      >
        <SectionLabel>Reminder</SectionLabel>
        <GlassCard className="divide-y divide-white/5">
          <Row
            icon={<AlarmClock size={17} className="text-blue-300" />}
            label="Daily Workout Reminder"
            description={
              !notifSupported
                ? "Not supported on this device"
                : perm === "denied"
                ? "Permission blocked — enable in Android Settings"
                : "Fires every day at your set time"
            }
          >
            <ToggleSwitch
              checked={settings.reminderEnabled && notifSupported && perm !== "denied"}
              onChange={handleReminderToggle}
              disabled={!notifSupported}
            />
          </Row>
          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                <Timer size={17} className="text-violet-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Reminder Time</p>
                <p className="text-xs text-white/40">Time for the daily notification</p>
              </div>
            </div>
            <input
              type="time"
              value={settings.reminderTime}
              onChange={(e) => updateSettings({ reminderTime: e.target.value })}
              className="rounded-xl bg-white/10 px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-violet-400"
            />
          </div>
        </GlassCard>

        {permDenied && (
          <div className="flex items-start gap-2 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-3.5">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-300" />
            <p className="text-xs leading-relaxed text-amber-200/80">
              Notification permission was denied. To enable reminders, go to your device&apos;s
              <strong> Settings → Apps → AmoledFit → Notifications</strong> and allow them.
            </p>
          </div>
        )}
      </motion.div>

      {/* Workout Timers */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <SectionLabel>Workout Timers</SectionLabel>
        <GlassCard className="divide-y divide-white/5">
          <div className="py-3.5">
            <div className="mb-2.5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                <Timer size={17} className="text-violet-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Rest Between Sets</p>
                <p className="text-xs text-white/40">Time between exercise sets</p>
              </div>
            </div>
            <SliderRow
              value={settings.restBetweenSetsSec}
              min={30}
              max={180}
              step={10}
              onChange={(v) => updateSettings({ restBetweenSetsSec: v })}
            />
          </div>
          <div className="py-3.5">
            <div className="mb-2.5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                <Timer size={17} className="text-blue-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Rest After Pair</p>
                <p className="text-xs text-white/40">Rest before moving to next pair</p>
              </div>
            </div>
            <SliderRow
              value={settings.restAfterPairSec}
              min={30}
              max={180}
              step={10}
              onChange={(v) => updateSettings({ restAfterPairSec: v })}
            />
          </div>
        </GlassCard>
      </motion.div>

      {/* Feedback */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-3"
      >
        <SectionLabel>Feedback</SectionLabel>
        <GlassCard className="divide-y divide-white/5">
          <Row
            icon={<Volume2 size={17} className="text-emerald-300" />}
            label="Sound Effects"
            description="Beeps and chimes during your workout"
          >
            <ToggleSwitch checked={settings.soundOn} onChange={(v) => updateSettings({ soundOn: v })} />
          </Row>
          <Row
            icon={<Vibrate size={17} className="text-amber-300" />}
            label="Haptic Feedback"
            description="Vibrations on step transitions"
          >
            <ToggleSwitch checked={settings.vibrationOn} onChange={(v) => updateSettings({ vibrationOn: v })} />
          </Row>
        </GlassCard>
      </motion.div>

      {/* Data */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <SectionLabel>Data</SectionLabel>
        <GlassCard className="divide-y divide-white/5">
          <button
            onClick={handleExport}
            className="flex w-full items-center justify-between py-3.5 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                <Download size={17} className="text-blue-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Export Progress</p>
                <p className="text-xs text-white/40">{exported ? "✓ Saved to Downloads" : "Download as JSON"}</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setConfirmReset(true)}
            className="flex w-full items-center justify-between py-3.5 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                <RotateCcw size={17} className="text-red-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-400">Reset All Progress</p>
                <p className="text-xs text-white/40">Wipe sessions, streaks & checklists</p>
              </div>
            </div>
          </button>
        </GlassCard>

        {confirmReset && (
          <GlassCard strong className="border-red-500/30">
            <p className="mb-3 text-sm font-semibold text-white">
              This will permanently delete all your workouts, streaks, and checklist data. Are you sure?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 rounded-xl glass py-2.5 text-sm font-bold text-white/80"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 rounded-xl bg-red-500/80 py-2.5 text-sm font-bold text-white"
              >
                Delete All
              </button>
            </div>
          </GlassCard>
        )}
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="space-y-3"
      >
        <SectionLabel>About</SectionLabel>
        <GlassCard className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5">
            <Info size={17} className="text-white/50" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">AmoledFit v1.0</p>
            <p className="mt-0.5 text-xs leading-relaxed text-white/40">
              Fully offline bodyweight fitness tracker. No accounts, no cloud, no ads. Your data
              stays on your device.
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="px-1 text-xs font-bold uppercase tracking-wider text-white/40">{children}</p>;
}

function Row({
  icon,
  label,
  description,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3.5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">{icon}</div>
        <div>
          <p className="text-sm font-semibold text-white">{label}</p>
          <p className="text-xs text-white/40">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function SliderRow({
  value,
  min,
  max,
  step,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-violet-400"
      />
      <span className="w-12 text-right text-sm font-bold text-white">{value}s</span>
    </div>
  );
}
