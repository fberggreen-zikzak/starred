import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Starred | Hiring Experience Analyzer",
  description:
    "AI-powered hiring intelligence for TA leaders. Analyze public hiring signals and generate benchmark-informed executive snapshots.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
