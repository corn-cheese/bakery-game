export const SOUND_EFFECTS = {
  select: {
    tones: [{ frequency: 659.25, start: 0, duration: 0.045, volume: 0.045, type: "sine" }],
    noises: []
  },
  success: {
    tones: [
      { frequency: 523.25, start: 0, duration: 0.09, volume: 0.08, type: "triangle" },
      { frequency: 659.25, start: 0.08, duration: 0.09, volume: 0.075, type: "triangle" },
      { frequency: 783.99, start: 0.16, duration: 0.18, volume: 0.08, type: "triangle" }
    ],
    noises: []
  },
  reset: {
    tones: [
      { frequency: 392, start: 0, duration: 0.08, volume: 0.055, type: "sine" },
      { frequency: 523.25, start: 0.1, duration: 0.12, volume: 0.06, type: "sine" }
    ],
    noises: [{ type: "soft", start: 0.02, duration: 0.26, volume: 0.035 }]
  },
  timerWarning: {
    tones: [
      { frequency: 880, start: 0, duration: 0.07, volume: 0.08, type: "square" },
      { frequency: 880, start: 0.14, duration: 0.07, volume: 0.08, type: "square" }
    ],
    noises: []
  },
  gameOver: {
    tones: [
      { frequency: 659.25, start: 0, duration: 0.12, volume: 0.07, type: "triangle" },
      { frequency: 493.88, start: 0.12, duration: 0.12, volume: 0.065, type: "triangle" },
      { frequency: 392, start: 0.24, duration: 0.2, volume: 0.065, type: "triangle" }
    ],
    noises: []
  }
};

export function createSoundEffectPlan(name) {
  const effect = SOUND_EFFECTS[name];
  if (!effect) throw new Error(`Unknown sound effect: ${name}`);

  const tones = effect.tones.map((tone) => ({ ...tone }));
  const noises = effect.noises.map((noise) => ({ ...noise }));
  const duration = Math.max(
    0,
    ...tones.map((tone) => tone.start + tone.duration),
    ...noises.map((noise) => noise.start + noise.duration)
  );

  return {
    name,
    tones,
    noises,
    duration: Number(duration.toFixed(2))
  };
}

export function createSoundEffects(audioContext) {
  let muted = false;

  function play(name) {
    if (muted) return;

    const plan = createSoundEffectPlan(name);
    const output = audioContext.createGain();
    output.gain.value = 0.9;
    output.connect(audioContext.destination);

    plan.tones.forEach((tone) => scheduleTone(tone, output));
    plan.noises.forEach((noise) => scheduleNoise(noise, output));
    setTimeout(() => output.disconnect(), (plan.duration + 0.08) * 1000);
  }

  function scheduleTone(tone, output) {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const start = audioContext.currentTime + tone.start;
    const end = start + tone.duration;

    oscillator.type = tone.type;
    oscillator.frequency.value = tone.frequency;
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(tone.volume, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, end);
    oscillator.connect(gain).connect(output);
    oscillator.start(start);
    oscillator.stop(end + 0.02);
  }

  function scheduleNoise(noise, output) {
    const length = Math.max(1, Math.floor(audioContext.sampleRate * noise.duration));
    const buffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    const source = audioContext.createBufferSource();
    const gain = audioContext.createGain();
    const start = audioContext.currentTime + noise.start;

    for (let index = 0; index < length; index += 1) {
      data[index] = (Math.random() * 2 - 1) * (1 - index / length);
    }

    source.buffer = buffer;
    gain.gain.setValueAtTime(noise.volume, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + noise.duration);
    source.connect(gain).connect(output);
    source.start(start);
  }

  return {
    play,
    setMuted(value) {
      muted = value;
    },
    get muted() {
      return muted;
    }
  };
}
