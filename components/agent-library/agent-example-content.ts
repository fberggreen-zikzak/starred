import type { LiveAlertItem } from "./live-alerts-data";

/** Example alert shown in Live Alerts when an agent row is selected */
export const agentExampleAlerts: Record<string, LiveAlertItem> = {
  "candidate-drop-off": {
    title: "Withdrawal spike in Engineering",
    description:
      "Candidate withdrawals are up 22% vs the prior 30 days for Engineering roles in EMEA; stage-level friction is highest after onsite.",
    owner: "TA Lead",
    severity: "High",
  },
  "hiring-manager-conduct": {
    title: "Potential conduct risk detected",
    description:
      "3 candidates reported inappropriate comments linked to Engineering interviews in the last 14 days.",
    owner: "TA Lead",
    severity: "High",
  },
  "sla-monitoring": {
    title: "Feedback SLA breached",
    description: "Average feedback time in Sales is 4.2 days vs target of 2 days.",
    owner: "Recruiting Manager",
    severity: "Medium",
  },
  "interview-quality": {
    title: "Interview quality below benchmark",
    description:
      "Interview quality scores for DACH dropped below the regional benchmark for two consecutive weeks.",
    owner: "Head of Talent",
    severity: "Medium",
  },
  "recruiter-responsiveness": {
    title: "Follow-up delays in two markets",
    description:
      "Median recruiter response time exceeded 48h in the UK and DACH; candidate comments mention slow replies.",
    owner: "Recruiting Ops",
    severity: "Medium",
  },
  "hiring-outcome-patterns": {
    title: "Outcome pattern shift",
    description:
      "Structured interviews now correlate with stronger 90-day performance scores than unstructured panels in Product.",
    owner: "People Analytics",
    severity: "Medium",
  },
  "onboarding-health": {
    title: "Onboarding clarity gap",
    description:
      "New hires in Customer Success report unclear expectations in weeks 2–4; theme volume is up vs last quarter.",
    owner: "People Partner",
    severity: "Medium",
  },
  "offboarding-themes": {
    title: "Career growth top theme",
    description: "Career growth is now the dominant theme in exit interviews for Engineering and Product.",
    owner: "People Ops",
    severity: "Medium",
  },
  "workforce-sentiment": {
    title: "Sentiment dip in Operations",
    description: "Workforce sentiment in Operations is down 18% vs baseline; comments cluster around workload.",
    owner: "HRBP Operations",
    severity: "High",
  },
  "manager-effectiveness": {
    title: "Manager support below benchmark",
    description:
      "Manager support scores trail benchmark in two teams; employee comments reference unclear priorities.",
    owner: "L&D",
    severity: "Medium",
  },
  "retention-risk": {
    title: "Retention risk in new-hire cohort",
    description:
      "Risk signals increased for high-performing new hires in Sales within their first 120 days.",
    owner: "People Partner",
    severity: "High",
  },
  "culture-alignment": {
    title: "Culture signals preview",
    description: "Regional culture alignment scores will surface here when this agent is available.",
    owner: "People Ops",
    severity: "Medium",
  },
  "eu-pay-transparency": {
    title: "EU pay transparency risk",
    description: "12 active EU job ads are missing salary range information.",
    owner: "People Ops",
    severity: "High",
  },
  "salary-benchmark": {
    title: "Offer gap vs market",
    description:
      "Senior Backend candidates in your pipeline expect ~18% above the current posted range for that role family.",
    owner: "Comp & Benefits",
    severity: "Medium",
  },
  "employer-brand-sentiment": {
    title: "Negative sentiment trending up",
    description: "Mentions about interview communication are up 28% in public feedback and reviews.",
    owner: "Employer Brand",
    severity: "Medium",
  },
  "evp-alignment": {
    title: "EVP experience mismatch",
    description:
      "Candidates report the interview process doesn’t match the transparency promised in job ads for several roles.",
    owner: "Employer Brand",
    severity: "Medium",
  },
  "job-ad-risk": {
    title: "Job ad compliance flags",
    description:
      "Several postings use vague compensation and flexibility language that may increase conversion and compliance risk.",
    owner: "Legal & TA",
    severity: "High",
  },
  "talent-market-movement": {
    title: "Market movement preview",
    description:
      "Competitor hiring velocity and role-demand shifts will appear here when this agent launches.",
    owner: "Workforce Planning",
    severity: "Medium",
  },
};
