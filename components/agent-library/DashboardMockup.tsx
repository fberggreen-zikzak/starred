import { CommandCenter } from "./CommandCenter";

/** Command center: agent bubbles + Live Alerts (selection synced) */
export function DashboardMockup() {
  return (
    <div
      id="agents"
      className="w-full overflow-hidden rounded-2xl border border-[#0d3d2e]/10 bg-white shadow-[0_20px_60px_rgba(13,61,46,0.08),0_4px_16px_rgba(13,61,46,0.06)]"
    >
      <div className="flex min-h-[560px] flex-col lg:min-h-[600px] lg:flex-row">
        <CommandCenter />
      </div>
    </div>
  );
}
