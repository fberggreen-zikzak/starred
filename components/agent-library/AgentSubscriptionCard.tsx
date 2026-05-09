"use client";

import type { LibraryAgent } from "./library-agents-data";
import { LibraryAgentIcon } from "./library-agent-icons";

type Props = {
  agent: LibraryAgent;
  selected: boolean;
  /** Agent is in the user’s active monitoring layer */
  inLayer: boolean;
  onSelect: () => void;
  onSubscribe: () => void;
};

export function AgentSubscriptionCard({ agent, selected, inLayer, onSelect, onSubscribe }: Props) {
  const comingSoon = agent.status === "coming-soon";
  const isBeta = agent.status === "beta";

  const monitorsBox =
    comingSoon ? "border-[#0d3d2e]/8 bg-[#f2f4f3]/8" : "border-[#0d3d2e]/10 bg-white";

  const alertBox =
    inLayer && !comingSoon
      ? "border-[#5dbea5]/35 bg-[#e8f7f1]/65"
      : comingSoon
        ? "border-[#0d3d2e]/8 bg-[#f0f2f1]/8"
        : "border-[#0d3d2e]/10 bg-[#f8faf9]";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={[
        "cursor-pointer rounded-2xl border bg-[#fafcfb] p-3 text-left shadow-[0_1px_3px_rgba(13,61,46,0.06)] outline-none transition hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(13,61,46,0.08)] focus-visible:ring-2 focus-visible:ring-[#5dbea5]/45 sm:p-4",
        selected
          ? "border-[#5dbea5]/35 ring-2 ring-[#5dbea5]/25"
          : "border-[#0d3d2e]/10",
        comingSoon ? "opacity-[0.82]" : "",
      ].join(" ")}
    >
      <div className="flex gap-2 sm:gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f2ed] ring-1 ring-white sm:h-9 sm:w-9">
          <LibraryAgentIcon name={agent.icon} className="h-3.5 w-3.5 text-[#0d3d2e] sm:h-4 sm:w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 2xl:flex-row 2xl:items-start 2xl:justify-between 2xl:gap-3">
            <h3 className="min-w-0 text-[13px] font-semibold leading-snug tracking-tight text-[#0d3d2e] sm:text-[15px]">
              {agent.name}
            </h3>

            <div
              className="flex flex-wrap items-center justify-start gap-2"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <span
                className={[
                  "rounded-md border px-2 py-0.5 text-[9.5px] font-semibold tabular-nums sm:text-[10px]",
                  comingSoon
                    ? "border-[#0d3d2e]/10 bg-[#eef1ef] text-[#5c6f66]"
                    : "border-[#0d3d2e]/12 bg-[#f8faf9] text-[#0d3d2e]",
                ].join(" ")}
              >
                ${agent.pricePerAlert}/alert
              </span>
              {comingSoon ? (
                <span className="rounded-full border border-[#0d3d2e]/12 bg-[#eef1ef] px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-wide text-[#4a5c54] sm:text-[10px]">
                  Coming soon
                </span>
              ) : (
                <>
                  {isBeta ? (
                    <span className="rounded-full bg-[#fef3e2] px-2.5 py-1 text-[8.5px] font-semibold uppercase tracking-[0.08em] text-[#6b4510] ring-1 ring-[#e8b86d]/35 sm:text-[9px]">
                      Beta
                    </span>
                  ) : null}
                  {inLayer ? (
                    <span className="rounded-full bg-[#5dbea5] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.06em] text-[#063a2e] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] ring-1 ring-[#0d3d2e]/8 sm:px-3.5 sm:text-[10px]">
                      Subscribed
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={onSubscribe}
                      className="rounded-full border-2 border-[#0d3d2e]/22 bg-white px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.06em] text-[#0d3d2e] shadow-sm transition hover:border-[#0d3d2e]/32 hover:bg-white sm:px-3.5 sm:text-[10px]"
                    >
                      Subscribe
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <p className="mt-2 text-[10.5px] leading-relaxed text-[#3d5249] sm:mt-2.5 sm:text-[12px]">{agent.watchDescription}</p>

          <div className={`mt-3 rounded-lg border px-2.5 py-2 sm:px-3 sm:py-2 ${monitorsBox}`}>
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#5c6f66]">Monitors</p>
            <p className="mt-1 text-[11px] leading-snug text-[#0d3d2e] sm:text-[12px]">{agent.monitorsSignals}</p>
          </div>

          <div className={`mt-2 rounded-lg border px-2.5 py-2 sm:px-3 sm:py-2 ${alertBox}`}>
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#1f6b52]">Alerts you when</p>
            <p className="mt-1 text-[11px] font-medium leading-snug text-[#0d3d2e] sm:text-[12px]">{agent.alertTrigger}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
