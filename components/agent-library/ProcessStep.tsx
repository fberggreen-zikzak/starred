export function ProcessStep({
  title,
  description,
  step,
}: {
  title: string;
  description: string;
  step: string;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[#0d3d2e]/10 bg-[#fafcfb] p-7 shadow-[0_2px_12px_rgba(13,61,46,0.04)] sm:p-8">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0d3d2e] text-xs font-bold text-white">
        {step}
      </span>
      <h3 className="mt-5 text-lg font-semibold tracking-tight text-[#0d3d2e]">{title}</h3>
      <div className="mt-4 h-0.5 w-10 rounded-full bg-[#5dbea5]" aria-hidden />
      <p className="mt-4 text-sm leading-relaxed text-[#3d5249]">{description}</p>
    </div>
  );
}
