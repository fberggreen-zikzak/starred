export type AlertSeverity = "High" | "Medium";

export type LiveAlertItem = {
  title: string;
  description: string;
  owner: string;
  severity: AlertSeverity;
  /** Subscribed agent that surfaced this signal */
  agent?: string;
  /** Where this alert was delivered for this example */
  channel?: string;
};

export type LiveFeedAlertItem = LiveAlertItem & { id: string; agent: string; channel: string };

/** Live feed sample: representative alerts triggered by subscribed agents */
export const liveFeedAlerts: LiveFeedAlertItem[] = [
  {
    id: "feed-brand-sentiment",
    title: "Negative sentiment trending up",
    description:
      "Mentions about interview communication are up 28% in public feedback and reviews.",
    owner: "Employer Brand",
    agent: "Employer Brand Sentiment",
    severity: "Medium",
    channel: "Slack + Email",
  },
  {
    id: "feed-sla",
    title: "Feedback SLA breached",
    description: "Average feedback time in Sales is 4.2 days vs target of 2 days.",
    owner: "Recruiting Manager",
    agent: "SLA Monitoring",
    severity: "High",
    channel: "Email + Dashboard",
  },
  {
    id: "feed-drop-off",
    title: "Candidate drop-off increasing",
    description: "Engineering withdrawals increased 22% over the last 14 days.",
    owner: "TA Lead",
    agent: "Candidate Drop-off",
    severity: "High",
    channel: "Slack + Email",
  },
  {
    id: "feed-eu-pay",
    title: "EU pay transparency risk",
    description: "12 active EU job ads are missing salary range information.",
    owner: "People Ops",
    agent: "EU Pay Transparency",
    severity: "High",
    channel: "Email + Executive summary",
  },
];
