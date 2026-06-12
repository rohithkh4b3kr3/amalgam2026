import type { Metadata } from "next";
import { Orbitron, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar         from "@/components/Navbar";
import Footer         from "@/components/Footer";
import LenisWrapper   from "@/components/LenisWrapper";
import CursorLoader  from "@/components/CursorLoader";
import ScrollProgress from "@/components/ScrollProgress";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AMALGAM 2026 — IIT Madras MME Fest",
  description:
    "Where Elements Unite. The annual techno-cultural fest of the Department of Metallurgical & Materials Engineering, IIT Madras.",
  keywords: ["AMALGAM", "IIT Madras", "MME", "Metallurgy", "Materials Engineering", "Fest 2026"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${orbitron.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-white text-[#1A0A00] antialiased">
        <LenisWrapper>
          <ScrollProgress />
          <CursorLoader />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LenisWrapper>
      </body>
    </html>
  );
}
