import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../utils/cn";

interface MonthCalendarProps {
  completedDates: Set<string>;
  scheduledWeekdays: number[];
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function toKey(y: number, m: number, d: number): string {
  const dt = new Date(y, m, d);
  return dt.toISOString().slice(0, 10);
}

export function MonthCalendar({ completedDates, scheduledWeekdays }: MonthCalendarProps) {
  const [cursor, setCursor] = useState(new Date());
  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = new Date().toISOString().slice(0, 10);

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full glass text-white/60"
        >
          <ChevronLeft size={14} />
        </button>
        <p className="text-sm font-bold text-white">
          {cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
        </p>
        <button
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full glass text-white/60"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {WEEKDAYS.map((w, i) => (
          <div key={`${w}-${i}`} className="text-center text-[10px] font-bold text-white/30">
            {w}
          </div>
        ))}
        {cells.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />;
          const key = toKey(year, month, day);
          const isDone = completedDates.has(key);
          const weekday = new Date(year, month, day).getDay();
          const isScheduled = scheduledWeekdays.includes(weekday);
          const isToday = key === todayKey;
          return (
            <div
              key={key}
              className={cn(
                "flex aspect-square items-center justify-center rounded-lg text-[11px] font-semibold transition-colors",
                isDone
                  ? "gradient-bg text-white glow-purple"
                  : isScheduled
                  ? "bg-white/10 text-white/60"
                  : "bg-white/[0.03] text-white/25",
                isToday && !isDone && "ring-1 ring-violet-400/70"
              )}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-4 text-[10px] text-white/40">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm gradient-bg" /> Completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-white/10" /> Scheduled
        </span>
      </div>
    </div>
  );
}
