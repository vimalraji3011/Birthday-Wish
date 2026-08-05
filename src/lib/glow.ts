/**
 * Cached glow sprites for the particle canvases.
 *
 * Calling `createRadialGradient` once per particle per frame is the classic
 * canvas bottleneck — with a few hundred sparks on screen it alone can drag the
 * frame rate into the teens. Instead we bake each colour into a small offscreen
 * canvas once and `drawImage` it, which is a cheap blit.
 *
 * Hue/sat/light are quantised so the cache stays small (a few dozen sprites at
 * most) no matter how much colour variation the callers ask for.
 */

const SIZE = 64;
const cache = new Map<string, HTMLCanvasElement>();

export function glowSprite(hue: number, sat = 100, light = 70): HTMLCanvasElement {
  const h = Math.round((((hue % 360) + 360) % 360) / 10) * 10;
  const s = Math.round(sat / 25) * 25;
  const l = Math.round(light / 10) * 10;
  const key = `${h}:${s}:${l}`;

  const hit = cache.get(key);
  if (hit) return hit;

  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const mid = SIZE / 2;
    const g = ctx.createRadialGradient(mid, mid, 0, mid, mid, mid);
    g.addColorStop(0, `hsla(${h}, ${s}%, ${Math.min(100, l + 24)}%, 1)`);
    g.addColorStop(0.22, `hsla(${h}, ${s}%, ${l}%, 0.9)`);
    g.addColorStop(0.55, `hsla(${h}, ${s}%, ${l}%, 0.28)`);
    g.addColorStop(1, `hsla(${h}, ${s}%, ${l}%, 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, SIZE, SIZE);
  }

  cache.set(key, canvas);
  return canvas;
}

/** Blit a sprite centred on (x, y) at the given radius. */
export function drawGlow(
  ctx: CanvasRenderingContext2D,
  sprite: HTMLCanvasElement,
  x: number,
  y: number,
  radius: number,
  alpha: number,
) {
  if (alpha <= 0 || radius <= 0) return;
  ctx.globalAlpha = alpha > 1 ? 1 : alpha;
  ctx.drawImage(sprite, x - radius, y - radius, radius * 2, radius * 2);
  ctx.globalAlpha = 1;
}
