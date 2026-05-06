import { ReactNode } from "react";

type InsightCardProps = {
  title: string;
  badge?: string;
  icon?: string;
  children: ReactNode;
};

export function InsightCard({ title, badge, icon, children }: InsightCardProps): JSX.Element {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <div className="flex flex-wrap items-center gap-2">
        {icon && <span className="text-sm">{icon}</span>}
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {badge && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{badge}</span>}
      </div>
      <div className="mt-4 text-slate-700">{children}</div>
    </article>
  );
}
