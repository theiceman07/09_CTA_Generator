```tsx
import type { Metadata } from "next";
import {
  Schibsted_Grotesk,
  Anybody,
  Geist_Mono,
} from "next/font/google";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

const anybody = Anybody({
  variable: "--font-anybody",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CreatorOS — Autonomous Content Pipeline",
  description: "An AI-powered creative operating system for creators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-full">
      <body
        className={`${schibsted.variable} ${anybody.variable} ${geistMono.variable} antialiased theme-dark min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
```