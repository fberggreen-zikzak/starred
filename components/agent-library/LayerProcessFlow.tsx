/** Product loop: choose what Starred should watch and who gets alerted */

function Arrow() {
  return (
    <span className="shrink-0 px-1 text-[11px] font-normal text-[#5dbea5]" aria-hidden>
      →
    </span>
  );
}

export function LayerProcessFlow() {
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Choose agents, monitor risks, alert owners">
      <p className="mr-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5c6f66]">Workflow</p>
      <div className="inline-flex items-center rounded-full border border-[#0d3d2e]/12 bg-white px-3 py-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#0d3d2e]">Choose agents</span>
      </div>
      <Arrow />
      <div className="inline-flex items-center rounded-full border border-[#5dbea5]/38 bg-[#e8f7f1]/6 px-3 py-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#0d3d2e]">Monitor risks</span>
      </div>
      <Arrow />
      <div className="inline-flex items-center rounded-full border border-[#0d3d2e]/12 bg-white px-3 py-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#0d3d2e]">Alert owners</span>
      </div>
    </div>
  );
}
