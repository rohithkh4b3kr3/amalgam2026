"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const elements = [
  { symbol: "Fe", name: "Iron", num: 26, category: "transition-metal", delay: 0 },
  { symbol: "C", name: "Carbon", num: 6, category: "nonmetal", delay: 0.1 },
  { symbol: "Ti", name: "Titanium", num: 22, category: "transition-metal", delay: 0.2 },
  { symbol: "Al", name: "Aluminum", num: 13, category: "post-transition-metal", delay: 0.3 },
  { symbol: "Ni", name: "Nickel", num: 28, category: "transition-metal", delay: 0.4 },
  { symbol: "Cu", name: "Copper", num: 29, category: "transition-metal", delay: 0.5 },
  { symbol: "Zn", name: "Zinc", num: 30, category: "transition-metal", delay: 0.6 },
  { symbol: "Ag", name: "Silver", num: 47, category: "transition-metal", delay: 0.7 },
  { symbol: "Au", name: "Gold", num: 79, category: "transition-metal", delay: 0.8 },
  { symbol: "Pt", name: "Platinum", num: 78, category: "transition-metal", delay: 0.9 },
  { symbol: "W", name: "Tungsten", num: 74, category: "transition-metal", delay: 1.0 },
  { symbol: "Mg", name: "Magnesium", num: 12, category: "alkaline-earth", delay: 1.1 },
];

export default function PeriodicTableGrid() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 perspective-1000">
      <motion.div
        className="grid grid-cols-4 md:grid-cols-6 gap-4 md:gap-8 preserve-3d"
        animate={{
          rotateX: [10, -10, 10],
          rotateY: [-15, 15, -15],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      >
        {elements.map((el) => (
          <motion.div
            key={el.symbol}
            className="w-16 h-16 md:w-24 md:h-24 cyber-card flex flex-col items-center justify-center border border-[rgba(0,240,255,0.2)] bg-[rgba(11,11,20,0.4)] backdrop-blur-sm pointer-events-auto cursor-pointer relative"
            initial={{ opacity: 0, scale: 0, z: -500 }}
            animate={{ opacity: 1, scale: 1, z: 0 }}
            transition={{
              duration: 1,
              delay: el.delay,
              type: "spring",
              bounce: 0.4,
            }}
            whileHover={{
              scale: 1.2,
              z: 50,
              boxShadow: "0 0 30px rgba(0,240,255,0.8)",
              borderColor: "rgba(0,240,255,1)",
            }}
          >
            <div className="absolute top-1 left-2 text-[8px] md:text-xs text-[rgba(0,240,255,0.7)] font-display">
              {el.num}
            </div>
            <div className="font-display font-bold text-xl md:text-3xl text-white-bright text-neon-glow">
              {el.symbol}
            </div>
            <div className="absolute bottom-1 text-[8px] md:text-[10px] text-[rgba(224,231,255,0.7)] uppercase tracking-wider text-center w-full">
              {el.name}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
