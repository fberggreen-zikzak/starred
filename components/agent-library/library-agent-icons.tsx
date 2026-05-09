import type { ComponentType } from "react";
import type { AgentIconKey } from "./library-agents-data";
import {
  IconChart,
  IconClock,
  IconDocument,
  IconGlobe,
  IconHeartPulse,
  IconMessage,
  IconScale,
  IconSparkle,
  IconTrendDown,
  IconUsers,
} from "./icons";

const map: Record<AgentIconKey, ComponentType<{ className?: string }>> = {
  "trend-down": IconTrendDown,
  users: IconUsers,
  clock: IconClock,
  chart: IconChart,
  message: IconMessage,
  "heart-pulse": IconHeartPulse,
  sparkle: IconSparkle,
  scale: IconScale,
  globe: IconGlobe,
  document: IconDocument,
};

export function LibraryAgentIcon({ name, className }: { name: AgentIconKey; className?: string }) {
  const Cmp = map[name];
  return <Cmp className={className} />;
}
