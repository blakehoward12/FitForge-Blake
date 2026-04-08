import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Profile",
  description:
    "Your FitForge profile — track workout streaks, view earned XP and achievements, manage saved programs, and check your activity in the community feed.",
  alternates: { canonical: "/profile" },
  robots: { index: false, follow: true },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
