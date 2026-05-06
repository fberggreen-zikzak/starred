import { chromium } from "playwright";
import * as cheerio from "cheerio";
import { ExtractedSignals } from "./analyzer-types";

function detectAts(content: string): string {
  const lower = content.toLowerCase();
  if (lower.includes("greenhouse")) return "Greenhouse";
  if (lower.includes("lever.co") || lower.includes("jobs.lever")) return "Lever";
  if (lower.includes("workday") || lower.includes("myworkdayjobs")) return "Workday";
  if (lower.includes("smartrecruiters")) return "SmartRecruiters";
  if (lower.includes("icims")) return "iCIMS";
  if (lower.includes("jobvite")) return "Jobvite";
  return "Not clearly detected";
}

function collectMatches($: cheerio.CheerioAPI, patterns: RegExp[]): string[] {
  const text = $("body").text().replace(/\s+/g, " ");
  const matches = new Set<string>();
  for (const pattern of patterns) {
    const found = text.match(pattern);
    if (found) matches.add(found[0].trim());
  }
  return Array.from(matches).slice(0, 5);
}

function inferCompanyName(hostname: string): string {
  const cleaned = hostname.replace(/^www\./, "").split(".")[0] ?? "";
  return cleaned
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

export async function extractPublicSignals(url: string): Promise<ExtractedSignals> {
  const normalized = url.startsWith("http") ? url : `https://${url}`;
  const parsed = new URL(normalized);

  let html = "";
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(normalized, { waitUntil: "domcontentloaded", timeout: 15000 });
    html = await page.content();
    await browser.close();
  } catch {
    const response = await fetch(normalized, { cache: "no-store" });
    html = await response.text();
  }

  const $ = cheerio.load(html);
  const fullText = $("body").text().replace(/\s+/g, " ").trim();
  const sample = fullText.slice(0, 5000);

  const processTransparency = collectMatches($, [
    /application process[^.]{0,120}/i,
    /what to expect[^.]{0,120}/i,
    /hiring process[^.]{0,120}/i,
  ]);

  const timelineMentions = collectMatches($, [/timeline[^.]{0,100}/i, /days[^.]{0,80}interview/i, /weeks[^.]{0,80}process/i]);
  const recruiterVisibility = collectMatches($, [/recruiter[^.]{0,100}/i, /talent partner[^.]{0,100}/i]);
  const interviewGuidance = collectMatches($, [/interview tips[^.]{0,100}/i, /prepare[^.]{0,100}interview/i]);
  const faqSignals = collectMatches($, [/faq[^.]{0,80}/i, /frequently asked[^.]{0,120}/i]);
  const employerBrandingSignals = collectMatches($, [/values[^.]{0,120}/i, /culture[^.]{0,120}/i, /mission[^.]{0,120}/i]);
  const applicationFrictionSignals = collectMatches($, [/create account[^.]{0,80}/i, /multiple steps[^.]{0,80}/i, /required fields[^.]{0,80}/i]);
  const redirectSignals = collectMatches($, [/redirect[^.]{0,80}/i, /external site[^.]{0,120}/i]);
  const communicationExpectationSignals = collectMatches($, [/we will get back[^.]{0,120}/i, /you will hear from[^.]{0,120}/i]);

  return {
    sourceUrl: normalized,
    hostname: parsed.hostname,
    companyName: inferCompanyName(parsed.hostname) || "Company",
    atsProvider: detectAts(html),
    processTransparency,
    timelineMentions,
    recruiterVisibility,
    interviewGuidance,
    faqSignals,
    employerBrandingSignals,
    applicationFrictionSignals,
    redirectSignals,
    communicationExpectationSignals,
    rawTextSample: sample,
  };
}
