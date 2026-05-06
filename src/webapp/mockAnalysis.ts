import { FormData, SnapshotReport } from "./types";

function hashValue(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function scoreLabel(score: number): "Strong" | "Mixed" | "At Risk" {
  if (score >= 72) return "Strong";
  if (score >= 52) return "Mixed";
  return "At Risk";
}

function statusFromScore(score: number): "Above benchmark" | "Near benchmark" | "Below benchmark" {
  if (score >= 72) return "Above benchmark";
  if (score >= 55) return "Near benchmark";
  return "Below benchmark";
}

function atsSignal(ats: FormData["ats"]): { scoreDelta: number; insight: string; risk: string } {
  switch (ats) {
    case "Workday":
      return {
        scoreDelta: -10,
        insight: "Application process may indicate higher complexity in early stages.",
        risk: "Application experience appears to carry higher drop-off risk when forms are lengthy.",
      };
    case "Greenhouse":
    case "Lever":
      return {
        scoreDelta: 6,
        insight: "Current setup suggests a strong process foundation for structured hiring.",
        risk: "Experience visibility may remain limited without stage-level sentiment measurement.",
      };
    case "SmartRecruiters":
      return {
        scoreDelta: 3,
        insight: "Pipeline visibility appears relatively strong across open roles.",
        risk: "Experience layer may be less explicit unless candidate feedback loops are active.",
      };
    case "iCIMS":
      return {
        scoreDelta: -2,
        insight: "Process governance appears established, with room for clearer candidate touchpoints.",
        risk: "Communication consistency may vary between teams if ownership is distributed.",
      };
    case "Jobvite":
      return {
        scoreDelta: 1,
        insight: "Hiring workflows suggest practical structure with moderate flexibility.",
        risk: "Interview consistency may depend on how teams calibrate feedback expectations.",
      };
    default:
      return {
        scoreDelta: -4,
        insight: "Public setup signals are mixed, which can make candidate expectations harder to set.",
        risk: "Without clear process signals, communication expectations may appear ambiguous.",
      };
  }
}

export function generateSnapshot(input: FormData): SnapshotReport {
  const seed = hashValue(`${input.careerPageUrl}|${input.companyName}|${input.companyWebsite}|${input.ats}`);
  const base = 56 + (seed % 22);
  const ats = atsSignal(input.ats);
  const score = Math.max(32, Math.min(92, base + ats.scoreDelta));
  const signalLabel = scoreLabel(score);
  const logoText = input.companyName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const signalInterpretation =
    signalLabel === "Strong"
      ? "Relatively clear visibility across candidate touchpoints, with some opportunities to tighten consistency."
      : signalLabel === "Mixed"
        ? "Mixed visibility across candidate touchpoints, with opportunity to improve communication clarity."
        : "Early signals suggest meaningful gaps in candidate-facing clarity across stages.";

  const benchmarkPosition =
    signalLabel === "Strong"
      ? "Around top-performing TA teams on public communication signals"
      : signalLabel === "Mixed"
        ? "Below top-performing TA teams on communication clarity"
        : "Behind common benchmark patterns for candidate expectation-setting";

  const communicationClarity = Math.max(35, Math.min(90, score - 6));
  const processTransparency = Math.max(35, Math.min(90, score - 4));
  const candidateTrustSignals = Math.max(35, Math.min(90, score - 7));
  const interviewCoordination = Math.max(35, Math.min(90, score - 5));
  const hiringConsistency = Math.max(35, Math.min(90, score - 3));

  return {
    careerPageUrl: input.careerPageUrl,
    companyName: input.companyName,
    companyWebsite: input.companyWebsite,
    ats: input.ats,
    companyLogoText: logoText || "CO",
    hiringMaturityLabel: signalLabel === "Strong" ? "Mature hiring signal profile" : signalLabel === "Mixed" ? "Developing hiring signal profile" : "Early-stage hiring signal profile",
    benchmarkComparisonLabel: signalLabel === "Strong" ? "Above benchmark on candidate-facing consistency" : signalLabel === "Mixed" ? "Near benchmark, with communication gaps" : "Below benchmark on communication clarity",
    benchmarkCohortSimilarity: `${72 + (seed % 18)}% similarity to enterprise TA benchmark cohort`,
    signalLabel,
    signalInterpretation,
    benchmarkPosition,
    executiveSummary: `${input.companyName} shows signals of hiring maturity, but benchmark evidence suggests candidate trust may weaken during interview-stage handoffs and communication gaps between stages.`,
    signalScores: [
      {
        name: "Communication clarity",
        score: communicationClarity,
        status: statusFromScore(communicationClarity),
      },
      {
        name: "Process transparency",
        score: processTransparency,
        status: statusFromScore(processTransparency),
      },
      {
        name: "Candidate trust signals",
        score: candidateTrustSignals,
        status: statusFromScore(candidateTrustSignals),
      },
      {
        name: "Interview coordination",
        score: interviewCoordination,
        status: statusFromScore(interviewCoordination),
      },
      {
        name: "Hiring consistency",
        score: hiringConsistency,
        status: statusFromScore(hiringConsistency),
      },
    ],
    observedSignals: [
      "No visible interview timeline expectations.",
      "Limited recruiter ownership clarity across public touchpoints.",
      "Careers page appears to include limited process transparency.",
      "Candidate preparation guidance is not clearly surfaced.",
      "ATS flow appears optimized for speed over transparency.",
    ],
    benchmarkComparison: [
      {
        metric: "Communication transparency",
        direction: "down",
        label: "Below benchmark",
      },
      {
        metric: "Application simplicity",
        direction: "flat",
        label: "Near benchmark",
      },
      {
        metric: "Employer branding consistency",
        direction: "up",
        label: "Above benchmark",
      },
    ],
    trustMoments: [
      "After application submission",
      "Between interview rounds",
      "Post-final interview communication",
    ],
    frictionSignals: [
      "Candidates may struggle to understand what happens between interview stages and when to expect updates.",
      `The hiring journey appears structured operationally (${ats.insight.toLowerCase()}), but expectation-setting may vary across touchpoints.`,
      "Public signals suggest limited visibility into how candidates experience the process after applying.",
    ],
    whyThisMatters: [
      "Lower candidate confidence late-stage",
      "Inconsistent recruiter follow-up",
      "Increased drop-off after interviews",
      "Weaker employer brand trust",
    ],
    priorities: [
      "Improve interview timeline transparency",
      "Reduce silence between interview rounds",
      "Clarify recruiter ownership",
      "Set candidate expectations earlier",
    ],
  };
}
