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

  return {
    careerPageUrl: input.careerPageUrl,
    companyName: input.companyName,
    companyWebsite: input.companyWebsite,
    ats: input.ats,
    signalLabel,
    signalInterpretation,
    benchmarkPosition,
    executiveSummary: [
      `${input.companyName} appears to have a reasonably structured hiring setup, but public candidate-facing signals suggest opportunities to improve communication consistency and expectation-setting.`,
      `Based on public signals, teams with similar setups often struggle most with visibility between interview stages and alignment across hiring stakeholders.`,
    ],
    observedSignals: [
      "Careers experience appears to include limited process guidance for what candidates should expect after applying.",
      "Interview timeline expectations are not clearly surfaced in public touchpoints.",
      "Candidate-facing touchpoints appear fragmented across stages, which may indicate uneven handoffs.",
      `ATS signal (${input.ats}) suggests limited public visibility into candidate experience feedback loops.`,
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
      "Improve expectation-setting between interview stages",
      "Measure candidate feedback at key journey moments",
      "Identify where hiring manager coordination impacts candidate confidence",
    ],
  };
}
