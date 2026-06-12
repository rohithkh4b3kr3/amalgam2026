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
    <div className="relative overflow-hidden border-y border-[rgba(255,107,0,0.15)] bg-[rgba(255,248,242,0.97)] py-4 select-none">
      {/* left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, rgba(255,248,242,1), transparent)" }} />
      {/* right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, rgba(255,248,242,1), transparent)" }} />

      <div className="marquee-track flex gap-10 w-max">
        {items.map((topic, i) => (
          <span
            key={i}
            className="flex items-center gap-3 shrink-0 font-display text-xs tracking-[0.22em] uppercase font-bold"
            style={{ color: i % 3 === 0 ? "#CC4400" : i % 3 === 1 ? "#FF6B00" : "rgba(180,80,20,0.65)" }}
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
