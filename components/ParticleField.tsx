"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  r: number; g: number; b: number;
  type: "drift" | "ember";
  life: number;
  maxLife: number;
}

function randomColor(): [number, number, number] {
  const palette: [number, number, number][] = [
    [255, 107,   0], // forge orange
    [255, 154,   0], // amber
    [255, 184,   0], // warm yellow
    [204,  68,   0], // deep red-orange
    [255,  80,   0], // ember red
  ];
  return palette[Math.floor(Math.random() * palette.length)];
}

export default function ParticleField({ count = 80 }: { count?: number }) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const animRef    = useRef<number>(0);
  const psRef      = useRef<Particle[]>([]);
  const frameRef   = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnParticle = (type: "drift" | "ember"): Particle => {
      const [r, g, b] = randomColor();
      if (type === "ember") {
        return {
          x: Math.random() * canvas.width,
          y: canvas.height + 10,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -(1.5 + Math.random() * 2.5),
          radius: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          r, g, b,
          type: "ember",
          life: 0,
          maxLife: 120 + Math.random() * 100,
        };
      }
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.6 + 0.1,
        r, g, b,
        type: "drift",
        life: 0,
        maxLife: Infinity,
      };
    };

    /* Init drift particles */
    const driftCount  = Math.floor(count * 0.7);
    const emberCount  = Math.floor(count * 0.3);
    psRef.current = [
      ...Array.from({ length: driftCount }, () => spawnParticle("drift")),
      ...Array.from({ length: emberCount },  () => spawnParticle("ember")),
    ];

    const CONNECTION_DIST = 110;

    const draw = () => {
      frameRef.current++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const ps = psRef.current;

      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        p.life++;

        if (p.type === "ember") {
          p.x  += p.vx + Math.sin(p.life * 0.05) * 0.5;
          p.y  += p.vy;
          p.vy += 0.01; // slight deceleration
          const lifeRatio = p.life / p.maxLife;
          p.opacity = lifeRatio < 0.1 ? lifeRatio * 8
                    : lifeRatio > 0.7 ? (1 - lifeRatio) / 0.3
                    : 0.9;
          if (p.life >= p.maxLife || p.y < -20) {
            ps[i] = spawnParticle("ember");
            continue;
          }
        } else {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;
        }

        /* Draw glow */
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
        grd.addColorStop(0, `rgba(${p.r},${p.g},${p.b},${p.opacity})`);
        grd.addColorStop(1, `rgba(${p.r},${p.g},${p.b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        /* Core dot */
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${Math.min(p.opacity * 1.5, 1)})`;
        ctx.fill();

        /* Connections (only drift particles) */
        if (p.type === "drift") {
          for (let j = i + 1; j < ps.length; j++) {
            if (ps[j].type !== "drift") continue;
            const q = ps[j];
            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < CONNECTION_DIST) {
              const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = `rgba(255,107,0,${alpha})`;
              ctx.lineWidth = 0.4;
              ctx.stroke();
            }
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.65 }}
    />
  );
}
