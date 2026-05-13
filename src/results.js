import { POINTS_PER_TILE } from "./gameLogic.js";

export function createResultSummary({ score, durationSeconds }) {
  const clearedTiles = Math.floor(score / POINTS_PER_TILE);
  const minutes = Math.round(durationSeconds / 60);

  return {
    title: "게임 종료!",
    scoreText: `${score}점`,
    clearedText: `${clearedTiles}개 타일 제거`,
    durationText: `${minutes}분 모드`,
    message: score >= 200 ? "좋아요, 베이커리가 꽤 바빠졌어요!" : "다음 판에는 더 달콤하게 이어가 봐요."
  };
}
