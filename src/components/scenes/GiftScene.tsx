"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Balloons from "@/components/fx/Balloons";
import GiftBox from "@/components/fx/GiftBox";
import LottieBox from "@/components/ui/LottieBox";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { useExperience } from "@/components/providers/ExperienceProvider";
import { giftScene } from "@/config/content";
import { giftBurst } from "@/lib/celebrate";
import sparkle from "@/animations/sparkle.json";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function GiftScene() {
  const { giftOpened, openGift } = useExperience();
  const boxRef = useRef<HTMLButtonElement | null>(null);
  const [flash, setFlash] = useState(false);

  const handleOpen = useCallback(() => {
    if (giftOpened) return;
    openGift();
    setFlash(true);

    // Fire the confetti from wherever the box actually is on screen.
    const rect = boxRef.current?.getBoundingClientRect();
    const origin = rect
      ? {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        }
      : { x: 0.5, y: 0.5 };
    giftBurst(origin);
  }, [giftOpened, openGift]);

  // Once the story unlocks, carry the visitor into the memories.
  useEffect(() => {
    if (!giftOpened) return;
    const t = window.setTimeout(() => {
      document.getElementById("memories")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 2600);
    return () => window.clearTimeout(t);
  }, [giftOpened]);

  useEffect(() => {
    if (!flash) return;
    const t = window.setTimeout(() => setFlash(false), 700);
    return () => window.clearTimeout(t);
  }, [flash]);

  return (
    <section
      id="gift"
      className="scene relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden"
    >
      <Balloons released={giftOpened} />

      {/* White flash at the moment of opening */}
      <AnimatePresence>
        {flash ? (
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-30 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.75, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        ) : null}
      </AnimatePresence>

      <SectionHeading eyebrow={giftScene.eyebrow} title={giftScene.title} />

      <Reveal delay={0.25} className="relative mt-14 grid place-items-center">
        {giftOpened ? (
          <LottieBox
            data={sparkle}
            className="pointer-events-none absolute h-[520px] w-[520px] opacity-80"
          />
        ) : null}

        <motion.button
          ref={boxRef}
          type="button"
          onClick={handleOpen}
          disabled={giftOpened}
          aria-label={giftOpened ? "The gift is open" : "Open your gift"}
          data-cursor="grow"
          className="relative grid place-items-center rounded-[2.5rem] p-4 transition-transform duration-500 focus-visible:outline-2 disabled:cursor-default"
          whileHover={giftOpened ? undefined : { scale: 1.05 }}
          whileTap={giftOpened ? undefined : { scale: 0.96 }}
        >
          <GiftBox open={giftOpened} size={280} interactive={!giftOpened} />
        </motion.button>
      </Reveal>

      <div className="relative z-10 mt-10 grid min-h-24 place-items-center text-center">
        <AnimatePresence mode="wait">
          {giftOpened ? (
            <motion.div
              key="opened"
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: EASE }}
              className="flex flex-col items-center gap-3"
            >
              <h3 className="text-gradient font-display text-[clamp(2rem,7vw,3.6rem)] leading-tight font-medium">
                {giftScene.opened}
              </h3>
              <p className="max-w-sm text-sm text-fg-muted sm:text-base">
                {giftScene.openedSub}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center gap-3"
            >
              <motion.span
                animate={{ scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="glass glow-pink rounded-full px-6 py-3 text-sm font-medium tracking-wide text-fg"
              >
                {giftScene.hint}
              </motion.span>
              <span className="text-xs text-fg-faint">
                The music starts here — turn your sound on
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
