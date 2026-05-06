export function CTASection(): JSX.Element {
  return (
    <section className="mt-8 rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-cyan-50 p-7 shadow-sm md:p-9">
      <h3 className="text-2xl font-semibold text-slate-900">
        Now imagine asking the same questions about your own hiring experience.
      </h3>
      <p className="mt-3 max-w-3xl text-slate-700">
        Starred AI Co-Pilot helps TA teams uncover candidate friction, recruiter bottlenecks, hiring manager trends,
        and experience risks directly from their own hiring data.
      </p>
      <a
        href="https://www.starred.com/demo"
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        See Starred AI Co-Pilot →
      </a>
    </section>
  );
}
