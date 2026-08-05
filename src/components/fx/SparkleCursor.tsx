"use client";

import { useEffect, useRef, useState } from "react";
import { drawGlow, glowSprite } from "@/lib/glow";

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  sprite: HTMLCanvasElement;
};

const HUES = [340, 45, 265, 320];

/**
 * Custom pointer: a soft ring that trails the cursor and leaves sparkles behind.
 * Only engages for fine pointers, and never when reduced motion is requested —
 * a touch device keeps its native behaviour.
 */
export default function SparkleCursor() {
  const [enabled, setEnabled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => setEnabled(fine.matches && !calm.matches);
    decide();
    fine.addEventListener("change", decide);
    calm.addEventListener("change", decide);
    return () => {
      fine.removeEventListener("change", decide);
      calm.removeEventListener("change", decide);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove("cursor-sparkle");
      return;
    }
    document.body.classList.add("cursor-sparkle");

    const canvas = canvasRef.current;
    const ring = ringRef.current;
    if (!canvas || !ring) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = 1;
    let raf = 0;
    let needsClear = false;
    let sparks: Spark[] = [];

    const pointer = { x: -100, y: -100 };
    const eased = { x: -100, y: -100 };
    let lastEmit = 0;
    let lastHitTest = 0;
    let over = false;
    let down = false;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const emit = (count: number, spread: number) => {
      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * spread;
        sparks.push({
          x: pointer.x,
          y: pointer.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.35,
          life: 0,
          max: 520 + Math.random() * 420,
          size: Math.random() * 2 + 1,
          sprite: glowSprite(HUES[Math.floor(Math.random() * HUES.length)], 100, 80),
        });
      }
      // Keep the trail bounded so a frantic mouse can't tank the frame rate.
      if (sparks.length > 220) sparks = sparks.slice(-220);
    };

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - pointer.x;
      const dy = e.clientY - pointer.y;
      pointer.x = e.clientX;
      pointer.y = e.clientY;

      const speed = Math.hypot(dx, dy);
      const now = performance.now();
      if (speed > 2 && now - lastEmit > 16) {
        lastEmit = now;
        emit(speed > 26 ? 3 : 1, 0.7);
      }

      // Hit-testing every move is wasteful at high polling rates.
      if (now - lastHitTest > 80) {
        lastHitTest = now;
        const el = document.elementFromPoint(e.clientX, e.clientY);
        over = Boolean(
          el?.closest('a, button, input, [role="button"], summary, label, [data-cursor="grow"]'),
        );
      }
    };

    const onDown = () => {
      down = true;
      emit(16, 2.6);
    };
    const onUp = () => {
      down = false;
    };

    const draw = () => {
      eased.x += (pointer.x - eased.x) * 0.2;
      eased.y += (pointer.y - eased.y) * 0.2;

      const scale = over ? 2.1 : down ? 0.7 : 1;
      ring.style.transform = `translate3d(${eased.x}px, ${eased.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      ring.style.opacity = pointer.x < 0 ? "0" : "1";
      ring.style.borderColor = over ? "rgba(255,209,102,0.9)" : "rgba(255,77,141,0.75)";

      // Skip the full-viewport clear when the trail is already empty — the
      // pointer is often still for long stretches.
      if (sparks.length === 0) {
        if (needsClear) {
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          needsClear = false;
        }
        raf = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      needsClear = true;
      ctx.globalCompositeOperation = "lighter";

      sparks = sparks.filter((s) => s.life < s.max);
      for (const s of sparks) {
        s.life += 16;
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.014; // a touch of gravity so sparkles settle
        s.vx *= 0.985;

        const p = 1 - s.life / s.max;
        const alpha = p * p * 0.9;
        const r = s.size * (0.4 + p);

        drawGlow(ctx, s.sprite, s.x, s.y, r * 5, alpha);

        ctx.globalAlpha = alpha;
        ctx.fillStyle = "rgba(255, 250, 245, 1)";
        ctx.beginPath();
        ctx.arc(s.x, s.y, r * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.body.classList.remove("cursor-sparkle");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60]"
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[61] h-8 w-8 rounded-full border-2 transition-[border-color] duration-300 will-change-transform"
        style={{
          boxShadow: "0 0 18px rgba(255,77,141,0.45), inset 0 0 12px rgba(255,255,255,0.25)",
        }}
      />
    </>
  );
}
