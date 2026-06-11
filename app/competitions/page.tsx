"use client";
import { useState, useRef, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Users, Award, Calendar, ChevronDown, ChevronUp, ArrowRight, Zap, Shield, X } from "lucide-react";
import { COMPETITIONS } from "@/lib/data";
import ForgeBackground from "@/components/ForgeBackground";
import Link from "next/link";

function useParallax(speed = 0.45) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0; let latest = 0;
    const onScroll = () => { latest = window.scrollY; if (!raf) raf = requestAnimationFrame(() => { raf = 0; if (ref.current) ref.current.style.transform = `translate3d(0,${latest * speed}px,0)`; }); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);
  return ref;
}

function PrizeRow({ rank, amount }: { rank: string; amount: string }) {
  const styles: Record<string, { text: string; border: string; bg: string; icon: string }> = {
    "1st": { text: "#FFE060", border: "rgba(255,224,96,0.25)",  bg: "rgba(255,224,96,0.05)",  icon: "🥇" },
    "2nd": { text: "#D4A860", border: "rgba(212,168,96,0.2)",   bg: "rgba(212,168,96,0.04)",  icon: "🥈" },
    "3rd": { text: "#B07840", border: "rgba(176,120,64,0.18)",  bg: "rgba(176,120,64,0.035)", icon: "🥉" },
  };
  const s = styles[rank] ?? { text: "#A87838", border: "rgba(255,184,0,0.15)", bg: "rgba(255,184,0,0.03)", icon: "" };
  return (
    <div className="flex items-center justify-between px-4 py-2.5 text-sm"
      style={{
        color: s.text, borderWidth: 1, borderStyle: "solid",
        borderColor: s.border, background: s.bg,
        clipPath: "polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)",
      }}>
      <span className="font-bold font-display tracking-wide flex items-center gap-2">{s.icon} {rank} Place</span>
      <span className="font-display font-black">{amount}</span>
    </div>
  );
}

/* ── Compact grid card ──────────────────────────────────────── */
function CompCard({ comp, index, isSelected, onClick }: {
  comp: typeof COMPETITIONS[0];
  index: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="group relative w-full text-left overflow-hidden transition-all duration-300 focus:outline-none"
      style={{
        background: isSelected ? "rgba(14,9,2,0.98)" : "rgba(10,7,2,0.92)",
        border: `1px solid ${isSelected ? "rgba(255,154,0,0.45)" : "rgba(255,107,0,0.12)"}`,
      }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Left selection bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] transition-opacity duration-300"
        style={{
          background: "linear-gradient(to bottom, #FFB800, #FF6B00)",
          opacity: isSelected ? 1 : 0,
        }} />

      <div className="p-5">
        {/* Domain + number row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] tracking-[0.22em] uppercase font-bold px-2 py-0.5"
            style={{ background: "rgba(255,107,0,0.08)", border: "1px solid rgba(255,107,0,0.18)", color: "rgba(255,154,0,0.65)" }}>
            {comp.domain}
          </span>
          <span className="font-display font-black text-[11px] select-none"
            style={{ color: "rgba(255,107,0,0.18)" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-black text-[15px] text-white leading-snug mb-4 group-hover:text-[rgba(255,230,180,0.95)] transition-colors duration-200">
          {comp.title}
        </h3>

        {/* Prize — prominent */}
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-4 h-4 text-[#FF9A00] shrink-0" />
          <span className="font-display font-black text-xl text-[#FF9A00]">{comp.prize}</span>
        </div>

        {/* Meta: team + deadline */}
        <div className="flex flex-col gap-1.5 mb-4">
          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "rgba(178,148,98,0.6)" }}>
            <Users className="w-3 h-3 shrink-0" />
            <span>{comp.teamSize}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "rgba(178,148,98,0.6)" }}>
            <Calendar className="w-3 h-3 shrink-0" />
            <span>Due {comp.registrationDeadline}</span>
          </div>
        </div>

        {/* Expand hint */}
        <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 ${
          isSelected ? "text-[#FFB800]" : "text-[rgba(255,154,0,0.4)] group-hover:text-[rgba(255,154,0,0.65)]"
        }`}>
          {isSelected
            ? <><ChevronUp className="w-3.5 h-3.5" /> Hide Details</>
            : <><ChevronDown className="w-3.5 h-3.5" /> View Details</>}
        </div>
      </div>

      {/* Bottom arrow pointer when selected */}
      {isSelected && (
        <div className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-0 h-0 pointer-events-none z-10"
          style={{
            borderLeft:  "9px solid transparent",
            borderRight: "9px solid transparent",
            borderTop:   "9px solid rgba(255,154,0,0.45)",
          }} />
      )}

      {/* Hover sheen */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{ background: "linear-gradient(135deg, rgba(255,154,0,0.03) 0%, transparent 60%)" }} />
    </motion.button>
  );
}

/* ── Full-width detail panel ──────────────────────────────── */
function DetailPanel({ comp, onClose }: {
  comp: typeof COMPETITIONS[0];
  onClose: () => void;
}) {
  return (
    <div className="relative overflow-hidden"
      style={{
        background: "rgba(10,6,1,0.99)",
        border: "1px solid rgba(255,107,0,0.22)",
        marginTop: 2,
      }}>
      {/* Top gradient rule */}
      <div className="h-[2px]" style={{
        background: "linear-gradient(90deg, transparent 5%, rgba(255,107,0,0.5) 25%, rgba(255,184,0,0.75) 50%, rgba(255,107,0,0.5) 75%, transparent 95%)"
      }} />

      <div className="p-6 md:p-8">
        {/* Panel header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="text-[9px] tracking-[0.28em] uppercase font-bold mb-1.5"
              style={{ color: "rgba(255,107,0,0.5)" }}>{comp.domain}</div>
            <h2 className="font-display font-black text-2xl md:text-3xl text-white leading-tight">{comp.title}</h2>
          </div>
          <button onClick={onClose}
            className="shrink-0 p-2 transition-colors duration-200 hover:bg-[rgba(255,107,0,0.1)]"
            style={{ border: "1px solid rgba(255,107,0,0.2)" }}>
            <X className="w-4 h-4" style={{ color: "rgba(255,154,0,0.55)" }} />
          </button>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left — description + eligibility + rounds */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <p className="text-sm leading-relaxed" style={{ color: "rgba(188,162,118,0.72)" }}>{comp.description}</p>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-3.5 h-3.5 text-[#FF9A00]" />
                <h4 className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "rgba(198,162,98,0.65)" }}>
                  Eligibility
                </h4>
              </div>
              <p className="text-sm pl-5" style={{ color: "rgba(175,148,108,0.62)" }}>{comp.eligibility}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-3.5 h-3.5 text-[#FF6B00]" />
                <h4 className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "rgba(198,162,98,0.65)" }}>
                  Competition Rounds
                </h4>
              </div>
              <ol className="flex flex-col gap-2 pl-2">
                {comp.rounds.map((round, ri) => (
                  <li key={ri} className="flex items-start gap-3 text-sm" style={{ color: "rgba(175,148,108,0.62)" }}>
                    <span className="font-display font-black text-[#FFB800] shrink-0 w-5 text-xs mt-0.5">
                      {String(ri + 1).padStart(2, "0")}.
                    </span>
                    {round}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right — meta + prizes + register */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Team + deadline */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Users,    label: "Team Size", value: comp.teamSize,             color: "#FFB800" },
                { icon: Calendar, label: "Deadline",  value: comp.registrationDeadline, color: "#FF6B00" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="px-3 py-2.5"
                  style={{ background: "rgba(255,184,0,0.04)", border: "1px solid rgba(255,184,0,0.1)" }}>
                  <p className="text-[9px] uppercase tracking-wider mb-1 font-bold"
                    style={{ color: "rgba(138,110,72,0.5)" }}>{label}</p>
                  <p className="text-sm font-semibold flex items-center gap-1.5" style={{ color }}>
                    <Icon className="w-3 h-3 opacity-70 shrink-0" />{value}
                  </p>
                </div>
              ))}
            </div>

            {/* Prize breakdown */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-3.5 h-3.5 text-[#FFB800]" />
                <h4 className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "rgba(198,162,98,0.65)" }}>
                  Prize Breakdown
                </h4>
              </div>
              <div className="flex flex-col gap-2">
                <PrizeRow rank="1st" amount={comp.firstPrize} />
                <PrizeRow rank="2nd" amount={comp.secondPrize} />
                <PrizeRow rank="3rd" amount={comp.thirdPrize} />
              </div>
            </div>

            {/* Register CTA */}
            <Link href="/register"
              className="btn-glow btn-electric flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider mt-auto"
              style={{ clipPath: "polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)" }}>
              <Zap className="w-4 h-4" /> Enter Competition <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CompetitionsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const bgRef = useParallax(0.45);

  const rows: (typeof COMPETITIONS)[] = [];
  for (let i = 0; i < COMPETITIONS.length; i += 3) rows.push(COMPETITIONS.slice(i, i + 3));

  return (
    <div className="min-h-screen" style={{ background: "#020100" }}>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden min-h-[500px] flex items-center">
        <div ref={bgRef} className="absolute inset-0 will-change-transform" style={{ top: "-30%", height: "160%" }}>
          <ForgeBackground intensity={0.85} showAnvil />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to top, #020100, transparent)" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="text-[#FF6B00] tracking-[0.55em] text-[11px] uppercase block mb-5 font-bold">
              Competitions
            </span>
            <h1 className="font-display font-black text-[clamp(2.4rem,7vw,5.5rem)] text-white leading-[0.9] tracking-tight mb-4">
              COMPETITIONS
            </h1>
            <p className="text-sm max-w-lg leading-relaxed" style={{ color: "rgba(185,158,110,0.65)" }}>
              Five high-stakes competitions with a combined prize pool of over ₹1,08,000.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-8"
          >
            {[
              { v: "₹1,08,000+", l: "Total Prize Pool", c: "#FF9A00" },
              { v: "5",          l: "Competitions",      c: "#FFB800" },
              { v: "3",          l: "Days",              c: "#FF6B00" },
            ].map(({ v, l, c }) => (
              <div key={l} className="flex flex-col gap-0.5">
                <span className="font-display font-black text-2xl" style={{ color: c }}>{v}</span>
                <span className="text-[10px] tracking-[0.18em] uppercase" style={{ color: "rgba(145,118,75,0.5)" }}>{l}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="divider-electric" />

      {/* ── 3-COLUMN GRID ────────────────────────────────────── */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="absolute inset-0 hex-grid opacity-25 pointer-events-none" />

        <div className="relative flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-[rgba(255,107,0,0.12)]" />
          <span className="font-display text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(255,107,0,0.4)" }}>
            Active Arenas
          </span>
          <div className="h-px flex-1 bg-[rgba(255,107,0,0.12)]" />
        </div>

        <div className="relative flex flex-col gap-2">
          {rows.map((rowComps, rowIdx) => {
            const rowStart  = rowIdx * 3;
            const selected  = rowComps.find(c => c.id === expandedId) ?? null;
            return (
              <Fragment key={rowIdx}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-1">
                  {rowComps.map((comp, colIdx) => (
                    <CompCard
                      key={comp.id}
                      comp={comp}
                      index={rowStart + colIdx}
                      isSelected={expandedId === comp.id}
                      onClick={() => setExpandedId(expandedId === comp.id ? null : comp.id)}
                    />
                  ))}
                </div>

                <AnimatePresence>
                  {selected && (
                    <motion.div
                      key={selected.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                      className="overflow-hidden mb-3"
                    >
                      <DetailPanel
                        comp={selected}
                        onClose={() => setExpandedId(null)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Fragment>
            );
          })}
        </div>
      </section>

      <div className="h-1 w-full" style={{
        background: "linear-gradient(90deg, transparent, rgba(255,107,0,0.5), rgba(255,184,0,0.7), rgba(255,107,0,0.5), transparent)"
      }} />
    </div>
  );
}
