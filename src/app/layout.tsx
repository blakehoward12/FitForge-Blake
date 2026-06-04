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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://fitforgelifts.co/#org",
      name: "FitForge",
      url: "https://fitforgelifts.co",
      logo: "https://fitforgelifts.co/opengraph-image",
      email: "blake@fitforgelifts.co",
    },
    {
      "@type": "WebSite",
      "@id": "https://fitforgelifts.co/#website",
      url: "https://fitforgelifts.co",
      name: "FitForge",
      description:
        "Build AI workouts around your gym, track gains with XP and streaks, and share PRs with the community.",
      publisher: { "@id": "https://fitforgelifts.co/#org" },
    },
    {
      "@type": "MobileApplication",
      name: "FitForge — Workout Builder",
      operatingSystem: "iOS",
      applicationCategory: "HealthApplication",
      url: "https://fitforgelifts.co",
      downloadUrl: "https://apps.apple.com/us/app/fitforgelifts-workout-builder/id6761792263",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏋️</text></svg>" />
      </head>
      <body>
        <SessionProvider>
          <div className="relative z-10">
            <Nav />
            <main className="pt-[62px]">
              {children}
            </main>
            <footer className="relative z-10 border-t py-8 px-8 text-center" style={{ borderColor: "rgba(255,255,255,.06)" }}>
              <p className="text-[12px] tracking-[1px] uppercase" style={{ color: "rgba(255,255,255,.2)" }}>
                <Link href="/about" className="no-underline hover:text-white/50 transition-colors" style={{ color: "rgba(255,255,255,.2)" }}>About</Link>
                {" · "}
                <Link href="/faq" className="no-underline hover:text-white/50 transition-colors" style={{ color: "rgba(255,255,255,.2)" }}>FAQ</Link>
                {" · "}
                <Link href="/privacy" className="no-underline hover:text-white/50 transition-colors" style={{ color: "rgba(255,255,255,.2)" }}>Privacy Policy</Link>
                {" · "}
                <Link href="/contact" className="no-underline hover:text-white/50 transition-colors" style={{ color: "rgba(255,255,255,.2)" }}>Contact</Link>
              </p>
            </footer>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
