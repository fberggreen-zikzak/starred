import { FormEvent, useEffect, useState } from "react";
import { FormData } from "../types";

type AnalyzerFormProps = {
  onSubmit: (payload: FormData) => void | Promise<void>;
};

export function AnalyzerForm({ onSubmit }: AnalyzerFormProps): JSX.Element {
  const [careerPageUrl, setCareerPageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const placeholders = ["https://company.com/careers", "https://miro.com/careers", "https://notion.so/careers"];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2600);
    return () => window.clearInterval(interval);
  }, [placeholders.length]);

  function normalizeUrl(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
    return `https://${trimmed}`;
  }

  function inferAts(url: string): FormData["ats"] {
    const lower = url.toLowerCase();
    if (lower.includes("greenhouse")) return "Greenhouse";
    if (lower.includes("lever.co") || lower.includes("jobs.lever")) return "Lever";
    if (lower.includes("myworkdayjobs") || lower.includes("workday")) return "Workday";
    if (lower.includes("smartrecruiters")) return "SmartRecruiters";
    if (lower.includes("icims")) return "iCIMS";
    if (lower.includes("jobvite")) return "Jobvite";
    return "Other / Not sure";
  }

  function toCompanyName(hostname: string): string {
    const base = hostname.replace(/^www\./, "").split(".")[0] ?? "";
    return base
      .split(/[-_]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  function captureFromCareerUrl(rawUrl: string): Pick<FormData, "companyName" | "companyWebsite" | "ats"> {
    const normalized = normalizeUrl(rawUrl);
    let hostname = "company.com";
    try {
      hostname = new URL(normalized).hostname;
    } catch {
      hostname = "company.com";
    }

    return {
      companyName: toCompanyName(hostname) || "Company",
      companyWebsite: `https://${hostname.replace(/^jobs\./, "").replace(/^careers\./, "")}`,
      ats: inferAts(normalized),
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const normalizedUrl = normalizeUrl(careerPageUrl);
    const extracted = captureFromCareerUrl(normalizedUrl);
    try {
      setIsSubmitting(true);
      await onSubmit({
        careerPageUrl: normalizedUrl,
        companyName: extracted.companyName,
        companyWebsite: extracted.companyWebsite,
        ats: extracted.ats,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function looksLikeValidUrl(value: string): boolean {
    if (!value.trim()) return false;
    try {
      const candidate = normalizeUrl(value);
      const parsed = new URL(candidate);
      return parsed.hostname.includes(".");
    } catch {
      return false;
    }
  }

  const isValid = looksLikeValidUrl(careerPageUrl);

  return (
    <section className="mx-auto w-full max-w-5xl rounded-[30px] border border-white/80 bg-gradient-to-br from-white/90 via-cyan-50/70 to-emerald-50/75 p-5 shadow-2xl shadow-emerald-900/10 ring-1 ring-white/80 backdrop-blur-xl md:p-7">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Start here</p>
          <p className="mt-1.5 text-base font-medium leading-relaxed text-slate-700">
            Paste a careers page URL to uncover candidate-facing hiring signals, communication gaps, and trust friction.
          </p>
        </div>

        <label className="text-sm font-semibold text-slate-700">Career page URL</label>
        <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-2 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition hover:border-slate-300 focus-within:border-emerald-400 focus-within:shadow-[0_0_0_4px_rgba(16,185,129,0.16)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔗</span>
              <input
                className="w-full rounded-xl border border-transparent bg-transparent py-3 pl-11 pr-3 text-[15px] text-slate-900 outline-none placeholder:text-slate-400"
                value={careerPageUrl}
                onChange={(event) => setCareerPageUrl(event.target.value)}
                placeholder={placeholders[placeholderIndex]}
                required
              />
            </div>
            <button
              className="inline-flex min-w-[210px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 transition hover:-translate-y-0.5 hover:from-slate-800 hover:to-slate-600 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400"
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? "Analyzing careers page..." : "Generate AI snapshot"}
              {!isSubmitting && <span aria-hidden>→</span>}
            </button>
          </div>
        </div>

        <p className="mt-1 text-xs text-slate-500">Powered by public hiring signals and benchmark-informed AI analysis.</p>
      </form>
    </section>
  );
}
