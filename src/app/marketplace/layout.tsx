import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creator Marketplace",
  description:
    "Buy workout programs from real coaches — or sell your own and keep 80% of every sale. The FitForge Creator Marketplace launches soon. Join the waitlist for early access.",
  alternates: { canonical: "/marketplace" },
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
