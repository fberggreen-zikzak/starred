"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import {
  IconChart,
  IconClock,
  IconHeartPulse,
  IconMessage,
  IconScale,
  IconSparkle,
  IconTrendDown,
  IconUsers,
} from "./icons";

type AgentDef = {
  id: string;
  label: string;
  title: string;
  /** One-line what this agent monitors */
  explainer: string;
  /** USD billed per alert delivered */
  pricePerAlert: 1 | 2 | 3;
  defaultSubscribed: boolean;
  icon: ReactNode;
};

const AGENTS: AgentDef[] = [
  {
    id: "conduct",
    label: "Hiring Manager Conduct",
    title: "Hiring Manager Conduct Agent — interview behavior and bias signals",
    explainer: "Flags biased, inappropriate, or inconsistent interview behavior.",
    pricePerAlert: 2,
    defaultSubscribed: true,
    icon: <IconUsers className="h-6 w-6 text-[#0B1F1B]" />,
  },
  {
    id: "dropoff",
    label: "Candidate Drop-off",
    title: "Candidate Drop-off Risk Agent — withdrawal spikes by role or market",
    explainer: "Surges in withdrawals by role, market, or hiring team.",
    pricePerAlert: 1,
    defaultSubscribed: true,
    icon: <IconTrendDown className="h-6 w-6 text-[#0B1F1B]" />,
  },
  {
    id: "sla",
    label: "SLA Monitoring",
    title: "SLA Monitoring Agent — feedback and process SLAs",
    explainer: "Missed feedback, comms, and interview-process deadlines.",
    pricePerAlert: 1,
    defaultSubscribed: true,
    icon: <IconClock className="h-6 w-6 text-[#0B1F1B]" />,
  },
  {
    id: "quality",
    label: "Quality of Hire",
    title: "Quality of Hire Agent — patterns linked to hire outcomes",
    explainer: "Patterns tied to stronger or weaker hire outcomes.",
    pricePerAlert: 2,
    defaultSubscribed: false,
    icon: <IconChart className="h-6 w-6 text-[#0B1F1B]/55" />,
  },
  {
    id: "pay",
    label: "EU Pay Transparency",
    title: "EU Pay Transparency Agent — job ad and compensation readiness",
    explainer: "Job ads and comp signals vs. EU pay transparency rules.",
    pricePerAlert: 3,
    defaultSubscribed: true,
    icon: <IconScale className="h-6 w-6 text-[#0B1F1B]" />,
  },
  {
    id: "evp",
    label: "EVP Strength",
    title: "EVP Strength Agent — promise vs. lived experience",
    explainer: "Whether candidates experience the EVP you communicate.",
    pricePerAlert: 2,
    defaultSubscribed: true,
    icon: <IconSparkle className="h-6 w-6 text-[#0B1F1B]" />,
  },
  {
    id: "brand",
    label: "Employer Brand",
    title: "Employer Brand Sentiment Agent — feedback and public channels",
    explainer: "Negative sentiment in feedback and public channels.",
    pricePerAlert: 1,
    defaultSubscribed: false,
    icon: <IconMessage className="h-6 w-6 text-[#0B1F1B]/55" />,
  },
  {
    id: "onboarding",
    label: "Onboarding Health",
    title: "Onboarding Health Agent — new hire readiness",
    explainer: "New hires not set up to succeed in the first weeks.",
    pricePerAlert: 3,
    defaultSubscribed: false,
    icon: <IconHeartPulse className="h-6 w-6 text-[#0B1F1B]/55" />,
  },
];

function SubscribeToggle({
  checked,
  onToggle,
  name,
}: {
  checked: boolean;
  onToggle: () => void;
  name: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={
        checked
          ? `Subscribed to ${name}. Press to unsubscribe.`
          : `Not subscribed to ${name}. Press to subscribe.`
      }
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      onPointerDown={(e) => e.stopPropagation()}
      className={[
        "relative h-7 w-12 shrink-0 cursor-pointer rounded-full transition-[colors,transform,box-shadow] hover:brightness-95 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6EE7B7]",
        checked ? "bg-[#6EE7B7] shadow-[0_2px_8px_rgba(110,231,183,0.45)]" : "bg-[#c5ccc9] hover:bg-[#b8c0bd]",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform",
          checked ? "translate-x-5" : "translate-x-0",
        ].join(" ")}
        aria-hidden
      />
    </button>
  );
}

export function AgentLibraryGrid({
  selectedAgentId,
  onSelectAgent,
}: {
  selectedAgentId: string | null;
  onSelectAgent: (id: string) => void;
}) {
  const initial = useMemo(() => {
    const m: Record<string, boolean> = {};
    for (const a of AGENTS) m[a.id] = a.defaultSubscribed;
    return m;
  }, []);

  const [subscribed, setSubscribed] = useState(initial);

  const toggle = useCallback((id: string) => {
    setSubscribed((s) => ({ ...s, [id]: !s[id] }));
  }, []);

  return (
    <div>
      <p className="mb-5 text-center text-[11px] font-medium leading-snug text-[#0B1F1B]/55 sm:text-xs">
        <span className="text-[#6EE7B7]" aria-hidden>
          ●
        </span>{" "}
        Click an <span className="font-semibold text-[#0B1F1B]/75">icon</span> or{" "}
        <span className="font-semibold text-[#0B1F1B]/75">name</span> to preview an alert. Use the toggle to
        subscribe.
      </p>
      <div className="grid grid-cols-3 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-8">
      {AGENTS.map((agent) => {
        const on = subscribed[agent.id];
        const selected = selectedAgentId === agent.id;
        return (
          <div key={agent.id} className="flex flex-col items-center text-center">
            <button
              type="button"
              onClick={() => onSelectAgent(agent.id)}
              className={[
                "flex cursor-pointer flex-col items-center rounded-2xl p-2 text-center transition",
                "bg-transparent hover:bg-[#0B1F1B]/[0.04] hover:shadow-md",
                "active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1F1B]",
                selected ? "bg-[#0B1F1B]/[0.03] shadow-sm" : "",
              ].join(" ")}
              aria-label={`Preview example alert for ${agent.label}`}
              aria-pressed={selected}
            >
              <div
                className={[
                  "flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full shadow-[0_2px_8px_rgba(11,31,27,0.08)] transition sm:h-[4.5rem] sm:w-[4.5rem]",
                  selected
                    ? "bg-[#6EE7B7]/25 ring-2 ring-[#0B1F1B] ring-offset-2 ring-offset-white"
                    : on
                      ? "bg-[#6EE7B7]/15 ring-2 ring-[#6EE7B7]/70 ring-offset-2 ring-offset-white"
                      : "bg-[#eef1f0] ring-1 ring-[#0B1F1B]/10",
                ].join(" ")}
                title={`${agent.title} — $${agent.pricePerAlert} per alert.`}
              >
                {agent.icon}
              </div>
              <span className="mt-2 text-[9px] font-semibold uppercase tracking-wider text-[#6EE7B7] opacity-90">
                Preview
              </span>
            </button>
            <div className="mt-2.5">
              <SubscribeToggle checked={on} onToggle={() => toggle(agent.id)} name={agent.label} />
            </div>
            <button
              type="button"
              onClick={() => onSelectAgent(agent.id)}
              className={[
                "group mt-2 flex max-w-[11.5rem] cursor-pointer flex-col items-center rounded-xl border px-2 py-1.5 text-center transition sm:max-w-[12.5rem]",
                "border-[#0B1F1B]/10 hover:border-[#0B1F1B]/22 hover:bg-[#0B1F1B]/[0.04] hover:shadow-sm",
                "active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1F1B]",
                selected ? "border-[#0B1F1B]/30 bg-[#6EE7B7]/10" : "bg-transparent",
              ].join(" ")}
              aria-label={`Preview example alert for ${agent.label}. ${agent.explainer}`}
            >
              <span
                className="line-clamp-2 min-h-[2rem] max-w-[10rem] text-[10px] font-semibold leading-tight text-[#0B1F1B] decoration-[#6EE7B7]/0 decoration-2 underline-offset-2 transition group-hover:underline group-hover:decoration-[#6EE7B7] sm:text-[11px]"
                title={agent.title}
              >
                {agent.label}
              </span>
              <span
                className="mt-1 line-clamp-2 max-w-[10.5rem] text-[9px] leading-snug text-[#0B1F1B]/58 sm:text-[10px]"
                title={agent.explainer}
              >
                {agent.explainer}
              </span>
              <span className="mt-1.5 text-[10px] tabular-nums sm:text-[11px]">
                <span className="font-semibold text-[#0B1F1B]">${agent.pricePerAlert}</span>
                <span className="font-medium text-[#0B1F1B]/45">/alert</span>
              </span>
              <span className="mt-1 text-[9px] font-medium text-[#6EE7B7]">View sample →</span>
            </button>
          </div>
        );
      })}

      <div className="flex flex-col items-center text-center opacity-70">
        <div
          className="flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full border-2 border-dashed border-[#0B1F1B]/18 bg-[#fafcfb] sm:h-[4.5rem] sm:w-[4.5rem]"
          aria-hidden
        />
        <div
          className="mt-2.5 h-7 w-12 shrink-0 rounded-full border border-dashed border-[#0B1F1B]/15"
          aria-hidden
        />
        <p className="mt-2 line-clamp-2 min-h-[2.25rem] max-w-[7.5rem] text-[10px] font-medium leading-tight text-[#0B1F1B]/55 sm:max-w-[9rem] sm:text-[11px]">
          More agents soon
        </p>
        <p className="mt-1.5 text-[10px] text-[#0B1F1B]/35 sm:text-[11px]" aria-hidden>
          —
        </p>
      </div>
      </div>
    </div>
  );
}
