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
        {/* Core node */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full"
          style={{ background: "#D42000", transform: "translateZ(0px)" }} />

        {/* Front face nodes */}
        {[["top-0 left-0"], ["top-0 right-0"], ["bottom-0 left-0"], ["bottom-0 right-0"]].map((cls, i) => (
          <div key={`f${i}`} className={`absolute ${cls[0]} w-3.5 h-3.5 rounded-full`}
            style={{ background: "#CC2200", transform: "translateZ(100px)" }} />
        ))}

        {/* Back face nodes */}
        {[["top-0 left-0"], ["top-0 right-0"], ["bottom-0 left-0"], ["bottom-0 right-0"]].map((cls, i) => (
          <div key={`b${i}`} className={`absolute ${cls[0]} w-3.5 h-3.5 rounded-full`}
            style={{ background: "#991500", transform: "translateZ(-100px)" }} />
        ))}

        {/* Lattice ring planes */}
        <div className="absolute inset-0 rounded-full"
          style={{ border: "1.5px solid rgba(180,20,0,0.55)", transform: "rotateX(60deg) translateZ(0px)" }} />
        <div className="absolute inset-0 rounded-full"
          style={{ border: "1.5px solid rgba(160,15,0,0.45)", transform: "rotateY(60deg) translateZ(0px)" }} />
        <div className="absolute inset-0 rounded-full"
          style={{ border: "1px solid rgba(140,10,0,0.35)", transform: "rotateZ(45deg) translateZ(0px)" }} />
      </motion.div>
    </div>
  );
}
