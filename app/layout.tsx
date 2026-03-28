import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const siteUrl = "https://gitproof-extreem.io";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Git Proof",
    template: "%s · Git Proof",
  },
  description:
    "Issue and share developer proofs with verified project listings and public /proof pages.",
  openGraph: {
    title: "Git Proof",
    description:
      "Issue and share developer proofs with verified project listings and public /proof pages.",
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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="relative min-h-full flex flex-col"
        suppressHydrationWarning
      >
        {/* Layer 1: gradient background */}
        <div className="pointer-events-none fixed inset-0 z-0 bg-linear-to-br from-[rgb(8,71,47)] via-[rgb(4,53,34)] to-[rgb(2,25,15)]" aria-hidden />

        {/* Layer 2: image on top of gradient */}
        <div className="pointer-events-none fixed inset-0 z-10" aria-hidden>
          <Image
            src="/images/3D Abstract Liquid Shapes.png"
            alt=""
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>

        <div className="relative z-20 flex min-h-full flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
