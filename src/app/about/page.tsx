import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About FitForge — Our Mission",
  description:
    "FitForge builds workouts around your real equipment and goals, rewards every session with XP, and brings a community along for the ride. Here's why we built it.",
  alternates: { canonical: "/about" },
  openGraph: { url: "https://fitforgelifts.co/about", images: ["/opengraph-image"] },
};

const bebas = { fontFamily: "'Bebas Neue', sans-serif" };

const values: { emoji: string; title: string; desc: string }[] = [
  { emoji: "🏋️", title: "Equipment-First", desc: "Programs built around what you actually have — a full gym, a pair of dumbbells, or just the floor. Never generic." },
  { emoji: "🎮", title: "Rewarding by Design", desc: "Every set earns XP, builds streaks, and unlocks achievements. Showing up should feel like progress, because it is." },
  { emoji: "🤝", title: "Better Together", desc: "Following people who push you is the difference between starting and sticking. The feed keeps your crew close." },
  { emoji: "🔒", title: "Yours to Own", desc: "Your data, your goals, your pace. We keep it private and we keep it simple — no dark patterns, no noise." },
];

const stats: [string, string][] = [
  ["1,000+", "Workouts Forged"],
  ["500+", "Athletes Training"],
  ["50K+", "XP Earned Weekly"],
  ["80%", "Creator Payout"],
];

export default function AboutPage() {
  return (
    <>
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative -mt-[62px] overflow-hidden">
        <div className="relative min-h-[460px] md:min-h-[540px] flex items-end">
          <Image
            src="/img/generated/about-hero.jpg"
            alt="A diverse fitness community training and supporting each other in a gym"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,10,15,.85) 0%, rgba(10,10,15,.4) 42%, rgba(10,10,15,.7) 78%, rgba(10,10,15,.98) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 10% 90%, rgba(120,45,15,.45) 0%, transparent 50%), radial-gradient(ellipse at 90% 10%, rgba(90,45,130,.42) 0%, transparent 48%)" }} />
          <div className="relative z-10 w-full max-w-[820px] mx-auto px-8 pb-14 pt-[150px] text-center">
            <span className="chip mb-6 inline-block">Our mission</span>
            <h1 className="mb-5" style={{ ...bebas, fontSize: "clamp(46px,8vw,92px)", lineHeight: 0.9, letterSpacing: 1 }}>
              <span className="text-gradient-white block">BUILT FOR THE</span>
              <span className="text-gradient-brand block">EVERYDAY ATHLETE</span>
            </h1>
            <p className="font-light text-[16px] leading-[1.75] max-w-[520px] mx-auto" style={{ color: "rgba(255,255,255,.72)" }}>
              FitForge exists to make training feel like it&apos;s actually yours — built around your gear,
              your goals, and the people who keep you showing up.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────────────── STORY ───────────────────────── */}
      <section className="px-8 py-[80px] max-w-[760px] mx-auto">
        <span className="chip mb-5 inline-block">Why we built it</span>
        <h2 className="text-white mb-6" style={{ ...bebas, fontSize: "clamp(32px,5vw,52px)", lineHeight: 0.96 }}>
          Most fitness apps hand you<br />a plan you can&apos;t actually do.
        </h2>
        <div className="flex flex-col gap-5 font-light text-[16px] leading-[1.8]" style={{ color: "rgba(255,255,255,.62)" }}>
          <p>
            Generic programs assume a perfect commercial gym, unlimited time, and a coach over your shoulder.
            Real life isn&apos;t that. Some days it&apos;s a full rack; some days it&apos;s two dumbbells in a
            bedroom. So most people give up — not from lack of effort, but from plans that never fit.
          </p>
          <p>
            FitForge flips it. Tell us your goal and exactly what equipment you have, and we forge a program
            around <em>that</em>. Then we make the work stick: guided sessions, XP for every set, streaks, and a
            community feed where your friends&apos; wins pull you off the couch. Equipment-first, gamified, social —
            that&apos;s the whole idea.
          </p>
        </div>
      </section>

      {/* ───────────────────────── VALUES ───────────────────────── */}
      <section className="px-8 pb-[80px] max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {values.map((v) => (
            <div key={v.title} className="card" style={{ padding: "30px 30px" }}>
              <div style={{ fontSize: 26, marginBottom: 14 }}>{v.emoji}</div>
              <h3 className="text-white mb-2.5" style={{ ...bebas, fontSize: "clamp(22px,2.6vw,28px)", letterSpacing: 0.5 }}>{v.title}</h3>
              <p className="font-light text-[14.5px] leading-[1.7]" style={{ color: "rgba(255,255,255,.55)" }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────── STATS ───────────────────────── */}
      <section className="px-8 pb-[80px] max-w-[1100px] mx-auto">
        <div className="glass rounded-3xl px-8 py-10 flex flex-wrap justify-center gap-x-[64px] gap-y-8 text-center">
          {stats.map(([num, label]) => (
            <div key={label}>
              <div className="text-gradient-brand text-[clamp(38px,5vw,56px)] leading-none" style={bebas}>{num}</div>
              <div className="text-[12px] tracking-[2px] uppercase mt-2" style={{ color: "rgba(255,255,255,.55)" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────── FOUNDER ───────────────────────── */}
      <section className="px-8 pb-[80px] max-w-[760px] mx-auto">
        <div className="card" style={{ padding: "40px 36px", background: "radial-gradient(ellipse at 0% 0%,rgba(90,45,130,.14) 0%,transparent 60%),linear-gradient(135deg, rgba(120,45,15,.06), rgba(90,45,130,.05))" }}>
          <span className="chip mb-5 inline-block">From the founder</span>
          <p className="font-light text-[16px] leading-[1.85] mb-6" style={{ color: "rgba(255,255,255,.66)" }}>
            &ldquo;I built FitForge because I was tired of apps that didn&apos;t fit my life. I wanted something
            that worked with the gear I had on any given day, made the grind feel rewarding, and kept me connected
            to people chasing the same thing. That&apos;s what we&apos;re building — for everyone who trains, not
            just the people with a perfect setup.&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-full text-white text-[14px] font-bold" style={{ width: 44, height: 44, background: "linear-gradient(135deg, var(--og), var(--og2), var(--pm))" }}>B</div>
            <div>
              <div className="text-white text-[14px] font-semibold">Blake Howard</div>
              <div className="text-[12px]" style={{ color: "rgba(255,255,255,.45)" }}>Founder, FitForge</div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── CTA ───────────────────────── */}
      <section className="py-16 px-8 text-center pb-24">
        <h2 className="mb-4" style={{ ...bebas, fontSize: "clamp(34px,5vw,60px)", lineHeight: 0.95 }}>
          <span className="text-gradient-white block">JOIN THE</span>
          <span className="text-gradient-brand block">COMMUNITY</span>
        </h2>
        <p className="font-light text-[15px] leading-[1.7] max-w-[400px] mx-auto mb-8" style={{ color: "rgba(255,255,255,.5)" }}>
          Free to start. Your equipment, your goals, your crew — built in seconds.
        </p>
        <div className="flex gap-3.5 justify-center flex-wrap">
          <Link href="/builder" className="btn-primary" style={{ padding: "16px 40px", fontSize: 12 }}>Start Free →</Link>
          <Link href="/contact" className="btn-ghost" style={{ padding: "16px 36px", fontSize: 12 }}>Contact Us</Link>
        </div>
      </section>
    </>
  );
}
