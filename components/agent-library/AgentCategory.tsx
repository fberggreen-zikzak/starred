import type { AgentCategoryDef } from "./library-agents-data";
import { AgentSubscriptionCard } from "./AgentSubscriptionCard";

export function AgentCategory({
  category,
  showCategoryHeading = true,
  selectedAgentId,
  onSelectAgent,
  subscribed,
  onAddToLayer,
}: {
  category: AgentCategoryDef;
  showCategoryHeading?: boolean;
  selectedAgentId: string | null;
  onSelectAgent: (id: string) => void;
  subscribed: Record<string, boolean>;
  onAddToLayer: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      {showCategoryHeading ? (
        <header className="border-b border-[#0d3d2e]/10 pb-2.5">
          <h3 className="text-[13px] font-semibold tracking-tight text-[#0d3d2e]">{category.title}</h3>
          <p className="mt-0.5 text-[11px] leading-snug text-[#5c6f66]">{category.subtitle}</p>
        </header>
      ) : null}
      <div className={`grid gap-3 sm:grid-cols-2 xl:grid-cols-3 ${showCategoryHeading ? "pt-1" : ""}`}>
        {category.agents.map((agent) => (
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
  );
}
