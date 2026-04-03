"use client";

import { useId, useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ForecastResult } from "@/lib/forecast";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type GpaChartProps = {
  forecast: ForecastResult;
  scenarioKey: string;
};

export function GpaChart({ forecast, scenarioKey }: GpaChartProps) {
  const uid = useId().replace(/:/g, "");
  const { weeklyData, projectedGpa, chartYMin, chartYMax, trend } = forecast;
  const trendUp = trend === "Bullish";
  const trendDown = trend === "Bearish";
  const stroke = trendUp
    ? "oklch(0.72 0.14 165)"
    : trendDown
      ? "oklch(0.72 0.16 25)"
      : "oklch(0.72 0.1 230)";

  const openGpa = weeklyData[0]?.gpa ?? 0;
  const netChg = projectedGpa - openGpa;
  const netUp = netChg >= 0;

  const { hi, lo } = useMemo(() => {
    const vals = weeklyData.map((d) => d.gpa);
    return { hi: Math.max(...vals), lo: Math.min(...vals) };
  }, [weeklyData]);

  const fillId = `gpaFill-${uid}`;

  return (
    <motion.div
      key={scenarioKey}
      initial={{ opacity: 0.92, scale: 0.995 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-[1.125rem] bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,var(--glow-strong),transparent_55%)] opacity-90 blur-2xl"
        aria-hidden
      />
      <div className="surface-panel edge-highlight relative overflow-hidden rounded-[1.125rem] shadow-glow-chart">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

        <div className="relative border-b border-white/[0.06] bg-black/25 px-4 py-3.5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-semibold tracking-tight text-foreground">
                  GPAA
                </span>
                <span className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                  SEM
                </span>
              </div>
              <div className="hidden h-4 w-px bg-white/10 sm:block" aria-hidden />
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Semester price action
              </p>
            </div>
            <p className="font-mono text-[10px] tabular-nums text-muted-foreground">
              Session W1–W16 · 16 wk
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatPill label="Last" value={projectedGpa.toFixed(2)} accent />
            <StatPill label="Open" value={openGpa.toFixed(2)} />
            <StatPill
              label="Net chg"
              value={`${netUp ? "+" : ""}${netChg.toFixed(2)}`}
              valueClass={cn(
                "tabular-nums",
                netUp ? "text-emerald-400/95" : "text-rose-400/95"
              )}
            />
            <StatPill
              label="Range"
              value={`${lo.toFixed(2)} – ${hi.toFixed(2)}`}
            />
          </div>
        </div>

        <div className="relative px-3 pb-4 pt-2 sm:px-5 sm:pb-5">
          <div className="h-[300px] w-full sm:h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={weeklyData}
                margin={{ top: 20, right: 8, left: 4, bottom: 2 }}
              >
                <defs>
                  <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={stroke} stopOpacity={0.42} />
                    <stop offset="55%" stopColor={stroke} stopOpacity={0.12} />
                    <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="oklch(1 0 0 / 0.055)"
                  vertical={false}
                  strokeDasharray="4 8"
                />
                <XAxis
                  dataKey="week"
                  type="number"
                  domain={[1, 16]}
                  ticks={[1, 4, 8, 12, 16]}
                  tick={{ fill: "oklch(0.5 0.03 260)", fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: "oklch(1 0 0 / 0.07)" }}
                  tickMargin={8}
                />
                <YAxis
                  domain={[chartYMin, chartYMax]}
                  tick={{ fill: "oklch(0.5 0.03 260)", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  width={44}
                  tickFormatter={(v) => v.toFixed(2)}
                  tickMargin={4}
                />
                <Tooltip
                  cursor={{
                    stroke: stroke,
                    strokeOpacity: 0.4,
                    strokeWidth: 1,
                  }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0]?.payload as {
                      week: number;
                      gpa: number;
                    };
                    if (!p) return null;
                    return (
                      <div className="rounded-lg border border-white/[0.1] bg-zinc-950/[0.97] px-3.5 py-2.5 shadow-panel backdrop-blur-md">
                        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                          Week {p.week} · GPA
                        </p>
                        <p className="mt-1 font-mono text-base font-medium tabular-nums tracking-tight text-foreground">
                          {p.gpa.toFixed(3)}
                        </p>
                      </div>
                    );
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="gpa"
                  stroke={stroke}
                  strokeWidth={5}
                  strokeOpacity={0.14}
                  dot={false}
                  activeDot={false}
                  tooltipType="none"
                  legendType="none"
                />
                <Area
                  type="monotone"
                  dataKey="gpa"
                  stroke={stroke}
                  strokeWidth={2.5}
                  fill={`url(#${fillId})`}
                  dot={false}
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    stroke: "#070709",
                    fill: stroke,
                  }}
                  isAnimationActive
                  animationDuration={520}
                />
                <ReferenceDot
                  x={1}
                  y={openGpa}
                  r={5}
                  fill="#070709"
                  stroke="oklch(0.88 0.05 260)"
                  strokeWidth={2}
                  label={{
                    value: "Open",
                    position: "top",
                    fill: "oklch(0.52 0.03 260)",
                    fontSize: 10,
                    offset: 8,
                  }}
                />
                <ReferenceDot
                  x={16}
                  y={projectedGpa}
                  r={6}
                  fill={stroke}
                  stroke="#070709"
                  strokeWidth={2}
                  label={{
                    value: `Projected ${projectedGpa.toFixed(2)}`,
                    position: "top",
                    fill: "oklch(0.75 0.04 260)",
                    fontSize: 11,
                    offset: 10,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatPill({
  label,
  value,
  accent,
  valueClass,
}: {
  label: string;
  value: string;
  accent?: boolean;
  valueClass?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2.5",
        accent
          ? "border-primary/25 bg-primary/[0.07]"
          : "border-white/[0.06] bg-white/[0.03]"
      )}
    >
      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-0.5 font-mono text-sm font-medium tabular-nums text-foreground/95",
          valueClass
        )}
      >
        {value}
      </p>
    </div>
  );
}
