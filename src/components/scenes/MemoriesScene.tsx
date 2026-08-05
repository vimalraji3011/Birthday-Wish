"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { memories, type Memory } from "@/config/content";

const SPAN: Record<Memory["span"], string> = {
  tall: "sm:col-span-1 sm:row-span-2 aspect-3/4",
  wide: "sm:col-span-2 sm:row-span-1 aspect-16/10",
  square: "sm:col-span-1 sm:row-span-1 aspect-square",
};

export default function MemoriesScene() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Each tile's image drifts inside its frame as the section passes by.
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el, i) => {
        const depth = i % 2 === 0 ? 14 : 22;
        gsap.fromTo(
          el,
          { yPercent: -depth / 2 },
          {
            yPercent: depth / 2,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest("[data-tile]") ?? el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="memories" className="scene relative">
      <SectionHeading
        eyebrow="Scene five"
        title="Moments I kept"
        sub="A few frames from the reel that plays in my head whenever someone mentions your name."
      />

      {/* Dense flow so the mixed tile sizes pack without leaving holes */}
      <div className="mx-auto mt-16 grid max-w-6xl auto-rows-[minmax(0,1fr)] grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
        {memories.map((m, i) => (
          <Reveal
            key={m.src}
            delay={(i % 3) * 0.1}
            amount={0.2}
            className={`group relative ${SPAN[m.span]}`}
          >
            <figure
              data-tile
              data-cursor="grow"
              className="relative h-full w-full overflow-hidden rounded-[1.4rem] border border-hairline bg-surface-lift/30 shadow-[0_24px_60px_-30px_rgba(5,8,26,0.9)] transition-all duration-700 group-hover:-translate-y-1.5 group-hover:border-pink/45 group-hover:shadow-[0_0_0_1px_rgba(255,77,141,0.35),0_30px_70px_-28px_rgba(255,77,141,0.5)]"
            >
              {/* Oversized so the parallax drift never exposes an edge */}
              <div data-parallax className="absolute inset-0 -top-[12%] h-[124%] w-full">
                <Image
                  src={m.src}
                  alt={m.alt}
                  fill
                  loading={i < 2 ? "eager" : "lazy"}
                  priority={i === 0}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.07]"
                />
              </div>

              {/* Legibility scrim, deepens on hover */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-surface-deep/92 via-surface-deep/25 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100"
              />

              {/* Sweeping shine */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/18 to-transparent transition-transform duration-[1.1s] ease-out group-hover:translate-x-full"
              />

              <figcaption className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1.5 p-5 sm:p-6">
                <span className="text-[0.62rem] tracking-[0.26em] text-gold uppercase">
                  {m.date}
                </span>
                <span className="font-display text-lg leading-snug text-white transition-transform duration-500 group-hover:translate-x-0.5 sm:text-xl">
                  {m.caption}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
