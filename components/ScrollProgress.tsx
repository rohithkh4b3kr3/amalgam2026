"use client";
import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const rafId  = useRef(0);
  const last   = useRef(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      if (barRef.current && Math.abs(pct - last.current) > 0.05) {
        last.current = pct;
        barRef.current.style.width = `${pct}%`;
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[200] pointer-events-none">
      <div
        ref={barRef}
        className="h-full will-change-transform"
        style={{
          width: "0%",
          background: "linear-gradient(90deg, #CC4400, #FF6B00 40%, #FF9A00 70%, #FFB800)",
          boxShadow: "0 0 8px rgba(255,107,0,0.7), 0 0 20px rgba(255,107,0,0.3)",
        }}
      />
    </div>
  );
}
