export function getTileCell(target) {
  const tile = target?.closest?.(".tile");
  if (!tile) return null;
  return {
    row: Number(tile.dataset.row),
    col: Number(tile.dataset.col)
  };
}
