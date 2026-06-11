"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CheckSquare, Square, Zap, Lock, ArrowRight } from "lucide-react";
import { EVENTS, CATEGORY_COLORS } from "@/lib/data";
import ParticleField from "@/components/ParticleField";
import SteelCard from "@/components/SteelCard";
import Link from "next/link";

const DAY_LABELS = { 1: "Day 1 — Aug 14", 2: "Day 2 — Aug 15", 3: "Day 3 — Aug 16" } as const;

export default function RegisterPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setUser(d.user);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (selected.size === 0) {
      setError("Please select at least one event.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventIds: Array.from(selected) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed.");
        return;
      }
      router.push(`/confirmation/${data.trackingId}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-electric/30 border-t-electric rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center px-4">
        <ParticleField count={40} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 steel-card rounded-2xl p-10 text-center max-w-sm shadow-[0_0_60px_rgba(0,200,255,0.08)]"
        >
          <Lock className="w-12 h-12 text-electric mx-auto mb-4" strokeWidth={1.5} />
          <h2 className="font-display font-black text-xl text-metallic mb-2">Login Required</h2>
          <p className="text-steel-400 text-sm mb-6">
            You need to be signed in to register for AMALGAM events.
          </p>
          <Link
            href="/auth"
            className="btn-glow btn-electric w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2"
          >
            Sign In <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative pt-28 pb-14 hero-bg overflow-hidden">
        <ParticleField count={35} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge-electric tag-pill inline-flex items-center gap-1 mb-4">
              <Zap className="w-3 h-3" /> Event Registration
            </span>
            <h1 className="font-display font-black text-4xl md:text-5xl text-metallic mb-2">
              Register for Events
            </h1>
            <p className="text-steel-400 text-sm">
              Welcome, <span className="text-electric-bright font-semibold">{user.name || user.email}</span>.
              Select the events you want to attend.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="divider-electric" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 flex flex-col lg:flex-row gap-8">
        {/* Events list */}
        <div className="flex-1 flex flex-col gap-8">
          {([1, 2, 3] as const).map((day) => {
            const dayEvents = EVENTS.filter((e) => e.day === day);
            return (
              <div key={day}>
                <h2 className="font-display font-bold text-sm tracking-[0.2em] uppercase text-chrome mb-4">
                  {DAY_LABELS[day]}
                </h2>
                <div className="flex flex-col gap-3">
                  {dayEvents.map((event, i) => {
                    const isSelected = selected.has(event.id);
                    const colors = CATEGORY_COLORS[event.category];
                    return (
                      <SteelCard key={event.id} delay={i * 0.04} hover={false}>
                        <label className="flex items-start gap-4 p-4 cursor-pointer group">
                          <div className="mt-0.5 shrink-0">
                            {isSelected ? (
                              <CheckSquare className="w-5 h-5 text-electric" />
                            ) : (
                              <Square className="w-5 h-5 text-steel-500 group-hover:text-steel-300 transition-colors" />
                            )}
                          </div>
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={isSelected}
                            onChange={() => toggle(event.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-display font-bold text-sm text-steel-50">
                                {event.title}
                              </span>
                              <span className={`tag-pill ${colors.bg} ${colors.text} border ${colors.border}`}>
                                {event.category}
                              </span>
                            </div>
                            <p className="text-xs text-steel-500">
                              {event.time} – {event.endTime} · {event.venue}
                            </p>
                          </div>
                        </label>
                      </SteelCard>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky summary */}
        <div className="lg:w-72 shrink-0">
          <div className="sticky top-24">
            <SteelCard hover={false} glow="electric">
              <div className="p-6 flex flex-col gap-4">
                <h3 className="font-display font-bold text-sm tracking-wider text-chrome">
                  Registration Summary
                </h3>

                {selected.size === 0 ? (
                  <p className="text-steel-500 text-xs text-center py-4">
                    No events selected yet.
                    <br />Select events from the list.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                    {Array.from(selected).map((id) => {
                      const ev = EVENTS.find((e) => e.id === id);
                      if (!ev) return null;
                      return (
                        <li key={id} className="flex items-start gap-2 text-xs">
                          <CheckSquare className="w-3.5 h-3.5 text-electric mt-0.5 shrink-0" />
                          <span className="text-steel-300 leading-snug">{ev.title}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <div className="border-t border-steel-700/40 pt-3">
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-steel-400">Selected events</span>
                    <span className="font-bold text-electric-bright">{selected.size}</span>
                  </div>

                  {error && (
                    <p className="text-molten text-xs bg-molten/10 border border-molten/30 rounded-lg px-3 py-2 mb-3">
                      {error}
                    </p>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={submitting || selected.size === 0}
                    className="btn-glow btn-electric w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Confirm Registration
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </SteelCard>
          </div>
        </div>
      </div>
    </div>
  );
}
