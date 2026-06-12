"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ── shared helpers ──────────────────────────────────────────── */
function gearPts(cx: number, cy: number, R: number, r: number, n: number) {
  return Array.from({ length: n * 2 }, (_, i) => {
    const a   = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 === 0 ? R : r;
    return `${(cx + rad * Math.cos(a)).toFixed(4)},${(cy + rad * Math.sin(a)).toFixed(4)}`;
  }).join(" ");
}
function hexPts(cx: number, cy: number, r: number, rot = 0) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 + rot;
    return `${(cx + r * Math.cos(a)).toFixed(4)},${(cy + r * Math.sin(a)).toFixed(4)}`;
  }).join(" ");
}

/* ── SVG elements ─────────────────────────────────────────────── */
function SvgGear({ size = 200, uid = "sg0", teeth = 14, innerFrac = 0.82 }: {
  size?: number; uid?: string; teeth?: number; innerFrac?: number;
}) {
  const c = size / 2, R = c * 0.9, r = R * innerFrac, bore = c * 0.24;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      <defs>
        <radialGradient id={`${uid}-fill`} cx="32%" cy="28%" r="72%">
          <stop offset="0%"   stopColor="#60503a" />
          <stop offset="35%"  stopColor="#3a2818" />
          <stop offset="70%"  stopColor="#1e1208" />
          <stop offset="100%" stopColor="#0c0804" />
        </radialGradient>
        <linearGradient id={`${uid}-sheen`} x1="5%" y1="5%" x2="95%" y2="95%">
          <stop offset="0%"   stopColor="rgba(255,200,120,0.32)" />
          <stop offset="40%"  stopColor="rgba(200,140,60,0.12)"  />
          <stop offset="100%" stopColor="rgba(255,107,0,0.05)"   />
        </linearGradient>
        <radialGradient id={`${uid}-bore`} cx="40%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#181008" />
          <stop offset="100%" stopColor="#040200" />
        </radialGradient>
      </defs>
      <polygon points={gearPts(c, c, R, r, teeth)}
        fill={`url(#${uid}-fill)`} stroke="rgba(200,150,80,0.18)" strokeWidth="0.6" />
      <polygon points={gearPts(c, c, R, r, teeth)} fill={`url(#${uid}-sheen)`} />
      <circle cx={c} cy={c} r={c * 0.56} fill="none" stroke="rgba(200,140,60,0.1)" strokeWidth="1" />
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return <line key={i}
          x1={+(c + bore * 1.1 * Math.cos(a)).toFixed(4)} y1={+(c + bore * 1.1 * Math.sin(a)).toFixed(4)}
          x2={+(c + c * 0.5 * Math.cos(a)).toFixed(4)}    y2={+(c + c * 0.5 * Math.sin(a)).toFixed(4)}
          stroke="rgba(180,120,50,0.08)" strokeWidth="1.2" />;
      })}
      <circle cx={c} cy={c} r={bore} fill={`url(#${uid}-bore)`} />
      <circle cx={c} cy={c} r={bore} fill="none" stroke="rgba(255,107,0,0.18)" strokeWidth="0.7" />
    </svg>
  );
}

function SvgHexNut({ size = 80, uid = "hn0" }: { size?: number; uid?: string }) {
  const c = size / 2, hexR = c * 0.9, holeR = c * 0.41;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id={`${uid}-fill`} cx="30%" cy="25%" r="75%">
          <stop offset="0%"   stopColor="#645040" />
          <stop offset="50%"  stopColor="#281e10" />
          <stop offset="100%" stopColor="#0c0804" />
        </radialGradient>
        <linearGradient id={`${uid}-hl`} x1="10%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%"   stopColor="rgba(255,200,100,0.22)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)"          />
        </linearGradient>
      </defs>
      <polygon points={hexPts(c, c, hexR, 0)} fill={`url(#${uid}-fill)`} stroke="rgba(200,140,60,0.18)" strokeWidth="0.7" />
      <polygon points={hexPts(c, c, hexR, 0)} fill={`url(#${uid}-hl)`} />
      <circle cx={c} cy={c} r={holeR} fill="#050302" stroke="rgba(255,107,0,0.14)" strokeWidth="0.8" />
      {[0.72, 0.88].map((f, i) => (
        <circle key={i} cx={c} cy={c} r={holeR * f} fill="none" stroke="rgba(200,140,60,0.05)" strokeWidth="0.5" />
      ))}
    </svg>
  );
}

function SvgCrystal({ size = 90, uid = "sc0" }: { size?: number; uid?: string }) {
  const w = size, h = size * 1.28, cx = w / 2;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={`${uid}-a`} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%"   stopColor="rgba(255,154,0,0.5)"  />
          <stop offset="60%"  stopColor="rgba(200,80,0,0.3)"   />
          <stop offset="100%" stopColor="rgba(80,20,0,0.4)"    />
        </linearGradient>
      </defs>
      <polygon points={`${cx},0 0,${h*0.36} ${cx},${h*0.52}`}          fill={`url(#${uid}-a)`} stroke="rgba(255,154,0,0.18)" strokeWidth="0.7" />
      <polygon points={`${cx},0 ${w},${h*0.36} ${cx},${h*0.52}`}       fill="rgba(255,80,0,0.18)" stroke="rgba(255,107,0,0.12)" strokeWidth="0.7" />
      <polygon points={`0,${h*0.36} ${cx},${h*0.52} ${cx*0.28},${h}`}  fill="rgba(80,20,0,0.38)"  stroke="rgba(255,80,0,0.08)"  strokeWidth="0.7" />
      <polygon points={`${w},${h*0.36} ${cx},${h*0.52} ${w*0.72},${h}`} fill="rgba(100,30,0,0.28)" stroke="rgba(255,107,0,0.08)" strokeWidth="0.7" />
      <polygon points={`${cx*0.28},${h} ${cx},${h*0.52} ${w*0.72},${h}`} fill="rgba(60,15,0,0.45)" stroke="rgba(255,80,0,0.06)" strokeWidth="0.7" />
      <line x1={cx} y1={0} x2={0} y2={h*0.36} stroke="rgba(255,220,100,0.28)" strokeWidth="0.8" />
    </svg>
  );
}

function SvgBoltHead({ size = 44, uid = "sb0" }: { size?: number; uid?: string }) {
  const c = size / 2, hexR = c * 0.88, boreR = c * 0.3;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id={`${uid}-fill`} cx="35%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="#685040" />
          <stop offset="55%"  stopColor="#2a1e10" />
          <stop offset="100%" stopColor="#0e0804" />
        </radialGradient>
      </defs>
      <polygon points={hexPts(c, c, hexR, 30 * Math.PI / 180)} fill={`url(#${uid}-fill)`} stroke="rgba(200,140,60,0.18)" strokeWidth="0.6" />
      <polygon points={hexPts(c, c, hexR, 30 * Math.PI / 180)} fill="none" stroke="rgba(255,200,80,0.1)" strokeWidth="0.3" />
      <circle cx={c} cy={c} r={boreR} fill="#060402" stroke="rgba(255,107,0,0.12)" strokeWidth="0.6" />
      <line x1={c - boreR * 0.8} y1={c} x2={c + boreR * 0.8} y2={c}
        stroke="rgba(0,0,0,0.6)" strokeWidth={boreR * 0.2} strokeLinecap="round" />
    </svg>
  );
}

/* ── Spinning gear wrapper ───────────────────────────────────── */
function SpinGear({ size, uid, opacity, style, dir = 1 }: {
  size: number; uid: string; opacity: number; style: React.CSSProperties; dir?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dur = (size / 200) * 80; // bigger = slower
    el.style.animation = dir > 0
      ? `spin-slow-sf ${dur}s linear infinite`
      : `spin-rslow-sf ${dur}s linear infinite`;
    return () => { el.style.animation = ""; };
  }, [size, dir]);
  return (
    <div className="absolute pointer-events-none" style={style}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity }} transition={{ duration: 2.5 }}>
        <div ref={ref} style={{ willChange: "transform" }}>
          <SvgGear size={size} uid={uid} />
        </div>
      </motion.div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SectionForgeBg — background layer for non-hero sections
   variant: "about" | "stats" | "links" | "footer"
════════════════════════════════════════════════════════════════ */
export default function SectionForgeBg({ variant }: {
  variant: "about" | "stats" | "links" | "footer";
}) {
  /* Inject spin keyframes once */
  useEffect(() => {
    const id = "sfb-keyframes";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
      @keyframes spin-slow-sf  { to { transform: rotate(360deg);  } }
      @keyframes spin-rslow-sf { to { transform: rotate(-360deg); } }
    `;
    document.head.appendChild(s);
    return () => s.remove();
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">

      {/* ── Shared: forge-hatch diagonal texture ─────────── */}
      <div className="absolute inset-0 forge-hatch" style={{ opacity: 0.1 }} />

      {/* ── Shared: left vertical rule ──────────────────── */}
      <div className="absolute left-4 sm:left-6 top-10 bottom-10 w-px hidden sm:block"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(255,107,0,0.22) 25%, rgba(255,107,0,0.22) 75%, transparent)" }} />

      {/* ── Shared: top & bottom section fades ──────────── */}
      <div className="absolute top-0 inset-x-0 h-16 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(255,107,0,0.04), transparent)" }} />
      <div className="absolute bottom-0 inset-x-0 h-16 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(255,107,0,0.04), transparent)" }} />

      {/* ── Variant-specific elements ─────────────────── */}

      {variant === "about" && <>
        {/* Gear top-right */}
        <SpinGear size={150} uid="sfb-about-g1" opacity={0.28} dir={1}
          style={{ right: -30, top: -20 }} />
        {/* Small gear bottom-left */}
        <SpinGear size={80}  uid="sfb-about-g2" opacity={0.22} dir={-1}
          style={{ left: 24, bottom: 30 }} />
        {/* Hexnut mid-right */}
        <motion.div className="absolute" style={{ right: "6%", top: "55%" }}
          initial={{ opacity: 0 }} animate={{ opacity: 0.32 }} transition={{ delay: 0.8, duration: 2 }}>
          <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 16, repeat: Infinity }}>
            <SvgHexNut size={90} uid="sfb-about-hn" />
          </motion.div>
        </motion.div>
        {/* Crystal upper-left */}
        <motion.div className="absolute" style={{ left: "3%", top: "12%" }}
          initial={{ opacity: 0 }} animate={{ opacity: 0.38 }} transition={{ delay: 0.5, duration: 2 }}>
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>
            <SvgCrystal size={72} uid="sfb-about-cr" />
          </motion.div>
        </motion.div>
        {/* Bolt heads scattered */}
        {([
          { left: "22%", top: "8%",  size: 40, rot: 18,  uid: "sfb-ab1" },
          { left: "68%", top: "78%", size: 36, rot: -24, uid: "sfb-ab2" },
          { left: "48%", top: "92%", size: 32, rot: 40,  uid: "sfb-ab3" },
        ] as Array<{ left: string; top: string; size: number; rot: number; uid: string }>).map(({ left, top, size, rot, uid }) => (
          <motion.div key={uid} className="absolute" style={{ left, top, rotate: rot }}
            initial={{ opacity: 0 }} animate={{ opacity: 0.38 }} transition={{ delay: 1, duration: 1.5 }}>
            <SvgBoltHead size={size} uid={uid} />
          </motion.div>
        ))}
        {/* Focused glow */}
        <div className="absolute w-[380px] h-[300px] rounded-full pointer-events-none"
          style={{ top: "-5%", left: "-8%", background: "radial-gradient(circle, rgba(255,107,0,0.07), transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute w-[280px] h-[240px] rounded-full pointer-events-none"
          style={{ bottom: "10%", right: "5%", background: "radial-gradient(circle, rgba(255,184,0,0.06), transparent 70%)", filter: "blur(55px)" }} />
      </>}

      {variant === "stats" && <>
        {/* Corner bolt heads */}
        {([
          { left: "1%",  top: "8%",  size: 48, rot: 12,  uid: "sfb-st1" },
          { right: "1%", top: "8%",  size: 44, rot: -20, uid: "sfb-st2" },
          { left: "1%",  bottom: "8%", size: 42, rot: 35,  uid: "sfb-st3" },
          { right: "1%", bottom: "8%", size: 46, rot: -8,  uid: "sfb-st4" },
        ] as Array<{ left?: string; right?: string; top?: string; bottom?: string; size: number; rot: number; uid: string }>).map(({ uid, size, rot, ...pos }) => (
          <motion.div key={uid} className="absolute" style={{ ...pos, rotate: rot }}
            initial={{ opacity: 0 }} animate={{ opacity: 0.42 }} transition={{ delay: 0.6, duration: 1.5 }}>
            <SvgBoltHead size={size} uid={uid} />
          </motion.div>
        ))}
        {/* Gear — bottom-right */}
        <SpinGear size={120} uid="sfb-stats-g" opacity={0.20} dir={1}
          style={{ right: 40, bottom: -20 }} />
        {/* HexNut */}
        <motion.div className="absolute" style={{ left: "8%", bottom: "15%" }}
          initial={{ opacity: 0 }} animate={{ opacity: 0.28 }} transition={{ delay: 1, duration: 2 }}>
          <SvgHexNut size={60} uid="sfb-stats-hn" />
        </motion.div>
        {/* Horizontal etch lines — technical dashboard feel */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.06 }}>
          {[0.15, 0.5, 0.85].map((y, i) => (
            <line key={i} x1="2%" y1={`${y * 100}%`} x2="98%" y2={`${y * 100}%`}
              stroke="rgba(255,184,0,1)" strokeWidth="0.5" strokeDasharray="4,12" />
          ))}
        </svg>
        {/* Side glow */}
        <div className="absolute w-[500px] h-[200px] rounded-full pointer-events-none"
          style={{ top: "50%", left: "10%", transform: "translateY(-50%)", background: "radial-gradient(ellipse, rgba(255,107,0,0.05), transparent 70%)", filter: "blur(50px)" }} />
      </>}

      {variant === "links" && <>
        {/* Large gear — bottom-right */}
        <SpinGear size={220} uid="sfb-lnk-g1" opacity={0.22} dir={1}
          style={{ right: -40, bottom: -30 }} />
        {/* Small counter-gear — top-left */}
        <SpinGear size={90}  uid="sfb-lnk-g2" opacity={0.20} dir={-1}
          style={{ left: 10, top: 10 }} />
        {/* Crystals */}
        <motion.div className="absolute" style={{ left: "2%", bottom: "20%" }}
          initial={{ opacity: 0 }} animate={{ opacity: 0.42 }} transition={{ delay: 0.6, duration: 2 }}>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
            <SvgCrystal size={80} uid="sfb-lnk-cr1" />
          </motion.div>
        </motion.div>
        <motion.div className="absolute" style={{ right: "15%", top: "10%" }}
          initial={{ opacity: 0 }} animate={{ opacity: 0.32 }} transition={{ delay: 1, duration: 2 }}>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}>
            <SvgCrystal size={54} uid="sfb-lnk-cr2" />
          </motion.div>
        </motion.div>
        {/* Bolt heads */}
        {([
          { left: "28%", top: "6%",  size: 38, rot: 22,  uid: "sfb-ln1" },
          { left: "55%", top: "88%", size: 34, rot: -15, uid: "sfb-ln2" },
          { right: "2%", top: "45%", size: 42, rot: 30,  uid: "sfb-ln3" },
        ] as Array<{ left?: string; right?: string; top?: string; bottom?: string; size: number; rot: number; uid: string }>).map(({ uid, size, rot, ...pos }) => (
          <motion.div key={uid} className="absolute" style={{ ...pos, rotate: rot }}
            initial={{ opacity: 0 }} animate={{ opacity: 0.38 }} transition={{ delay: 1.2, duration: 1.5 }}>
            <SvgBoltHead size={size} uid={uid} />
          </motion.div>
        ))}
        {/* Glow */}
        <div className="absolute w-[420px] h-[380px] rounded-full pointer-events-none"
          style={{ top: "10%", right: "-5%", background: "radial-gradient(circle, rgba(255,107,0,0.06), transparent 70%)", filter: "blur(65px)" }} />
        <div className="absolute w-[320px] h-[280px] rounded-full pointer-events-none"
          style={{ bottom: "5%", left: "-5%", background: "radial-gradient(circle, rgba(255,184,0,0.05), transparent 70%)", filter: "blur(60px)" }} />
      </>}

      {variant === "footer" && <>
        {/* Large gear — drifts down-left as section scrolls */}
        <div className="absolute parallax-deco pointer-events-none"
          style={{ right: -80, top: "calc(50% - 190px)" }}
          data-py="120" data-px="-30" data-scrub="4">
          <SpinGear size={380} uid="sfb-ft-g1" opacity={1} dir={1} style={{ position: "relative" }} />
        </div>
        {/* Counter gear — drifts up-right (opposite to large gear) */}
        <div className="absolute parallax-deco pointer-events-none"
          style={{ left: -20, bottom: 10 }}
          data-py="-90" data-px="25" data-scrub="3.5">
          <SpinGear size={160} uid="sfb-ft-g2" opacity={1} dir={-1} style={{ position: "relative" }} />
        </div>
        {/* Crystal — drifts down-right */}
        <div className="absolute parallax-deco" style={{ left: "5%", top: "8%" }}
          data-py="80" data-px="15" data-scrub="3">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 2 }}>
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
              <SvgCrystal size={96} uid="sfb-ft-cr" />
            </motion.div>
          </motion.div>
        </div>
        {/* HexNut 1 — drifts up-left (counter direction) */}
        <div className="absolute parallax-deco" style={{ right: "28%", top: "12%" }}
          data-py="-60" data-px="-20" data-scrub="3">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 2 }}>
            <SvgHexNut size={72} uid="sfb-ft-hn1" />
          </motion.div>
        </div>
        {/* HexNut 2 — drifts down-left */}
        <div className="absolute parallax-deco" style={{ left: "18%", bottom: "10%" }}
          data-py="60" data-px="-15" data-scrub="3.5">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 2 }}>
            <SvgHexNut size={52} uid="sfb-ft-hn2" />
          </motion.div>
        </div>
        {/* Bolt heads — each drifts in a different direction */}
        {([
          { left: "38%",  top: "6%",      size: 44, rot: 10,  uid: "sfb-ft1", py: "-50", px: "10"  },
          { right: "5%",  bottom: "12%",  size: 40, rot: -28, uid: "sfb-ft2", py: "70",  px: "-20" },
          { left: "62%",  bottom: "8%",   size: 36, rot: 50,  uid: "sfb-ft3", py: "55",  px: "15"  },
        ] as Array<{ left?: string; right?: string; top?: string; bottom?: string; size: number; rot: number; uid: string; py: string; px: string }>).map(({ uid, size, rot, py, px, ...pos }) => (
          <div key={uid} className="absolute parallax-deco" style={pos}
            data-py={py} data-px={px} data-scrub="3.5">
            <motion.div style={{ rotate: rot }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 1.5 }}>
              <SvgBoltHead size={size} uid={uid} />
            </motion.div>
          </div>
        ))}
        {/* Central glow */}
        <div className="absolute w-[700px] h-[500px] rounded-full pointer-events-none"
          style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(ellipse, rgba(155,65,0,0.09), transparent 70%)", filter: "blur(90px)" }} />
      </>}
    </div>
  );
}
