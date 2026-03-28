"use client";


const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" };

const features = [
  {
    icon: "\uD83C\uDFCB\uFE0F",
    title: "Creator Plans",
    description:
      "Top coaches and athletes publish structured training plans. Subscribe monthly or buy one-off programs tailored to your goals.",
  },
  {
    icon: "\uD83E\uDD16",
    title: "AI Formatting",
    description:
      "Upload any workout in plain text and our AI engine reformats it into a clean, trackable FitForge plan automatically.",
  },
  {
    icon: "\uD83D\uDCB0",
    title: "80 / 20 Split",
    description:
      "Creators keep 80% of every sale. We handle payments, delivery, and analytics so you can focus on coaching.",
  },
];

export default function MarketplacePage() {
  return (
    <>
      <main style={{ maxWidth: "52rem", margin: "0 auto", padding: "3rem 1rem" }}>
        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ ...bebasNeue, fontSize: "3rem", letterSpacing: "0.05em", lineHeight: 1.1, marginBottom: "1rem" }}>
            <span className="text-gradient-white">CREATOR</span>{" "}
            <span className="text-gradient-brand">MARKETPLACE</span>
          </h1>

          <span className="chip" style={{ marginBottom: "1rem" }}>
            Coming Soon
          </span>

          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "1.05rem",
              lineHeight: 1.7,
              maxWidth: "36rem",
              margin: "1rem auto 0",
            }}
          >
            A marketplace where elite coaches sell training plans and athletes discover proven programs
            &mdash; all powered by AI formatting and seamless tracking inside FitForge.
          </p>
        </div>

        {/* Feature Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))",
            gap: "1.25rem",
            marginBottom: "3rem",
          }}
        >
          {features.map((f) => (
            <div key={f.title} className="card" style={{ textAlign: "center", padding: "2rem 1.5rem" }}>
              <div style={{ fontSize: "2.25rem", marginBottom: "0.75rem" }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.5rem" }}>{f.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>

        {/* Waitlist */}
        <div
          className="card"
          style={{
            maxWidth: "28rem",
            margin: "0 auto",
            textAlign: "center",
            padding: "2rem",
            background: "linear-gradient(135deg, rgba(90,45,130,0.1), rgba(224,120,48,0.06))",
          }}
        >
          <h2 style={{ fontWeight: 700, fontSize: "1.15rem", marginBottom: "0.5rem" }}>
            Get notified at launch
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
            Be among the first creators on FitForge Marketplace.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thanks! We\u2019ll notify you when the Marketplace launches.");
            }}
            style={{ display: "flex", gap: "0.5rem" }}
          >
            <input className="input-field" type="email" placeholder="you@email.com" required style={{ flex: 1 }} />
            <button className="btn-primary" type="submit" style={{ whiteSpace: "nowrap" }}>
              Notify Me
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
