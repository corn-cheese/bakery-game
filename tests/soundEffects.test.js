import assert from "node:assert/strict";
import test from "node:test";

import {
  SOUND_EFFECTS,
  createSoundEffectPlan
} from "../src/soundEffects.js";

test("sound effect set covers the main game events", () => {
  assert.deepEqual(Object.keys(SOUND_EFFECTS), [
    "select",
    "success",
    "reset",
    "timerWarning",
    "gameOver"
  ]);
});

test("createSoundEffectPlan returns short scheduled tones", () => {
  const success = createSoundEffectPlan("success");

  assert.equal(success.tones.length, 3);
  assert.equal(success.tones[0].frequency, 523.25);
  assert.equal(success.tones.at(-1).start, 0.16);
  assert.equal(success.duration, 0.34);
});

test("createSoundEffectPlan can include noise bursts for soft reset cues", () => {
  const reset = createSoundEffectPlan("reset");

  assert.equal(reset.noises.length, 1);
  assert.equal(reset.noises[0].type, "soft");
  assert.equal(reset.duration, 0.28);
});
