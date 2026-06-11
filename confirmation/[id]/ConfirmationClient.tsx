"use client";
import { motion } from "framer-motion";
import { CheckCircle, Copy, LayoutDashboard, Calendar, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { type Event, CATEGORY_COLORS } from "@/lib/data";
import ParticleField from "@/components/ParticleField";
import SteelCard from "@/components/SteelCard";

const DAY_LABELS = { 1: "Aug 14", 2: "Aug 15", 3: "Aug 16" } as const;

interface Props {
  trackingId: string;
  userName: string;
  userEmail: string;
  chosenEvents: Event[];
  createdAt: string;
}

export default function ConfirmationClient({
  trackingId,
  userName,
  userEmail,
  chosenEvents,
  createdAt,
}: Props) {
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const date = new Date(createdAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  const grouped = [1, 2, 3].map((d) => ({
    day: d as 1 | 2 | 3,
    events: chosenEvents.filter((e) => e.day === d),
  })).filter((g) => g.events.length > 0);

  return (
    <div className="min-h-screen hero-bg relative overflow-hidden pt-24 pb-16 px-4">
      <ParticleField count={40} />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Success badge */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", damping: 15 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-electric to-electric-dark flex items-center justify-center shadow-[0_0_60px_rgba(0,200,255,0.5)]">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-full border-2 border-electric"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="font-display font-black text-3xl md:text-4xl text-metallic mb-2">
            Registration Confirmed!
          </h1>
          <p className="text-steel-300">
            Welcome to AMALGAM 2026, <span className="text-electric-bright font-semibold">{userName}</span>!
          </p>
          <p className="text-steel-500 text-sm mt-1">Registered on {date}</p>
        </motion.div>

        {/* Tracking ID card */}
        <SteelCard delay={0.4} glow="electric" hover={false}>
          <div className="p-6 text-center">
            <p className="text-xs tracking-[0.2em] uppercase text-steel-400 mb-3 font-medium">
              Your Registration Tracking ID
            </p>
            <div className="flex items-center justify-center gap-3">
              <code className="font-display font-bold text-lg text-electric-bright bg-steel-800/80 px-4 py-2 rounded-lg border border-electric/30 tracking-wider">
                {trackingId}
              </code>
              <button
                onClick={copyId}
                className="btn-glow btn-outline-steel p-2.5 rounded-lg transition-all"
                title="Copy ID"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-electric-bright mt-2"
              >
                Copied to clipboard!
              </motion.p>
            )}
            <p className="text-xs text-steel-500 mt-3">
              Save this ID — you can use it to view your registrations on your dashboard.
            </p>
          </div>
        </SteelCard>

        {/* Summary */}
        <div className="mt-6 flex flex-col gap-4">
          <h2 className="font-display font-bold text-sm tracking-[0.2em] uppercase text-chrome">
            Registered Events ({chosenEvents.length})
          </h2>

          {grouped.map(({ day, events }) => (
            <div key={day}>
              <p className="text-xs text-steel-500 tracking-wide mb-2">
                Day {day} · {["Aug 14", "Aug 15", "Aug 16"][day - 1]}
              </p>
              <div className="flex flex-col gap-2">
                {events.map((ev) => {
                  const colors = CATEGORY_COLORS[ev.category];
                  return (
                    <div
                      key={ev.id}
                      className="steel-card rounded-lg p-3.5 flex items-start gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-display font-bold text-sm text-steel-100">
                            {ev.title}
                          </span>
                          <span className={`tag-pill ${colors.bg} ${colors.text} border ${colors.border}`}>
                            {ev.category}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-steel-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-electric" />
                            {ev.time} – {ev.endTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-molten" />
                            {ev.venue}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-8 flex-wrap">
          <Link
            href="/dashboard"
            className="btn-glow btn-electric flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm flex-1 justify-center"
          >
            <LayoutDashboard className="w-4 h-4" />
            My Dashboard
          </Link>
          <Link
            href="/schedule"
            className="btn-glow btn-outline-steel flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm flex-1 justify-center"
          >
            View Full Schedule
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
