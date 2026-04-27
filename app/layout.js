import "./globals.css";

const siteUrl = "https://cricketiq-alpha.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "CricketIQ | Moneyball for Grassroots Cricket",
  description: "CricketIQ helps local players turn casual matches into structured performance data, strategy, and community growth.",
  authors: [{ name: "Kaushik Atla" }],
  openGraph: {
    title: "CricketIQ",
    description: "Moneyball for grassroots cricket — analytics, rankings, and community impact.",
    url: siteUrl,
    siteName: "CricketIQ",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CricketIQ",
    description: "Moneyball for grassroots cricket.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
