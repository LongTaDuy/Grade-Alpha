"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { FileText } from "lucide-react";

type AnalystNoteProps = {
  commentary: string;
  scenarioKey: string;
};

export function AnalystNote({ commentary, scenarioKey }: AnalystNoteProps) {
  return (
    <Card className="surface-panel edge-highlight relative overflow-hidden border-white/[0.08] shadow-panel backdrop-blur-md">
      <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-primary/70 via-primary/35 to-primary/10" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary/25 via-white/10 to-transparent" />

      <CardHeader className="relative flex flex-row items-start gap-4 pb-2 pl-5 sm:pl-7">
        <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.08] to-transparent text-primary shadow-inner-glow">
          <FileText className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 space-y-1">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Analyst note
          </p>
          <CardTitle className="font-heading text-lg font-semibold tracking-tight text-foreground">
            Semester outlook
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="relative pt-0 pl-5 sm:pl-7">
        <AnimatePresence mode="wait">
          <motion.p
            key={scenarioKey + commentary.slice(0, 24)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="text-pretty text-[15px] leading-[1.65] text-foreground/88"
          >
            {commentary}
          </motion.p>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
