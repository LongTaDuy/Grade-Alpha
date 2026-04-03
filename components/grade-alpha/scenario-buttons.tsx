"use client";

import { Button } from "@/components/ui/button";
import type { Scenario } from "@/lib/forecast";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BarChart3, TrendingDown, TrendingUp } from "lucide-react";

type ScenarioButtonsProps = {
  scenario: Scenario;
  onScenarioChange: (s: Scenario) => void;
};

const scenarios: {
  id: Scenario;
  label: string;
  sub: string;
  icon: typeof TrendingUp;
}[] = [
  {
    id: "bull",
    label: "Bull case",
    sub: "Upside tape",
    icon: TrendingUp,
  },
  {
    id: "base",
    label: "Base case",
    sub: "As modeled",
    icon: BarChart3,
  },
  {
    id: "bear",
    label: "Bear case",
    sub: "Stress test",
    icon: TrendingDown,
  },
];

export function ScenarioButtons({
  scenario,
  onScenarioChange,
}: ScenarioButtonsProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground/90">
            Scenario desk
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground/90">
            Instantly reprice the curve—same inputs, different tape.
          </p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {scenarios.map(({ id, label, sub, icon: Icon }) => {
          const active = scenario === id;
          return (
            <motion.div
              key={id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 460, damping: 32 }}
              className="min-w-0"
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => onScenarioChange(id)}
                className={cn(
                  "relative h-auto w-full flex-col items-stretch gap-1 rounded-2xl border py-4 pl-4 pr-3 text-left transition-all duration-300 ease-smooth",
                  active
                    ? "border-primary/40 bg-gradient-to-b from-primary/[0.14] to-primary/[0.05] text-foreground shadow-[0_0_0_1px_oklch(0.72_0.1_198/0.2)]"
                    : "border-white/[0.08] bg-black/25 text-muted-foreground hover:border-white/[0.14] hover:bg-white/[0.04] hover:text-foreground"
                )}
              >
                <span className="flex items-center gap-2.5">
                  <Icon
                    className={cn(
                      "size-4 shrink-0 transition-colors",
                      active ? "text-primary" : "text-muted-foreground"
                    )}
                    aria-hidden
                  />
                  <span className="font-heading text-sm font-semibold tracking-tight">
                    {label}
                  </span>
                </span>
                <span className="pl-7 text-[11px] text-muted-foreground/90">
                  {sub}
                </span>
                {active && (
                  <motion.span
                    layoutId="scenario-active-ring"
                    className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-primary/40"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 34,
                    }}
                  />
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
