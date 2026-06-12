"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ── SVG helpers ──────────────────────────────────────────── */
function gearPts(cx: number, cy: number, R: number, r: number, n: number) {
  return Array.from({ length: n * 2 }, (_, i) => {
    const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 === 0 ? R : r;
    return `${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`;
  }).join(" ");
}

function hexPts(cx: number, cy: number, r: number, rot = 0) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 + rot;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");
}

/* ── Components ───────────────────────────────────────────── */
function Gear({ size = 300, uid = "g0", teeth = 14, innerFrac = 0.82 }: {
  size?: number; uid?: string; teeth?: number; innerFrac?: number;
}) {
  const c = size / 2;
  const R = c * 0.9;
  const r = R * innerFrac;
  const bore = c * 0.24;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      <defs>
        {/* Warm steel — charcoal to warm dark */}
        <radialGradient id={`${uid}-fill`} cx="32%" cy="28%" r="72%">
          <stop offset="0%"   stopColor="#60503a" />
          <stop offset="28%"  stopColor="#3a2818" />
          <stop offset="62%"  stopColor="#201408" />
          <stop offset="100%" stopColor="#0e0904" />
        </radialGradient>
        {/* Golden sheen */}
        <linearGradient id={`${uid}-sheen`} x1="5%" y1="5%" x2="95%" y2="95%">
          <stop offset="0%"   stopColor="rgba(255,200,120,0.38)" />
          <stop offset="30%"  stopColor="rgba(200,140,60,0.14)"  />
          <stop offset="70%"  stopColor="rgba(40,20,5,0.05)"     />
          <stop offset="100%" stopColor="rgba(255,107,0,0.07)"   />
        </linearGradient>
        <radialGradient id={`${uid}-bore`} cx="40%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#1a1008" />
          <stop offset="100%" stopColor="#050302" />
        </radialGradient>
      </defs>

      {/* Gear body */}
      <polygon points={gearPts(c, c, R, r, teeth)}
        fill={`url(#${uid}-fill)`} stroke="rgba(200,150,80,0.2)" strokeWidth="0.7" />
      {/* Golden sheen */}
      <polygon points={gearPts(c, c, R, r, teeth)}
        fill={`url(#${uid}-sheen)`} />

      {/* Spoke ring */}
      <circle cx={c} cy={c} r={c * 0.56} fill="none" stroke="rgba(200,140,60,0.14)" strokeWidth="1.2" />
      <circle cx={c} cy={c} r={c * 0.43} fill="none" stroke="rgba(200,140,60,0.09)" strokeWidth="0.8" />

      {/* Spokes */}
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <line key={i}
            x1={c + bore * 1.1 * Math.cos(a)}   y1={c + bore * 1.1 * Math.sin(a)}
            x2={c + c * 0.5 * Math.cos(a)}      y2={c + c * 0.5 * Math.sin(a)}
            stroke="rgba(180,120,50,0.1)" strokeWidth="1.5" />
        );
      })}

      {/* Bore */}
      <circle cx={c} cy={c} r={bore} fill={`url(#${uid}-bore)`} />
      <circle cx={c} cy={c} r={bore} fill="none" stroke="rgba(255,107,0,0.22)" strokeWidth="0.9" />
      <circle cx={c} cy={c} r={bore * 0.65} fill="none" stroke="rgba(200,140,60,0.12)" strokeWidth="0.5" />

      {/* Top-left specular arc */}
      <path
        d={`M ${c - R * 0.55} ${c - R * 0.55} A ${R * 0.75} ${R * 0.75} 0 0 1 ${c + R * 0.4} ${c - R * 0.6}`}
        fill="none" stroke="rgba(255,200,100,0.22)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function Screw({ w = 68, h = 280, uid = "sc0" }: { w?: number; h?: number; uid?: string }) {
  const cx = w / 2;
  const headH = h * 0.17;
  const shaftW = w * 0.52;
  const sl = cx - shaftW / 2;
  const sr = cx + shaftW / 2;
  const shaftTop = headH;
  const shaftH = h * 0.74;
  const threads = 22;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={`${uid}-head`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#786050" />
          <stop offset="40%"  stopColor="#3c2818" />
          <stop offset="100%" stopColor="#140c04" />
        </linearGradient>
        <linearGradient id={`${uid}-shaft`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#0e0804" />
          <stop offset="18%"  stopColor="#301e0c" />
          <stop offset="50%"  stopColor="#4a3018" />
          <stop offset="82%"  stopColor="#301e0c" />
          <stop offset="100%" stopColor="#0e0804" />
        </linearGradient>
        <linearGradient id={`${uid}-hl`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="rgba(255,200,100,0)"    />
          <stop offset="28%"  stopColor="rgba(255,200,100,0.22)" />
          <stop offset="72%"  stopColor="rgba(200,140,60,0.07)"  />
          <stop offset="100%" stopColor="rgba(255,200,100,0)"    />
        </linearGradient>
      </defs>

      {/* Hex head (trapezoid) */}
      <polygon
        points={`${cx - w * 0.46},0 ${cx + w * 0.46},0 ${sr},${headH} ${sl},${headH}`}
        fill={`url(#${uid}-head)`} stroke="rgba(200,140,60,0.22)" strokeWidth="0.7" />
      {/* Head highlight */}
      <line x1={cx - w * 0.28} y1={headH * 0.32} x2={cx + w * 0.28} y2={headH * 0.32}
        stroke="rgba(255,200,100,0.2)" strokeWidth="0.5" />

      {/* Shaft body */}
      <rect x={sl} y={shaftTop} width={shaftW} height={shaftH}
        fill={`url(#${uid}-shaft)`} />
      <rect x={sl} y={shaftTop} width={shaftW} height={shaftH}
        fill={`url(#${uid}-hl)`} />

      {/* Thread lines */}
      {Array.from({ length: threads }, (_, i) => {
        const y0 = shaftTop + (i / threads) * shaftH;
        const y1 = y0 + shaftH / threads;
        return (
          <g key={i}>
            <line x1={sl} y1={y0} x2={sr} y2={y1} stroke="rgba(0,0,0,0.5)" strokeWidth="1.4" />
            <line x1={sl} y1={y0} x2={sr} y2={y1} stroke="rgba(200,140,60,0.07)" strokeWidth="0.5" />
          </g>
        );
      })}

      {/* Shaft edges */}
      <line x1={sl} y1={shaftTop} x2={sl} y2={shaftTop + shaftH} stroke="rgba(200,140,60,0.16)" strokeWidth="0.8" />
      <line x1={sr} y1={shaftTop} x2={sr} y2={shaftTop + shaftH} stroke="rgba(0,0,0,0.4)"         strokeWidth="0.8" />

      {/* Tapered tip */}
      <polygon
        points={`${sl},${shaftTop + shaftH} ${sr},${shaftTop + shaftH} ${cx + shaftW * 0.28},${h} ${cx - shaftW * 0.28},${h}`}
        fill={`url(#${uid}-shaft)`} stroke="rgba(200,140,60,0.09)" strokeWidth="0.5" />
    </svg>
  );
}

function HexNut({ size = 100, uid = "n0" }: { size?: number; uid?: string }) {
  const c = size / 2;
  const hexR = c * 0.9;
  const holeR = c * 0.41;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id={`${uid}-fill`} cx="30%" cy="25%" r="75%">
          <stop offset="0%"   stopColor="#685040" />
          <stop offset="45%"  stopColor="#2a1e10" />
          <stop offset="100%" stopColor="#0e0904" />
        </radialGradient>
        <linearGradient id={`${uid}-hl`} x1="10%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%"   stopColor="rgba(255,200,100,0.28)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)"          />
        </linearGradient>
      </defs>
      <polygon points={hexPts(c, c, hexR, 0)} fill={`url(#${uid}-fill)`} stroke="rgba(200,140,60,0.22)" strokeWidth="0.9" />
      <polygon points={hexPts(c, c, hexR, 0)} fill={`url(#${uid}-hl)`} />
      {/* Center hole */}
      <circle cx={c} cy={c} r={holeR} fill="#060402" stroke="rgba(255,107,0,0.18)" strokeWidth="1" />
      {/* Thread rings */}
      {[0.72, 0.84, 0.96].map((f, i) => (
        <circle key={i} cx={c} cy={c} r={holeR * f}
          fill="none" stroke="rgba(200,140,60,0.06)" strokeWidth="0.7" />
      ))}
      <polygon points={hexPts(c, c, hexR, 0)} fill="none" stroke="rgba(255,200,80,0.1)" strokeWidth="0.5" />
    </svg>
  );
}

function BoltHead({ size = 56, uid = "bh0" }: { size?: number; uid?: string }) {
  const c = size / 2;
  const hexR = c * 0.88;
  const boreR = c * 0.3;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id={`${uid}-fill`} cx="35%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="#706040" />
          <stop offset="50%"  stopColor="#2e2010" />
          <stop offset="100%" stopColor="#100a04" />
        </radialGradient>
      </defs>
      <polygon points={hexPts(c, c, hexR, 30 * Math.PI / 180)} fill={`url(#${uid}-fill)`} stroke="rgba(200,140,60,0.2)" strokeWidth="0.7" />
      <polygon points={hexPts(c, c, hexR, 30 * Math.PI / 180)} fill="none" stroke="rgba(255,200,80,0.14)" strokeWidth="0.4" />
      <circle cx={c} cy={c} r={boreR} fill="#070402" stroke="rgba(255,107,0,0.15)" strokeWidth="0.8" />
      {/* Slot mark */}
      <line x1={c - boreR * 0.8} y1={c} x2={c + boreR * 0.8} y2={c}
        stroke="rgba(0,0,0,0.7)" strokeWidth={boreR * 0.22} strokeLinecap="round" />
    </svg>
  );
}

function Crystal({ size = 110, uid = "cr0" }: { size?: number; uid?: string }) {
  const w = size;
  const h = size * 1.28;
  const cx = w / 2;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={`${uid}-a`} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%"   stopColor="rgba(255,154,0,0.55)"  />
          <stop offset="50%"  stopColor="rgba(200,80,0,0.35)"   />
          <stop offset="100%" stopColor="rgba(80,20,0,0.45)"    />
        </linearGradient>
        <linearGradient id={`${uid}-b`} x1="80%" y1="0%" x2="20%" y2="100%">
          <stop offset="0%"   stopColor="rgba(255,220,100,0.35)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)"           />
        </linearGradient>
      </defs>
      {/* Left top facet */}
      <polygon points={`${cx},0 0,${h*0.36} ${cx},${h*0.52}`}
        fill={`url(#${uid}-a)`} stroke="rgba(255,154,0,0.2)" strokeWidth="0.8" />
      {/* Right top facet */}
      <polygon points={`${cx},0 ${w},${h*0.36} ${cx},${h*0.52}`}
        fill="rgba(255,80,0,0.22)" stroke="rgba(255,107,0,0.14)" strokeWidth="0.8" />
      {/* Bottom left */}
      <polygon points={`0,${h*0.36} ${cx},${h*0.52} ${cx*0.28},${h}`}
        fill="rgba(80,20,0,0.4)" stroke="rgba(255,80,0,0.09)" strokeWidth="0.8" />
      {/* Bottom right */}
      <polygon points={`${w},${h*0.36} ${cx},${h*0.52} ${w*0.72},${h}`}
        fill="rgba(100,30,0,0.3)" stroke="rgba(255,107,0,0.1)" strokeWidth="0.8" />
      {/* Bottom center */}
      <polygon points={`${cx*0.28},${h} ${cx},${h*0.52} ${w*0.72},${h}`}
        fill="rgba(60,15,0,0.5)" stroke="rgba(255,80,0,0.07)" strokeWidth="0.8" />
      {/* Left-edge specular */}
      <line x1={cx} y1={0} x2={0} y2={h*0.36} stroke="rgba(255,220,100,0.35)" strokeWidth="0.9" />
      {/* Top cap sheen */}
      <polygon points={`${cx},0 ${cx*0.42},${h*0.14} ${cx},${h*0.26} ${cx*1.58},${h*0.14}`}
        fill={`url(#${uid}-b)`} />
    </svg>
  );
}

/* ── CSS animation injected once ──────────────────────────── */
const CSS_SPIN_SLOW = `
@keyframes spin-slow  { to { transform: rotate(360deg);  } }
@keyframes spin-rslow { to { transform: rotate(-360deg); } }
`;

export default function HeroMetalBg() {
  const gearMainRef  = useRef<HTMLDivElement>(null);
  const gearSmallRef = useRef<HTMLDivElement>(null);
  const gearTinyRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const style = document.createElement("style");
    style.textContent = CSS_SPIN_SLOW;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  useEffect(() => {
    if (gearMainRef.current)  gearMainRef.current.style.animation  = "spin-slow 90s linear infinite";
    if (gearSmallRef.current) gearSmallRef.current.style.animation = "spin-rslow 55s linear infinite";
    if (gearTinyRef.current)  gearTinyRef.current.style.animation  = "spin-slow 38s linear infinite";
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">

      {/* ── Forge glow blob behind main gear ─────────────────── */}
      <div
        className="absolute"
        style={{
          right: "-12%", top: "-15%",
          width: 700, height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,80,0,0.22) 0%, rgba(255,107,0,0.10) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Giant gear — right side, partially off-screen ─────── */}
      <motion.div
        className="absolute"
        style={{ right: "-8%", top: "-10%", opacity: 0 }}
        animate={{ opacity: 0.72 }}
        transition={{ duration: 2.5, delay: 0.2 }}
      >
        <div ref={gearMainRef} style={{ willChange: "transform" }}>
          <Gear size={520} uid="gear-hero" teeth={16} innerFrac={0.83} />
        </div>
      </motion.div>

      {/* ── Large screw — bottom left ─────────────────────────── */}
      <motion.div
        className="absolute"
        style={{ left: "1%", bottom: "-4%", rotate: -12, opacity: 0 }}
        animate={{ opacity: 0.75 }}
        transition={{ duration: 2, delay: 0.5 }}
      >
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>
          <Screw w={72} h={290} uid="screw-main" />
        </motion.div>
      </motion.div>

      {/* ── Second screw — far right middle, rotated ─────────── */}
      <motion.div
        className="absolute"
        style={{ right: "3%", top: "52%", rotate: 18, opacity: 0 }}
        animate={{ opacity: 0.58 }}
        transition={{ duration: 2, delay: 0.9 }}
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}>
          <Screw w={48} h={190} uid="screw-2" />
        </motion.div>
      </motion.div>

      {/* ── Large hex nut — left centre ──────────────────────── */}
      <motion.div
        className="absolute"
        style={{ left: "9%", top: "55%", opacity: 0 }}
        animate={{ opacity: 0.65 }}
        transition={{ duration: 2, delay: 0.7 }}
      >
        <motion.div animate={{ rotate: [0, 6, -6, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}>
          <HexNut size={140} uid="nut-big" />
        </motion.div>
      </motion.div>

      {/* ── Small gear — left upper ───────────────────────────── */}
      <motion.div
        className="absolute"
        style={{ left: "5%", top: "30%", opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ duration: 2, delay: 1 }}
      >
        <div ref={gearSmallRef} style={{ willChange: "transform" }}>
          <Gear size={130} uid="gear-sm" teeth={10} innerFrac={0.78} />
        </div>
      </motion.div>

      {/* ── Crystal — right lower ─────────────────────────────── */}
      <motion.div
        className="absolute"
        style={{ right: "10%", bottom: "14%", opacity: 0 }}
        animate={{ opacity: 0.80 }}
        transition={{ duration: 2, delay: 0.6 }}
      >
        <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}>
          <Crystal size={115} uid="crystal-hero" />
        </motion.div>
      </motion.div>

      {/* ── Tiny gear — far bottom right ──────────────────────── */}
      <motion.div
        className="absolute"
        style={{ right: "22%", bottom: "8%", opacity: 0 }}
        animate={{ opacity: 0.52 }}
        transition={{ duration: 2, delay: 1.2 }}
      >
        <div ref={gearTinyRef} style={{ willChange: "transform" }}>
          <Gear size={80} uid="gear-xs" teeth={10} innerFrac={0.79} />
        </div>
      </motion.div>

      {/* ── Scattered bolt heads ──────────────────────────────── */}
      {([
        { left: "28%", top: "12%", size: 52, rot: 20,  uid: "bh1", delay: 1.0, op: 0.60 },
        { left: "60%", top: "72%", size: 44, rot: -30, uid: "bh2", delay: 1.2, op: 0.55 },
        { left: "42%", top: "88%", size: 38, rot: 45,  uid: "bh3", delay: 1.4, op: 0.50 },
        { left: "18%", top: "80%", size: 46, rot: -8,  uid: "bh4", delay: 1.6, op: 0.55 },
        { left: "72%", top: "30%", size: 40, rot: 15,  uid: "bh5", delay: 1.8, op: 0.48 },
      ] as Array<{ left: string; top: string; size: number; rot: number; uid: string; delay: number; op: number }>).map(({ left, top, size, rot, uid, delay, op }) => (
        <motion.div
          key={uid}
          className="absolute"
          style={{ left, top, rotate: rot, opacity: 0 }}
          animate={{ opacity: op }}
          transition={{ duration: 1.5, delay }}
        >
          <BoltHead size={size} uid={uid} />
        </motion.div>
      ))}

      {/* ── Extra small hex nut ───────────────────────────────── */}
      <motion.div
        className="absolute"
        style={{ right: "24%", top: "18%", opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ duration: 2, delay: 1.3 }}
      >
        <HexNut size={70} uid="nut-sm" />
      </motion.div>

    </div>
  );
}
