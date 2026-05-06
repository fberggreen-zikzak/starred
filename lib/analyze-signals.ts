import OpenAI from "openai";
import { ExtractedSignals, SnapshotResult } from "./analyzer-types";

const SYSTEM_PROMPT = `You are an expert in candidate experience benchmarking and hiring operations.

Analyze public hiring signals from a careers page.

You are NOT evaluating the company definitively.

Use directional and benchmark-informed language only.

Avoid certainty.

Identify:
- communication clarity
- process transparency
- recruiter ownership visibility
- application simplicity
- candidate trust signals
- employer branding maturity
- interview coordination clarity
- expectation-setting quality

Output strict JSON with keys:
executiveSummary, strengths, potentialGaps, trustMoments, benchmarkComparison, recommendedFocusAreas, scorecards, hiringMaturity, benchmarkCohort.
`;

function clampScore(value: number): number {
  return Math.max(30, Math.min(90, Math.round(value)));
}

function toLevel(score: number): "High" | "Medium" | "Low" {
  if (score >= 72) return "High";
  if (score >= 54) return "Medium";
  return "Low";
}

function toBenchmark(score: number): "Above benchmark" | "Near benchmark" | "Below benchmark" {
  if (score >= 72) return "Above benchmark";
  if (score >= 54) return "Near benchmark";
  return "Below benchmark";
}

function confidenceFromEvidence(evidencePoints: number): "High" | "Medium" | "Low" {
  if (evidencePoints >= 8) return "High";
  if (evidencePoints >= 4) return "Medium";
  return "Low";
}

function atsAdjustment(ats: string): number {
  const lower = ats.toLowerCase();
  if (lower.includes("workday")) return -4;
  if (lower.includes("greenhouse") || lower.includes("lever")) return 2;
  if (lower.includes("smartrecruiters")) return 1;
  return 0;
}

function heuristicScorecards(signals: ExtractedSignals) {
  const atsDelta = atsAdjustment(signals.atsProvider);
  const transparencyEvidence = signals.processTransparency.length + signals.timelineMentions.length;
  const communicationEvidence = signals.communicationExpectationSignals.length + signals.recruiterVisibility.length;
  const trustEvidence = signals.interviewGuidance.length + signals.timelineMentions.length + signals.communicationExpectationSignals.length;
  const coordinationEvidence = signals.timelineMentions.length + signals.recruiterVisibility.length;
  const brandingEvidence = signals.employerBrandingSignals.length + signals.faqSignals.length;
  const frictionPenalty = signals.applicationFrictionSignals.length + signals.redirectSignals.length;

  const communicationClarity = clampScore(50 + communicationEvidence * 5 - frictionPenalty * 2 + atsDelta);
  const processTransparency = clampScore(50 + transparencyEvidence * 5 - frictionPenalty * 2 + atsDelta);
  const candidateTrustSignals = clampScore(49 + trustEvidence * 5 - frictionPenalty * 2 + atsDelta);
  const interviewCoordination = clampScore(50 + coordinationEvidence * 5 - frictionPenalty * 2 + atsDelta);
  const employerBrandingConsistency = clampScore(52 + brandingEvidence * 5 - Math.max(0, frictionPenalty - 1) + atsDelta);

  return [
    {
      name: "Communication clarity",
      score: communicationClarity,
      level: toLevel(communicationClarity),
      benchmark: toBenchmark(communicationClarity),
      confidence: confidenceFromEvidence(communicationEvidence + signals.timelineMentions.length),
    },
    {
      name: "Process transparency",
      score: processTransparency,
      level: toLevel(processTransparency),
      benchmark: toBenchmark(processTransparency),
      confidence: confidenceFromEvidence(transparencyEvidence),
    },
    {
      name: "Candidate trust signals",
      score: candidateTrustSignals,
      level: toLevel(candidateTrustSignals),
      benchmark: toBenchmark(candidateTrustSignals),
      confidence: confidenceFromEvidence(trustEvidence),
    },
    {
      name: "Interview coordination",
      score: interviewCoordination,
      level: toLevel(interviewCoordination),
      benchmark: toBenchmark(interviewCoordination),
      confidence: confidenceFromEvidence(coordinationEvidence),
    },
    {
      name: "Employer branding consistency",
      score: employerBrandingConsistency,
      level: toLevel(employerBrandingConsistency),
      benchmark: toBenchmark(employerBrandingConsistency),
      confidence: confidenceFromEvidence(brandingEvidence),
    },
  ];
}

function fallbackSnapshot(signals: ExtractedSignals): SnapshotResult {
  const scorecards = heuristicScorecards(signals);
  const avgScore = Math.round(scorecards.reduce((sum, card) => sum + card.score, 0) / scorecards.length);

  return {
    companyName: signals.companyName,
    careerPageUrl: signals.sourceUrl,
    atsProvider: signals.atsProvider,
    hiringMaturity: avgScore >= 70 ? "Mature" : avgScore >= 54 ? "Developing" : "Emerging",
    benchmarkCohort: "Enterprise TA teams",
    benchmarkSimilarity: `${72 + ((scorecards[0]?.score ?? 60) % 18)}% similarity to benchmark cohort`,
    executiveSummary: `${signals.companyName} shows directional hiring maturity signals, while benchmark-informed interpretation suggests candidate trust may weaken during interview handoffs and post-application communication windows.`,
    observedPublicSignals: [
      signals.timelineMentions[0]
        ? "Public page surfaces limited timeline expectations."
        : "Public page does not surface interview timeline expectations.",
      signals.recruiterVisibility[0]
        ? "Recruiter ownership appears referenced but not consistently visible."
        : "Recruiter ownership is not visible across public touchpoints.",
      signals.processTransparency[0]
        ? "Process transparency appears partially visible across the page."
        : "Careers page lacks clear process transparency details.",
      signals.interviewGuidance[0]
        ? "Candidate preparation guidance appears lightweight."
        : "Candidate preparation guidance is not clearly visible.",
      signals.atsProvider.includes("Not")
        ? "Application flow appears external with limited context continuity."
        : `ATS flow appears tied to ${signals.atsProvider}, which may indicate speed priority over transparency.`,
    ],
    benchmarkComparison: [
      { metric: "Communication transparency", symbol: "↓", position: "Below benchmark" },
      { metric: "Application simplicity", symbol: "≈", position: "Near benchmark" },
      { metric: "Employer branding consistency", symbol: "↑", position: "Above benchmark" },
    ],
    trustMoments: ["After application submission", "Between interview rounds", "Post-final interview communication"],
    recommendedFocusAreas: [
      "Improve interview timeline transparency",
      "Reduce silence between interview rounds",
      "Clarify recruiter ownership",
      "Set candidate expectations earlier",
    ],
    strengths: [
      "Employer branding visibility appears established.",
      "Process structure signals suggest baseline hiring maturity.",
    ],
    potentialGaps: [
      "Communication expectations may indicate gaps after application submission.",
      "Candidate guidance appears limited around interview progression.",
    ],
    scorecards,
  };
}

type BuildSnapshotOptions = {
  observedOnly?: boolean;
};

export async function buildSnapshot(signals: ExtractedSignals, options: BuildSnapshotOptions = {}): Promise<SnapshotResult> {
  if (options.observedOnly) return fallbackSnapshot(signals);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return fallbackSnapshot(signals);

  const client = new OpenAI({ apiKey });
  const completion = await client.responses.create({
    model: "gpt-4.1-mini",
    temperature: 0.4,
    input: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: JSON.stringify({
          sourceUrl: signals.sourceUrl,
          companyName: signals.companyName,
          atsProvider: signals.atsProvider,
          signals,
        }),
      },
    ],
  });

  const raw = completion.output_text;
  try {
    const parsed = JSON.parse(raw);
    const base = fallbackSnapshot(signals);
    const parsedScorecards = Array.isArray(parsed.scorecards)
      ? parsed.scorecards.filter(
          (card: unknown) =>
            typeof card === "object" &&
            card !== null &&
            typeof (card as { name?: unknown }).name === "string" &&
            typeof (card as { score?: unknown }).score === "number",
        )
      : null;

    const safeScorecards =
      parsedScorecards && parsedScorecards.length > 0
        ? parsedScorecards.map((card: { name: string; score: number; level?: string; benchmark?: string; confidence?: string }) => {
            const score = clampScore(card.score);
            return {
              name: card.name,
              score,
              level: card.level === "High" || card.level === "Medium" || card.level === "Low" ? card.level : toLevel(score),
              benchmark:
                card.benchmark === "Above benchmark" || card.benchmark === "Near benchmark" || card.benchmark === "Below benchmark"
                  ? card.benchmark
                  : toBenchmark(score),
              confidence:
                card.confidence === "High" || card.confidence === "Medium" || card.confidence === "Low"
                  ? card.confidence
                  : "Medium",
            };
          })
        : base.scorecards;

    return {
      ...base,
      executiveSummary: parsed.executiveSummary ?? base.executiveSummary,
      strengths: parsed.strengths ?? base.strengths,
      potentialGaps: parsed.potentialGaps ?? base.potentialGaps,
      trustMoments: parsed.trustMoments ?? base.trustMoments,
      benchmarkComparison: parsed.benchmarkComparison ?? base.benchmarkComparison,
      recommendedFocusAreas: parsed.recommendedFocusAreas ?? base.recommendedFocusAreas,
      scorecards: safeScorecards,
      hiringMaturity: parsed.hiringMaturity ?? base.hiringMaturity,
      benchmarkCohort: parsed.benchmarkCohort ?? base.benchmarkCohort,
    };
  } catch {
    return fallbackSnapshot(signals);
  }
}
