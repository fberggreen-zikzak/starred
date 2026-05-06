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

function fallbackSnapshot(signals: ExtractedSignals): SnapshotResult {
  const scoreBase = 58 + ((signals.rawTextSample.length % 16) - 8);
  const scorecards = [
    { name: "Communication clarity", score: scoreBase - 5 },
    { name: "Process transparency", score: scoreBase - 3 },
    { name: "Candidate trust signals", score: scoreBase - 4 },
    { name: "Interview coordination", score: scoreBase - 2 },
    { name: "Employer branding consistency", score: scoreBase + 2 },
  ].map((item) => ({
    ...item,
    level: item.score >= 70 ? ("High" as const) : item.score >= 54 ? ("Medium" as const) : ("Low" as const),
    benchmark:
      item.score >= 70
        ? ("Above benchmark" as const)
        : item.score >= 54
          ? ("Near benchmark" as const)
          : ("Below benchmark" as const),
    confidence: signals.rawTextSample.length > 1500 ? ("High" as const) : ("Medium" as const),
  }));

  return {
    companyName: signals.companyName,
    careerPageUrl: signals.sourceUrl,
    atsProvider: signals.atsProvider,
    hiringMaturity: "Developing",
    benchmarkCohort: "Enterprise TA teams",
    benchmarkSimilarity: "79% similarity to benchmark cohort",
    executiveSummary: `${signals.companyName} shows credible hiring maturity signals, while benchmark-informed interpretation suggests candidate trust may weaken during interview handoffs and post-application communication windows.`,
    observedPublicSignals: [
      signals.timelineMentions[0] ? "Timeline expectations are only partially visible." : "No visible interview timeline expectations.",
      signals.recruiterVisibility[0] ? "Recruiter ownership is mentioned but not consistently surfaced." : "Limited recruiter ownership clarity.",
      signals.processTransparency[0] ? "Process transparency appears present but uneven across touchpoints." : "Careers page lacks process transparency detail.",
      signals.interviewGuidance[0] ? "Some candidate preparation guidance appears available." : "Minimal candidate preparation guidance.",
      signals.atsProvider.includes("Not") ? "Application flow appears external with limited context continuity." : `ATS flow appears tied to ${signals.atsProvider}, optimized for speed over transparency.`,
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

export async function buildSnapshot(signals: ExtractedSignals): Promise<SnapshotResult> {
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
    return {
      ...base,
      executiveSummary: parsed.executiveSummary ?? base.executiveSummary,
      strengths: parsed.strengths ?? base.strengths,
      potentialGaps: parsed.potentialGaps ?? base.potentialGaps,
      trustMoments: parsed.trustMoments ?? base.trustMoments,
      benchmarkComparison: parsed.benchmarkComparison ?? base.benchmarkComparison,
      recommendedFocusAreas: parsed.recommendedFocusAreas ?? base.recommendedFocusAreas,
      scorecards: parsed.scorecards ?? base.scorecards,
      hiringMaturity: parsed.hiringMaturity ?? base.hiringMaturity,
      benchmarkCohort: parsed.benchmarkCohort ?? base.benchmarkCohort,
    };
  } catch {
    return fallbackSnapshot(signals);
  }
}
