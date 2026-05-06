import { createRoot } from "react-dom/client";
import { useState } from "react";
import { AnalyzerForm } from "./components/AnalyzerForm";
import { AnalysisReport } from "./components/AnalysisReport";
import { Hero } from "./components/Hero";
import { LoadingState } from "./components/LoadingState";
import { generateSnapshot } from "./mockAnalysis";
import { FormData, SnapshotReport } from "./types";

type AppState = "idle" | "loading" | "report";

function App(): JSX.Element {
  const [state, setState] = useState<AppState>("idle");
  const [report, setReport] = useState<SnapshotReport | null>(null);

  function handleGenerate(input: FormData): void {
    setState("loading");
    window.setTimeout(() => {
      setReport(generateSnapshot(input));
      setState("report");
    }, 2000);
  }

  function handleReset(): void {
    setReport(null);
    setState("idle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="mx-auto max-w-6xl rounded-[28px] border border-white/80 bg-gradient-to-br from-emerald-50/90 via-cyan-50/85 to-slate-100/90 px-4 py-8 shadow-xl shadow-slate-900/10 backdrop-blur md:px-8 md:py-12">
      <div className="mx-auto max-w-5xl">
        {state !== "report" && <Hero />}
        {state === "idle" && <AnalyzerForm onSubmit={handleGenerate} />}
        {state === "loading" && <LoadingState />}
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
