"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, SectionTitle, Pill } from "@/components/ui";
import ChatPanel from "@/components/ChatPanel";
import { useDemo } from "@/components/DemoProvider";
import type { AgentSpec } from "@/lib/types";

const STEPS = ["Problem", "Controls", "Readiness", "Finalize"] as const;

function nowIso() { return new Date().toISOString(); }
function id(prefix="SPEC"){ return `${prefix}-${Math.floor(Math.random()*90000)+10000}`; }

export default function SpecView() {
  const router = useRouter();
  const sp = useSearchParams();
  const { scenarios, addSpec, registerFromSpec } = useDemo();

  const scenarioId = sp.get("scenario");
  const scenario = useMemo(() => scenarios.find(s => s.id === scenarioId), [scenarios, scenarioId]);

  const [step, setStep] = useState(0);

  const [title, setTitle] = useState("New Agent");
  const [system, setSystem] = useState<AgentSpec["system"]>("ServiceNow");
  const [problem, setProblem] = useState("");
  const [autonomy, setAutonomy] = useState<AgentSpec["autonomy"]>("L2");
  const [approvals, setApprovals] = useState<AgentSpec["approvals"]>("0");
  const [sensitivity, setSensitivity] = useState<AgentSpec["data_sensitivity"]>("Internal");

  const [allowed, setAllowed] = useState<string[]>(["Read", "Draft"]);
  const [disallowed, setDisallowed] = useState<string[]>(["Send externally", "Modify records without approval"]);
  const [obligations, setObligations] = useState<string[]>(["log_trace", "mask_sensitive", "attach_freshness_ts"]);

  const [readiness, setReadiness] = useState<{score:number; decision:"GO"|"NO-GO"; reasons:string[]}>({
    score: 70,
    decision: "GO",
    reasons: ["Scope bounded", "Audit obligations present", "Writes gated by approvals"],
  });

  useEffect(() => {
    if (!scenario) return;
    setTitle(scenario.name.replace(/—.*/, "").trim());
    setSystem(scenario.system);
    setProblem(scenario.problem_statement);
    // Suggest approvals for high-risk scenarios
    if (scenario.system === "Workday" || scenario.system === "AWS") setApprovals("2+");
  }, [scenario]);

  function runGate() {
    let score = 0;
    const reasons: string[] = [];
    if (problem.trim().length > 30) { score += 25; reasons.push("Problem statement is specific"); }
    if (allowed.length >= 2) { score += 15; reasons.push("Allowed actions defined"); }
    if (disallowed.length >= 1) { score += 10; reasons.push("Disallowed actions explicit"); }
    if (obligations.includes("log_trace")) { score += 20; reasons.push("Audit trace required"); }
    if (approvals !== "0") { score += 10; reasons.push("Approvals model defined"); }
    if (sensitivity === "Restricted") { score -= 10; reasons.push("Restricted sensitivity increases risk"); }
    if (autonomy === "L4") { score -= 15; reasons.push("High autonomy increases risk"); }
    score = Math.max(0, Math.min(100, score));
    const decision = score >= 60 ? "GO" : "NO-GO";
    if (decision === "NO-GO") reasons.push("Tighten scope and controls");
    setReadiness({ score, decision, reasons });
  }

  function buildSpec(): AgentSpec {
    return {
      spec_id: id(),
      title,
      system,
      problem_statement: problem,
      persona: "Business User",
      business_outcome: "Reduce cycle time and improve consistency",
      agent_type: "Advisor",
      outputs: ["Summary", "Recommendation", "Draft"],
      autonomy,
      approvals,
      data_sensitivity: sensitivity,
      allowed_actions: allowed,
      disallowed_actions: disallowed,
      obligations,
      success_criteria: ["Accuracy ≥ 85%", "p95 latency ≤ 3s", "100% denied-with-reason"],
      created_at: nowIso(),
    };
  }

  function saveSpec() {
    addSpec(buildSpec());
    setStep(3);
  }

  function register() {
    const spec = buildSpec();
    addSpec(spec);
    registerFromSpec(spec);
    router.push("/registry");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xl font-semibold">Agent Spec Wizard</div>
            <div className="mt-1 text-sm text-zinc-400">Structured spec (AURA) → Registry entry (AIF) → Monitor + Audit.</div>
          </div>
          <Pill>Step {step+1}/{STEPS.length}: {STEPS[step]}</Pill>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {STEPS.map((s, i) => (
            <button key={s} onClick={() => setStep(i)}
              className={`rounded-full border px-3 py-2 text-xs ${i===step ? "border-blue-500 bg-blue-500/10 text-blue-200" : "border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-200"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-5">
          {step === 0 && (
            <>
              <SectionTitle>Problem</SectionTitle>
              <label className="block text-xs text-zinc-400">Title</label>
              <input value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-600" />
              <label className="block text-xs text-zinc-400">System</label>
              <select value={system} onChange={(e)=>setSystem(e.target.value as any)} className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-600">
                <option>Salesforce</option><option>Workday</option><option>ServiceNow</option><option>AWS</option><option>n8n</option>
              </select>
              <label className="block text-xs text-zinc-400">Problem statement</label>
              <textarea value={problem} onChange={(e)=>setProblem(e.target.value)} rows={6}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-600" />
              <div className="flex gap-2">
                <Button variant="ghost" onClick={()=>setStep(1)}>Next</Button>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <SectionTitle>Controls</SectionTitle>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-xs text-zinc-400">Autonomy</label>
                  <select value={autonomy} onChange={(e)=>setAutonomy(e.target.value as any)} className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-600">
                    <option>L1</option><option>L2</option><option>L3</option><option>L4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400">Approvals</label>
                  <select value={approvals} onChange={(e)=>setApprovals(e.target.value as any)} className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-600">
                    <option value="0">0 approvals</option>
                    <option value="1">1 approval</option>
                    <option value="2+">2+ approvals</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400">Sensitivity</label>
                  <select value={sensitivity} onChange={(e)=>setSensitivity(e.target.value as any)} className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-600">
                    <option>Public</option><option>Internal</option><option>Confidential</option><option>Restricted</option>
                  </select>
                </div>
              </div>

              <label className="block text-xs text-zinc-400">Allowed actions</label>
              <div className="flex flex-wrap gap-2">
                {["Read","Summarize","Draft","Update record","Execute workflow","Send externally"].map((a)=>(
                  <button key={a} onClick={()=>setAllowed(cur=>cur.includes(a)?cur.filter(x=>x!==a):[...cur,a])}
                    className={`rounded-full border px-3 py-2 text-xs ${allowed.includes(a) ? "border-blue-500 bg-blue-500/10 text-blue-200":"border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-200"}`}>
                    {a}
                  </button>
                ))}
              </div>

              <label className="block text-xs text-zinc-400">Disallowed actions (comma-separated)</label>
              <input value={disallowed.join(", ")} onChange={(e)=>setDisallowed(e.target.value.split(",").map(x=>x.trim()).filter(Boolean))}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-600" />

              <label className="block text-xs text-zinc-400">Obligations</label>
              <div className="flex flex-wrap gap-2">
                {["log_trace","mask_sensitive","attach_freshness_ts","deny_with_reason","require_approval_for_writes","budget_cap"].map((o)=>(
                  <button key={o} onClick={()=>setObligations(cur=>cur.includes(o)?cur.filter(x=>x!==o):[...cur,o])}
                    className={`rounded-full border px-3 py-2 text-xs ${obligations.includes(o) ? "border-blue-500 bg-blue-500/10 text-blue-200":"border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-200"}`}>
                    {o}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" onClick={()=>setStep(0)}>Back</Button>
                <Button variant="ghost" onClick={()=>setStep(2)}>Next</Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <SectionTitle>Readiness</SectionTitle>
              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Score</div>
                  <div className="text-sm">{readiness.score}/100</div>
                </div>
                <div className="mt-2 text-sm">Decision: <span className={readiness.decision==="GO"?"text-emerald-300":"text-rose-300"}>{readiness.decision}</span></div>
                <ul className="mt-2 list-disc pl-5 text-sm text-zinc-400 space-y-1">
                  {readiness.reasons.map((r,i)=><li key={i}>{r}</li>)}
                </ul>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={runGate}>Run readiness gate</Button>
                <Button variant="secondary" onClick={()=>setStep(1)}>Back</Button>
                <Button variant="ghost" onClick={()=>setStep(3)}>Next</Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <SectionTitle>Finalize</SectionTitle>
              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4 text-sm text-zinc-300">
                Save the spec as an artifact (AURA), then register it (AIF) to appear in the Agent Registry.
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={saveSpec}>Save spec</Button>
                <Button variant="secondary" onClick={register}>Register agent</Button>
                <Button variant="ghost" onClick={()=>router.push("/registry")}>Go to registry</Button>
              </div>
            </>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="text-sm font-semibold">Spec Preview</div>
            <div className="mt-2 text-xs text-zinc-400">Structured artifact (demo)</div>
            <pre className="mt-3 overflow-auto rounded-xl border border-zinc-900 bg-black/30 p-3 text-xs text-zinc-200">
{JSON.stringify({ title, system, autonomy, approvals, sensitivity, allowed, disallowed, obligations }, null, 2)}
            </pre>
          </div>

          <ChatPanel
            suggestions={["Help me get an Agent Spec","Set approvals to 2+","Add deny_with_reason","Register this agent"]}
            onPickSuggestion={(s) => {
              const t = s.toLowerCase();
              if (t.includes("2+")) setApprovals("2+");
              if (t.includes("deny_with_reason")) setObligations(cur => cur.includes("deny_with_reason") ? cur : [...cur, "deny_with_reason"]);
              if (t.includes("register")) register();
            }}
          />
        </div>
      </div>
    </div>
  );
}
