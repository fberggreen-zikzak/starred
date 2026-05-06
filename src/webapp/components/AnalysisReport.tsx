import { useState } from "react";
import { SnapshotReport } from "../types";
import { CTASection } from "./CTASection";
import { InsightCard } from "./InsightCard";

type AnalysisReportProps = {
  report: SnapshotReport;
  onReset: () => void;
};

export function AnalysisReport({ report, onReset }: AnalysisReportProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  function directionSymbol(direction: "up" | "flat" | "down"): string {
    if (direction === "up") return "↑";
    if (direction === "down") return "↓";
    return "≈";
  }

  function scoreBarWidth(score: number): string {
    return `${Math.max(0, Math.min(100, score))}%`;
  }

  function statusClass(status: string): string {
    if (status === "Above benchmark") return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (status === "Near benchmark") return "text-cyan-700 bg-cyan-50 border-cyan-200";
    return "text-amber-700 bg-amber-50 border-amber-200";
  }

  async function handleShareReport(): Promise<void> {
    const shareUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="mx-auto mt-8 w-full max-w-5xl space-y-5 md:space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm ring-1 ring-emerald-100/60">
        <div className="mb-3">
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Go back
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Hiring Experience Snapshot</p>
          <button
            type="button"
            onClick={handleShareReport}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {copied ? "Report URL copied" : "Share report"}
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-cyan-100 text-sm font-bold text-slate-700">
            {report.companyLogoText}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{report.companyName}</h2>
            <p className="mt-1 text-sm text-slate-600">{report.companyWebsite}</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Hiring maturity</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{report.hiringMaturityLabel}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Benchmark comparison</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{report.benchmarkComparisonLabel}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Cohort similarity</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{report.benchmarkCohortSimilarity}</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">Career page: {report.careerPageUrl}</span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">Based on public signals</span>
          <span className="rounded-full bg-cyan-100 px-3 py-1 text-cyan-800">ATS signal: {report.ats}</span>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {report.signalScores.map((item) => (
          <article key={item.name} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-800">{item.name}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{item.score}</p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
              <div className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: scoreBarWidth(item.score) }} />
            </div>
            <p className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(item.status)}`}>{item.status}</p>
          </article>
        ))}
      </div>

      <InsightCard title="Executive Summary" badge="Benchmark-driven" icon="◌">
        <p className="text-sm leading-relaxed">{report.executiveSummary}</p>
      </InsightCard>

      <InsightCard title="Observed Public Signals" badge="Based on public signals" icon="◫">
        <ul className="space-y-2 text-sm">
          {report.observedSignals.map((signal) => (
            <li key={signal} className="rounded-lg bg-slate-50 px-3 py-2">
              {signal}
            </li>
          ))}
        </ul>
      </InsightCard>

      <InsightCard title="Benchmark Comparison" badge="Relative position" icon="≈">
        <ul className="space-y-2 text-sm">
          {report.benchmarkComparison.map((item) => (
            <li key={item.metric} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span>
                <span className="mr-2 text-slate-500">{directionSymbol(item.direction)}</span>
                {item.metric}
              </span>
              <span className="text-xs font-semibold text-slate-600">{item.label}</span>
            </li>
          ))}
        </ul>
      </InsightCard>

      <InsightCard title="Where candidate trust may weaken" badge="Trust moments" icon="⚑">
        <ul className="space-y-2 text-sm">
          {report.trustMoments.map((item) => (
            <li key={item} className="rounded-lg bg-slate-50 px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </InsightCard>

      <InsightCard title="Public Candidate Friction Signals" badge="Experience layer" icon="✦">
        <ul className="space-y-2 text-sm">
          {report.frictionSignals.map((signal) => (
            <li key={signal} className="rounded-lg bg-slate-50 px-3 py-2">
              {signal}
            </li>
          ))}
        </ul>
      </InsightCard>

      <InsightCard title="Why this matters" badge="Benchmark pattern" icon="△">
        <ul className="space-y-2 text-sm">
          {report.whyThisMatters.map((item) => (
            <li key={item} className="rounded-lg bg-slate-50 px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </InsightCard>

      <InsightCard title="Recommended Focus Areas" badge="Priority actions" icon="◇">
        <ul className="space-y-2 text-sm">
          {report.priorities.map((recommendation, index) => (
            <li key={recommendation} className="rounded-lg bg-slate-50 px-3 py-2">
              <span className="mr-2 text-slate-500">{index + 1}.</span>
              {recommendation}
            </li>
          ))}
        </ul>
      </InsightCard>

      <CTASection />
    </section>
  );
}
