"use client";
import { useEffect, useState, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FEST_DATE } from "@/lib/data";

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number; }

function pad(n: number) { return String(n).padStart(2, "0"); }

function Digit({ value, label, prev }: { value: string; label: string; prev: string }) {
  const changed = value !== prev;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="countdown-digit rounded-xl px-4 py-3 md:px-6 md:py-4 min-w-[76px] md:min-w-[96px] text-center relative overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={changed ? { y: -36, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 36, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="text-3xl md:text-5xl font-black tracking-wider block"
            style={{ color: "#D42000", fontFamily: "var(--font-orbitron)", display: "block" }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[10px] md:text-xs text-[#7a3a0a] tracking-[0.22em] uppercase font-medium font-display">
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [prev,     setPrev]     = useState<TimeLeft | null>(null);
  const [ready,    setReady]    = useState(false);

  useEffect(() => {
    const calc = () => {
      const diff = FEST_DATE.getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000)  / 60000),
        seconds: Math.floor((diff % 60000)    / 1000),
      };
    };
    const first = calc();
    setTimeLeft(first);
    setPrev(first);
    setReady(true);
    const id = setInterval(() => {
      setPrev((p) => p);
      setTimeLeft(calc());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const BLANKS = ["--", "--", "--", "--"];
  const vals   = ready && timeLeft
    ? [String(timeLeft.days), pad(timeLeft.hours), pad(timeLeft.minutes), pad(timeLeft.seconds)]
    : BLANKS;
  const pvs    = ready && prev
    ? [String(prev.days), pad(prev.hours), pad(prev.minutes), pad(prev.seconds)]
    : BLANKS;
  const LABELS = ["Days", "Hours", "Mins", "Secs"];

  return (
    <div className="flex gap-3 md:gap-5 justify-center lg:justify-start items-end">
      {vals.map((v, i) => (
        <Fragment key={LABELS[i]}>
          <Digit value={v} label={LABELS[i]} prev={pvs[i]} />
          {i < 3 && (
            <span className="text-[rgba(255,107,0,0.45)] text-3xl md:text-4xl font-black mb-9 font-display">
              :
            </span>
          )}
        </Fragment>
      ))}
    </div>
  );
}
