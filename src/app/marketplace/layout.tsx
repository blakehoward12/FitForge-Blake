import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creator Marketplace — Buy & Sell Workout Plans",
  description:
    "Buy workout programs from real coaches — or sell your own and keep 80% of every sale. Join the FitForge Creator Marketplace waitlist now.",
  alternates: { canonical: "/marketplace" },
  openGraph: { url: "https://fitforgelifts.co/marketplace" },
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
