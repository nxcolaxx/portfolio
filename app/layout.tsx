import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nicolas Bonati — Creative Strategist & Cultural Researcher",
  description: "Creative Strategist & Cultural Researcher. Strategy with cultural depth. Content with intent.",
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
