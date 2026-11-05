import { useCallback, useMemo, useState } from 'react';
import { ROCKS, UNITS, type RockType } from '../game/rocks';
import { ROCKS_PER_UNIT, TOTAL_ROCKS, type TextSize } from '../constants/config';

export type Progress = {
  learned: string[];
  bestScore: number;
  runs: number;
};

export type Settings = {
  sound: boolean;
  haptics: boolean;
  textSize: TextSize;
};

const INITIAL_PROGRESS: Progress = {
  // Two starter specimens so the Menu never shows an empty 0-value pill.
  learned: ['granite', 'sandstone'],
  bestScore: 0,
  runs: 0,
};

const INITIAL_SETTINGS: Settings = {
  sound: true,
  haptics: true,
  textSize: 'M',
};

export type UnitProgress = {
  id: RockType;
  label: string;
  colour: string;
  done: number;
  total: number;
};

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(INITIAL_PROGRESS);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);

  const learnedSet = useMemo(
    () => new Set(progress.learned),
    [progress.learned],
  );

  const unitProgress = useMemo<UnitProgress[]>(
    () =>
      UNITS.map(u => ({
        id: u.id,
        label: u.label,
        colour: u.colour,
        done: ROCKS.filter(r => r.type === u.id && learnedSet.has(r.id)).length,
        total: ROCKS_PER_UNIT,
      })),
    [learnedSet],
  );

  const commitRun = useCallback(
    (score: number, newlyLearned: readonly string[]) => {
      setProgress(prev => {
        const merged = new Set(prev.learned);
        newlyLearned.forEach(id => merged.add(id));
        return {
          learned: Array.from(merged).slice(0, TOTAL_ROCKS),
          bestScore: Math.max(prev.bestScore, score),
          runs: prev.runs + 1,
        };
      });
    },
    [],
  );

  const resetProgress = useCallback(() => {
    setProgress(INITIAL_PROGRESS);
  }, []);

  const setSetting = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      setSettings(prev => ({ ...prev, [key]: value }));
    },
    [],
  );

  return {
    learnedIds: progress.learned,
    learnedSet,
    learnedCount: progress.learned.length,
    bestScore: progress.bestScore,
    runs: progress.runs,
    unitProgress,
    settings,
    setSetting,
    commitRun,
    resetProgress,
  };
}
