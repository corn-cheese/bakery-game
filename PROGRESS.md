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
- Added short Web Audio sound effects for select, success, reset, timer warning, and game over.
- Added a polished start/results overlay with score, cleared tile count, selected mode, and result message.
- Fixed rectangle dragging so cleared/empty tiles can be used as selection corners.

## In Progress

- GitHub upload is complete.
- The project identity is Cloud Bakery / 구름 베이커리 게임.
- GitHub Pages is not active yet: `https://corn-cheese.github.io/bakery-game/` returned HTTP 404 on 2026-05-14.

## Remaining Tasks

- Enable GitHub Pages from `main` / root in `https://github.com/corn-cheese/bakery-game`.
- Do not add a Vite/TypeScript build setup unless the project actually moves to that toolchain later.

## Known Bugs

- `node --test` failed with `spawn EPERM` in this environment, so tests currently run directly via `node tests/gameLogic.test.js`.
- The transparent cheerleader PNG was created with a simple .NET chroma-key pass because Pillow was unavailable for the bundled imagegen helper.

## Last Verified Command

```powershell
node --check src/backgroundMusic.js
node --check src/app.js
node --check src/soundEffects.js
node --check src/results.js
node --check src/musicDemo.js
node --check scripts/generateMidiDemos.mjs
node --check src/tileCell.js
npm test
py -m http.server 64780 --bind 127.0.0.1
```

Latest static hosting smoke check returned HTTP 200 for `http://127.0.0.1:64780/index.html`.
Remote Pages check returned 404 for `https://corn-cheese.github.io/bakery-game/`, so the public link is not playable until Pages is enabled in GitHub settings.

## Latest Empty-Corner Drag Bugfix

2026-05-14:

- Root cause: empty tiles were disabled in `src/app.js`, and tile coordinate lookup rejected `.is-empty` tiles, so blank spaces could not start or finish rectangle drags.
- Added `src/tileCell.js` to resolve tile coordinates for both active and empty tiles.
- Updated `src/app.js` to keep empty tiles interactive for pointer dragging while still rendering them visually empty.
- Added `tests/tileCell.test.js` and included it in `npm test`.
- Verified `node --check src/app.js`, `node --check src/tileCell.js`, and `npm test`.

## Latest SFX and Results UI Update

2026-05-14:

- Added `src/soundEffects.js` with short Web Audio cues for tile select, success, board reset, 10-second warning, and game over.
- Added `tests/soundEffects.test.js` to lock the event set and effect timing.
- Added `src/results.js` and `tests/results.test.js` for final score/result summary text.
- Updated `src/app.js` to play the new effects and render a structured start/results overlay.
- Updated `src/styles.css` with the compact result card styling.
- Updated `package.json` so `npm test` includes sound effect and result summary tests.
- Verified `node --check src/app.js`, `node --check src/soundEffects.js`, `node --check src/results.js`, `npm test`, and local HTTP 200 on `http://127.0.0.1:64780/index.html`.

## Latest GitHub Upload

2026-05-14:

- Initialized this folder as an independent `main` git repository.
- Added GitHub remote `https://github.com/corn-cheese/bakery-game.git`.
- Pushed `main` to GitHub successfully.
- Next step: enable GitHub Pages from `main` / root, then share `https://corn-cheese.github.io/bakery-game/`.

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
