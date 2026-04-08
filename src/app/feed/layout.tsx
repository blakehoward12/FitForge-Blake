import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Feed",
  description:
    "The FitForge social feed — share PRs, post workout wins, follow real athletes, and stay motivated by people putting in the work. Fitness is more fun when it's social.",
  alternates: { canonical: "/feed" },
};

export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
