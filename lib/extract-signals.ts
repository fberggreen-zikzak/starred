import { chromium } from "playwright";
import * as cheerio from "cheerio";
import { ExtractedSignals } from "./analyzer-types";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

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

function buildCandidateUrls(normalized: string): string[] {
  const base = new URL(normalized);
  const candidates = new Set<string>([normalized]);

  const commonCareerPaths = ["/careers", "/jobs", "/careers/jobs", "/join-us", "/join", "/careers/open-roles"];
  for (const path of commonCareerPaths) {
    candidates.add(`${base.origin}${path}`);
  }

  return Array.from(candidates);
}

function discoverAtsUrlsFromHtml(html: string, sourceUrl: string): string[] {
  const $ = cheerio.load(html);
  const found = new Set<string>();
  const providerPatterns = [
    "myworkdayjobs.com",
    "workday.com",
    "greenhouse.io",
    "boards.greenhouse.io",
    "jobs.lever.co",
    "lever.co",
    "smartrecruiters.com",
    "icims.com",
    "jobvite.com",
  ];

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    try {
      const resolved = new URL(href, sourceUrl).toString();
      const lower = resolved.toLowerCase();
      if (providerPatterns.some((pattern) => lower.includes(pattern))) {
        found.add(resolved);
      }
    } catch {
      // Ignore invalid URLs
    }
  });

  const text = $("body").text();
  const matches =
    text.match(
      /https?:\/\/[^\s"')]+(?:myworkdayjobs\.com|boards\.greenhouse\.io|jobs\.lever\.co|smartrecruiters\.com|icims\.com|jobvite\.com)[^\s"')]*/gi,
    ) ?? [];
  for (const match of matches) {
    found.add(match);
  }

  return Array.from(found).slice(0, 8);
}

async function tryPlaywrightHtml(url: string): Promise<string | null> {
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ userAgent: USER_AGENT });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 12000 });
    const html = await page.content();
    await context.close();
    await browser.close();
    return html;
  } catch {
    if (browser) {
      await browser.close();
    }
    return null;
  }
}

async function tryFetchHtml(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

async function resolveCareerPageHtml(normalized: string): Promise<{ html: string; resolvedUrl: string }> {
  const candidates = buildCandidateUrls(normalized);

  for (const candidate of candidates) {
    const browserHtml = await tryPlaywrightHtml(candidate);
    if (browserHtml && browserHtml.length > 300) {
      return { html: browserHtml, resolvedUrl: candidate };
    }

    const fetchHtml = await tryFetchHtml(candidate);
    if (fetchHtml && fetchHtml.length > 300) {
      return { html: fetchHtml, resolvedUrl: candidate };
    }
  }

  // If direct career paths are thin/blocked, follow ATS-hosted links found on the primary page.
  const seedHtml = (await tryPlaywrightHtml(normalized)) ?? (await tryFetchHtml(normalized));
  if (seedHtml) {
    const atsCandidates = discoverAtsUrlsFromHtml(seedHtml, normalized);
    for (const atsUrl of atsCandidates) {
      const browserHtml = await tryPlaywrightHtml(atsUrl);
      if (browserHtml && browserHtml.length > 300) {
        return { html: browserHtml, resolvedUrl: atsUrl };
      }

      const fetchHtml = await tryFetchHtml(atsUrl);
      if (fetchHtml && fetchHtml.length > 300) {
        return { html: fetchHtml, resolvedUrl: atsUrl };
      }
    }
  }

  return { html: "", resolvedUrl: normalized };
}

export async function extractPublicSignals(url: string): Promise<ExtractedSignals> {
  const normalized = url.startsWith("http") ? url : `https://${url}`;

  const { html, resolvedUrl } = await resolveCareerPageHtml(normalized);
  const parsed = new URL(resolvedUrl);

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
    sourceUrl: resolvedUrl,
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
