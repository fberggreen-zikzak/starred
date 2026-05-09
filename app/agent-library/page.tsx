import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AnchorSections } from "@/components/agent-library/AnchorSections";
import { AnnouncementBar } from "@/components/agent-library/AnnouncementBar";
import { Header } from "@/components/agent-library/Header";
import { Hero } from "@/components/agent-library/Hero";
import { pageShellClass } from "@/components/agent-library/layout";
import { ProcessSection } from "@/components/agent-library/ProcessSection";

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Starred | Agent Library",
  description:
    "Subscribe to agents that watch hiring and workforce risks. Monitoring, alerts, and clear next steps for TA and People teams.",
};

export default function AgentLibraryPage() {
  return (
    <div className={`${sans.className} min-h-screen bg-[#f4f6f4] text-[#0d3d2e] antialiased`}>
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <ProcessSection />
        <AnchorSections />
      </main>
      <footer className="border-t border-[#0d3d2e]/10 bg-white py-12 text-center text-xs text-[#6b7f76]">
        <div className={pageShellClass}>
          <p>© {new Date().getFullYear()} Starred. Hiring intelligence for operational clarity.</p>
        </div>
      </footer>
    </div>
  );
}
