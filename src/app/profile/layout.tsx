import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your FitForge Profile & Stats",
  description:
    "Your FitForge profile — track workout streaks, view earned XP and achievements, manage saved programs, and check your community feed activity.",
  alternates: { canonical: "/profile" },
  robots: { index: false, follow: true },
  openGraph: { url: "https://fitforgelifts.co/profile", images: ["/opengraph-image"] },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
