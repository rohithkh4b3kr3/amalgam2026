"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight, Calendar, Mic, Wrench, Trophy,
  ChevronDown, Zap, Flame, Orbit,
} from "lucide-react";
import CountdownTimer    from "@/components/CountdownTimer";
import CrystalLattice    from "@/components/CrystalLattice";
import HeroMetalBg       from "@/components/HeroMetalBg";
import LavaFlow          from "@/components/LavaFlow";
import HorizontalMarquee from "@/components/HorizontalMarquee";
import ScrollAtmosphere  from "@/components/ScrollAtmosphere";
import SectionForgeBg    from "@/components/SectionForgeBg";
import FormulaGridBg     from "@/components/FormulaGridBg";
import { FEST_SUBTITLE } from "@/lib/data";

/* ─── Data ────────────────────────────────────────────────────── */
const QUICK_LINKS = [
  { href: "/schedule",     label: "Schedule",     icon: Calendar, desc: "Full 3-day event timeline",             color: "text-[#D42000]" },
  { href: "/speakers",     label: "Speakers",     icon: Mic,      desc: "Keynotes from IIT, ISRO & industry",    color: "text-[#FF3D00]" },
  { href: "/workshops",    label: "Workshops",    icon: Wrench,   desc: "Hands-on SEM, DFT, 3D printing & more", color: "text-[#CC2200]" },
  { href: "/competitions", label: "Competitions", icon: Trophy,   desc: "₹1,08,000+ across 5 competitions",       color: "text-[#FF6B00]" },
];

const STATS = [
  { label: "Prize Pool", value: "₹1.08L", numeric: 108, sub: "across 5 arenas",   color: "text-[#FF9A00]" },
  { label: "Workshops",  value: "5",       numeric: 5,   sub: "hands-on sessions", color: "text-[#FFB800]" },
  { label: "Keynotes",   value: "5",       numeric: 5,   sub: "industry leaders",  color: "text-[#FF6B00]" },
  { label: "Days",       value: "3",       numeric: 3,   sub: "Aug 14–16, 2026",   color: "text-[#D42000]" },
];

const TELEM_STATIC = [
  { id: "alloy",   label: "Alloy Grade", value: "Fe-0.8C-Mn" },
  { id: "phase",   label: "Phase",       value: "Austenite"  },
  { id: "density", label: "Density",     value: "7.83 g/cc"  },
];

const TITLE_LETTERS = "AMALGAM".split("");

/* ─── Letter animation variants ───────────────────────────────── */
const titleContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
};
const titleLetter = {
  hidden:  { y: 90, opacity: 0, rotateX: -75 },
  visible: { y: 0,  opacity: 1, rotateX: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};

/* ─── Animated count-up stat ───────────────────────────────────── */
function CountUpStat({
  numeric, color, label, sub
}: { numeric: number; color: string; label: string; sub: string }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1, margin: "0px 0px -60px 0px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start    = performance.now();
    const tick = (now: number) => {
      const t    = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(numeric * ease));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, numeric]);

  const formatted = label === "Prize Pool" ? `₹${count}K` : String(count);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center py-9 px-4 gap-1.5 relative"
    >
      <span className={`font-display font-black text-4xl md:text-5xl tabular-nums ${color}`}>
        {formatted}
      </span>
      <span className="text-xs text-[#5a2200] tracking-wide text-center">{sub}</span>
      <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#7a3a0a] mt-0.5">{label}</span>
    </motion.div>
  );
}

/* ─── Tilt Card wrapper ────────────────────────────────────────── */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let vt: any = null;
    import("vanilla-tilt").then(({ default: VanillaTilt }) => {
      if (el) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (VanillaTilt as any).init(el, {
          max: 11, speed: 400, glare: true,
          "max-glare": 0.06, scale: 1.04, perspective: 900,
        });
        vt = el;
      }
    });
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (vt && (vt as any).vanillaTilt) (vt as any).vanillaTilt.destroy();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ─── Ambient floating orb ─────────────────────────────────────── */
function AmbientOrb({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none animate-orb-drift"
      style={{ filter: "blur(80px)", ...style }}
    />
  );
}

/* ─── Corner bracket frame decoration ──────────────────────────── */
function CornerBrackets({ size = 28, gap = 14, color = "rgba(255,107,0,0.28)" }: {
  size?: number; gap?: number; color?: string;
}) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* top-left */}
      <svg className="absolute" style={{ top: gap, left: gap }} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <path d={`M ${size} 0 L 0 0 L 0 ${size}`} fill="none" stroke={color} strokeWidth="1.5" />
      </svg>
      {/* top-right */}
      <svg className="absolute" style={{ top: gap, right: gap }} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <path d={`M 0 0 L ${size} 0 L ${size} ${size}`} fill="none" stroke={color} strokeWidth="1.5" />
      </svg>
      {/* bottom-left */}
      <svg className="absolute" style={{ bottom: gap, left: gap }} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <path d={`M 0 0 L 0 ${size} L ${size} ${size}`} fill="none" stroke={color} strokeWidth="1.5" />
      </svg>
      {/* bottom-right */}
      <svg className="absolute" style={{ bottom: gap, right: gap }} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <path d={`M ${size} 0 L ${size} ${size} L 0 ${size}`} fill="none" stroke={color} strokeWidth="1.5" />
      </svg>
    </div>
  );
}

/* ─── Rising ember particles ────────────────────────────────────── */
const EMBER_CONFIG = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${((i * 4.13 + i * i * 0.17) % 90) + 5}%`,
  size: 1.5 + (i % 3) * 0.8,
  delay: (i * 0.41) % 4.2,
  duration: 2.6 + (i % 5) * 0.65,
  color: i % 3 === 0 ? "#FF6B00" : i % 3 === 1 ? "#FF9A00" : "#FFB800",
  xDrift: (i % 2 === 0 ? 1 : -1) * (8 + (i % 16)),
}));

function EmberParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
      {EMBER_CONFIG.map(({ id, left, size, delay, duration, color, xDrift }) => (
        <motion.div
          key={id}
          className="absolute rounded-full"
          style={{
            left, bottom: "-2%",
            width: size, height: size,
            background: color,
            boxShadow: `0 0 ${size * 4}px ${color}80`,
          }}
          animate={{
            y: [0, -(280 + (id % 4) * 70)],
            opacity: [0, 0.7, 0.45, 0],
            x: [0, xDrift],
          }}
          transition={{ duration, delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/* ─── Sweep heading reveal ─────────────────────────────────────── */
function SweepHeading({ children, className, delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const inView  = useInView(ref, { once: true, amount: 0.4 });
  const animated = useRef(false);

  const runSweep = useCallback(async () => {
    if (animated.current || !barRef.current || !textRef.current) return;
    animated.current = true;
    const { gsap } = await import("gsap");
    const tl = gsap.timeline({ delay });
    tl.set(textRef.current, { opacity: 0 })
      .fromTo(barRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 0.38, ease: "power2.inOut" }
      )
      .set(barRef.current, { transformOrigin: "right center" })
      .to(barRef.current, { scaleX: 0, duration: 0.35, ease: "power2.inOut" })
      .to(textRef.current, { opacity: 1, duration: 0.25 }, "-=0.15");
  }, [delay]);

  useEffect(() => { if (inView) runSweep(); }, [inView, runSweep]);

  return (
    <div ref={ref} className={`relative overflow-hidden inline-block ${className ?? ""}`}>
      <div
        ref={barRef}
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: "linear-gradient(90deg, #CC4400, #FF9A00, #FFB800)",
          transform: "scaleX(0)",
        }}
      />
      <div ref={textRef} style={{ opacity: 0 }}>{children}</div>
    </div>
  );
}

/* ─── Vertical spec-annotation rail ───────────────────────────── */
const RAIL_NODES = [
  { label: "§ HEAD", pct: 0  },
  { label: "§ 01",   pct: 33 },
  { label: "§ 02",   pct: 66 },
  { label: "§ CTA",  pct: 92 },
] as const;

function SpecRail() {
  const ref    = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!inView || !lineRef.current) return;
    lineRef.current.style.transition = "transform 0.75s cubic-bezier(0.22,1,0.36,1)";
    lineRef.current.style.transform  = "scaleY(1)";
  }, [inView]);

  return (
    <div ref={ref} className="hidden sm:flex flex-col items-center relative shrink-0 w-8 select-none">
      {/* Vertical backbone */}
      <div
        ref={lineRef}
        className="absolute top-2 bottom-2 w-px"
        style={{
          left: "50%",
          transform: "scaleY(0)",
          transformOrigin: "top center",
          background: "linear-gradient(to bottom, transparent, rgba(255,107,0,0.5) 12%, rgba(255,107,0,0.5) 88%, transparent)",
        }}
      />

      {/* Top bracket cap */}
      <motion.div
        className="w-3 h-px mb-0 shrink-0"
        style={{ background: "rgba(255,107,0,0.55)" }}
        initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.15 }}
      />

      {/* Spacer to fill height */}
      <div className="flex-1 relative w-full">
        {RAIL_NODES.map(({ label, pct }, i) => (
          <motion.div
            key={label}
            className="absolute flex items-center gap-1.5"
            style={{ top: `${pct}%`, left: 0, right: 0, transform: "translateY(-50%)" }}
            initial={{ opacity: 0, x: -6 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5 + i * 0.13, duration: 0.45 }}
          >
            {/* Node circle */}
            <div
              className="w-full flex justify-center relative"
            >
              <div
                className="w-[7px] h-[7px] rounded-full shrink-0"
                style={{
                  background: "rgba(255,107,0,0.9)",
                  boxShadow: "0 0 8px rgba(255,107,0,0.55)",
                }}
              />
              {/* Tick line extending right */}
              <div
                className="absolute top-1/2 -translate-y-1/2 h-px"
                style={{
                  left: "calc(50% + 5px)",
                  right: -8,
                  background: "rgba(255,107,0,0.28)",
                }}
              />
            </div>
          </motion.div>
        ))}

        {/* Rotated labels */}
        {RAIL_NODES.map(({ label, pct }, i) => (
          <motion.div
            key={`lbl-${label}`}
            className="absolute font-display text-[7px] tracking-[0.18em] uppercase"
            style={{
              top: `${pct}%`,
              left: "50%",
              transform: "translateY(-50%) translateX(10px)",
              color: "rgba(255,107,0,0.32)",
              writingMode: "vertical-rl",
              letterSpacing: "0.14em",
            }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 + i * 0.12, duration: 0.4 }}
          >
            {label}
          </motion.div>
        ))}
      </div>

      {/* Bottom bracket cap */}
      <motion.div
        className="w-3 h-px mt-0 shrink-0"
        style={{ background: "rgba(255,107,0,0.35)" }}
        initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.75 }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const heroSectionRef = useRef<HTMLElement>(null);
  const contentRef     = useRef<HTMLDivElement>(null);
  const bgLayerRef     = useRef<HTMLDivElement>(null);
  const glowRef        = useRef<HTMLDivElement>(null);
  const crystalParallaxRef = useRef<HTMLDivElement>(null);

  const latestScroll   = useRef(0);
  const latestMouse    = useRef({ x: 0, y: 0 });
  const rafRunning     = useRef(false);
  const lastMouseTs    = useRef(0);
  const tempRef        = useRef<HTMLSpanElement>(null);
  const hardnessRef    = useRef<HTMLSpanElement>(null);

  /* ── RAF parallax + mouse glow ─────────────────────────────── */
  useEffect(() => {
    latestMouse.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const flush = () => {
      rafRunning.current = false;
      const y = latestScroll.current;
      const { x, y: my } = latestMouse.current;
      if (bgLayerRef.current)
        bgLayerRef.current.style.transform = `translate3d(0,${y * 0.70}px,0) rotate(${y * 0.005}deg)`;
      if (contentRef.current) {
        if (y <= 900) {
          contentRef.current.style.opacity   = String(Math.max(0, 1 - y / 700));
          contentRef.current.style.transform = `translate3d(0,${y * -0.30}px,0)`;
        } else if (contentRef.current.style.opacity !== "0") {
          contentRef.current.style.opacity = "0";
        }
      }
      if (glowRef.current)
        glowRef.current.style.transform = `translate3d(${x - 400}px,${my - 400}px,0)`;
    };

    const kick = () => {
      if (!rafRunning.current) { rafRunning.current = true; requestAnimationFrame(flush); }
    };
    const onScroll = () => { latestScroll.current = window.scrollY; kick(); };
    const onMouse  = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMouseTs.current < 16) return;
      lastMouseTs.current = now;
      latestMouse.current = { x: e.clientX, y: e.clientY };
      kick();
    };
    window.addEventListener("scroll",    onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse,  { passive: true });
    kick();
    return () => {
      window.removeEventListener("scroll",    onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  /* ── Telemetry live update ─────────────────────────────────── */
  useEffect(() => {
    const tick = () => {
      if (tempRef.current)     tempRef.current.textContent     = String(1450 + Math.round((Math.random() - 0.5) * 28));
      if (hardnessRef.current) hardnessRef.current.textContent = String(58   + Math.round((Math.random() - 0.5) * 8));
    };
    const id = setInterval(tick, 600);
    tick();
    return () => clearInterval(id);
  }, []);

  /* ── GSAP ScrollTrigger: maximum parallax + reveals ─────────── */
  useEffect(() => {
    let cleanup: (() => void) | null = null;
    (async () => {
      const { gsap }          = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // ── 1. Section reveals — dramatic entrance ──────────────────
      document.querySelectorAll<HTMLElement>(".gsap-reveal").forEach(el => {
        gsap.fromTo(el,
          { y: 90, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.1, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });

      // ── 2. CrystalLattice — very deep, glass-smooth parallax ───
      if (crystalParallaxRef.current) {
        gsap.fromTo(crystalParallaxRef.current,
          { y: 220 },
          {
            y: -380,
            ease: "none",
            scrollTrigger: {
              trigger: crystalParallaxRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 3,
            },
          }
        );
      }

      // ── 3. Background grids — diagonal multi-axis parallax ─────
      // data-parallax-y and data-parallax-x control per-element depth
      document.querySelectorAll<HTMLElement>(".parallax-bg").forEach(grid => {
        const y = parseInt(grid.dataset.parallaxY || "80", 10);
        const x = parseInt(grid.dataset.parallaxX || "0",  10);
        gsap.fromTo(grid,
          { y: -y, x: -x },
          {
            y, x,
            ease: "none",
            scrollTrigger: {
              trigger: grid.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: 3,
            }
          }
        );
      });

      // ── 4. Hero foreground orbs ────────────────────────────────
      document.querySelectorAll<HTMLElement>(".parallax-orb").forEach(orb => {
        const speed = parseFloat(orb.dataset.speed || "1.5");
        gsap.to(orb, {
          y: () => -window.innerHeight * speed,
          ease: "none",
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 2,
          }
        });
      });

      // ── 5. Decorative elements — multi-directional depth ───────
      // data-py / data-px control travel; negative = counter-direction
      document.querySelectorAll<HTMLElement>(".parallax-deco").forEach(el => {
        const y     = parseFloat(el.dataset.py    || "60");
        const x     = parseFloat(el.dataset.px    || "0");
        const scrub = parseFloat(el.dataset.scrub || "3");
        gsap.fromTo(el,
          { y: -y, x: -x },
          {
            y, x,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest("section") || el.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub,
            }
          }
        );
      });

      cleanup = () => ScrollTrigger.getAll().forEach(t => t.kill());
    })();
    return () => { cleanup?.(); };
  }, []);

  return (
    <>
      {/* Fixed multi-depth atmosphere — stays behind all scrolling content */}
      <ScrollAtmosphere />

      {/* Page content — sits above the fixed atmosphere */}
      <div style={{ position: "relative", zIndex: 1 }}>

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section
        ref={heroSectionRef}
        className="relative w-full min-h-screen overflow-hidden flex items-center"
      >
        {/* Noise texture overlay */}
        <div className="absolute inset-0 noise-overlay z-[1] pointer-events-none" />

        {/* Parallax bg */}
        <div
          ref={bgLayerRef}
          className="absolute inset-0 will-change-transform"
          style={{ top: "-20%", height: "140%" }}
        >
          <div className="absolute inset-0 hex-grid" />
          <div className="absolute inset-0 forge-hatch" />
          <HeroMetalBg />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-[700px] h-[600px] rounded-full"
              style={{ top: "-15%", left: "48%", background: "radial-gradient(circle, rgba(200,70,0,0.18) 0%, transparent 70%)", filter: "blur(80px)" }} />
            <div className="absolute w-[500px] h-[500px] rounded-full"
              style={{ bottom: "5%", left: "2%", background: "radial-gradient(circle, rgba(170,90,0,0.14) 0%, transparent 70%)", filter: "blur(70px)" }} />
          </div>
        </div>

        {/* Mouse glow */}
        <div
          ref={glowRef}
          className="absolute left-0 top-0 w-[800px] h-[800px] rounded-full pointer-events-none will-change-transform z-[2]"
          style={{
            transform: "translate3d(calc(50vw - 400px),calc(50vh - 400px),0)",
            background: "radial-gradient(circle, rgba(255,107,0,0.09) 0%, rgba(255,107,0,0.02) 40%, transparent 70%)",
          }}
        />

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none z-10"
          style={{ background: "linear-gradient(to top, rgba(255,255,255,0.95), rgba(255,255,255,0.5) 40%, transparent)" }} />

        {/* Foreground Parallax Orbs */}
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          <div className="parallax-orb absolute rounded-full bg-[#FF6B00] blur-[40px] opacity-30 w-32 h-32" style={{ top: "40%", left: "10%" }} data-speed="1.2" />
          <div className="parallax-orb absolute rounded-full bg-[#FFB800] blur-[60px] opacity-20 w-48 h-48" style={{ top: "60%", right: "15%" }} data-speed="2.0" />
          <div className="parallax-orb absolute rounded-full bg-[#FF9A00] blur-[30px] opacity-25 w-24 h-24" style={{ top: "80%", left: "30%" }} data-speed="1.6" />
        </div>

        {/* Left rule */}
        <div className="absolute left-8 md:left-14 top-28 bottom-20 w-px pointer-events-none hidden lg:block z-10"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(255,107,0,0.3) 30%, rgba(255,107,0,0.3) 70%, transparent)" }} />

        {/* Hero content */}
        <div
          ref={contentRef}
          className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-32 pb-40"
          style={{ opacity: 1, transform: "translate3d(0,0,0)", willChange: "transform,opacity" }}
        >
          <div className="flex items-start gap-8 lg:gap-16">
            {/* Left: copy */}
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-3 border border-[rgba(255,107,0,0.2)] bg-[rgba(255,107,0,0.04)] px-4 py-1.5 mb-8"
              >
                <Flame className="w-3 h-3 text-[#E85800] animate-pulse" />
                <span className="text-[#D47800] uppercase tracking-[0.45em] text-[10px] font-bold font-display">
                  IIT Madras · MME · Aug 14–16, 2026
                </span>
              </motion.div>

              {/* ── Letter-by-letter AMALGAM title ─── */}
              <div className="mb-2" style={{ perspective: "600px" }}>
                <motion.div
                  className="flex items-end leading-none tracking-tight"
                  variants={titleContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {TITLE_LETTERS.map((letter, i) => (
                    <motion.span
                      key={i}
                      variants={titleLetter}
                      className="font-display font-extrabold text-[#1A0A00] inline-block"
                      style={{
                        fontSize: "clamp(3rem,10vw,7.5rem)",
                        transformOrigin: "bottom center",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.85 }}
                  className="font-light text-[#5a2200] mt-2"
                  style={{ fontSize: "clamp(1rem,3.5vw,2.6rem)", letterSpacing: "0.14em" }}
                >
                  WHERE{" "}
                  <span
                    className="font-bold text-transparent bg-clip-text"
                    style={{ backgroundImage: "linear-gradient(135deg,#D42000 0%,#FF3D00 45%,#CC2200 100%)" }}
                  >
                    ELEMENTS
                  </span>
                  {" "}UNITE
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="text-[#5a2200] text-sm md:text-[0.95rem] max-w-md leading-relaxed border-l-2 border-[rgba(200,100,0,0.35)] pl-5 mb-8 mt-5"
              >
                {FEST_SUBTITLE}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.3 }}
                className="flex flex-wrap gap-4 mb-10"
              >
                <Link href="/register"
                  className="btn-glow btn-electric inline-flex items-center gap-2.5 px-8 py-3.5 font-bold text-xs uppercase tracking-[0.22em]">
                  <Zap className="w-3.5 h-3.5" />
                  Register Now
                </Link>
                <Link href="/competitions"
                  className="btn-glow btn-outline-steel inline-flex items-center gap-2.5 px-8 py-3.5 font-bold text-xs uppercase tracking-[0.22em]">
                  Explore Events
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                <p className="text-[10px] tracking-[0.38em] uppercase text-[rgba(200,100,0,0.8)] mb-3 font-bold font-display">
                  Event Countdown
                </p>
                <CountdownTimer />
              </motion.div>
            </div>

            {/* Right: Forge Telemetry Panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="hidden lg:flex flex-col gap-2 shrink-0 w-[176px] mt-16"
              style={{
                border: "1px solid rgba(200,100,0,0.18)",
                background: "rgba(255,248,240,0.95)",
                backdropFilter: "blur(16px)",
                padding: "18px 16px",
              }}
            >
              <div className="flex items-center gap-2 pb-3 mb-1 border-b border-[rgba(200,100,0,0.12)]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D47800] animate-pulse" />
                <span className="font-display text-[9px] tracking-[0.25em] text-[rgba(140,70,10,0.85)] uppercase">Forge Monitor</span>
              </div>

              <div className="flex flex-col gap-0.5 py-2 border-b border-[rgba(200,100,0,0.07)]">
                <span className="font-display text-[8px] tracking-[0.18em] uppercase text-[#7a3a0a]">Forge Temp</span>
                <div className="flex items-baseline gap-1">
                  <span ref={tempRef} className="font-display font-black text-[1.4rem] text-[#D47800] leading-none tabular-nums">1450</span>
                  <span className="text-[9px] text-[rgba(180,100,0,0.75)]">°C</span>
                </div>
              </div>

              <div className="flex flex-col gap-0.5 py-2 border-b border-[rgba(200,100,0,0.07)]">
                <span className="font-display text-[8px] tracking-[0.18em] uppercase text-[#7a3a0a]">Hardness</span>
                <div className="flex items-baseline gap-1">
                  <span ref={hardnessRef} className="font-display font-black text-[1.4rem] text-[#B08000] leading-none tabular-nums">58</span>
                  <span className="text-[9px] text-[rgba(160,100,0,0.75)]">HRC</span>
                </div>
              </div>

              {TELEM_STATIC.map(({ id, label, value }) => (
                <div key={id} className="flex flex-col gap-0.5 py-1.5">
                  <span className="font-display text-[8px] tracking-[0.18em] uppercase text-[#7a3a0a]">{label}</span>
                  <span className="font-display text-[11px] font-bold text-[#CC4400] leading-none">{value}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-0 left-0 right-0 z-20 border-t border-[rgba(255,107,0,0.1)] bg-[rgba(255,255,255,0.9)] backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-4 flex items-center gap-6 md:gap-10 overflow-x-auto">
            {STATS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-4 shrink-0">
                {i > 0 && <div className="w-px h-7 bg-[rgba(255,107,0,0.2)]" />}
                <div className="flex items-center gap-3">
                  <span className={`font-display font-black text-xl md:text-2xl tabular-nums leading-none ${s.color}`}>{s.value}</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] uppercase tracking-[0.22em] text-[rgba(150,60,0,0.7)] font-display leading-none">{s.label}</span>
                    <span className="text-[10px] text-[rgba(120,55,10,0.7)] leading-none">{s.sub}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="absolute bottom-24 right-10 hidden lg:flex flex-col items-center gap-1.5 text-[rgba(180,60,0,0.4)] z-20"
        >
          <span className="text-[9px] tracking-[0.35em] uppercase font-display" style={{ writingMode: "vertical-rl" }}>Scroll Down</span>
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── MARQUEE ─────────────────────────────────────────── */}
      <HorizontalMarquee />

      {/* ══════════════════════════════════════════════════════════
          ABOUT  (pinned feel via sticky + ambient orbs)
      ══════════════════════════════════════════════════════════ */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-28 grid md:grid-cols-2 gap-16 items-center overflow-hidden">

        {/* ── Left column: annotation rail + text ─── */}
        <div className="gsap-reveal relative z-10 flex gap-5 sm:gap-7">

          {/* ── Spec annotation rail ── */}
          <SpecRail />

          {/* ── Text content ── */}
          <div className="flex-1 min-w-0">
            <span className="section-label mb-5 inline-flex">
              <Orbit className="w-3.5 h-3.5" /> Core Protocol
            </span>
            <div className="font-display font-black text-3xl md:text-4xl leading-tight mb-6">
              <SweepHeading><span className="text-metallic">Three Days of</span></SweepHeading>
              <SweepHeading delay={0.12}><span className="text-forge">Advanced Materials</span></SweepHeading>
              <SweepHeading delay={0.24}><span className="text-[#1A0A00]">&amp; Innovation</span></SweepHeading>
            </div>
            <p className="text-[#5a2200] leading-relaxed mb-4">
              AMALGAM is the flagship annual fest of the Metallurgical &amp; Materials Engineering
              Department at IIT Madras. Students, researchers, and industry professionals converge for
              workshops, competitions, and inspiring keynotes.
            </p>
            <p className="text-[#5a2200] leading-relaxed">
              From X-ray diffraction labs to computational materials simulations — AMALGAM offers an
              unparalleled platform to push the boundaries of materials science.
            </p>
            <div className="mt-8 flex gap-3">
              <Link href="/register" className="btn-glow btn-electric inline-flex items-center gap-2 px-6 py-3 font-bold text-sm">
                <Zap className="w-4 h-4" /> Register
              </Link>
              <Link href="/schedule" className="btn-glow btn-outline-steel inline-flex items-center gap-2 px-6 py-3 font-bold text-sm">
                Timeline <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Right column: floating crystal ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative flex items-center justify-center z-10"
        >
          {/* GSAP scrub parallax wrapper */}
          <div ref={crystalParallaxRef} style={{ willChange: "transform" }}>
            <CrystalLattice />
          </div>
        </motion.div>
      </section>

      {/* ── LAVA FLOW ─────────────────────────────────────────── */}
      {/* <LavaFlow height={80} /> */}

      {/* ══════════════════════════════════════════════════════════
          STATS BAR — animated count-up
      ══════════════════════════════════════════════════════════ */}
      <section className="relative border-y border-[rgba(180,100,0,0.1)] overflow-hidden" style={{ background: "rgba(255,248,242,0.97)" }}>
        <SectionForgeBg variant="stats" />
        <div className="absolute inset-[-20%] parallax-bg pointer-events-none" data-parallax-y="120" data-parallax-x="-30">
          <div className="absolute inset-0 hex-grid opacity-40" />
        </div>
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 relative z-10">
          {STATS.map((s, i) => (
            <div key={s.label} className="relative">
              {i > 0 && (
                <div className="absolute left-0 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-[rgba(180,100,0,0.18)] to-transparent" />
              )}
              <CountUpStat numeric={s.numeric} color={s.color} label={s.label} sub={s.sub} />
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          QUICK LINKS — 3D tilt cards
      ══════════════════════════════════════════════════════════ */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 py-28 overflow-hidden">
        <SectionForgeBg variant="links" />
        <div className="absolute inset-[-20%] pointer-events-none parallax-bg" data-parallax-y="150" data-parallax-x="35">
          <div className="absolute inset-0 hex-grid opacity-30" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 relative z-10"
        >
          <h2 className="font-display font-black text-2xl md:text-3xl text-[#1A0A00] mb-2">Forge Sectors</h2>
          <p className="text-[#7a4a1a] text-sm">Access the various sectors of the fest</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
          {QUICK_LINKS.map(({ href, label, icon: Icon, desc }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <Link href={href} className="block group h-full">
                <TiltCard className="relative flex flex-col gap-5 p-6 h-full transition-all duration-300 bg-[#D42000] border border-[rgba(255,255,255,0.18)] group-hover:bg-white group-hover:border-[#D42000]">
                  <motion.div
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300"
                    style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.35)" }}
                    whileHover={{ scale: 1.12, rotate: 4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <Icon className="w-5 h-5 text-white group-hover:text-[#D42000] transition-colors duration-300" />
                  </motion.div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-white group-hover:text-[#1A0A00] mb-1.5 tracking-wide transition-colors duration-300">{label}</h3>
                    <p className="text-[rgba(255,255,255,0.82)] text-sm leading-relaxed group-hover:text-[#5a2200] transition-colors duration-300">{desc}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold tracking-wide text-white group-hover:text-[#D42000] mt-auto transition-colors duration-300">
                    Enter Sector <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </TiltCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── LAVA FLOW ─────────────────────────────────────────── */}
      {/* <LavaFlow height={90} /> */}

      {/* ══════════════════════════════════════════════════════════
          FOOTER BANNER — "Ready to Forge?" CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-36 md:py-52" style={{ background: "#D42000" }}>

        {/* Parallax formula grid — z-[10] above content so every cell is hoverable */}
        <div className="absolute inset-[-30%] parallax-bg z-[10]" data-parallax-y="220">
          <FormulaGridBg />
        </div>

        {/* Subtle dark vignette at edges */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.25) 100%)" }} />

        {/* Top/bottom edge fades into red */}
        <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(180,0,0,0.5), transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(180,0,0,0.5), transparent)" }} />

        {/* Ascending embers */}
        <EmberParticles />

        {/* Content — behind grid; pointer-events-none so grid receives all hover */}
        <div className="relative flex justify-center px-4 pointer-events-none">
          <div className="relative max-w-3xl w-full">

            {/* Corner bracket decoration */}
            <CornerBrackets color="rgba(255,255,255,0.35)" />

            <div className="text-center py-12 px-6">

              {/* Section label + heading — z-[15] so they sit above the grid */}
              <div className="relative z-[15] pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="flex justify-center mb-10"
                >
                  <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-bold px-4 py-1.5"
                    style={{ border: "1px solid rgba(255,255,255,0.4)", color: "rgba(255,255,255,0.9)", background: "rgba(255,255,255,0.12)" }}>
                    <Flame className="w-3.5 h-3.5" /> Final Protocol
                  </span>
                </motion.div>

                {/* Split heading — huge */}
                <div className="mb-5">
                  <div className="overflow-hidden">
                    <motion.div
                      initial={{ y: 110, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.88, ease: [0.22, 1, 0.36, 1] }}
                      className="font-display font-black leading-none text-white"
                      style={{ fontSize: "clamp(2.8rem, 9vw, 6.5rem)" }}
                    >
                      READY TO
                    </motion.div>
                  </div>
                  <div className="overflow-hidden">
                    <motion.div
                      initial={{ y: 110, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.88, delay: 0.09, ease: [0.22, 1, 0.36, 1] }}
                      className="font-display font-black leading-none text-white"
                      style={{ fontSize: "clamp(3.6rem, 12vw, 9rem)" }}
                    >
                      FORGE?
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* All remaining content — z-[15] above grid, pointer-events-none */}
              <div className="relative z-[15] pointer-events-none">

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.32, duration: 0.7 }}
                  className="text-[rgba(255,255,255,0.88)] text-base md:text-lg mb-7 max-w-md mx-auto leading-relaxed"
                >
                  Secure your place at the most advanced materials science symposium at IIT Madras.
                </motion.p>

                {/* White divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.44, duration: 0.55 }}
                  className="w-40 mx-auto mb-9 h-[2px]"
                  style={{ background: "rgba(255,255,255,0.4)", transformOrigin: "left center" }}
                />

                {/* Mini stats row */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.54, duration: 0.6 }}
                  className="flex items-center justify-center gap-4 md:gap-7 mb-11 flex-wrap"
                >
                  {[
                    { value: "Aug 14–16", label: "2026"       },
                    { value: "₹1.08L",    label: "Prize Pool" },
                    { value: "5",         label: "Workshops"  },
                    { value: "IIT Madras",label: "MME Dept"   },
                  ].map(({ value, label }, i, arr) => (
                    <div key={label} className="flex items-center gap-4 md:gap-7">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="font-display font-black text-sm leading-none text-white">{value}</span>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-[rgba(255,255,255,0.6)] mt-0.5">{label}</span>
                      </div>
                      {i < arr.length - 1 && <div className="w-px h-6 bg-[rgba(255,255,255,0.25)]" />}
                    </div>
                  ))}
                </motion.div>

              </div>

              {/* CTA buttons — z-[20] above grid, pointer-events-auto so they're clickable */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.68, duration: 0.65 }}
                className="relative z-[20] pointer-events-auto flex gap-4 md:gap-5 flex-wrap justify-center"
              >
                <Link href="/register"
                  className="inline-flex items-center gap-2.5 px-10 md:px-14 py-4 font-black text-sm tracking-[0.2em] bg-white text-[#D42000] hover:bg-[#1A0A00] hover:text-white transition-colors duration-300">
                  <Zap className="w-4 h-4" /> REGISTER NOW
                </Link>
                <Link href="/competitions"
                  className="inline-flex items-center gap-2.5 px-8 md:px-11 py-4 font-bold text-sm tracking-[0.15em] text-white hover:bg-white hover:text-[#D42000] transition-colors duration-300"
                  style={{ border: "2px solid rgba(255,255,255,0.7)" }}>
                  <Trophy className="w-4 h-4" /> VIEW COMPETITIONS
                </Link>
              </motion.div>

              {/* Footer annotation */}
              <div className="relative z-[15] pointer-events-none">
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.92 }}
                  className="mt-10 text-[rgba(255,255,255,0.45)] text-[9px] tracking-[0.32em] uppercase font-display"
                >
                  IIT Madras &middot; Dept. of MME &middot; Aug 14&ndash;16, 2026
                </motion.p>
              </div>

            </div>
          </div>
        </div>
      </section>

      </div>{/* end z-index:1 content wrapper */}
    </>
  );
}
