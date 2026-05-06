export type AtsOption =
  | "Greenhouse"
  | "Lever"
  | "Workday"
  | "SmartRecruiters"
  | "iCIMS"
  | "Jobvite"
  | "Other / Not sure";

export type FormData = {
  careerPageUrl: string;
  companyName: string;
  companyWebsite: string;
  ats: AtsOption;
  manualContent?: string;
};

export type RiskItem = {
  category: string;
  detail: string;
};

export type SignalScore = {
  name: string;
  score: number;
  status: "Above benchmark" | "Near benchmark" | "Below benchmark";
};

export type BenchmarkDelta = {
  metric: string;
  direction: "up" | "flat" | "down";
  label: string;
};

export type SnapshotReport = {
  careerPageUrl: string;
  companyName: string;
  companyWebsite: string;
  ats: AtsOption;
  companyLogoText: string;
  hiringMaturityLabel: string;
  benchmarkComparisonLabel: string;
  benchmarkCohortSimilarity: string;
  signalLabel: "Strong" | "Mixed" | "At Risk";
  signalInterpretation: string;
  benchmarkPosition: string;
  executiveSummary: string;
  signalScores: SignalScore[];
  observedSignals: string[];
  benchmarkComparison: BenchmarkDelta[];
  trustMoments: string[];
  frictionSignals: string[];
  whyThisMatters: string[];
  priorities: string[];
};
