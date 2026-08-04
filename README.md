# Birthday Wish

A cinematic, single-page birthday surprise — ten scenes of starlight, confetti,
memories and a handwritten letter.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4, Framer Motion,
GSAP ScrollTrigger, canvas-confetti and Lottie.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build && npm start   # production
npm run typecheck            # tsc --noEmit
```

## Make it yours

Everything the visitor reads or sees lives in **[`src/config/content.ts`](src/config/content.ts)**.
Nothing else needs editing to personalise the surprise.

| What | Where |
| --- | --- |
| Their name, greeting, page title | `friend` |
| Hero headline and sub | `welcome` |
| Typewriter message (Scene 3) | `typedMessage` |
| Photo captions and dates (Scene 5) | `memories` |
| Timeline entries (Scene 6) | `timeline` |
| Flip-card reasons (Scene 7) | `reasons` |
| The closing letter (Scene 10) | `letter` |
| Page title / description for link previews | `seo` |

### Swapping in real photos

1. Drop your images into `public/memories/`.
2. Point each `src` in `memories` at them, e.g. `/memories/goa-trip.jpg`.
3. Keep roughly the listed aspect ratio (`tall` ≈ 3:4, `wide` ≈ 16:10, `square`)
   so the mosaic stays balanced.

The site ships with six abstract bokeh placeholders so it looks finished out of
the box. Regenerate or restyle them with:

```bash
node scripts/generate-memories.mjs public/memories
```

## The music

There is no audio file. "Happy Birthday to You" (public domain) is synthesised
at runtime in [`src/lib/music.ts`](src/lib/music.ts) using the Web Audio API —
nothing to download, nothing to license, and it shifts from a music-box
arrangement to a party arrangement when the candles go out.

Per browser autoplay rules, the AudioContext is only created when the visitor
opens the gift box. Play/pause, volume and mute live in the top-right dock.

## Notes for future edits

A few decisions here are load-bearing for performance — the page went from 2fps
to 60fps by fixing exactly these, so be wary of reintroducing them:

- **Never animate a `transform` on an element carrying `filter: blur()` or
  `drop-shadow()`.** Every frame has to re-rasterise the filtered layer. Use a
  `radial-gradient` (already soft, no filter) and animate translate only. See
  `@keyframes bloom-drift` in `globals.css`, plus `Balloons.tsx` /
  `FloatingHearts.tsx`.
- **Don't call `createRadialGradient` per particle per frame.** Bake glows into
  cached offscreen canvases instead — [`src/lib/glow.ts`](src/lib/glow.ts).
- The two `Fireworks` canvases park their `requestAnimationFrame` loop when
  there is nothing to draw, rather than compositing a full-screen layer forever.
- Prefer opacity-only keyframes for anything carrying a `box-shadow`.

Decorative motion is gated behind `prefers-reduced-motion` throughout, and the
whole page is server-rendered so the copy is present for crawlers and previews.
