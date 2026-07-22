interface WeeklyBarChartProps {
  data: { label: string; value: number; scheduled: boolean }[];
  max?: number;
}

export function WeeklyBarChart({ data, max }: WeeklyBarChartProps) {
  const maxVal = max ?? Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex h-32 items-end justify-between gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <div className="relative flex h-24 w-full items-end overflow-hidden rounded-lg bg-white/5">
            <div
              className={d.value > 0 ? "w-full rounded-lg gradient-bg transition-all duration-700" : "w-full rounded-lg bg-white/5"}
              style={{ height: `${Math.max(6, (d.value / maxVal) * 100)}%` }}
            />
          </div>
          <span className={d.scheduled ? "text-[10px] font-bold text-white/60" : "text-[10px] font-medium text-white/25"}>
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}
