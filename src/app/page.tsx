import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Marquee } from "@/components/marquee";

export const metadata: Metadata = {
  title: "FitForge — Set your goals. Train along. Forge together.",
  description:
    "Tell FitForge your goals and equipment, follow guided workouts that earn you XP, and challenge friends on the social feed. The fitness app built around real people.",
  alternates: { canonical: "/" },
  openGraph: { url: "https://fitforgelifts.co/", images: ["/opengraph-image"] },
};

const bebas = { fontFamily: "'Bebas Neue', sans-serif" };

type Pillar = {
  n: string;
  chip: string;
  title: string;
  desc: string;
  bullets: string[];
  cta: string;
  href: string;
  img: string;
  alt: string;
  accent: string;
  flip?: boolean;
};

const pillars: Pillar[] = [
  {
    n: "01",
    chip: "Goals & Equipment",
    title: "Built Around\nYour Body & Gear",
    desc: "Tell FitForge your goal and exactly what you're working with — a full gym, a single pair of dumbbells, or just the floor. We forge a program that fits what you actually have. No generic plans, no wasted reps.",
    bullets: ["Pick your goal & experience", "Select your real equipment", "Get a plan in seconds"],
    cta: "Build my workout",
    href: "/builder",
    img: "/img/generated/pillar1-equipment.png",
    alt: "Athlete selecting a dumbbell in a dark gym lit with orange and purple",
    accent: "var(--og)",
  },
  {
    n: "02",
    chip: "Guided & Gamified",
    title: "Follow Along.\nLevel Up.",
    desc: "Hit start and the app walks you through it set by set — reps, weight, rest, and form tips on tap. Every session earns XP, builds your streak, and unlocks achievements. Your grind, finally rewarded.",
    bullets: ["Step-by-step guided sessions", "Earn XP & build streaks", "Unlock achievements"],
    cta: "Start training",
    href: "/builder",
    img: "/img/generated/pillar2-xp.png",
    alt: "Athlete checking her workout on a phone mid-session in a moody gym",
    accent: "var(--gr)",
    flip: true,
  },
  {
    n: "03",
    chip: "Social Feed",
    title: "Stronger\nTogether.",
    desc: "Share PRs, react to your friends' wins, and throw down challenges on the FitFeed. Following the people who push you is the difference between starting and sticking. Train with your crew — even when you train alone.",
    bullets: ["Post PRs & workout wins", "Follow athletes who push you", "Challenge your friends"],
    cta: "Open the feed",
    href: "/feed",
    img: "/img/generated/pillar3-social.png",
    alt: "Two friends high-fiving and celebrating after a workout",
    accent: "var(--og2)",
  },
];

const stats: [string, string][] = [
  ["1,000+", "Workouts Forged"],
  ["500+", "Athletes Training"],
  ["50K+", "XP Earned Weekly"],
];

export default function HomePage() {
  return (
    <>
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative -mt-[62px] min-h-[100svh] flex items-end overflow-hidden">
        <Image
          src="/img/generated/hero.png"
          alt="Athlete celebrating a finished set, lit in orange and purple"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center]"
        />
        {/* Cinematic overlays — keep text legible, deepen brand mood */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,10,15,.82) 0%, rgba(10,10,15,.25) 38%, rgba(10,10,15,.55) 72%, rgba(10,10,15,.96) 100%)" }} />
        {/* Left scrim so hero copy stays readable over the photo */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(10,10,15,.92) 0%, rgba(10,10,15,.66) 30%, rgba(10,10,15,.2) 56%, transparent 78%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 12% 88%, rgba(120,45,15,.45) 0%, transparent 48%), radial-gradient(ellipse at 88% 8%, rgba(90,45,130,.4) 0%, transparent 46%)" }} />

        <div className="relative z-10 w-full max-w-[1160px] mx-auto px-8 pb-20 pt-[140px]">
          <span className="chip mb-6 inline-block animate-fadeUp">The social fitness app built around you</span>
          <h1 style={{ ...bebas, lineHeight: 0.86, letterSpacing: 1, filter: "drop-shadow(0 3px 16px rgba(0,0,0,.6))", animation: "fadeUp 0.7s ease 0.1s both" }}>
            <span className="text-gradient-white block text-[clamp(56px,11vw,150px)]">FORGE THE</span>
            <span className="text-gradient-brand block text-[clamp(56px,11vw,150px)]">BEST OF YOU</span>
          </h1>
          <p className="text-[clamp(15px,1.9vw,19px)] max-w-[520px] leading-[1.65] mt-6 mb-9 font-light" style={{ color: "rgba(255,255,255,.85)", textShadow: "0 1px 12px rgba(0,0,0,.6)", animation: "fadeUp 0.7s ease 0.2s both" }}>
            Set your goals and gear. Follow guided workouts that earn you XP.
            Challenge your friends on the feed. This is training with a crew behind you.
          </p>
          <div className="flex gap-3.5 flex-wrap items-center" style={{ animation: "fadeUp 0.7s ease 0.3s both" }}>
            <Link href="/builder" className="btn-primary" style={{ padding: "16px 36px", fontSize: 12 }}>Start Free →</Link>
            <Link href="/feed" className="btn-ghost" style={{ padding: "16px 36px", fontSize: 12 }}>Explore the Feed</Link>
          </div>
          <p className="text-[11px] mt-5 tracking-[.5px]" style={{ color: "rgba(255,255,255,.4)", animation: "fadeUp 0.7s ease 0.35s both" }}>
            No credit card needed · 1-day workouts free forever
          </p>

          <div className="glass inline-flex gap-[40px] gap-y-5 flex-wrap mt-12 px-7 py-5 rounded-3xl" style={{ animation: "fadeUp 0.7s ease 0.45s both" }}>
            {stats.map(([num, label]) => (
              <div key={label}>
                <div className="text-gradient-white text-[clamp(34px,4vw,48px)] leading-none" style={bebas}>{num}</div>
                <div className="text-[10px] tracking-[2px] uppercase mt-1.5" style={{ color: "rgba(255,255,255,.6)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Marquee items={["Set Your Goals", "Train With Your Gear", "Earn Every Rep", "Follow Your Crew", "Forge Your Streak"]} />

      {/* ───────────────────────── HOW IT WORKS ───────────────────────── */}
      <section className="py-[100px] px-8 max-w-[1160px] mx-auto">
        <div className="max-w-[620px] mb-[72px]">
          <span className="chip mb-4 inline-block">How it works</span>
          <h2 className="text-white mb-4" style={{ ...bebas, fontSize: "clamp(40px,6vw,76px)", lineHeight: 0.95 }}>
            Three steps.<br />One stronger you.
          </h2>
          <p className="text-[16px] leading-[1.7] font-light" style={{ color: "rgba(255,255,255,.5)" }}>
            FitForge turns &ldquo;I should work out&rdquo; into a plan you actually follow — built from your gear,
            powered by XP, and backed by people who push you.
          </p>
        </div>

        <div className="flex flex-col gap-[88px] md:gap-[120px]">
          {pillars.map((p) => (
            <div key={p.n} className="grid grid-cols-1 md:grid-cols-2 gap-9 md:gap-16 items-center">
              {/* Image */}
              <div className={`relative ${p.flip ? "md:order-2" : ""}`}>
                <div className="relative aspect-[3/4] rounded-[24px] overflow-hidden card !p-0" style={{ boxShadow: "0 30px 80px rgba(0,0,0,.5)" }}>
                  <Image
                    src={p.img}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, transparent 55%, rgba(10,10,15,.45) 100%)" }} />
                </div>
                {/* Step number — anchored in the image's top-left corner */}
                <div
                  className="absolute top-4 left-4 z-10 flex items-center justify-center rounded-2xl text-white"
                  style={{ ...bebas, width: 64, height: 64, fontSize: 32, background: "linear-gradient(135deg, var(--og), var(--og2), var(--pm))", boxShadow: "0 10px 30px rgba(224,120,48,.45)" }}
                >
                  {p.n}
                </div>
              </div>

              {/* Text */}
              <div className={p.flip ? "md:order-1" : ""}>
                <span className="chip mb-5 inline-block" style={{ color: p.accent, borderColor: "rgba(255,255,255,.16)" }}>{p.chip}</span>
                <h3 className="text-white whitespace-pre-line mb-5" style={{ ...bebas, fontSize: "clamp(38px,5vw,66px)", lineHeight: 0.94 }}>{p.title}</h3>
                <p className="text-[17px] leading-[1.75] font-light mb-7" style={{ color: "rgba(255,255,255,.62)" }}>{p.desc}</p>
                <ul className="flex flex-col gap-3 mb-8">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-[15px] font-light" style={{ color: "rgba(255,255,255,.8)" }}>
                      <span className="flex items-center justify-center rounded-full shrink-0 text-[11px] font-bold text-white" style={{ width: 22, height: 22, background: "linear-gradient(135deg, var(--og), var(--pm))" }}>✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <Link href={p.href} className="btn-primary" style={{ padding: "14px 30px", fontSize: 12 }}>{p.cta} →</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Marquee items={["Your Equipment. Your Goals. Your Program.", "Structure Beats Vibes", "Train. Track. Forge."]} reverse />

      {/* ───────────────────────── BOTTOM CTA ───────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="relative min-h-[560px] flex items-center">
          <Image
            src="/img/generated/cta-group.png"
            alt="A group of athletes together in the gym"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(10,10,15,.94) 0%, rgba(10,10,15,.7) 50%, rgba(10,10,15,.4) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 0% 100%, rgba(120,45,15,.4) 0%, transparent 55%)" }} />

          <div className="relative z-10 w-full max-w-[1160px] mx-auto px-8 py-24">
            <h2 className="mb-4" style={{ ...bebas, fontSize: "clamp(40px,7vw,86px)", lineHeight: 0.92 }}>
              <span className="text-gradient-white block">READY TO</span>
              <span className="text-gradient-brand block">START FORGING?</span>
            </h2>
            <p className="text-[16px] font-light max-w-[440px] mb-9 leading-[1.7]" style={{ color: "rgba(255,255,255,.65)" }}>
              Free to start. Your equipment, your goals, your crew — your program, built in seconds.
            </p>
            <div className="flex gap-3.5 flex-wrap">
              <Link href="/login" className="btn-primary btn-glow" style={{ padding: "17px 44px", fontSize: 12 }}>Create Free Account →</Link>
              <Link href="/builder" className="btn-ghost" style={{ padding: "17px 40px", fontSize: 12 }}>Try the Builder</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
