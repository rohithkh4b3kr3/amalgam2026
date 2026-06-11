"use client";
import { motion } from "framer-motion";

export default function CrystalLattice({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-64 h-64 perspective-1000 ${className}`}>
      <motion.div
        className="w-full h-full absolute preserve-3d"
        animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {/* Core node — warm amber */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full"
          style={{ background: "rgba(255,154,0,0.85)", transform: "translateZ(0px)", boxShadow: "0 0 18px rgba(255,154,0,0.5)" }} />

        {/* Front face nodes — orange */}
        {[["top-0 left-0"], ["top-0 right-0"], ["bottom-0 left-0"], ["bottom-0 right-0"]].map((cls, i) => (
          <div key={`f${i}`} className={`absolute ${cls[0]} w-4 h-4 rounded-full`}
            style={{ background: "rgba(255,107,0,0.8)", transform: "translateZ(100px)" }} />
        ))}

        {/* Back face nodes — amber */}
        {[["top-0 left-0"], ["top-0 right-0"], ["bottom-0 left-0"], ["bottom-0 right-0"]].map((cls, i) => (
          <div key={`b${i}`} className={`absolute ${cls[0]} w-4 h-4 rounded-full`}
            style={{ background: "rgba(255,184,0,0.75)", transform: "translateZ(-100px)" }} />
        ))}

        {/* Lattice ring planes */}
        <div className="absolute inset-0 rounded-full"
          style={{ border: "1px solid rgba(255,107,0,0.25)", transform: "rotateX(60deg) translateZ(0px)" }} />
        <div className="absolute inset-0 rounded-full"
          style={{ border: "1px solid rgba(255,154,0,0.2)", transform: "rotateY(60deg) translateZ(0px)" }} />
        <div className="absolute inset-0 rounded-full"
          style={{ border: "1px solid rgba(200,130,40,0.18)", transform: "rotateZ(45deg) translateZ(0px)" }} />
      </motion.div>
    </div>
  );
}
