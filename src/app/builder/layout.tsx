import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workout Builder",
  description:
    "Build a custom workout program in seconds. Tell FitForge what equipment you have and your goal — we generate a structured plan around exactly what you can use. No filler, no generic templates.",
  alternates: { canonical: "/builder" },
};

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
