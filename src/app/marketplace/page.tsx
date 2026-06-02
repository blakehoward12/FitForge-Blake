"use client";

import { useState } from "react";
import Image from "next/image";

const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" };

const features = [
  {
    icon: "💰",
    title: "Creator Plans",
    description: "Certified coaches. Real programs you actually follow.",
    accent: "var(--og)",
  },
  {
    icon: "🤖",
    title: "AI Formatting",
    description: "Upload a PDF. AI turns it into a polished, guided plan.",
    accent: "var(--og2)",
  },
  {
    icon: "📊",
    title: "80/20 Split",
    description: "You keep 80%. Transparent payouts, no surprises.",
    accent: "var(--pl)",
  },
];

const coaches = [
  {
    img: "/img/generated/avatar5.png",
    name: "Marcus Bell",
    specialty: "Strength · 12 wk",
    bio: "Powerlifting coach. Built for raw numbers on the big three.",
    price: "$29",
  },
  {
    img: "/img/generated/avatar6.png",
    name: "Elena Reyes",
    specialty: "Hypertrophy",
    bio: "Science-based splits engineered for visible, lasting size.",
    price: "$34",
  },
  {
    img: "/img/generated/avatar4.png",
    name: "Theo Nguyen",
    specialty: "Mobility & Conditioning",
    bio: "Move better, recover faster, and outlast every session.",
    price: "$24",
  },
];

export default function MarketplacePage() {
  const [email, setEmail] = useState("");

  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "56px 24px 96px" }}>
      {/* ───────────────────────── Heading ───────────────────────── */}
      <div style={{ textAlign: "center", marginBottom: "3.25rem" }} className="animate-fadeUp">
        <span
          className="chip"
          style={{
            marginBottom: "20px",
            background: "rgba(180,83,9,.15)",
            border: "1px solid rgba(180,83,9,.3)",
            color: "#f59e0b",
          }}
        >
          Coming Soon
        </span>

        <h1 style={{ ...bebasNeue, fontSize: "clamp(52px,9vw,110px)", lineHeight: 0.9, margin: "20px 0 16px" }}>
          <span className="text-gradient-white" style={{ display: "block" }}>CREATOR</span>
          <span className="text-gradient-brand" style={{ display: "block" }}>MARKETPLACE</span>
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,.5)",
            fontSize: "16px",
            fontWeight: 300,
            lineHeight: 1.7,
            maxWidth: "520px",
            margin: "0 auto",
          }}
        >
          Real programs from real coaches. Upload a PDF &mdash; AI formats it into a polished plan. Set your price. Keep 80%.
        </p>
      </div>

      {/* ───────────────────────── Meet the coaches ───────────────────────── */}
      <section style={{ marginBottom: "64px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", marginBottom: "22px", flexWrap: "wrap" }}>
          <h2 style={{ ...bebasNeue, fontSize: "clamp(28px,4vw,40px)", color: "#fff", lineHeight: 1 }}>
            Meet the coaches
          </h2>
          <span style={{ color: "rgba(255,255,255,.4)", fontSize: "13px", fontWeight: 300 }}>
            A first look at who&rsquo;s joining at launch
          </span>
        </div>

        <div
          className="mkt-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          {coaches.map((c) => (
            <div
              key={c.name}
              className="card"
              style={{ padding: "22px", display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div
                  style={{
                    position: "relative",
                    width: 60,
                    height: 60,
                    borderRadius: "16px",
                    overflow: "hidden",
                    flexShrink: 0,
                    border: "1px solid var(--br)",
                  }}
                >
                  <Image src={c.img} alt={`Coach ${c.name}`} fill sizes="60px" className="object-cover" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ ...bebasNeue, fontSize: "22px", color: "#fff", lineHeight: 1.05 }}>{c.name}</h3>
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: "4px",
                      fontSize: "10px",
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      fontWeight: 700,
                    }}
                    className="text-gradient-brand"
                  >
                    {c.specialty}
                  </span>
                </div>
              </div>

              <p style={{ color: "var(--whm)", fontSize: "13px", fontWeight: 300, lineHeight: 1.6, margin: 0, flex: 1 }}>
                {c.bio}
              </p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                <span
                  className="chip"
                  style={{
                    color: "#fff",
                    borderColor: "rgba(224,120,48,.35)",
                    background: "linear-gradient(135deg, rgba(120,45,15,.3), rgba(90,45,130,.3))",
                    fontWeight: 700,
                    letterSpacing: "1px",
                  }}
                >
                  {c.price}
                </span>
                <button className="btn-ghost" type="button" disabled style={{ padding: "9px 16px", fontSize: "10px" }}>
                  Coming soon
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────── Feature Cards ───────────────────────── */}
      <div
        className="mkt-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          marginBottom: "56px",
          textAlign: "left",
        }}
      >
        {features.map((f) => (
          <div key={f.title} className="card" style={{ padding: "26px" }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                marginBottom: "16px",
                background: "linear-gradient(135deg, rgba(120,45,15,.3), rgba(90,45,130,.3))",
                border: "1px solid var(--br)",
              }}
            >
              {f.icon}
            </div>
            <h3 style={{ ...bebasNeue, fontSize: "22px", color: "#fff", marginBottom: "6px" }}>{f.title}</h3>
            <p style={{ color: "var(--whm)", fontSize: "13px", fontWeight: 300, lineHeight: 1.6, margin: 0 }}>
              {f.description}
            </p>
          </div>
        ))}
      </div>

      {/* ───────────────────────── Waitlist ───────────────────────── */}
      <div
        className="card animate-glow"
        style={{
          maxWidth: "460px",
          margin: "0 auto",
          textAlign: "center",
          padding: "40px 36px",
          borderColor: "rgba(224,120,48,.25)",
        }}
      >
        <h2 style={{ ...bebasNeue, fontSize: "32px", marginBottom: "0.5rem", color: "#fff" }}>
          Join the Waitlist
        </h2>
        <p style={{ color: "var(--whm)", fontSize: "13px", fontWeight: 300, marginBottom: "22px" }}>
          1,200+ people signed up. Early access + 3 months free.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thanks! We’ll notify you when the Marketplace launches.");
          }}
          style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
        >
          <input
            className="input-field"
            type="email"
            placeholder="your@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ flex: 1, minWidth: 0 }}
          />
          <button className="btn-primary" type="submit" style={{ whiteSpace: "nowrap", padding: "14px 20px", flexShrink: 0 }}>
            Notify Me &rarr;
          </button>
        </form>
      </div>
    </main>
  );
}
