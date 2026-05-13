import assert from "node:assert/strict";
import test from "node:test";

import { getTileCell } from "../src/tileCell.js";

function createTile({ row, col, isEmpty = false }) {
  return {
    dataset: {
      row: String(row),
      col: String(col)
    },
    classList: {
      contains(className) {
        return className === "is-empty" && isEmpty;
      }
    }
  };
}

test("getTileCell returns coordinates for an empty tile corner", () => {
  const emptyTile = createTile({ row: 2, col: 4, isEmpty: true });
  const target = {
    closest(selector) {
      return selector === ".tile" ? emptyTile : null;
    }
  };

  assert.deepEqual(getTileCell(target), { row: 2, col: 4 });
});
