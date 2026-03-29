import Link from "next/link";
import { Marquee } from "@/components/marquee";

const bebas = { fontFamily: "'Bebas Neue', sans-serif" };

const features: { emoji: string; chip: string; title: string; desc: string; cta: string; href: string; large?: boolean; green?: boolean; soon?: boolean; small?: boolean; emojiSize: number; descMb: number; tags?: string[] }[] = [
  { emoji: "🏋️", chip: "Equipment-First", title: "Workouts Built\nAround Your Gym", desc: "Select your equipment and goal — we build a program using only what you actually have. No generic plans.", cta: "Build My Workout →", href: "/builder", large: true, emojiSize: 28, descMb: 22 },
  { emoji: "📱", chip: "Community", title: "Social Fitness\nFeed", desc: "Share PRs, post workout wins, follow athletes who push you.", cta: "Open Feed →", href: "/feed", emojiSize: 26, descMb: 20 },
  { emoji: "🎮", chip: "Gamified", title: "Gamified Gym\nTracking", desc: "Earn XP, unlock achievements, build streaks.", cta: "Start Tracking →", href: "/builder", green: true, small: true, emojiSize: 24, descMb: 16 },
  { emoji: "🎨", chip: "Creator Economy", title: "Creator\nMarketplace", desc: "Buy programs from real coaches. Or become one — upload your plan, set your price, keep 80%.", cta: "Join Waitlist →", href: "/marketplace", soon: true, small: true, emojiSize: 24, descMb: 14, tags: ["📖 Buy plans", "💰 Sell plans", "🤖 AI formatting"] },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-[calc(100vh-62px)] flex flex-col items-center justify-center text-center px-8 py-20 pb-15">
        <span className="chip mb-9 animate-fadeUp">The world&apos;s first social fitness marketplace</span>
        <h1 style={{ ...bebas, lineHeight: 0.9, letterSpacing: 1, animation: "fadeUp 0.7s ease 0.1s both" }}>
          <span className="text-gradient-white block text-[clamp(90px,14vw,180px)]">FIT</span>
          <span className="text-gradient-brand block text-[clamp(90px,14vw,180px)]">FORGE</span>
        </h1>
        <p className="text-[clamp(14px,1.8vw,17px)] max-w-[440px] leading-[1.75] mx-auto mt-7 mb-12 font-light" style={{ color: "rgba(255,255,255,.55)", animation: "fadeUp 0.7s ease 0.2s both" }}>
          Workouts built around what you need.<br />Track it. Share it. Get paid for it.
        </p>
        <div className="flex gap-3.5 justify-center flex-wrap mb-4" style={{ animation: "fadeUp 0.7s ease 0.3s both" }}>
          <Link href="/builder" className="btn-primary" style={{ padding: "15px 34px", fontSize: 12 }}>Start Building →</Link>
          <Link href="/feed" className="btn-ghost" style={{ padding: "15px 34px", fontSize: 12 }}>Explore Community</Link>
        </div>
        <p className="text-[11px] mb-[70px] tracking-[.5px]" style={{ color: "rgba(255,255,255,.28)", animation: "fadeUp 0.7s ease 0.35s both" }}>
          No credit card needed. 1-day workouts are free forever.
        </p>
        <div className="flex gap-[52px] justify-center flex-wrap" style={{ animation: "fadeUp 0.7s ease 0.4s both" }}>
          {[["1,000+", "Workouts Created"], ["500+", "Active Users"], ["100+", "Creator Plans"]].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="text-gradient-white text-[44px] leading-none" style={bebas}>{num}</div>
              <div className="text-[10px] tracking-[2px] uppercase" style={{ color: "rgba(255,255,255,.35)", marginTop: 5 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      <Marquee items={["Workouts Built Around YOU", "Equipment-First Training", "Social Fitness Feed", "Track Every Set", "Creator Marketplace"]} />

      {/* Features */}
      <section className="py-[90px] px-8 max-w-[1160px] mx-auto">
        <span className="chip mb-4">What we built</span>
        <h2 className="text-white mb-3.5" style={{ ...bebas, fontSize: "clamp(40px,6vw,70px)", lineHeight: 1 }}>Four features.<br />One platform.</h2>
        <p className="text-[15px] max-w-[480px] leading-[1.7] font-light mb-12" style={{ color: "rgba(255,255,255,.4)" }}>
          AI workout building, gamified gym tracking, social fitness feed, and creator monetization — all in one place.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3.5">
          {features.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className={`card no-underline flex flex-col min-h-[280px] transition-transform hover:-translate-y-[3px] ${f.large ? "p-8 md:p-10 md:col-span-1" : ""}`}
              style={{
                padding: f.large ? undefined : (f.small ? "32px" : "36px"),
                ...(f.green ? { borderColor: "rgba(34,197,94,.14)", background: "radial-gradient(ellipse at 20% 80%,rgba(34,197,94,.07) 0%,transparent 60%),rgba(255,255,255,.02)" } : {}),
                ...(f.large ? { background: "radial-gradient(ellipse at 75% 0%,rgba(90,45,130,.14) 0%,transparent 55%),rgba(255,255,255,.025)" } : {}),
                ...(f.soon ? { position: "relative" as const, background: "radial-gradient(ellipse at 10% 90%,rgba(120,45,15,.16) 0%,transparent 60%),rgba(255,255,255,.02)" } : {}),
              }}
            >
              {f.soon && (
                <div className="absolute top-3.5 right-3.5 text-white text-[9px] font-bold tracking-[1.2px] uppercase py-1 rounded-full" style={{ paddingLeft: 9, paddingRight: 9, background: "linear-gradient(135deg,#b45309,#92400e)" }}>Soon</div>
              )}
              <div style={{ fontSize: f.emojiSize, marginBottom: f.small ? 12 : 14 }}>{f.emoji}</div>
              <span className={`chip self-start ${f.green ? "!text-[#4ade80] !border-[rgba(34,197,94,.2)] !bg-[rgba(34,197,94,.05)]" : ""}`} style={{ marginBottom: f.small ? 10 : 12 }}>{f.chip}</span>
              <h3 className="text-white leading-none flex-1 whitespace-pre-line" style={{ ...bebas, fontSize: f.large ? "clamp(28px,3.5vw,40px)" : (f.small ? "clamp(20px,2.2vw,26px)" : "clamp(24px,2.8vw,32px)"), marginBottom: f.small ? 8 : 10 }}>{f.title}</h3>
              <p className="font-light" style={{ color: f.large ? "rgba(255,255,255,.45)" : "rgba(255,255,255,.4)", fontSize: f.large ? "14px" : (f.title.includes("Social") ? "13px" : "12px"), lineHeight: f.small ? 1.65 : 1.7, marginBottom: f.large ? 22 : f.descMb }}>{f.desc}</p>
              {f.tags && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                  {f.tags.map((tag) => (
                    <span key={tag} style={{ background: "rgba(255,255,255,.05)", borderRadius: "100px", padding: "3px 10px", fontSize: "10px", color: "rgba(255,255,255,.4)" }}>{tag}</span>
                  ))}
                </div>
              )}
              <span className="font-bold tracking-[1.5px] uppercase" style={{ fontSize: f.small ? 11 : 12, color: f.green ? "#4ade80" : "var(--og)" }}>{f.cta}</span>
            </Link>
          ))}
        </div>
      </section>

      <Marquee items={["Your Equipment. Your Goals. Your Program.", "Structure Beats Vibes", "No Generic Plans"]} reverse />

      {/* Bottom CTA */}
      <section className="py-20 px-8 text-center">
        <h2 className="mb-3.5" style={{ ...bebas, fontSize: "clamp(40px,6vw,72px)", lineHeight: 1 }}>
          <span className="text-gradient-white block">READY TO</span>
          <span className="text-gradient-brand block">START FORGING?</span>
        </h2>
        <p className="text-[15px] font-light max-w-[400px] mx-auto mb-8 leading-[1.7]" style={{ color: "rgba(255,255,255,.4)" }}>
          Free to start. Your equipment, your goals, your program — built in seconds.
        </p>
        <Link href="/login" className="btn-primary" style={{ padding: "16px 42px", fontSize: 12 }}>Create Free Account →</Link>
      </section>
    </>
  );
}
