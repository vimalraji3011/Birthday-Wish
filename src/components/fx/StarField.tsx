"use client";

import { useEffect, useRef } from "react";
import { useExperience } from "@/components/providers/ExperienceProvider";
import { drawGlow, glowSprite } from "@/lib/glow";

type Star = {
  x: number;
  y: number;
  r: number;
  base: number;
  phase: number;
  speed: number;
  depth: number;
};

type Dust = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  life: number;
  sprite: HTMLCanvasElement;
};

const HUES = [340, 45, 265];

/**
 * The persistent backdrop: a twinkling star layer plus slow glowing dust that
 * drifts away from the pointer. One canvas, fixed behind everything.
 */
export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useExperience();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let stars: Star[] = [];
    let dust: Dust[] = [];
    let raf = 0;
    let t = 0;

    const pointer = { x: -9999, y: -9999, active: false };
    const parallax = { x: 0, y: 0, tx: 0, ty: 0 };
    // Warm halo shared by every bright star.
    const halo = glowSprite(44, 100, 82);

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      // Repaints the whole viewport every frame, so extra device pixels are the
      // single biggest cost here. Soft glows look fine at 1x.
      dpr = 1;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = width * height;
      const starCount = Math.min(210, Math.round(area / 9000));
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.15 + 0.35,
        base: Math.random() * 0.5 + 0.35,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.9 + 0.35,
        depth: Math.random() * 0.7 + 0.3,
      }));

      const dustCount = calm ? 0 : Math.min(46, Math.round(area / 34000));
      dust = Array.from({ length: dustCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.4 + 1.1,
        vx: (Math.random() - 0.5) * 0.16,
        vy: -(Math.random() * 0.22 + 0.05),
        life: Math.random(),
        sprite: glowSprite(HUES[Math.floor(Math.random() * HUES.length)], 100, 72),
      }));
    };

    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      parallax.tx = (e.clientX / window.innerWidth - 0.5) * 26;
      parallax.ty = (e.clientY / window.innerHeight - 0.5) * 18;
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
      parallax.tx = 0;
      parallax.ty = 0;
    };

    const draw = () => {
      const light = themeRef.current === "light";
      t += calm ? 0 : 0.008;

      parallax.x += (parallax.tx - parallax.x) * 0.05;
      parallax.y += (parallax.ty - parallax.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Stars
      ctx.fillStyle = light ? "rgb(138, 92, 255)" : "rgb(255, 255, 255)";
      for (const s of stars) {
        const twinkle = calm ? 1 : 0.55 + 0.45 * Math.sin(t * s.speed * 2.2 + s.phase);
        const alpha = s.base * twinkle * (light ? 0.5 : 1);
        const x = s.x + parallax.x * s.depth;
        const y = s.y + parallax.y * s.depth;

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Bigger stars get a soft halo.
        if (s.r > 1.15) {
          drawGlow(ctx, halo, x, y, s.r * 7, alpha * 0.4);
        }
      }

      // Glowing dust that shies away from the cursor
      for (const p of dust) {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.004;

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 26000 && d2 > 1) {
            const d = Math.sqrt(d2);
            const push = (1 - d / 162) * 0.9;
            p.x += (dx / d) * push;
            p.y += (dy / d) * push;
          }
        }

        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        const pulse = 0.45 + 0.55 * Math.sin(p.life * 2.4);
        drawGlow(ctx, p.sprite, p.x, p.y, p.r * 6, pulse * (light ? 0.3 : 0.55));
      }

      raf = requestAnimationFrame(draw);
    };

    build();
    draw();

    const ro = new ResizeObserver(build);
    ro.observe(canvas);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base wash */}
      <div className="absolute inset-0 bg-surface transition-colors duration-700" />

      {/* Aurora blooms */}
      <div className="bloom bloom-purple -top-32 -left-24 h-[42rem] w-[42rem]" />
      <div
        className="bloom bloom-pink top-1/5 -right-32 h-[38rem] w-[38rem]"
        style={{ animationDelay: "-9s" }}
      />
      <div
        className="bloom bloom-gold bottom-0 left-1/5 h-[34rem] w-[34rem]"
        style={{ animationDelay: "-18s" }}
      />

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Vignette keeps text legible over the brightest blooms */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(5,8,26,0.45)_100%)] light:bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(255,233,241,0.6)_100%)]" />
    </div>
  );
}
