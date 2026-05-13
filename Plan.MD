# Cloud Bakery Game Plan

## 1. Product Direction

Build a browser-based casual puzzle game with a cute pixel-art bakery theme. The final visual concept is **Cloud Bakery**: a dreamy bakery-in-the-sky background, readable bakery number tiles, and a friendly pastry-chef cheerleader.

**한국어 설명:**  
브라우저에서 바로 플레이할 수 있는 캐주얼 숫자 퍼즐 게임으로 만든다. 기존 이름과 테마에서 오해를 부를 수 있는 표현은 제거하고, 전체 정체성을 **구름 베이커리 게임**으로 정리한다.

## 2. Core Game Rules

- Use a **10x10 game board**.
- Each tile contains a number from 1 to 9.
- The player drags to select a rectangular area of tiles.
- If the selected numbers add up to **10**, the selected tiles are removed and the player earns points.
- If the selected sum is not 10, the selection is cleared without scoring.
- The game continues until the timer ends.

**한국어 설명:**  
보드는 10x10이다. 플레이어는 드래그로 사각형 영역을 선택하고, 선택된 숫자의 합이 10이면 점수를 얻는다. 숫자 합계와 직사각형 선택이 핵심인 간단한 퍼즐 규칙을 유지한다.

## 3. Time Modes

Provide two selectable time modes before the game starts:

- **2 minutes**
- **5 minutes**

The selected mode should be visually clear. During gameplay, show the remaining time in the main HUD. When the timer ends, stop interaction and show the final score.

## 4. Board Reset Rule

The game should detect when no more score-gaining selections are possible. If the board has no valid rectangular selection whose sum is 10, automatically reset the board with a positive message.

## 5. Visual Assets

Use a mixed asset strategy:

- Bitmap background image for the **Cloud Bakery** scene.
- Bitmap pastry-chef cheerleader image.
- CSS-generated bakery number tiles for sharp numbers, clear interaction states, and easy maintenance.

The background should be cute and atmospheric, but it must not compete with the board. Place the board on a readable tray-like panel with enough contrast.

## 6. Layout

Desktop layout:

- Main game board centered and visually dominant.
- Cheerleader panel on the right side of the board.
- Top HUD with time mode, start/restart button, remaining time, and score.

Mobile layout:

- Top compact HUD.
- 10x10 board as the primary focus.
- Cheerleader reduced and moved below the board.
- Feedback should never block tile selection for too long.

## 7. Cheerleader Feedback

The cheerleader acts as a game-state feedback character:

- Successful sum of 10: cheerful reaction.
- Automatic board reset: encouraging reset message.
- Last 10 seconds: urgent encouragement.
- Game over: final score reaction.

## 8. Interaction Feedback

During drag selection:

- Highlight the rectangular selection area.
- Highlight included tiles.
- Show the current selected sum.
- Use a valid/invalid color difference when the sum reaches 10 or exceeds it.

On success:

- Remove selected tiles.
- Add score.
- Replay the cheerleader success animation.

## 9. Visual Style Notes

Primary palette:

- Bakery white
- Baby blue
- Strawberry pink
- Lemon yellow
- Warm brown for numbers and outlines

Avoid low-contrast pastel-on-pastel text. Tile numbers should be bold, dark, and readable on both desktop and mobile.

## 10. Music Direction

The selected background music direction is **A. 햇살 베이커리 캐논**.

This direction uses:

- Bright major-key arcade/bakery energy.
- A short memorable motive.
- Leader/answer canon imitation.
- Light 8-bit percussion and bass support.

## 11. Initial Implementation Scope

The playable version includes:

- 10x10 board generation.
- Drag rectangle selection.
- Sum calculation.
- Remove tiles when the sum is 10.
- Score tracking.
- 2-minute and 5-minute timer modes.
- Automatic board reset when no valid moves remain.
- Desktop and mobile responsive layout.
- Cloud Bakery background and pastry-chef cheerleader bitmap assets.
- Four canon MIDI demos, with A selected as the preferred direction.
- Selected A Sun Bakery Canon integrated into the main game as looping background music with a mute control.

## 12. Open Decisions

- Whether removed tiles disappear permanently until reset or refill immediately.
- Whether to add sound effects for selection, success, reset, and game over.
