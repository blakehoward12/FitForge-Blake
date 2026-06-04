import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at 25% 15%, rgba(90,45,130,.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 85%, rgba(224,120,48,.28) 0%, transparent 60%), #0a0a0f",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 128,
            fontWeight: 900,
            fontFamily: "sans-serif",
            background: "linear-gradient(135deg, #e07830 0%, #c85a8a 50%, #5a2d82 100%)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          F
        </div>
      </div>
    ),
    { ...size },
  );
}
