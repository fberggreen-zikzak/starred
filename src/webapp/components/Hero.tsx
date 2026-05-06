export function Hero(): JSX.Element {
  return (
    <section className="mb-8 text-center md:mb-10">
      <div className="mb-5 flex justify-start">
        <a
          href="/"
          className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          ← Go back to Benchmark page
        </a>
      </div>
      <p className="inline-flex rounded-full border border-emerald-200 bg-white/70 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-700">
        Hiring Experience Analyzer
      </p>
      <h1 className="mx-auto mt-5 max-w-4xl text-3xl font-semibold leading-tight text-slate-900 md:text-5xl">
        See where your hiring experience may be costing you candidates
      </h1>
      <p className="mx-auto mt-5 max-w-3xl text-base text-slate-700 md:text-lg">
        Generate an AI-powered snapshot of public hiring signals, candidate friction points, and potential
        experience gaps before they impact your pipeline.
      </p>
    </section>
  );
}
