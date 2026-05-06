import { NextRequest, NextResponse } from "next/server";
import { extractPublicSignals } from "@/lib/extract-signals";
import { buildSnapshot } from "@/lib/analyze-signals";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { url?: string };
    const url = body.url?.trim();
    if (!url) {
      return NextResponse.json({ error: "Careers page URL is required." }, { status: 400 });
    }

    const extracted = await extractPublicSignals(url);
    const snapshot = await buildSnapshot(extracted);

    return NextResponse.json({ snapshot });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
