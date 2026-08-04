"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { timeline } from "@/config/content";

/**
 * Vertical timeline. The glowing spine is drawn by GSAP as you scroll, and each
 * card fades in from its own side on desktop.
 */
export default function TimelineScene() {
  const rootRef = useRef<HTMLElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const line = lineRef.current;
    const track = trackRef.current;
    if (!root || !line || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      line.style.transform = "scaleY(1)";
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: track,
            start: "top 72%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        },
      );

      // Nodes light up as the spine reaches them.
      gsap.utils.toArray<HTMLElement>("[data-node]").forEach((node) => {
        gsap.fromTo(
          node,
          { scale: 0.5, opacity: 0.3 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(2.2)",
            scrollTrigger: { trigger: node, start: "top 78%", toggleActions: "play none none reverse" },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="timeline" className="scene relative">
      <SectionHeading
        eyebrow="Scene six"
        title="Our story, in order"
        sub="Everything that got us from strangers to this."
      />

      <div ref={trackRef} className="relative mx-auto mt-16 max-w-4xl pb-4">
        {/* Spine — left rail on mobile, centred on desktop */}
        <div
          aria-hidden
          className="absolute top-0 bottom-0 left-[19px] w-[2px] overflow-hidden rounded-full bg-hairline sm:left-1/2 sm:-translate-x-1/2"
        >
          <div
            ref={lineRef}
            className="h-full w-full origin-top bg-gradient-to-b from-gold via-pink to-purple shadow-[0_0_14px_rgba(255,77,141,0.65)]"
            style={{ transform: "scaleY(0)" }}
          />
        </div>

        <ol className="flex flex-col gap-10 sm:gap-14">
          {timeline.map((entry, i) => {
            const right = i % 2 === 1;
            return (
              <li
                key={entry.title}
                className={`relative pl-14 sm:flex sm:pl-0 ${
                  right ? "sm:justify-end" : "sm:justify-start"
                }`}
              >
                {/* Node */}
                <span
                  data-node
                  className="glass-strong absolute top-1 left-0 z-10 grid h-10 w-10 place-items-center rounded-full text-lg sm:left-1/2 sm:-translate-x-1/2"
                  style={{ boxShadow: "0 0 0 1px rgba(255,209,102,0.35), 0 0 24px -4px rgba(255,77,141,0.6)" }}
                >
                  <span aria-hidden>{entry.glyph}</span>
                </span>

                {/* Connector from spine to card */}
                <span
                  aria-hidden
                  className={`absolute top-6 hidden h-px w-10 sm:block ${
                    right
                      ? "left-1/2 bg-gradient-to-r from-pink/60 to-transparent"
                      : "right-1/2 bg-gradient-to-l from-pink/60 to-transparent"
                  }`}
                />

                <Reveal
                  x={right ? 40 : -40}
                  y={20}
                  amount={0.3}
                  className="sm:w-[calc(50%-3.5rem)]"
                >
                  <article className="glass group rounded-2xl p-6 transition-all duration-500 hover:border-pink/40 sm:p-7">
                    {/* Stacked on narrow screens — a wrapping title beside the
                        date label reads as a broken row. */}
                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                      <h3 className="font-display text-xl text-fg sm:text-2xl">{entry.title}</h3>
                      <span className="shrink-0 text-[0.6rem] tracking-[0.2em] text-accent uppercase">
                        {entry.when}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-fg-muted sm:text-[0.95rem]">
                      {entry.body}
                    </p>
                    <span
                      aria-hidden
                      className="mt-5 block h-px w-0 bg-gradient-to-r from-pink to-transparent transition-all duration-700 group-hover:w-full"
                    />
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
