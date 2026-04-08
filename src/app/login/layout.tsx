import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In to Your FitForge Account",
  description:
    "Sign in to FitForge to access your AI workouts, track gym sessions, share PRs in the community feed, and manage your creator marketplace plans.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
  openGraph: { url: "https://fitforgelifts.co/login", images: ["/opengraph-image"] },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
