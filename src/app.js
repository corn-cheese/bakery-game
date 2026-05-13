import {
  TARGET_SUM,
  createBoard,
  getRectangleCells,
  hasValidMove,
  scoreSelection,
  sumCells
} from "./gameLogic.js";
import { createBackgroundMusic } from "./backgroundMusic.js";

const boardEl = document.querySelector("[data-board]");
const timeEl = document.querySelector("[data-time]");
const scoreEl = document.querySelector("[data-score]");
const startButton = document.querySelector("[data-start]");
const musicButton = document.querySelector("[data-music]");
const modeButtons = document.querySelectorAll("[data-duration]");
const selectionSumEl = document.querySelector("[data-selection-sum]");
const overlayEl = document.querySelector("[data-overlay]");
const messageEl = document.querySelector("[data-message]");
const cheerEl = document.querySelector("[data-cheer-state]");

const messages = {
  idle: "구름 베이커리에 온 걸 환영해요!",
  start: "합이 10인 베이커리 타일을 찾아봐요!",
  success: "좋아요! 합계 10이에요!",
  reset: "더 만들 수 있는 10 조합이 없어요. 새 보드!",
  urgent: "10초 남았어요!",
  end: "수고했어요! 최종 점수를 확인해요."
};

let board = createPlayableBoard();
let selectedDuration = 120;
let remainingSeconds = selectedDuration;
let score = 0;
let timerId = null;
let isPlaying = false;
let dragStart = null;
let selectedCells = [];
let audioContext = null;
let backgroundMusic = null;
let isMusicMuted = false;

render();

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (isPlaying) return;
    selectedDuration = Number(button.dataset.duration);
    remainingSeconds = selectedDuration;
    modeButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    renderHud();
  });
});

startButton.addEventListener("click", () => {
  startGame();
  startMusic();
});

musicButton.addEventListener("click", () => {
  isMusicMuted = !isMusicMuted;
  backgroundMusic?.setMuted(isMusicMuted);
  if (!isMusicMuted) startMusic();
  renderMusicButton();
});

boardEl.addEventListener("pointerdown", (event) => {
  if (!isPlaying) return;
  const cell = getTileCell(event.target);
  if (!cell) return;
  boardEl.setPointerCapture(event.pointerId);
  dragStart = cell;
  selectedCells = [cell];
  updateSelection(cell);
});

boardEl.addEventListener("pointermove", (event) => {
  if (!isPlaying || !dragStart) return;
  const target = document.elementFromPoint(event.clientX, event.clientY);
  const cell = getTileCell(target);
  if (!cell) return;
  updateSelection(cell);
});

boardEl.addEventListener("pointerup", () => {
  if (!isPlaying || !dragStart) return;
  commitSelection();
});

boardEl.addEventListener("pointercancel", () => {
  clearSelection();
});

function startGame() {
  board = createPlayableBoard();
  remainingSeconds = selectedDuration;
  score = 0;
  isPlaying = true;
  startButton.textContent = "다시 시작";
  overlayEl.classList.add("is-hidden");
  setMessage("start", messages.start);
  clearInterval(timerId);
  timerId = setInterval(tick, 1000);
  render();
}

function tick() {
  remainingSeconds -= 1;

  if (remainingSeconds === 10) {
    setMessage("urgent", messages.urgent);
  }

  if (remainingSeconds <= 0) {
    endGame();
    return;
  }

  renderHud();
}

function endGame() {
  clearInterval(timerId);
  timerId = null;
  isPlaying = false;
  clearSelection();
  overlayEl.textContent = `게임 종료! 최종 점수 ${score}`;
  overlayEl.classList.remove("is-hidden");
  setMessage("end", messages.end);
  renderHud();
}

function updateSelection(endCell) {
  selectedCells = getRectangleCells(dragStart, endCell);
  renderTiles();
  renderSelectionSum();
}

function commitSelection() {
  const result = scoreSelection(board, selectedCells);

  if (result.scored) {
    board = result.board;
    score += result.points;
    setMessage("success", messages.success);

    if (!hasValidMove(board)) {
      setTimeout(() => {
        if (!isPlaying) return;
        board = createPlayableBoard();
        setMessage("reset", messages.reset);
        render();
      }, 650);
    }
  }

  clearSelection();
  render();
}

function clearSelection() {
  dragStart = null;
  selectedCells = [];
  renderTiles();
  renderSelectionSum();
}

function createPlayableBoard() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const candidate = createBoard();
    if (hasValidMove(candidate)) {
      return candidate;
    }
  }
  return createBoard();
}

function render() {
  renderHud();
  renderTiles();
  renderSelectionSum();
}

function renderHud() {
  timeEl.textContent = formatTime(remainingSeconds);
  scoreEl.textContent = String(score);
  renderMusicButton();
}

function renderTiles() {
  const selectedSet = new Set(selectedCells.map((cell) => cellKey(cell)));
  const selectedSum = sumCells(board, selectedCells);
  const stateClass = selectedSum === TARGET_SUM ? "is-valid" : selectedSum > TARGET_SUM ? "is-over" : "";

  boardEl.replaceChildren(
    ...board.flatMap((row, rowIndex) =>
      row.map((value, colIndex) => {
        const tile = document.createElement("button");
        tile.type = "button";
        tile.className = "tile";
        tile.dataset.row = String(rowIndex);
        tile.dataset.col = String(colIndex);
        tile.textContent = value ?? "";
        tile.setAttribute("aria-label", value === null ? "빈 베이커리 타일" : `숫자 ${value}`);

        if (value === null) {
          tile.classList.add("is-empty");
          tile.disabled = true;
        }

        if (selectedSet.has(cellKey({ row: rowIndex, col: colIndex }))) {
          tile.classList.add("is-selected");
          if (stateClass) tile.classList.add(stateClass);
        }

        return tile;
      })
    )
  );
}

function renderSelectionSum() {
  const selectedSum = sumCells(board, selectedCells);
  selectionSumEl.textContent = `합계 ${selectedSum}`;
  selectionSumEl.classList.toggle("is-valid", selectedSum === TARGET_SUM);
  selectionSumEl.classList.toggle("is-over", selectedSum > TARGET_SUM);
}

function getTileCell(target) {
  const tile = target?.closest?.(".tile");
  if (!tile || tile.classList.contains("is-empty")) return null;
  return {
    row: Number(tile.dataset.row),
    col: Number(tile.dataset.col)
  };
}

function setMessage(state, text) {
  messageEl.textContent = text;
  cheerEl.dataset.cheerState = state;

  if (state === "success" || state === "reset") {
    cheerEl.classList.remove("is-cheering");
    void cheerEl.offsetWidth;
    cheerEl.classList.add("is-cheering");
  }
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function cellKey({ row, col }) {
  return `${row}:${col}`;
}

async function startMusic() {
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return;

  audioContext = audioContext ?? new AudioContextConstructor();
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  backgroundMusic = backgroundMusic ?? createBackgroundMusic(audioContext);
  backgroundMusic.setMuted(isMusicMuted);
  backgroundMusic.start();
}

function renderMusicButton() {
  musicButton.textContent = isMusicMuted ? "음악 꺼짐" : "음악 켜짐";
  musicButton.setAttribute("aria-pressed", String(!isMusicMuted));
}
