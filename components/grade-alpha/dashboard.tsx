"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  computeForecast,
  type AcademicInputs,
  type Scenario,
} from "@/lib/forecast";
import { Hero } from "./hero";
import { InputPanel } from "./input-panel";
import { SummaryCards } from "./summary-cards";
import { AnalystNote } from "./analyst-note";
import { ScenarioButtons } from "./scenario-buttons";
import { motion } from "framer-motion";

const GpaChart = dynamic(
  () => import("./gpa-chart").then((m) => m.GpaChart),
  {
    ssr: false,
    loading: () => (
      <div
        className="surface-panel edge-highlight flex h-[340px] w-full items-center justify-center sm:h-[380px]"
        aria-hidden
      >
        <div className="relative">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          <div className="absolute inset-0 animate-pulse-soft rounded-full bg-primary/5 blur-md" />
        </div>
      </div>
    ),
  }
);

const defaultInputs: AcademicInputs = {
  currentGpa: 3.35,
  creditsCompleted: 60,
  coursesThisSemester: 5,
  expectedGrade: "B+",
  studyHoursPerWeek: 18,
  stressLevel: 5,
};

export function Dashboard() {
  const [inputs, setInputs] = useState<AcademicInputs>(defaultInputs);
  const [scenario, setScenario] = useState<Scenario>("base");

  const forecast = useMemo(
    () => computeForecast(inputs, scenario),
    [inputs, scenario]
  );

  const scenarioKey = `${scenario}-${forecast.projectedGpa.toFixed(3)}`;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-20 bg-background" />
      <div className="bg-app-mesh pointer-events-none fixed inset-0 -z-10" />
      <div className="bg-grid-faint pointer-events-none fixed inset-0 -z-10 opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-10 lg:pb-24 lg:pt-12">
        <Hero tickerDeltaPct={forecast.tickerDeltaPct} />

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,400px)_1fr] lg:items-start lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3"
          >
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground/90">
              Inputs
            </p>
            <InputPanel inputs={inputs} onChange={setInputs} />
          </motion.div>

          <div className="flex min-w-0 flex-col gap-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/[0.06] pb-3">
                <div>
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground/90">
                    Market data
                  </p>
                  <h2 className="mt-1 font-heading text-lg font-semibold tracking-tight text-foreground">
                    Semester curve
                  </h2>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span
                    className="relative flex h-2 w-2 items-center justify-center"
                    aria-hidden
                  >
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/40 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400/90" />
                  </span>
                  Simulated live
                </div>
              </div>
              <GpaChart forecast={forecast} scenarioKey={scenarioKey} />
            </div>

            <div className="space-y-4">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground/90">
                Key metrics
              </p>
              <SummaryCards
                forecast={forecast}
                baselineGpa={inputs.currentGpa}
              />
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 space-y-10 border-t border-white/[0.06] pt-14"
        >
          <AnalystNote
            commentary={forecast.commentary}
            scenarioKey={scenarioKey}
          />
          <ScenarioButtons scenario={scenario} onScenarioChange={setScenario} />
        </motion.div>

        <footer className="mt-20 border-t border-white/[0.05] pt-10 text-center">
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            For entertainment and motivation purposes only.
          </p>
          <p className="mt-2 font-mono text-[11px] tracking-wide text-muted-foreground/65">
            Grade Alpha · local preview · no data leaves your browser
          </p>
        </footer>
      </div>
    </div>
  );
}
