export const SUN_BAKERY_MUSIC = {
  title: "Sun Bakery Canon",
  bpm: 136,
  lead: ["C5", "E5", "G5", "E5", "F5", "A5", "G5", "R", "E5", "D5", "C5", "D5", "E5", "G5", "C6", "R"],
  bass: ["C3", "G2", "A2", "E2", "F2", "C3", "F2", "G2"],
  answerDelayBeats: 2,
  cycles: 4
};

export function createSunBakeryLoopPlan(music = SUN_BAKERY_MUSIC) {
  const beat = 60 / music.bpm;
  const step = beat / 2;
  const phraseDuration = music.lead.length * step;
  const notes = [];
  const pulses = [];

  for (let cycle = 0; cycle < music.cycles; cycle += 1) {
    const cycleStart = cycle * phraseDuration;

    music.lead.forEach((note, index) => {
      if (note === "R") return;
      notes.push({
        voice: "lead",
        note,
        start: cycleStart + index * step,
        duration: step * 0.82
      });
      notes.push({
        voice: "answer",
        note,
        start: cycleStart + music.answerDelayBeats * beat + index * step,
        duration: step * 0.72
      });
    });

    music.bass.forEach((note, index) => {
      notes.push({
        voice: "bass",
        note,
        start: cycleStart + index * step * 2,
        duration: step * 1.55
      });
    });

    for (let index = 0; index < music.lead.length; index += 1) {
      pulses.push({
        start: cycleStart + index * step,
        duration: 0.024,
        volume: index % 4 === 0 ? 0.07 : 0.035
      });
    }
  }

  return {
    bpm: music.bpm,
    loopDurationSeconds: phraseDuration * music.cycles,
    notes,
    pulses
  };
}

export function createBackgroundMusic(audioContext) {
  const plan = createSunBakeryLoopPlan();
  let master = null;
  let timerId = null;
  let nextLoopStart = 0;
  let muted = false;
  let stopHandles = [];

  function start() {
    if (timerId) return;

    master = audioContext.createGain();
    master.gain.value = muted ? 0 : 0.13;
    master.connect(audioContext.destination);
    nextLoopStart = audioContext.currentTime + 0.05;
    scheduleLoop();
    timerId = setInterval(scheduleLoop, Math.max(250, (plan.loopDurationSeconds - 0.5) * 1000));
  }

  function stop() {
    clearInterval(timerId);
    timerId = null;
    stopHandles.forEach((stopHandle) => stopHandle());
    stopHandles = [];
    master?.disconnect();
    master = null;
  }

  function setMuted(value) {
    muted = value;
    if (master) {
      master.gain.setTargetAtTime(muted ? 0 : 0.13, audioContext.currentTime, 0.03);
    }
  }

  function scheduleLoop() {
    while (nextLoopStart < audioContext.currentTime + plan.loopDurationSeconds + 0.25) {
      plan.notes.forEach((note) => scheduleNote(note, nextLoopStart));
      plan.pulses.forEach((pulse) => schedulePulse(pulse, nextLoopStart));
      nextLoopStart += plan.loopDurationSeconds;
    }
  }

  function scheduleNote(note, loopStart) {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const time = loopStart + note.start;
    const volume = note.voice === "lead" ? 0.58 : note.voice === "answer" ? 0.34 : 0.24;

    oscillator.type = note.voice === "answer" ? "triangle" : "square";
    oscillator.frequency.value = frequency(note.note);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, time + note.duration);
    oscillator.connect(gain).connect(master);
    oscillator.start(time);
    oscillator.stop(time + note.duration + 0.03);
    stopHandles.push(() => {
      try {
        oscillator.stop();
      } catch {}
    });
  }

  function schedulePulse(pulse, loopStart) {
    const length = Math.max(1, Math.floor(audioContext.sampleRate * pulse.duration));
    const buffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    const source = audioContext.createBufferSource();
    const gain = audioContext.createGain();
    const time = loopStart + pulse.start;

    for (let index = 0; index < length; index += 1) {
      data[index] = Math.random() * 2 - 1;
    }

    source.buffer = buffer;
    gain.gain.setValueAtTime(pulse.volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + pulse.duration);
    source.connect(gain).connect(master);
    source.start(time);
    stopHandles.push(() => {
      try {
        source.stop();
      } catch {}
    });
  }

  return {
    start,
    stop,
    setMuted,
    get muted() {
      return muted;
    }
  };
}

export function frequency(note) {
  return 440 * 2 ** ((midiNumber(note) - 69) / 12);
}

function midiNumber(note) {
  const match = note.match(/^([A-G])(#?)(-?\d)$/);
  if (!match) throw new Error(`Invalid note: ${note}`);
  const [, name, sharp, octaveText] = match;
  const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[name];
  return (Number(octaveText) + 1) * 12 + base + (sharp ? 1 : 0);
}
