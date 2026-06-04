import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0f",
          borderRadius: 7,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
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
