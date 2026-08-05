"use client";

import { useEffect, useRef } from "react";
import { drawGlow, glowSprite } from "@/lib/glow";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  drag: number;
  sprite: HTMLCanvasElement;
};

type Rocket = {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  target: number;
  hue: number;
  gold: boolean;
  sprite: HTMLCanvasElement;
};

const HUES = [340, 45, 265, 315, 20];
const GRAVITY = 0.032;
const MAX_PARTICLES = 700;

/**
 * Rockets climb and burst into shells of sparks. The canvas is faded rather
 * than cleared each frame, which is what gives every spark its trail.
 */
export default function Fireworks({
  active,
  intensity = 1,
  className = "",
}: {
  active: boolean;
  /** Scales how often rockets launch. */
  intensity?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef(active);
  const intensityRef = useRef(intensity);
  const wakeRef = useRef<(() => void) | null>(null);
  activeRef.current = active;
  intensityRef.current = intensity;

  // Two of these canvases live on the page. Left running unconditionally they
  // composite a full-screen layer every frame for the entire visit, so the loop
  // parks itself whenever there is nothing left to draw.
  useEffect(() => {
    if (active) wakeRef.current?.();
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = false;
    let particles: Particle[] = [];
    let rockets: Rocket[] = [];
    let nextLaunch = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // This canvas fades AND additively blends the full viewport every frame,
      // so 1x is the right trade — soft glows hide the missing retina pixels.
      const dpr = 1;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spark = (
      x: number,
      y: number,
      vx: number,
      vy: number,
      max: number,
      size: number,
      hue: number,
      sat: number,
      light: number,
      drag: number,
    ) => {
      if (particles.length >= MAX_PARTICLES) return;
      particles.push({
        x,
        y,
        vx,
        vy,
        life: 0,
        max,
        size,
        drag,
        sprite: glowSprite(hue, sat, light),
      });
    };

    const launch = () => {
      const gold = Math.random() < 0.3;
      const hue = gold ? 45 : HUES[Math.floor(Math.random() * HUES.length)];
      const x = width * (0.12 + Math.random() * 0.76);
      const target = height * (0.14 + Math.random() * 0.34);
      rockets.push({
        x,
        y: height + 8,
        px: x,
        py: height + 8,
        vx: (Math.random() - 0.5) * 0.6,
        // Deliberately unhurried: a fast rocket covers so much ground per frame
        // that its trail breaks into visible dashes.
        vy: -((height - target) * 0.026 + 3),
        target,
        hue,
        gold,
        sprite: glowSprite(hue, 100, gold ? 76 : 72),
      });
    };

    const burst = (r: Rocket) => {
      const count = r.gold ? 78 : 52 + Math.floor(Math.random() * 26);
      const power = r.gold ? 5 : 4.1;

      // A ring reads far more like a firework than a random scatter.
      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.14;
        const speed = power * (0.55 + Math.random() * 0.6);
        spark(
          r.x,
          r.y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          88 + Math.random() * 58,
          Math.random() * 1.6 + 1,
          r.gold ? 45 : r.hue + (Math.random() - 0.5) * 24,
          r.gold ? 95 : 100,
          60 + Math.random() * 25,
          0.982,
        );
      }

      // Slow-fading bright flecks in the core.
      for (let i = 0; i < 12; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5;
        spark(
          r.x,
          r.y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          140 + Math.random() * 80,
          Math.random() * 1.1 + 0.6,
          45,
          100,
          92,
          1,
        );
      }
    };

    const draw = () => {
      // Nothing on screen and nothing coming: park the loop until woken.
      if (!activeRef.current && rockets.length === 0 && particles.length === 0) {
        ctx.clearRect(0, 0, width, height);
        running = false;
        return;
      }

      // Fade instead of clear — this is what makes the trails.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.16)";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      const now = performance.now();
      // Cap concurrent shells: overlapping bursts multiply cost without adding
      // much the eye can actually pick apart.
      if (activeRef.current && !calm && now > nextLaunch && rockets.length < 4) {
        launch();
        if (rockets.length < 3 && Math.random() < 0.25 * intensityRef.current) launch();
        nextLaunch = now + (520 + Math.random() * 700) / Math.max(0.3, intensityRef.current);
      }

      rockets = rockets.filter((r) => {
        r.px = r.x;
        r.py = r.y;
        r.x += r.vx;
        r.y += r.vy;
        r.vy += GRAVITY * 3.2;

        // Stroke the segment travelled so the trail stays continuous however
        // far the rocket moved this frame.
        ctx.lineCap = "round";
        ctx.strokeStyle = r.gold
          ? "rgba(255, 214, 130, 0.28)"
          : `hsla(${r.hue}, 100%, 72%, 0.26)`;
        ctx.lineWidth = 5.5;
        ctx.beginPath();
        ctx.moveTo(r.px, r.py);
        ctx.lineTo(r.x, r.y);
        ctx.stroke();

        ctx.strokeStyle = r.gold
          ? "rgba(255, 232, 176, 0.9)"
          : `hsla(${r.hue}, 100%, 82%, 0.85)`;
        ctx.lineWidth = 2.3;
        ctx.beginPath();
        ctx.moveTo(r.px, r.py);
        ctx.lineTo(r.x, r.y);
        ctx.stroke();

        drawGlow(ctx, r.sprite, r.x, r.y, 9, 0.95);

        // Embers scattered at random points along the segment. Spacing them
        // evenly makes the trail read as a mechanical dotted line.
        for (let i = 0; i < 2; i += 1) {
          if (Math.random() > 0.5) continue;
          const t = Math.random();
          spark(
            r.px + (r.x - r.px) * t + (Math.random() - 0.5) * 2.4,
            r.py + (r.y - r.py) * t,
            (Math.random() - 0.5) * 0.35,
            Math.random() * 0.45,
            22 + Math.random() * 16,
            0.7,
            r.gold ? 42 : r.hue,
            100,
            74,
            1,
          );
        }

        if (r.vy >= -0.6 || r.y <= r.target) {
          burst(r);
          return false;
        }
        return true;
      });

      particles = particles.filter((p) => p.life < p.max && p.y < height + 40);
      for (const p of particles) {
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += GRAVITY;
        if (p.drag !== 1) {
          p.vx *= p.drag;
          p.vy *= p.drag;
        }

        const t = 1 - p.life / p.max;
        drawGlow(ctx, p.sprite, p.x, p.y, p.size * (0.5 + t * 0.9) * 3.4, t * t * 0.95);
      }

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(draw);
    };

    const wake = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };

    resize();
    wakeRef.current = wake;
    if (activeRef.current) wake();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      running = false;
      wakeRef.current = null;
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
