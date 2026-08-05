"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait once the element scrolls into view. */
  delay?: number;
  /** Travel distance in px. Negative comes from above. */
  y?: number;
  x?: number;
  /** Fraction of the element that must be visible before it plays. */
  amount?: number;
  scale?: number;
};

/**
 * The house reveal: a soft lift out of blur. Used everywhere so the whole page
 * shares one entrance rhythm.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 30,
  x = 0,
  amount = 0.25,
  scale = 1,
}: Props) {
  const calm = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={calm ? { opacity: 0 } : { opacity: 0, y, x, scale, filter: "blur(8px)" }}
      whileInView={
        calm ? { opacity: 1 } : { opacity: 1, y: 0, x: 0, scale: 1, filter: "blur(0px)" }
      }
      viewport={{ once: true, amount }}
      transition={{
        duration: calm ? 0.3 : 0.9,
        delay: calm ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
