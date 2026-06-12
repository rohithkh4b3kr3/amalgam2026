"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, Calendar } from "lucide-react";
import { EVENTS, CATEGORY_COLORS, type Category } from "@/lib/data";
import ForgeBackground from "@/components/ForgeBackground";

const DAY_LABELS = { 1: "Day I — Aug 14", 2: "Day II — Aug 15", 3: "Day III — Aug 16" } as const;

const CATEGORY_LABELS: Record<Category, string> = {
  competition: "Competition",
  workshop:    "Workshop",
  talk:        "Keynote",
  ceremony:    "Ceremony",
  cultural:    "Cultural",
};

const CATEGORY_ICON: Record<Category, string> = {
  competition: "⚔",
  workshop:    "⚙",
  talk:        "◆",
  ceremony:    "★",
  cultural:    "♪",
};

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

function EventRow({ event, index }: { event: typeof EVENTS[0]; index: number }) {
  const colors = CATEGORY_COLORS[event.category];
  const icon   = CATEGORY_ICON[event.category];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
      className="group relative flex gap-0"
    >
      {/* ── Forge rail connector ────────────────────────── */}
      <div className="relative flex flex-col items-center" style={{ width: 48, flexShrink: 0 }}>
        {/* Vertical rail */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px]"
          style={{ background: "linear-gradient(to bottom, rgba(255,107,0,0.4), rgba(255,107,0,0.15))" }} />
        {/* Node */}
        <div className="relative z-10 mt-5 w-5 h-5 rounded-full flex items-center justify-center text-[9px]"
          style={{
            background: "linear-gradient(135deg,#fff5ee,#ffece0)",
            border: "2px solid rgba(255,107,0,0.5)",
            color: "#FF9A00",
            boxShadow: "0 0 0 4px rgba(255,107,0,0.06)",
          }}>
          {icon}
        </div>
      </div>

      {/* ── Event card ────────────────────────────────── */}
      <div className="flex-1 mb-4 ml-2">
        <div className="forge-plate angled-card overflow-hidden group-hover:border-[rgba(255,154,0,0.35)] transition-colors duration-300">

          {/* Left accent */}
          <div className="absolute left-0 top-0 bottom-0 w-[2px]"
            style={{ background: "linear-gradient(to bottom, rgba(255,107,0,0.6), rgba(255,107,0,0.2))" }} />

          <div className="pl-5 pr-4 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">

              {/* Time column */}
              <div className="shrink-0 sm:w-20 sm:text-right">
                <div className="font-display text-sm font-black text-[#FFB800] leading-none">{event.time}</div>
                <div className="font-display text-xs mt-0.5" style={{ color: "rgba(100,60,20,0.5)" }}>{event.endTime}</div>
              </div>

              {/* Vertical rule */}
              <div className="hidden sm:block w-px self-stretch"
                style={{ background: "linear-gradient(to bottom, rgba(255,107,0,0.3), transparent)" }} />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h3 className="font-display font-bold text-sm text-[#1A0A00] leading-snug">{event.title}</h3>
                  <span className={`tag-pill ${colors.bg} ${colors.text} border ${colors.border}`}>
                    {CATEGORY_LABELS[event.category]}
                  </span>
                </div>
                <p className="text-xs leading-relaxed mb-2" style={{ color: "rgba(80,45,10,0.62)" }}>{event.description}</p>
                <div className="flex flex-wrap gap-3 text-[10px]" style={{ color: "rgba(100,60,20,0.55)" }}>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#FF9A00]" />{event.venue}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SchedulePage() {
  const [day, setDay] = useState<1 | 2 | 3>(1);
  const filtered = EVENTS.filter((e) => e.day === day).sort((a, b) => a.time.localeCompare(b.time));
  const bgRef = useParallax(0.45);

  return (
    <div className="min-h-screen" style={{ background: "#FFFFFF" }}>

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden min-h-[480px] flex items-center">
        <div ref={bgRef} className="absolute inset-0 will-change-transform" style={{ top: "-30%", height: "160%" }}>
          <ForgeBackground intensity={0.75} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to top, #FFFFFF, transparent)" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="text-[#FF6B00] tracking-[0.55em] text-[11px] uppercase block mb-5 font-bold">
              Event Schedule
            </span>
            <h1 className="font-display font-black text-[clamp(2.4rem,7vw,5.5rem)] text-[#1A0A00] leading-[0.9] tracking-tight mb-4">
              SCHEDULE
            </h1>
            <p className="text-sm max-w-lg leading-relaxed" style={{ color: "rgba(80,45,10,0.65)" }}>
              Three days of workshops, keynotes, competitions, and cultural events. All times in IST.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="divider-electric" />

      {/* ── Day tabs — sticky ──────────────────────────── */}
      <div className="sticky top-16 z-30 backdrop-blur-xl border-b border-[rgba(255,184,0,0.1)] py-3"
        style={{ background: "rgba(255,255,255,0.97)" }}>
        <div className="max-w-4xl mx-auto px-4 flex gap-2 justify-center flex-wrap">
          {([1, 2, 3] as const).map((d) => {
            const active = day === d;
            return (
              <button key={d} onClick={() => setDay(d)}
                className={`font-display text-xs font-bold tracking-wider px-6 py-2.5 border transition-all duration-300 ${
                  active
                    ? "text-black border-[#FFB800]"
                    : "border-[rgba(255,184,0,0.18)] hover:border-[rgba(255,184,0,0.38)] hover:text-[#FF9A00]"
                }`}
                style={{
                  background: active ? "linear-gradient(135deg,#CC8800,#FFB800)" : "transparent",
                  clipPath: "polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)",
                  color: active ? undefined : "rgba(120,60,10,0.65)",
                }}>
                {DAY_LABELS[d]}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Timeline ─────────────────────────────────── */}
      <section className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="absolute inset-0 hex-grid opacity-30 pointer-events-none" />

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-8">
          {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => {
            const c = CATEGORY_COLORS[cat];
            return (
              <span key={cat} className={`tag-pill ${c.bg} ${c.text} border ${c.border}`}>
                {CATEGORY_ICON[cat]} {CATEGORY_LABELS[cat]}
              </span>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={day}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative"
          >
            {filtered.map((event, i) => (
              <EventRow key={event.id} event={event} index={i} />
            ))}

            {/* Rail end cap */}
            <div className="flex gap-0">
              <div style={{ width: 48, flexShrink: 0 }} className="flex justify-center">
                <div className="w-3 h-3 rounded-full mt-1"
                  style={{ background: "rgba(255,107,0,0.3)", border: "1px solid rgba(255,107,0,0.5)" }} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      <div className="h-1 w-full" style={{
        background: "linear-gradient(90deg, transparent, rgba(255,107,0,0.5), rgba(255,184,0,0.7), rgba(255,107,0,0.5), transparent)"
      }} />
    </div>
  );
}
