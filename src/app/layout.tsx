import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Nav } from "@/components/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitForge — Build. Track. Share.",
  description: "AI workout building, gamified gym tracking, social fitness feed, and creator monetization — all in one place.",
  openGraph: {
    title: "FitForge — Build. Track. Share.",
    description: "AI workout building, gamified gym tracking, social fitness feed, and creator monetization.",
    type: "website",
    url: "https://fitforgelifts.co",
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
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
