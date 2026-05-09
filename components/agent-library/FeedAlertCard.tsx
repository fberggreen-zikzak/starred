import type { AlertSeverity } from "./live-alerts-data";

export function FeedAlertCard({
  title,
  description,
  owner,
  agent,
  severity,
  channel,
}: {
  title: string;
  description: string;
  owner: string;
  agent: string;
  severity: AlertSeverity;
  channel: string;
}) {
  const severityClass =
    severity === "High"
      ? "bg-[#fdf0ef] text-[#722f35] ring-1 ring-[#e8b8bc]/55"
      : "bg-[#fdf6e8] text-[#6a5220] ring-1 ring-[#e8d4a8]/55";

  return (
    <article className="rounded-lg border border-[#0d3d2e]/12 border-l-[3px] border-l-[#5dbea5]/5 bg-white py-2.5 pl-3 pr-3 shadow-[0_1px_3px_rgba(13,61,46,0.06)] transition-[box-shadow] hover:border-l-[#5dbea5]/65 hover:shadow-[0_4px_14px_rgba(13,61,46,0.08)]">
      <div className="flex items-start justify-between gap-2">
        <h4 className="min-w-0 flex-1 text-[12px] font-semibold leading-snug text-[#0d3d2e]">{title}</h4>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${severityClass}`}
        >
          {severity}
        </span>
      </div>
      <p className="mt-1.5 text-[10.5px] leading-snug text-[#3d5249]">{description}</p>
      <dl className="mt-2 space-y-1 border-t border-[#0d3d2e]/8 pt-2 text-[10px] leading-snug">
        <div className="flex flex-wrap gap-x-1.5">
          <dt className="shrink-0 font-medium text-[#5c6f66]">Agent</dt>
          <dd className="min-w-0 font-semibold text-[#1f6b52]">{agent}</dd>
        </div>
        <div className="flex flex-wrap gap-x-1.5">
          <dt className="shrink-0 font-medium text-[#5c6f66]">Owner</dt>
          <dd className="min-w-0 font-semibold text-[#0d3d2e]">{owner}</dd>
        </div>
        <div className="flex flex-wrap gap-x-1.5">
          <dt className="shrink-0 font-medium text-[#5c6f66]">Channel</dt>
          <dd className="min-w-0 font-medium text-[#0d3d2e]">{channel}</dd>
        </div>
      </dl>
    </article>
  );
}
