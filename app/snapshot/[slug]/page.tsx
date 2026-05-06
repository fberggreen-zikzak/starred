import AnalyzerClient from "@/app/components/analyzer-client";

type PageProps = {
  searchParams: Promise<{ url?: string }>;
};

export default async function SnapshotPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return <AnalyzerClient initialUrl={params.url ?? ""} />;
}
