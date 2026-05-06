import { NextRequest, NextResponse } from "next/server";
import { extractPublicSignals } from "@/lib/extract-signals";
import { buildSnapshot } from "@/lib/analyze-signals";

function toUserFacingError(error: unknown): string {
  const raw = error instanceof Error ? error.message : "Analysis failed.";
  const message = raw.toLowerCase();

  if (message.includes("not_found") || message.includes("not found") || message.includes("404")) {
    return "We could not access that careers page. Please verify the URL and try again.";
  }
  if (message.includes("timeout") || message.includes("timed out")) {
    return "The careers page took too long to respond. Please try again in a moment.";
  }
  if (message.includes("econnrefused") || message.includes("enotfound") || message.includes("failed to fetch")) {
    return "We could not reach that careers page. Please check the URL and try again.";
  }
  if (message.includes("403") || message.includes("forbidden") || message.includes("blocked")) {
    return "That careers page blocks automated access. Try a different careers page URL.";
  }

  return "Unable to analyze this careers page right now. Please try another URL.";
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { url?: string; observedOnly?: boolean };
    const url = body.url?.trim();
    if (!url) {
      return NextResponse.json({ error: "Careers page URL is required." }, { status: 400 });
    }

    const extracted = await extractPublicSignals(url);
    const snapshot = await buildSnapshot(extracted, { observedOnly: body.observedOnly === true });

    return NextResponse.json({ snapshot, extracted });
  } catch (error) {
    return NextResponse.json({ error: toUserFacingError(error) }, { status: 500 });
  }
}
