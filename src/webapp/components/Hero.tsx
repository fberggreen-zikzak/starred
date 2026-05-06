export function Hero(): JSX.Element {
  return (
    <section className="mb-9 text-center md:mb-11">
      <p className="inline-flex rounded-full border border-emerald-200 bg-white/70 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-700">
        Hiring Experience Analyzer
      </p>
      <h1 className="mx-auto mt-5 max-w-4xl text-3xl font-semibold leading-tight text-slate-900 md:text-5xl">
        Analyze the candidate experience on your careers page
      </h1>
      <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
        See your careers page through a candidate&apos;s eyes. AI reviews your public careers page and hiring flow to
        highlight where candidates may face friction, uncertainty, or missing information.
      </p>
    </section>
  );
}
