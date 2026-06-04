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
      </head>
      <body>
        <SessionProvider>
          <div className="relative z-10">
            <Nav />
            <main className="pt-[62px]">
              {children}
            </main>
            <footer className="relative z-10 border-t py-6 px-8 text-center" style={{ borderColor: "rgba(255,255,255,.06)" }}>
              <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[12px] tracking-[1px] uppercase">
                {[["/about", "About"], ["/faq", "FAQ"], ["/privacy", "Privacy Policy"], ["/contact", "Contact"]].map(([href, label]) => (
                  <Link key={href} href={href} className="inline-flex items-center no-underline hover:text-white/60 transition-colors px-3 py-2.5 rounded-lg" style={{ color: "rgba(255,255,255,.28)" }}>{label}</Link>
                ))}
              </nav>
            </footer>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
