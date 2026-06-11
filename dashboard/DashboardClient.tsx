"use client";
import { motion } from "framer-motion";
import { LayoutDashboard, Ticket, Calendar, MapPin, Copy, LogOut, Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { type Event, CATEGORY_COLORS } from "@/lib/data";
import SteelCard from "@/components/SteelCard";
import ParticleField from "@/components/ParticleField";

interface Registration {
  trackingId: string;
  createdAt: string;
  events: Event[];
}

interface Props {
  user: { name: string | null; email: string };
  registrations: Registration[];
}

function TrackingIdBadge({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex items-center gap-2">
      <code className="font-display text-xs text-electric-bright bg-steel-800 px-3 py-1.5 rounded-lg border border-electric/25 tracking-wider truncate max-w-[160px]">
        {id}
      </code>
      <button onClick={copy} className="text-steel-400 hover:text-electric-bright transition-colors">
        <Copy className="w-3.5 h-3.5" />
      </button>
      {copied && <span className="text-xs text-electric-bright">Copied!</span>}
    </div>
  );
}

export default function DashboardClient({ user, registrations }: Props) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const totalEvents = registrations.reduce((sum, r) => sum + r.events.length, 0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative pt-28 pb-14 hero-bg overflow-hidden">
        <ParticleField count={30} />
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <span className="badge-electric tag-pill inline-flex items-center gap-1 mb-3">
                <LayoutDashboard className="w-3 h-3" /> Dashboard
              </span>
              <h1 className="font-display font-black text-3xl md:text-4xl text-metallic mb-1">
                {user.name ? `Welcome, ${user.name}` : "My Dashboard"}
              </h1>
              <p className="text-steel-400 text-sm">{user.email}</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/register"
                className="btn-glow btn-electric flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                Register More
              </Link>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="btn-glow btn-outline-steel flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60"
              >
                <LogOut className="w-4 h-4" />
                {loggingOut ? "Signing out…" : "Sign Out"}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="divider-electric" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: "Registrations",    value: registrations.length, color: "text-electric-bright" },
            { label: "Total Events",     value: totalEvents,           color: "text-gold-bright" },
            { label: "Upcoming Days",    value: 3,                     color: "text-molten-bright" },
          ].map((s, i) => (
            <SteelCard key={s.label} delay={i * 0.08} hover={false} glow="electric">
              <div className="p-5 text-center">
                <p className={`font-display font-black text-4xl ${s.color} mb-1`}>{s.value}</p>
                <p className="text-xs text-steel-400 tracking-wide">{s.label}</p>
              </div>
            </SteelCard>
          ))}
        </div>

        {/* Registrations */}
        {registrations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="steel-card rounded-xl p-12 text-center"
          >
            <Ticket className="w-12 h-12 text-steel-600 mx-auto mb-4" strokeWidth={1.5} />
            <p className="text-steel-300 text-lg font-semibold mb-2">No registrations yet</p>
            <p className="text-steel-500 text-sm mb-6">
              You haven&apos;t registered for any events. Start exploring!
            </p>
            <Link
              href="/register"
              className="btn-glow btn-electric inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm"
            >
              Browse Events
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-6">
            <h2 className="font-display font-bold text-sm tracking-[0.2em] uppercase text-chrome">
              Your Registrations
            </h2>
            {registrations.map((reg, ri) => {
              const date = new Date(reg.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
                timeZone: "Asia/Kolkata",
              });
              return (
                <SteelCard key={reg.trackingId} delay={ri * 0.1} glow="electric">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                      <div>
                        <p className="text-xs text-steel-500 mb-1">Tracking ID</p>
                        <TrackingIdBadge id={reg.trackingId} />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-steel-500 mb-1">Registered on</p>
                        <p className="text-xs text-steel-300">{date}</p>
                      </div>
                    </div>

                    <div className="divider-electric mb-5" />

                    <div className="flex flex-col gap-3">
                      <p className="text-xs font-bold tracking-[0.15em] uppercase text-steel-500 mb-1">
                        {reg.events.length} Event{reg.events.length !== 1 ? "s" : ""}
                      </p>
                      {reg.events.map((ev) => {
                        const colors = CATEGORY_COLORS[ev.category];
                        return (
                          <div
                            key={ev.id}
                            className="flex items-start gap-3 bg-steel-800/40 rounded-lg px-4 py-3 border border-steel-700/30"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-display font-bold text-xs text-steel-100">
                                  Day {ev.day}
                                </span>
                                <span className={`tag-pill ${colors.bg} ${colors.text} border ${colors.border}`}>
                                  {ev.category}
                                </span>
                              </div>
                              <p className="text-sm text-steel-200 font-semibold leading-snug mb-1">
                                {ev.title}
                              </p>
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
                </SteelCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
