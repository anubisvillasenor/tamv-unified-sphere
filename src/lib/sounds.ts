// TAMV Sound Effects System
// Lightweight audio feedback using Web Audio API

let audioContext: AudioContext | null = null;

const getContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
};

const playTone = (freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.08) => {
  try {
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Silently fail if audio is not available
  }
};

export const sounds = {
  click: () => playTone(800, 0.06, 'sine', 0.05),
  hover: () => playTone(600, 0.03, 'sine', 0.02),
  success: () => {
    playTone(523, 0.12, 'sine', 0.06);
    setTimeout(() => playTone(659, 0.12, 'sine', 0.06), 100);
    setTimeout(() => playTone(784, 0.18, 'sine', 0.06), 200);
  },
  error: () => playTone(220, 0.25, 'square', 0.04),
  notification: () => {
    playTone(880, 0.08, 'sine', 0.06);
    setTimeout(() => playTone(1100, 0.12, 'sine', 0.06), 80);
  },
  message: () => {
    playTone(660, 0.06, 'triangle', 0.05);
    setTimeout(() => playTone(880, 0.1, 'triangle', 0.05), 60);
  },
  send: () => playTone(1200, 0.08, 'sine', 0.04),
  like: () => {
    playTone(523, 0.08, 'sine', 0.05);
    setTimeout(() => playTone(784, 0.15, 'sine', 0.06), 60);
  },
  navigate: () => playTone(440, 0.05, 'sine', 0.03),
  purchase: () => {
    playTone(523, 0.1, 'sine', 0.06);
    setTimeout(() => playTone(659, 0.1, 'sine', 0.06), 100);
    setTimeout(() => playTone(784, 0.1, 'sine', 0.06), 200);
    setTimeout(() => playTone(1047, 0.2, 'sine', 0.07), 300);
  },
};
