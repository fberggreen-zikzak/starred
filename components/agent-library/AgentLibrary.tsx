"use client";

import { useState } from "react";
import { agentCategories, allLibraryAgents } from "./library-agents-data";
import { AgentCategory } from "./AgentCategory";
import { AgentSubscriptionCard } from "./AgentSubscriptionCard";

const tabLabel: Record<string, string> = {
  hiring: "Hiring",
  workforce: "Workforce",
  market: "Market & compliance",
};

const ALL_COUNT = allLibraryAgents.length;

/** Tab index for the “All agents” panel */
const ALL_TAB = 3;

type Props = {
  selectedAgentId: string | null;
  onSelectAgent: (id: string) => void;
  subscribed: Record<string, boolean>;
  onAddToLayer: (id: string) => void;
};

/** Tab index 0–2 = hiring, workforce, market; 3 = All */
export function AgentLibrary({
  selectedAgentId,
  onSelectAgent,
  subscribed,
  onAddToLayer,
}: Props) {
  const [active, setActive] = useState(0);
  const baseTabClass =
    "rounded-full border px-3.5 py-1.5 text-left text-[11px] font-semibold transition sm:px-4 sm:py-2 sm:text-xs";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className="flex w-full shrink-0 flex-wrap items-center gap-x-2 gap-y-2 border-b border-[#0d3d2e]/10 bg-[#f4f6f5] px-4 py-3 sm:px-6"
        role="tablist"
        aria-label="Agent categories"
      >
        <p className="mr-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5c6f66]">Categories</p>
        {agentCategories.map((cat, i) => {
          const selected = active === i;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={selected}
              id={`tab-${cat.id}`}
              aria-controls={`panel-${cat.id}`}
              onClick={() => setActive(i)}
              className={[
                baseTabClass,
                selected
                  ? "border-[#0d3d2e]/6 bg-[#0d3d2e] text-white shadow-[0_2px_8px_rgba(13,61,46,0.16)]"
                  : "border-[#0d3d2e]/12 bg-white/72 text-[#0d3d2e]/75 hover:border-[#0d3d2e]/2 hover:bg-white hover:text-[#0d3d2e]",
              ].join(" ")}
            >
              <span>{tabLabel[cat.id] ?? cat.title}</span>
              <span className={selected ? "font-medium text-white/75" : "font-medium text-[#5c6f66]"}>
                {" "}
                · 6 agents
              </span>
            </button>
          );
        })}

        <button
          type="button"
          role="tab"
          aria-selected={active === ALL_TAB}
          id="tab-all"
          aria-controls="panel-all"
          onClick={() => setActive(ALL_TAB)}
          className={[
            `${baseTabClass} ml-auto shrink-0`,
            active === ALL_TAB
              ? "border-[#0d3d2e]/6 bg-[#0d3d2e] text-white shadow-[0_2px_8px_rgba(13,61,46,0.16)]"
              : "border-[#0d3d2e]/14 bg-white text-[#0d3d2e]/78 hover:border-[#0d3d2e]/24 hover:bg-white hover:text-[#0d3d2e]",
          ].join(" ")}
        >
          <span>All</span>
          <span className={active === ALL_TAB ? "font-medium text-white/75" : "font-medium text-[#5c6f66]"}>
            {" "}
            · {ALL_COUNT} agents
          </span>
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
        <div
          id="panel-all"
          role="tabpanel"
          aria-labelledby="tab-all"
          hidden={active !== ALL_TAB}
          className={active === ALL_TAB ? "block" : "hidden"}
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {allLibraryAgents.map((agent) => (
              <AgentSubscriptionCard
                key={agent.id}
                agent={agent}
                selected={selectedAgentId === agent.id}
                inLayer={!!subscribed[agent.id]}
                onSelect={() => onSelectAgent(agent.id)}
                onSubscribe={() => onAddToLayer(agent.id)}
              />
            ))}
          </div>
        </div>

        {agentCategories.map((cat, i) => {
          return (
            <div
              key={cat.id}
              id={`panel-${cat.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${cat.id}`}
              hidden={active !== i}
              className={active === i ? "block" : "hidden"}
            >
              <AgentCategory
                category={cat}
                showCategoryHeading={false}
                selectedAgentId={selectedAgentId}
                onSelectAgent={onSelectAgent}
                subscribed={subscribed}
                onAddToLayer={onAddToLayer}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
