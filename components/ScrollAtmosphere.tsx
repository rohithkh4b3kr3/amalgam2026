"use client";
import { useEffect, useRef } from "react";

// Atmosphere states: [scrollProgress, r, g, b, alpha, gradientFocalY%]
const ATMO = [
  [0.00, 195, 55,  0, 0.22,  0 ],  // hero top — peak forge heat at top
  [0.20, 170, 50,  0, 0.17, 25 ],  // hero bottom — glowing, settling
  [0.42, 150, 62,  0, 0.15, 48 ],  // about — warmer amber, spreading
  [0.62, 135, 30,  0, 0.16, 42 ],  // stats/links — darker crimson depth
  [0.82, 100, 18,  0, 0.10, 30 ],  // pre-footer — cooling ember
  [1.00,  70, 12,  0, 0.07, 45 ],  // footer — dormant forge
] as const;

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

export default function ScrollAtmosphere() {
  const orbFar  = useRef<HTMLDivElement>(null);  // large distant orbs, speed 0.07
  const orbMid  = useRef<HTMLDivElement>(null);  // medium orbs, speed 0.18
  const atmo    = useRef<HTMLDivElement>(null);  // dynamic color gradient
  const accent  = useRef<HTMLDivElement>(null);  // secondary accent glow

  useEffect(() => {
    let raf = 0;

    const tick = () => {
      raf = 0;
      const y  = window.scrollY;
      const mh = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p  = Math.min(y / mh, 1);

      // ── Depth parallax — wider speed spread = more 3D depth ──
      if (orbFar.current)
        orbFar.current.style.transform  = `translate3d(0,${y * 0.10}px,0)`;
      if (orbMid.current)
        orbMid.current.style.transform  = `translate3d(0,${y * 0.26}px,0)`;
      if (accent.current)
        accent.current.style.transform  = `translate3d(0,${y * 0.48}px,0)`;

      // ── Section-based atmosphere color ─────────────────────
      let ai = 0;
      for (let i = 0; i < ATMO.length - 2; i++) {
        if (p >= ATMO[i][0] && p < ATMO[i + 1][0]) { ai = i; break; }
        if (i === ATMO.length - 3) ai = ATMO.length - 2;
      }
      const a = ATMO[ai], b = ATMO[Math.min(ai + 1, ATMO.length - 1)];
      const range = (b[0] as number) - (a[0] as number);
      const t  = range > 0.001 ? Math.min((p - (a[0] as number)) / range, 1) : 0;
      const r  = lerp(a[1] as number, b[1] as number, t) | 0;
      const g  = lerp(a[2] as number, b[2] as number, t) | 0;
      const bv = lerp(a[3] as number, b[3] as number, t) | 0;
      const al = lerp(a[4] as number, b[4] as number, t);
      const fy = lerp(a[5] as number, b[5] as number, t);

      if (atmo.current) {
        atmo.current.style.background =
          `radial-gradient(ellipse 160% 70% at 50% ${fy.toFixed(1)}%, rgba(${r},${g},${bv},${al.toFixed(3)}) 0%, transparent 68%)`;
      }
    };

    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener("scroll", kick, { passive: true });
    tick();
    return () => {
      window.removeEventListener("scroll", kick);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="pointer-events-none overflow-hidden"
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
    >
      {/* Solid base */}
      <div className="absolute inset-0" style={{ background: "#020100" }} />

      {/* ── Deep layer — slowest (0.05×), updated in useEffect via this div's ref ── */}
      {/* Steel-plate + hex-grid texture, creates infinite-depth sensation */}
      <div
        className="absolute will-change-transform"
        style={{ top: "-8%", left: 0, right: 0, height: "116%" }}
      >
        <div className="absolute inset-0 steel-plate" style={{ opacity: 0.16 }} />
        <div className="absolute inset-0 hex-grid"    style={{ opacity: 0.28 }} />
      </div>

      {/* ── Far orbs — slow parallax (0.07×) ──────────────── */}
      {/* These large blurry shapes give the "deep space" feeling */}
      <div
        ref={orbFar}
        className="absolute will-change-transform"
        style={{ top: "-15%", left: 0, right: 0, height: "130%" }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: 960, height: 780,
            top: "6%", left: "36%",
            background: "radial-gradient(circle, rgba(160,42,0,0.08) 0%, transparent 70%)",
            filter: "blur(130px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 720, height: 580,
            top: "50%", left: "-10%",
            background: "radial-gradient(circle, rgba(130,52,0,0.065) 0%, transparent 70%)",
            filter: "blur(115px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 640, height: 520,
            top: "80%", right: "2%",
            background: "radial-gradient(circle, rgba(145,32,0,0.06) 0%, transparent 70%)",
            filter: "blur(110px)",
          }}
        />
      </div>

      {/* ── Mid orbs — medium parallax (0.18×) ─────────────── */}
      {/* More distinct, creating the "middle distance" layer */}
      <div
        ref={orbMid}
        className="absolute will-change-transform"
        style={{ top: "-10%", left: 0, right: 0, height: "120%" }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: 460, height: 380,
            top: "18%", right: "8%",
            background: "radial-gradient(circle, rgba(200,65,0,0.055) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 380, height: 310,
            top: "62%", left: "18%",
            background: "radial-gradient(circle, rgba(175,72,0,0.05) 0%, transparent 70%)",
            filter: "blur(85px)",
          }}
        />
      </div>

      {/* ── Near accent — faster parallax (0.32×) ──────────── */}
      {/* Small tight glows — closest layer, moves most visibly */}
      <div
        ref={accent}
        className="absolute will-change-transform"
        style={{ top: "-5%", left: 0, right: 0, height: "110%" }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: 260, height: 210,
            top: "12%", left: "62%",
            background: "radial-gradient(circle, rgba(220,80,0,0.04) 0%, transparent 70%)",
            filter: "blur(65px)",
          }}
        />
      </div>

      {/* ── Scroll-driven atmosphere gradient ──────────────── */}
      {/* Color + focal point change with scroll — the "world breathing" effect */}
      <div ref={atmo} className="absolute inset-0 will-change-auto" />

      {/* ── Vignette — always fixed ─────────────────────────── */}
      {/* Darkens edges so content is always legible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 88% 80% at 50% 50%, transparent 28%, rgba(2,1,0,0.84) 100%)",
        }}
      />
    </div>
  );
}
