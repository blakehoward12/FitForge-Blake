import Link from "next/link";

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
      {/* Header */}
      <section className="py-20 px-8 text-center max-w-[760px] mx-auto">
        <span className="chip mb-6">Support</span>
        <h1 className="text-white mb-4" style={{ ...bebas, fontSize: "clamp(52px,8vw,90px)", lineHeight: 0.95 }}>
          <span className="text-gradient-white block">FREQUENTLY</span>
          <span className="text-gradient-brand block">ASKED</span>
        </h1>
        <p className="font-light text-[15px] leading-[1.75] max-w-[460px] mx-auto" style={{ color: "rgba(255,255,255,.45)" }}>
          Got questions? We&apos;ve got answers. Can&apos;t find what you&apos;re looking for — reach out directly below.
        </p>
      </section>

      {/* FAQ Items */}
      <section className="px-8 pb-16 max-w-[760px] mx-auto">
        <div className="flex flex-col gap-3.5">
          {faqs.map((item, i) => (
            <div
              key={i}
              className="card"
              style={{ padding: "28px 32px" }}
            >
              <h3
                className="text-white mb-3"
                style={{ ...bebas, fontSize: "clamp(18px,2.2vw,22px)", letterSpacing: 0.5 }}
              >
                {item.q}
              </h3>
              <p className="font-light text-[14px] leading-[1.75]" style={{ color: "rgba(255,255,255,.5)" }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-8 text-center max-w-[760px] mx-auto">
        <div
          className="card"
          style={{
            padding: "52px 40px",
            background: "radial-gradient(ellipse at 50% 0%,rgba(90,45,130,.14) 0%,transparent 60%),rgba(255,255,255,.025)",
          }}
        >
          <span className="chip mb-5">Still have questions?</span>
          <h2 className="text-white mb-3" style={{ ...bebas, fontSize: "clamp(32px,5vw,52px)", lineHeight: 1 }}>
            <span className="text-gradient-white block">GET IN</span>
            <span className="text-gradient-brand block">TOUCH</span>
          </h2>
          <p className="font-light text-[15px] leading-[1.75] max-w-[400px] mx-auto mb-8" style={{ color: "rgba(255,255,255,.45)" }}>
            We read every message. Whether it&apos;s a bug, a feature idea, or a partnership — reach out and we&apos;ll get back to you.
          </p>
          <a
            href="mailto:blake@fitforgelifts.co"
            className="btn-primary"
            style={{ padding: "15px 36px", fontSize: 12, display: "inline-block" }}
          >
            blake@fitforgelifts.co →
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
