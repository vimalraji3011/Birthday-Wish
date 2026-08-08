"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import GiftBox from "@/components/fx/GiftBox";
import LottieBox from "@/components/ui/LottieBox";
import { useExperience } from "@/components/providers/ExperienceProvider";
import { useMatchMedia } from "@/lib/useMatchMedia";
import sparkle from "@/animations/sparkle.json";

const DURATION = 3400;

export default function LoadingScene() {
  const { stage, finishLoading } = useExperience();
  const calm = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const isCompact = useMatchMedia("(max-width: 639px)");
  const boxSize = isCompact ? 150 : 210;

  useEffect(() => {
    if (stage !== "loading") return;
    const span = calm ? 900 : DURATION;
    const started = performance.now();
    let raf = 0;

    const tick = () => {
      const elapsed = performance.now() - started;
      // Ease-out so it sprints early and savours the last few percent.
      const linear = Math.min(1, elapsed / span);
      const eased = 1 - Math.pow(1 - linear, 2.1);
      setProgress(eased);
      if (linear < 1) raf = requestAnimationFrame(tick);
      else window.setTimeout(finishLoading, 420);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stage, finishLoading, calm]);

  // Hold the page still (and at the top) while the surprise is being prepared.
  // iOS Safari still rubber-bands a merely `overflow: hidden` body via touchmove,
  // so the root element is locked too.
  useEffect(() => {
    if (stage !== "loading") return;
    const previousBody = document.body.style.overflow;
    const previousRoot = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = previousBody;
      document.documentElement.style.overflow = previousRoot;
    };
  }, [stage]);

  const pct = Math.round(progress * 100);

  return (
    <AnimatePresence>
      {stage === "loading" ? (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[55] flex flex-col items-center justify-center gap-10 bg-surface-deep px-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06, filter: "blur(14px)" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Backdrop wash so the loader doesn't sit on flat black */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 45%, rgba(138,92,255,0.22) 0%, transparent 60%), radial-gradient(ellipse at 50% 90%, rgba(255,77,141,0.16) 0%, transparent 55%)",
            }}
          />

          <div className="relative grid place-items-center">
            <LottieBox
              data={sparkle}
              className="pointer-events-none absolute h-56 w-56 opacity-70 sm:h-80 sm:w-80 md:h-[420px] md:w-[420px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <GiftBox size={boxSize} />
            </motion.div>
          </div>

          <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-5">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35 }}
              className="font-display text-center text-xl text-fg/90 italic sm:text-2xl"
            >
              Preparing a special surprise
              <span className="caret-blink">...</span>
            </motion.p>

            <div className="relative h-[5px] w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold via-pink to-purple"
                style={{ width: `${pct}%` }}
                transition={{ duration: 0 }}
              />
              {/* Travelling highlight on the bar */}
              <div className="animate-sheen absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
            </div>

            <span className="font-body text-xs text-fg-faint tabular-nums">{pct}%</span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
