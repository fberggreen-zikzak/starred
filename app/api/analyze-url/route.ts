import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { chromium, type Browser, type BrowserContext } from "playwright";
import { buildSnapshot } from "@/lib/analyze-signals";
import type { ExtractedSignals } from "@/lib/analyzer-types";

type ErrorCode = "invalid_url" | "timeout" | "blocked" | "no_content_found" | "unsupported_page" | "unknown";

class AnalyzeUrlError extends Error {
  code: ErrorCode;
  status: number;

  constructor(code: ErrorCode, message: string, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new AnalyzeUrlError("invalid_url", "Please enter a careers page URL.");
  }
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withProtocol);
    if (!parsed.hostname.includes(".")) {
      throw new AnalyzeUrlError("invalid_url", "Please enter a valid careers page URL.");
    }
    return parsed.toString();
  } catch {
    throw new AnalyzeUrlError("invalid_url", "Please enter a valid careers page URL.");
  }
}

async function fetchWithRedirects(startUrl: string): Promise<{ finalUrl: string; status: number; html: string }> {
  let current = startUrl;
  for (let i = 0; i < 5; i += 1) {
    const response = await fetch(current, {
      redirect: "manual",
      cache: "no-store",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
      },
    });
    const status = response.status;
    if (status >= 300 && status < 400) {
      const location = response.headers.get("location");
      if (!location) break;
      current = new URL(location, current).toString();
      continue;
    }
    const html = await response.text();
    return { finalUrl: current, status, html };
  }
  throw new AnalyzeUrlError("unsupported_page", "This careers page redirects too many times.", 422);
}

async function tryFirecrawl(normalizedUrl: string): Promise<{ finalUrl: string; status: number; html: string } | null> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) return null;
  try {
    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: normalizedUrl,
        formats: ["html"],
      }),
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { success?: boolean; data?: { html?: string; metadata?: { sourceURL?: string } } };
    const html = payload?.data?.html ?? "";
    if (!html) return null;
    return { finalUrl: payload?.data?.metadata?.sourceURL ?? normalizedUrl, status: 200, html };
  } catch {
    return null;
  }
}

async function tryPlaywright(normalizedUrl: string): Promise<{ finalUrl: string; status: number; html: string } | null> {
  let browser: Browser | null = null;
  let context: BrowserContext | null = null;
  try {
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext({
      userAgent: USER_AGENT,
      extraHTTPHeaders: {
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html,application/xhtml+xml",
        "Cache-Control": "no-cache",
      },
    });
    const page = await context.newPage();
    await page.goto(normalizedUrl, { waitUntil: "domcontentloaded", timeout: 15000 });
    return { finalUrl: page.url(), status: 200, html: await page.content() };
  } catch {
    return null;
  } finally {
    if (context) {
      try {
        await context.close();
      } catch {}
    }
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
  }
}

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

function collectMatches(text: string, patterns: RegExp[]): string[] {
  const matches = new Set<string>();
  for (const pattern of patterns) {
    const found = text.match(pattern);
    if (found?.[0]) matches.add(found[0].trim());
  }
  return Array.from(matches).slice(0, 5);
}

function buildSignals(finalUrl: string, html: string, sourceText?: string): { signals: ExtractedSignals; extracted: Record<string, unknown> } {
  const $ = cheerio.load(html);
  const bodyText = sourceText ? sourceText.replace(/\s+/g, " ").trim() : $("body").text().replace(/\s+/g, " ").trim();
  const title = $("title").first().text().trim();
  const metaDescription = $('meta[name="description"]').attr("content")?.trim() ?? "";
  const headings = $("h1, h2, h3")
    .toArray()
    .map((el) => $(el).text().trim())
    .filter(Boolean)
    .slice(0, 20);
  const links = $("a[href]")
    .toArray()
    .map((el) => {
      const href = $(el).attr("href") ?? "";
      try {
        return { href: new URL(href, finalUrl).toString(), text: $(el).text().trim() };
      } catch {
        return { href: "", text: $(el).text().trim() };
      }
    })
    .filter((item) => item.text.length > 0)
    .slice(0, 50);
  const ctaText = $("a, button")
    .toArray()
    .map((el) => $(el).text().replace(/\s+/g, " ").trim())
    .filter((text) => text.length > 0 && text.length < 60)
    .slice(0, 30);

  if (bodyText.length < 120) {
    throw new AnalyzeUrlError("no_content_found", "Couldn’t access the page automatically. Paste career page text instead.", 422);
  }

  const urlObj = new URL(finalUrl);
  const atsProvider = detectAts(html + bodyText);
  const processTransparency = collectMatches(bodyText, [/application process[^.]{0,120}/i, /what to expect[^.]{0,120}/i, /hiring process[^.]{0,120}/i]);
  const timelineMentions = collectMatches(bodyText, [/timeline[^.]{0,100}/i, /days[^.]{0,80}interview/i, /weeks[^.]{0,80}process/i]);
  const recruiterVisibility = collectMatches(bodyText, [/recruiter[^.]{0,100}/i, /talent partner[^.]{0,100}/i]);
  const interviewGuidance = collectMatches(bodyText, [/interview tips[^.]{0,100}/i, /prepare[^.]{0,100}interview/i]);
  const faqSignals = collectMatches(bodyText, [/faq[^.]{0,80}/i, /frequently asked[^.]{0,120}/i]);
  const employerBrandingSignals = collectMatches(bodyText, [/values[^.]{0,120}/i, /culture[^.]{0,120}/i, /mission[^.]{0,120}/i]);
  const applicationFrictionSignals = collectMatches(bodyText, [/create account[^.]{0,80}/i, /multiple steps[^.]{0,80}/i, /required fields[^.]{0,80}/i]);
  const redirectSignals = collectMatches(bodyText, [/redirect[^.]{0,80}/i, /external site[^.]{0,120}/i]);
  const communicationExpectationSignals = collectMatches(bodyText, [/we will get back[^.]{0,120}/i, /you will hear from[^.]{0,120}/i]);

  const signals: ExtractedSignals = {
    sourceUrl: finalUrl,
    hostname: urlObj.hostname,
    companyName:
      urlObj.hostname
        .replace(/^www\./, "")
        .split(".")[0]
        ?.split(/[-_]/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ") || "Company",
    atsProvider,
    processTransparency,
    timelineMentions,
    recruiterVisibility,
    interviewGuidance,
    faqSignals,
    employerBrandingSignals,
    applicationFrictionSignals,
    redirectSignals,
    communicationExpectationSignals,
    rawTextSample: bodyText.slice(0, 12000),
  };

  return {
    signals,
    extracted: {
      finalUrl,
      title,
      metaDescription,
      text: bodyText.slice(0, 12000),
      headings,
      links,
      ctaText,
      atsProvider,
    },
  };
}

function toApiError(error: unknown): AnalyzeUrlError {
  if (error instanceof AnalyzeUrlError) return error;
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("timeout")) return new AnalyzeUrlError("timeout", "The careers page took too long to respond. Please try again.");
  if (message.includes("403") || message.includes("forbidden") || message.includes("blocked")) {
    return new AnalyzeUrlError("blocked", "That careers page blocks automated access. Paste page text instead.", 422);
  }
  return new AnalyzeUrlError("unknown", "Unable to analyze this careers page right now. Please try another URL.", 500);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { url?: string; manualContent?: string };
    const normalizedUrl = normalizeUrl(body.url ?? "");

    let extractedPayload: { finalUrl: string; status: number; html: string } | null = null;
    if (!body.manualContent?.trim()) {
      extractedPayload = await tryFirecrawl(normalizedUrl);
      if (!extractedPayload) {
        try {
          extractedPayload = await fetchWithRedirects(normalizedUrl);
        } catch (error) {
          const fallback = await tryPlaywright(normalizedUrl);
          if (fallback) extractedPayload = fallback;
          else throw error;
        }
      }
      if (!extractedPayload) {
        extractedPayload = await tryPlaywright(normalizedUrl);
      }
    }
    const html = body.manualContent?.trim() ? `<html><body>${body.manualContent}</body></html>` : extractedPayload?.html ?? "";
    const finalUrl = extractedPayload?.finalUrl ?? normalizedUrl;
    const status = extractedPayload?.status ?? 200;
    const { signals, extracted } = buildSignals(finalUrl, html, body.manualContent);
    const snapshot = await buildSnapshot(signals, { observedOnly: true });

    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("[analyze-url]", {
        normalizedUrl,
        finalUrl,
        status,
        contentLength: signals.rawTextSample.length,
        title: String((extracted.title as string) ?? ""),
      });
    }

    return NextResponse.json({
      success: true,
      finalUrl,
      title: extracted.title,
      text: extracted.text,
      signals: extracted,
      snapshot,
    });
  } catch (error) {
    const parsed = toApiError(error);
    return NextResponse.json(
      {
        success: false,
        errorCode: parsed.code,
        message: parsed.message,
      },
      { status: parsed.status },
    );
  }
}
