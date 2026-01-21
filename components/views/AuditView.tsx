"use client";
import { useMemo, useState } from "react";
import { Button, SectionTitle, Table, Pill } from "@/components/ui";
import { useDemo } from "@/components/DemoProvider";

export default function AuditView() {
  const { state, setAgentStatus } = useDemo();
  const [agentId, setAgentId] = useState<string>("");

  const events = useMemo(() => {
    if (!agentId) return state.audits;
    return state.audits.filter(e => e.agent_id === agentId);
  }, [agentId, state.audits]);

  const rows = events.slice(0, 50).map((e) => [
    <div key={e.event_id}>
      <div className="font-medium">{e.event}</div>
      <div className="text-xs text-zinc-500">{e.event_id} • {e.ts}</div>
    </div>,
    <div key={"ar"+e.event_id}>
      <div className="font-medium">{e.agent_id}</div>
      <div className="text-xs text-zinc-500">Run: {e.run_id}</div>
    </div>,
    <div key={"res"+e.event_id}>
      <Pill>{e.result}</Pill>
      <div className="mt-1 text-xs text-zinc-500">{e.obligations.join(", ")}</div>
    </div>,
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xl font-semibold">Audit & Kill Switch</div>
            <div className="mt-1 text-sm text-zinc-400">Human-readable trace objects + instant pause/kill (demo).</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select value={agentId} onChange={(e)=>setAgentId(e.target.value)}
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-600">
              <option value="">All agents</option>
              {state.agents.map((a) => (
                <option key={a.agent_id} value={a.agent_id}>{a.agent_id} — {a.name}</option>
              ))}
            </select>
            <Button variant="secondary" onClick={()=>agentId && setAgentStatus(agentId, "Paused")}>Pause</Button>
            <Button variant="secondary" onClick={()=>agentId && setAgentStatus(agentId, "Killed")}>Kill</Button>
          </div>
        </div>
      </div>

      <SectionTitle>Audit events</SectionTitle>
      <Table headers={["Event","Agent/Run","Result + Obligations"]} rows={rows} />

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 text-xs text-zinc-400">
        Tip: Try <span className="text-zinc-200">Workflow Monitor → Trigger demo run</span>, then come back here to see the new audit event.
      </div>
    </div>
  );
}
