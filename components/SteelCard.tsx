"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

interface SteelCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "electric" | "molten" | "gold" | "none";
  delay?: number;
  tilt?: boolean;
}

const GLOW_STYLES = {
  electric: "hover:border-[rgba(255,184,0,0.4)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)]",
  molten:   "hover:border-[rgba(255,107,0,0.4)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)]",
  gold:     "hover:border-[rgba(200,160,60,0.4)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)]",
  none:     "",
};

function TiltWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springX = useSpring(rawX, { stiffness: 200, damping: 25 });
  const springY = useSpring(rawY, { stiffness: 200, damping: 25 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);

  /* Moving highlight position */
  const glowX = useTransform(springX, [-0.5, 0.5], [0, 100]);
  const glowY = useTransform(springY, [-0.5, 0.5], [0, 100]);
  const glowOpacity = useSpring(0, { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    glowOpacity.set(1);
  };

  const handleLeave = () => {
    rawX.set(0);
    rawY.set(0);
    glowOpacity.set(0);
  };

  const background = useTransform(
    [glowX, glowY],
    ([gx, gy]: number[]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,184,0,0.18) 0%, rgba(255,100,0,0.08) 40%, transparent 70%)`
  );

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: "preserve-3d" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative ${className}`}
    >
      {/* Dynamic highlight overlay */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none z-20"
        style={{ background, opacity: glowOpacity }}
      />
      {children}
    </motion.div>
  );
}

export default function SteelCard({
  children,
  className = "",
  hover = true,
  glow = "electric",
  delay = 0,
  tilt = true,
}: SteelCardProps) {
  const card = (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`steel-card rounded-xl ${hover ? `steel-card-hover ${GLOW_STYLES[glow]}` : ""} ${!tilt ? className : ""}`}
    >
      {children}
    </motion.div>
  );

  if (tilt && hover) {
    return <TiltWrapper className={className}>{card}</TiltWrapper>;
  }

  return className && !tilt ? card : <div className={className}>{card}</div>;
}
