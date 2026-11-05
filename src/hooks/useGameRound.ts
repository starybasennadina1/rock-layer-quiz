import { useCallback, useRef, useState } from 'react';
import { ROUNDS_PER_RUN } from '../constants/config';
import type { RockType } from '../game/rocks';
import {
  buildRun,
  cliffScore,
  cycleScore,
  specimenScore,
  type Round,
} from '../game/rounds';

export type RunSummary = {
  score: number;
  correct: number;
  total: number;
  newRocks: string[];
};

const ACTIVE_UNITS: RockType[] = [
  'igneous',
  'sedimentary',
  'metamorphic',
  'mineral',
];

/**
 * Run state. Counters live in refs (ground truth readable inside callbacks,
 * rule #8) and are mirrored into state purely for rendering.
 */
export function useGameRound() {
  const [rounds, setRounds] = useState<Round[]>(() => buildRun(ACTIVE_UNITS));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correct, setCorrect] = useState(0);

  const scoreRef = useRef(0);
  const streakRef = useRef(0);
  const correctRef = useRef(0);
  const indexRef = useRef(0);
  const learnedRef = useRef<string[]>([]);

  const round = rounds[Math.min(index, rounds.length - 1)];

  const restart = useCallback(() => {
    scoreRef.current = 0;
    streakRef.current = 0;
    correctRef.current = 0;
    indexRef.current = 0;
    learnedRef.current = [];
    setRounds(buildRun(ACTIVE_UNITS));
    setIndex(0);
    setScore(0);
    setStreak(0);
    setCorrect(0);
  }, []);

  const markLearned = useCallback((id: string) => {
    if (learnedRef.current.indexOf(id) === -1) {
      learnedRef.current.push(id);
    }
  }, []);

  /** Returns the points gained so the score pill can pulse on a real delta. */
  const award = useCallback(
    (
      kind: Round['kind'],
      wasCorrect: boolean,
      opts?: { firstTry?: boolean; fossil?: boolean },
    ): number => {
      if (!wasCorrect) {
        streakRef.current = 0;
        setStreak(0);
        return 0;
      }

      streakRef.current += 1;
      const nextStreak = streakRef.current;

      let gain: number;
      if (kind === 'specimen') {
        gain = specimenScore(opts?.firstTry !== false, nextStreak);
      } else if (kind === 'cycle') {
        gain = cycleScore(nextStreak);
      } else {
        gain = cliffScore(Boolean(opts?.fossil), nextStreak);
      }

      scoreRef.current += gain;
      correctRef.current += 1;

      setStreak(nextStreak);
      setScore(scoreRef.current);
      setCorrect(correctRef.current);
      return gain;
    },
    [],
  );

  const advance = useCallback((onFinish: (summary: RunSummary) => void) => {
    const next = indexRef.current + 1;
    if (next >= ROUNDS_PER_RUN) {
      onFinish({
        score: scoreRef.current,
        correct: correctRef.current,
        total: ROUNDS_PER_RUN,
        newRocks: learnedRef.current.slice(),
      });
      return;
    }
    indexRef.current = next;
    setIndex(next);
  }, []);

  return {
    round,
    index,
    roundNumber: index + 1,
    totalRounds: ROUNDS_PER_RUN,
    progress: (index + 1) / ROUNDS_PER_RUN,
    score,
    streak,
    correct,
    award,
    advance,
    restart,
    markLearned,
  };
}
