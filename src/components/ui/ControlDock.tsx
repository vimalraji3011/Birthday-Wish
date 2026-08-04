"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useExperience } from "@/components/providers/ExperienceProvider";

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4.2" fill="currentColor" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="12"
          y1="2.6"
          x2="12"
          y2="5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden>
      <path
        d="M20 14.2A8.2 8.2 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M8 5.4v13.2l11-6.6z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
      <rect x="7" y="5" width="3.6" height="14" rx="1.4" fill="currentColor" />
      <rect x="13.4" y="5" width="3.6" height="14" rx="1.4" fill="currentColor" />
    </svg>
  );
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden>
      <path d="M4 9.5h3.2L12 5.6v12.8L7.2 14.5H4z" fill="currentColor" />
      {muted ? (
        <>
          <line
            x1="15.5"
            y1="9.5"
            x2="20.5"
            y2="14.5"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          <line
            x1="20.5"
            y1="9.5"
            x2="15.5"
            y2="14.5"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <path
            d="M15.4 9.2a3.8 3.8 0 0 1 0 5.6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M18 7a7 7 0 0 1 0 10"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

const btn =
  "grid h-10 w-10 shrink-0 place-items-center rounded-full text-fg/85 transition duration-300 hover:text-fg hover:bg-white/10 active:scale-92 light:hover:bg-black/5";

/**
 * Fixed dock holding the music transport and the theme switch. The music half
 * only appears once the gift has been opened — that's when the song starts.
 */
export default function ControlDock() {
  const { theme, toggleTheme, music, giftOpened } = useExperience();
  const [sliderOpen, setSliderOpen] = useState(false);

  const fill = `${Math.round((music.muted ? 0 : music.volume) * 100)}%`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 right-4 z-40 flex items-center gap-1.5 sm:top-6 sm:right-6"
    >
      <div className="glass flex items-center gap-1 rounded-full p-1.5">
        <AnimatePresence initial={false}>
          {giftOpened ? (
            <motion.div
              key="music"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-1 overflow-hidden"
            >
              <button
                type="button"
                onClick={music.toggle}
                className={btn}
                aria-label={music.playing ? "Pause music" : "Play music"}
                title={music.playing ? "Pause music" : "Play music"}
              >
                {music.playing ? <PauseIcon /> : <PlayIcon />}
              </button>

              <button
                type="button"
                onClick={music.toggleMute}
                onFocus={() => setSliderOpen(true)}
                onMouseEnter={() => setSliderOpen(true)}
                className={btn}
                aria-label={music.muted ? "Unmute" : "Mute"}
                title={music.muted ? "Unmute" : "Mute"}
              >
                <SpeakerIcon muted={music.muted} />
              </button>

              <div
                onMouseEnter={() => setSliderOpen(true)}
                onMouseLeave={() => setSliderOpen(false)}
                className={`overflow-hidden transition-all duration-500 ease-out ${
                  sliderOpen ? "w-24 opacity-100" : "w-0 opacity-0"
                }`}
              >
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={music.muted ? 0 : music.volume}
                  onChange={(e) => music.setVolume(Number(e.target.value))}
                  className="volume-slider mx-2 w-20"
                  style={{ "--fill": fill } as React.CSSProperties}
                  aria-label="Volume"
                />
              </div>

              <span className="mx-0.5 h-5 w-px bg-hairline" />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <button
          type="button"
          onClick={toggleTheme}
          className={btn}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <motion.span
            key={theme}
            initial={{ rotate: -70, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="grid place-items-center"
          >
            {theme === "dark" ? <MoonIcon /> : <SunIcon />}
          </motion.span>
        </button>
      </div>
    </motion.div>
  );
}
