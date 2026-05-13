export const BOARD_SIZE = 10;
export const EMPTY_TILE = null;
export const TARGET_SUM = 10;
export const POINTS_PER_TILE = 10;

export function createBoard(random = Math.random, size = BOARD_SIZE) {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.floor(random() * 9) + 1)
  );
}

export function cloneBoard(board) {
  return board.map((row) => [...row]);
}

export function getRectangleCells(start, end) {
  const top = Math.min(start.row, end.row);
  const bottom = Math.max(start.row, end.row);
  const left = Math.min(start.col, end.col);
  const right = Math.max(start.col, end.col);
  const cells = [];

  for (let row = top; row <= bottom; row += 1) {
    for (let col = left; col <= right; col += 1) {
      cells.push({ row, col });
    }
  }

  return cells;
}

export function sumCells(board, cells) {
  return cells.reduce((total, { row, col }) => {
    const value = board[row]?.[col];
    return total + (value ?? 0);
  }, 0);
}

export function scoreSelection(board, cells) {
  const selectedSum = sumCells(board, cells);

  if (selectedSum !== TARGET_SUM) {
    return {
      scored: false,
      points: 0,
      board
    };
  }

  const nextBoard = cloneBoard(board);
  let removedCount = 0;

  for (const { row, col } of cells) {
    if (nextBoard[row]?.[col] !== EMPTY_TILE) {
      nextBoard[row][col] = EMPTY_TILE;
      removedCount += 1;
    }
  }

  return {
    scored: true,
    points: removedCount * POINTS_PER_TILE,
    board: nextBoard
  };
}

export function hasValidMove(board) {
  const rowCount = board.length;
  const colCount = board[0]?.length ?? 0;

  for (let top = 0; top < rowCount; top += 1) {
    for (let left = 0; left < colCount; left += 1) {
      for (let bottom = top; bottom < rowCount; bottom += 1) {
        for (let right = left; right < colCount; right += 1) {
          const cells = getRectangleCells(
            { row: top, col: left },
            { row: bottom, col: right }
          );
          if (sumCells(board, cells) === TARGET_SUM) {
            return true;
          }
        }
      }
    }
  }

  return false;
}
