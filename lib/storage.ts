import type { Agent, AgentSpec, WorkflowRun, AuditEvent } from "./types";

const KEY = "ssx_demo_v2_state";

export type DemoState = {
  agents: Agent[];
  specs: AgentSpec[];
  workflows: WorkflowRun[];
  audits: AuditEvent[];
};

export function loadState(fallback: DemoState): DemoState {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fallback;
    return JSON.parse(raw) as DemoState;
  } catch {
    return fallback;
  }
}

export function saveState(state: DemoState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetState() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
