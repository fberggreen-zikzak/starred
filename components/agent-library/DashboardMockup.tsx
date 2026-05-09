import type { ReactNode } from "react";
import { AlertCard } from "./AlertCard";
import {
  IconChart,
  IconClock,
  IconHeartPulse,
  IconMessage,
  IconScale,
  IconSparkle,
  IconTrendDown,
  IconUsers,
} from "./icons";

type Status = "subscribed" | "add";

function AgentRow({
  name,
  description,
  status,
  icon,
}: {
  name: string;
  description: string;
  status: Status;
  icon: ReactNode;
}) {
  const sub = status === "subscribed";
  return (
    <div className="grid grid-cols-[2.25rem_1fr_auto] items-center gap-x-3 rounded-xl border border-[#0d3d2e]/8 bg-[#fafcfb] px-3 py-2 sm:grid-cols-[2.5rem_1fr_auto] sm:px-3.5 sm:py-2.5">
      <div
        className={[
          "flex h-9 w-9 items-center justify-center rounded-lg sm:h-10 sm:w-10",
          sub ? "bg-[#e8f7f1] text-[#0d3d2e]" : "bg-[#eef1f0] text-[#3d5249]",
        ].join(" ")}
      >
        <span className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem] [&>svg]:h-full [&>svg]:w-full">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold tracking-tight text-[#0d3d2e]">{name}</p>
        <p className="line-clamp-1 text-[11px] leading-snug text-[#5c6f66] sm:text-xs">{description}</p>
      </div>
      <span
        className={[
          "shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide sm:text-[11px]",
          sub
            ? "bg-[#d4f5e8] text-[#0d3d2e] ring-1 ring-[#5dbea5]/40"
            : "bg-white text-[#3d5249] ring-1 ring-[#0d3d2e]/12",
        ].join(" ")}
      >
        {sub ? "Subscribed" : "Add"}
      </span>
    </div>
  );
}

function Category({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <header className="border-b border-[#0d3d2e]/10 pb-2">
        <h3 className="text-[13px] font-semibold tracking-tight text-[#0d3d2e]">{title}</h3>
        <p className="mt-0.5 text-[11px] leading-snug text-[#5c6f66]">{subtitle}</p>
      </header>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

const alerts = [
  {
    title: "Potential conduct risk detected",
    description:
      "3 candidates reported inappropriate comments linked to Engineering interviews in the last 14 days.",
  },
  {
    title: "Feedback SLA breached",
    description: "Average feedback time in Sales is 4.2 days vs target of 2 days.",
  },
  {
    title: "EU pay transparency risk",
    description: "12 active EU job ads are missing salary range information.",
  },
  {
    title: "Negative sentiment trending up",
    description: "Mentions about interview communication are up 28%.",
  },
] as const;

export function DashboardMockup() {
  return (
    <div
      id="agents"
      className="scroll-mt-24 w-full overflow-hidden rounded-2xl border border-[#0d3d2e]/10 bg-white shadow-[0_20px_60px_rgba(13,61,46,0.08),0_4px_16px_rgba(13,61,46,0.06)]"
    >
      <div className="flex min-h-[520px] flex-col lg:min-h-[580px] lg:flex-row">
        <div className="flex min-w-0 flex-[1.15] flex-col border-b border-[#0d3d2e]/10 lg:border-b-0 lg:border-r">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#0d3d2e]/8 bg-[#f8faf9] px-6 py-5 sm:px-8 sm:py-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2a9d78]">Library</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#0d3d2e] sm:text-2xl">Agent Library</h2>
            </div>
            <span className="rounded-full bg-[#e8f7f1] px-3 py-1.5 text-[11px] font-semibold text-[#0d3d2e] ring-1 ring-[#5dbea5]/35">
              8 agents
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
            <Category
              title="Hiring Insights"
              subtitle="Candidate, recruiter, and hiring-manager signals"
            >
              <AgentRow
                name="Hiring Manager Conduct Agent"
                description="Detects inappropriate, biased, or inconsistent interview behavior."
                status="subscribed"
                icon={<IconUsers className="text-[#0d3d2e]" />}
              />
              <AgentRow
                name="Candidate Drop-off Risk Agent"
                description="Alerts when withdrawals increase by role, market, or team."
                status="subscribed"
                icon={<IconTrendDown className="text-[#0d3d2e]" />}
              />
              <AgentRow
                name="SLA Monitoring Agent"
                description="Tracks feedback, communication, and interview process SLAs."
                status="subscribed"
                icon={<IconClock className="text-[#0d3d2e]" />}
              />
              <AgentRow
                name="Quality of Hire Agent"
                description="Surfaces patterns linked to stronger or weaker hires."
                status="add"
                icon={<IconChart className="text-[#3d5249]" />}
              />
            </Category>

            <Category
              title="Workforce Insights"
              subtitle="People, culture, compliance, and retention signals"
            >
              <AgentRow
                name="EU Pay Transparency Agent"
                description="Checks job ads and compensation signals for pay transparency readiness."
                status="subscribed"
                icon={<IconScale className="text-[#0d3d2e]" />}
              />
              <AgentRow
                name="EVP Strength Agent"
                description="Tracks whether experience matches the EVP you communicate."
                status="subscribed"
                icon={<IconSparkle className="text-[#0d3d2e]" />}
              />
              <AgentRow
                name="Employer Brand Sentiment Agent"
                description="Flags negative sentiment across feedback and public channels."
                status="add"
                icon={<IconMessage className="text-[#3d5249]" />}
              />
              <AgentRow
                name="Onboarding Health Agent"
                description="Alerts when new hires are not set up to succeed."
                status="add"
                icon={<IconHeartPulse className="text-[#3d5249]" />}
              />
            </Category>
          </div>
        </div>

        <aside className="flex w-full shrink-0 flex-col bg-[#f0f3f2] lg:w-[min(100%,420px)] xl:w-[460px]">
          <div className="border-b border-[#0d3d2e]/10 px-6 py-5 sm:px-8 sm:py-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2a9d78]">Live</p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight text-[#0d3d2e]">Live Alerts</h3>
                <p className="mt-2 max-w-[34ch] text-[12px] leading-relaxed text-[#5c6f66]">
                  Alerts triggered by subscribed agents when thresholds are met.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#e8f7f1] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#0d3d2e] ring-1 ring-[#5dbea5]/35">
                Active
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
            {alerts.map((a) => (
              <AlertCard key={a.title} title={a.title} description={a.description} />
            ))}
          </div>

          <div className="border-t border-[#0d3d2e]/10 px-6 py-4 sm:px-8">
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#6b7f76]">Delivery</p>
            <p className="mt-1 text-[11px] font-medium leading-snug text-[#0d3d2e]">
              Slack · Email · Dashboard · Executive summary
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
