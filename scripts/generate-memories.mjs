import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const OUT = process.argv[2];
mkdirSync(OUT, { recursive: true });

// Deterministic PRNG so re-running produces identical art.
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const SPECS = [
  { name: "memory-1", w: 900, h: 1200, seed: 11, sky: ["#1B1038", "#3D1740", "#0B1026"], lights: ["#FFD166", "#FF85B3", "#FFE4A8"] },
  { name: "memory-2", w: 1400, h: 900, seed: 27, sky: ["#2A1259", "#4A1A5C", "#0B1026"], lights: ["#FFD166", "#FFFFFF", "#FFB347"] },
  { name: "memory-3", w: 1100, h: 1100, seed: 43, sky: ["#12123C", "#45143F", "#090D22"], lights: ["#FF4D8D", "#FFD166", "#FF85B3"] },
  { name: "memory-4", w: 1400, h: 900, seed: 61, sky: ["#0E1440", "#2E1A6B", "#0B1026"], lights: ["#8A5CFF", "#FF4D8D", "#B799FF"] },
  { name: "memory-5", w: 900, h: 1200, seed: 79, sky: ["#2B1526", "#4D2418", "#120A18"], lights: ["#FFD166", "#FFAA5C", "#FFE4A8"] },
  { name: "memory-6", w: 1100, h: 1100, seed: 97, sky: ["#101538", "#1E2A6B", "#070A1C"], lights: ["#B799FF", "#FFFFFF", "#FF85B3"] },
];

function svgFor({ w, h, seed, sky, lights }) {
  const r = rng(seed);
  const pick = (arr) => arr[Math.floor(r() * arr.length)];

  // Large diffuse colour fields.
  let blooms = "";
  for (let i = 0; i < 4; i += 1) {
    const cx = r() * w;
    const cy = r() * h;
    const rad = (0.35 + r() * 0.45) * Math.max(w, h);
    blooms += `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${rad.toFixed(0)}" fill="${pick(lights)}" opacity="${(0.1 + r() * 0.14).toFixed(3)}"/>`;
  }

  // Far bokeh: small, dense, heavily blurred.
  let far = "";
  for (let i = 0; i < 70; i += 1) {
    const rad = 4 + r() * 16;
    far += `<circle cx="${(r() * w).toFixed(0)}" cy="${(r() * h).toFixed(0)}" r="${rad.toFixed(1)}" fill="${pick(lights)}" opacity="${(0.18 + r() * 0.35).toFixed(3)}"/>`;
  }

  // Near bokeh: big soft orbs with a brighter rim, like a fast lens wide open.
  let near = "";
  for (let i = 0; i < 22; i += 1) {
    const rad = 26 + r() * 90;
    const cx = r() * w;
    const cy = r() * h;
    const col = pick(lights);
    const op = (0.1 + r() * 0.3).toFixed(3);
    near += `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${rad.toFixed(0)}" fill="${col}" opacity="${op}"/>`;
    near += `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${rad.toFixed(0)}" fill="none" stroke="${col}" stroke-width="${(rad * 0.1).toFixed(1)}" opacity="${(Number(op) * 0.9).toFixed(3)}"/>`;
  }

  // A single anamorphic light streak for cinematic flavour.
  const streakY = h * (0.25 + r() * 0.5);
  const angle = -18 + r() * 36;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0.7" y2="1">
      <stop offset="0%" stop-color="${sky[0]}"/>
      <stop offset="55%" stop-color="${sky[1]}"/>
      <stop offset="100%" stop-color="${sky[2]}"/>
    </linearGradient>
    <radialGradient id="vig" cx="50%" cy="45%" r="75%">
      <stop offset="55%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.55"/>
    </radialGradient>
    <linearGradient id="streak" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0"/>
      <stop offset="50%" stop-color="#FFE4A8" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <filter id="soft" x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur stdDeviation="${(Math.max(w, h) * 0.035).toFixed(1)}"/>
    </filter>
    <filter id="mid" x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur stdDeviation="${(Math.max(w, h) * 0.012).toFixed(1)}"/>
    </filter>
    <filter id="light" x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur stdDeviation="${(Math.max(w, h) * 0.006).toFixed(1)}"/>
    </filter>
  </defs>

  <rect width="${w}" height="${h}" fill="url(#sky)"/>
  <g filter="url(#soft)">${blooms}</g>
  <g filter="url(#mid)">${near}</g>
  <g filter="url(#light)">${far}</g>
  <g transform="rotate(${angle.toFixed(1)} ${(w / 2).toFixed(0)} ${streakY.toFixed(0)})" filter="url(#mid)">
    <rect x="${(-w * 0.2).toFixed(0)}" y="${(streakY - h * 0.012).toFixed(0)}" width="${(w * 1.4).toFixed(0)}" height="${(h * 0.024).toFixed(0)}" fill="url(#streak)"/>
  </g>
  <rect width="${w}" height="${h}" fill="url(#vig)"/>
</svg>`;
}

for (const spec of SPECS) {
  const svg = svgFor(spec);
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(OUT, `${spec.name}.jpg`));
  console.log("wrote", spec.name, `${spec.w}x${spec.h}`);
}
