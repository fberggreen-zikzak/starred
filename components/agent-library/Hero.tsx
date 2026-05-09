import Link from "next/link";
import { AgentLibraryPreview } from "./AgentLibraryPreview";
import { pageShellClass } from "./layout";
import { StoryFlow } from "./StoryFlow";

export function Hero() {
  return (
    <section
      id="platform"
      className="relative scroll-mt-20 overflow-hidden border-b border-[#0d3d2e]/6 bg-[#f4f6f4] text-[#0d3d2e]"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 0% 0%, rgba(93, 190, 165, 0.09), transparent 50%), radial-gradient(ellipse 40% 35% at 100% 10%, rgba(13, 61, 46, 0.04), transparent 45%), #f4f6f4",
        }}
      />
      <div className={`${pageShellClass} pb-20 pt-14 sm:pb-24 sm:pt-16 lg:pb-28 lg:pt-20`}>
        <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] xl:gap-20 2xl:gap-24">
          <div className="max-w-xl lg:pt-4">
            <p className="inline-flex rounded-full bg-[#e8f7f1] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0d3d2e] ring-1 ring-[#5dbea5]/35">
              Hiring intelligence
            </p>
            <h1 className="mt-6 text-pretty text-[2rem] font-semibold leading-[1.16] tracking-[-0.02em] text-[#0d3d2e] sm:text-[2.25rem] lg:text-[2.5rem] lg:leading-[1.12]">
              Subscribe to the agents that watch your hiring and workforce risks.
            </h1>
            <div className="mt-6 h-0.5 w-12 rounded-full bg-[#5dbea5]" aria-hidden />
            <p className="mt-6 text-pretty text-base leading-[1.7] text-[#3d5249] sm:text-[1.0625rem]">
              Choose the insight agents you care about. Starred monitors each signal continuously and alerts the right
              people when action is needed.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="#agents"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#0d3d2e] px-8 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(13,61,46,0.2)] transition hover:bg-[#0a3226]"
              >
                Explore agents
              </Link>
              <Link
                href="#solutions"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#0d3d2e]/15 bg-white px-6 text-sm font-semibold text-[#0d3d2e] shadow-sm transition hover:border-[#5dbea5]/5 hover:bg-[#fafcfb]"
              >
                See how it works
              </Link>
            </div>
            <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7f76]">
              Built for modern TA and People teams
            </p>
          </div>

          <div className="relative min-w-0 lg:-mr-2 xl:-mr-4 2xl:-mr-6">
            <StoryFlow />
            <AgentLibraryPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
