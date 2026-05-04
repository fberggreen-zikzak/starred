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
  stat: string;
  bullets: string[];
};

function buildAnswer(question: string): AskResponse {
  const q = question.toLowerCase();

  if (q.includes("confidence") || q.includes("drop") || q.includes("losing")) {
    return {
      headline: "Candidate confidence drops most after late-stage delays.",
      stat: "Teams with interview-to-decision times above 10 days score 21% lower on confidence.",
      bullets: [
        "The steepest decline appears between final interview and decision communication.",
        "Top-performing teams keep final-stage response times under 72 hours.",
        "Proactive status updates are the strongest confidence stabilizer.",
      ],
    };
  }

  if (q.includes("top") || q.includes("average") || q.includes("differ")) {
    return {
      headline: "Top TA teams outperform through consistency, not volume.",
      stat: "Top quartile teams close roles 18% faster and maintain 2.1x more stage-level communication touchpoints.",
      bullets: [
        "They enforce clear SLAs between interview rounds.",
        "They standardize candidate messaging quality across hiring managers.",
        "They review perception gaps monthly and act within the same quarter.",
      ],
    };
  }

  return {
    headline: "Execution discipline is the strongest benchmark differentiator.",
    stat: "Organizations with stage-level standards outperform peers by 14 points in overall candidate experience.",
    bullets: [
      "Prioritize fixes in stages with high drop-off and low confidence.",
      "Track sentiment alongside conversion, not in separate views.",
      "Focus on communication quality before introducing new tooling.",
    ],
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
      const body = (await readJsonBody(req)) as { question?: unknown };
      const question = typeof body.question === "string" ? body.question.trim() : "";

      if (!question) {
        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: "Question is required" }));
        return;
      }

      const answer = buildAnswer(question);
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
