import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Nav } from "@/components/nav";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fitforgelifts.co"),
  title: {
    default: "FitForge — Build. Track. Share.",
    template: "%s | FitForge",
  },
  description:
    "Build AI workouts around your gym, track gains, share PRs with the community, and buy or sell programs on the social fitness marketplace.",
  openGraph: {
    type: "website",
    siteName: "FitForge",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏋️</text></svg>" />
      </head>
      <body>
        <SessionProvider>
          <div className="bg-radials" />
          <div className="relative z-10">
            <Nav />
            <main className="pt-[62px]">
              {children}
            </main>
            <footer className="relative z-10 border-t py-8 px-8 text-center" style={{ borderColor: "rgba(255,255,255,.06)" }}>
              <p className="text-[11px] tracking-[1px] uppercase" style={{ color: "rgba(255,255,255,.2)" }}>
                <Link href="/faq" className="no-underline hover:text-white/50 transition-colors" style={{ color: "rgba(255,255,255,.2)" }}>FAQ</Link>
                {" · "}
                <Link href="/privacy" className="no-underline hover:text-white/50 transition-colors" style={{ color: "rgba(255,255,255,.2)" }}>Privacy Policy</Link>
                {" · "}
                <a href="mailto:blake@fitforgelifts.co" className="no-underline hover:text-white/50 transition-colors" style={{ color: "rgba(255,255,255,.2)" }}>Contact</a>
              </p>
            </footer>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
