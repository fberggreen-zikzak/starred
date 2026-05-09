import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AnnouncementBar } from "@/components/agent-library/AnnouncementBar";
import { Header } from "@/components/agent-library/Header";
import { Hero } from "@/components/agent-library/Hero";
import { SiteFooter } from "@/components/agent-library/SiteFooter";

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Starred | Agent Library",
  description:
    "Pick the signals that matter. Specialist agents monitor hiring, workforce, and compliance signals — alerts before issues grow.",
};

export default function AgentLibraryPage() {
  return (
    <div className={`${sans.className} min-h-screen bg-[#f4f6f4] text-[#0d3d2e] antialiased`}>
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
      </main>
      <SiteFooter />
    </div>
  );
}
