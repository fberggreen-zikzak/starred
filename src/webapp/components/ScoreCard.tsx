type ScoreCardProps = {
  label: "Strong" | "Mixed" | "At Risk";
  interpretation: string;
  benchmarkPosition: string;
};

function scoreAccent(label: ScoreCardProps["label"]): string {
  if (label === "Strong") return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (label === "Mixed") return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-rose-700 bg-rose-50 border-rose-200";
}

export function ScoreCard({ label, interpretation, benchmarkPosition }: ScoreCardProps): JSX.Element {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-emerald-100/70">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Overall Hiring Experience Signal</h3>
      <div className="mt-4 flex items-center gap-3">
        <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${scoreAccent(label)}`}>{label}</span>
        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800">Benchmark pattern</span>
      </div>
      <p className="mt-4 text-base font-medium text-slate-900">{interpretation}</p>
      <p className="mt-2 text-sm text-slate-600">{benchmarkPosition}</p>
    </article>
  );
}
