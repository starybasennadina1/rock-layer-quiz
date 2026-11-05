import { useCallback, useEffect, useRef, useState } from 'react';
import { Vibration } from 'react-native';
import { FEEDBACK_LOCK_MS } from '../constants/config';

export type Phase = 'idle' | 'playing' | 'correct' | 'wrong';

/**
 * Owns the 650ms feedback lock window plus the crack / dust phase.
 * Haptics are gated by the user setting (AndroidManifest declares VIBRATE).
 */
export function useFeedback(hapticsEnabled: boolean) {
  const [phase, setPhase] = useState<Phase>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Animation / callback data lives in a ref, never in state (rule #8).
  const haptics = useRef(hapticsEnabled);
  haptics.current = hapticsEnabled;

  const clear = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => clear, [clear]);

  const tick = useCallback((ms: number) => {
    if (haptics.current) {
      Vibration.vibrate(ms);
    }
  }, []);

  const reset = useCallback(() => {
    clear();
    setPhase('idle');
  }, [clear]);

  /** Fires the feedback window and calls `after` when the lock expires. */
  const resolve = useCallback(
    (correct: boolean, after: () => void) => {
      clear();
      setPhase(correct ? 'correct' : 'wrong');
      tick(correct ? 25 : 10);
      timer.current = setTimeout(() => {
        timer.current = null;
        setPhase('idle');
        after();
      }, FEEDBACK_LOCK_MS);
    },
    [clear, tick],
  );

  return { phase, locked: phase !== 'idle', resolve, reset, tick, setPhase };
}
