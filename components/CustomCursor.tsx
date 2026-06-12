"use client";

import { useEffect, useRef } from "react";

const CURSOR_CSS = `
@keyframes amalgam-cursor-spin {
  to { transform: rotate(360deg); }
}

@keyframes amalgam-cursor-counter-spin {
  to { transform: rotate(-360deg); }
}

@keyframes amalgam-cursor-scan {
  to { stroke-dashoffset: -34; }
}

@keyframes amalgam-cursor-core {
  0%, 100% { transform: scale(0.9); opacity: 0.72; }
  50% { transform: scale(1.16); opacity: 1; }
}

@keyframes amalgam-cursor-spark {
  0% {
    opacity: 1;
    transform: translate3d(-50%, -50%, 0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate3d(calc(-50% + var(--spark-x)), calc(-50% + var(--spark-y)), 0) scale(0.1);
  }
}

.amalgam-cursor,
.amalgam-cursor-point,
.amalgam-cursor-bursts {
  left: 0;
  pointer-events: none;
  position: fixed;
  top: 0;
  z-index: 9999;
}

.amalgam-cursor {
  filter: drop-shadow(0 0 9px rgba(255, 107, 0, 0.28));
  height: 88px;
  opacity: 0;
  transition: filter 180ms ease, opacity 180ms ease;
  width: 88px;
  will-change: transform, opacity;
}

.amalgam-cursor svg {
  display: block;
  overflow: visible;
}

.amalgam-cursor__heat {
  opacity: 0.34;
  transform-origin: 0 0;
  transition: opacity 180ms ease, transform 180ms ease;
}

.amalgam-cursor__outer {
  animation: amalgam-cursor-spin 15s linear infinite;
  transform-origin: 0 0;
}

.amalgam-cursor__inner {
  animation: amalgam-cursor-counter-spin 9s linear infinite;
  transform-origin: 0 0;
}

.amalgam-cursor__scan {
  animation: amalgam-cursor-scan 3.2s linear infinite;
}

.amalgam-cursor__core {
  animation: amalgam-cursor-core 1.8s ease-in-out infinite;
  transform-box: fill-box;
  transform-origin: center;
}

.amalgam-cursor__beam {
  opacity: 0;
  transition: opacity 160ms ease;
}

.amalgam-cursor__aim,
.amalgam-cursor__chips,
.amalgam-cursor__lattice,
.amalgam-cursor__scan,
.amalgam-cursor__shell {
  transition: opacity 160ms ease, stroke-width 160ms ease;
}

.amalgam-cursor[data-variant="action"] {
  filter: drop-shadow(0 0 15px rgba(255, 107, 0, 0.46));
}

.amalgam-cursor[data-variant="action"] .amalgam-cursor__heat {
  opacity: 0.54;
  transform: scale(1.18);
}

.amalgam-cursor[data-variant="action"] .amalgam-cursor__shell {
  stroke-width: 1.2;
}

.amalgam-cursor[data-variant="action"] .amalgam-cursor__scan {
  opacity: 1;
  stroke-width: 1.1;
}

.amalgam-cursor[data-variant="text"] .amalgam-cursor__aim,
.amalgam-cursor[data-variant="text"] .amalgam-cursor__chips,
.amalgam-cursor[data-variant="text"] .amalgam-cursor__heat,
.amalgam-cursor[data-variant="text"] .amalgam-cursor__lattice,
.amalgam-cursor[data-variant="text"] .amalgam-cursor__scan,
.amalgam-cursor[data-variant="text"] .amalgam-cursor__shell {
  opacity: 0.12;
}

.amalgam-cursor[data-variant="text"] .amalgam-cursor__beam {
  opacity: 1;
}

.amalgam-cursor-point {
  background:
    radial-gradient(circle at 38% 34%, #fff4d8 0 18%, #ffb800 19% 42%, #ff3d00 43% 78%, rgba(204, 68, 0, 0.05) 79%);
  border-radius: 999px;
  box-shadow: 0 0 12px rgba(255, 61, 0, 0.72), 0 0 2px rgba(42, 26, 10, 0.6);
  height: 8px;
  opacity: 0;
  transition: opacity 180ms ease;
  width: 8px;
  will-change: transform, opacity;
}

.amalgam-cursor-bursts {
  height: 100vh;
  overflow: hidden;
  width: 100vw;
}

.amalgam-cursor__spark {
  animation: amalgam-cursor-spark 620ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  background: linear-gradient(135deg, #fff1b8, #ff6b00 48%, #d42000);
  border-radius: 999px;
  box-shadow: 0 0 10px rgba(255, 107, 0, 0.6);
  height: 5px;
  left: var(--spark-left);
  position: absolute;
  top: var(--spark-top);
  width: 5px;
}

@media (prefers-reduced-motion: reduce) {
  .amalgam-cursor__core,
  .amalgam-cursor__inner,
  .amalgam-cursor__outer,
  .amalgam-cursor__scan,
  .amalgam-cursor__spark {
    animation: none;
  }
}
`;

const HOVER_SELECTOR = [
  "a",
  "button",
  "[role='button']",
  "summary",
  "label",
  "select",
  "input[type='button']",
  "input[type='checkbox']",
  "input[type='radio']",
  "input[type='reset']",
  "input[type='submit']",
  "[data-cursor='action']",
].join(",");

const TEXT_SELECTOR = [
  "input:not([type])",
  "input[type='email']",
  "input[type='number']",
  "input[type='password']",
  "input[type='search']",
  "input[type='tel']",
  "input[type='text']",
  "input[type='url']",
  "textarea",
  "[contenteditable='true']",
  "[data-cursor='text']",
].join(",");

const DISABLED_SELECTOR = "[disabled], [aria-disabled='true']";

type CursorVariant = "idle" | "action" | "text";

function hexPoints(radius: number): string {
  return Array.from({ length: 6 }, (_, index) => {
    const angle = (index / 6) * Math.PI * 2 - Math.PI / 2;
    return `${(radius * Math.cos(angle)).toFixed(3)},${(radius * Math.sin(angle)).toFixed(3)}`;
  }).join(" ");
}

function variantFor(target: EventTarget | null): CursorVariant {
  if (!(target instanceof Element)) return "idle";
  if (target.closest(DISABLED_SELECTOR)) return "idle";
  if (target.closest(TEXT_SELECTOR)) return "text";
  if (target.closest(HOVER_SELECTOR)) return "action";
  return "idle";
}

function injectStyles(): HTMLStyleElement {
  const existing = document.getElementById("amalgam-cursor-styles");
  if (existing instanceof HTMLStyleElement) return existing;

  const style = document.createElement("style");
  style.id = "amalgam-cursor-styles";
  style.textContent = CURSOR_CSS;
  document.head.appendChild(style);
  return style;
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pointRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const raw = useRef({ x: -300, y: -300 });
  const smooth = useRef({ x: -300, y: -300 });
  const visible = useRef(false);
  const pressed = useRef(false);
  const variant = useRef<CursorVariant>("idle");
  const opacity = useRef(0);
  const scale = useRef(1);
  const rafId = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!hasFinePointer || reducedMotion) return;

    const style = injectStyles();
    const burstRoot = burstRef.current;
    document.documentElement.classList.add("custom-cursor-active");

    const syncVariant = (nextVariant: CursorVariant) => {
      if (variant.current === nextVariant) return;
      variant.current = nextVariant;
      cursorRef.current?.setAttribute("data-variant", nextVariant);
    };

    const updatePosition = (event: MouseEvent | PointerEvent) => {
      raw.current = { x: event.clientX, y: event.clientY };
      visible.current = true;
      syncVariant(variantFor(event.target));
    };

    const showCursor = () => {
      visible.current = true;
    };

    const hideCursor = () => {
      visible.current = false;
      pressed.current = false;
      syncVariant("idle");
    };

    const onPress = () => {
      pressed.current = true;
    };

    const onRelease = () => {
      pressed.current = false;
    };

    const createBurst = (event: MouseEvent) => {
      const root = burstRef.current;
      if (!root) return;

      const sparks = variant.current === "action" ? 10 : 7;
      const spread = variant.current === "action" ? 35 : 26;

      for (let index = 0; index < sparks; index += 1) {
        const spark = document.createElement("span");
        const angle = (index / sparks) * Math.PI * 2 + Math.random() * 0.28;
        const distance = spread * (0.55 + Math.random() * 0.55);

        spark.className = "amalgam-cursor__spark";
        spark.style.setProperty("--spark-left", `${event.clientX}px`);
        spark.style.setProperty("--spark-top", `${event.clientY}px`);
        spark.style.setProperty("--spark-x", `${Math.cos(angle) * distance}px`);
        spark.style.setProperty("--spark-y", `${Math.sin(angle) * distance}px`);
        spark.addEventListener("animationend", () => spark.remove(), { once: true });
        root.appendChild(spark);
      }
    };

    const tick = () => {
      const chase = variant.current === "action" ? 0.2 : 0.13;

      smooth.current.x += (raw.current.x - smooth.current.x) * chase;
      smooth.current.y += (raw.current.y - smooth.current.y) * chase;

      const targetScale =
        (variant.current === "action" ? 1.2 : variant.current === "text" ? 0.78 : 1) *
        (pressed.current ? 0.82 : 1);
      scale.current += (targetScale - scale.current) * 0.18;

      const targetOpacity = visible.current ? 1 : 0;
      opacity.current += (targetOpacity - opacity.current) * 0.16;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${(smooth.current.x - 44).toFixed(1)}px, ${(smooth.current.y - 44).toFixed(1)}px, 0) scale(${scale.current.toFixed(3)})`;
        cursorRef.current.style.opacity = opacity.current.toFixed(3);
      }

      if (pointRef.current) {
        pointRef.current.style.transform = `translate3d(${(raw.current.x - 4).toFixed(1)}px, ${(raw.current.y - 4).toFixed(1)}px, 0)`;
        pointRef.current.style.opacity = opacity.current.toFixed(3);
      }

      rafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", updatePosition, { passive: true });
    window.addEventListener("pointermove", updatePosition, { passive: true });
    window.addEventListener("mouseenter", showCursor);
    window.addEventListener("mouseleave", hideCursor);
    window.addEventListener("mousedown", onPress);
    window.addEventListener("mouseup", onRelease);
    window.addEventListener("click", createBurst);
    window.addEventListener("blur", hideCursor);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("pointermove", updatePosition);
      window.removeEventListener("mouseenter", showCursor);
      window.removeEventListener("mouseleave", hideCursor);
      window.removeEventListener("mousedown", onPress);
      window.removeEventListener("mouseup", onRelease);
      window.removeEventListener("click", createBurst);
      window.removeEventListener("blur", hideCursor);
      cancelAnimationFrame(rafId.current);
      burstRoot?.replaceChildren();
      if (style.parentNode && style.textContent === CURSOR_CSS) {
        style.remove();
      }
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="amalgam-cursor"
        data-variant="idle"
        style={{ transform: "translate3d(-300px, -300px, 0)" }}
      >
        <svg width="88" height="88" viewBox="-44 -44 88 88" fill="none">
          <circle className="amalgam-cursor__heat" r="28" fill="rgba(255, 107, 0, 0.13)" />

          <g className="amalgam-cursor__outer">
            <polygon
              className="amalgam-cursor__shell"
              points={hexPoints(33)}
              stroke="rgba(212, 32, 0, 0.72)"
              strokeWidth="0.85"
            />
            <polygon
              className="amalgam-cursor__lattice"
              points={hexPoints(21)}
              stroke="rgba(255, 154, 0, 0.46)"
              strokeWidth="0.62"
            />
            {hexPoints(33)
              .split(" ")
              .map((point, index) => {
                const [cx, cy] = point.split(",").map(Number);
                return (
                  <circle
                    key={point}
                    className="amalgam-cursor__chips"
                    cx={cx}
                    cy={cy}
                    r={index % 2 === 0 ? 1.55 : 1.05}
                    fill={index % 2 === 0 ? "#ff6b00" : "#d42000"}
                    opacity="0.82"
                  />
                );
              })}
          </g>

          <g className="amalgam-cursor__inner">
            <line x1="-18" y1="-10" x2="18" y2="10" stroke="rgba(204, 68, 0, 0.34)" strokeWidth="0.55" />
            <line x1="-18" y1="10" x2="18" y2="-10" stroke="rgba(204, 68, 0, 0.34)" strokeWidth="0.55" />
            <line x1="0" y1="-21" x2="0" y2="21" stroke="rgba(255, 154, 0, 0.28)" strokeWidth="0.5" />
          </g>

          <circle
            className="amalgam-cursor__scan"
            r="25"
            stroke="rgba(255, 61, 0, 0.62)"
            strokeDasharray="5 6"
            strokeLinecap="round"
            strokeWidth="0.82"
          />

          <g className="amalgam-cursor__aim" stroke="#d42000" strokeLinecap="round">
            <line x1="0" y1="-34" x2="0" y2="-22" strokeWidth="0.92" />
            <line x1="0" y1="22" x2="0" y2="34" strokeWidth="0.92" />
            <line x1="-34" y1="0" x2="-22" y2="0" strokeWidth="0.92" />
            <line x1="22" y1="0" x2="34" y2="0" strokeWidth="0.92" />
            <line x1="-4" y1="-34" x2="4" y2="-34" strokeWidth="0.5" opacity="0.62" />
            <line x1="-4" y1="34" x2="4" y2="34" strokeWidth="0.5" opacity="0.62" />
            <line x1="-34" y1="-4" x2="-34" y2="4" strokeWidth="0.5" opacity="0.62" />
            <line x1="34" y1="-4" x2="34" y2="4" strokeWidth="0.5" opacity="0.62" />
          </g>

          <g className="amalgam-cursor__beam" strokeLinecap="round">
            <line x1="0" y1="-21" x2="0" y2="21" stroke="#d42000" strokeWidth="1.7" />
            <line x1="-6" y1="-21" x2="6" y2="-21" stroke="#ff9a00" strokeWidth="1.1" />
            <line x1="-6" y1="21" x2="6" y2="21" stroke="#ff9a00" strokeWidth="1.1" />
          </g>

          <polygon
            className="amalgam-cursor__core"
            points={hexPoints(6)}
            fill="rgba(255, 107, 0, 0.22)"
            stroke="#d42000"
            strokeWidth="0.8"
          />
          <circle r="2.1" fill="#ff3d00" />
          <circle r="0.75" fill="#fff1b8" />
        </svg>
      </div>
      <div ref={pointRef} aria-hidden="true" className="amalgam-cursor-point" />
      <div ref={burstRef} aria-hidden="true" className="amalgam-cursor-bursts" />
    </>
  );
}
