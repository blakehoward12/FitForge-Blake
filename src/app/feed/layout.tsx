import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Feed — Share PRs & Workout Wins",
  description:
    "The FitForge social feed — share PRs, post workout wins, follow real athletes, and stay motivated by people actually putting in the work.",
  alternates: { canonical: "/feed" },
  openGraph: { url: "https://fitforgelifts.co/feed" },
};

export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
