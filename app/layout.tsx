import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nicolas Bonati — Influencer & Content Strategist",
  description: "Influencer and content strategist in São Paulo. Campaigns, content and creator partnerships for Neutrogena, Claro, Sanofi and Loft. Three creative awards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
