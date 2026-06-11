"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { motion, Variants } from "framer-motion";

const NAV_LINKS = [
  { href: "/",             label: "Home"         },
  { href: "/schedule",     label: "Timeline"     },
  { href: "/speakers",     label: "Speakers"     },
  { href: "/workshops",    label: "Workshops"    },
  { href: "/competitions", label: "Competitions" },
  { href: "/register",     label: "Register"     },
];

/* ── Motion variants (exact Avishkar pattern) ─────────────── */
const menuVariants: Variants = {
  open: {
    opacity: 1,
    scale: 1,
    display: "flex",
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  closed: {
    opacity: 0,
    scale: 0.98,
    transitionEnd: { display: "none" },
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};

const containerVariants: Variants = {
  open:   { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
  closed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

const itemVariants: Variants = {
  open:   { opacity: 1, y: 0,  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  closed: { opacity: 0, y: 12, transition: { duration: 0.2 } },
};

/* ══════════════════════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════════════════════ */
export default function Navbar() {
  const pathname = usePathname();
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => window.requestAnimationFrame(() => setScrolled(window.scrollY > 30));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const active = useMemo(() => {
    if (pathname === "/") return "/";
    return NAV_LINKS.find(({ href }) => href !== "/" && pathname.startsWith(href))?.href ?? "";
  }, [pathname]);

  return (
    <div className="relative isolation-isolate">

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-6 md:px-10 py-4 transition-colors duration-300 ${
          scrolled ? "bg-[rgba(2,2,5,0.88)] backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105 flex-shrink-0">
            <Image
              src="/amalgam_iit_madras_logo.jpg"
              alt="AMALGAM IIT Madras"
              width={40}
              height={40}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col leading-none gap-[3px]">
            <span className="text-xl md:text-2xl font-black tracking-[0.18em] text-white font-display">
              AMALGAM
            </span>
            <span className="text-[8px] md:text-[9px] tracking-[0.35em] text-[rgba(255,255,255,0.45)] group-hover:text-[#FF9A00] transition-colors duration-300">
              IIT MADRAS · MME
            </span>
          </div>
        </Link>

        {/* Hamburger — always visible */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen((p) => !p)}
          className={`w-12 h-12 rounded-md z-[110] border border-white/10 flex items-center justify-center text-2xl transition-all duration-300 ${
            open
              ? "bg-white text-black"
              : scrolled
                ? "bg-white/10 text-white"
                : "bg-white/5 text-[#FF6B00]"
          }`}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </motion.button>
      </header>

      {/* ── FULLSCREEN MENU ────────────────────────────────────── */}
      <motion.aside
        initial="closed"
        animate={open ? "open" : "closed"}
        variants={menuVariants}
        style={{ transform: "translateZ(0)" }}
        className="fixed top-0 left-0 w-full h-full z-[90] flex justify-center items-center will-change-transform hammered-bg bg-[rgba(5,4,2,0.98)]"
      >

        {/* Ambient glow blob */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,107,0,0.07), transparent 70%)" }}
        />

        <motion.div
          variants={containerVariants}
          className="relative z-10 flex flex-col gap-4 text-center"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <motion.div key={href} variants={itemVariants}>
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className={`
                  group uppercase tracking-[0.22em] font-display font-black
                  text-2xl sm:text-3xl md:text-4xl
                  transition-colors duration-300 relative inline-block py-1
                  ${active === href ? "text-white" : "text-[rgba(255,154,0,0.65)] hover:text-white"}
                `}
              >
                <span className="relative z-10">{label}</span>
                <span className={`
                  absolute left-1/2 -bottom-2 h-[2px] bg-[#FF6B00]
                  transition-all duration-500 -translate-x-1/2
                  ${active === href ? "w-full" : "w-0 group-hover:w-full"}
                `} />
              </Link>
            </motion.div>
          ))}

          {/* Auth button */}
          <motion.div variants={itemVariants} className="mt-6">
            <Link
              href="/auth"
              onClick={() => setOpen(false)}
              className="btn-glow btn-outline-steel inline-block px-10 py-3 font-bold text-xs tracking-[0.2em] uppercase rounded-lg"
            >
              Login
            </Link>
          </motion.div>
        </motion.div>
      </motion.aside>
    </div>
  );
}
