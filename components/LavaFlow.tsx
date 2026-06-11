"use client";
import { useEffect, useRef } from "react";

/*
  Canvas-based lava flow — branching molten-metal channels that
  slowly fill with glowing orange/amber liquid from top to bottom.
  Designed as a full-width strip between page sections.
*/

interface Channel {
  pts: { x: number; y: number }[];
  fill: number;   // 0–1 how full
  speed: number;
  width: number;
  color: string;
}

function buildChannels(w: number, h: number): Channel[] {
  const channels: Channel[] = [];
  const roots = [0.12, 0.32, 0.52, 0.72, 0.88];

  roots.forEach((rx, ri) => {
    const pts: { x: number; y: number }[] = [];
    let x = w * rx;
    let y = 0;
    while (y < h + 10) {
      pts.push({ x, y });
      // Drift left/right organically
      x += (Math.random() - 0.5) * 22;
      x = Math.max(0, Math.min(w, x));
      y += 14 + Math.random() * 8;
    }
    channels.push({
      pts,
      fill: 0,
      speed: 0.003 + Math.random() * 0.004,
      width: 2 + Math.random() * 4,
      color: ri % 2 === 0 ? "255,107,0" : "255,154,0",
    });
  });

  return channels;
}

export default function LavaFlow({ height = 120 }: { height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);

    let channels = buildChannels(canvas.width, canvas.height);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      channels.forEach((ch) => {
        ch.fill = Math.min(1, ch.fill + ch.speed);

        const visiblePts = Math.floor(ch.pts.length * ch.fill);
        if (visiblePts < 2) return;

        // Draw the path
        ctx.beginPath();
        ctx.moveTo(ch.pts[0].x, ch.pts[0].y);
        for (let i = 1; i < visiblePts; i++) {
          const p = ch.pts[i];
          const pp = ch.pts[i - 1];
          const mx = (p.x + pp.x) / 2;
          const my = (p.y + pp.y) / 2;
          ctx.quadraticCurveTo(pp.x, pp.y, mx, my);
        }

        // Glow layer
        ctx.lineWidth = ch.width + 6;
        ctx.strokeStyle = `rgba(${ch.color},0.06)`;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

        // Core line
        ctx.lineWidth = ch.width;
        ctx.strokeStyle = `rgba(${ch.color},0.55)`;
        ctx.stroke();

        // Bright center
        ctx.lineWidth = ch.width * 0.35;
        ctx.strokeStyle = `rgba(255,220,80,0.35)`;
        ctx.stroke();

        // Drop at tip
        if (visiblePts >= 2) {
          const tip = ch.pts[visiblePts - 1];
          const r = ch.width * 1.4;
          const g = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, r * 2.5);
          g.addColorStop(0, `rgba(255,220,80,0.55)`);
          g.addColorStop(0.5, `rgba(${ch.color},0.3)`);
          g.addColorStop(1, `rgba(${ch.color},0)`);
          ctx.beginPath();
          ctx.arc(tip.x, tip.y, r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }

        // Restart filled channels
        if (ch.fill >= 1) {
          ch.fill = 0;
          ch.pts = buildChannels(canvas.width, canvas.height)[0].pts;
          ch.pts[0].x = ch.pts[0].x * 0.6 + Math.random() * canvas.width * 0.4;
        }
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", setSize);
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      {/* Dark base */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, rgba(3,2,1,0) 0%, rgba(8,5,2,0.6) 50%, rgba(3,2,1,0) 100%)"
      }} />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: "block" }}
      />
      {/* Fade edges */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to bottom, rgba(3,2,1,0.9) 0%, transparent 30%, transparent 70%, rgba(3,2,1,0.9) 100%)"
      }} />
    </div>
  );
}
