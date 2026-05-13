import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const appSource = readFileSync("src/app.js", "utf8");
const pageSource = readFileSync("index.html", "utf8");

assert.equal(pageSource.includes("data-combo"), false, "combo HUD should not be rendered");
assert.equal(appSource.includes("combo"), false, "combo state and combo messaging should not exist");
assert.match(appSource, /score \+= result\.points;/, "successful selections should add base points only");

console.log("No combo feature assertions passed.");
