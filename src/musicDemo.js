const demos = {
  a: {
    title: "A. 햇살 베이커리 캐논",
    bpm: 136,
    meter: 4,
    midi: "./assets/music/demo-a-sun-bakery.mid",
    lead: ["C5", "E5", "G5", "E5", "F5", "A5", "G5", "R", "E5", "D5", "C5", "D5", "E5", "G5", "C6", "R"],
    bass: ["C3", "G2", "A2", "E2", "F2", "C3", "F2", "G2"],
    answerDelay: 2,
    answerTranspose: 0,
    wave: "square"
  },
  b: {
    title: "B. 몽글몽글 구름 캐논",
    bpm: 96,
    meter: 3,
    midi: "./assets/music/demo-b-cloud-soft.mid",
    lead: ["F5", "A5", "G5", "E5", "C5", "R", "D5", "F5", "E5", "C5", "A4", "R", "B4", "D5", "C5", "A4", "F4", "R"],
    bass: ["F2", "C3", "D3", "A2", "B2", "F2", "C3", "C3"],
    answerDelay: 3,
    answerTranspose: -12,
    wave: "triangle"
  },
  c: {
    title: "C. 아케이드 집중 캐논",
    bpm: 164,
    meter: 4,
    midi: "./assets/music/demo-c-arcade-focus.mid",
    lead: ["A4", "C5", "E5", "A5", "G5", "E5", "C5", "E5", "D5", "F5", "A5", "F5", "E5", "C5", "B4", "G4"],
    bass: ["A2", "A2", "G2", "G2", "F2", "F2", "E2", "E2"],
    answerDelay: 1,
    answerTranspose: 7,
    wave: "square"
  },
  d: {
    title: "D. 디저트 마법 미러 캐논",
    bpm: 124,
    meter: 4,
    midi: "./assets/music/demo-d-dessert-magic.mid",
    lead: ["D5", "F5", "A5", "R", "G5", "E5", "F5", "R", "A5", "C6", "B5", "A5", "G5", "E5", "D5", "R"],
    bass: ["D3", "A2", "B2", "F2", "G2", "D3", "G2", "A2"],
    answerDelay: 2,
    answerTranspose: 0,
    answerMode: "invert",
    center: "D5",
    wave: "square"
  }
};

let audioContext;
let stopHandles = [];

document.querySelectorAll("[data-play]").forEach((button) => {
  button.addEventListener("click", async () => {
    stopDemo();
    audioContext = audioContext ?? new AudioContext();
    if (audioContext.state === "suspended") await audioContext.resume();
    const id = button.dataset.play;
    playDemo(demos[id]);
    document.querySelector("[data-now-playing]").textContent = `${demos[id].title} 재생 중`;
  });
});

document.querySelector("[data-stop]").addEventListener("click", () => {
  stopDemo();
  document.querySelector("[data-now-playing]").textContent = "정지됨";
});

function playDemo(demo) {
  const beat = 60 / demo.bpm;
  const step = beat / 2;
  const start = audioContext.currentTime + 0.05;
  const master = audioContext.createGain();
  master.gain.value = 0.16;
  master.connect(audioContext.destination);

  for (let loop = 0; loop < 4; loop += 1) {
    const loopOffset = loop * demo.lead.length * step;
    playVoice(master, demo, start + loopOffset, 0, demo.wave, 0.82);
    playVoice(master, demo, start + loopOffset + demo.answerDelay * beat, demo.answerTranspose, "triangle", 0.46);
    playBass(master, demo, start + loopOffset, step);
    playPulse(master, demo, start + loopOffset, step);
  }
}

function playVoice(destination, demo, start, transposeBy, wave, volume) {
  const step = 60 / demo.bpm / 2;
  demo.lead.forEach((note, index) => {
    if (note === "R") return;
    const sourceNote = demo.answerMode === "invert"
      ? invert(note, demo.center, transposeBy)
      : transpose(note, transposeBy);
    playNote(destination, sourceNote, start + index * step, step * 0.82, wave, volume);
  });
}

function playBass(destination, demo, start, step) {
  demo.bass.forEach((note, index) => {
    playNote(destination, note, start + index * step * 2, step * 1.55, "square", 0.28);
  });
}

function playPulse(destination, demo, start, step) {
  for (let index = 0; index < demo.lead.length; index += 1) {
    playNoise(destination, start + index * step, demo.bpm > 150 ? 0.018 : 0.024, index % demo.meter === 0 ? 0.11 : 0.06);
  }
}

function stopDemo() {
  stopHandles.forEach((stop) => stop());
  stopHandles = [];
}

function playNote(destination, note, time, duration, wave, volume) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = wave;
  oscillator.frequency.value = frequency(note);
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(volume, time + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
  oscillator.connect(gain).connect(destination);
  oscillator.start(time);
  oscillator.stop(time + duration + 0.02);
  stopHandles.push(() => {
    try { oscillator.stop(); } catch {}
  });
}

function playNoise(destination, time, duration, volume) {
  const length = Math.max(1, Math.floor(audioContext.sampleRate * duration));
  const buffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  const source = audioContext.createBufferSource();
  const gain = audioContext.createGain();
  source.buffer = buffer;
  gain.gain.setValueAtTime(volume, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
  source.connect(gain).connect(destination);
  source.start(time);
  stopHandles.push(() => {
    try { source.stop(); } catch {}
  });
}

function frequency(note) {
  return 440 * 2 ** ((midiNumber(note) - 69) / 12);
}

function transpose(note, semitones) {
  return noteFromMidi(midiNumber(note) + semitones);
}

function invert(note, center, semitones) {
  return noteFromMidi(midiNumber(center) - (midiNumber(note) - midiNumber(center)) + semitones);
}

function midiNumber(note) {
  const match = note.match(/^([A-G])(#?)(-?\d)$/);
  if (!match) throw new Error(`Invalid note: ${note}`);
  const [, name, sharp, octaveText] = match;
  const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[name];
  return (Number(octaveText) + 1) * 12 + base + (sharp ? 1 : 0);
}

function noteFromMidi(value) {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  return `${names[((value % 12) + 12) % 12]}${Math.floor(value / 12) - 1}`;
}
