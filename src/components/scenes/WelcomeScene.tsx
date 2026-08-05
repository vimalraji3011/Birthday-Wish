"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Balloons from "@/components/fx/Balloons";
import FloatingHearts from "@/components/fx/FloatingHearts";
import { friend, welcome } from "@/config/content";
import { useExperience } from "@/components/providers/ExperienceProvider";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Small twinkling specks layered over the hero for extra sparkle. */
const SPECKS = [
  { top: 18, left: 12, size: 5, delay: 0 },
  { top: 30, left: 82, size: 4, delay: 0.6 },
  { top: 62, left: 26, size: 3, delay: 1.2 },
  { top: 44, left: 68, size: 5, delay: 0.3 },
  { top: 74, left: 88, size: 3, delay: 1.6 },
  { top: 22, left: 46, size: 3, delay: 0.9 },
  { top: 82, left: 40, size: 4, delay: 2.1 },
  { top: 54, left: 6, size: 4, delay: 1.4 },
];

export default function WelcomeScene() {
  const ref = useRef<HTMLElement | null>(null);
  const calm = useReducedMotion();
  const { stage } = useExperience();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  // Hold the entrance until the loader is gone.
  const show = stage === "story";

  return (
    <section
      ref={ref}
      id="welcome"
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden px-6 py-24"
    >
      <Balloons />
      <FloatingHearts />

      {/* Twinkling specks */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {SPECKS.map((s) => (
          <span
            key={`${s.top}-${s.left}`}
            className="animate-twinkle absolute rounded-full bg-white"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              boxShadow: "0 0 12px 2px rgba(255,255,255,0.7)",
            }}
          />
        ))}
      </div>

      <motion.div
        style={calm ? undefined : { y, opacity, scale }}
        className="relative z-10 flex max-w-4xl flex-col items-center text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 18 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: EASE }}
          className="glass mb-8 inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-[0.7rem] tracking-[0.28em] text-accent uppercase"
        >
          <span className="animate-breathe h-1.5 w-1.5 rounded-full bg-accent" />
          {welcome.eyebrow}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 34, filter: "blur(12px)" }}
          animate={show ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.4, delay: 0.4, ease: EASE }}
          className="text-gradient text-[clamp(2.4rem,8vw,5.6rem)] leading-[1.02] font-medium"
        >
          {welcome.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.85, ease: EASE }}
          className="mt-7 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg"
        >
          {welcome.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={show ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 1.15, ease: EASE }}
          className="mt-10 flex items-center gap-3"
        >
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-pink/60" />
          <span className="font-script text-3xl text-pink-soft sm:text-4xl">
            {friend.name}
          </span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-pink/60" />
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#message"
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.8 }}
        style={calm ? undefined : { opacity }}
        className="absolute bottom-9 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2.5 text-fg-faint transition-colors duration-300 hover:text-fg"
      >
        <span className="text-[0.62rem] tracking-[0.34em] uppercase">
          {welcome.scrollHint}
        </span>
        <motion.span
          animate={calm ? {} : { y: [0, 7, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
          className="grid h-9 w-9 place-items-center rounded-full border border-hairline"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
            <path
              d="M12 5v13m0 0 5.5-5.5M12 18l-5.5-5.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </motion.a>
    </section>
  );
}
