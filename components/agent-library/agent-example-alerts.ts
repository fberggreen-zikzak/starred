/** Example Live Alert copy shown when an agent tile is selected */

export const AGENT_EXAMPLE_ALERTS: Record<string, { title: string; description: string }> = {
  conduct: {
    title: "Potential conduct risk detected",
    description:
      "3 candidates reported inappropriate comments linked to Engineering interviews in the last 14 days.",
  },
  dropoff: {
    title: "Withdrawal spike in pipeline",
    description:
      "Engineering roles show 18% higher candidate drop-off vs. prior quarter—concentrated in onsite stages.",
  },
  sla: {
    title: "Feedback SLA breached",
    description: "Average feedback time in Sales is 4.2 days vs target of 2 days.",
  },
  quality: {
    title: "Quality-of-hire signal shift",
    description:
      "New hire performance ratings in Sales are trending below your peer benchmark for the third month running.",
  },
  pay: {
    title: "EU pay transparency risk",
    description: "12 active EU job ads are missing salary range information.",
  },
  evp: {
    title: "EVP experience gap",
    description:
      "Candidate NPS for “leadership transparency” diverges from the EVP themes shown on your careers site.",
  },
  brand: {
    title: "Negative sentiment trending up",
    description: "Mentions about interview communication are up 28%.",
  },
  onboarding: {
    title: "Onboarding access friction",
    description:
      "42% of recent hires in EMEA report incomplete systems access by day five—above your 15% threshold.",
  },
};

export const LIVE_ALERT_FEED: readonly { title: string; description: string }[] = [
  AGENT_EXAMPLE_ALERTS.conduct,
  AGENT_EXAMPLE_ALERTS.sla,
  AGENT_EXAMPLE_ALERTS.pay,
  AGENT_EXAMPLE_ALERTS.brand,
] as const;
