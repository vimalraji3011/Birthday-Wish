"use client";

/**
 * Floating balloons. Positions are a fixed table rather than random so the
 * server and client markup always agree.
 */

type Balloon = {
  left: number;
  size: number;
  hue: [string, string];
  delay: number;
  duration: number;
  opacity: number;
  bottom: number;
};

const PINK: [string, string] = ["#FF7FB0", "#E32E6C"];
const GOLD: [string, string] = ["#FFE1A0", "#F2A93B"];
const PURPLE: [string, string] = ["#B79BFF", "#6C3BE8"];

/**
 * Kept to the outer thirds on purpose — anything drifting through the middle
 * ends up floating behind the headline and muddying the type.
 */
const BALLOONS: Balloon[] = [
  { left: 4, size: 62, hue: PINK, delay: 0, duration: 9, opacity: 0.85, bottom: 8 },
  { left: 14, size: 42, hue: GOLD, delay: 1.6, duration: 11, opacity: 0.6, bottom: 24 },
  { left: 23, size: 30, hue: PURPLE, delay: 3.1, duration: 13, opacity: 0.4, bottom: 46 },
  { left: 8, size: 24, hue: PURPLE, delay: 6.8, duration: 16, opacity: 0.26, bottom: 66 },
  { left: 80, size: 56, hue: PURPLE, delay: 0.8, duration: 10, opacity: 0.8, bottom: 10 },
  { left: 90, size: 46, hue: PINK, delay: 2.4, duration: 12, opacity: 0.62, bottom: 30 },
  { left: 74, size: 30, hue: GOLD, delay: 4.2, duration: 14, opacity: 0.4, bottom: 50 },
  { left: 88, size: 24, hue: PINK, delay: 5.5, duration: 15, opacity: 0.26, bottom: 68 },
];

function Balloon({ balloon, released }: { balloon: Balloon; released: boolean }) {
  const { size, hue, delay, duration, opacity, left, bottom } = balloon;
  const id = `balloon-${left}-${size}`;

  return (
    <div
      className="absolute"
      style={{
        left: `${left}%`,
        bottom: `${bottom}%`,
        opacity,
        animation: released
          ? `balloon-release ${4 + (delay % 3)}s cubic-bezier(0.4,0,0.7,1) ${delay * 0.12}s forwards`
          : undefined,
      }}
    >
      <div
        className="animate-balloon relative"
        style={{ animationDelay: `${-delay}s`, animationDuration: `${duration}s` }}
      >
        {/* Glow as a gradient, not a drop-shadow filter: a filtered layer that
            moves every frame has to be re-rasterised every frame. */}
        <span
          className="absolute rounded-full"
          style={{
            left: "50%",
            top: `${size * 0.34}px`,
            width: size * 1.7,
            height: size * 1.7,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${hue[1]}55 0%, ${hue[1]}22 38%, transparent 68%)`,
          }}
        />
        <svg
          width={size}
          height={size * 1.62}
          viewBox="0 0 60 97"
          fill="none"
          className="relative"
        >
          <defs>
            <radialGradient id={id} cx="35%" cy="28%" r="78%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="26%" stopColor={hue[0]} />
              <stop offset="100%" stopColor={hue[1]} />
            </radialGradient>
          </defs>

          {/* body */}
          <ellipse cx="30" cy="33" rx="27" ry="32" fill={`url(#${id})`} />
          {/* knot */}
          <path d="M27 64.5h6l-3 5z" fill={hue[1]} />
          {/* string */}
          <path
            d="M30 69c4 5-4 8 0 13s-3 8 0 14"
            stroke={hue[1]}
            strokeOpacity="0.5"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          {/* specular highlight */}
          <ellipse cx="20" cy="20" rx="6.5" ry="9" fill="#fff" opacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

export default function Balloons({
  released = false,
  className = "",
}: {
  /** Set once the gift opens — the whole bunch flies off screen. */
  released?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {BALLOONS.map((b) => (
        <Balloon key={`${b.left}-${b.size}`} balloon={b} released={released} />
      ))}
    </div>
  );
}
