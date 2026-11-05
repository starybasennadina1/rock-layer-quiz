import { CLIFF_BANDS } from '../constants/config';
import { shuffle } from '../utils/format';

export type CliffBandData = {
  key: string;
  label: string;
  note: string;
  gradient: [string, string];
  hasFossil: boolean;
  hasFault: boolean;
  /** 0 = oldest (deepest). Correct tap order is ascending. */
  age: number;
};

const BAND_PALETTE: [string, string][] = [
  ['#8A6B4F', '#6E5440'],
  ['#7F8C6A', '#5F6B4E'],
  ['#9A7E63', '#7A6149'],
  ['#5F5750', '#45403A'],
  ['#8F7357', '#6B543F'],
];

type Seed = { label: string; note: string };

const STACKS: Seed[][] = [
  [
    { label: 'BASALT', note: 'LAVA FLOW' },
    { label: 'SHALE', note: 'FOSSIL' },
    { label: 'SANDSTONE', note: 'DUNE BEDS' },
    { label: 'LIMESTONE', note: 'SEA FLOOR' },
  ],
  [
    { label: 'GNEISS', note: 'BASEMENT' },
    { label: 'CONGLOMERATE', note: 'RIVER BED' },
    { label: 'CHALK', note: 'FOSSIL' },
    { label: 'SILTSTONE', note: 'FLOOD MUD' },
    { label: 'COAL', note: 'OLD SWAMP' },
  ],
  [
    { label: 'GRANITE', note: 'DEEP ROOT' },
    { label: 'QUARTZITE', note: 'BAKED SAND' },
    { label: 'SHALE', note: 'FOSSIL' },
    { label: 'SANDSTONE', note: 'BEACH' },
  ],
  [
    { label: 'SLATE', note: 'PRESSED MUD' },
    { label: 'BRECCIA', note: 'ROCK FALL' },
    { label: 'LIMESTONE', note: 'FOSSIL' },
    { label: 'ROCK SALT', note: 'DRY LAGOON' },
    { label: 'SANDSTONE', note: 'DESERT' },
  ],
];

/**
 * Builds one cliff round: bands in random display order, each carrying its true
 * age (0 = oldest). Superposition means the learner taps oldest -> youngest.
 */
export function buildCliff(): CliffBandData[] {
  const picked = STACKS[Math.floor(Math.random() * STACKS.length)];
  // Exactly CLIFF_BANDS layers, so the stage geometry is fixed and never overflows.
  const stack = picked.slice(0, CLIFF_BANDS);
  const faultIndex = Math.random() < 0.5 ? 1 : -1;

  const bands: CliffBandData[] = stack.map((seed, i) => ({
    key: `${seed.label}-${i}`,
    label: seed.label,
    note: seed.note,
    gradient: BAND_PALETTE[i % BAND_PALETTE.length],
    hasFossil: seed.note === 'FOSSIL',
    hasFault: i === faultIndex,
    age: i,
  }));

  return shuffle(bands);
}

export function cliffHasFossil(bands: readonly CliffBandData[]): boolean {
  return bands.some(b => b.hasFossil);
}
