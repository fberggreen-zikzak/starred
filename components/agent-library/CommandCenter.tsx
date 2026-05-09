"use client";

import { useCallback, useState } from "react";
import { agentCategories } from "./library-agents-data";
import { AgentLibrary } from "./AgentLibrary";
import { LayerProcessFlow } from "./LayerProcessFlow";
import { LiveAlertsPanel } from "./LiveAlertsPanel";

function buildInitialSubscribed(): Record<string, boolean> {
  const m: Record<string, boolean> = {};
  for (const c of agentCategories) {
    for (const a of c.agents) {
      if (a.status === "coming-soon") m[a.id] = false;
      else m[a.id] = a.status === "subscribed" || a.status === "beta";
    }
  }
  return m;
}

export function CommandCenter() {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState<Record<string, boolean>>(buildInitialSubscribed);

  const addToLayer = useCallback((id: string) => {
    setSubscribed((prev) => ({ ...prev, [id]: true }));
  }, []);

  return (
    <>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col border-b border-[#0d3d2e]/10 bg-[#f8faf9] lg:min-h-[600px] lg:border-b-0 lg:border-r">
        <div className="shrink-0 border-b border-[#0d3d2e]/8 px-4 py-4 sm:px-7 sm:py-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2a9d78]">AGENTS</p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-[#0d3d2e] sm:text-2xl">
                Choose the agents Starred should run
              </h2>
              <p className="mt-2 text-[11px] leading-relaxed text-[#3d5249] sm:text-[12px] sm:leading-relaxed">
                Each agent monitors a specific risk, detects changes, and alerts the right owner when action is needed.
              </p>
            </div>
            <div className="w-full sm:ml-auto sm:w-auto">
              <LayerProcessFlow />
            </div>
          </div>
        </div>
        <AgentLibrary
          selectedAgentId={selectedAgentId}
          onSelectAgent={setSelectedAgentId}
          subscribed={subscribed}
          onAddToLayer={addToLayer}
        />
      </div>
      <LiveAlertsPanel selectedAgentId={selectedAgentId} />
    </>
  );
}
