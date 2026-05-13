import assert from "node:assert/strict";
import test from "node:test";

import {
  BOARD_SIZE,
  createBoard,
  getRectangleCells,
  hasValidMove,
  scoreSelection,
  sumCells
} from "../src/gameLogic.js";

test("createBoard builds a 10x10 board with numbers from 1 to 9", () => {
  const board = createBoard(() => 0);

  assert.equal(BOARD_SIZE, 10);
  assert.equal(board.length, 10);
  assert.equal(board[0].length, 10);
  assert.equal(board[9].length, 10);
  assert.equal(board[0][0], 1);
  assert.equal(board[9][9], 1);
});

test("getRectangleCells returns every cell inside the dragged rectangle", () => {
  const cells = getRectangleCells({ row: 2, col: 3 }, { row: 3, col: 5 });

  assert.deepEqual(cells, [
    { row: 2, col: 3 },
    { row: 2, col: 4 },
    { row: 2, col: 5 },
    { row: 3, col: 3 },
    { row: 3, col: 4 },
    { row: 3, col: 5 }
  ]);
});

test("sumCells ignores removed cells and totals active selected tiles", () => {
  const board = [
    [4, 6, null],
    [1, 2, 3],
    [9, 1, 5]
  ];

  const total = sumCells(board, [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 }
  ]);

  assert.equal(total, 10);
});

test("scoreSelection removes tiles and scores when selected sum is 10", () => {
  const board = [
    [4, 6, 8],
    [1, 2, 3],
    [9, 1, 5]
  ];

  const result = scoreSelection(board, [
    { row: 0, col: 0 },
    { row: 0, col: 1 }
  ]);

  assert.equal(result.scored, true);
  assert.equal(result.points, 20);
  assert.deepEqual(result.board[0], [null, null, 8]);
  assert.deepEqual(board[0], [4, 6, 8]);
});

test("scoreSelection leaves the board unchanged when selected sum is not 10", () => {
  const board = [
    [4, 5, 8],
    [1, 2, 3],
    [9, 1, 5]
  ];

  const result = scoreSelection(board, [
    { row: 0, col: 0 },
    { row: 0, col: 1 }
  ]);

  assert.equal(result.scored, false);
  assert.equal(result.points, 0);
  assert.deepEqual(result.board, board);
});

test("hasValidMove finds rectangular selections that sum to 10", () => {
  const board = [
    [8, 1, 4],
    [1, 1, 6],
    [9, 9, 9]
  ];

  assert.equal(hasValidMove(board), true);
});

test("hasValidMove returns false when no active rectangle sums to 10", () => {
  const board = [
    [9, 9, null],
    [9, null, 9],
    [null, 9, 9]
  ];

  assert.equal(hasValidMove(board), false);
});
