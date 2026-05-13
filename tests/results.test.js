import assert from "node:assert/strict";
import test from "node:test";

import { createResultSummary } from "../src/results.js";

test("createResultSummary formats a finished 2 minute game", () => {
  const summary = createResultSummary({ score: 240, durationSeconds: 120 });

  assert.deepEqual(summary, {
    title: "게임 종료!",
    scoreText: "240점",
    clearedText: "24개 타일 제거",
    durationText: "2분 모드",
    message: "좋아요, 베이커리가 꽤 바빠졌어요!"
  });
});

test("createResultSummary gives a gentle message for a low score", () => {
  const summary = createResultSummary({ score: 40, durationSeconds: 300 });

  assert.equal(summary.durationText, "5분 모드");
  assert.equal(summary.message, "다음 판에는 더 달콤하게 이어가 봐요.");
});
