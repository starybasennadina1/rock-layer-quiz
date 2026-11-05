import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export { SCREEN_W, SCREEN_H };

// Rule #13 — EXACTLY 8000ms; shorter values race the UI-test screenshot window.
export const LOADER_DURATION_MS = 8000;
export const LOADER_BAR_MS = 7200;

// Screen transition language.
export const FADE_MS = 260;
export const FEEDBACK_LOCK_MS = 650;
export const CRACK_MS = 350;
export const DUST_MS = 420;

// Run shape.
export const ROUNDS_PER_RUN = 10;
export const SPECIMEN_ROUNDS = 6;
export const CYCLE_ROUNDS = 2;
export const CLIFF_ROUNDS = 2;
export const OPTIONS_PER_ROUND = 4;
export const TOTAL_ROCKS = 40;
export const ROCKS_PER_UNIT = 10;

// Scoring.
export const SCORE_SPECIMEN = 100;
export const SCORE_FIRST_TRY = 40;
export const SCORE_CYCLE = 150;
export const SCORE_CLIFF = 150;
export const SCORE_FOSSIL = 15;
export const SCORE_STREAK_STEP = 10;
export const STREAK_CAP = 5;
export const GOOD_DIG_RATIO = 0.7;

// Board geometry — rules #4, #5. The frame is accounted for, so overflow is 0px.
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const PAD = 8;
export const BORDER = 2;
export const BOARD_FRAME = PAD + BORDER; // 10
export const CONTENT_W = BOARD_MAX_W - 2 * BOARD_FRAME;
export const BOARD_W = CONTENT_W + 2 * BOARD_FRAME; // === BOARD_MAX_W

// Control metrics. Every tappable control stays >= 48px tall.
export const BAND_H = 64;
export const OPTION_H = 56;
export const GAP = 8;
export const STAT_STRIP_H = 34;
export const HEADER_H = 72;
export const HEADER_PAD_TOP = 44; // rule #6
export const CHROME_H = HEADER_H + HEADER_PAD_TOP; // 116

const CONTROLS_CHROME = STAT_STRIP_H + 12 + 16;

/** Specimen rounds: four stacked answer rows. */
export const CONTROLS_H_LIST = CONTROLS_CHROME + 4 * OPTION_H + 3 * GAP; // 310
/** Cycle + cliff rounds: a 2x2 grid of chips / order slots. */
export const CONTROLS_H_GRID = CONTROLS_CHROME + 2 * OPTION_H + GAP; // 182

/** Explicit stage height per round kind — never flex:1 inside flex:1 (#19a). */
function stageHeight(controlsH: number): number {
  return Math.max(180, Math.min(400, SCREEN_H - CHROME_H - controlsH - 24));
}

export const STAGE_H_LIST = stageHeight(CONTROLS_H_LIST);
export const STAGE_H_GRID = stageHeight(CONTROLS_H_GRID);

/** The specimen sprite scales with the stage so the card can never overflow. */
export const SPECIMEN_SIZE = Math.max(84, Math.min(150, STAGE_H_LIST - 140));

/** Cliff bands: four per round, sized to fill the grid stage exactly. */
export const CLIFF_BANDS = 4;
export const CLIFF_GAP = 8;
export const CLIFF_BAND_H = Math.max(
  48,
  Math.min(
    BAND_H,
    Math.floor(
      (STAGE_H_GRID - 2 * PAD - (CLIFF_BANDS - 1) * CLIFF_GAP) / CLIFF_BANDS,
    ),
  ),
);

/** Rock-cycle diagram, capped so its 0.82 aspect still fits the grid stage. */
export const CYCLE_W = Math.min(
  CONTENT_W,
  Math.floor((STAGE_H_GRID - 2 * PAD - 16) / 0.82),
);

// Collection grid.
export const COLLECTION_COLS = 3;
export const COLLECTION_GAP = 10;
export const COLLECTION_CARD_W = Math.floor(
  (CONTENT_W - (COLLECTION_COLS - 1) * COLLECTION_GAP) / COLLECTION_COLS,
);

export const TEXT_SCALES = { S: 1, M: 1.12, L: 1.26 } as const;
export type TextSize = keyof typeof TEXT_SCALES;

export const APP_VERSION = '1.0';
