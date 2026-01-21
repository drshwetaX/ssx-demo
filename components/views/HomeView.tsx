"use client";
import { useRouter } from "next/navigation";
import { Card, SectionTitle, Button, Pill } from "@/components/ui";
import ChatPanel from "@/components/ChatPanel";
import { useDemo } from "@/components/DemoProvider";

export default function HomeView() {
  const router = useRouter();
  const { scenarios, reset } = useDemo();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <div className="text-2xl font-semibold">Design, register, and govern agents — safely.</div>
        <div className="mt-2 text-sm text-zinc-400">
          SSx turns a problem statement into an Agent Spec, oversight model, approvals path, registry entry, and audit trail.
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Pill>AURA: Design</Pill>
          <Pill>AIF: Control</Pill>
          <Pill>Artifacts + State</Pill>
          <Button variant="secondary" onClick={reset}>Reset demo data</Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card title="Generate Agent Spec" desc="Turn a problem statement into a structured agent design (scope, autonomy, oversight, controls)." cta="Start spec wizard" onClick={() => router.push("/spec")} />
        <Card title="Register an Agent" desc="Create the official registry record (owner, version, status, control bindings)." cta="Go to registry" onClick={() => router.push("/registry")} />
        <Card title="Agent Registry" desc="View all agents, their risk tier, rollout state, last activity, and controls." cta="Open registry" onClick={() => router.push("/registry")} />
        <Card title="Workflow Monitor" desc="See executions, decisions, approvals path, and step status across demo workflows." cta="Open monitor" onClick={() => router.push("/monitor")} />
        <Card title="Audit & Kill Switch" desc="Inspect trace objects and pause/kill an agent instantly with reason codes." cta="Open audit" onClick={() => router.push("/audit")} />
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <div className="text-base font-semibold">Try a demo scenario</div>
          <div className="mt-2 text-sm text-zinc-400">Launch an end-to-end storyline with 0-approval and 2+ approvals paths.</div>
          <div className="mt-4 space-y-2">
            {scenarios.map((s) => (
              <button key={s.id} onClick={() => router.push(`/spec?scenario=${encodeURIComponent(s.id)}`)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-left text-sm hover:bg-zinc-900">
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <SectionTitle>Conversation</SectionTitle>
        <ChatPanel
          suggestions={["Help me get an Agent Spec","Register an agent","Show Agent Registry","Show Workflow Monitor","Explain approvals (0 vs 2+)"]}
          onPickSuggestion={(s) => {
            const t = s.toLowerCase();
            if (t.includes("spec")) router.push("/spec");
            if (t.includes("registry")) router.push("/registry");
            if (t.includes("monitor")) router.push("/monitor");
          }}
        />
      </div>
    </div>
  );
}
