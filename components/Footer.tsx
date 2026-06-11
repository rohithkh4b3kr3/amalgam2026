import Link from "next/link";
import { Flame, Mail, MapPin, ExternalLink } from "lucide-react";

const NAV = [
  ["Schedule",     "/schedule"],
  ["Speakers",     "/speakers"],
  ["Workshops",    "/workshops"],
  ["Competitions", "/competitions"],
] as const;

const ACCOUNT = [
  ["Login / Sign Up",      "/auth"],
  ["Register for Events",  "/register"],
  ["My Dashboard",         "/dashboard"],
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(255,107,0,0.1)] bg-[rgba(5,5,3,0.97)] backdrop-blur-sm mt-20">

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="md:col-span-2 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center border border-[rgba(255,107,0,0.32)]"
              style={{
                background: "linear-gradient(135deg, rgba(255,107,0,0.1), rgba(200,60,0,0.07))",
                boxShadow: "0 0 14px rgba(255,107,0,0.18)",
              }}
            >
              <Flame className="w-4 h-4 text-[#FF6B00]" />
            </div>
            <div className="flex flex-col leading-none gap-[3px]">
              <span className="font-display font-black text-lg tracking-[0.18em] text-metallic">AMALGAM</span>
              <span className="text-[8px] tracking-[0.32em] uppercase text-[rgba(160,140,110,0.4)]">IIT Madras · MME</span>
            </div>
          </div>

          <p className="text-[rgba(160,140,110,0.55)] text-sm leading-relaxed max-w-xs">
            The annual techno-cultural fest of the Department of Metallurgical &amp; Materials
            Engineering, IIT Madras.
          </p>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-[rgba(160,140,110,0.45)]">
              <MapPin className="w-3.5 h-3.5 text-[#FF9A00] shrink-0" />
              IIT Madras, Chennai — 600036
            </div>
            <div className="flex items-center gap-2 text-sm text-[rgba(160,140,110,0.45)]">
              <Mail className="w-3.5 h-3.5 text-[#FF9A00] shrink-0" />
              amalgam@mme.iitm.ac.in
            </div>
          </div>
        </div>

        {/* Navigate */}
        <div>
          <h4 className="font-display text-[10px] tracking-[0.28em] uppercase text-[rgba(255,107,0,0.5)] mb-5">
            Navigate
          </h4>
          <ul className="flex flex-col gap-2.5">
            {NAV.map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-[rgba(160,140,110,0.55)] hover:text-[#FF9A00] transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div>
          <h4 className="font-display text-[10px] tracking-[0.28em] uppercase text-[rgba(255,107,0,0.5)] mb-5">
            Account
          </h4>
          <ul className="flex flex-col gap-2.5">
            {ACCOUNT.map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-[rgba(160,140,110,0.55)] hover:text-[#FF9A00] transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://mme.iitm.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-[rgba(160,140,110,0.55)] hover:text-[#FF9A00] transition-colors duration-200"
              >
                Dept. Website <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="divider-electric mx-6" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-[rgba(160,140,110,0.28)]">
          © 2026 AMALGAM — IIT Madras MME Dept. All rights reserved.
        </p>
        <p className="text-xs text-[rgba(160,140,110,0.28)]">Built by the AMALGAM Web Team</p>
      </div>
    </footer>
  );
}
