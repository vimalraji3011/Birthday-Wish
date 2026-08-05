import confetti from "canvas-confetti";

export const PALETTE = ["#FF4D8D", "#FFD166", "#8A5CFF", "#FFFFFF", "#FF85B3", "#B799FF"];

const HEART_PATH =
  "M12 21s-7.6-4.9-9.4-9.2C1 8.2 3 4.8 6.4 4.4 8.7 4.1 10.8 5.4 12 7.2c1.2-1.8 3.3-3.1 5.6-2.8 3.4.4 5.4 3.8 3.8 7.4C19.6 16.1 12 21 12 21Z";

let heartShape: confetti.Shape | null = null;

/**
 * Hearts and stars as vector shapes. Deliberately not `shapeFromText` with
 * emoji — that rasterises the system emoji font, which renders inconsistently
 * across platforms and smears badly at the scalars we want here.
 */
function shapes(): confetti.Shape[] {
  if (!heartShape) heartShape = confetti.shapeFromPath({ path: HEART_PATH });
  return [heartShape, "star"];
}

function reduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** The gift-box moment: a wide burst from the centre plus hearts and stars. */
export function giftBurst(origin: { x: number; y: number } = { x: 0.5, y: 0.5 }) {
  if (reduced()) {
    confetti({ particleCount: 40, spread: 70, origin, colors: PALETTE, disableForReducedMotion: false });
    return;
  }

  confetti({
    particleCount: 150,
    spread: 100,
    startVelocity: 45,
    origin,
    colors: PALETTE,
    scalar: 1.05,
    ticks: 190,
  });

  window.setTimeout(() => {
    confetti({
      particleCount: 24,
      spread: 120,
      startVelocity: 34,
      origin,
      shapes: shapes(),
      colors: ["#FF4D8D", "#FFD166", "#FF85B3"],
      scalar: 1.5,
      ticks: 210,
      gravity: 0.7,
    });
  }, 140);

  // Two low cannons framing the box.
  [0.12, 0.88].forEach((x, i) => {
    window.setTimeout(
      () =>
        confetti({
          particleCount: 60,
          angle: i === 0 ? 62 : 118,
          spread: 62,
          startVelocity: 52,
          origin: { x, y: 0.85 },
          colors: PALETTE,
          ticks: 190,
        }),
      220 + i * 110,
    );
  });
}

/** Slow, continuous confetti fall — used after the candles go out. */
export function confettiRain(durationMs = 6000) {
  if (reduced()) return () => {};
  const end = performance.now() + durationMs;
  let raf = 0;

  const frame = () => {
    confetti({
      particleCount: 2,
      startVelocity: 0,
      ticks: 260,
      gravity: 0.55,
      spread: 90,
      origin: { x: Math.random(), y: -0.05 },
      colors: PALETTE,
      scalar: 0.85,
      shapes: ["circle", "square"],
    });
    if (performance.now() < end) raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return () => cancelAnimationFrame(raf);
}

/** A single celebratory pop at an arbitrary screen position. */
export function popAt(x: number, y: number, particleCount = 60) {
  confetti({
    particleCount: reduced() ? 18 : particleCount,
    spread: 78,
    startVelocity: 32,
    origin: { x, y },
    colors: PALETTE,
    scalar: 0.95,
    ticks: 200,
  });
}

/** Golden shower for the fireworks finale. */
export function goldenShower() {
  if (reduced()) return;
  confetti({
    particleCount: 120,
    spread: 160,
    startVelocity: 55,
    origin: { x: 0.5, y: 0.62 },
    colors: ["#FFD166", "#FFE4A8", "#FFFFFF"],
    scalar: 1.1,
    ticks: 300,
  });
}
