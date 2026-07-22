import { NavLink } from "react-router-dom";
import { Apple, Home, LineChart, Settings, Dumbbell } from "lucide-react";
import { cn } from "../utils/cn";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/workout", label: "Workout", icon: Dumbbell, end: false },
  { to: "/progress", label: "Progress", icon: LineChart, end: false },
  { to: "/nutrition", label: "Nutrition", icon: Apple, end: false },
  { to: "/settings", label: "Settings", icon: Settings, end: false },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
      <div className="mx-auto flex max-w-md items-center justify-between gap-1 rounded-3xl glass-strong px-2 py-2 shadow-2xl shadow-black/60">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-semibold transition-all duration-300",
                isActive ? "text-white" : "text-white/45 hover:text-white/70"
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300",
                    isActive ? "gradient-bg glow-purple" : "bg-transparent"
                  )}
                >
                  <Icon size={18} strokeWidth={2.2} />
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
