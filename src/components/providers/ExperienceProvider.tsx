"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { BirthdayMusic, type MusicMode } from "@/lib/music";

export type Theme = "dark" | "light";
export type Stage = "loading" | "story";

type ExperienceValue = {
  stage: Stage;
  finishLoading: () => void;

  giftOpened: boolean;
  openGift: () => void;

  candlesBlown: boolean;
  blowCandles: () => void;

  theme: Theme;
  toggleTheme: () => void;

  music: {
    ready: boolean;
    playing: boolean;
    volume: number;
    muted: boolean;
    mode: MusicMode;
    toggle: () => void;
    start: () => void;
    setVolume: (v: number) => void;
    toggleMute: () => void;
    setMode: (m: MusicMode) => void;
  };
};

const ExperienceContext = createContext<ExperienceValue | null>(null);

const THEME_KEY = "bw-theme";

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<Stage>("loading");
  const [giftOpened, setGiftOpened] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");

  const engine = useRef<BirthdayMusic | null>(null);
  const [musicReady, setMusicReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [mode, setModeState] = useState<MusicMode>("gentle");

  // Pick up the theme the inline boot script already applied.
  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      return;
    }
    setTheme(document.documentElement.classList.contains("light") ? "light" : "dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "light" ? "#FFF5F8" : "#0B1026");
  }, [theme]);

  useEffect(() => {
    return () => engine.current?.dispose();
  }, []);

  const getEngine = useCallback(() => {
    if (!engine.current) engine.current = new BirthdayMusic();
    return engine.current;
  }, []);

  const start = useCallback(() => {
    const m = getEngine();
    m.setVolume(volume);
    m.setMuted(muted);
    void m.play().then(() => {
      setMusicReady(true);
      setPlaying(m.playing);
    });
  }, [getEngine, muted, volume]);

  const toggle = useCallback(() => {
    const m = getEngine();
    if (m.playing) {
      m.pause();
      setPlaying(false);
    } else {
      void m.play().then(() => {
        setMusicReady(true);
        setPlaying(m.playing);
      });
    }
  }, [getEngine]);

  const setVolume = useCallback(
    (v: number) => {
      setVolumeState(v);
      if (v > 0) setMuted(false);
      engine.current?.setVolume(v);
    },
    [],
  );

  const toggleMute = useCallback(() => {
    const next = !muted;
    setMuted(next);
    engine.current?.setMuted(next);
  }, [muted]);

  const setMode = useCallback((m: MusicMode) => {
    setModeState(m);
    engine.current?.setMode(m);
  }, []);

  const openGift = useCallback(() => {
    if (giftOpened) return;
    setGiftOpened(true);
    start();
  }, [giftOpened, start]);

  const blowCandles = useCallback(() => {
    if (candlesBlown) return;
    setCandlesBlown(true);
    // The party arrangement kicks in for the fireworks finale.
    setMode("party");
  }, [candlesBlown, setMode]);

  const value = useMemo<ExperienceValue>(
    () => ({
      stage,
      finishLoading: () => setStage("story"),
      giftOpened,
      openGift,
      candlesBlown,
      blowCandles,
      theme,
      toggleTheme: () => {
        const next: Theme = theme === "dark" ? "light" : "dark";
        window.localStorage.setItem(THEME_KEY, next);
        setTheme(next);
      },
      music: {
        ready: musicReady,
        playing,
        volume,
        muted,
        mode,
        toggle,
        start,
        setVolume,
        toggleMute,
        setMode,
      },
    }),
    [
      stage,
      giftOpened,
      openGift,
      candlesBlown,
      blowCandles,
      theme,
      musicReady,
      playing,
      volume,
      muted,
      mode,
      toggle,
      start,
      setVolume,
      toggleMute,
      setMode,
    ],
  );

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}

export function useExperience() {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error("useExperience must be used inside <ExperienceProvider>");
  return ctx;
}
