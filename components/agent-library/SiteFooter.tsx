import Link from "next/link";
import { pageShellClass } from "./layout";

const link = "text-sm text-white/65 transition-colors duration-200 hover:text-[#5dbea5]";
const heading = "text-sm font-semibold text-white";

const solutions = [
  "Candidate Experience",
  "Customer & Acquisition",
  "Recruitment Operations",
  "Employer Branding",
  "Hiring Team Performance",
] as const;

const products = ["Candidate Experience", "Hiring Team Experience", "Quality of Hire"] as const;

const company = ["About Us", "Blog", "Newsletter", "Jobs", "Changelog"] as const;

const contact = ["Support", "Get a demo"] as const;

const legal = [
  "Privacy Policy",
  "Terms & Conditions",
  "Cookie Statement",
  "Legal & Security Overview",
] as const;

function FooterLogo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 text-white">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0d3d2e] shadow-sm">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 2l2.2 6.8H21l-5.5 4 2.1 6.7L12 15.4 6.4 19.5l2.1-6.7L3 8.8h6.8L12 2z"
            fill="#5dbea5"
          />
        </svg>
      </span>
      <span className="text-lg font-semibold tracking-tight">Starred</span>
    </Link>
  );
}

function SocialLinks() {
  return (
    <div className="flex gap-2">
      <a
        href="https://www.youtube.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white/80 transition hover:border-[#5dbea5]/40 hover:text-[#5dbea5]"
        aria-label="YouTube"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-5.8 31 31 0 0 0-.5-5.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
        </svg>
      </a>
      <a
        href="https://www.linkedin.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white/80 transition hover:border-[#5dbea5]/40 hover:text-[#5dbea5]"
        aria-label="LinkedIn"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.86-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.86 3.37-1.86 3.6 0 4.27 2.37 4.27 5.45v6.3zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .77 0 1.73v20.54C0 23.2.8 24 1.77 24h20.45c.98 0 1.78-.8 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
        </svg>
      </a>
    </div>
  );
}

function LinkList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div className="flex flex-col gap-3">
      <p className={heading}>{title}</p>
      <ul className="flex flex-col gap-2.5">
        {items.map((label) => (
          <li key={label}>
            <Link href="#" className={link}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer id="resources" className="scroll-mt-24 relative bg-[#0a1f1c] text-white">
      <div className={`${pageShellClass} py-16 md:py-20`}>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <div id="customers" className="scroll-mt-24 flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
            <FooterLogo />
            <p className="max-w-xs text-sm text-white/55">Recruitment Analytics</p>
            <SocialLinks />
          </div>
          <LinkList title="Solutions" items={solutions} />
          <LinkList title="Products" items={products} />
          <LinkList title="Company" items={company} />
          <LinkList title="Contact" items={contact} />
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Legal">
              {legal.map((label) => (
                <Link key={label} href="#" className="text-xs text-white/55 transition hover:text-[#5dbea5]">
                  {label}
                </Link>
              ))}
            </nav>
            <p className="text-xs text-white/45 md:text-right">
              © Copyright {new Date().getFullYear()}. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#5dbea5] text-[#0a1f1c] shadow-[0_4px_24px_rgba(93,190,165,0.35)] transition hover:bg-[#6ec9b0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label="Open chat"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </footer>
  );
}
