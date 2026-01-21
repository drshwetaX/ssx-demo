import Link from "next/link";

const PREFILLED = {
  title: "Salesforce Account Triage Agent",
  system: "Salesforce",
  approvals: "0 (read + draft only)",
  sensitivity: "Internal",
  allowed: ["Read", "Draft"],
  disallowed: ["Send externally", "Modify records without approval"],
  problem:
    "Summarize account health + pipeline risks from CRM data and draft a next-step email. Must not send messages or modify opportunity stages without approval.",
};

export default function FakeSalesforceDemoPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">
          Fake Salesforce – Governed Agent Demo
        </h1>
        <p className="mt-2 text-sm text-zinc-400 max-w-3xl">
          We can create a governed agent in minutes. It can read and draft immediately (0-approval),
          but any write action is gated behind approvals. Every run is monitored and auditable — and
          we can kill it instantly.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Guided steps */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
          <h2 className="text-lg font-medium text-white">7-minute walkthrough</h2>
          <ol className="mt-4 space-y-3 text-sm text-zinc-300">
            <li>
              <span className="text-zinc-400">1.</span> Load pre-filled Agent Spec (Salesforce triage)
            </li>
            <li>
              <span className="text-zinc-400">2.</span> Register agent (shows up in Registry)
            </li>
            <li>
              <span className="text-zinc-400">3.</span> Execute read + draft run (Monitor updates)
            </li>
            <li>
              <span className="text-zinc-400">4.</span> Attempt write action → deny_with_reason (Audit)
            </li>
            <li>
              <span className="text-zinc-400">5.</span> Switch to 2+ approvals → request approval (optional)
            </li>
            <li>
              <span className="text-zinc-400">6.</span> Kill switch (pause/kill)
            </li>
          </ol>

          <div className="mt-6 flex flex-wrap gap-3">
            {/* This links into your existing wizard route with a scenario name */}
            <Link
              href="/spec?scenario=fake-salesforce"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              Start demo (load spec)
            </Link>

            <Link
              href="/registry"
              className="rounded-xl border border-zinc-800 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              Open Agent Registry
            </Link>

            <Link
              href="/monitor"
              className="rounded-xl border border-zinc-800 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              Open Workflow Monitor
            </Link>

            <Link
              href="/audit"
              className="rounded-xl border border-zinc-800 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900"
            >
              Open Audit & Kill Switch
            </Link>
          </div>
        </section>

        {/* Right: Prefilled spec preview */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
          <h2 className="text-lg font-medium text-white">Pre-filled agent (sample)</h2>
          <p className="mt-1 text-sm text-zinc-400">
            This is what will load into the Agent Spec Wizard.
          </p>

          <div className="mt-4 space-y-3 text-sm">
            <Row k="Title" v={PREFILLED.title} />
            <Row k="System" v={PREFILLED.system} />
            <Row k="Approvals" v={PREFILLED.approvals} />
            <Row k="Sensitivity" v={PREFILLED.sensitivity} />
            <Row k="Allowed" v={PREFILLED.allowed.join(", ")} />
            <Row k="Disallowed" v={PREFILLED.disallowed.join(", ")} />
          </div>

          <div className="mt-5 rounded-xl border border-zinc-800 bg-black/30 p-4">
            <div className="text-xs font-semibold text-zinc-400 mb-2">Problem statement</div>
            <div className="text-sm text-zinc-200 whitespace-pre-wrap">
              {PREFILLED.problem}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="text-zinc-400">{k}</div>
      <div className="text-zinc-200 text-right">{v}</div>
    </div>
  );
}
