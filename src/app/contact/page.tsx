import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact FitForge",
  description:
    "Get in touch with the FitForge team — support, feedback, press, and partnerships. We read every message and aim to reply within one business day.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "https://fitforgelifts.co/contact", images: ["/opengraph-image"] },
};

const bebas = { fontFamily: "'Bebas Neue', sans-serif" };

const channels: { emoji: string; title: string; desc: string; cta: string; href: string }[] = [
  { emoji: "✉️", title: "Support & Feedback", desc: "Questions, bugs, or feature ideas — the founder reads every email personally.", cta: "blake@fitforgelifts.co", href: "mailto:blake@fitforgelifts.co" },
  { emoji: "🤝", title: "Press & Partnerships", desc: "Collaborations, coaching partnerships, or marketplace creator inquiries.", cta: "blake@fitforgelifts.co", href: "mailto:blake@fitforgelifts.co?subject=Partnership" },
  { emoji: "📱", title: "Join the Community", desc: "Share PRs, ask the community, and stay motivated on the social feed.", cta: "Open the feed →", href: "/feed" },
  { emoji: "❓", title: "Common Questions", desc: "Most answers — pricing, equipment, the builder — are covered in our FAQ.", cta: "Read the FAQ →", href: "/faq" },
];

export default function ContactPage() {
  return (
    <>
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative px-8 pt-[120px] pb-12 text-center overflow-hidden">
        <div className="bg-radials absolute inset-0 opacity-60" aria-hidden />
        <div className="relative z-10 max-w-[680px] mx-auto">
          <span className="chip mb-6 inline-block">We&apos;re listening</span>
          <h1 className="mb-5" style={{ ...bebas, fontSize: "clamp(48px,9vw,96px)", lineHeight: 0.9, letterSpacing: 1 }}>
            <span className="text-gradient-white block">GET IN</span>
            <span className="text-gradient-brand block">TOUCH</span>
          </h1>
          <p className="font-light text-[16px] leading-[1.75] max-w-[460px] mx-auto" style={{ color: "rgba(255,255,255,.7)" }}>
            Whether it&apos;s a bug, a feature idea, a partnership, or just a hello — we read every message and
            aim to reply within one business day.
          </p>
        </div>
      </section>

      {/* ───────────────────────── CHANNELS ───────────────────────── */}
      <section className="px-8 pb-12 max-w-[860px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {channels.map((c) => {
            const external = c.href.startsWith("mailto:");
            const inner = (
              <>
                <div style={{ fontSize: 26, marginBottom: 14 }}>{c.emoji}</div>
                <h2 className="text-white mb-2.5" style={{ ...bebas, fontSize: "clamp(22px,2.6vw,28px)", letterSpacing: 0.5 }}>{c.title}</h2>
                <p className="font-light text-[14.5px] leading-[1.7] mb-5" style={{ color: "rgba(255,255,255,.55)" }}>{c.desc}</p>
                <span className="font-bold tracking-[1px] uppercase text-[12px]" style={{ color: "var(--og)" }}>{c.cta}</span>
              </>
            );
            return external ? (
              <a key={c.title} href={c.href} className="card no-underline block transition-transform hover:-translate-y-[3px]" style={{ padding: "30px 30px" }}>{inner}</a>
            ) : (
              <Link key={c.title} href={c.href} className="card no-underline block transition-transform hover:-translate-y-[3px]" style={{ padding: "30px 30px" }}>{inner}</Link>
            );
          })}
        </div>
      </section>

      {/* ───────────────────────── PRIMARY EMAIL CTA ───────────────────────── */}
      <section className="px-8 pb-16 max-w-[860px] mx-auto">
        <div className="card text-center" style={{ padding: "48px 36px", background: "radial-gradient(ellipse at 50% 0%,rgba(90,45,130,.18) 0%,transparent 62%),linear-gradient(135deg, rgba(120,45,15,.08), rgba(90,45,130,.06))", borderColor: "rgba(224,120,48,.18)" }}>
          <h2 className="text-white mb-3" style={{ ...bebas, fontSize: "clamp(28px,4vw,44px)", lineHeight: 0.95 }}>Drop us a line</h2>
          <p className="font-light text-[15px] leading-[1.7] max-w-[400px] mx-auto mb-7" style={{ color: "rgba(255,255,255,.55)" }}>
            The fastest way to reach a real human on the FitForge team.
          </p>
          <a href="mailto:blake@fitforgelifts.co" className="btn-primary btn-glow" style={{ padding: "16px 40px", fontSize: 12 }} aria-label="Email blake@fitforgelifts.co">
            blake@fitforgelifts.co
          </a>
        </div>
      </section>

      {/* Bottom links */}
      <section className="py-8 px-8 text-center pb-24">
        <p className="text-[12px] tracking-[1px]" style={{ color: "rgba(255,255,255,.3)" }}>
          <Link href="/about" className="no-underline hover:text-white/60 transition-colors" style={{ color: "rgba(255,255,255,.3)" }}>About</Link>
          {" · "}
          <Link href="/faq" className="no-underline hover:text-white/60 transition-colors" style={{ color: "rgba(255,255,255,.3)" }}>FAQ</Link>
          {" · "}
          <Link href="/" className="no-underline hover:text-white/60 transition-colors" style={{ color: "rgba(255,255,255,.3)" }}>Back to Home</Link>
        </p>
      </section>
    </>
  );
}
