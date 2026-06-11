"use client";
import { useEffect, useRef } from "react";

const CURSOR_CSS = `
  @keyframes reticle-hex-spin { to { transform: rotate(360deg); } }
  @keyframes reticle-scan     { to { stroke-dashoffset: -32;    } }
  @keyframes reticle-pulse    { 0%,100%{opacity:.7} 50%{opacity:1} }
`;

// hex points helper
function hex6(r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    return `${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}

// crosshair tick endpoints
const TICKS: [number, number, number, number][] = [
  [-2, -28, 2, -28],
  [-2,  28, 2,  28],
  [-28, -2, -28, 2],
  [ 28, -2,  28, 2],
];

export default function CustomCursor() {
  const outerRef  = useRef<HTMLDivElement>(null);
  const raw       = useRef({ x: -200, y: -200 });
  const smooth    = useRef({ x: -200, y: -200 });
  const hovering  = useRef(false);
  const scaleVal  = useRef(1);
  const rafId     = useRef(0);
  const hasMoved  = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const style = document.createElement("style");
    style.textContent = CURSOR_CSS;
    document.head.appendChild(style);

    document.documentElement.classList.add("custom-cursor-active");

    const setHover = (v: boolean) => () => { hovering.current = v; };
    const rebind = () => {
      document.querySelectorAll("a,button,[role='button'],input,label,select,textarea").forEach(el => {
        el.addEventListener("mouseenter", setHover(true));
        el.addEventListener("mouseleave", setHover(false));
      });
    };
    rebind();

    const onMove = (e: MouseEvent) => {
      raw.current = { x: e.clientX, y: e.clientY };
      hasMoved.current = true;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      smooth.current.x += (raw.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (raw.current.y - smooth.current.y) * 0.1;
      const target = hovering.current ? 1.55 : 1;
      scaleVal.current += (target - scaleVal.current) * 0.12;

      if (outerRef.current) {
        outerRef.current.style.transform =
          `translate3d(${(smooth.current.x - 36).toFixed(1)}px,${(smooth.current.y - 36).toFixed(1)}px,0) scale(${scaleVal.current.toFixed(3)})`;
        outerRef.current.style.opacity = hasMoved.current ? (hovering.current ? "1" : "0.85") : "0";
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId.current);
      style.remove();
    };
  }, []);

  return (
    <div
      ref={outerRef}
      className="fixed top-0 left-0 w-[72px] h-[72px] pointer-events-none z-[9999] will-change-transform"
      style={{ transform: "translate3d(-200px,-200px,0)", opacity: 0 }}
    >
      <svg width="72" height="72" viewBox="-36 -36 72 72" fill="none">

        {/* ── Outer hex frame — slowly steps 60° (6-fold crystal symmetry) ── */}
        <g style={{ animation: "reticle-hex-spin 10s linear infinite", transformOrigin: "0 0" }}>
          <polygon
            points={hex6(28)}
            stroke="rgba(255,154,0,0.30)"
            strokeWidth="0.65"
          />
          {/* vertex dots */}
          {hex6(28).split(" ").map((pt, i) => {
            const [x, y] = pt.split(",").map(Number);
            return <circle key={i} cx={x} cy={y} r={1.1} fill="rgba(255,154,0,0.45)" />;
          })}
        </g>

        {/* ── Scanning ring (diffraction ring metaphor) ── */}
        <circle
          r={20}
          stroke="rgba(255,107,0,0.40)"
          strokeWidth="0.6"
          strokeDasharray="2.8,5.2"
          style={{ animation: "reticle-scan 5s linear infinite" }}
        />

        {/* ── Inner measurement ring ── */}
        <circle
          r={11}
          stroke="rgba(255,184,0,0.52)"
          strokeWidth="0.55"
          strokeDasharray="1,3"
          style={{ animation: "reticle-pulse 3s ease-in-out infinite" }}
        />

        {/* ── Crosshair — 4 segments with center gap ── */}
        {/* top  */ }<line x1="0" y1="-28" x2="0" y2="-14" stroke="rgba(255,154,0,0.88)" strokeWidth="0.75" />
        {/* bottom */}<line x1="0" y1="14"  x2="0" y2="28"  stroke="rgba(255,154,0,0.88)" strokeWidth="0.75" />
        {/* left  */ }<line x1="-28" y1="0" x2="-14" y2="0" stroke="rgba(255,154,0,0.88)" strokeWidth="0.75" />
        {/* right */ }<line x1="14"  y1="0" x2="28"  y2="0" stroke="rgba(255,154,0,0.88)" strokeWidth="0.75" />

        {/* ── Tick marks at crosshair ends (measurement scale) ── */}
        {TICKS.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(255,154,0,0.55)" strokeWidth="0.5" />
        ))}

        {/* ── Mid-range tick marks (secondary graduation) ── */}
        <line x1="0" y1="-20" x2="0" y2="-17" stroke="rgba(255,184,0,0.35)" strokeWidth="0.5" />
        <line x1="0" y1="17"  x2="0" y2="20"  stroke="rgba(255,184,0,0.35)" strokeWidth="0.5" />
        <line x1="-20" y1="0" x2="-17" y2="0" stroke="rgba(255,184,0,0.35)" strokeWidth="0.5" />
        <line x1="17"  y1="0" x2="20"  y2="0" stroke="rgba(255,184,0,0.35)" strokeWidth="0.5" />

        {/* ── Center: hexagonal crystal node ── */}
        <polygon
          points={hex6(5.2)}
          stroke="rgba(255,107,0,0.80)"
          strokeWidth="0.7"
          fill="rgba(255,107,0,0.14)"
        />

        {/* ── Center dot — actual pointer position ── */}
        <circle r={1.6} fill="#FF9A00" />
        <circle r={0.6} fill="rgba(255,230,180,0.9)" />
      </svg>
    </div>
  );
}
