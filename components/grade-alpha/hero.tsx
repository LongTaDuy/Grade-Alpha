"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type HeroProps = {
  tickerDeltaPct: number;
};

function formatTicker(pct: number) {
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({ tickerDeltaPct }: HeroProps) {
  const up = tickerDeltaPct >= 0;

  return (
    <header className="surface-panel edge-highlight relative overflow-hidden rounded-2xl px-6 py-11 backdrop-blur-md sm:rounded-3xl sm:px-11 sm:py-14">
      <div className="pointer-events-none absolute inset-0 opacity-100" aria-hidden>
        <div className="absolute -left-24 -top-32 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.48_0.12_198/0.32),transparent_68%)] blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.4_0.09_275/0.22),transparent_68%)] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      <div className="relative flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex flex-wrap items-center gap-x-3 gap-y-2"
          >
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
              Academic terminal
            </span>
            <span className="hidden h-3 w-px bg-white/15 sm:block" aria-hidden />
            <span className="font-mono text-[10px] tabular-nums text-muted-foreground/80">
              Build 0.1
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.04, ease }}
            className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                <span className="bg-gradient-to-br from-white via-white to-white/55 bg-clip-text text-transparent">
                  Grade
                </span>{" "}
                <span className="font-mono font-semibold text-primary">Alpha</span>
              </span>
            </div>

            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
              className={cn(
                "inline-flex items-center rounded-lg border px-2.5 py-1 font-mono text-[11px] font-medium tabular-nums tracking-wide shadow-inner-glow",
                up
                  ? "border-emerald-500/30 bg-emerald-500/[0.09] text-emerald-300/95"
                  : "border-rose-500/30 bg-rose-500/[0.09] text-rose-300/95"
              )}
            >
              GPAA {formatTicker(tickerDeltaPct)}
            </motion.span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease }}
            className="text-pretty text-xl font-medium leading-snug tracking-tight text-foreground/95 sm:text-2xl sm:leading-tight"
          >
            Predict your GPA like a stock.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease }}
            className="max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed"
          >
            A disciplined, finance-inspired read on semester performance—map the
            curve, interpret the tape, and run scenarios before the close.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.14, ease }}
          className="shrink-0 sm:pt-1"
        >
          <Badge
            variant="secondary"
            className="rounded-full border border-white/[0.1] bg-white/[0.05] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground shadow-inner-glow"
          >
            Beta
          </Badge>
        </motion.div>
      </div>
    </header>
  );
}
