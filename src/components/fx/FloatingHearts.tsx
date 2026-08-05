"use client";

/** Hearts drifting up through a section. Fixed table keeps SSR/CSR in sync. */

const HEARTS = [
  { left: 8, size: 18, delay: 0, duration: 13, color: "#FF4D8D", opacity: 0.5 },
  { left: 21, size: 12, delay: 2.4, duration: 16, color: "#FF85B3", opacity: 0.38 },
  { left: 34, size: 22, delay: 5.1, duration: 12, color: "#FF4D8D", opacity: 0.32 },
  { left: 47, size: 14, delay: 7.8, duration: 15, color: "#FFD166", opacity: 0.3 },
  { left: 60, size: 19, delay: 1.2, duration: 14, color: "#8A5CFF", opacity: 0.34 },
  { left: 72, size: 13, delay: 3.9, duration: 17, color: "#FF85B3", opacity: 0.4 },
  { left: 84, size: 24, delay: 6.4, duration: 12.5, color: "#FF4D8D", opacity: 0.28 },
  { left: 93, size: 15, delay: 9.2, duration: 15.5, color: "#B799FF", opacity: 0.36 },
];

export default function FloatingHearts({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {HEARTS.map((h) => (
        <div
          key={h.left}
          className="animate-heart-up absolute bottom-0 leading-none"
          style={{
            left: `${h.left}%`,
            animationDelay: `${-h.delay}s`,
            animationDuration: `${h.duration}s`,
            opacity: h.opacity,
          }}
        >
          {/* Gradient halo rather than a drop-shadow — see Balloons.tsx */}
          <span
            className="absolute rounded-full"
            style={{
              left: "50%",
              top: "50%",
              width: h.size * 3,
              height: h.size * 3,
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle, ${h.color}66 0%, transparent 62%)`,
            }}
          />
          <svg
            width={h.size}
            height={h.size}
            viewBox="0 0 24 24"
            className="relative"
          >
            <path
              d="M12 21s-7.6-4.9-9.4-9.2C1 8.2 3 4.8 6.4 4.4 8.7 4.1 10.8 5.4 12 7.2c1.2-1.8 3.3-3.1 5.6-2.8 3.4.4 5.4 3.8 3.8 7.4C19.6 16.1 12 21 12 21Z"
              fill={h.color}
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
