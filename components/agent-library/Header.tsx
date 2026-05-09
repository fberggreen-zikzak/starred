"use client";

import Link from "next/link";
import { useState } from "react";
import { pageShellClass } from "./layout";

const nav = [
  { label: "Platform", href: "#platform" },
  { label: "Agents", href: "#agents" },
  { label: "Solutions", href: "#solutions" },
  { label: "Customers", href: "#customers" },
  { label: "Resources", href: "#resources" },
] as const;

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-[#0d3d2e]">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0d3d2e] shadow-sm">
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

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#0d3d2e]/8 bg-white/95 shadow-sm backdrop-blur-md">
      <div className={`${pageShellClass} relative flex items-center justify-between gap-4 py-4`}>
        <Logo />

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 lg:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-[#0d3d2e]/75 transition hover:bg-[#0d3d2e]/5 hover:text-[#0d3d2e]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <Link
            href="#login"
            className="rounded-full px-3 py-2 text-sm font-semibold text-[#0d3d2e] transition hover:bg-[#0d3d2e]/5"
          >
            Log in
          </Link>
          <Link
            href="#demo"
            className="rounded-full bg-[#0d3d2e] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(13,61,46,0.2)] transition hover:bg-[#0a3226]"
          >
            Book a demo
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-[#0d3d2e]/12 bg-white p-2 text-[#0d3d2e] lg:hidden"
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
        <div id="mobile-nav" className="border-t border-[#0d3d2e]/8 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#0d3d2e]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-[#0d3d2e]/10 pt-3">
              <Link href="#login" className="rounded-lg px-3 py-2 text-sm font-semibold text-[#0d3d2e]">
                Log in
              </Link>
              <Link
                href="#demo"
                className="rounded-full bg-[#0d3d2e] px-3 py-2.5 text-center text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                Book a demo
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
