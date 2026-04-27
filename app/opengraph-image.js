import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CricketIQ — Moneyball for grassroots cricket";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 64,
          background: "linear-gradient(135deg, #0f172a 0%, #14532d 100%)",
          color: "#f8fafc",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -2 }}>CricketIQ</div>
        <div style={{ marginTop: 16, fontSize: 32, fontWeight: 500, opacity: 0.95 }}>Moneyball for grassroots cricket.</div>
        <div style={{ marginTop: 40, fontSize: 22, opacity: 0.85, maxWidth: 900 }}>
          Structured performance data, rankings, Best XI, and community impact — by Kaushik Atla.
        </div>
      </div>
    ),
    { ...size }
  );
}
