import { ImageResponse } from "next/og";

export const alt = "FitForge — Build. Track. Share.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at 25% 15%, rgba(90,45,130,.35) 0%, transparent 55%), radial-gradient(ellipse at 80% 85%, rgba(224,120,48,.28) 0%, transparent 55%), #0a0a0f",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Chip */}
        <div
          style={{
            display: "flex",
            padding: "10px 22px",
            border: "1px solid rgba(255,255,255,.15)",
            borderRadius: 999,
            color: "rgba(255,255,255,.7)",
            fontSize: 20,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 40,
            background: "rgba(255,255,255,.04)",
          }}
        >
          The world&apos;s first social fitness marketplace
        </div>

        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            fontSize: 220,
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: 4,
          }}
        >
          <span style={{ color: "#ffffff" }}>FIT</span>
          <span
            style={{
              background: "linear-gradient(135deg, #e07830 0%, #c85a8a 50%, #5a2d82 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            FORGE
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            marginTop: 44,
            fontSize: 34,
            color: "rgba(255,255,255,.55)",
            letterSpacing: 2,
            textTransform: "uppercase",
            fontWeight: 300,
          }}
        >
          Build. Track. Share.
        </div>

        {/* Footer url */}
        <div
          style={{
            position: "absolute",
            bottom: 44,
            display: "flex",
            fontSize: 22,
            color: "rgba(255,255,255,.35)",
            letterSpacing: 2,
          }}
        >
          fitforgelifts.co
        </div>
      </div>
    ),
    { ...size },
  );
}
