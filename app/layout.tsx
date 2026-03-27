import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const siteUrl = "https:/gitproof-extreem.io";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Git Proof",
  description:
    "Issue and share developer proofs with verified project listings.",
  openGraph: {
    title: "Git Proof",
    description: "Issue and share developer proofs with verified project listings.",
    url: siteUrl,
    siteName: "GitProof",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/lordmarshy.png",
        width: 1200,
        height: 630,
        alt: "Git Proof"
      },
    ],
  },
};  

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
