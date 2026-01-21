import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSx – Enterprise Agent Design & Control Plane",
  description: "Instrument-led UI for designing, registering, and governing agents (demo).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-zinc-100">{children}</body>
    </html>
  );
}
