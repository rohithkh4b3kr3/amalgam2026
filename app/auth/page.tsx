"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, Flame, ArrowRight } from "lucide-react";
import ForgeBackground from "@/components/ForgeBackground";
import ParticleField from "@/components/ParticleField";

type Mode = "login" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode]       = useState<Mode>("login");
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [form, setForm]       = useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const body = mode === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };
      const res  = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong"); return; }
      router.push("/dashboard");
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-24" style={{ background: "#FFFFFF" }}>
      <ForgeBackground intensity={0.8} />
      <ParticleField count={60} />

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }} className="relative z-10 w-full max-w-md">
        <div className="steel-card rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 0 80px rgba(255,100,0,0.12), 0 20px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,184,0,0.08)" }}>
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-[rgba(255,184,0,0.12)]">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "linear-gradient(135deg, #CC5500, #FFB800)", boxShadow: "0 0 30px rgba(255,120,0,0.5)" }}>
              <Flame className="w-7 h-7 text-white fill-white" />
            </div>
            <h1 className="font-display font-black text-2xl text-metallic mb-1">AMALGAM</h1>
            <p className="text-[rgba(100,55,15,0.7)] text-sm">IIT Madras · MME Department</p>
          </div>

          {/* Tabs */}
          <div className="flex" style={{ background: "rgba(255,184,0,0.04)" }}>
            {(["login","signup"] as Mode[]).map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 py-3.5 text-sm font-bold tracking-wider capitalize transition-all duration-300 font-display ${
                  mode === m ? "text-[#CC4400] border-b-2 border-[#FF6B00]" : "text-[rgba(100,55,15,0.6)] hover:text-[#CC4400]"
                }`}>
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <AnimatePresence mode="wait">
              <motion.form key={mode}
                initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
                transition={{ duration: 0.25 }} onSubmit={handleSubmit} className="flex flex-col gap-4">

                {mode === "signup" && (
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#573300]" />
                    <input type="text" name="name" value={form.name} onChange={handleChange}
                      placeholder="Full Name" required className="input-steel w-full pl-10 pr-4 py-3 rounded-xl text-sm" />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#573300]" />
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="Email address" required className="input-steel w-full pl-10 pr-4 py-3 rounded-xl text-sm" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#573300]" />
                  <input type={showPw ? "text" : "password"} name="password" value={form.password}
                    onChange={handleChange} placeholder="Password" required minLength={8}
                    className="input-steel w-full pl-10 pr-10 py-3 rounded-xl text-sm" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#573300] hover:text-[#A87838] transition-colors">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                    className="text-[#FF8844] text-xs rounded-xl px-3 py-2 border border-[rgba(255,85,0,0.3)]"
                    style={{ background: "rgba(255,85,0,0.1)" }}>
                    {error}
                  </motion.p>
                )}

                <button type="submit" disabled={loading}
                  className="btn-glow btn-electric w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading
                    ? <span className="w-4 h-4 border-2 border-[rgba(3,1,0,0.3)] border-t-[#030100] rounded-full animate-spin" />
                    : <>{mode === "login" ? "Sign In" : "Create Account"}<ArrowRight className="w-4 h-4" /></>
                  }
                </button>

                <p className="text-center text-xs text-[#573300]">
                  {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                  <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
                    className="text-[#D42000] hover:text-[#FF3D00] transition-colors font-medium">
                    {mode === "login" ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              </motion.form>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
