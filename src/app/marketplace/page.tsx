"use client";


const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" };

const features = [
  {
    icon: "\uD83D\uDCB0",
    title: "Creator Plans",
    description: "Certified coaches. Real programs.",
  },
  {
    icon: "\uD83E\uDD16",
    title: "AI Formatting",
    description: "Upload a PDF. AI makes it beautiful.",
  },
  {
    icon: "\uD83D\uDCCA",
    title: "80/20 Split",
    description: "You keep 80%. No surprises.",
  },
];

export default function MarketplacePage() {
  return (
    <>
      <main style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px" }}>
        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: "52px", marginBottom: "16px" }}>🛒</div>

          <div style={{ display: "inline-block", marginBottom: "20px", background: "rgba(180,83,9,.15)", border: "1px solid rgba(180,83,9,.3)", color: "#f59e0b", fontSize: "10px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" as const, padding: "5px 16px", borderRadius: "100px" }}>
            Coming Soon
          </div>

          <h1 style={{ ...bebasNeue, fontSize: "clamp(52px,9vw,110px)", lineHeight: .9, marginBottom: "16px" }}>
            <span className="text-gradient-white" style={{ display: "block" }}>CREATOR</span>
            <span className="text-gradient-brand" style={{ display: "block" }}>MARKETPLACE</span>
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,.4)",
              fontSize: "15px",
              fontWeight: 300,
              lineHeight: 1.7,
              maxWidth: "480px",
              margin: "0 auto 40px",
            }}
          >
            Real programs from real coaches. Upload a PDF &mdash; AI formats it into a polished plan. Set your price. Keep 80%.
          </p>
        </div>

        {/* Feature Cards */}
        <div
          className="mkt-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            marginBottom: "40px",
            textAlign: "left" as const,
          }}
        >
          {features.map((f) => (
            <div key={f.title} className="card" style={{ padding: "24px", opacity: 0.75 }}>
              <div style={{ fontSize: "22px", marginBottom: "0.75rem" }}>{f.icon}</div>
              <h3 style={{ ...bebasNeue, fontSize: "20px", color: "#fff", marginBottom: "6px" }}>{f.title}</h3>
              <p style={{ color: "var(--whm)", fontSize: "12px", fontWeight: 300, lineHeight: 1.6, margin: 0 }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>

        {/* Waitlist */}
        <div
          className="card"
          style={{
            maxWidth: "420px",
            margin: "0 auto",
            textAlign: "center",
            padding: "36px",
            borderColor: "rgba(224,120,48,.2)",
          }}
        >
          <h2 style={{ ...bebasNeue, fontSize: "28px", marginBottom: "0.5rem", color: "#fff" }}>
            Join the Waitlist
          </h2>
          <p style={{ color: "var(--whm)", fontSize: "13px", fontWeight: 300, marginBottom: "20px" }}>
            1,200+ people signed up. Early access + 3 months free.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thanks! We\u2019ll notify you when the Marketplace launches.");
            }}
            style={{ display: "flex", gap: "10px", flexWrap: "wrap" as const }}
          >
            <input className="input-field" type="email" placeholder="your@email.com" required style={{ flex: 1, minWidth: 0 }} />
            <button className="btn-primary" type="submit" style={{ whiteSpace: "nowrap", padding: "14px 20px", flexShrink: 0 }}>
              Notify Me &rarr;
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
