"use client";

import { motion, useReducedMotion } from "framer-motion";
import Fireworks from "@/components/fx/Fireworks";
import FloatingHearts from "@/components/fx/FloatingHearts";
import { useExperience } from "@/components/providers/ExperienceProvider";
import { fireworksScene, friend } from "@/config/content";
import { goldenShower } from "@/lib/celebrate";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fixed golden motes so SSR and the client agree. */
const MOTES = [
  { left: 9, top: 24, size: 6, delay: 0 },
  { left: 24, top: 62, size: 4, delay: 0.8 },
  { left: 38, top: 18, size: 5, delay: 1.6 },
  { left: 52, top: 74, size: 3, delay: 0.4 },
  { left: 66, top: 32, size: 6, delay: 2.2 },
  { left: 79, top: 68, size: 4, delay: 1.1 },
  { left: 91, top: 28, size: 5, delay: 2.8 },
  { left: 16, top: 84, size: 3, delay: 3.2 },
  { left: 72, top: 12, size: 4, delay: 2.5 },
  { left: 45, top: 46, size: 3, delay: 1.9 },
];

export default function FireworksScene() {
  const { candlesBlown } = useExperience();
  const calm = useReducedMotion();

  return (
    <section
      id="fireworks"
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden px-6 py-24"
    >
      <Fireworks active={candlesBlown} intensity={1} />
      <FloatingHearts />

      {/* Golden motes */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {MOTES.map((m) => (
          <span
            key={`${m.left}-${m.top}`}
            className="animate-twinkle absolute rounded-full bg-gold"
            style={{
              left: `${m.left}%`,
              top: `${m.top}%`,
              width: m.size,
              height: m.size,
              animationDelay: `${m.delay}s`,
              boxShadow: "0 0 16px 3px rgba(255,209,102,0.75)",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mb-6 text-[0.68rem] tracking-[0.34em] text-accent uppercase"
        >
          Scene nine — the grand finale
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, scale: 0.86, filter: "blur(16px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.5, ease: EASE }}
          className="text-gradient text-glow text-[clamp(2.8rem,12vw,8rem)] leading-[0.98] font-medium"
        >
          {fireworksScene.headline}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.1, delay: 0.45, ease: EASE }}
          className="font-script mt-6 text-3xl text-pink-soft sm:text-5xl"
        >
          {friend.name}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.1, delay: 0.7, ease: EASE }}
          className="mt-7 max-w-lg text-base leading-relaxed text-fg-muted sm:text-lg"
        >
          {fireworksScene.sub}
        </motion.p>

        {candlesBlown ? (
          <motion.button
            type="button"
            onClick={goldenShower}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
            whileHover={calm ? undefined : { scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="glass glow-gold mt-11 rounded-full px-7 py-3.5 text-sm font-medium text-fg"
          >
            One more burst 🎉
          </motion.button>
        ) : (
          <motion.a
            href="#cake"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
            className="glass mt-11 rounded-full px-7 py-3.5 text-sm font-medium text-fg transition-colors duration-300 hover:text-accent"
          >
            ↑ Blow out the candles to start the show
          </motion.a>
        )}
      </div>
    </section>
  );
}
