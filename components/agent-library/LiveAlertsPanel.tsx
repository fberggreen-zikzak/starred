"use client";

import { agentExampleAlerts } from "./agent-example-content";
import { findAgentById } from "./library-agents-data";

const deliveryChannels = ["Slack", "Email", "Dashboard", "Executive summary", "WhatsApp"] as const;
const SALES_MAILTO = "mailto:sales@starred.com?subject=Starred%20agent%20alerts";

type Props = {
  selectedAgentId: string | null;
};

function shortAgentName(fullName: string): string {
  return fullName.replace(/\s+Agent\s*$/i, "").trim();
}

function defaultWhyItMatters(agentLabel: string): string {
  return `${agentLabel} risks can reduce trust, slow decisions, and create avoidable performance drag across teams and markets.`;
}

function defaultRecommendedAction(monitorsSignals: string, alertTrigger: string): string {
  return `Review ${monitorsSignals.toLowerCase()}, validate the trigger (${alertTrigger.toLowerCase()}), and align owners on immediate follow-up actions.`;
}

export function LiveAlertsPanel({ selectedAgentId }: Props) {
  const fallbackId = "employer-brand-sentiment";
  const activeId = selectedAgentId ?? fallbackId;
  const agent = findAgentById(activeId) ?? findAgentById(fallbackId);
  const alert = agentExampleAlerts[activeId] ?? agentExampleAlerts[fallbackId];

  const fullAgentName = agent?.name ?? "Employer Brand Sentiment Agent";
  const agentLabel = shortAgentName(fullAgentName);
  const owner = alert?.owner ?? "Employer Brand";
  const title = alert?.title ?? "Negative sentiment trending up";
  const description =
    alert?.description ??
    "Mentions about interview communication are up 28% in candidate feedback and public reviews.";
  const severity = alert?.severity ?? "Medium";

  const whyItMatters =
    activeId === "employer-brand-sentiment"
      ? "Poor interview communication can damage candidate trust, reduce offer acceptance, and weaken employer brand perception in competitive markets."
      : defaultWhyItMatters(agentLabel);

  const recommendedAction =
    activeId === "employer-brand-sentiment"
      ? "Review recent candidate comments, identify the teams or stages driving the trend, and align recruiters on follow-up expectations."
      : defaultRecommendedAction(agent?.monitorsSignals ?? "recent signal patterns", agent?.alertTrigger ?? "risk conditions");

  const channel = severity === "High" ? "Slack + Email" : "Email + Dashboard";

  return (
    <aside className="flex w-full shrink-0 flex-col border-t border-[#0d3d2e]/12 bg-[#e8edea] lg:w-[360px] lg:border-l lg:border-t-0 xl:w-[390px]">
      <div className="shrink-0 border-b border-[#0d3d2e]/12 bg-[#f2f5f3] px-4 py-3.5 sm:px-7 sm:py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2a9d78]">LIVE</p>
        <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#5c6f66] sm:text-[10px]">What you receive</p>
        <h3 className="mt-1 text-[17px] font-semibold tracking-tight text-[#0d3d2e] sm:text-xl">Alert preview</h3>
        <p className="mt-1.5 max-w-[44ch] text-[11px] leading-snug text-[#3d5249] sm:text-xs">
          See what Starred sends when a subscribed agent detects a risk.
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#dfe8e4]/5 px-3.5 py-3 sm:min-h-[380px] sm:px-6 sm:py-4">
        <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#0d3d2e]/55 sm:mb-2.5 sm:text-[10px] sm:tracking-[0.14em]">
          SELECTED AGENT
        </p>
        <p className="mb-3 text-[12px] font-semibold text-[#0d3d2e] sm:mb-3.5 sm:text-[13px]">{fullAgentName}</p>

        <article className="relative flex-1 rounded-xl border border-[#0d3d2e]/12 bg-white px-3.5 py-3.5 shadow-[0_2px_8px_rgba(13,61,46,0.05)] transition hover:shadow-[0_10px_26px_rgba(13,61,46,0.1)] sm:px-5 sm:py-4.5">
          <span className="absolute left-0 top-3.5 bottom-3.5 w-1 rounded-r-full bg-[#5dbea5]/75" aria-hidden />

          <div className="flex h-full flex-col pl-2.5">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-[15px] font-semibold leading-snug tracking-tight text-[#0d3d2e] sm:text-[16px]">{title}</h4>
              <span className="shrink-0 rounded-full bg-[#fdf6e8] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#6a5220] ring-1 ring-[#e8d4a8]/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
                {severity}
              </span>
            </div>

            <p className="mt-2 text-[12px] leading-relaxed text-[#3d5249] sm:mt-2.5 sm:text-[13px]">{description}</p>

            <div className="mt-2.5 h-px w-full bg-gradient-to-r from-[#0d3d2e]/12 to-transparent" aria-hidden />

            <div className="mt-2.5 rounded-lg border border-[#0d3d2e]/10 bg-[#f8faf9] px-3 py-2.5 sm:mt-3.5 sm:px-3.5 sm:py-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#1f6b52]">WHY IT MATTERS</p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-[#0d3d2e]/90 sm:text-[12px]">{whyItMatters}</p>
            </div>

            <div className="mt-2.5 rounded-lg border border-[#5dbea5]/30 bg-[#e8f7f1]/55 px-3 py-2.5 sm:mt-3 sm:px-3.5 sm:py-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#1f6b52]">RECOMMENDED ACTION</p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-[#0d3d2e]/92 sm:text-[12px]">{recommendedAction}</p>
            </div>

            <div className="mt-auto pt-3 sm:pt-4">
              <div className="grid grid-cols-1 gap-2 border-t border-[#0d3d2e]/8 pt-3 text-[11px] sm:grid-cols-3 sm:gap-3">
                <p className="min-w-0 text-[#5c6f66]">
                Owner: <span className="font-semibold text-[#0d3d2e]">{owner}</span>
                </p>
                <p className="min-w-0 text-[#5c6f66]">
                  Agent: <span className="font-semibold text-[#1f6b52]">{agentLabel}</span>
                </p>
                <p className="min-w-0 text-[#5c6f66]">
                  Channel: <span className="font-semibold text-[#0d3d2e]">{channel}</span>
                </p>
              </div>

              <a
                href={SALES_MAILTO}
                className="mt-3 flex w-full items-center justify-center rounded-full border-2 border-[#0d3d2e]/16 bg-[#fafcfb] px-4 py-2.5 text-[11px] font-semibold text-[#0d3d2e] shadow-[0_1px_2px_rgba(13,61,46,0.06)] transition hover:border-[#0d3d2e]/24 hover:bg-white sm:mt-3.5 sm:text-xs"
              >
                Talk to sales
              </a>

              <div className="mt-3 sm:mt-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#4a5e56]">DELIVERED TO</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {deliveryChannels.map((ch) => (
                    <span
                      key={ch}
                      className="inline-flex rounded-full border border-[#0d3d2e]/12 bg-[#f4f7f5] px-2.5 py-1 text-[10px] font-medium text-[#0d3d2e]"
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </aside>
  );
}
