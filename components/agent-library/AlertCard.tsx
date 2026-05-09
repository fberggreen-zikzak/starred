export function AlertCard({ title, description }: { title: string; description: string }) {
  return (
    <article className="rounded-xl border border-[#0d3d2e]/10 bg-white px-3.5 py-3 shadow-[0_1px_3px_rgba(13,61,46,0.06)]">
      <div className="flex gap-2.5">
        <span
          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5dbea5] ring-2 ring-[#5dbea5]/30"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <h4 className="text-[13px] font-semibold leading-snug text-[#0d3d2e]">{title}</h4>
          <p className="mt-1 text-[11px] leading-relaxed text-[#3d5249] sm:text-xs">{description}</p>
        </div>
      </div>
    </article>
  );
}
