"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const FORMULAS = [
  "=HOOKES(E, ε)",
  "=GIBBS(ΔH, T, ΔS)",
  "=DIFF(D0, Q, R, T)",
  "=BRAGG(n, λ, d)",
  "=HALL_PETCH(σ_0, k_y, d)",
  "=FICK_1(-D, dc_dx)",
  "=TOUGHNESS(Y, σ, a)",
  "=PHASE_RULE(C, P)",
  "=LEVER(C_S, C_0, C_L)",
  "=SIEVERTS(K, p_gas)",
  "=GRIFFITH(E, γ, a)",
  "=NUCLEATION(I0, ΔG, Q)",
];

const CELL_COUNT  = 6000;
const ROW_H       = 32;
const COL_MIN     = 80;
const GAP         = 1;
const TRAIL_SIZE  = 20;    // simultaneous lit cells
const LINGER_MS   = 1500;  // time before fade begins
const FADE_MS     = 500;   // fade-out duration

const CELLS = Array.from({ length: CELL_COUNT }, (_, i) => i);

export default function FormulaGridBg() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const trailRefs    = useRef<(HTMLDivElement | null)[]>(Array(TRAIL_SIZE).fill(null));
  const trailTimers  = useRef<(ReturnType<typeof setTimeout> | null)[]>(Array(TRAIL_SIZE).fill(null));
  const slotIdx      = useRef(0);
  const lastCell     = useRef(-1);

  useEffect(() => {
    setMounted(true);
    return () => { trailTimers.current.forEach(t => { if (t) clearTimeout(t); }); };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const cell = (e.target as HTMLElement).closest<HTMLElement>("[data-idx]");
    if (!cell) return;

    const idx = parseInt(cell.dataset.idx!, 10);
    if (idx === lastCell.current) return; // same cell — skip
    lastCell.current = idx;

    const cRect   = container.getBoundingClientRect();
    const sRect   = cell.getBoundingClientRect();
    const formula = FORMULAS[idx % FORMULAS.length];

    // Round-robin slot from the trail pool
    const slot    = slotIdx.current % TRAIL_SIZE;
    slotIdx.current++;

    const overlay = trailRefs.current[slot];
    if (!overlay) return;

    // Cancel any existing fade for this slot
    if (trailTimers.current[slot]) {
      clearTimeout(trailTimers.current[slot]!);
      trailTimers.current[slot] = null;
    }

    // Snap to cell — instant, no transition
    const span = overlay.querySelector("span");
    if (span) span.textContent = formula;
    overlay.style.transition = "none";
    overlay.style.left     = `${sRect.left - cRect.left}px`;
    overlay.style.top      = `${sRect.top  - cRect.top}px`;
    overlay.style.minWidth = `${sRect.width}px`;
    overlay.style.width    = "max-content"; // expand to show full formula
    overlay.style.opacity  = "1";

    // Linger then fade out
    trailTimers.current[slot] = setTimeout(() => {
      overlay.style.transition = `opacity ${FADE_MS}ms ease`;
      overlay.style.opacity    = "0";
    }, LINGER_MS);
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${COL_MIN}px, 1fr))`,
        gridAutoRows: `${ROW_H}px`,
        gap: `${GAP}px`,
        background: "rgba(255,107,0,0.15)",
      }}
      onMouseMove={onMouseMove}
    >
      {CELLS.map((i) => (
        <div key={i} data-idx={i} className="bg-[rgba(2,1,0,0.22)]" />
      ))}

      {/* Trail pool — 20 slots cycling round-robin, each fades independently */}
      {Array.from({ length: TRAIL_SIZE }, (_, i) => (
        <div
          key={`trail-${i}`}
          ref={el => { trailRefs.current[i] = el; }}
          className="absolute top-0 left-0 pointer-events-none z-10 flex items-center"
          style={{
            height: ROW_H,
            minWidth: COL_MIN,
            width: "max-content",
            opacity: 0,
            background: "#0A0600",
            boxShadow: "inset 0 0 0 1px #FF9A00",
          }}
        >
          <span className="font-mono text-[10px] text-[#FF9A00] whitespace-nowrap select-none tracking-tight px-1.5" />
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-[#FFB800]" />
        </div>
      ))}
    </div>
  );
}
