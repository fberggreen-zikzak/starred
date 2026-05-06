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
  success: true;
  finalUrl: string;
  title: string;
  text: string;
  signals: Record<string, unknown>;
  snapshot: ApiSnapshot;
};

type AnalyzeUrlErrorPayload = {
  success: false;
  errorCode: "invalid_url" | "timeout" | "blocked" | "no_content_found" | "unsupported_page" | "unknown";
  message: string;
};

function toUserFacingError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("not_found") || lower.includes("not found") || lower.includes("404")) {
    return "We could not access that careers page. Please verify the URL and try again.";
  }
  if (lower.includes("timeout") || lower.includes("timed out")) {
    return "The careers page took too long to respond. Please try again in a moment.";
  }
  if (lower.includes("econnrefused") || lower.includes("enotfound") || lower.includes("failed to fetch")) {
    return "We could not reach that careers page. Please check the URL and try again.";
  }
  if (lower.includes("403") || lower.includes("forbidden") || lower.includes("blocked")) {
    return "That careers page blocks automated access. Try a different careers page URL.";
  }
  return "Unable to analyze this careers page right now. Please try another URL.";
}

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
  const [showManualFallback, setShowManualFallback] = useState(false);

  async function handleGenerate(input: FormData): Promise<void> {
    setState("loading");
    setError(null);
    try {
      const response = await fetch("/api/analyze-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: input.careerPageUrl, manualContent: input.manualContent }),
      });
      const contentType = response.headers.get("content-type") ?? "";
      const isJson = contentType.includes("application/json");
      const payload = (isJson ? await response.json() : await response.text()) as AnalyzeApiPayload | AnalyzeUrlErrorPayload | string;

      if (!response.ok) {
        if (isJson && typeof payload === "object" && payload !== null && "message" in payload) {
          const errorPayload = payload as AnalyzeUrlErrorPayload;
          if (["blocked", "no_content_found", "unsupported_page", "timeout"].includes(errorPayload.errorCode)) {
            setShowManualFallback(true);
          }
          throw new Error(errorPayload.message);
        }
        if (typeof payload === "string" && payload.trim().length > 0) {
          throw new Error(toUserFacingError(payload));
        }
        throw new Error("Unable to analyze this careers page right now. Please try another URL.");
      }

      if (!isJson || typeof payload !== "object" || payload === null || !("snapshot" in payload) || !("success" in payload)) {
        throw new Error("Unexpected API response format.");
      }
      setShowManualFallback(false);
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
    setShowManualFallback(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="mx-auto max-w-6xl rounded-[28px] border border-white/80 bg-gradient-to-br from-emerald-50/95 via-cyan-50/90 to-slate-100/95 px-4 py-8 shadow-xl shadow-slate-900/10 backdrop-blur md:px-8 md:py-14">
      <div className="mx-auto max-w-[58rem]">
        {state !== "report" && <Hero />}
        {state === "idle" && <AnalyzerForm onSubmit={handleGenerate} showManualFallback={showManualFallback} />}
        {state === "loading" && <LoadingState />}
        {state === "idle" && error && (
          <div className="mx-auto mt-4 max-w-4xl rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <p>{error}</p>
            <p className="mt-1 text-xs text-rose-600">Try this format: https://company.com/careers</p>
          </div>
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
