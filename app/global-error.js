"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", margin: 0, padding: "2rem", background: "#f8fafc", color: "#0f172a" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>CricketIQ hit a critical error</h1>
        <p style={{ marginTop: "0.75rem", maxWidth: "32rem", fontSize: "0.875rem" }}>{error?.message || "Please reload the app."}</p>
        <button type="button" style={{ marginTop: "1.5rem", padding: "0.5rem 1rem", borderRadius: "0.75rem", border: "none", background: "#0f172a", color: "#fff", fontWeight: 600 }} onClick={() => reset()}>
          Try again
        </button>
      </body>
    </html>
  );
}
