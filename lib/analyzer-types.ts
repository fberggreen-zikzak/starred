export type ExtractedSignals = {
  sourceUrl: string;
  hostname: string;
  companyName: string;
  atsProvider: string;
  processTransparency: string[];
  timelineMentions: string[];
  recruiterVisibility: string[];
  interviewGuidance: string[];
  faqSignals: string[];
  employerBrandingSignals: string[];
  applicationFrictionSignals: string[];
  redirectSignals: string[];
  communicationExpectationSignals: string[];
  rawTextSample: string;
};

export type ScoreLevel = "High" | "Medium" | "Low";
export type BenchmarkDirection = "Above benchmark" | "Near benchmark" | "Below benchmark";

export type Scorecard = {
  name: string;
  score: number;
  level: ScoreLevel;
  benchmark: BenchmarkDirection;
  confidence: ScoreLevel;
};

export type SnapshotResult = {
  companyName: string;
  careerPageUrl: string;
  atsProvider: string;
  hiringMaturity: "Emerging" | "Developing" | "Mature";
  benchmarkCohort: string;
  benchmarkSimilarity: string;
  executiveSummary: string;
  observedPublicSignals: string[];
  benchmarkComparison: Array<{ metric: string; symbol: "↑" | "≈" | "↓"; position: BenchmarkDirection }>;
  trustMoments: string[];
  recommendedFocusAreas: string[];
  strengths: string[];
  potentialGaps: string[];
  scorecards: Scorecard[];
};
