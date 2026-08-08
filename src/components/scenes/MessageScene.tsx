"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { typedMessage } from "@/config/content";

const CHAR_MS = 26;
const PARA_GAP_MS = 520;

/**
 * Paragraphs type themselves out one after another, each fading up as it starts.
 * Reduced motion gets the full text immediately.
 */
export default function MessageScene() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const calm = useReducedMotion();

  const [index, setIndex] = useState(0);
  const [chars, setChars] = useState(0);
  const done = index >= typedMessage.length;

  useEffect(() => {
    if (!inView) return;
    if (calm) {
      setIndex(typedMessage.length);
      return;
    }
    if (done) return;

    const text = typedMessage[index];
    if (chars < text.length) {
      // Punctuation gets a beat longer — it reads more like a person typing.
      const ch = text[chars];
      const pause = ch === "," ? 5 : ch === "." || ch === "?" ? 9 : 1;
      const t = window.setTimeout(() => setChars((c) => c + 1), CHAR_MS * pause);
      return () => window.clearTimeout(t);
    }

    const t = window.setTimeout(() => {
      setIndex((i) => i + 1);
      setChars(0);
    }, PARA_GAP_MS);
    return () => window.clearTimeout(t);
  }, [inView, calm, index, chars, done]);

  return (
    <section
      ref={ref}
      id="message"
      className="scene relative flex min-h-[90svh] items-center justify-center"
    >
      <div className="relative mx-auto w-full max-w-3xl">
        {/* Quote flourish */}
        <motion.span
          initial={{ opacity: 0, scale: 0.7 }}
          animate={inView ? { opacity: 0.16, scale: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
          className="font-display pointer-events-none absolute -top-8 -left-1 text-[6rem] leading-none text-pink select-none sm:-top-14 sm:-left-10 sm:text-[12rem]"
        >
          “
        </motion.span>

        <div className="glass relative rounded-[2rem] px-6 py-10 sm:px-12 sm:py-14">
          {/* Top hairline accent */}
          <span
            aria-hidden
            className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
          />

          <div className="flex flex-col gap-6">
            {typedMessage.map((para, i) => {
              const started = calm || i < index || (i === index && chars > 0);
              const text = calm || i < index ? para : i === index ? para.slice(0, chars) : "";
              const typing = !calm && i === index && chars < para.length;

              return (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className={`font-display text-[1.15rem] leading-[1.75] sm:text-2xl sm:leading-[1.7] ${
                    i === typedMessage.length - 1
                      ? "text-gradient font-medium italic"
                      : "text-fg/90"
                  }`}
                  // Reserve the line box so the card doesn't jolt as text arrives.
                  style={{ minHeight: started ? undefined : 0 }}
                >
                  {text}
                  {typing ? (
                    <span className="caret-blink ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.15em] bg-pink" />
                  ) : null}
                </motion.p>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: done ? 1 : 0 }}
            transition={{ duration: 0.9 }}
            className="mt-9 flex items-center gap-3"
          >
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-hairline to-transparent" />
            <span className="text-lg text-pink">❤</span>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-hairline to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
