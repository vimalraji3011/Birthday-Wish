"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { reasons } from "@/config/content";
import { popAt } from "@/lib/celebrate";

export default function ReasonsScene() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const toggle = (i: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const next = !flipped[i];
    setFlipped((prev) => ({ ...prev, [i]: next }));

    // A tiny pop of confetti the first time each card turns over.
    if (next) {
      const r = e.currentTarget.getBoundingClientRect();
      popAt(
        (r.left + r.width / 2) / window.innerWidth,
        (r.top + r.height / 2) / window.innerHeight,
        26,
      );
    }
  };

  return (
    <section id="reasons" className="scene relative">
      <SectionHeading
        eyebrow="Scene seven"
        title="Reasons you're amazing"
        sub="Six of them. There are more, but the page would never load."
      />

      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reasons.map((r, i) => {
          const isFlipped = Boolean(flipped[i]);
          return (
            <Reveal key={r.title} delay={(i % 3) * 0.09} amount={0.2}>
              <button
                type="button"
                onClick={(e) => toggle(i, e)}
                aria-pressed={isFlipped}
                aria-label={`${r.title} — ${isFlipped ? "hide" : "reveal"} the message`}
                data-cursor="grow"
                className="flip-scene h-64 w-full text-left focus-visible:outline-2 sm:h-72"
              >
                <div className="flip-inner" data-flipped={isFlipped}>
                  {/* Front */}
                  <div className="flip-face glass justify-between p-6 sm:p-7">
                    <span
                      aria-hidden
                      className="grid h-12 w-12 place-items-center rounded-2xl bg-white/8 text-2xl"
                      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)" }}
                    >
                      {r.glyph}
                    </span>

                    <div className="flex flex-col gap-2">
                      <h3 className="font-display text-2xl leading-snug text-fg">{r.title}</h3>
                      <p className="text-sm text-fg-faint">{r.teaser}</p>
                    </div>

                    <span className="flex items-center gap-2 text-[0.62rem] tracking-[0.24em] text-accent uppercase">
                      Tap to open
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
                        <path
                          d="M5 12h13m0 0-5-5m5 5-5 5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>

                    {/* Corner glow */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full bg-pink/25 blur-2xl"
                    />
                  </div>

                  {/* Back */}
                  {/* Opaque and saturated on purpose: the earlier translucent
                      wash left white text unreadable in light mode. */}
                  <div
                    className="flip-face flip-face-back justify-between border border-white/15 p-6 sm:p-7"
                    style={{
                      background:
                        "linear-gradient(150deg, #E8336F 0%, #A93FB4 52%, #6B44E0 100%)",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.28), 0 24px 60px -28px rgba(138,92,255,0.7)",
                    }}
                  >
                    <span className="text-[0.62rem] tracking-[0.24em] text-gold-soft uppercase">
                      {r.title}
                    </span>
                    <p className="font-display text-[1.02rem] leading-relaxed text-white sm:text-[1.1rem]">
                      {r.message}
                    </p>
                    <span className="text-sm text-white/80">— me, obviously</span>
                  </div>
                </div>
              </button>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
