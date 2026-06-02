import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description:
    "Common questions about FitForge — pricing, the AI workout builder, the creator marketplace, social feed, gamified tracking, and contact info.",
  alternates: { canonical: "/faq" },
  openGraph: { url: "https://fitforgelifts.co/faq", images: ["/opengraph-image"] },
};

const bebas = { fontFamily: "'Bebas Neue', sans-serif" };

const faqs = [
  {
    q: "Is FitForge free to use?",
    a: "Yes — 1-day workouts are free forever. No credit card required to get started. Premium plans unlock multi-week programs, advanced tracking, and marketplace access.",
  },
  {
    q: "How does the AI workout builder work?",
    a: "You select the equipment you actually have and your current goal (strength, fat loss, muscle, etc.), and our AI generates a program built around exactly what you have access to. No filler exercises, no equipment you don't own.",
  },
  {
    q: "Can I sell my own workout programs?",
    a: "Yes! Once our Creator Marketplace launches, you can upload your programs, set your price, and keep 80% of every sale. Join the waitlist from the Marketplace page to get early access.",
  },
  {
    q: "What is the social fitness feed?",
    a: "The feed is where the FitForge community shares PRs, workout wins, and progress. You can follow athletes, react to posts, and stay motivated by people actually putting in the work.",
  },
  {
    q: "How does gamified tracking work?",
    a: "Every workout you log earns XP, helps build streaks, and unlocks achievements. It's designed to make showing up feel rewarding — because it is.",
  },
  {
    q: "What equipment types are supported?",
    a: "Everything from full commercial gyms to home setups with just a pair of dumbbells. You select what you have, and the AI only programs what you can actually do.",
  },
  {
    q: "Is my data private?",
    a: "Yes. We take your data seriously. Read our Privacy Policy for full details on what we collect and how it's used.",
  },
];

export default function FAQPage() {
  return (
    <>
      {/* ───────────────────────── HERO BANNER ───────────────────────── */}
      <section className="relative -mt-[62px] overflow-hidden">
        <div className="relative min-h-[440px] md:min-h-[520px] flex items-end">
          <Image
            src="/img/generated/faq-hero.jpg"
            alt="A friendly fitness coach in the gym ready to help"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Cinematic overlays — keep text legible, deepen brand mood */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,10,15,.85) 0%, rgba(10,10,15,.4) 40%, rgba(10,10,15,.7) 78%, rgba(10,10,15,.98) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 10% 90%, rgba(120,45,15,.45) 0%, transparent 50%), radial-gradient(ellipse at 90% 10%, rgba(90,45,130,.42) 0%, transparent 48%)" }} />

          <div className="relative z-10 w-full max-w-[760px] mx-auto px-8 pb-14 pt-[150px] text-center">
            <span className="chip mb-6 inline-block">Support</span>
            <h1 className="mb-5" style={{ ...bebas, fontSize: "clamp(52px,9vw,96px)", lineHeight: 0.9, letterSpacing: 1 }}>
              <span className="text-gradient-white block">FREQUENTLY</span>
              <span className="text-gradient-brand block">ASKED</span>
            </h1>
            <p className="font-light text-[15px] leading-[1.75] max-w-[460px] mx-auto" style={{ color: "rgba(255,255,255,.7)" }}>
              Got questions? We&apos;ve got answers. Can&apos;t find what you&apos;re looking for — reach out directly below.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="px-8 pt-16 pb-16 max-w-[760px] mx-auto">
        <div className="flex flex-col gap-4">
          {faqs.map((item, i) => (
            <div
              key={i}
              className="card transition-colors hover:border-white/15"
              style={{ padding: "28px 32px" }}
            >
              <h2
                className="text-white mb-3 flex items-start gap-3.5"
                style={{ ...bebas, fontSize: "clamp(18px,2.2vw,23px)", letterSpacing: 0.5, lineHeight: 1.1 }}
              >
                <span
                  className="shrink-0 text-white/90 text-[13px] mt-[3px]"
                  style={{ ...bebas, color: "var(--og)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{item.q}</span>
              </h2>
              <p className="font-light text-[14px] leading-[1.75] pl-[34px]" style={{ color: "rgba(255,255,255,.5)" }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-16 px-8 text-center max-w-[760px] mx-auto">
        <div
          className="card relative"
          style={{
            padding: "56px 40px",
            background: "radial-gradient(ellipse at 50% 0%,rgba(90,45,130,.18) 0%,transparent 62%),linear-gradient(135deg, rgba(120,45,15,.08), rgba(90,45,130,.06))",
            borderColor: "rgba(224,120,48,.18)",
          }}
        >
          <span className="chip mb-5">Still have questions?</span>
          <h2 className="text-white mb-3" style={{ ...bebas, fontSize: "clamp(32px,5vw,56px)", lineHeight: 0.95 }}>
            <span className="text-gradient-white block">GET IN</span>
            <span className="text-gradient-brand block">TOUCH</span>
          </h2>
          <p className="font-light text-[15px] leading-[1.75] max-w-[400px] mx-auto mb-8" style={{ color: "rgba(255,255,255,.55)" }}>
            We read every message. Whether it&apos;s a bug, a feature idea, or a partnership — reach out and we&apos;ll get back to you.
          </p>
          <a
            href="mailto:blake@fitforgelifts.co"
            className="btn-primary btn-glow"
            style={{ padding: "16px 40px", fontSize: 12 }}
            aria-label="Email blake@fitforgelifts.co"
          >
            blake@fitforgelifts.co
          </a>
        </div>
      </section>

      {/* Bottom links */}
      <section className="py-8 px-8 text-center pb-20">
        <p className="text-[12px] tracking-[1px]" style={{ color: "rgba(255,255,255,.25)" }}>
          <Link href="/privacy" className="no-underline hover:text-white/60 transition-colors" style={{ color: "rgba(255,255,255,.25)" }}>Privacy Policy</Link>
          {" · "}
          <Link href="/" className="no-underline hover:text-white/60 transition-colors" style={{ color: "rgba(255,255,255,.25)" }}>Back to Home</Link>
        </p>
      </section>
    </>
  );
}
