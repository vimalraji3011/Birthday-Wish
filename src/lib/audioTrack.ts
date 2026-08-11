/** Thin wrapper around an HTMLAudioElement for the birthday song. */

const SRC = "/happy-birthday-background-score.mp3";

export class AudioTrack {
  private el: HTMLAudioElement | null = null;
  playing = false;

  private ensure(): HTMLAudioElement {
    if (!this.el) {
      const el = new Audio(SRC);
      el.loop = true;
      el.preload = "auto";
      el.addEventListener("ended", () => {
        this.playing = false;
      });
      this.el = el;
    }
    return this.el;
  }

  /** Must be called from inside a user gesture (browser autoplay policy). */
  async play(): Promise<boolean> {
    const el = this.ensure();
    try {
      await el.play();
      this.playing = true;
      return true;
    } catch {
      this.playing = false;
      return false;
    }
  }

  pause() {
    this.el?.pause();
    this.playing = false;
  }

  toggle() {
    if (this.playing) this.pause();
    else void this.play();
  }

  setVolume(v: number) {
    if (this.el) this.el.volume = Math.min(1, Math.max(0, v));
  }

  setMuted(m: boolean) {
    if (this.el) this.el.muted = m;
  }

  dispose() {
    this.el?.pause();
    this.el = null;
    this.playing = false;
  }
}
