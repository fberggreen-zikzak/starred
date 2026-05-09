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
  title: "Starred",
  description:
    "Choose what Starred should watch for you. Subscribe to specialist agents that monitor hiring, workforce, and compliance risks.",
};

export default function HomePage() {
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
