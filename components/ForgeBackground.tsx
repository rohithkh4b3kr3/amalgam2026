"use client";

/* ── 3-D forge plate — angled metal slab ───────────────────── */
function ForgePlateSVG({ width = 320, height = 120, x = 0, y = 0, opacity = 0.18, tilt = -8 }: {
  width?: number; height?: number; x?: number; y?: number; opacity?: number; tilt?: number;
}) {
  const uid = `fp-${Math.round(x)}-${Math.round(y)}`;
  const t   = `rotate(${tilt},${x + width / 2},${y + height / 2})`;
  return (
    <g transform={t} opacity={opacity}>
      <defs>
        <linearGradient id={`${uid}-top`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#60503a" />
          <stop offset="40%"  stopColor="#8a6a40" />
          <stop offset="70%"  stopColor="#4a3820" />
          <stop offset="100%" stopColor="#2a1e10" />
        </linearGradient>
        <linearGradient id={`${uid}-face`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#3a2a14" />
          <stop offset="40%"  stopColor="#221808" />
          <stop offset="100%" stopColor="#120e04" />
        </linearGradient>
        <linearGradient id={`${uid}-side`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#1a1208" />
          <stop offset="100%" stopColor="#0a0804" />
        </linearGradient>
      </defs>
      <polygon points={`${x},${y+10} ${x+width},${y} ${x+width},${y+14} ${x},${y+24}`} fill={`url(#${uid}-top)`} />
      <rect x={x} y={y + 20} width={width} height={height - 20} fill={`url(#${uid}-face)`} stroke="rgba(255,184,0,0.1)" strokeWidth="0.5" />
      <polygon points={`${x+width},${y} ${x+width+16},${y+8} ${x+width+16},${y+height-10} ${x+width},${y+height}`} fill={`url(#${uid}-side)`} />
      {[0.12, 0.88].map((fx, i) => (
        <circle key={i} cx={x + width * fx} cy={y + height * 0.55} r={3} fill="#0e0a04" stroke="rgba(255,184,0,0.2)" strokeWidth="0.8" />
      ))}
      {[0.35, 0.65].map((fy, i) => (
        <line key={i} x1={x + 20} y1={y + height * fy} x2={x + width - 20} y2={y + height * fy} stroke="rgba(255,184,0,0.06)" strokeWidth="0.5" />
      ))}
    </g>
  );
}

/* ── Forge anvil silhouette ───────────────────────────────────── */
function AnvilSVG({ x = 0, y = 0, w = 180, opacity = 0.12 }: { x?: number; y?: number; w?: number; opacity?: number }) {
  const h   = w * 0.55;
  const uid = `anvil-${Math.round(x)}`;
  return (
    <g transform={`translate(${x},${y})`} opacity={opacity}>
      <defs>
        <linearGradient id={uid} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#6a5030" />
          <stop offset="100%" stopColor="#1a1008" />
        </linearGradient>
      </defs>
      <path d={`M ${w*0.08},${h*0.25} L ${w*0.92},${h*0.25} L ${w*0.82},${h*0.65} L ${w*0.18},${h*0.65} Z`}
        fill={`url(#${uid})`} stroke="rgba(255,184,0,0.18)" strokeWidth="0.8" />
      <path d={`M ${w*0.08},${h*0.25} L ${w*0.02},${h*0.05} L ${w*0.18},${h*0.25} Z`} fill="#3a2818" />
      <rect x={w*0.18} y={h*0.14} width={w*0.64} height={h*0.13} fill="#503a22" stroke="rgba(255,200,80,0.12)" strokeWidth="0.5" />
      <rect x={w*0.12} y={h*0.65} width={w*0.76} height={h*0.35} fill="#1a1008" stroke="rgba(200,140,60,0.12)" strokeWidth="0.5" />
    </g>
  );
}

/* ── Main export — no canvas, no sparks, no drips ──────────── */
export default function ForgeBackground({ intensity = 1, showAnvil = false }: {
  intensity?: number;
  showAnvil?: boolean;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ opacity: intensity }}>

      {/* Base gradient */}
      <div className="absolute inset-0" style={{
        background:
          "radial-gradient(ellipse 130% 60% at 50% 0%, rgba(60,20,0,0.45) 0%, transparent 65%), " +
          "linear-gradient(180deg, #080400 0%, #050300 100%)",
      }} />

      {/* Steel-plate diagonal lines */}
      <div className="absolute inset-0 pointer-events-none steel-plate opacity-40" />

      {/* Hex grid */}
      <div className="absolute inset-0 pointer-events-none hex-grid-dense opacity-60" />

      {/* SVG structural layer — metal slabs + optional anvil */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <ForgePlateSVG width={380} height={110} x={-40}  y={60}  opacity={0.14} tilt={-6}  />
        <ForgePlateSVG width={280} height={90}  x={1100} y={40}  opacity={0.12} tilt={5}   />
        <ForgePlateSVG width={320} height={100} x={600}  y={780} opacity={0.11} tilt={-4}  />
        <ForgePlateSVG width={200} height={75}  x={1220} y={700} opacity={0.10} tilt={8}   />
        <ForgePlateSVG width={240} height={80}  x={80}   y={720} opacity={0.09} tilt={-10} />
        {showAnvil && <AnvilSVG x={1180} y={640} w={220} opacity={0.12} />}
      </svg>

      {/* Static ambient glows — no animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[550px] h-[440px] rounded-full"
          style={{ top: "-80px", left: "8%",    background: "radial-gradient(circle, rgba(180,50,0,0.07) 0%, transparent 70%)", filter: "blur(70px)" }} />
        <div className="absolute w-[500px] h-[380px] rounded-full"
          style={{ top: "20%",  right: "-60px", background: "radial-gradient(circle, rgba(180,90,0,0.05) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute w-[400px] h-[300px] rounded-full"
          style={{ bottom: 0,   left: "40%",   background: "radial-gradient(circle, rgba(150,35,0,0.05) 0%, transparent 70%)", filter: "blur(90px)" }} />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 45%, rgba(5,3,0,0.8) 100%)",
      }} />
    </div>
  );
}
