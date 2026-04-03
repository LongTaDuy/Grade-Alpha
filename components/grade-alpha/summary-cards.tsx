"use client";

import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { ForecastResult } from "@/lib/forecast";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Activity, Gauge, TrendingUp, Zap } from "lucide-react";

type SummaryCardsProps = {
  forecast: ForecastResult;
  baselineGpa: number;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function trendStyles(t: ForecastResult["trend"]) {
  if (t === "Bullish")
    return {
      label: "text-emerald-400/95",
      glow: "from-emerald-500/12 to-transparent",
      icon: "text-emerald-400/90",
      border: "border-emerald-500/20",
    };
  if (t === "Bearish")
    return {
      label: "text-rose-400/95",
      glow: "from-rose-500/12 to-transparent",
      icon: "text-rose-400/90",
      border: "border-rose-500/20",
    };
  return {
    label: "text-sky-400/95",
    glow: "from-sky-500/12 to-transparent",
    icon: "text-sky-400/90",
    border: "border-sky-500/20",
  };
}

function StatCard({
  children,
  className,
  glowClass,
}: {
  children: ReactNode;
  className?: string;
  glowClass?: string;
}) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={cn("h-full", className)}
    >
      <div
        className={cn(
          "group relative h-full overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b shadow-panel",
          "transition-[box-shadow,border-color] duration-300 ease-smooth",
          "hover:border-white/[0.11] hover:shadow-panel-hover",
          "from-white/[0.05] to-transparent"
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b opacity-60",
            glowClass ?? "from-primary/10 to-transparent"
          )}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
        {children}
      </div>
    </motion.div>
  );
}

export function SummaryCards({ forecast, baselineGpa }: SummaryCardsProps) {
  const { projectedGpa, trend, volatilityScore, confidenceLevel } = forecast;
  const ts = trendStyles(trend);
  const delta = projectedGpa - baselineGpa;
  const deltaUp = delta >= 0;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-4"
    >
      <StatCard
        className="sm:col-span-2 lg:col-span-5"
        glowClass="from-primary/15 to-transparent"
      >
        <Card className="relative border-0 bg-transparent shadow-none">
          <CardContent className="flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-end sm:pb-7 sm:pt-7">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/12 text-primary ring-1 ring-primary/20">
                  <TrendingUp className="size-4" aria-hidden />
                </span>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Predicted close
                </p>
              </div>
              <p className="font-mono text-4xl font-light tabular-nums tracking-tighter text-foreground sm:text-[2.75rem] sm:leading-none">
                {projectedGpa.toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col items-start gap-1 border-t border-white/[0.06] pt-4 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                vs. baseline
              </span>
              <span
                className={cn(
                  "font-mono text-lg font-medium tabular-nums",
                  deltaUp ? "text-emerald-400/90" : "text-rose-400/90"
                )}
              >
                {deltaUp ? "+" : ""}
                {delta.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      </StatCard>

      <StatCard className="lg:col-span-4" glowClass={ts.glow}>
        <Card className="relative border-0 bg-transparent shadow-none">
          <CardContent className="space-y-4 p-6 sm:pb-7 sm:pt-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Trend signal
                </p>
                <p
                  className={cn(
                    "mt-2 font-heading text-2xl font-semibold tracking-tight sm:text-[1.65rem]",
                    ts.label
                  )}
                >
                  {trend}
                </p>
              </div>
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl border bg-gradient-to-br to-transparent",
                  ts.border,
                  ts.glow
                )}
              >
                <Activity className={cn("size-4", ts.icon)} aria-hidden />
              </span>
            </div>
            <p className="text-[13px] leading-snug text-muted-foreground/90">
              Momentum versus your established mean—used for desk scenarios.
            </p>
          </CardContent>
        </Card>
      </StatCard>

      <StatCard
        className="lg:col-span-3"
        glowClass="from-amber-500/10 to-transparent"
      >
        <Card className="relative border-0 bg-transparent shadow-none">
          <CardContent className="flex h-full flex-col justify-between gap-4 p-6 sm:pb-7 sm:pt-7">
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Volatility
              </p>
              <span className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400/85 ring-1 ring-amber-500/15">
                <Zap className="size-4" aria-hidden />
              </span>
            </div>
            <p className="font-mono text-3xl font-light tabular-nums tracking-tight text-foreground">
              {volatilityScore}
            </p>
            <p className="text-[12px] leading-snug text-muted-foreground/85">
              Dispersion of weekly outcomes—higher with stress and load.
            </p>
          </CardContent>
        </Card>
      </StatCard>

      <StatCard
        className="sm:col-span-2 lg:col-span-12"
        glowClass="from-violet-500/10 to-transparent"
      >
        <Card className="relative border-0 bg-transparent shadow-none">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:pb-7 sm:pt-7">
            <div className="flex items-center gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400/85 ring-1 ring-violet-500/15">
                <Gauge className="size-4" aria-hidden />
              </span>
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Model confidence
                </p>
                <p className="mt-1 font-mono text-3xl font-light tabular-nums tracking-tight text-foreground">
                  {confidenceLevel}
                  <span className="text-xl font-normal text-muted-foreground">
                    %
                  </span>
                </p>
              </div>
            </div>
            <p className="max-w-md text-[13px] leading-relaxed text-muted-foreground/90 lg:text-right">
              Confidence compresses when stress rises or course load stretches
              the band of plausible outcomes.
            </p>
          </CardContent>
        </Card>
      </StatCard>
    </motion.div>
  );
}
