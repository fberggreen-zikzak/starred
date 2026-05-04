import { IncomingMessage, createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";

const port = Number(process.env.PORT) || 3000;
const publicDir = path.resolve(process.cwd(), "public");

const mimeTypes: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

type AskResponse = {
  headline: string;
  bullets: string[];
  takeaway: string;
};

type ReportChunk = {
  id: string;
  heading: string;
  text: string;
  tokens: string[];
};

type RankedChunk = ReportChunk & { score: number };

const reportPath = path.resolve(process.cwd(), "data", "benchmark-report-2026.md");
let reportChunks: ReportChunk[] = [];
let reportCacheRaw = "";

const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "how",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "to",
  "what",
  "which",
  "who",
  "with",
  "year",
]);

function toTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));
}

function sentenceList(text: string): string[] {
  return text
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 35);
}

function chunkReport(markdown: string): ReportChunk[] {
  const lines = markdown.split(/\r?\n/);
  let currentHeading = "Benchmark report";
  const chunks: ReportChunk[] = [];
  let paragraphBuffer: string[] = [];
  let chunkId = 0;

  const flushParagraph = () => {
    const paragraph = paragraphBuffer.join(" ").trim();
    paragraphBuffer = [];
    if (!paragraph) return;
    const combined = `${currentHeading}. ${paragraph}`;
    chunks.push({
      id: `chunk-${chunkId++}`,
      heading: currentHeading,
      text: paragraph,
      tokens: toTokens(combined),
    });
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      continue;
    }

    if (trimmed.startsWith("#")) {
      flushParagraph();
      currentHeading = trimmed.replace(/^#+\s*/, "").trim() || currentHeading;
      continue;
    }

    paragraphBuffer.push(trimmed);
  }

  flushParagraph();
  return chunks;
}

async function ensureReportLoaded(): Promise<void> {
  try {
    const report = await readFile(reportPath, "utf-8");
    if (report !== reportCacheRaw) {
      reportCacheRaw = report;
      reportChunks = chunkReport(report);
    }
  } catch {
    reportCacheRaw = "";
    reportChunks = [];
  }
}

function rankChunks(question: string): RankedChunk[] {
  const queryTokens = toTokens(question);
  if (queryTokens.length === 0) return [];

  return reportChunks
    .map((chunk) => {
      let score = 0;
      for (const token of queryTokens) {
        if (chunk.tokens.includes(token)) score += 2;
        if (chunk.heading.toLowerCase().includes(token)) score += 1;
      }
      return { ...chunk, score };
    })
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

function insufficientAnswer(): AskResponse {
  return {
    headline: "The report does not include enough evidence for this question.",
    bullets: [
      "I could not find enough relevant benchmark detail to answer confidently.",
      "Try narrowing the question to a specific stage, metric, or stakeholder comparison.",
      "Example topics: confidence drop-off, decision speed, recruiter vs candidate perception.",
    ],
    takeaway:
      "For TA leaders: treat this as a data gap signal and validate with internal pipeline and candidate feedback data.",
  };
}

function groundedAnswer(question: string, rankedChunks: RankedChunk[]): AskResponse {
  if (rankedChunks.length === 0) return insufficientAnswer();

  const queryTokens = toTokens(question);
  const candidateSentences = rankedChunks.flatMap((chunk) =>
    sentenceList(chunk.text).map((sentence) => {
      const sentenceTokens = toTokens(sentence);
      const overlap = queryTokens.filter((token) => sentenceTokens.includes(token)).length;
      return {
        sentence,
        overlap,
        heading: chunk.heading,
      };
    }),
  );

  const bullets = candidateSentences
    .filter((item) => item.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .map((item) => item.sentence)
    .filter((sentence, index, arr) => arr.indexOf(sentence) === index)
    .slice(0, 3);

  if (bullets.length < 2) {
    return insufficientAnswer();
  }

  const dominantHeading = rankedChunks[0]?.heading ?? "Benchmark report";
  const conciseHeading = dominantHeading.length > 70 ? "Benchmark evidence" : dominantHeading;
  return {
    headline: `${conciseHeading}: key benchmark signal`,
    bullets,
    takeaway: `For TA leaders: prioritize action in "${conciseHeading}" first, then track impact via stage-level candidate sentiment and conversion metrics.`,
  };
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Uint8Array[] = [];

  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf-8");
  if (!rawBody) return {};
  return JSON.parse(rawBody);
}

const server = createServer(async (req, res) => {
  const pathname = req.url ? new URL(req.url, "http://localhost").pathname : "/";

  if (pathname === "/api/ask" && req.method === "POST") {
    try {
      await ensureReportLoaded();
      const body = (await readJsonBody(req)) as { question?: unknown };
      const question = typeof body.question === "string" ? body.question.trim() : "";

      if (!question) {
        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: "Question is required" }));
        return;
      }

      const ranked = rankChunks(question);
      const answer = groundedAnswer(question, ranked);
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify(answer));
      return;
    } catch {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: "Invalid JSON payload" }));
      return;
    }
  }

  try {
    const requestedPath = pathname !== "/" ? pathname : "/index.html";
    const safePath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
    const filePath = path.join(publicDir, safePath);
    const ext = path.extname(filePath).toLowerCase();
    const mime = mimeTypes[ext] ?? "application/octet-stream";

    const file = await readFile(filePath);
    res.writeHead(200, { "Content-Type": mime });
    res.end(file);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
