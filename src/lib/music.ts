/**
 * A tiny Web Audio synthesiser that performs "Happy Birthday to You".
 *
 * Why synthesise instead of shipping an mp3?
 *  - no asset to go missing, no licence to worry about (the melody is public domain)
 *  - the arrangement can shift from music-box to party without a second download
 *  - the whole thing costs a few kB instead of a few megabytes
 */

export type MusicMode = "gentle" | "party";

/** Equal-tempered frequencies, A4 = 440Hz. */
const NOTES: Record<string, number> = {
  F2: 87.31,
  G2: 98.0,
  A2: 110.0,
  B2: 123.47,
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  G3: 196.0,
  A3: 220.0,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.26,
  F5: 698.46,
  G5: 783.99,
};

type Step = { note: string | null; beats: number };

/**
 * "Happy Birthday" in C major, 3/4 time — 24 beats, then a 3-beat breath
 * before it comes back around.
 */
const MELODY: Step[] = [
  // Happy birthday to you
  { note: "G4", beats: 0.75 },
  { note: "G4", beats: 0.25 },
  { note: "A4", beats: 1 },
  { note: "G4", beats: 1 },
  { note: "C5", beats: 1 },
  { note: "B4", beats: 2 },
  // Happy birthday to you
  { note: "G4", beats: 0.75 },
  { note: "G4", beats: 0.25 },
  { note: "A4", beats: 1 },
  { note: "G4", beats: 1 },
  { note: "D5", beats: 1 },
  { note: "C5", beats: 2 },
  // Happy birthday dear you
  { note: "G4", beats: 0.75 },
  { note: "G4", beats: 0.25 },
  { note: "G5", beats: 1 },
  { note: "E5", beats: 1 },
  { note: "C5", beats: 1 },
  { note: "B4", beats: 0.5 },
  { note: "A4", beats: 1.5 },
  // Happy birthday to you
  { note: "F5", beats: 0.75 },
  { note: "F5", beats: 0.25 },
  { note: "E5", beats: 1 },
  { note: "C5", beats: 1 },
  { note: "D5", beats: 1 },
  { note: "C5", beats: 2 },
  // breath before the reprise
  { note: null, beats: 3 },
];

/** One chord per bar (3 beats), matching the 9 bars above. */
const CHORDS: string[][] = [
  ["C3", "E3", "G3"],
  ["G2", "B2", "D3"],
  ["G2", "B2", "D3"],
  ["C3", "E3", "G3"],
  ["C3", "E3", "G3"],
  ["F2", "A2", "C3"],
  ["F2", "A2", "C3"],
  ["C3", "E3", "G3"],
  ["G2", "B2", "D3"],
];

const TEMPO: Record<MusicMode, number> = { gentle: 104, party: 142 };

const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD = 0.2;

type Ctor = typeof AudioContext;

function getAudioContextCtor(): Ctor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    AudioContext?: Ctor;
    webkitAudioContext?: Ctor;
  };
  return w.AudioContext ?? w.webkitAudioContext ?? null;
}

export class BirthdayMusic {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  /** Entry point of the delay/reverb send bus. */
  private send: AudioNode | null = null;
  private noise: AudioBuffer | null = null;

  private timer: number | null = null;
  private step = 0;
  private beatClock = 0;
  private nextNoteTime = 0;

  private mode: MusicMode = "gentle";
  private volume = 0.7;
  private muted = false;

  playing = false;

  /** Must be called from inside a user gesture (browser autoplay policy). */
  async unlock(): Promise<boolean> {
    if (this.ctx) {
      if (this.ctx.state === "suspended") await this.ctx.resume();
      return true;
    }
    const Ctor = getAudioContextCtor();
    if (!Ctor) return false;

    const ctx = new Ctor();
    const master = ctx.createGain();
    master.gain.value = 0;

    // A feedback delay stands in for reverb — cheap, and plenty for a music box.
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.26;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.28;
    const damp = ctx.createBiquadFilter();
    damp.type = "lowpass";
    damp.frequency.value = 2200;
    const wet = ctx.createGain();
    wet.gain.value = 0.3;

    delay.connect(damp);
    damp.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(master);
    master.connect(ctx.destination);

    // Pre-baked noise for the party-mode hi-hat.
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;

    this.ctx = ctx;
    this.master = master;
    this.send = delay;
    this.noise = buffer;

    if (ctx.state === "suspended") await ctx.resume();
    return true;
  }

  private targetGain(): number {
    if (this.muted) return 0;
    // Perceptual taper so the slider feels linear to the ear.
    return Math.pow(this.volume, 1.7) * (this.mode === "party" ? 0.34 : 0.3);
  }

  private applyGain(seconds = 0.5) {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    const g = this.master.gain;
    g.cancelScheduledValues(now);
    g.setValueAtTime(Math.max(g.value, 0.0001), now);
    g.linearRampToValueAtTime(this.playing ? this.targetGain() : 0, now + seconds);
  }

  async play() {
    const ok = await this.unlock();
    if (!ok || !this.ctx) return;
    if (this.playing) return;

    this.playing = true;
    this.nextNoteTime = this.ctx.currentTime + 0.08;
    this.applyGain(1.4);

    if (this.timer === null) {
      this.timer = window.setInterval(() => this.schedule(), LOOKAHEAD_MS);
    }
  }

  pause() {
    if (!this.playing) return;
    this.playing = false;
    this.applyGain(0.45);
    // Let the fade finish before we stop scheduling, otherwise it clicks.
    window.setTimeout(() => {
      if (!this.playing && this.timer !== null) {
        window.clearInterval(this.timer);
        this.timer = null;
      }
    }, 500);
  }

  toggle() {
    if (this.playing) this.pause();
    else void this.play();
  }

  setVolume(v: number) {
    this.volume = Math.min(1, Math.max(0, v));
    if (this.volume > 0) this.muted = false;
    this.applyGain(0.15);
  }

  getVolume() {
    return this.volume;
  }

  setMuted(m: boolean) {
    this.muted = m;
    this.applyGain(0.2);
  }

  isMuted() {
    return this.muted;
  }

  setMode(mode: MusicMode) {
    if (this.mode === mode) return;
    this.mode = mode;
    this.applyGain(0.8);
  }

  getMode() {
    return this.mode;
  }

  dispose() {
    if (this.timer !== null) window.clearInterval(this.timer);
    this.timer = null;
    this.playing = false;
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
    this.send = null;
  }

  /** Walk the melody, queueing anything that falls inside the lookahead window. */
  private schedule() {
    const ctx = this.ctx;
    if (!ctx || !this.playing) return;

    while (this.nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD) {
      const beat = 60 / TEMPO[this.mode];
      const step = MELODY[this.step];
      const time = this.nextNoteTime;
      const duration = step.beats * beat;

      if (step.note) {
        this.voice(NOTES[step.note], time, duration);
      }

      // Harmony lands on bar lines so the pad doesn't smear.
      const barIndex = Math.floor(this.beatClock / 3);
      const atBarStart = Math.abs(this.beatClock / 3 - barIndex) < 0.001;
      if (atBarStart) {
        const chord = CHORDS[barIndex % CHORDS.length];
        this.pad(chord, time, beat * 3);
        if (this.mode === "party") this.bass(chord[0], time, beat * 3);
      }

      if (this.mode === "party") {
        const hats = Math.max(1, Math.round(step.beats * 2));
        for (let i = 0; i < hats; i += 1) {
          this.hat(time + (i * duration) / hats, i === 0 ? 0.22 : 0.1);
        }
      }

      this.nextNoteTime += duration;
      this.beatClock = (this.beatClock + step.beats) % (CHORDS.length * 3);
      this.step = (this.step + 1) % MELODY.length;
    }
  }

  /** Lead voice — music-box bell in gentle mode, bright synth in party mode. */
  private voice(freq: number, time: number, duration: number) {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;

    const party = this.mode === "party";
    const env = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = party ? 4200 : 2900;
    filter.Q.value = party ? 3 : 0.8;

    const oscs: OscillatorNode[] = [];
    const add = (type: OscillatorType, detune: number, gain: number) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      osc.detune.value = detune;
      const g = ctx.createGain();
      g.gain.value = gain;
      osc.connect(g);
      g.connect(filter);
      oscs.push(osc);
    };

    if (party) {
      add("sawtooth", -6, 0.5);
      add("square", 6, 0.28);
      add("sine", 0, 0.4);
    } else {
      add("triangle", 0, 0.85);
      add("sine", 0, 0.3);
    }

    // Octave shimmer gives the bell its sparkle.
    const shimmer = ctx.createOscillator();
    shimmer.type = "sine";
    shimmer.frequency.value = freq * 2;
    const shimmerGain = ctx.createGain();
    shimmerGain.gain.value = party ? 0.08 : 0.14;
    shimmer.connect(shimmerGain);
    shimmerGain.connect(filter);
    oscs.push(shimmer);

    const hold = Math.max(0.12, duration * 0.92);
    const attack = party ? 0.008 : 0.02;
    env.gain.setValueAtTime(0.0001, time);
    env.gain.linearRampToValueAtTime(0.5, time + attack);
    env.gain.exponentialRampToValueAtTime(0.26, time + attack + 0.1);
    env.gain.exponentialRampToValueAtTime(0.0001, time + hold);

    filter.connect(env);
    env.connect(this.master);
    if (this.send) env.connect(this.send);

    oscs.forEach((o) => {
      o.start(time);
      o.stop(time + hold + 0.05);
    });
  }

  /** Sustained chord bed underneath the melody. */
  private pad(chord: string[], time: number, duration: number) {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;

    const env = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1300;

    chord.forEach((n) => {
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = NOTES[n];
      osc.detune.value = (Math.random() - 0.5) * 8;
      const g = ctx.createGain();
      g.gain.value = 0.3;
      osc.connect(g);
      g.connect(filter);
      osc.start(time);
      osc.stop(time + duration + 0.3);
    });

    env.gain.setValueAtTime(0.0001, time);
    env.gain.linearRampToValueAtTime(this.mode === "party" ? 0.1 : 0.075, time + 0.25);
    env.gain.linearRampToValueAtTime(0.0001, time + duration + 0.2);

    filter.connect(env);
    env.connect(this.master);
  }

  private bass(note: string, time: number, duration: number) {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const beat = duration / 3;

    for (let i = 0; i < 3; i += 1) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = NOTES[note] / 2;
      const env = ctx.createGain();
      const t = time + i * beat;
      env.gain.setValueAtTime(0.0001, t);
      env.gain.linearRampToValueAtTime(i === 0 ? 0.3 : 0.16, t + 0.02);
      env.gain.exponentialRampToValueAtTime(0.0001, t + beat * 0.8);
      osc.connect(env);
      env.connect(this.master);
      osc.start(t);
      osc.stop(t + beat);
    }
  }

  private hat(time: number, gain: number) {
    const ctx = this.ctx;
    if (!ctx || !this.master || !this.noise) return;

    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 9000;
    bp.Q.value = 1.2;
    const env = ctx.createGain();
    env.gain.setValueAtTime(gain, time);
    env.gain.exponentialRampToValueAtTime(0.0001, time + 0.055);

    src.connect(bp);
    bp.connect(env);
    env.connect(this.master);
    src.start(time);
    src.stop(time + 0.1);
  }
}
