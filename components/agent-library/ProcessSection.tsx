import { pageShellClass } from "./layout";
import { ProcessStep } from "./ProcessStep";

export function ProcessSection() {
  return (
    <section
      id="solutions"
      className="scroll-mt-20 border-t border-[#0d3d2e]/8 bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className={pageShellClass}>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2a9d78]">How it works</p>
          <p className="mt-4 text-pretty text-lg font-semibold tracking-tight text-[#0d3d2e] sm:text-xl">
            Subscribe → Monitor → Alert
          </p>
          <h2 className="sr-only">Subscribe, monitor, and alert</h2>
          <p className="mt-3 text-base text-[#3d5249] sm:text-lg">
            A single rhythm from coverage to action—calm, accountable, and built for enterprise TA teams.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-3 lg:mt-16 lg:gap-8">
          <ProcessStep step="1" title="Subscribe" description="Choose the agents you need." />
          <ProcessStep
            step="2"
            title="Monitor"
            description="Set thresholds by team, role, market, or segment."
          />
          <ProcessStep
            step="3"
            title="Alert"
            description="Notify the right owner when action is needed."
          />
        </div>
      </div>
    </section>
  );
}
