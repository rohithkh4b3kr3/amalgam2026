"use client";
import { useEffect, useRef } from "react";

export default function ScrollAtmosphere() {
  const atmo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const y  = window.scrollY;
      const mh = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p  = Math.min(y / mh, 1);
      const al = 0.06 + p * 0.04;
      if (atmo.current) {
        atmo.current.style.background =
          `radial-gradient(ellipse 140% 60% at 50% ${(20 + p * 30).toFixed(1)}%, rgba(255,107,0,${al.toFixed(3)}) 0%, transparent 65%)`;
      }
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener("scroll", kick, { passive: true });
    tick();
    return () => { window.removeEventListener("scroll", kick); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="pointer-events-none overflow-hidden" style={{ position: "fixed", inset: 0, zIndex: 0 }}>
      <div className="absolute inset-0" style={{ background: "#FFFFFF" }} />
      <div ref={atmo} className="absolute inset-0 will-change-auto" />
    </div>
  );
}
