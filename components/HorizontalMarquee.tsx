"use client";

const TOPICS = [
  "X-Ray Diffraction",
  "Alloy Design",
  "Phase Diagrams",
  "SEM Analysis",
  "DFT Simulation",
  "3D Printing",
  "Nanomaterials",
  "Heat Treatment",
  "Crystal Lattice",
  "Composite Materials",
  "Fracture Mechanics",
  "Corrosion Science",
];

export default function HorizontalMarquee() {
  const items = [...TOPICS, ...TOPICS]; // double for seamless loop
  return (
    <div className="relative overflow-hidden border-y border-[rgba(255,107,0,0.1)] bg-[rgba(5,3,1,0.8)] py-4 select-none">
      {/* left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #020100, transparent)" }} />
      {/* right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #020100, transparent)" }} />

      <div className="marquee-track flex gap-10 w-max">
        {items.map((topic, i) => (
          <span
            key={i}
            className="flex items-center gap-3 shrink-0 font-display text-xs tracking-[0.22em] uppercase font-bold"
            style={{ color: i % 3 === 0 ? "#FF9A00" : i % 3 === 1 ? "#FFB800" : "rgba(200,170,120,0.6)" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: i % 3 === 0 ? "#FF6B00" : i % 3 === 1 ? "#FFB800" : "rgba(180,120,50,0.5)" }}
            />
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
}
