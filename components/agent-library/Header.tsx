"use client";

import Link from "next/link";
import { useState } from "react";
import { pageShellClass } from "./layout";

/** Starred marketing nav — products.learn style dropdown affordances (visual only on this page) */

const mint = "#70E1A1";
const ink = "#1A2E2A";

type NavItem =
  | { label: string; href: string; hasChevron?: false }
  | { label: string; href: string; hasChevron: true };

const nav: NavItem[] = [
  { label: "Products", href: "#agents", hasChevron: true },
  { label: "Why Starred", href: "#platform" },
  { label: "Customers", href: "#customers" },
  { label: "Learn", href: "#resources", hasChevron: true },
  { label: "Pricing", href: "#solutions" },
];

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" style={{ color: ink }}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 2l2.35 6.5L21 9.2l-5.2 4.2L17.4 21 12 17.5 6.6 21l1.6-7.6L3 9.2l6.65-.7L12 2z"
            fill="none"
            stroke={mint}
            strokeWidth="1.65"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="text-lg font-semibold lowercase tracking-tight">starred</span>
    </Link>
  );
}

function NavLink({ item }: { item: NavItem }) {
  const base =
    "inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors";
  const idle = "text-[#1A2E2A]/85 hover:bg-[#1A2E2A]/5 hover:text-[#1A2E2A]";
  return (
    <Link href={item.href} className={`${base} ${idle}`}>
      {item.label}
      {"hasChevron" in item && item.hasChevron ? (
        <ChevronDown className="mt-px shrink-0 opacity-70" />
      ) : null}
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-t border-[#1A2E2A]/12 border-b border-[#1A2E2A]/10 bg-[#F9F8F3]/95 shadow-[0_1px_0_rgba(26,46,42,0.04)] backdrop-blur-md"
    >
      <div className={`${pageShellClass} relative flex items-center justify-between gap-4 py-3.5 sm:py-4`}>
        <Logo />

        <nav
          className="absolute left-1/2 hidden max-w-[min(32rem,50vw)] -translate-x-1/2 items-center gap-0.5 lg:flex"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <NavLink key={item.label} item={item} />
          ))}
        </nav>

        <div className="hidden items-center gap-1 sm:flex">
          <Link
            href="#login"
            className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-[#1A2E2A] transition hover:bg-[#1A2E2A]/5"
          >
            Log in
            <ChevronDown className="mt-px shrink-0 opacity-55" />
          </Link>
          <Link
            href="#solutions"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[#1A2E2A] shadow-sm transition hover:brightness-[0.98]"
            style={{ backgroundColor: mint }}
          >
            Book a demo
            <span aria-hidden className="text-base font-normal leading-none">
              →
            </span>
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-[#1A2E2A]/12 bg-white p-2 text-[#1A2E2A] lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            {open ? (
              <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-[#1A2E2A]/10 bg-[#F9F8F3] px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-0.5" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-[#1A2E2A]"
                onClick={() => setOpen(false)}
              >
                <span>{item.label}</span>
                {"hasChevron" in item && item.hasChevron ? <ChevronDown className="opacity-50" /> : null}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-[#1A2E2A]/10 pt-3">
              <Link
                href="#login"
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-[#1A2E2A]"
              >
                Log in
                <ChevronDown className="opacity-45" />
              </Link>
              <Link
                href="#solutions"
                className="flex items-center justify-center gap-2 rounded-full px-3 py-2.5 text-center text-sm font-semibold text-[#1A2E2A]"
                style={{ backgroundColor: mint }}
                onClick={() => setOpen(false)}
              >
                Book a demo
                <span aria-hidden>→</span>
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
