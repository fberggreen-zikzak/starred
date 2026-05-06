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
};

export type RiskItem = {
  category: string;
  detail: string;
};

export type SnapshotReport = {
  careerPageUrl: string;
  companyName: string;
  companyWebsite: string;
  ats: AtsOption;
  signalLabel: "Strong" | "Mixed" | "At Risk";
  signalInterpretation: string;
  benchmarkPosition: string;
  executiveSummary: string[];
  observedSignals: string[];
  frictionSignals: string[];
  whyThisMatters: string[];
  priorities: string[];
};
