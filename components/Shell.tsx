"use client";
import Link from "next/link";
import { ReactNode, useMemo, useState } from "react";
import { Pill } from "@/components/ui";

type NavItem = { href: string; label: string; group: string };
const NAV: NavItem[] = [
  { href: "/", label: "Home", group: "SSx" },
  { href: "/spec", label: "Agent Spec Wizard", group: "AURA – Design" },
  { href: "/registry", label: "Agent Registry", group: "AIF – Lifecycle" },
  { href: "/monitor", label: "Workflow Monitor", group: "AIF – Operations" },
  { href: "/audit", label: "Audit & Kill Switch", group: "Governance" },
];

export default function Shell({ children }: { children: ReactNode }) {
  const [q, setQ] = useState("");
  const grouped = useMemo(() => {
    const filtered = NAV.filter((n) => (n.label + " " + n.group).toLowerCase().includes(q.trim().toLowerCase()));
    const map = new Map<string, NavItem[]>();
    for (const item of filtered) {
      if (!map.has(item.group)) map.set(item.group, []);
      map.get(item.group)!.push(item);
    }
    return Array.from(map.entries());
  }, [q]);

  return (
    <div className="h-screen w-screen bg-black text-zinc-100">
      <div className="grid h-full grid-cols-[340px_1fr]">
        <aside className="border-r border-zinc-800 bg-zinc-950/50">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-zinc-800" />
              <div>
                <div className="text-sm font-semibold">SSx</div>
                <div className="text-xs text-zinc-400">Enterprise Agent Design & Control Plane</div>
              </div>
            </div>
            <div className="mt-4">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search instruments…"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-600"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Pill>Demo-ready</Pill>
              <Pill>0 / 2+ approvals</Pill>
              <Pill>Registry + Monitor</Pill>
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="space-y-4">
              {grouped.map(([group, items]) => (
                <div key={group}>
                  <div className="mb-2 text-xs font-semibold text-zinc-300">{group}</div>
                  <div className="space-y-2">
                    {items.map((it) => (
                      <Link
                        key={it.href}
                        href={it.href}
                        className="block rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-left hover:bg-zinc-900"
                      >
                        <div className="text-sm font-medium">{it.label}</div>
                        <div className="mt-1 text-xs text-zinc-400">
                          {it.label === "Home"
                            ? "Exec entry points + demos"
                            : it.label === "Agent Spec Wizard"
                            ? "Structured spec + oversight + readiness"
                            : it.label === "Agent Registry"
                            ? "All agents, versions, statuses"
                            : it.label === "Workflow Monitor"
                            ? "Runs, decisions, step status"
                            : "Trace, pause/kill, reason codes"}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-xs text-zinc-400">
              Tip: start with <span className="text-zinc-200">Home → Try a demo scenario</span> for a 7‑minute exec walkthrough.
            </div>
          </div>
        </aside>

        <main className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
            <div>
              <div className="text-sm font-semibold">SSx – Enterprise Agent Design & Control Plane</div>
              <div className="text-xs text-zinc-400">Conversation for input. Instruments for commitment. Artifacts + state for governance.</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-300">
                Mode: <span className="text-zinc-100">Demo</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-zinc-800" title="User" />
            </div>
          </div>

          <div className="flex-1 overflow-auto px-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
