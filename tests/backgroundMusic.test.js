import assert from "node:assert/strict";
import test from "node:test";

import {
  SUN_BAKERY_MUSIC,
  createSunBakeryLoopPlan,
  frequency
} from "../src/backgroundMusic.js";

test("sun bakery music uses the selected A direction", () => {
  assert.equal(SUN_BAKERY_MUSIC.title, "Sun Bakery Canon");
  assert.equal(SUN_BAKERY_MUSIC.bpm, 136);
  assert.deepEqual(SUN_BAKERY_MUSIC.lead.slice(0, 4), ["C5", "E5", "G5", "E5"]);
  assert.equal(SUN_BAKERY_MUSIC.answerDelayBeats, 2);
});

test("createSunBakeryLoopPlan schedules a complete loop with canon answer and bass", () => {
  const plan = createSunBakeryLoopPlan();
  const firstAnswer = plan.notes.find((note) => note.voice === "answer");

  assert.equal(plan.loopDurationSeconds, 240 / 136 * 8);
  assert.equal(plan.notes[0].voice, "lead");
  assert.equal(plan.notes[0].note, "C5");
  assert.equal(plan.notes[0].start, 0);
  assert.equal(firstAnswer.note, "C5");
  assert.equal(firstAnswer.start, 60 / 136 * 2);
  assert.equal(plan.notes.some((note) => note.voice === "bass" && note.note === "C3"), true);
  assert.equal(plan.pulses.length, 64);
});

test("frequency converts note names to oscillator frequencies", () => {
  assert.equal(Math.round(frequency("A4")), 440);
  assert.equal(Math.round(frequency("C5")), 523);
});
