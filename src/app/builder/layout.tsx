import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Workout Builder",
  description:
    "Build a custom workout in seconds. Tell FitForge your equipment and goal — we generate a structured plan around what you can actually use.",
  alternates: { canonical: "/builder" },
  openGraph: { url: "https://fitforgelifts.co/builder" },
};

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
