"use client";
import { useMemo, useState } from "react";
import { Button, SectionTitle, Table, Pill } from "@/components/ui";
import { useDemo } from "@/components/DemoProvider";
import type { Agent } from "@/lib/types";

function statusColor(status: Agent["status"]) {
  return status === "Active" ? "text-emerald-300" : status === "Draft" ? "text-amber-200" : status === "Paused" ? "text-yellow-200" : "text-rose-300";
}

export default function RegistryView() {
  const { state, setAgentStatus } = useDemo();
  const [q, setQ] = useState("");

  const agents = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return state.agents;
    return state.agents.filter(a => (a.name + " " + a.system + " " + a.owner).toLowerCase().includes(qq));
  }, [q, state.agents]);

  const rows = agents.map((a) => [
    <div key={a.agent_id}>
      <div className="font-medium">{a.name}</div>
      <div className="text-xs text-zinc-500">{a.agent_id} • {a.system}</div>
    </div>,
    <div key={"p"+a.agent_id} className="text-sm text-zinc-300">{a.purpose}</div>,
    <div key={"c"+a.agent_id} className="space-y-1">
      <div><Pill>{a.autonomy}</Pill> <Pill>{a.approval_mode}</Pill></div>
      <div className="text-xs text-zinc-500">Risk: {a.risk_tier}</div>
    </div>,
    <div key={"s"+a.agent_id} className={`text-sm ${statusColor(a.status)}`}>{a.status}</div>,
    <div key={"o"+a.agent_id} className="text-sm text-zinc-300">{a.owner}</div>,
    <div key={"a"+a.agent_id} className="space-y-2">
      <div className="text-xs text-zinc-500">Last: {a.last_activity}</div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => setAgentStatus(a.agent_id, "Paused")}>Pause</Button>
        <Button variant="secondary" onClick={() => setAgentStatus(a.agent_id, "Active")}>Activate</Button>
        <Button variant="secondary" onClick={() => setAgentStatus(a.agent_id, "Killed")}>Kill</Button>
      </div>
    </div>,
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xl font-semibold">Agent Registry</div>
            <div className="mt-1 text-sm text-zinc-400">System-of-record for agent identity, status, risk tier, approvals, and owner.</div>
          </div>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search agents…"
            className="w-64 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-600" />
        </div>
      </div>

      <SectionTitle>All agents</SectionTitle>
      <Table headers={["Agent","Purpose","Controls","Status","Owner","Actions"]} rows={rows} />
    </div>
  );
}
