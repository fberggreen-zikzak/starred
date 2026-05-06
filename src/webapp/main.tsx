import { createRoot } from "react-dom/client";
import { useState } from "react";
import { AnalyzerForm } from "./components/AnalyzerForm";
import { AnalysisReport } from "./components/AnalysisReport";
import { Hero } from "./components/Hero";
import { LoadingState } from "./components/LoadingState";
import { FormData, SnapshotReport } from "./types";

type AppState = "idle" | "loading" | "report";

type ApiScorecard = {
  name: string;
  score: number;
  benchmark: "Above benchmark" | "Near benchmark" | "Below benchmark";
};

type ApiSnapshot = {
  careerPageUrl: string;
  companyName: string;
  atsProvider: string;
  hiringMaturity: "Emerging" | "Developing" | "Mature";
  benchmarkSimilarity: string;
  executiveSummary: string;
  observedPublicSignals: string[];
  benchmarkComparison: Array<{ metric: string; symbol: "↑" | "≈" | "↓"; position: string }>;
  trustMoments: string[];
  recommendedFocusAreas: string[];
  strengths: string[];
  potentialGaps: string[];
  scorecards: ApiScorecard[];
};

type AnalyzeApiPayload = {
  snapshot: ApiSnapshot;
};

function toAtsOption(value: string): SnapshotReport["ats"] {
  if (value === "Greenhouse" || value === "Lever" || value === "Workday" || value === "SmartRecruiters" || value === "iCIMS" || value === "Jobvite") {
    return value;
  }
  return "Other / Not sure";
}

function toSignalLabel(score: number): SnapshotReport["signalLabel"] {
  if (score >= 72) return "Strong";
  if (score >= 54) return "Mixed";
  return "At Risk";
}

function toDirection(symbol: "↑" | "≈" | "↓"): "up" | "flat" | "down" {
  if (symbol === "↑") return "up";
  if (symbol === "↓") return "down";
  return "flat";
}

function buildReportFromSnapshot(snapshot: ApiSnapshot): SnapshotReport {
  const avgScore = Math.round(snapshot.scorecards.reduce((sum, card) => sum + card.score, 0) / Math.max(1, snapshot.scorecards.length));
  const signalLabel = toSignalLabel(avgScore);
  const logoText =
    snapshot.companyName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "CO";

  return {
    careerPageUrl: snapshot.careerPageUrl,
    companyName: snapshot.companyName,
    companyWebsite: new URL(snapshot.careerPageUrl).origin,
    ats: toAtsOption(snapshot.atsProvider),
    companyLogoText: logoText,
    hiringMaturityLabel: `${snapshot.hiringMaturity} hiring signal profile`,
    benchmarkComparisonLabel: signalLabel === "Strong" ? "Above benchmark on observed public hiring signals" : signalLabel === "Mixed" ? "Near benchmark on observed public hiring signals" : "Below benchmark on observed public hiring signals",
    benchmarkCohortSimilarity: snapshot.benchmarkSimilarity,
    signalLabel,
    signalInterpretation: "Scores are directional and computed only from observed public career-page signals.",
    benchmarkPosition: "Based on observed public evidence only",
    executiveSummary: snapshot.executiveSummary,
    signalScores: snapshot.scorecards.map((item) => ({
      name: item.name,
      score: item.score,
      status: item.benchmark,
    })),
    observedSignals: snapshot.observedPublicSignals,
    benchmarkComparison: snapshot.benchmarkComparison.map((item) => ({
      metric: item.metric,
      direction: toDirection(item.symbol),
      label: item.position,
    })),
    trustMoments: snapshot.trustMoments,
    frictionSignals: snapshot.potentialGaps,
    whyThisMatters: snapshot.strengths,
    priorities: snapshot.recommendedFocusAreas,
  };
}

function App(): JSX.Element {
  const [state, setState] = useState<AppState>("idle");
  const [report, setReport] = useState<SnapshotReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(input: FormData): Promise<void> {
    setState("loading");
    setError(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: input.careerPageUrl, observedOnly: true }),
      });
      const payload = (await response.json()) as AnalyzeApiPayload | { error?: string };
      if (!response.ok || !("snapshot" in payload)) {
        throw new Error("error" in payload && payload.error ? payload.error : "Unable to analyze career page.");
      }
      setReport(buildReportFromSnapshot(payload.snapshot));
      setState("report");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to analyze career page.");
      setState("idle");
    }
  }

  function handleReset(): void {
    setReport(null);
    setState("idle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="mx-auto max-w-6xl rounded-[28px] border border-white/80 bg-gradient-to-br from-emerald-50/95 via-cyan-50/90 to-slate-100/95 px-4 py-8 shadow-xl shadow-slate-900/10 backdrop-blur md:px-8 md:py-14">
      <div className="mx-auto max-w-[58rem]">
        {state !== "report" && <Hero />}
        {state === "idle" && <AnalyzerForm onSubmit={handleGenerate} />}
        {state === "loading" && <LoadingState />}
        {state === "idle" && error && (
          <p className="mx-auto mt-4 max-w-4xl rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
        )}
        {state === "report" && report && <AnalysisReport report={report} onReset={handleReset} />}
      </div>
    </section>
  );
}

const mountNode = document.getElementById("app");

if (!mountNode) {
  throw new Error("Missing app root node");
}

createRoot(mountNode).render(<App />);
