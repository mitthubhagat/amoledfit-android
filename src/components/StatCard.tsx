import type { ReactNode } from "react";
import { GlassCard } from "./GlassCard";
import { cn } from "../utils/cn";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  accent?: "purple" | "blue" | "amber" | "green";
  className?: string;
}

const ACCENTS: Record<string, string> = {
  purple: "from-violet-500/25 to-violet-500/5 text-violet-300",
  blue: "from-blue-500/25 to-blue-500/5 text-blue-300",
  amber: "from-amber-500/25 to-amber-500/5 text-amber-300",
  green: "from-emerald-500/25 to-emerald-500/5 text-emerald-300",
};

export function StatCard({ icon, label, value, accent = "purple", className }: StatCardProps) {
  return (
    <GlassCard className={cn("flex flex-col gap-3", className)}>
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br", ACCENTS[accent])}>
        {icon}
      </div>
      <div>
        <p className="text-xl font-extrabold text-white">{value}</p>
        <p className="text-xs font-medium text-white/50">{label}</p>
      </div>
    </GlassCard>
  );
}
