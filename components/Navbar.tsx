"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/",             label: "Home"         },
  { href: "/schedule",     label: "Timeline"     },
  { href: "/speakers",     label: "Speakers"     },
  { href: "/workshops",    label: "Workshops"    },
  { href: "/competitions", label: "Competitions" },
  { href: "/register",     label: "Register"     },
];

const containerVariants: Variants = {
  open:   { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
  closed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};
const itemVariants: Variants = {
  open:   { opacity: 1, y: 0,   transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  closed: { opacity: 0, y: 20,  transition: { duration: 0.2 } },
};

export default function Navbar() {
  const pathname  = usePathname();
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
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-6 md:px-10 transition-all duration-300 ${
          scrolled
            ? "py-3 bg-white border-b-2 border-[#D42000] shadow-[0_2px_20px_rgba(212,32,0,0.08)]"
            : "py-4 bg-white border-b border-[rgba(212,32,0,0.15)]"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border-2 border-[rgba(212,32,0,0.2)] group-hover:border-[#D42000] transition-colors duration-300">
            <Image
              src="/amalgam_iit_madras_logo.jpg"
              alt="AMALGAM IIT Madras"
              width={40} height={40}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col leading-none gap-[3px]">
            <span className="text-xl md:text-2xl font-black tracking-[0.18em] text-[#1A0A00] font-display group-hover:text-[#D42000] transition-colors duration-300">
              AMALGAM
            </span>
            <span className="text-[8px] md:text-[9px] tracking-[0.35em] text-[rgba(80,40,0,0.55)] uppercase">
              IIT Madras · MME
            </span>
          </div>
        </Link>

        {/* Hamburger */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.04 }}
          onClick={() => setOpen((p) => !p)}
          className={`relative w-14 h-12 rounded-none z-[110] flex flex-col items-center justify-center gap-[6px] transition-all duration-300 overflow-hidden ${
            open ? "bg-[#D42000]" : "bg-white"
          }`}
          style={{ border: "2px solid #D42000" }}
          aria-label="Toggle menu"
        >
          {/* Corner accents */}
          {!open && <>
            <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#D42000]" />
            <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#D42000]" />
          </>}

          {/* Bar 1 — full width */}
          <motion.span
            animate={open
              ? { rotate: 45, y: 7, width: "20px", backgroundColor: "#ffffff" }
              : { rotate: 0, y: 0, width: "20px", backgroundColor: "#D42000" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="block h-[2.5px] rounded-sm"
            style={{ width: 20 }}
          />
          {/* Bar 2 — shorter */}
          <motion.span
            animate={open
              ? { opacity: 0, scaleX: 0 }
              : { opacity: 1, scaleX: 1, backgroundColor: "#D42000" }}
            transition={{ duration: 0.18 }}
            className="block h-[2.5px] rounded-sm bg-[#D42000]"
            style={{ width: 14 }}
          />
          {/* Bar 3 — medium */}
          <motion.span
            animate={open
              ? { rotate: -45, y: -7, width: "20px", backgroundColor: "#ffffff" }
              : { rotate: 0, y: 0, width: "17px", backgroundColor: "#D42000" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="block h-[2.5px] rounded-sm"
            style={{ width: 17 }}
          />
        </motion.button>
      </motion.header>

      {/* ── FULLSCREEN MENU ────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 w-full h-full z-[90] flex justify-center items-center"
            style={{ background: "rgba(255,252,248,0.98)", backdropFilter: "blur(20px)" }}
          >
            {/* Red top bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#D42000]" />

            {/* Subtle red glow center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(212,32,0,0.05), transparent 70%)" }} />

            <motion.div
              variants={containerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="relative z-10 flex flex-col gap-2 text-center"
            >
              {NAV_LINKS.map(({ href, label }) => (
                <motion.div key={href} variants={itemVariants}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`
                      group uppercase tracking-[0.22em] font-display font-black
                      text-3xl sm:text-4xl md:text-5xl
                      transition-colors duration-200 relative inline-block py-1.5
                      ${active === href ? "text-[#D42000]" : "text-[#1A0A00] hover:text-[#D42000]"}
                    `}
                  >
                    {label}
                    <span className={`
                      absolute left-0 -bottom-1 h-[3px] bg-[#D42000]
                      transition-all duration-300
                      ${active === href ? "w-full" : "w-0 group-hover:w-full"}
                    `} />
                  </Link>
                </motion.div>
              ))}

              <motion.div variants={itemVariants} className="mt-8">
                <Link
                  href="/auth"
                  onClick={() => setOpen(false)}
                  className="inline-block px-12 py-3.5 font-bold text-sm tracking-[0.2em] uppercase text-white bg-[#D42000] hover:bg-[#AA1800] transition-colors duration-200"
                >
                  Login / Sign Up
                </Link>
              </motion.div>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
