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
    <section className="mx-auto mt-6 w-full max-w-5xl rounded-[30px] border border-white/80 bg-gradient-to-br from-white/90 via-cyan-50/70 to-emerald-50/75 p-7 shadow-2xl shadow-emerald-900/10 ring-1 ring-white/80 backdrop-blur-xl">
      <div className="flex items-start gap-4">
        <div className="mt-1 h-10 w-10 shrink-0 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
        <div className="w-full">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">AI analysis in progress</p>
          <p className="mt-1 text-lg font-medium text-slate-900">{LOADING_STEPS[stepIndex]}</p>
          <div className="mt-4 space-y-2">
            {LOADING_STEPS.map((step, index) => (
              <div
                key={step}
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  index <= stepIndex ? "bg-white/90 text-slate-700 shadow-sm" : "bg-white/50 text-slate-400"
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">Streaming insights as signals are detected.</p>
        </div>
      </div>
    </section>
  );
}
