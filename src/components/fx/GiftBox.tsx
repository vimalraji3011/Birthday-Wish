"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";

type Props = {
  open?: boolean;
  size?: number;
  /** Renders the idle float + hover affordance. */
  interactive?: boolean;
  className?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The gift box, drawn as SVG so it stays crisp at any size. The lid is its own
 * group so it can hinge open, and a light shaft fades in from inside the box.
 */
export default function GiftBox({
  open = false,
  size = 260,
  interactive = false,
  className = "",
}: Props) {
  const uid = useId().replace(/:/g, "");
  const calm = useReducedMotion();

  const id = (n: string) => `${n}-${uid}`;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Ambient glow behind the box */}
      <motion.div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: size * 1.5,
          height: size * 1.5,
          background:
            "radial-gradient(circle, rgba(255,209,102,0.42) 0%, rgba(255,77,141,0.24) 38%, transparent 68%)",
          filter: "blur(18px)",
        }}
        animate={calm ? { opacity: 0.7 } : { opacity: open ? [0.9, 1] : [0.5, 0.85, 0.5], scale: open ? 1.3 : 1 }}
        transition={
          calm
            ? { duration: 0 }
            : open
              ? { duration: 0.8, ease: EASE }
              : { duration: 3.6, repeat: Infinity, ease: "easeInOut" }
        }
      />

      {/* Light shaft escaping the open box */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: size * 0.42,
          width: size * 0.62,
          height: size * 1.5,
          background:
            "linear-gradient(to top, rgba(255,236,180,0.85) 0%, rgba(255,209,102,0.35) 32%, rgba(255,255,255,0) 100%)",
          clipPath: "polygon(38% 100%, 62% 100%, 100% 0%, 0% 0%)",
          filter: "blur(6px)",
          transformOrigin: "bottom center",
        }}
        initial={{ opacity: 0, scaleY: 0.2 }}
        animate={open ? { opacity: 1, scaleY: 1 } : { opacity: 0, scaleY: 0.2 }}
        transition={{ duration: 0.9, ease: EASE, delay: open ? 0.18 : 0 }}
      />

      <motion.svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="relative z-10 overflow-visible"
        animate={
          calm || open
            ? { y: 0 }
            : interactive
              ? { y: [0, -9, 0] }
              : { y: [0, -6, 0] }
        }
        transition={
          calm || open ? { duration: 0.4 } : { duration: 4.2, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <defs>
          <linearGradient id={id("bodyMain")} x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor="#FF85B8" />
            <stop offset="42%" stopColor="#FF4D8D" />
            <stop offset="100%" stopColor="#8A2E63" />
          </linearGradient>
          <linearGradient id={id("lid")} x1="0" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#FFA0C8" />
            <stop offset="40%" stopColor="#FF5D97" />
            <stop offset="100%" stopColor="#B93A70" />
          </linearGradient>
          <linearGradient id={id("ribbon")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF0C2" />
            <stop offset="38%" stopColor="#FFD166" />
            <stop offset="100%" stopColor="#D99A21" />
          </linearGradient>
          <linearGradient id={id("inner")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF6DC" />
            <stop offset="100%" stopColor="#C77E9F" />
          </linearGradient>
          <radialGradient id={id("sheen")} cx="30%" cy="22%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Contact shadow */}
        <ellipse cx="100" cy="181" rx="56" ry="9" fill="#05081a" opacity="0.45" />

        {/* Box interior, revealed as the lid lifts */}
        <path d="M46 84h108v14H46z" fill={`url(#${id("inner")})`} opacity={open ? 1 : 0} />

        {/* Box body */}
        <g>
          <path
            d="M46 86h108a4 4 0 0 1 4 4v76a8 8 0 0 1-8 8H50a8 8 0 0 1-8-8V90a4 4 0 0 1 4-4Z"
            fill={`url(#${id("bodyMain")})`}
          />
          {/* right-side shading for volume */}
          <path
            d="M126 86h28a4 4 0 0 1 4 4v76a8 8 0 0 1-8 8h-24Z"
            fill="#000"
            opacity="0.16"
          />
          {/* vertical ribbon */}
          <rect x="90" y="86" width="20" height="88" fill={`url(#${id("ribbon")})`} />
          <rect x="90" y="86" width="6" height="88" fill="#fff" opacity="0.28" />
          {/* horizontal ribbon */}
          <rect x="42" y="120" width="116" height="14" fill={`url(#${id("ribbon")})`} opacity="0.92" />
          <rect x="42" y="120" width="116" height="4" fill="#fff" opacity="0.25" />
          <path d="M46 86h108v6H46z" fill="#fff" opacity="0.18" />
        </g>

        {/* Lid + bow hinge open together */}
        <motion.g
          initial={false}
          animate={
            open
              ? { y: -64, rotate: -18, x: -10, opacity: 1 }
              : { y: 0, rotate: 0, x: 0, opacity: 1 }
          }
          transition={{ duration: 1, ease: EASE, delay: open ? 0.05 : 0 }}
          style={{ transformOrigin: "38px 78px" }}
        >
          <rect
            x="34"
            y="62"
            width="132"
            height="26"
            rx="7"
            fill={`url(#${id("lid")})`}
          />
          <rect x="34" y="62" width="132" height="7" rx="3.5" fill="#fff" opacity="0.24" />
          <rect x="90" y="62" width="20" height="26" fill={`url(#${id("ribbon")})`} />

          {/* Bow */}
          <g>
            <path
              d="M100 62c-4-17-19-29-32-24-11 4-11 19 0 23 8 3 20 2 32 1Z"
              fill={`url(#${id("ribbon")})`}
            />
            <path
              d="M100 62c4-17 19-29 32-24 11 4 11 19 0 23-8 3-20 2-32 1Z"
              fill={`url(#${id("ribbon")})`}
            />
            <path d="M100 62c-4-17-19-29-32-24 16 1 25 12 32 24Z" fill="#000" opacity="0.13" />
            <path d="M100 62c4-17 19-29 32-24-16 1-25 12-32 24Z" fill="#000" opacity="0.13" />
            {/* trailing ribbon tails */}
            <path d="M96 62c-5 8-13 12-19 13 4-6 9-10 12-16Z" fill={`url(#${id("ribbon")})`} opacity="0.9" />
            <path d="M104 62c5 8 13 12 19 13-4-6-9-10-12-16Z" fill={`url(#${id("ribbon")})`} opacity="0.9" />
            <circle cx="100" cy="59" r="10.5" fill={`url(#${id("ribbon")})`} />
            <circle cx="96.8" cy="55.8" r="3.6" fill="#fff" opacity="0.5" />
          </g>
        </motion.g>

        {/* Glass sheen over the whole box */}
        <path
          d="M46 86h108a4 4 0 0 1 4 4v76a8 8 0 0 1-8 8H50a8 8 0 0 1-8-8V90a4 4 0 0 1 4-4Z"
          fill={`url(#${id("sheen")})`}
          pointerEvents="none"
        />
      </motion.svg>
    </div>
  );
}
