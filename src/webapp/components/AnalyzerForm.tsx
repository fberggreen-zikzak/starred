import { FormEvent, useState } from "react";
import { FormData } from "../types";

type AnalyzerFormProps = {
  onSubmit: (payload: FormData) => void;
};

export function AnalyzerForm({ onSubmit }: AnalyzerFormProps): JSX.Element {
  const [careerPageUrl, setCareerPageUrl] = useState("");

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

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const normalizedUrl = normalizeUrl(careerPageUrl);
    const extracted = captureFromCareerUrl(normalizedUrl);
    onSubmit({
      careerPageUrl: normalizedUrl,
      companyName: extracted.companyName,
      companyWebsite: extracted.companyWebsite,
      ats: extracted.ats,
    });
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
    <section className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl shadow-emerald-900/10 ring-1 ring-white/70 backdrop-blur md:p-8">
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
          Career page URL
          <input
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-base text-slate-900 outline-none ring-emerald-500 transition focus:border-emerald-500 focus:ring"
            value={careerPageUrl}
            onChange={(event) => setCareerPageUrl(event.target.value)}
            placeholder="https://company.com/careers"
            required
          />
        </label>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">Based on public signals</span>
          <span className="rounded-full bg-cyan-50 px-2.5 py-1 font-semibold text-cyan-700">Executive summary format</span>
        </div>

        <p className="text-xs leading-relaxed text-slate-500">
          Public signals only. Snapshot language is directional and may indicate potential gaps.
        </p>

        <div className="mt-1">
          <button
            className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-400 md:w-auto"
            type="submit"
            disabled={!isValid}
          >
            Generate your hiring snapshot
          </button>
        </div>
      </form>
    </section>
  );
}
