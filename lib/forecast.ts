export const LETTER_GRADES = [
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
] as const;

export type LetterGrade = (typeof LETTER_GRADES)[number];

export const LETTER_TO_GPA: Record<LetterGrade, number> = {
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
};

export type Scenario = "bull" | "base" | "bear";

export interface AcademicInputs {
  currentGpa: number;
  creditsCompleted: number;
  coursesThisSemester: number;
  expectedGrade: LetterGrade;
  studyHoursPerWeek: number;
  stressLevel: number;
}

export interface ForecastResult {
  projectedGpa: number;
  trend: "Bullish" | "Neutral" | "Bearish";
  volatilityScore: number;
  confidenceLevel: number;
  commentary: string;
  weeklyData: { week: number; gpa: number }[];
  tickerDeltaPct: number;
  chartYMin: number;
  chartYMax: number;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Deterministic hash for repeatable "noise" per week */
function hashWeek(week: number, seed: number) {
  const x = Math.sin(week * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function applyScenario(
  inputs: AcademicInputs,
  scenario: Scenario
): AcademicInputs {
  const g = { ...inputs };

  if (scenario === "bull") {
    g.expectedGrade = bumpGrade(g.expectedGrade, -1);
    g.studyHoursPerWeek = clamp(g.studyHoursPerWeek + 5, 0, 60);
    g.stressLevel = clamp(g.stressLevel - 2, 1, 10);
  } else if (scenario === "bear") {
    g.expectedGrade = bumpGrade(g.expectedGrade, 1);
    g.studyHoursPerWeek = clamp(g.studyHoursPerWeek - 6, 0, 60);
    g.stressLevel = clamp(g.stressLevel + 3, 1, 10);
  }

  return g;
}

function bumpGrade(grade: LetterGrade, delta: number): LetterGrade {
  const idx = LETTER_GRADES.indexOf(grade);
  const next = clamp(idx + delta, 0, LETTER_GRADES.length - 1);
  return LETTER_GRADES[next];
}

function semesterGpaEstimate(inputs: AcademicInputs): number {
  const base = LETTER_TO_GPA[inputs.expectedGrade];
  const studyAdj = (inputs.studyHoursPerWeek - 18) * 0.009;
  const stressAdj = -(inputs.stressLevel - 5) * 0.045;
  return clamp(base + studyAdj + stressAdj, 0, 4);
}

function blendCumulativeGpa(inputs: AcademicInputs, semesterGpa: number): number {
  const perCourse = 3;
  const newCredits = Math.max(0, inputs.coursesThisSemester) * perCourse;
  const done = Math.max(0, inputs.creditsCompleted);

  if (done + newCredits <= 0) {
    return semesterGpa;
  }

  return (inputs.currentGpa * done + semesterGpa * newCredits) / (done + newCredits);
}

function trendFromDelta(delta: number): "Bullish" | "Neutral" | "Bearish" {
  if (delta > 0.06) return "Bullish";
  if (delta < -0.06) return "Bearish";
  return "Neutral";
}

export function computeForecast(
  inputs: AcademicInputs,
  scenario: Scenario
): ForecastResult {
  const adj = applyScenario(inputs, scenario);
  const sem = semesterGpaEstimate(adj);
  const projected = clamp(blendCumulativeGpa(adj, sem), 0, 4);
  const delta = projected - inputs.currentGpa;
  const trend = trendFromDelta(delta);

  const loadFactor = Math.max(0, adj.coursesThisSemester) * 1.4;
  const volatilityScore = clamp(
    18 + adj.stressLevel * 5.5 + Math.abs(sem - inputs.currentGpa) * 12 + loadFactor,
    12,
    96
  );

  const confidenceLevel = clamp(
    90 -
      adj.stressLevel * 3.8 -
      Math.max(0, adj.coursesThisSemester - 4) * 2.2 +
      Math.min(adj.studyHoursPerWeek, 35) * 0.35,
    32,
    97
  );

  const seed =
    Math.round(inputs.currentGpa * 100) +
    inputs.stressLevel * 17 +
    (scenario === "bull" ? 31 : scenario === "bear" ? 7 : 0);

  const weeklyData: { week: number; gpa: number }[] = [];
  for (let w = 1; w <= 16; w++) {
    if (w === 1) {
      weeklyData.push({ week: 1, gpa: clamp(inputs.currentGpa, 0, 4) });
      continue;
    }
    if (w === 16) {
      weeklyData.push({ week: 16, gpa: projected });
      continue;
    }
    const t = (w - 1) / 15;
    const smooth =
      inputs.currentGpa +
      (projected - inputs.currentGpa) * easeInOutCubic(t);
    const noise =
      (hashWeek(w, seed) - 0.5) * 0.12 * (volatilityScore / 55) +
      Math.sin((w / 16) * Math.PI * 2) * 0.04 * (adj.stressLevel / 10);
    weeklyData.push({
      week: w,
      gpa: clamp(smooth + noise, 0, 4),
    });
  }

  const raw = inputs.currentGpa > 0.05 ? (delta / inputs.currentGpa) * 100 : delta * 25;
  const tickerDeltaPct = clamp(raw, -99, 99);

  const values = weeklyData.map((d) => d.gpa);
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const pad = 0.12;
  const chartYMin = clamp(lo - pad, 0, 3.9);
  const chartYMax = clamp(hi + pad, 2.2, 4.05);

  const commentary = buildCommentary(
    inputs,
    adj,
    scenario,
    trend,
    projected,
    sem
  );

  return {
    projectedGpa: projected,
    trend,
    volatilityScore: Math.round(volatilityScore),
    confidenceLevel: Math.round(confidenceLevel),
    commentary,
    weeklyData,
    tickerDeltaPct,
    chartYMin,
    chartYMax,
  };
}

function buildCommentary(
  base: AcademicInputs,
  effective: AcademicInputs,
  scenario: Scenario,
  trend: "Bullish" | "Neutral" | "Bearish",
  projected: number,
  semesterEst: number
): string {
  const scen =
    scenario === "bull"
      ? "upside scenario"
      : scenario === "bear"
        ? "stress-test case"
        : "base case";
  const stressHi = effective.stressLevel >= 7;
  const stressLo = effective.stressLevel <= 4;
  const studyStrong = effective.studyHoursPerWeek >= 22;

  let tone: string;
  if (trend === "Bullish") {
    tone =
      "Your academic tape is printing higher highs. Momentum favors a semester close above your prior average.";
  } else if (trend === "Bearish") {
    tone =
      "Price action is softening versus your established mean. Downside skew into finals is material unless inputs improve.";
  } else {
    tone =
      "Trading range behavior: expected performance is roughly in line with your established baseline.";
  }

  const detail: string[] = [];
  if (studyStrong && stressLo) {
    detail.push(
      "Solid study flow with contained stress supports conviction on execution."
    );
  } else if (stressHi) {
    detail.push(
      "Elevated stress widens the band around outcomes—volatility is elevated."
    );
  } else if (!studyStrong && semesterEst < base.currentGpa) {
    detail.push(
      "Expected course marks imply some mean reversion unless preparation steps up."
    );
  }

  const close = `Under the ${scen}, we see a projected term close near ${projected.toFixed(2)} (semester estimate ~${semesterEst.toFixed(2)}).`;

  return [tone, ...detail, close].filter(Boolean).join(" ");
}
