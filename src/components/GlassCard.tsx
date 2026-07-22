import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../utils/cn";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  strong?: boolean;
}

export function GlassCard({ children, className, strong, ...rest }: GlassCardProps) {
  return (
    <div
      className={cn(
        strong ? "glass-strong" : "glass",
        "rounded-3xl p-5 shadow-xl shadow-black/40",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
