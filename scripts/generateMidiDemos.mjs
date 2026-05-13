import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outDir = join(root, "assets", "music");

const PPQ = 480;
const CYCLES = 4;
const CHANNELS = {
  lead: 0,
  answer: 1,
  bells: 2,
  bass: 3,
  drums: 9
};

const PROGRAMS = {
  square: 80,
  saw: 81,
  celesta: 8,
  musicBox: 10,
  vibraphone: 11,
  bass: 38,
  softBass: 32,
  synthBass: 39
};

const demos = [
  {
    file: "demo-a-sun-bakery.mid",
    name: "A Sun Bakery Canon",
    tempo: 136,
    meter: [4, 4],
    keyCenter: "C5",
    leadProgram: PROGRAMS.square,
    answerProgram: PROGRAMS.saw,
    bellProgram: PROGRAMS.musicBox,
    bassProgram: PROGRAMS.bass,
    answerDelay: 2,
    answerTranspose: 0,
    bellDelay: 4,
    bellTranspose: 12,
    subject: [
      ["C5", 0.5], ["E5", 0.5], ["G5", 0.5], ["E5", 0.5],
      ["F5", 0.5], ["A5", 0.5], ["G5", 1],
      ["E5", 0.5], ["D5", 0.5], ["C5", 0.5], ["D5", 0.5],
      ["E5", 0.5], ["G5", 0.5], ["C6", 1]
    ],
    bass: ["C3", "G2", "A2", "E2", "F2", "C3", "F2", "G2"],
    drumPattern: "light"
  },
  {
    file: "demo-b-cloud-soft.mid",
    name: "B Cloud Soft Canon",
    tempo: 96,
    meter: [3, 4],
    keyCenter: "F5",
    leadProgram: PROGRAMS.vibraphone,
    answerProgram: PROGRAMS.musicBox,
    bellProgram: PROGRAMS.celesta,
    bassProgram: PROGRAMS.softBass,
    answerDelay: 3,
    answerTranspose: -12,
    bellDelay: 6,
    bellTranspose: 12,
    subject: [
      ["F5", 1], ["A5", 0.5], ["G5", 0.5],
      ["E5", 1], ["C5", 1],
      ["D5", 1], ["F5", 0.5], ["E5", 0.5],
      ["C5", 1], ["A4", 1],
      ["B4", 1], ["D5", 0.5], ["C5", 0.5],
      ["A4", 1], ["F4", 1]
    ],
    bass: ["F2", "C3", "D3", "A2", "B2", "F2", "C3", "C3"],
    drumPattern: "brush"
  },
  {
    file: "demo-c-arcade-focus.mid",
    name: "C Arcade Focus Canon",
    tempo: 164,
    meter: [4, 4],
    keyCenter: "A4",
    leadProgram: PROGRAMS.saw,
    answerProgram: PROGRAMS.square,
    bellProgram: PROGRAMS.square,
    bassProgram: PROGRAMS.synthBass,
    answerDelay: 1,
    answerTranspose: 7,
    bellDelay: 2,
    bellTranspose: 12,
    subject: [
      ["A4", 0.5], ["C5", 0.5], ["E5", 0.5], ["A5", 0.5],
      ["G5", 0.5], ["E5", 0.5], ["C5", 0.5], ["E5", 0.5],
      ["D5", 0.5], ["F5", 0.5], ["A5", 0.5], ["F5", 0.5],
      ["E5", 0.5], ["C5", 0.5], ["B4", 0.5], ["G4", 0.5]
    ],
    bass: ["A2", "A2", "G2", "G2", "F2", "F2", "E2", "E2"],
    drumPattern: "drive"
  },
  {
    file: "demo-d-dessert-magic.mid",
    name: "D Dessert Magic Mirror Canon",
    tempo: 124,
    meter: [4, 4],
    keyCenter: "D5",
    leadProgram: PROGRAMS.square,
    answerProgram: PROGRAMS.musicBox,
    bellProgram: PROGRAMS.celesta,
    bassProgram: PROGRAMS.softBass,
    answerDelay: 2,
    answerTranspose: 0,
    answerMode: "invert",
    bellDelay: 4,
    bellTranspose: 12,
    subject: [
      ["D5", 0.5], ["F5", 0.5], ["A5", 1],
      ["G5", 0.5], ["E5", 0.5], ["F5", 1],
      ["A5", 0.5], ["C6", 0.5], ["B5", 0.5], ["A5", 0.5],
      ["G5", 0.5], ["E5", 0.5], ["D5", 1]
    ],
    bass: ["D3", "A2", "B2", "F2", "G2", "D3", "G2", "A2"],
    drumPattern: "sparkle"
  }
];

mkdirSync(outDir, { recursive: true });

for (const demo of demos) {
  writeFileSync(join(outDir, demo.file), buildMidi(demo));
}

function buildMidi(demo) {
  const track = [];
  const phraseBeats = totalBeats(demo.subject);
  const phraseTicks = beatsToTicks(phraseBeats);
  const totalTicks = phraseTicks * CYCLES + beatsToTicks(demo.bellDelay + 4);

  metaText(track, 0, 0x03, demo.name);
  tempo(track, 0, demo.tempo);
  timeSignature(track, 0, demo.meter);
  program(track, 0, CHANNELS.lead, demo.leadProgram);
  program(track, 0, CHANNELS.answer, demo.answerProgram);
  program(track, 0, CHANNELS.bells, demo.bellProgram);
  program(track, 0, CHANNELS.bass, demo.bassProgram);

  for (let cycle = 0; cycle < CYCLES; cycle += 1) {
    const cycleTick = cycle * phraseTicks;
    addSequence(track, cycleTick, CHANNELS.lead, demo.subject, 86);
    addSequence(track, cycleTick + beatsToTicks(demo.answerDelay), CHANNELS.answer, transformSubject(demo), 70);
    addSequence(track, cycleTick + beatsToTicks(demo.bellDelay), CHANNELS.bells, thinSubject(demo.subject, demo.bellTranspose), 54);
    addBass(track, cycleTick, demo);
    addDrums(track, cycleTick, phraseBeats, demo.drumPattern);
  }

  addLoopTail(track, phraseTicks * CYCLES, demo);
  endTrack(track, totalTicks);

  const sorted = track.sort((a, b) => a.tick - b.tick || a.order - b.order);
  let lastTick = 0;
  const bytes = [];
  for (const event of sorted) {
    bytes.push(...varLen(event.tick - lastTick), ...event.bytes);
    lastTick = event.tick;
  }

  return Buffer.concat([
    chunk("MThd", Buffer.from([0, 0, 0, 1, PPQ >> 8, PPQ & 0xff])),
    chunk("MTrk", Buffer.from(bytes))
  ]);
}

function addSequence(track, startTick, channel, sequence, velocity) {
  let offset = 0;
  for (const [note, beats] of sequence) {
    const duration = beatsToTicks(beats);
    if (note !== "R") addNote(track, startTick + offset, channel, noteNumber(note), velocity, duration * 0.88);
    offset += duration;
  }
}

function transformSubject(demo) {
  return demo.subject.map(([note, beats]) => {
    if (note === "R") return [note, beats];
    const midi = noteNumber(note);
    const center = noteNumber(demo.keyCenter);
    const transformed = demo.answerMode === "invert"
      ? center - (midi - center) + demo.answerTranspose
      : midi + demo.answerTranspose;
    return [noteFromNumber(transformed), beats];
  });
}

function thinSubject(subject, transpose) {
  return subject.map(([note, beats], index) => {
    if (index % 2 === 1 || note === "R") return ["R", beats];
    return [noteFromNumber(noteNumber(note) + transpose), beats];
  });
}

function addBass(track, startTick, demo) {
  const beatsPerChord = totalBeats(demo.subject) / demo.bass.length;
  demo.bass.forEach((note, index) => {
    const tick = startTick + beatsToTicks(index * beatsPerChord);
    addNote(track, tick, CHANNELS.bass, noteNumber(note), 76, beatsToTicks(beatsPerChord) * 0.92);
    if (demo.drumPattern === "drive") {
      addNote(track, tick + beatsToTicks(beatsPerChord / 2), CHANNELS.bass, noteNumber(note), 58, beatsToTicks(beatsPerChord / 2) * 0.85);
    }
  });
}

function addDrums(track, startTick, phraseBeats, pattern) {
  for (let beat = 0; beat < phraseBeats; beat += 1) {
    const tick = startTick + beatsToTicks(beat);
    if (pattern === "drive") {
      addNote(track, tick, CHANNELS.drums, beat % 4 === 0 ? 36 : 42, beat % 2 === 0 ? 72 : 48, PPQ / 8);
      addNote(track, tick + PPQ / 2, CHANNELS.drums, 42, 42, PPQ / 8);
    } else if (pattern === "brush") {
      if (beat % 3 === 0) addNote(track, tick, CHANNELS.drums, 35, 42, PPQ / 8);
      addNote(track, tick + PPQ / 2, CHANNELS.drums, 51, 24, PPQ / 8);
    } else if (pattern === "sparkle") {
      if (beat % 2 === 0) addNote(track, tick, CHANNELS.drums, 36, 50, PPQ / 8);
      addNote(track, tick + PPQ / 2, CHANNELS.drums, 46, 34, PPQ / 8);
    } else {
      if (beat % 4 === 0) addNote(track, tick, CHANNELS.drums, 36, 58, PPQ / 8);
      if (beat % 2 === 1) addNote(track, tick, CHANNELS.drums, 42, 36, PPQ / 8);
    }
  }
}

function addLoopTail(track, startTick, demo) {
  addNote(track, startTick, CHANNELS.bass, noteNumber(demo.bass[0]), 64, beatsToTicks(2));
  addSequence(track, startTick, CHANNELS.bells, thinSubject(demo.subject.slice(0, 4), demo.bellTranspose), 42);
}

function totalBeats(sequence) {
  return sequence.reduce((sum, [, beats]) => sum + beats, 0);
}

function beatsToTicks(beats) {
  return Math.round(beats * PPQ);
}

function addNote(track, tick, channel, note, velocity, duration) {
  event(track, Math.round(tick), [0x90 | channel, note, velocity], 2);
  event(track, Math.round(tick + duration), [0x80 | channel, note, 0], 1);
}

function program(track, tick, channel, value) {
  event(track, tick, [0xc0 | channel, value], 0);
}

function tempo(track, tick, bpm) {
  const mpqn = Math.round(60000000 / bpm);
  event(track, tick, [0xff, 0x51, 0x03, (mpqn >> 16) & 0xff, (mpqn >> 8) & 0xff, mpqn & 0xff], 0);
}

function timeSignature(track, tick, [numerator, denominator]) {
  event(track, tick, [0xff, 0x58, 0x04, numerator, Math.log2(denominator), 0x18, 0x08], 0);
}

function metaText(track, tick, type, text) {
  const data = Buffer.from(text, "utf8");
  event(track, tick, [0xff, type, ...varLen(data.length), ...data], 0);
}

function endTrack(track, tick) {
  event(track, tick, [0xff, 0x2f, 0x00], 9);
}

function event(track, tick, bytes, order) {
  track.push({ tick, bytes, order });
}

function chunk(type, data) {
  const header = Buffer.alloc(8);
  header.write(type, 0, 4, "ascii");
  header.writeUInt32BE(data.length, 4);
  return Buffer.concat([header, data]);
}

function varLen(value) {
  let buffer = value & 0x7f;
  const bytes = [];
  while ((value >>= 7)) {
    buffer <<= 8;
    buffer |= (value & 0x7f) | 0x80;
  }
  while (true) {
    bytes.push(buffer & 0xff);
    if (buffer & 0x80) buffer >>= 8;
    else break;
  }
  return bytes;
}

function noteNumber(note) {
  const match = note.match(/^([A-G])(#?)(-?\d)$/);
  if (!match) throw new Error(`Invalid note: ${note}`);
  const [, name, sharp, octaveText] = match;
  const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[name];
  return (Number(octaveText) + 1) * 12 + base + (sharp ? 1 : 0);
}

function noteFromNumber(value) {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  return `${names[((value % 12) + 12) % 12]}${Math.floor(value / 12) - 1}`;
}
