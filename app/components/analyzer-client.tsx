"use client";

import { useMemo, useState } from "react";
import type { SnapshotResult } from "@/lib/analyzer-types";

const LOADING_STEPS = [
  "Analyzing career page...",
  "Detecting candidate-facing signals...",
  "Comparing benchmark patterns...",
  "Generating executive snapshot...",
];

type Props = {
  initialSnapshot?: SnapshotResult | null;
  initialUrl?: string;
};

export default function AnalyzerClient({ initialSnapshot = null, initialUrl = "" }: Props) {
  const [url, setUrl] = useState(initialUrl);
  const [snapshot, setSnapshot] = useState<SnapshotResult | null>(initialSnapshot);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  async function onGenerate(event: React.FormEvent) {
    event.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setSnapshot(null);
    setStep(0);

    const ticker = window.setInterval(() => setStep((prev) => (prev + 1) % LOADING_STEPS.length), 650);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const contentType = response.headers.get("content-type") ?? "";
      const isJson = contentType.includes("application/json");
      const payload = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        const message =
          isJson && payload && typeof payload === "object" && "error" in payload
            ? String(payload.error)
            : typeof payload === "string" && payload.trim().length > 0
              ? payload
              : "Unable to generate snapshot.";
        throw new Error(message);
      }

      if (!isJson || !payload || typeof payload !== "object" || !("snapshot" in payload)) {
        throw new Error("Unexpected API response format.");
      }

      setSnapshot(payload.snapshot as SnapshotResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate snapshot.");
    } finally {
      window.clearInterval(ticker);
      setLoading(false);
    }
  }

  const shareUrl = useMemo(() => {
    if (!snapshot) return "";
    const slug = snapshot.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return `${window.location.origin}/snapshot/${slug}?url=${encodeURIComponent(snapshot.careerPageUrl)}`;
  }, [snapshot]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <section className="rounded-[28px] border border-white/80 bg-gradient-to-br from-emerald-50/95 via-cyan-50/90 to-slate-100/95 px-4 py-10 shadow-xl shadow-slate-900/10 md:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="inline-flex rounded-full border border-emerald-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Hiring Experience Analyzer
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight text-slate-900 md:text-6xl">
            Uncover the hiring experience signals candidates already see
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-700">
            Generate an AI-powered snapshot of public hiring touchpoints, potential friction points, and areas where
            candidate trust may be lost.
          </p>
        </div>

        <form onSubmit={onGenerate} className="snapshot-enter mx-auto mt-9 max-w-4xl rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-lg md:p-8">
          <label className="block text-sm font-semibold text-slate-700">Career page URL</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-5 py-3.5 text-base outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
            placeholder="https://company.com/careers"
            required
          />
          <p className="mt-4 text-xs text-slate-500">
            Uses publicly available hiring signals only. Results are directional and intended to highlight potential
            gaps.
          </p>
          <button
            disabled={loading}
            className="mt-5 inline-flex items-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Generating..." : "Generate report"}
          </button>
          {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        </form>

        {loading && (
          <section className="snapshot-enter mx-auto mt-6 max-w-3xl rounded-3xl border border-slate-200 bg-white/90 p-8 text-center shadow-lg">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">AI analysis in progress</p>
            <p className="mt-3 text-lg text-slate-800">{LOADING_STEPS[step]}</p>
          </section>
        )}

        {snapshot && (
          <section className="snapshot-enter mx-auto mt-8 max-w-5xl space-y-4">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-cyan-100 text-sm font-bold text-slate-700">
                    {snapshot.companyName
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((v) => v[0]?.toUpperCase())
                      .join("")}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">{snapshot.companyName}</h2>
                    <p className="text-sm text-slate-600">{snapshot.careerPageUrl}</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">{snapshot.hiringMaturity}</span>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <Info title="ATS detection" value={snapshot.atsProvider} />
                <Info title="Benchmark cohort" value={snapshot.benchmarkCohort} />
                <Info title="Cohort similarity" value={snapshot.benchmarkSimilarity} />
              </div>
            </article>

            <article className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {snapshot.scorecards.map((card) => (
                <div key={card.name} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-800">{card.name}</p>
                  <p className="mt-2 text-2xl font-semibold">{card.score}</p>
                  <div className="mt-2 h-1.5 rounded-full bg-slate-100">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: `${card.score}%` }} />
                  </div>
                  <p className="mt-3 text-xs text-slate-500">{card.benchmark} · Confidence {card.confidence}</p>
                </div>
              ))}
            </article>

            <Section title="Observed public signals" items={snapshot.observedPublicSignals} />
            <Section title="Executive summary" paragraph={snapshot.executiveSummary} />
            <Section title="Where candidate trust may weaken" items={snapshot.trustMoments} />
            <Section title="Benchmark comparison" comparison={snapshot.benchmarkComparison} />
            <Section title="Recommended Focus Areas" items={snapshot.recommendedFocusAreas} />

            <article className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-cyan-50 p-7 shadow-sm">
              <p className="text-lg font-semibold text-slate-900">
                Public hiring signals often reveal candidate experience patterns worth validating internally.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
                  See how Starred validates this with real feedback
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
                >
                  Copy share link
                </button>
                <button onClick={() => window.print()} className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
                  Export PDF / Screenshot
                </button>
              </div>
            </article>
          </section>
        )}
      </section>
    </main>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function Section({
  title,
  items,
  paragraph,
  comparison,
}: {
  title: string;
  items?: string[];
  paragraph?: string;
  comparison?: Array<{ metric: string; symbol: string; position: string }>;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {paragraph && <p className="mt-3 text-sm leading-relaxed text-slate-700">{paragraph}</p>}
      {items && (
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {items.map((item) => (
            <li key={item} className="rounded-lg bg-slate-50 px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      )}
      {comparison && (
        <ul className="mt-3 space-y-2 text-sm">
          {comparison.map((item) => (
            <li key={item.metric} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span>
                <span className="mr-2 text-slate-500">{item.symbol}</span>
                {item.metric}
              </span>
              <span className="text-xs font-semibold text-slate-600">{item.position}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
