/** 18 specialist agents — operational card copy */

export type AgentStatus = "subscribed" | "subscribe" | "beta" | "coming-soon";

export type AgentIconKey =
  | "trend-down"
  | "users"
  | "clock"
  | "chart"
  | "message"
  | "heart-pulse"
  | "sparkle"
  | "scale"
  | "globe"
  | "document";

export type AlertPriceBand = 1 | 2 | 3;

export type LibraryAgent = {
  id: string;
  /** Full agent name on the card */
  name: string;
  /** Opening line: what risk or signal this agent watches */
  watchDescription: string;
  /** Data sources and signal streams · separated */
  monitorsSignals: string;
  /** Clear alert trigger */
  alertTrigger: string;
  /** Display price per generated alert */
  pricePerAlert: AlertPriceBand;
  status: AgentStatus;
  icon: AgentIconKey;
};

export type AgentCategoryDef = {
  id: string;
  title: string;
  subtitle: string;
  agents: LibraryAgent[];
};

export const agentCategories: AgentCategoryDef[] = [
  {
    id: "hiring",
    title: "Hiring Insights",
    subtitle: "Candidate, recruiter, and hiring-manager signals",
    agents: [
      {
        id: "candidate-drop-off",
        name: "Candidate Drop-off Agent",
        watchDescription:
          "Watches funnel withdrawals and stage-level friction so you catch drop-off before it spreads across roles or markets.",
        monitorsSignals: "Pipeline stages · Withdrawal reasons · Role and market cohorts",
        alertTrigger: "Drop-off increases materially for a role, market, or team versus your baseline.",
        pricePerAlert: 2,
        status: "subscribed",
        icon: "trend-down",
      },
      {
        id: "hiring-manager-conduct",
        name: "Hiring Manager Conduct Agent",
        watchDescription:
          "Watches candidate comments and interview feedback for signs of inappropriate, biased, or inconsistent interview behavior.",
        monitorsSignals: "Candidate comments · Interview feedback · Team trends",
        alertTrigger: "Conduct risk is detected for a team, role, or hiring manager.",
        pricePerAlert: 2,
        status: "subscribed",
        icon: "users",
      },
      {
        id: "sla-monitoring",
        name: "SLA Monitoring Agent",
        watchDescription:
          "Watches feedback turnaround, candidate communication, and handoff timing against the SLAs you define.",
        monitorsSignals: "Feedback timestamps · Candidate messages · Process checkpoints",
        alertTrigger: "SLAs breach or delay trends exceed threshold in a team, function, or region.",
        pricePerAlert: 1,
        status: "subscribed",
        icon: "clock",
      },
      {
        id: "interview-quality",
        name: "Interview Quality Agent",
        watchDescription:
          "Watches interview consistency, preparedness, fairness, and candidate perception.",
        monitorsSignals: "Interview feedback · candidate ratings · benchmark gaps",
        alertTrigger: "Interview quality drops below benchmark for a role, team, or region.",
        pricePerAlert: 2,
        status: "subscribe",
        icon: "chart",
      },
      {
        id: "recruiter-responsiveness",
        name: "Recruiter Responsiveness Agent",
        watchDescription:
          "Watches recruiter follow-up, message quality, and backlog so slow pockets surface before candidates churn.",
        monitorsSignals: "Response times · Message threads · Workload signals",
        alertTrigger: "Response gaps widen by market, team, or recruiter cohort.",
        pricePerAlert: 1,
        status: "subscribe",
        icon: "message",
      },
      {
        id: "hiring-outcome-patterns",
        name: "Hiring Outcome Patterns Agent",
        watchDescription:
          "Watches which hiring practices correlate with stronger or weaker downstream outcomes.",
        monitorsSignals: "Process attributes · Offer and start data · Performance signals",
        alertTrigger: "Outcome patterns diverge from baseline for a role family or region.",
        pricePerAlert: 3,
        status: "beta",
        icon: "chart",
      },
    ],
  },
  {
    id: "workforce",
    title: "Workforce Insights",
    subtitle: "People, culture, onboarding, retention, and employee experience signals",
    agents: [
      {
        id: "onboarding-health",
        name: "Onboarding Health Agent",
        watchDescription:
          "Watches new-hire experience, expectations, and enablement through the first critical weeks.",
        monitorsSignals: "Pulse surveys · Manager check-ins · Theme extraction",
        alertTrigger: "Early-experience scores slip or negative themes cluster by site or team.",
        pricePerAlert: 2,
        status: "subscribed",
        icon: "heart-pulse",
      },
      {
        id: "offboarding-themes",
        name: "Offboarding Themes Agent",
        watchDescription:
          "Watches exit and resignation language for recurring drivers of turnover.",
        monitorsSignals: "Exit interviews · Surveys · HRIS themes",
        alertTrigger: "A theme spikes in volume or crosses a severity threshold you set.",
        pricePerAlert: 1,
        status: "subscribed",
        icon: "trend-down",
      },
      {
        id: "workforce-sentiment",
        name: "Workforce Sentiment Agent",
        watchDescription:
          "Watches employee tone and themes across teams, regions, and employee segments.",
        monitorsSignals: "Engagement pulses · Comments · Segment breakdowns",
        alertTrigger: "Sentiment moves outside the guardrails you define.",
        pricePerAlert: 2,
        status: "subscribe",
        icon: "message",
      },
      {
        id: "manager-effectiveness",
        name: "Manager Effectiveness Agent",
        watchDescription:
          "Watches how employees rate clarity, support, coaching, and trust for their managers.",
        monitorsSignals: "360 and pulse · Team comments · Benchmarks",
        alertTrigger: "Manager scores trail benchmark or worsen within a team or region.",
        pricePerAlert: 2,
        status: "subscribe",
        icon: "users",
      },
      {
        id: "retention-risk",
        name: "Retention Risk Agent",
        watchDescription:
          "Watches disengagement, workload strain, and attrition precursors for cohorts you care about.",
        monitorsSignals: "Risk models · Behavior signals · Cohort definitions",
        alertTrigger: "Risk scores rise for a tracked cohort or population slice.",
        pricePerAlert: 3,
        status: "beta",
        icon: "chart",
      },
      {
        id: "culture-alignment",
        name: "Culture Alignment Agent",
        watchDescription:
          "Watches whether day-to-day experience reflects the culture and values you publish.",
        monitorsSignals: "Values-linked feedback · Team patterns · Regional drift",
        alertTrigger: "Alignment weakens materially by team or region.",
        pricePerAlert: 2,
        status: "coming-soon",
        icon: "sparkle",
      },
    ],
  },
  {
    id: "market",
    title: "Market & Compliance Insights",
    subtitle: "Employer brand, compensation, job ads, market movement, and regulatory readiness",
    agents: [
      {
        id: "eu-pay-transparency",
        name: "EU Pay Transparency Agent",
        watchDescription:
          "Watches active job posts and comp language for EU pay-transparency readiness.",
        monitorsSignals: "Live job ads · Comp fields · Geography rules",
        alertTrigger: "Ads in scope are missing required salary or transparency elements.",
        pricePerAlert: 2,
        status: "subscribed",
        icon: "scale",
      },
      {
        id: "salary-benchmark",
        name: "Salary Benchmark Agent",
        watchDescription:
          "Watches candidate expectations, posted ranges, and market benchmarks for critical roles.",
        monitorsSignals: "Pipeline comp data · Market curves · Offer history",
        alertTrigger: "Meaningful pay gaps open up for a role, level, or location.",
        pricePerAlert: 3,
        status: "subscribe",
        icon: "chart",
      },
      {
        id: "employer-brand-sentiment",
        name: "Employer Brand Sentiment Agent",
        watchDescription:
          "Watches what candidates and employees say in feedback, reviews, and public channels.",
        monitorsSignals: "Reviews · Social and web mentions · Internal comments",
        alertTrigger: "Negative sentiment accelerates or crosses a threshold you own.",
        pricePerAlert: 2,
        status: "subscribed",
        icon: "message",
      },
      {
        id: "evp-alignment",
        name: "EVP Alignment Agent",
        watchDescription:
          "Watches the gap between your EVP story and what candidates and employees actually report.",
        monitorsSignals: "EVP pillars · Survey themes · Candidate journeys",
        alertTrigger: "Reported experience no longer matches the promise for a segment or journey.",
        pricePerAlert: 1,
        status: "subscribe",
        icon: "sparkle",
      },
      {
        id: "job-ad-risk",
        name: "Job Ad Risk Agent",
        watchDescription:
          "Watches postings for compliance, inclusion, and conversion risks in copy and structure.",
        monitorsSignals: "Job descriptions · Template rules · Jurisdictional requirements",
        alertTrigger: "Copy or structure triggers a risk flag or pattern you route to Legal or TA.",
        pricePerAlert: 2,
        status: "beta",
        icon: "document",
      },
      {
        id: "talent-market-movement",
        name: "Talent Market Movement Agent",
        watchDescription:
          "Watches competitor hiring motion, role demand, and market shifts relevant to your plans.",
        monitorsSignals: "Labor market feeds · Competitor signals · Role demand indexes",
        alertTrigger: "Market movement threatens priorities for a role family or geography.",
        pricePerAlert: 3,
        status: "coming-soon",
        icon: "globe",
      },
    ],
  },
];

export function findAgentById(id: string): LibraryAgent | undefined {
  for (const c of agentCategories) {
    const a = c.agents.find((x) => x.id === id);
    if (a) return a;
  }
  return undefined;
}

export const allLibraryAgents: LibraryAgent[] = agentCategories.flatMap((c) => c.agents);
