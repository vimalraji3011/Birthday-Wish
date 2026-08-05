"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });

  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent"
    >
      <motion.div
        style={{ scaleX: width, transformOrigin: "0% 50%" }}
        className="h-full w-full bg-gradient-to-r from-gold via-pink to-purple shadow-[0_0_14px_rgba(255,77,141,0.7)]"
      />
    </div>
  );
}
