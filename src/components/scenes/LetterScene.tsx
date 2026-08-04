"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import LottieBox from "@/components/ui/LottieBox";
import { friend, letter } from "@/config/content";
import heart from "@/animations/heart.json";

/**
 * The closing letter. Each line is masked and wiped open left-to-right so it
 * reads as if it's being written, and the signature's underline draws itself.
 */
export default function LetterScene() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const lines = gsap.utils.toArray<HTMLElement>("[data-line]", root);
    const stroke = root.querySelector<SVGPathElement>("[data-underline]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lines.forEach((l) => {
        l.style.clipPath = "inset(0 0% 0 0)";
        l.style.opacity = "1";
      });
      if (stroke) stroke.style.strokeDashoffset = "0";
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "[data-letter-body]",
          start: "top 74%",
          toggleActions: "play none none none",
        },
      });

      lines.forEach((line) => {
        // Longer lines take longer to "write" — keeps the pace believable.
        const weight = Math.max(0.5, (line.textContent?.length ?? 40) / 90);
        tl.to(
          line,
          { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 0.9 * weight, ease: "none" },
          "+=0.12",
        );
      });

      if (stroke) {
        tl.to(stroke, { strokeDashoffset: 0, duration: 1.1, ease: "power1.inOut" }, "+=0.2");
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="letter" className="scene relative">
      <SectionHeading eyebrow="Scene ten" title="One last thing" />

      <Reveal delay={0.15} className="mx-auto mt-14 w-full max-w-3xl">
        <article
          data-letter-body
          className="letter-paper glass-strong relative overflow-hidden rounded-[1.75rem] px-7 py-12 sm:px-14 sm:py-16"
        >
          {/* Torn-edge highlight */}
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent"
          />

          {/* Heartbeat in the corner */}
          <LottieBox
            data={heart}
            className="pointer-events-none absolute top-5 right-5 h-14 w-14 opacity-60 sm:h-20 sm:w-20"
          />

          <p className="font-hand text-2xl text-accent sm:text-3xl">{friend.greeting},</p>

          <div className="mt-7 flex flex-col gap-6">
            {letter.paragraphs.map((p, i) => (
              <p
                key={i}
                data-line
                className="font-hand text-[1.4rem] leading-[1.7] text-fg/92 sm:text-[1.7rem] sm:leading-[1.65]"
                style={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
              >
                {p}
              </p>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-end gap-1">
            <span className="font-hand text-xl text-fg-muted sm:text-2xl">{letter.signOff}</span>

            <span className="relative inline-block">
              <span className="font-script text-4xl text-pink-soft sm:text-5xl">
                {letter.signature}
              </span>
              {/* Hand-drawn underline */}
              <svg
                viewBox="0 0 240 18"
                className="mt-1 h-4 w-full"
                fill="none"
                aria-hidden
                preserveAspectRatio="none"
              >
                <path
                  data-underline
                  d="M3 12c34-9 76 7 112 1s76-11 122-4"
                  stroke="#FF4D8D"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeDasharray="260"
                  strokeDashoffset="260"
                  opacity="0.85"
                />
              </svg>
            </span>
          </div>

          {/* Wax seal */}
          <div className="mt-10 flex items-center gap-4 border-t border-hairline pt-7">
            <span
              aria-hidden
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-lg"
              style={{
                background: "radial-gradient(circle at 32% 28%, #FF7FB0, #B03566)",
                boxShadow: "0 6px 18px -6px rgba(255,77,141,0.8), inset 0 1px 2px rgba(255,255,255,0.5)",
              }}
            >
              ❤
            </span>
            <p className="text-sm text-fg-faint italic">{letter.postscript}</p>
          </div>
        </article>
      </Reveal>

      {/* Closing flourish */}
      <Reveal delay={0.3} className="mt-16 flex flex-col items-center gap-3 text-center">
        <span className="h-10 w-px bg-gradient-to-b from-transparent via-pink/60 to-transparent" />
        <p className="font-display text-lg text-fg-muted italic sm:text-xl">
          Happy birthday, {friend.name}. Here&rsquo;s to another trip around the sun.
        </p>
      </Reveal>
    </section>
  );
}
