import { pageShellClass } from "./layout";

export function AnchorSections() {
  return (
    <>
      <section
        id="customers"
        className="scroll-mt-20 border-t border-[#0d3d2e]/8 bg-[#f4f6f4] py-16 sm:py-20"
        aria-labelledby="customers-heading"
      >
        <div className={`${pageShellClass} text-center`}>
          <h2 id="customers-heading" className="text-lg font-semibold text-[#0d3d2e] sm:text-xl">
            Operational clarity for People leaders
          </h2>
          <div className="mx-auto mt-4 h-0.5 w-10 rounded-full bg-[#5dbea5]" aria-hidden />
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-[#3d5249] sm:text-base">
            TA and workforce teams use Starred to monitor hiring signals, catch drift early, and alert owners with
            context—before small issues become executive escalations.
          </p>
        </div>
      </section>
      <section
        id="resources"
        className="scroll-mt-20 border-t border-[#0d3d2e]/8 bg-white py-16 sm:py-20"
        aria-labelledby="resources-heading"
      >
        <div className={`${pageShellClass} text-center`}>
          <h2 id="resources-heading" className="text-lg font-semibold text-[#0d3d2e] sm:text-xl">
            Resources and enablement
          </h2>
          <div className="mx-auto mt-4 h-0.5 w-10 rounded-full bg-[#5dbea5]" aria-hidden />
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-[#3d5249] sm:text-base">
            Playbooks, signal guides, and stakeholder summaries help you roll out hiring intelligence with confidence.
          </p>
        </div>
      </section>
    </>
  );
}
