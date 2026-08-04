"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Fireworks from "@/components/fx/Fireworks";
import LottieBox from "@/components/ui/LottieBox";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { useExperience } from "@/components/providers/ExperienceProvider";
import { cakeScene } from "@/config/content";
import { confettiRain, goldenShower } from "@/lib/celebrate";
import sparkle from "@/animations/sparkle.json";

const VB = { w: 360, h: 300 };
const CANDLES = [136, 158, 180, 202, 224];

/** Fixed sprinkle placements — random would break hydration. */
const SPRINKLES = [
  { x: 78, y: 232, r: -20, c: "#FFD166" },
  { x: 104, y: 250, r: 35, c: "#8A5CFF" },
  { x: 132, y: 226, r: 70, c: "#FFFFFF" },
  { x: 160, y: 252, r: -45, c: "#FFD166" },
  { x: 196, y: 234, r: 15, c: "#8A5CFF" },
  { x: 224, y: 254, r: -70, c: "#FFFFFF" },
  { x: 252, y: 230, r: 50, c: "#FFD166" },
  { x: 274, y: 250, r: -15, c: "#8A5CFF" },
  { x: 108, y: 178, r: 25, c: "#FFFFFF" },
  { x: 142, y: 190, r: -35, c: "#FF4D8D" },
  { x: 180, y: 174, r: 60, c: "#FFD166" },
  { x: 216, y: 190, r: -55, c: "#FF4D8D" },
  { x: 248, y: 176, r: 10, c: "#FFFFFF" },
  { x: 136, y: 128, r: 40, c: "#FFD166" },
  { x: 180, y: 138, r: -25, c: "#FFFFFF" },
  { x: 220, y: 126, r: 65, c: "#8A5CFF" },
];

/** Scalloped frosting drips along a tier's top edge. */
function Drips({ x, width, y, fill }: { x: number; width: number; y: number; fill: string }) {
  const count = Math.round(width / 22);
  const step = width / count;
  let d = `M${x} ${y}`;
  for (let i = 0; i < count; i += 1) {
    const sx = x + i * step;
    const depth = 12 + (i % 3) * 5;
    d += ` Q${sx + step / 2} ${y + depth} ${sx + step} ${y}`;
  }
  d += ` L${x + width} ${y - 10} L${x} ${y - 10} Z`;
  return <path d={d} fill={fill} />;
}

export default function CakeScene() {
  const { candlesBlown, blowCandles } = useExperience();
  const [lit, setLit] = useState<boolean[]>(() => CANDLES.map(() => true));
  const [smoking, setSmoking] = useState<number[]>([]);
  const stopRain = useRef<(() => void) | null>(null);

  const litCount = lit.filter(Boolean).length;

  const blowOut = useCallback((index: number) => {
    setLit((prev) => {
      if (!prev[index]) return prev;
      const next = [...prev];
      next[index] = false;
      return next;
    });
    setSmoking((prev) => (prev.includes(index) ? prev : [...prev, index]));
  }, []);

  const blowAll = useCallback(() => {
    setLit(CANDLES.map(() => false));
    setSmoking(CANDLES.map((_, i) => i));
  }, []);

  // When the last flame goes out, the celebration takes over.
  useEffect(() => {
    if (litCount > 0 || candlesBlown) return;
    blowCandles();
    goldenShower();
    stopRain.current = confettiRain(9000);
  }, [litCount, candlesBlown, blowCandles]);

  useEffect(() => () => stopRain.current?.(), []);

  const pct = (v: number, axis: "w" | "h") => `${(v / (axis === "w" ? VB.w : VB.h)) * 100}%`;

  return (
    <section id="cake" className="scene relative overflow-hidden">
      <Fireworks active={candlesBlown} intensity={0.5} className="opacity-80" />

      <SectionHeading
        eyebrow={cakeScene.eyebrow}
        title={cakeScene.title}
        sub={candlesBlown ? cakeScene.done : cakeScene.hint}
      />

      <Reveal delay={0.2} className="relative z-10 mx-auto mt-12 w-full max-w-2xl">
        <div className="relative">
          {/* Warm candlelight bloom that fades as flames go out */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 rounded-full"
            style={{
              width: "62%",
              height: "48%",
              background:
                "radial-gradient(circle, rgba(255,209,102,0.55) 0%, rgba(255,150,80,0.22) 45%, transparent 72%)",
              filter: "blur(22px)",
            }}
            animate={{ opacity: litCount / CANDLES.length }}
            transition={{ duration: 1 }}
          />

          {candlesBlown ? (
            <LottieBox
              data={sparkle}
              className="pointer-events-none absolute -top-10 left-1/2 h-72 w-72 -translate-x-1/2 opacity-70"
            />
          ) : null}

          <svg
            viewBox={`0 0 ${VB.w} ${VB.h}`}
            className="relative w-full"
            role="img"
            aria-label="A three-tier birthday cake with five candles"
          >
            <defs>
              <linearGradient id="cake-plate" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#5A6489" />
                <stop offset="45%" stopColor="#D9DEF0" />
                <stop offset="100%" stopColor="#5A6489" />
              </linearGradient>
              <linearGradient id="tier-pink" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FF9BC2" />
                <stop offset="45%" stopColor="#FF5F9C" />
                <stop offset="100%" stopColor="#B03566" />
              </linearGradient>
              <linearGradient id="tier-cream" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFF3DA" />
                <stop offset="50%" stopColor="#FFDFA6" />
                <stop offset="100%" stopColor="#D4A55E" />
              </linearGradient>
              <linearGradient id="tier-purple" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#C3AAFF" />
                <stop offset="48%" stopColor="#8A5CFF" />
                <stop offset="100%" stopColor="#553093" />
              </linearGradient>
              <linearGradient id="frost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFDF7" />
                <stop offset="100%" stopColor="#FFE9C9" />
              </linearGradient>
              <linearGradient id="candle-wax" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="55%" stopColor="#FFE3EC" />
                <stop offset="100%" stopColor="#D9A2B8" />
              </linearGradient>
              <radialGradient id="flame-core" cx="50%" cy="72%" r="60%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="38%" stopColor="#FFE9A8" />
                <stop offset="100%" stopColor="#FF8A2B" stopOpacity="0.9" />
              </radialGradient>
              {/* Soft falloff — a flat circle here reads as a muddy brown disc */}
              <radialGradient id="flame-halo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFC163" stopOpacity="0.5" />
                <stop offset="45%" stopColor="#FFA53D" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#FF8A2B" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Plate */}
            <ellipse cx="180" cy="279" rx="152" ry="15" fill="url(#cake-plate)" />
            <ellipse cx="180" cy="275" rx="140" ry="11" fill="#0B1026" opacity="0.28" />

            {/* Bottom tier */}
            <rect x="58" y="204" width="244" height="72" rx="12" fill="url(#tier-pink)" />
            <rect x="58" y="204" width="244" height="10" rx="5" fill="#fff" opacity="0.22" />
            <path d="M250 204h52v72h-52z" fill="#000" opacity="0.14" />
            <Drips x={58} width={244} y={214} fill="url(#frost)" />

            {/* Middle tier */}
            <rect x="86" y="148" width="188" height="60" rx="11" fill="url(#tier-cream)" />
            <path d="M232 148h42v60h-42z" fill="#000" opacity="0.1" />
            <Drips x={86} width={188} y={158} fill="url(#frost)" />

            {/* Top tier */}
            <rect x="114" y="100" width="132" height="52" rx="10" fill="url(#tier-purple)" />
            <path d="M214 100h32v52h-32z" fill="#000" opacity="0.13" />
            <Drips x={114} width={132} y={110} fill="url(#frost)" />

            {/* Sprinkles */}
            {SPRINKLES.map((s) => (
              <rect
                key={`${s.x}-${s.y}`}
                x={s.x}
                y={s.y}
                width="7"
                height="2.6"
                rx="1.3"
                fill={s.c}
                opacity="0.9"
                transform={`rotate(${s.r} ${s.x + 3.5} ${s.y + 1.3})`}
              />
            ))}

            {/* Piped rosettes around the base */}
            {[74, 106, 138, 170, 202, 234, 266, 292].map((x) => (
              <circle key={x} cx={x} cy={272} r="7" fill="url(#frost)" opacity="0.95" />
            ))}

            {/* Candles */}
            {CANDLES.map((cx, i) => (
              <g key={cx}>
                {/* wax */}
                <rect x={cx - 4} y={70} width="8" height="34" rx="3" fill="url(#candle-wax)" />
                {/* candy stripes */}
                {[0, 1, 2, 3].map((s) => (
                  <path
                    key={s}
                    d={`M${cx - 4} ${76 + s * 8} l8 -5`}
                    stroke="#FF4D8D"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    opacity="0.75"
                  />
                ))}
                {/* wick */}
                <path
                  d={`M${cx} 70 v-5`}
                  stroke="#3A2A22"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />

                <AnimatePresence>
                  {lit[i] ? (
                    <motion.g
                      key="flame"
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.2, y: -4 }}
                      transition={{ duration: 0.35 }}
                      style={{ transformOrigin: `${cx}px 66px` }}
                    >
                      {/* halo */}
                      <circle cx={cx} cy={58} r="18" fill="url(#flame-halo)" />
                      <g
                        className="animate-flicker"
                        style={{
                          transformOrigin: `${cx}px 66px`,
                          animationDelay: `${i * 0.13}s`,
                        }}
                      >
                        <path
                          d={`M${cx} 50 c4.6 4.6 3.8 10 0 16 c-3.8 -6 -4.6 -11.4 0 -16 z`}
                          fill="url(#flame-core)"
                        />
                        <path
                          d={`M${cx} 57 c2 2.4 1.7 4.8 0 8 c-1.7 -3.2 -2 -5.6 0 -8 z`}
                          fill="#FFFDF0"
                          opacity="0.95"
                        />
                      </g>
                    </motion.g>
                  ) : null}
                </AnimatePresence>
              </g>
            ))}
          </svg>

          {/* Smoke puffs, rendered as HTML so CSS animation can carry them off */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {smoking.map((i) =>
              [0, 1, 2].map((p) => (
                <span
                  key={`${i}-${p}`}
                  className="animate-smoke absolute rounded-full bg-white/45 blur-[3px]"
                  style={{
                    left: `calc(${pct(CANDLES[i], "w")} - 4px)`,
                    top: pct(58, "h"),
                    width: 8,
                    height: 8,
                    animationDelay: `${p * 0.25}s`,
                  }}
                />
              )),
            )}
          </div>

          {/* Tap targets over each candle */}
          <div className="absolute inset-0">
            {CANDLES.map((cx, i) => (
              <button
                key={cx}
                type="button"
                onClick={() => blowOut(i)}
                disabled={!lit[i]}
                aria-label={lit[i] ? `Blow out candle ${i + 1}` : `Candle ${i + 1} is out`}
                data-cursor="grow"
                className="absolute rounded-full transition-colors duration-300 enabled:hover:bg-white/10 disabled:cursor-default"
                style={{
                  left: `calc(${pct(cx, "w")} - ${pct(13, "w")})`,
                  top: pct(40, "h"),
                  width: pct(26, "w"),
                  height: pct(70, "h"),
                }}
              />
            ))}
          </div>
        </div>

        {/* Fallback / accessible action */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <AnimatePresence mode="wait">
            {litCount > 0 ? (
              <motion.button
                key="blow"
                type="button"
                onClick={blowAll}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass rounded-full px-6 py-3 text-sm font-medium text-fg transition-all duration-400 hover:glow-gold"
              >
                Blow out all {litCount} {litCount === 1 ? "candle" : "candles"}
              </motion.button>
            ) : (
              <motion.p
                key="done"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-gradient font-display text-2xl sm:text-3xl"
              >
                Wish granted ✨
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}
