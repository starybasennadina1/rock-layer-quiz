import {
  CLIFF_ROUNDS,
  CYCLE_ROUNDS,
  OPTIONS_PER_ROUND,
  ROUNDS_PER_RUN,
  SCORE_CLIFF,
  SCORE_CYCLE,
  SCORE_FIRST_TRY,
  SCORE_FOSSIL,
  SCORE_SPECIMEN,
  SCORE_STREAK_STEP,
  SPECIMEN_ROUNDS,
  STREAK_CAP,
} from '../constants/config';
import { pickN, shuffle } from '../utils/format';
import { buildCliff, type CliffBandData } from './cliff';
import { ROCKS, TYPE_LABEL, type Rock, type RockType } from './rocks';

export type ProcessId = 'melting' | 'cooling' | 'erosion' | 'heat';

export const PROCESSES: { id: ProcessId; label: string }[] = [
  { id: 'melting', label: 'MELTING' },
  { id: 'cooling', label: 'COOLING' },
  { id: 'erosion', label: 'EROSION' },
  { id: 'heat', label: 'HEAT & PRESSURE' },
];

export type CycleSlot = {
  id: ProcessId;
  /** label of the arrow this slot belongs to, e.g. MAGMA -> ROCK */
  from: string;
  to: string;
};

export const CYCLE_SLOTS: CycleSlot[] = [
  { id: 'cooling', from: 'MAGMA', to: 'ROCK' },
  { id: 'erosion', from: 'ROCK', to: 'SEDIMENT' },
  { id: 'heat', from: 'SEDIMENT', to: 'ROCK' },
  { id: 'melting', from: 'ROCK', to: 'MAGMA' },
];

export type SpecimenRound = {
  kind: 'specimen';
  rock: Rock;
  ask: 'name' | 'type';
  question: string;
  options: string[];
  correctIndex: number;
};

export type CycleRound = {
  kind: 'cycle';
  question: string;
  slots: CycleSlot[];
  chips: { id: ProcessId; label: string }[];
};

export type CliffRound = {
  kind: 'cliff';
  question: string;
  bands: CliffBandData[];
};

export type Round = SpecimenRound | CycleRound | CliffRound;

function buildSpecimenRound(rock: Rock, askType: boolean): SpecimenRound {
  if (askType) {
    const types: RockType[] = [
      'igneous',
      'sedimentary',
      'metamorphic',
      'mineral',
    ];
    const options = shuffle(types).map(t => TYPE_LABEL[t]);
    return {
      kind: 'specimen',
      rock,
      ask: 'type',
      question: 'WHICH TYPE IS IT?',
      options,
      correctIndex: options.indexOf(TYPE_LABEL[rock.type]),
    };
  }

  const sameFamily = ROCKS.filter(r => r.type === rock.type && r.id !== rock.id);
  const distractors = pickN(sameFamily, OPTIONS_PER_ROUND - 1).map(r => r.name);
  const options = shuffle([rock.name, ...distractors]);

  return {
    kind: 'specimen',
    rock,
    ask: 'name',
    question: 'WHICH ROCK IS THIS?',
    options,
    correctIndex: options.indexOf(rock.name),
  };
}

function buildCycleRound(): CycleRound {
  return {
    kind: 'cycle',
    question: 'REBUILD THE ROCK CYCLE',
    slots: CYCLE_SLOTS,
    chips: shuffle(PROCESSES),
  };
}

function buildCliffRound(): CliffRound {
  return {
    kind: 'cliff',
    question: 'TAP THE LAYERS OLDEST FIRST',
    bands: buildCliff(),
  };
}

/** Never two cliff rounds back to back (design doc, mechanic 1). */
function arrange(kinds: Round['kind'][]): Round['kind'][] {
  for (let attempt = 0; attempt < 40; attempt++) {
    const order = shuffle(kinds);
    let ok = true;
    for (let i = 1; i < order.length; i++) {
      if (order[i] === 'cliff' && order[i - 1] === 'cliff') {
        ok = false;
        break;
      }
    }
    if (ok) {
      return order;
    }
  }
  return kinds.slice();
}

export function buildRun(unitPool: RockType[]): Round[] {
  const pool = ROCKS.filter(r => unitPool.indexOf(r.type) !== -1);
  const specimens = pickN(pool.length >= SPECIMEN_ROUNDS ? pool : ROCKS, SPECIMEN_ROUNDS);

  const kinds: Round['kind'][] = [
    ...new Array(SPECIMEN_ROUNDS).fill('specimen'),
    ...new Array(CYCLE_ROUNDS).fill('cycle'),
    ...new Array(CLIFF_ROUNDS).fill('cliff'),
  ];

  const order = arrange(kinds);
  let specimenCursor = 0;

  const rounds: Round[] = order.map((kind, i) => {
    if (kind === 'cycle') {
      return buildCycleRound();
    }
    if (kind === 'cliff') {
      return buildCliffRound();
    }
    const rock = specimens[specimenCursor % specimens.length];
    specimenCursor += 1;
    return buildSpecimenRound(rock, i % 3 === 2);
  });

  return rounds.slice(0, ROUNDS_PER_RUN);
}

export function streakBonus(streak: number): number {
  return SCORE_STREAK_STEP * Math.min(streak, STREAK_CAP);
}

export function specimenScore(firstTry: boolean, streak: number): number {
  return SCORE_SPECIMEN + (firstTry ? SCORE_FIRST_TRY : 0) + streakBonus(streak);
}

export function cycleScore(streak: number): number {
  return SCORE_CYCLE + streakBonus(streak);
}

export function cliffScore(fossil: boolean, streak: number): number {
  return SCORE_CLIFF + (fossil ? SCORE_FOSSIL : 0) + streakBonus(streak);
}

export function roundLabel(round: Round): string {
  if (round.kind === 'specimen') {
    return 'SPECIMEN';
  }
  if (round.kind === 'cycle') {
    return 'ROCK CYCLE';
  }
  return 'CLIFF READER';
}
