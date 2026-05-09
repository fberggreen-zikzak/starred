"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AgentLibraryGrid } from "./AgentLibraryGrid";
import { AGENT_EXAMPLE_ALERTS, LIVE_ALERT_FEED } from "./agent-example-alerts";
import { AlertCard } from "./AlertCard";

const AGENT_LABELS: Record<string, string> = {
  conduct: "Hiring Manager Conduct",
  dropoff: "Candidate Drop-off",
  sla: "SLA Monitoring",
  quality: "Quality of Hire",
  pay: "EU Pay Transparency",
  evp: "EVP Strength",
  brand: "Employer Brand",
  onboarding: "Onboarding Health",
};

function ExampleAlertPopOut({
  agentId,
  onDismiss,
}: {
  agentId: string;
  onDismiss: () => void;
}) {
  const alert = AGENT_EXAMPLE_ALERTS[agentId];
  const label = AGENT_LABELS[agentId] ?? "Agent";
  if (!alert) return null;

  return (
    <div className="relative z-10 rounded-xl border-2 border-[#6EE7B7] bg-white p-4 shadow-[0_12px_40px_rgba(11,31,27,0.15)] ring-1 ring-[#6EE7B7]/20">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0B1F1B]/55">
          Example alert
          <span className="text-[#6EE7B7]"> · </span>
          {label}
        </p>
        <button
          type="button"
          onClick={onDismiss}
          className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#0B1F1B]/50 transition hover:bg-[#0B1F1B]/5 hover:text-[#0B1F1B]"
          aria-label="Close example alert"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <h4 className="mt-2 text-[14px] font-semibold leading-snug text-[#0B1F1B]">{alert.title}</h4>
      <p className="mt-2 text-[12px] leading-relaxed text-[#0B1F1B]/70">{alert.description}</p>
    </div>
  );
}

export function AgentLibraryInteractive() {
  const shellRef = useRef<HTMLDivElement>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const selectAgent = useCallback((id: string) => {
    setSelectedAgentId((current) => (current === id ? null : id));
  }, []);

  const clearSelection = useCallback(() => setSelectedAgentId(null), []);

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      const el = shellRef.current;
      if (!el || el.contains(e.target as Node)) return;
      setSelectedAgentId(null);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedAgentId(null);
    }
    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={shellRef}
      id="agents"
      className="scroll-mt-24 overflow-hidden rounded-[1.35rem] border border-[#0B1F1B]/12 bg-white shadow-[0_12px_48px_rgba(0,0,0,0.35),0_2px_8px_rgba(11,31,27,0.08)]"
    >
      <div className="flex min-h-[min(640px,70vh)] flex-col lg:min-h-[520px] lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col border-b border-[#0B1F1B]/10 lg:border-b-0 lg:border-r">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#0B1F1B]/10 bg-[#f8faf9] px-5 py-4 sm:px-6 sm:py-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0B1F1B]/55">Library</p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-[#0B1F1B] sm:text-xl">Agent Library</h2>
            </div>
            <span className="rounded-full bg-[#6EE7B7]/20 px-3 py-1 text-[11px] font-semibold text-[#0B1F1B] ring-1 ring-[#6EE7B7]/35">
              8 agents
            </span>
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-6 sm:py-7">
            <p className="mb-6 max-w-xl text-[12px] leading-relaxed text-[#0B1F1B]/65">
              <span className="font-semibold text-[#0B1F1B]">Hiring insights</span> — candidate, recruiter, and
              hiring-manager signals.{" "}
              <span className="font-semibold text-[#0B1F1B]">Workforce insights</span> — people, culture,
              compliance, and retention.
            </p>
            <AgentLibraryGrid selectedAgentId={selectedAgentId} onSelectAgent={selectAgent} />
          </div>
        </div>

        <aside className="flex w-full shrink-0 flex-col bg-[#f0f3f2] lg:w-[min(100%,380px)] xl:w-[400px]">
          <div className="border-b border-[#0B1F1B]/10 px-5 py-4 sm:px-6 sm:py-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0B1F1B]/55">Live</p>
                <h3 className="mt-1 text-lg font-semibold tracking-tight text-[#0B1F1B]">Live Alerts</h3>
                <p className="mt-1 max-w-[32ch] text-[11px] leading-snug text-[#0B1F1B]/60">
                  Triggered by subscribed agents when thresholds are met.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[#6EE7B7]/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#0B1F1B] ring-1 ring-[#6EE7B7]/40">
                Active
              </span>
            </div>
          </div>

          <div className="relative flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
            {selectedAgentId ? (
              <ExampleAlertPopOut agentId={selectedAgentId} onDismiss={clearSelection} />
            ) : null}
            <div className={selectedAgentId ? "opacity-60 transition-opacity" : ""}>
              {LIVE_ALERT_FEED.map((a) => (
                <AlertCard key={a.title} title={a.title} description={a.description} />
              ))}
            </div>
          </div>

          <div className="border-t border-[#0B1F1B]/10 px-5 py-3 sm:px-6">
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#0B1F1B]/50">Delivery</p>
            <p className="mt-1 text-[11px] font-medium leading-snug text-[#0B1F1B]">
              Slack · Email · Dashboard · Executive summary
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
