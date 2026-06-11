"use client";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Clock, Calendar } from "lucide-react";
import { SPEAKERS } from "@/lib/data";
import ForgeBackground from "@/components/ForgeBackground";

const DAY_DATES = { 1: "Aug 14, 2026", 2: "Aug 15, 2026", 3: "Aug 16, 2026" } as const;
const ORG_SHORT: Record<string, string> = {
  "IIT Madras, MME": "IIT Madras",
  "DRDO, Hyderabad": "DRDO",
  "Tata Steel, Jamshedpur": "Tata Steel",
  "ISRO, Thiruvananthapuram": "ISRO",
  "Indian Institute of Science, Bangalore": "IISc",
};

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

function useParallax(speed = 0.45) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0; let latest = 0;
    const onScroll = () => {
      latest = window.scrollY;
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        if (ref.current) ref.current.style.transform = `translate3d(0,${latest * speed}px,0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);
  return ref;
}

export default function SpeakersPage() {
  const bgRef = useParallax(0.45);

  return (
    <div className="w-full min-h-screen pt-24" style={{ background: "#020100", color: "#C8B898" }}>

      {/* ── Hero strip ──────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ minHeight: 460 }}>
        <div ref={bgRef} className="absolute inset-0 will-change-transform" style={{ top: "-30%", height: "160%" }}>
          <ForgeBackground intensity={0.55} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to top, #020100, transparent)" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-[#FF6B00] tracking-[0.55em] text-[11px] uppercase block mb-5 font-bold">
              Keynote Series
            </span>
            <h1 className="font-display font-black text-[clamp(2.4rem,7vw,5.5rem)] text-white leading-[0.9] tracking-tight">
              SPEAKERS
            </h1>
            <p className="mt-4 text-[#7a5a30] max-w-xl text-base font-light leading-relaxed">
              World-class researchers and industry leaders from IIT Madras, ISRO, DRDO, IISc, and Tata Steel —
              sharing breakthroughs at the frontier of materials science.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Stats row ──────────────────────────────────────── */}
      <div className="border-y border-[rgba(255,107,0,0.1)] py-5" style={{ background: "rgba(2,1,0,0.95)" }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-10">
          {[
            { v: "5",  l: "Distinguished Speakers" },
            { v: "3",  l: "Days" },
            { v: "5+", l: "Institutions" },
          ].map(({ v, l }) => (
            <div key={l} className="flex flex-col gap-0.5">
              <span className="font-display font-black text-2xl text-[#FF9A00]">{v}</span>
              <span className="text-[10px] tracking-[0.22em] uppercase text-[#4a3018]">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Speaker grid ───────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="absolute inset-0 hex-grid opacity-35 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <h2 className="font-display text-3xl md:text-4xl font-light tracking-wide text-[#E8DCC8]">
            FEATURED SPEAKERS
          </h2>
          <div className="w-24 h-[2px] mt-4" style={{
            background: "linear-gradient(90deg, #FF6B00, rgba(255,107,0,0.2))"
          }} />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {SPEAKERS.map((speaker, i) => (
            <motion.div
              key={speaker.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="group rounded-2xl p-5 transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(255,107,0,0.4)";
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,107,0,0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
              }}
            >
              {/* Photo area */}
              <div className="aspect-square rounded-xl overflow-hidden mb-4 flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.5)" }}>
                {speaker.photo ? (
                  <img src={speaker.photo} alt={speaker.name}
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-light"
                    style={{
                      border: "1px solid rgba(255,107,0,0.3)",
                      color: "rgba(255,154,0,0.7)",
                      background: "rgba(0,0,0,0.5)",
                      fontFamily: "var(--font-orbitron)",
                    }}>
                    {getInitials(speaker.name)}
                  </div>
                )}
              </div>

              {/* Info */}
              <h4 className="font-display font-semibold text-sm text-[#E8DCC8] tracking-wide leading-snug mb-1">
                {speaker.name}
              </h4>
              <p className="text-[#FF9A00] text-xs mb-0.5">{speaker.designation}</p>
              <p className="text-[#5a4020] text-xs mb-3">
                {ORG_SHORT[speaker.organization] ?? speaker.organization}
              </p>

              {/* Divider */}
              <div className="h-px mb-3" style={{ background: "rgba(255,107,0,0.12)" }} />

              {/* Talk title */}
              <p className="text-[#7a5a30] text-[11px] leading-snug mb-3 italic">
                &ldquo;{speaker.talkTitle}&rdquo;
              </p>

              {/* Date/time */}
              <div className="flex flex-wrap gap-2 text-[10px] text-[#4a3018]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-2.5 h-2.5 text-[#FF6B00]" />
                  {DAY_DATES[speaker.day]}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-[#FF9A00]" />
                  {speaker.time}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Bio section — expanded cards ──────────────────── */}
      <section className="relative max-w-7xl mx-auto px-6 pb-24">
        <div className="absolute inset-0 hex-grid opacity-25 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-light tracking-wide text-[#E8DCC8]">
            SPEAKER PROFILES
          </h2>
          <div className="w-24 h-[2px] mt-4" style={{
            background: "linear-gradient(90deg, #FF9A00, rgba(255,154,0,0.2))"
          }} />
        </motion.div>

        <div className="flex flex-col gap-4">
          {SPEAKERS.map((speaker, i) => (
            <motion.div
              key={`bio-${speaker.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="flex flex-col sm:flex-row gap-5 p-5 sm:p-6 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Avatar small */}
              <div className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center text-sm font-display"
                style={{
                  background: "rgba(255,107,0,0.08)",
                  border: "1px solid rgba(255,107,0,0.25)",
                  color: "#FF9A00",
                }}>
                {getInitials(speaker.name)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-3 mb-1">
                  <span className="font-display font-bold text-sm text-[#F0D898]">{speaker.name}</span>
                  <span className="text-[#FF9A00] text-xs">{speaker.designation}</span>
                  <span className="text-[#4a3018] text-xs flex items-center gap-1">
                    <Building2 className="w-3 h-3" />{speaker.organization}
                  </span>
                </div>
                <p className="text-[#FF9A00] text-[11px] italic mb-2">{speaker.talkTitle}</p>
                <p className="text-[#5a4020] text-xs leading-relaxed">{speaker.bio}</p>
              </div>

              <div className="shrink-0 flex flex-row sm:flex-col gap-2 text-[10px] text-[#4a3018]">
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <Calendar className="w-3 h-3 text-[#FF6B00]" />{DAY_DATES[speaker.day]}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#FF9A00]" />{speaker.time} IST
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="h-px w-full" style={{
        background: "linear-gradient(90deg, transparent, rgba(255,107,0,0.4), rgba(255,184,0,0.6), rgba(255,107,0,0.4), transparent)"
      }} />
    </div>
  );
}
