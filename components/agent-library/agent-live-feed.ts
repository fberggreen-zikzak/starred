import { agentExampleAlerts } from "./agent-example-content";
import { findAgentById, type LibraryAgent } from "./library-agents-data";
import type { LiveFeedAlertItem } from "./live-alerts-data";
import { liveFeedAlerts } from "./live-alerts-data";

function agentDisplayName(agent: LibraryAgent): string {
  return agent.name.replace(/\s+Agent\s*$/i, "").trim();
}

const channels = ["Slack + Email", "Slack + Dashboard", "Email + Dashboard", "Email + Executive summary"] as const;

function channelForIndex(i: number): string {
  return channels[i % channels.length]!;
}

/**
 * When no agent is selected: default cross-agent feed.
 * When an agent is selected: representative alerts for that specialist agent.
 */
export function getFeedAlertsForAgent(selectedAgentId: string | null): LiveFeedAlertItem[] {
  if (!selectedAgentId) return liveFeedAlerts;

  const agent = findAgentById(selectedAgentId);
  if (!agent) return liveFeedAlerts;

  const short = agentDisplayName(agent);
  const ex = agentExampleAlerts[selectedAgentId];
  const out: LiveFeedAlertItem[] = [];

  if (ex) {
    out.push({
      id: `${selectedAgentId}-example`,
      title: ex.title,
      description: ex.description,
      owner: ex.owner,
      agent: short,
      severity: ex.severity,
      channel: channelForIndex(0),
    });
  }

  out.push(
    {
      id: `${selectedAgentId}-signals`,
      title: "Signals in view",
      description: agent.monitorsSignals,
      owner: "Your routing rules",
      agent: short,
      severity: "Medium",
      channel: channelForIndex(1),
    },
    {
      id: `${selectedAgentId}-trigger`,
      title: "Alert condition",
      description: agent.alertTrigger,
      owner: "Your routing rules",
      agent: short,
      severity: "High",
      channel: channelForIndex(2),
    },
    {
      id: `${selectedAgentId}-scope`,
      title: "Coverage",
      description: agent.watchDescription,
      owner: "Your routing rules",
      agent: short,
      severity: "Medium",
      channel: channelForIndex(3),
    },
  );

  return out.slice(0, 4);
}
