"use client";
import { useMemo, useState } from "react";
import { Button, Pill } from "@/components/ui";

type Msg = { role: "user" | "ssx"; text: string };

const START: Msg[] = [{
  role: "ssx",
  text: "Hi — I’m SSx. Describe what you want the agent to do, or use the cards to generate a spec and register it. I’ll keep this conversational, but I’ll always end in a concrete artifact or state change.",
}];

export default function ChatPanel({ suggestions = [], onPickSuggestion }: { suggestions?: string[]; onPickSuggestion?: (s: string) => void; }) {
  const [msgs, setMsgs] = useState<Msg[]>(START);
  const [draft, setDraft] = useState("");
  const chips = useMemo(() => suggestions.slice(0, 6), [suggestions]);

  function send(t: string) {
    const text = t.trim();
    if (!text) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setDraft("");
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "ssx", text: "Got it. I can turn that into an Agent Spec (AURA) and then register it (AIF). If you want, click “Generate Agent Spec” to formalize it." }]);
    }, 120);
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Conversation</div>
        <Pill>Input surface</Pill>
      </div>

      <div className="mt-3 h-56 overflow-auto rounded-xl border border-zinc-900 bg-black/30 p-3 text-sm">
        {msgs.map((m, i) => (
          <div key={i} className="mb-3">
            <div className="text-xs text-zinc-500">{m.role === "ssx" ? "SSx" : "You"}</div>
            <div className="whitespace-pre-wrap text-zinc-100">{m.text}</div>
          </div>
        ))}
      </div>

      {chips.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((s) => (
            <button
              key={s}
              onClick={() => { onPickSuggestion?.(s); send(s); }}
              className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs hover:bg-zinc-900"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(draft); }}
          placeholder="Ask SSx…"
          className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-600"
        />
        <Button onClick={() => send(draft)}>Send</Button>
      </div>
    </div>
  );
}
