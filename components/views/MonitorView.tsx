"use client";
import { useMemo, useState } from "react";
import { Button, SectionTitle, Table, Pill } from "@/components/ui";
import { useDemo } from "@/components/DemoProvider";
import type { WorkflowRun } from "@/lib/types";

function stepColor(s: string) {
  return s === "done" ? "text-emerald-300" : s === "waiting" ? "text-amber-200" : "text-rose-300";
}
function nowIso(){ return new Date().toISOString(); }

export default function MonitorView() {
  const { state, addWorkflowRun, addAudit } = useDemo();
  const [filter, setFilter] = useState<"ALL"|"ALLOW"|"DENY"|"REQUIRES_APPROVAL">("ALL");

  const runs = useMemo(() => {
    if (filter === "ALL") return state.workflows;
    return state.workflows.filter(r => r.decision === filter);
  }, [filter, state.workflows]);

  function triggerDemoRun() {
    const run: WorkflowRun = {
      run_id: `RUN-${Math.floor(Math.random()*9000)+1000}`,
      agent_id: "AGT-005",
      agent_name: "Workflow Orchestrator (n8n)",
      scenario: "n8n cross-app workflow",
      trigger: "Incident pattern detected",
      decision: "REQUIRES_APPROVAL",
      approval_path: "1 approval (Platform Owner)",
      steps: [
        { name: "Detect pattern", status: "done" },
        { name: "Draft workflow change", status: "done" },
        { name: "Request approval", status: "waiting" },
        { name: "Publish workflow", status: "blocked" },
      ],
      ts: nowIso(),
    };
    addWorkflowRun(run);
    addAudit({
      event_id: `EVT-${Math.floor(Math.random()*9000)+1000}`,
      run_id: run.run_id,
      agent_id: run.agent_id,
      event: "approval_requested",
      result: "PENDING",
      obligations: ["hold_execution","notify_owner"],
      ts: nowIso(),
    });
  }

  const rows = runs.map((r) => [
    <div key={r.run_id}>
      <div className="font-medium">{r.scenario}</div>
      <div className="text-xs text-zinc-500">{r.run_id} • {r.ts}</div>
    </div>,
    <div key={"a"+r.run_id}>
      <div className="font-medium">{r.agent_name}</div>
      <div className="text-xs text-zinc-500">{r.agent_id}</div>
    </div>,
    <div key={"d"+r.run_id}>
      <Pill>{r.decision}</Pill> <Pill>{r.approval_path}</Pill>
      <div className="mt-1 text-xs text-zinc-500">{r.trigger}</div>
    </div>,
    <div key={"s"+r.run_id} className="space-y-1">
      {r.steps.map((s, i) => (
        <div key={i} className="flex items-center justify-between gap-3 text-xs">
          <span className="text-zinc-300">{s.name}</span>
          <span className={stepColor(s.status)}>{s.status}</span>
        </div>
      ))}
    </div>,
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xl font-semibold">Workflow Monitor</div>
            <div className="mt-1 text-sm text-zinc-400">Execution visibility: decisions, approvals path, and step status (demo).</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setFilter("ALL")}>All</Button>
            <Button variant="secondary" onClick={() => setFilter("ALLOW")}>Allow</Button>
            <Button variant="secondary" onClick={() => setFilter("REQUIRES_APPROVAL")}>Needs approval</Button>
            <Button variant="secondary" onClick={() => setFilter("DENY")}>Deny</Button>
            <Button onClick={triggerDemoRun}>Trigger demo run</Button>
          </div>
        </div>
      </div>

      <SectionTitle>Runs</SectionTitle>
      <Table headers={["Run","Agent","Decision","Steps"]} rows={rows} />
    </div>
  );
}
