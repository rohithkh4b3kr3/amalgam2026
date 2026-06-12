"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Wrench, Clock, MapPin, CheckCircle, XCircle, ArrowRight, Calendar } from "lucide-react";
import { WORKSHOPS } from "@/lib/data";
import ForgeBackground from "@/components/ForgeBackground";
import Link from "next/link";

const DAY_LABELS = { 1: "Aug 14", 2: "Aug 15", 3: "Aug 16" } as const;

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

function CapacityBar({ capacity, registered }: { capacity: number; registered: number }) {
  const pct = Math.min((registered / capacity) * 100, 100);
  const color = pct >= 100 ? "#FF5500" : pct >= 75 ? "#FFB800" : "#FF9A00";
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] tracking-[0.18em] uppercase font-bold" style={{ color: "#7a3a0a" }}>Capacity</span>
        <span className="text-xs font-display" style={{ color: "#7a3a0a" }}>{registered}/{capacity}</span>
      </div>
      <div className="h-1.5 rounded-none overflow-hidden" style={{ background: "rgba(255,107,0,0.08)", border: "1px solid rgba(255,107,0,0.12)" }}>
        <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
          style={{ height: "100%", background: color }} />
      </div>
    </div>
  );
}

function WorkshopCard({ ws, index }: { ws: typeof WORKSHOPS[0]; index: number }) {
  const isFull = ws.registered >= ws.capacity;
  const remaining = ws.capacity - ws.registered;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
      className="group relative"
    >
      {/* Shadow plate */}
      <div className="absolute inset-0 translate-y-1.5 translate-x-1.5"
        style={{ background: "rgba(200,120,60,0.12)", filter: "blur(6px)" }} />

      <div className="relative forge-plate angled-card overflow-hidden">

        {/* Top accent */}
        <div className="h-[3px]" style={{
          background: isFull
            ? "linear-gradient(90deg, rgba(200,60,0,0.7), rgba(255,107,0,0.5), transparent)"
            : "linear-gradient(90deg, rgba(255,107,0,0.8), rgba(255,184,0,0.9), rgba(255,107,0,0.4), transparent)"
        }} />

        <div className="p-5 md:p-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {/* Workshop number */}
                <div className="w-8 h-8 rounded flex items-center justify-center font-display font-black text-xs"
                  style={{ background: "linear-gradient(135deg,#fff5ee,#ffece0)", border: "1px solid rgba(255,154,0,0.35)", color: "#CC4400" }}>
                  W{String(index + 1).padStart(2, "0")}
                </div>

                <span className="tag-pill" style={{
                  background: "rgba(255,184,0,0.08)",
                  border: "1px solid rgba(255,184,0,0.2)",
                  color: "#FFB800",
                }}>
                  <Calendar className="w-2.5 h-2.5" />
                  Day {ws.day} — {DAY_LABELS[ws.day as 1|2|3]}
                </span>

                {isFull
                  ? <span className="tag-pill badge-molten flex items-center gap-1"><XCircle className="w-2.5 h-2.5" /> Full</span>
                  : <span className="tag-pill badge-gold flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5" /> {remaining} Spots</span>
                }
              </div>

              <h3 className="font-display font-black text-lg md:text-xl text-[#1A0A00] leading-tight">{ws.title}</h3>
            </div>

            <Link href={isFull ? "#" : "/register"}
              className={`shrink-0 btn-glow flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider ${
                isFull
                  ? "text-[#4a3018] cursor-not-allowed"
                  : "btn-electric"
              }`}
              style={{ clipPath: "polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)" }}>
              {isFull ? "Full" : <><ArrowRight className="w-3.5 h-3.5" /> Register</>}
            </Link>
          </div>

          {/* Divider */}
          <div className="h-px mb-4" style={{ background: "linear-gradient(90deg, rgba(255,107,0,0.25), transparent)" }} />

          <p className="text-sm leading-relaxed mb-5" style={{ color: "#5a2200" }}>{ws.description}</p>

          <CapacityBar capacity={ws.capacity} registered={ws.registered} />

          {/* Meta grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 mb-4">
            {[
              { icon: Clock,  value: `${ws.time} – ${ws.endTime}`, color: "text-[#FFB800]" },
              { icon: MapPin, value: ws.venue,                      color: "text-[#FF9A00]" },
              { icon: Wrench, value: ws.instructors,                color: "text-[#FF6B00]" },
            ].map(({ icon: Icon, value, color }) => (
              <div key={value} className="flex items-start gap-2 text-xs" style={{ color: "#7a3a0a" }}>
                <Icon className={`w-3.5 h-3.5 ${color} shrink-0 mt-0.5`} />
                <span className="leading-tight">{value}</span>
              </div>
            ))}
          </div>

          {/* Prerequisites */}
          <div className="px-4 py-3 text-xs"
            style={{ background: "rgba(255,107,0,0.05)", border: "1px solid rgba(255,107,0,0.12)", color: "#7a3a0a" }}>
            <span className="font-bold uppercase tracking-wider text-[9px]" style={{ color: "rgba(140,70,10,0.75)" }}>Prerequisites: </span>
            {ws.prerequisites}
          </div>
        </div>

        {/* Hover sheen */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "linear-gradient(135deg, rgba(255,154,0,0.04) 0%, transparent 60%)" }} />
      </div>
    </motion.div>
  );
}

export default function WorkshopsPage() {
  const [dayFilter, setDayFilter] = useState<0 | 1 | 2 | 3>(0);
  const filtered = dayFilter === 0 ? WORKSHOPS : WORKSHOPS.filter((w) => w.day === dayFilter);
  const bgRef = useParallax(0.45);

  return (
    <div className="min-h-screen" style={{ background: "#FFFFFF" }}>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden min-h-[480px] flex items-center">
        <div ref={bgRef} className="absolute inset-0 will-change-transform" style={{ top: "-30%", height: "160%" }}>
          <ForgeBackground intensity={0.75} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to top, #FFFFFF, transparent)" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="text-[#FF6B00] tracking-[0.55em] text-[11px] uppercase block mb-5 font-bold">
              Workshops
            </span>
            <h1 className="font-display font-black text-[clamp(2.4rem,7vw,5.5rem)] text-[#1A0A00] leading-[0.9] tracking-tight mb-4">
              WORKSHOPS
            </h1>
            <p className="text-sm max-w-lg leading-relaxed" style={{ color: "#5a2200" }}>
              Five intensive hands-on workshops: XRD, SEM/TEM, DFT simulation, 3D metal printing, and electrochemical analysis.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-6">
            {[
              { v: "5",  l: "Workshops" },
              { v: "87", l: "Total Seats" },
              { v: "3",  l: "Days" },
            ].map(({ v, l }) => (
              <div key={l} className="flex flex-col gap-0.5">
                <span className="font-display font-black text-2xl text-[#FF9A00]">{v}</span>
                <span className="text-[10px] tracking-[0.18em] uppercase" style={{ color: "rgba(100,60,20,0.6)" }}>{l}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="divider-electric" />

      {/* ── Day filter — sticky ────────────────────────────── */}
      <div className="sticky top-16 z-30 backdrop-blur-xl border-b border-[rgba(255,184,0,0.1)] py-3"
        style={{ background: "rgba(255,255,255,0.97)" }}>
        <div className="max-w-4xl mx-auto px-4 flex gap-2 flex-wrap justify-center">
          {([0, 1, 2, 3] as const).map((d) => {
            const label = d === 0 ? "All Days" : `Day ${d} — ${DAY_LABELS[d as 1|2|3]}`;
            const active = dayFilter === d;
            return (
              <button key={d} onClick={() => setDayFilter(d)}
                className={`font-display text-xs font-bold tracking-wider px-5 py-2 border transition-all duration-300 ${
                  active
                    ? "text-black border-[#FFB800]"
                    : "border-[rgba(255,184,0,0.18)] hover:border-[rgba(255,184,0,0.4)] hover:text-[#FF9A00]"
                }`}
                style={{
                  background: active ? "linear-gradient(135deg,#CC8800,#FFB800)" : "transparent",
                  clipPath: "polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px)",
                  color: active ? undefined : "#7a3a0a",
                }}>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Workshop cards ─────────────────────────────────── */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="absolute inset-0 hex-grid opacity-30 pointer-events-none" />

        <div className="flex items-center gap-4 mb-2">
          <div className="h-px flex-1 bg-[rgba(255,107,0,0.15)]" />
          <span className="font-display text-[10px] tracking-[0.3em] uppercase text-[rgba(255,107,0,0.45)]">
            {filtered.length} Workshop{filtered.length !== 1 ? "s" : ""}
          </span>
          <div className="h-px flex-1 bg-[rgba(255,107,0,0.15)]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          {filtered.map((ws, i) => (
            <WorkshopCard key={ws.id} ws={ws} index={i} />
          ))}
        </div>
      </section>

      <div className="h-1 w-full" style={{
        background: "linear-gradient(90deg, transparent, rgba(255,107,0,0.5), rgba(255,184,0,0.7), rgba(255,107,0,0.5), transparent)"
      }} />
    </div>
  );
}
