"use client";
import Link from "next/link";
import { ReactNode } from "react";

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-[11px] text-zinc-300">
      {children}
    </span>
  );
}

export function Button({
  children,
  onClick,
  href,
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  const base = "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition border";
  const styles =
    variant === "primary"
      ? "bg-blue-600 hover:bg-blue-500 border-blue-600 text-white"
      : variant === "secondary"
      ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-100"
      : "bg-transparent hover:bg-zinc-900 border-zinc-800 text-zinc-100";
  if (href) {
    return (
      <Link href={href} className={`${base} ${styles} ${className}`}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}

export function Card({
  title,
  desc,
  cta,
  onClick,
}: {
  title: string;
  desc: string;
  cta: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-5 text-left hover:bg-zinc-900"
    >
      <div className="text-base font-semibold">{title}</div>
      <div className="mt-2 text-sm text-zinc-400">{desc}</div>
      <div className="mt-4 text-sm font-medium text-blue-400">{cta} →</div>
    </button>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <div className="mb-3 text-xs font-semibold tracking-wide text-zinc-300">{children}</div>;
}

export function Table({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-950">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-xs font-semibold text-zinc-300">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-zinc-950/40">
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-zinc-900">
              {r.map((c, j) => (
                <td key={j} className="px-4 py-3 align-top">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
