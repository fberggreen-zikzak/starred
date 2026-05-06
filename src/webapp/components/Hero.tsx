export function Hero(): JSX.Element {
  return (
    <section className="mb-9 text-center md:mb-11">
      <p className="inline-flex rounded-full border border-emerald-200 bg-white/70 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-700">
        Hiring Experience Analyzer
      </p>
      <h1 className="mx-auto mt-5 max-w-4xl text-3xl font-semibold leading-tight text-slate-900 md:text-5xl">
        Uncover the hiring experience signals candidates already see
      </h1>
      <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-700 md:text-lg">
        Generate an AI-powered snapshot of public hiring touchpoints, potential friction points, and areas where
        candidate trust may be lost.
      </p>
    </section>
  );
}
