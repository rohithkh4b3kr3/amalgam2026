"use client";

export default function ForgeBackground({ intensity = 1, showAnvil = false }: {
  intensity?: number;
  showAnvil?: boolean;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ opacity: intensity }}>
      {/* Subtle diagonal texture */}
      <div className="absolute inset-0 pointer-events-none forge-hatch" style={{ opacity: 0.6 }} />
      {/* Subtle orange ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[600px] h-[400px] rounded-full"
          style={{ top: "-10%", left: "30%", background: "radial-gradient(circle, rgba(255,107,0,0.07) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute w-[400px] h-[300px] rounded-full"
          style={{ bottom: "0", left: "5%", background: "radial-gradient(circle, rgba(204,68,0,0.05) 0%, transparent 70%)", filter: "blur(70px)" }} />
      </div>
    </div>
  );
}
