import { useEffect, useState } from "react";
import { LOADING_STEPS } from "../data";

export function LoadingState(): JSX.Element {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 650);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="mx-auto mt-10 w-full max-w-3xl rounded-3xl border border-slate-200 bg-white/90 p-8 text-center shadow-xl shadow-emerald-900/10 backdrop-blur">
      <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Generating hiring snapshot</p>
      <p className="mt-3 text-lg text-slate-800">{LOADING_STEPS[stepIndex]}</p>
      <p className="mt-2 text-sm text-slate-500">This takes about 2 seconds.</p>
    </section>
  );
}
