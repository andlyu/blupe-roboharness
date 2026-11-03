import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RoboHarness × BluPe",
  description: "Visual-geometric robot control on BluPe remote YAM arms. Actual camera views, model provenance and integration evidence.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
