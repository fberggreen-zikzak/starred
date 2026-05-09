import { AgentLibraryPreview } from "./AgentLibraryPreview";
import { pageShellClass } from "./layout";

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
      <div className={`${pageShellClass} pb-10 pt-8 sm:pb-12 sm:pt-10 lg:pb-14 lg:pt-12`}>
        <div className="flex flex-col gap-7 sm:gap-8 lg:gap-9">
          <div className="mx-auto flex w-full max-w-[56rem] flex-col items-center text-center">
            <p className="inline-flex rounded-full bg-[#e8f7f1] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0d3d2e] ring-1 ring-[#5dbea5]/30 sm:text-[11px]">
              Hiring intelligence
            </p>
            <h1 className="mt-3.5 w-full text-[#0d3d2e] sm:mt-4">
              <span className="block text-balance text-[2rem] font-semibold leading-[1.12] tracking-[-0.025em] sm:text-[2.35rem] lg:text-[2.85rem] lg:leading-[1.08]">
                Choose what Starred should <span className="text-[#2a9d78]">watch</span> for you.
              </span>
            </h1>
            <div
              className="mx-auto mt-3.5 h-px w-11 rounded-full bg-gradient-to-r from-[#5dbea5] via-[#5dbea5]/80 to-transparent sm:mt-4"
              aria-hidden
            />
            <p className="mx-auto mt-3.5 max-w-[50rem] text-balance text-pretty text-[0.9375rem] leading-[1.5] text-[#3d5249] sm:mt-4 sm:text-[1.05rem] lg:text-[1.15rem] lg:leading-snug">
              Subscribe to specialist agents that monitor hiring, workforce, and compliance risks — and alert the right
              owner when action is needed.
            </p>
          </div>

          <div id="solutions" className="relative min-w-0 w-full scroll-mt-24">
            <AgentLibraryPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
