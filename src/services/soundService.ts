// ============================================================================
// Sound service — synthesizes tones using the Web Audio API.
// Works both on web and in Capacitor WebView.
// ============================================================================

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (audioCtx && audioCtx.state !== 'closed') return audioCtx;
  try {
    audioCtx = new AudioContext();
    return audioCtx;
  } catch {
    return null;
  }
}

function playTone(
  frequency: number,
  durationSec: number,
  volume = 0.35,
  type: OscillatorType = 'sine'
): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Resume context if it was suspended (browser autoplay policy)
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => { /* ignore */ });
    return;
  }

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);

  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSec);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + durationSec);
}

export class SoundService {
  /** Plays a short beep when a timed exercise ends */
  static beep(): void {
    playTone(880, 0.15, 0.3, 'square');
  }

  /** Countdown tick sound */
  static tick(): void {
    playTone(660, 0.08, 0.2, 'square');
  }

  /** Success chime played at workout completion */
  static success(): void {
    // Ascending arpeggio: C5 → E5 → G5 → C6
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.3, 0.4, 'sine'), i * 120);
    });
  }

  /** Rest-period bell */
  static rest(): void {
    playTone(440, 0.4, 0.25, 'sine');
    setTimeout(() => playTone(550, 0.4, 0.2, 'sine'), 200);
  }

  /** Low countdown warning (last 3 seconds) */
  static countdownWarning(): void {
    playTone(1100, 0.1, 0.25, 'square');
  }
}
