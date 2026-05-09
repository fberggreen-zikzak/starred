import Link from "next/link";
import { pageShellClass } from "./layout";

export function AnnouncementBar() {
  return (
    <div className="border-b border-[#0d3d2e]/8 bg-[#e8f2ed]">
      <div
        className={`${pageShellClass} flex flex-col items-center justify-center gap-1 py-2.5 text-center sm:flex-row sm:justify-between sm:gap-3`}
      >
        <p className="text-[11px] font-medium text-[#0d3d2e]/80 sm:text-xs">
          Benchmark hiring signals and act before risks compound.
        </p>
        <Link
          href="#solutions"
          className="shrink-0 text-[11px] font-semibold text-[#0d3d2e] underline decoration-[#5dbea5]/50 underline-offset-4 transition hover:decoration-[#5dbea5] sm:text-xs"
        >
          Read now →
        </Link>
      </div>
    </div>
  );
}
