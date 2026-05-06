import { SnapshotReport } from "../types";
import { CTASection } from "./CTASection";
import { InsightCard } from "./InsightCard";
import { ScoreCard } from "./ScoreCard";

type AnalysisReportProps = {
  report: SnapshotReport;
  onReset: () => void;
};

export function AnalysisReport({ report, onReset }: AnalysisReportProps): JSX.Element {
  return (
    <section className="mx-auto mt-8 w-full max-w-5xl space-y-5 md:space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm ring-1 ring-emerald-100/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Hiring Experience Snapshot</p>
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Analyze another URL
          </button>
        </div>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">{report.companyName}</h2>
        <p className="mt-1 text-sm text-slate-600">{report.companyWebsite}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">Career page: {report.careerPageUrl}</span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">Based on public signals</span>
          <span className="rounded-full bg-cyan-100 px-3 py-1 text-cyan-800">ATS signal: {report.ats}</span>
        </div>
      </div>

      <ScoreCard
        label={report.signalLabel}
        interpretation={report.signalInterpretation}
        benchmarkPosition={report.benchmarkPosition}
      />

      <InsightCard title="Executive Summary" badge="Consultative view" icon="◌">
        <div className="space-y-2 text-sm">
          {report.executiveSummary.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
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
