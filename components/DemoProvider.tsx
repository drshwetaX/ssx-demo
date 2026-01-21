"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Agent, AgentSpec, AuditEvent, Scenario, WorkflowRun } from "@/lib/types";
import { loadState, saveState, resetState, type DemoState } from "@/lib/storage";
import agentsSeed from "@/data/demo/agents.json";
import workflowsSeed from "@/data/demo/workflows.json";
import auditsSeed from "@/data/demo/audits.json";

type Ctx = {
  state: DemoState;
  scenarios: Scenario[];
  addSpec: (spec: AgentSpec) => void;
  registerFromSpec: (spec: AgentSpec) => void;
  setAgentStatus: (agent_id: string, status: Agent["status"]) => void;
  addWorkflowRun: (run: WorkflowRun) => void;
  addAudit: (evt: AuditEvent) => void;
  reset: () => void;
};

const DemoContext = createContext<Ctx | null>(null);

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("DemoProvider missing");
  return ctx;
}

function nowIso() { return new Date().toISOString(); }

function nextAgentId(existing: Agent[]) {
  const nums = existing.map((a) => parseInt(a.agent_id.replace("AGT-", ""), 10)).filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `AGT-${String(next).padStart(3, "0")}`;
}

export default function DemoProvider({ children }: { children: React.ReactNode }) {
  const scenarios: Scenario[] = require("@/data/demo/scenarios.json");
  const fallback: DemoState = useMemo(() => ({
    agents: (agentsSeed as Agent[]).map((a) => ({ ...a, status: a.status as any })),
    specs: [],
    workflows: workflowsSeed as WorkflowRun[],
    audits: auditsSeed as AuditEvent[],
  }), []);

  const [state, setState] = useState<DemoState>(fallback);

  useEffect(() => { setState(loadState(fallback)); }, [fallback]);
  useEffect(() => { saveState(state); }, [state]);

  const api: Ctx = {
    state,
    scenarios,
    addSpec(spec) { setState((s) => ({ ...s, specs: [spec, ...s.specs] })); },
    registerFromSpec(spec) {
      setState((s) => {
        const id = nextAgentId(s.agents);
        const agent: Agent = {
          agent_id: id,
          name: spec.title,
          system: spec.system as any,
          purpose: spec.problem_statement,
          autonomy: spec.autonomy as any,
          approval_mode: spec.approvals === "0" ? "0-approval" : spec.approvals === "1" ? "1-approval" : "2-approvals",
          risk_tier: spec.data_sensitivity === "Restricted" ? "High" : spec.data_sensitivity === "Confidential" ? "High" : "Medium",
          status: "Draft",
          owner: "Demo Owner",
          last_activity: nowIso(),
        };
        const evt: AuditEvent = {
          event_id: `EVT-${Math.floor(Math.random() * 9000) + 1000}`,
          run_id: "N/A",
          agent_id: agent.agent_id,
          event: "agent_registered",
          result: "DRAFT",
          obligations: ["registry_entry_created", "audit_enabled"],
          ts: nowIso(),
        };
        return { ...s, agents: [agent, ...s.agents], audits: [evt, ...s.audits] };
      });
    },
    setAgentStatus(agent_id, status) {
      setState((s) => {
        const agents = s.agents.map((a) => a.agent_id === agent_id ? { ...a, status, last_activity: nowIso() } : a);
        const evt: AuditEvent = {
          event_id: `EVT-${Math.floor(Math.random() * 9000) + 1000}`,
          run_id: "N/A",
          agent_id,
          event: "agent_status_changed",
          result: status,
          obligations: ["registry_updated", "notify_ops"],
          ts: nowIso(),
        };
        return { ...s, agents, audits: [evt, ...s.audits] };
      });
    },
    addWorkflowRun(run) { setState((s) => ({ ...s, workflows: [run, ...s.workflows] })); },
    addAudit(evt) { setState((s) => ({ ...s, audits: [evt, ...s.audits] })); },
    reset() { resetState(); setState(fallback); },
  };

  return <DemoContext.Provider value={api}>{children}</DemoContext.Provider>;
}
