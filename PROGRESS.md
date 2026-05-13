# Progress

## Completed Features

- Created `Plan.MD` with the agreed Cloud Bakery game direction and Korean explanations.
- Implemented a first playable browser version.
- Added 10x10 board generation.
- Added rectangular drag selection.
- Added sum-to-10 scoring and tile removal.
- Added score tracking.
- Added 2-minute and 5-minute modes.
- Added automatic board reset when no valid sum-to-10 rectangle remains.
- Added responsive Cloud Bakery styling with CSS bakery tiles and a cheerleader panel.
- Added core game logic tests.
- Created `CONTEXT.MD` so a future Codex session can understand the project state.
- Updated `AGENTS.md` to require ongoing `CONTEXT.MD` maintenance.
- Generated and integrated selected C-style bitmap assets.
- Enlarged the cheerleader panel and added repeatable scoring animation.
- Added four 8-bit MIDI direction demos and a browser listening page.
- Replaced the four MIDI direction demos with canon/counterpoint-based versions.
- User selected **A. 햇살 베이커리 캐논** as the preferred background music direction.
- Renamed user-facing game text and project docs to **Cloud Bakery / 구름 베이커리 게임**.
- Integrated the selected A music direction into the main game as a looping Web Audio BGM with a mute control.
- Added focused tests for the final Sun Bakery music loop plan.
- Removed combo scoring, combo HUD, and combo cheer messaging.
- Prepared the game folder for link-only sharing through GitHub Pages static hosting.
- Added `.gitignore` and `README.md` with local run and GitHub Pages deployment notes.

## In Progress

- Preparing the project for GitHub upload.
- The project identity is Cloud Bakery / 구름 베이커리 게임.

## Remaining Tasks

- Consider adding sound effects for select, success, reset, timer warning, and game over.
- Consider adding a more polished game-over/results UI.
- Consider adding a build setup if the project moves to Vite or TypeScript later.
- Push the newly initialized `main` repository to a GitHub remote, then enable GitHub Pages from `main` / root.

## Known Bugs

- `node --test` failed with `spawn EPERM` in this environment, so tests currently run directly via `node tests/gameLogic.test.js`.
- The transparent cheerleader PNG was created with a simple .NET chroma-key pass because Pillow was unavailable for the bundled imagegen helper.

## Last Verified Command

```powershell
node --check src/backgroundMusic.js
node --check src/app.js
node --check src/musicDemo.js
node --check scripts/generateMidiDemos.mjs
npm test
py -m http.server 64779 --bind 127.0.0.1
```

Latest static hosting smoke check returned HTTP 200 for `http://127.0.0.1:64779/index.html`.

## Latest Music Update

2026-05-14:

- Researched basic composition principles for this task:
  - short motives,
  - repetition and variation,
  - phrase-level structure,
  - stable harmonic support,
  - strict/time-delayed imitation for canon writing.
- Reworked `scripts/generateMidiDemos.mjs` so the four Standard MIDI files use leader/answer/bell canon voices, bass support, and light percussion.
- Overwrote the existing files in `assets/music/`.
- Fixed `music-demo.html` and `src/musicDemo.js` Korean text that was previously mojibake/corrupted.
- Verified the MIDI header starts with a valid Standard MIDI `MThd` chunk.
- User selected A as the direction to carry forward.
- Added `src/backgroundMusic.js` with the selected A Sun Bakery Canon Web Audio loop.
- Added a main-game `음악 켜짐/음악 꺼짐` HUD control.
- Updated `package.json` so `npm test` runs both game logic and background music tests.
- Started a local static server on `http://127.0.0.1:64778/index.html`; HTTP returned 200. The in-app browser backend was unavailable in this session, so visual browser verification could not be completed there.

## Notes for Next Agent

- Read `AGENTS.md` before editing.
- Keep conversation in Korean unless the user asks otherwise.
- Do not treat the sibling `apple-game/AGENTS.md` as the active instruction file for this folder.
- Keep game logic in `src/gameLogic.js` testable and UI-independent.
- The project should now be described as Cloud Bakery / 구름 베이커리 게임.
- Avoid the previous product wording in user-facing text and docs.
- Do not start a long-running dev server unless explicitly needed or requested.
