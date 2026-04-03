"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  LETTER_GRADES,
  type AcademicInputs,
  type LetterGrade,
} from "@/lib/forecast";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

type InputPanelProps = {
  inputs: AcademicInputs;
  onChange: (next: AcademicInputs) => void;
};

const fieldClass =
  "space-y-2.5 rounded-xl border border-white/[0.05] bg-black/20 px-4 py-3.5 shadow-inner-glow transition-all duration-300 ease-smooth hover:border-white/[0.08] focus-within:border-primary/30 focus-within:bg-black/30";

export function InputPanel({ inputs, onChange }: InputPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="surface-panel edge-highlight relative overflow-hidden border-white/[0.08] shadow-glow-sm backdrop-blur-md">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <CardHeader className="relative space-y-2 pb-1 pt-1">
          <CardTitle className="font-heading text-lg tracking-tight text-foreground">
            Position
          </CardTitle>
          <CardDescription className="text-[13px] leading-relaxed text-muted-foreground">
            Inputs feed the curve—adjust and watch the tape respond.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative flex flex-col gap-4 pt-3">
          <div className={fieldClass}>
            <Label htmlFor="gpa" className="text-[13px] text-foreground/90">
              Current GPA
            </Label>
            <Input
              id="gpa"
              type="number"
              min={0}
              max={4}
              step={0.01}
              inputMode="decimal"
              value={inputs.currentGpa}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                if (Number.isNaN(v)) return;
                onChange({
                  ...inputs,
                  currentGpa: clamp(v, 0, 4),
                });
              }}
              className="h-10 border-white/10 bg-black/20 font-mono text-base tabular-nums"
            />
            <p className="text-xs text-muted-foreground">0.00 — 4.00 scale</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className={fieldClass}>
              <Label
                htmlFor="credits"
                className="text-[13px] text-foreground/90"
              >
                Credits completed
              </Label>
              <Input
                id="credits"
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                value={inputs.creditsCompleted}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (Number.isNaN(v)) return;
                  onChange({ ...inputs, creditsCompleted: Math.max(0, v) });
                }}
                className="h-10 border-white/10 bg-black/20 font-mono tabular-nums"
              />
            </div>
            <div className={fieldClass}>
              <Label
                htmlFor="courses"
                className="text-[13px] text-foreground/90"
              >
                Courses this semester
              </Label>
              <Input
                id="courses"
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                value={inputs.coursesThisSemester}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (Number.isNaN(v)) return;
                  onChange({
                    ...inputs,
                    coursesThisSemester: Math.max(0, v),
                  });
                }}
                className="h-10 border-white/10 bg-black/20 font-mono tabular-nums"
              />
            </div>
          </div>

          <div className={fieldClass}>
            <Label className="text-[13px] text-foreground/90">
              Average expected grade (semester)
            </Label>
            <Select
              value={inputs.expectedGrade}
              onValueChange={(v) => {
                if (v == null) return;
                onChange({
                  ...inputs,
                  expectedGrade: v as LetterGrade,
                });
              }}
            >
              <SelectTrigger className="h-10 w-full border-white/10 bg-black/20 font-mono text-sm">
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-popover">
                {LETTER_GRADES.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className={cn(fieldClass, "gap-3")}>
            <div className="flex items-center justify-between gap-2">
              <Label className="text-[13px] text-foreground/90">
                Study hours / week
              </Label>
              <span className="font-mono text-xs tabular-nums text-primary">
                {inputs.studyHoursPerWeek}h
              </span>
            </div>
            <Slider
              min={0}
              max={60}
              step={1}
              value={[inputs.studyHoursPerWeek]}
              onValueChange={(v) => {
                const n = Array.isArray(v) ? v[0] : v;
                onChange({
                  ...inputs,
                  studyHoursPerWeek: typeof n === "number" ? n : 0,
                });
              }}
            />
          </div>

          <div className={cn(fieldClass, "gap-3")}>
            <div className="flex items-center justify-between gap-2">
              <Label className="text-[13px] text-foreground/90">
                Stress level
              </Label>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {inputs.stressLevel}/10
              </span>
            </div>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[inputs.stressLevel]}
              onValueChange={(v) => {
                const n = Array.isArray(v) ? v[0] : v;
                const raw = typeof n === "number" ? n : 5;
                onChange({
                  ...inputs,
                  stressLevel: clamp(raw, 1, 10),
                });
              }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
