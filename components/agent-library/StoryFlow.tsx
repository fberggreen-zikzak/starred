/** Subscribe → Monitor → Alert — light, calm enterprise */

export function StoryFlow() {
  const steps = ["Subscribe", "Monitor", "Alert"] as const;

  return (
    <div
      className="mb-6 flex flex-wrap items-center gap-2 sm:gap-3 lg:mb-8"
      aria-label="How Starred works: Subscribe, Monitor, Alert"
    >
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-2 sm:gap-3">
          {i > 0 ? (
            <span className="text-[#5dbea5]/90" aria-hidden>
              →
            </span>
          ) : null}
          <span
            className={[
              "rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em]",
              i === 0
                ? "bg-[#0d3d2e] text-white shadow-sm"
                : i === 1
                  ? "bg-[#e8f7f1] text-[#0d3d2e] ring-1 ring-[#5dbea5]/45"
                  : "bg-white text-[#0d3d2e] ring-1 ring-[#0d3d2e]/12 shadow-sm",
            ].join(" ")}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
