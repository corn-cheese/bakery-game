# Codex Context: Cloud Bakery Game

## Project Overview

This project is a browser-based casual number puzzle game with a cute pixel-art bakery theme. The current product identity is **Cloud Bakery / 구름 베이커리 게임**.

The user decided to remove the previous product wording because it could be read in an unwanted way. Use bakery, pastry, tile, or Cloud Bakery wording instead.

The current workspace is this project root folder.

The user prefers Korean conversation. Planning documents may include English implementation text, but Korean explanations should be included for readability.

## User Preferences and Decisions

Confirmed decisions:

- Language for conversation: Korean.
- Current game name: **Cloud Bakery / 구름 베이커리 게임**.
- Main visual concept: **Cloud Bakery**.
- Gameplay rule: 10x10 sum-to-10 rectangular selection puzzle.
- Board size: **10x10**.
- Time modes: **2 minutes** and **5 minutes**.
- Board reset: if no score-gaining move remains, automatically reset the board.
- Asset strategy: **AI-generated bitmap background/character + CSS-generated bakery number tiles**.
- Visual direction: cozy pixel anime-game pixel art.
- Character direction: mid-20s pink-haired pastry-chef cheerleader with a sunny smile.
- Background music direction: **A. 햇살 베이커리 캐논**.
- Avoid the old product wording in docs and user-facing UI.

## Current Implementation State

Current files:

- `Plan.MD`
  - Planning document for the Cloud Bakery game direction.

- `package.json`
  - Package name: `cloud-bakery-game`.
  - Test command: `npm test`, currently mapped to `node tests/gameLogic.test.js && node tests/backgroundMusic.test.js` because `node --test` hit `spawn EPERM` in this environment.

- `.gitignore`
  - Excludes `.superpowers/`, `node_modules/`, and common OS metadata from the public GitHub repository.

- `README.md`
  - Documents local static-server execution and GitHub Pages deployment from `main` / repository root.

- `index.html`
  - Main game page.
  - Uses the user-facing name `구름 베이커리 게임`.
  - Loads `src/styles.css` and `src/app.js`.

- `src/gameLogic.js`
  - Pure game logic.
  - Exports board creation, rectangular selection, sum calculation, scoring, and valid-move detection.
  - Important constants:
    - `BOARD_SIZE = 10`
    - `TARGET_SUM = 10`
    - `POINTS_PER_TILE = 10`

- `src/backgroundMusic.js`
  - Web Audio background music module for the selected A Sun Bakery Canon direction.
  - Exports testable music data, loop-plan generation, note frequency conversion, and the browser music controller.

- `src/app.js`
  - Browser interaction layer.
  - Handles time mode selection, start/restart, pointer drag selection, scoring, automatic reset, timer, cheerleader messages, and background music start/mute control.
  - User-facing copy now uses bakery/tile wording.

- `src/styles.css`
  - Current visual styling.
  - Uses the selected bitmap Cloud Bakery background.
  - Uses CSS-generated bakery number tiles for readability.
  - Uses the selected bitmap pink-haired pastry-chef cheerleader character.

- `assets/background-cloud-bakery.png`
  - Generated bitmap background in the selected cozy pixel anime-game Cloud Bakery style.

- `assets/cheerleader-pink-pastry-chroma.png`
  - Generated source character image on green chroma-key background.
  - Kept in the workspace as a source/intermediate asset.

- `assets/cheerleader-pink-pastry.png`
  - Transparent PNG created from the chroma-key character image.
  - Used by `index.html`.

- `tests/gameLogic.test.js`
  - Tests the core rules.
  - Covers 10x10 board generation, rectangle selection, sum behavior, scoring/removal, invalid selection behavior, and valid-move detection.

- `tests/backgroundMusic.test.js`
  - Tests that the selected A Sun Bakery Canon loop data, canon answer delay, bass scheduling, pulse count, and note frequency conversion are stable.

- `music-demo.html`
  - Browser preview page for canon-based 8-bit MIDI direction demos.

- `src/musicDemo.js`
  - Web Audio preview player for the MIDI demo directions.
  - This lets the user hear the demos in-browser even though browsers do not natively play MIDI files.

- `scripts/generateMidiDemos.mjs`
  - Generates four Standard MIDI files under `assets/music/`.
  - Uses leader/answer/bell canon voices, bass support, and light percussion.

- `assets/music/*.mid`
  - Four short canon/counterpoint MIDI direction demos:
    - `demo-a-sun-bakery.mid`
    - `demo-b-cloud-soft.mid`
    - `demo-c-arcade-focus.mid`
    - `demo-d-dessert-magic.mid`

## Current App Behavior

Implemented behavior:

- 10x10 bakery tile board.
- Each active tile has a number from 1 to 9.
- Player chooses 2-minute or 5-minute mode before starting.
- Player starts/restarts the game with the start button.
- The selected A Sun Bakery Canon background music starts from a user gesture and can be toggled with the `음악 켜짐/음악 꺼짐` HUD button.
- Player drags across the board to select a rectangular area.
- Current selected sum is displayed.
- If the selected sum is 10:
  - selected tiles are removed,
  - score increases by the base tile score,
  - cheerleader message changes,
  - cheerleader animation restarts.
- If the selected sum is not 10:
  - selection clears.
- If no valid rectangular selection summing to 10 remains:
  - board automatically resets after a short delay,
  - message explains that a new board is coming.
- At 10 seconds remaining:
  - urgent cheerleader message appears.
- At timer end:
  - game stops,
  - final score overlay appears.

Separate music demo behavior:

- `music-demo.html` lets the user audition four 8-bit canon/counterpoint music directions:
  - A. Sun Bakery Canon: bright C major leader/answer canon.
  - B. Cloud Soft Canon: slower 3/4 soft canon with lower-octave answer.
  - C. Arcade Focus Canon: fast one-beat imitation for puzzle tension.
  - D. Dessert Magic Mirror Canon: inverted/mirror answer for a sparkling magic feel.
- Each demo has a Web Audio listen button and a downloadable MIDI file.
- The user selected **A. 햇살 베이커리 캐논** as the preferred direction.
- The main game now integrates that selected A direction as the final looping Web Audio BGM.

## Verification History

Most recent successful verification commands:

```powershell
node --check src/backgroundMusic.js
node --check src/app.js
node --check src/musicDemo.js
node --check scripts/generateMidiDemos.mjs
npm test
```

Most recent successful verification result:

- 10 tests passed.
- 0 tests failed.
- `src/backgroundMusic.js` syntax check passed.
- `src/app.js` syntax check passed.
- `src/musicDemo.js` syntax check passed.
- `scripts/generateMidiDemos.mjs` syntax check passed.
- Local HTTP smoke check for `http://127.0.0.1:64778/index.html` returned status 200.
- Local HTTP smoke check for `http://127.0.0.1:64779/index.html` returned status 200 during GitHub Pages preparation.
- In-app browser verification was attempted, but the Browser Use `iab` backend was unavailable in this session.

The app has previously been served with:

```powershell
py -m http.server 64777 --bind 127.0.0.1
```

The app was available at:

`http://127.0.0.1:64777/index.html`

The music demo was available at:

`http://127.0.0.1:64777/music-demo.html`

Do not assume that server is still running in a new session. Start a new local server only when the user asks for a live preview or when it is necessary for verification.

## Important Environment Notes

- This is a Windows PowerShell environment.
- Console output may display Korean text incorrectly due to encoding, even when files are valid UTF-8.
- `node --test` failed with `spawn EPERM`, so tests run directly with `node tests/gameLogic.test.js`.
- The project may live under a parent folder with an older local directory name. Treat **Cloud Bakery / 구름 베이커리 게임** as the current product name.
- There is an `AGENTS.md` in this folder. Always read it before continuing work.

## AGENTS.md Summary

The local `AGENTS.md` says:

- Think before coding.
- State assumptions and tradeoffs.
- Keep changes simple.
- Touch only files directly related to the request.
- Before changing files, state target files and intended changes.
- Verify work with commands.
- Maintain `PROGRESS.md` after meaningful tasks.
- Maintain `CONTEXT.MD` after every meaningful product, design, asset, or implementation decision.

## Recommended Next Steps

1. Prepare the game for link-only sharing through static hosting.
2. Push the initialized `main` repository to a GitHub remote and enable GitHub Pages from `main` / root.
3. Consider adding short sound effects for select, success, reset, timer warning, and game over.
4. Consider adding a more polished game-over/results UI.
5. Keep CSS bakery tiles unless the user explicitly asks for bitmap tile sprites.

## Latest Change Log

2026-05-14:

- Removed the combo feature: no combo HUD, no combo state, no combo score multiplier, and no combo cheer state/message.
- User clarified the online-sharing goal: friends should be able to open a single public link and play independently in their browsers. Recommended direction is static hosting, with GitHub Pages as the likely simplest durable option.
- Added `.gitignore` and `README.md` for GitHub Pages sharing, initialized the current folder as an independent `main` git repository, and verified `npm test`, syntax checks, and an HTTP 200 static-server smoke check.
- Renamed the project identity in docs and user-facing game text to Cloud Bakery / 구름 베이커리 게임.
- Removed previous product wording from product docs and UI copy.
- Updated `package.json` name to `cloud-bakery-game`.
- User selected **A. 햇살 베이커리 캐논** as the preferred background music direction.
- Integrated selected A as the main game BGM through `src/backgroundMusic.js`.
- Added the `음악 켜짐/음악 꺼짐` HUD toggle in `index.html`, `src/app.js`, and `src/styles.css`.
- Added `tests/backgroundMusic.test.js` and updated `npm test` to cover both logic and music.
- Earlier in the same session:
  - Generated final bitmap assets for the selected cozy pixel anime-game direction.
  - Integrated `assets/background-cloud-bakery.png`.
  - Integrated `assets/cheerleader-pink-pastry.png`.
  - Added a MIDI demo workflow.
  - Replaced the original four MIDI direction demos with canon/counterpoint-based versions.
