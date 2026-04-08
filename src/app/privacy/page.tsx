import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy & Data Protection",
  description:
    "How FitForge collects, uses, and protects your data — account info, workout logs, Stripe payments, third-party services, and your rights.",
  alternates: { canonical: "/privacy" },
  openGraph: { url: "https://fitforgelifts.co/privacy" },
};

const bebas = { fontFamily: "'Bebas Neue', sans-serif" };

const sections = [
  {
    title: "Information We Collect",
    body: `When you create an account, we collect your name and email address. When you use FitForge, we collect information you provide directly — such as workout logs, equipment selections, goals, and posts shared on the feed. We may also collect basic usage data (pages visited, features used) to improve the product.`,
  },
  {
    title: "How We Use Your Information",
    body: `We use your information to operate FitForge — including generating personalized workout programs, powering the social feed, tracking your progress, and processing payments. We do not sell your personal information to third parties.`,
  },
  {
    title: "Data Storage & Security",
    body: `Your data is stored securely using industry-standard encryption at rest and in transit. We use Turso (LibSQL) as our database provider. Payment processing is handled by Stripe, which is PCI-DSS compliant. We do not store full card numbers.`,
  },
  {
    title: "Cookies & Analytics",
    body: `FitForge uses session cookies required for authentication. We may use minimal analytics to understand how users interact with the platform. We do not use third-party advertising cookies.`,
  },
  {
    title: "Third-Party Services",
    body: `FitForge integrates with the following third-party services: Google (OAuth sign-in), Stripe (payments), and Turso (database). Each service has its own privacy policy governing how they handle data.`,
  },
  {
    title: "Your Rights",
    body: `You can request deletion of your account and associated data at any time by contacting us. You can also update your profile information directly within the app. If you have questions about your data, reach out to blake@fitforgelifts.co.`,
  },
  {
    title: "Children's Privacy",
    body: `FitForge is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us so we can delete it.`,
  },
  {
    title: "Changes to This Policy",
    body: `We may update this privacy policy from time to time. When we do, we'll update the date at the top of this page. Continued use of FitForge after changes are posted constitutes your acceptance of the updated policy.`,
  },
  {
    title: "Contact",
    body: `Questions or concerns about this policy? Reach out at blake@fitforgelifts.co — we read every message.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      {/* Header */}
      <section className="py-20 px-8 text-center max-w-[760px] mx-auto">
        <span className="chip mb-6">Legal</span>
        <h1 className="text-white mb-4" style={{ ...bebas, fontSize: "clamp(52px,8vw,90px)", lineHeight: 0.95 }}>
          <span className="text-gradient-white block">PRIVACY</span>
          <span className="text-gradient-brand block">POLICY</span>
        </h1>
        <p className="font-light text-[15px] leading-[1.75] max-w-[460px] mx-auto" style={{ color: "rgba(255,255,255,.45)" }}>
          Last updated: April 2025
        </p>
        <p className="font-light text-[14px] leading-[1.75] max-w-[500px] mx-auto mt-4" style={{ color: "rgba(255,255,255,.4)" }}>
          We keep this simple. Here&apos;s exactly what we collect, why, and how you can control it.
        </p>
      </section>

      {/* Policy Sections */}
      <section className="px-8 pb-16 max-w-[760px] mx-auto">
        <div className="flex flex-col gap-3.5">
          {sections.map((section, i) => (
            <div
              key={i}
              className="card"
              style={{ padding: "28px 32px" }}
            >
              <h2
                className="text-white mb-3"
                style={{ ...bebas, fontSize: "clamp(18px,2.2vw,22px)", letterSpacing: 0.5 }}
              >
                {i + 1}. {section.title}
              </h2>
              <p className="font-light text-[14px] leading-[1.8]" style={{ color: "rgba(255,255,255,.5)" }}>
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-8 px-8 text-center pb-20 max-w-[760px] mx-auto">
        <p className="text-[13px] leading-[1.75] font-light mb-6" style={{ color: "rgba(255,255,255,.3)" }}>
          Questions about this policy?{" "}
          <a
            href="mailto:blake@fitforgelifts.co"
            className="no-underline transition-colors hover:text-white/60"
            style={{ color: "var(--og)" }}
          >
            blake@fitforgelifts.co
          </a>
        </p>
        <p className="text-[12px] tracking-[1px]" style={{ color: "rgba(255,255,255,.2)" }}>
          <Link href="/faq" className="no-underline hover:text-white/60 transition-colors" style={{ color: "rgba(255,255,255,.2)" }}>FAQ</Link>
          {" · "}
          <Link href="/" className="no-underline hover:text-white/60 transition-colors" style={{ color: "rgba(255,255,255,.2)" }}>Back to Home</Link>
        </p>
      </section>
    </>
  );
}
