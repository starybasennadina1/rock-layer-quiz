import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { Gem } from 'lucide-react-native';
import ScreenShell from '../components/ScreenShell';
import ScreenHeader from '../components/ScreenHeader';
import ProgressRail from '../components/ProgressRail';
import StoneSurface from '../components/StoneSurface';
import AnswerOption, { type OptionState } from '../components/AnswerOption';
import ProcessChip from '../components/ProcessChip';
import CliffBand from '../components/CliffBand';
import RockCycleDiagram from '../components/RockCycleDiagram';
import SpecimenStage from '../components/SpecimenStage';
import HintChip from '../components/HintChip';
import { assets } from '../assets';
import theme from '../constants/theme';
import {
  BOARD_W,
  CONTROLS_H_GRID,
  CONTROLS_H_LIST,
  CYCLE_W,
  GAP,
  OPTION_H,
  PAD,
  STAGE_H_GRID,
  STAGE_H_LIST,
  STAT_STRIP_H,
} from '../constants/config';
import { TYPE_LABEL } from '../game/rocks';
import { PROCESSES, roundLabel, type ProcessId } from '../game/rounds';
import { useFeedback } from '../hooks/useFeedback';
import { useGameRound, type RunSummary } from '../hooks/useGameRound';
import { formatNumber } from '../utils/format';

const LETTERS = ['A', 'B', 'C', 'D'];
const MAX_MISTAKES = 2;

type Props = {
  haptics: boolean;
  onExit: () => void;
  onGameOver: (summary: RunSummary) => void;
};

export function GameScreen({ haptics, onExit, onGameOver }: Props) {
  const game = useGameRound();
  const fb = useFeedback(haptics);
  const { round, score, streak, roundNumber, totalRounds, award, advance, markLearned } = game;

  // Per-round interaction state.
  const [picked, setPicked] = useState<number | null>(null);
  const [selectedChip, setSelectedChip] = useState<ProcessId | null>(null);
  const [filled, setFilled] = useState<Partial<Record<ProcessId, string>>>({});
  const [rejected, setRejected] = useState<ProcessId | null>(null);
  const [order, setOrder] = useState<string[]>([]);
  const [shakeKey, setShakeKey] = useState<string | null>(null);

  const mistakes = useRef(0);
  const scorePulse = useRef(new Animated.Value(1)).current;
  const shakeStage = useRef(new Animated.Value(0)).current;
  const finish = useRef(onGameOver);
  finish.current = onGameOver;

  const resetRoundState = useCallback(() => {
    mistakes.current = 0;
    setPicked(null);
    setSelectedChip(null);
    setFilled({});
    setRejected(null);
    setOrder([]);
    setShakeKey(null);
  }, []);

  const next = useCallback(() => {
    resetRoundState();
    advance(summary => finish.current(summary));
  }, [advance, resetRoundState]);

  const pulseScore = useCallback(() => {
    scorePulse.setValue(1);
    Animated.sequence([
      Animated.timing(scorePulse, {
        toValue: 1.18,
        duration: 120,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scorePulse, {
        toValue: 1,
        duration: 120,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [scorePulse]);

  const shakeTheStage = useCallback(() => {
    shakeStage.setValue(0);
    Animated.sequence([
      Animated.timing(shakeStage, { toValue: 1, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeStage, { toValue: -1, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeStage, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, [shakeStage]);

  const settle = useCallback(
    (correct: boolean, gained: number) => {
      if (gained > 0) {
        pulseScore();
      }
      if (!correct) {
        shakeTheStage();
      }
      fb.resolve(correct, next);
    },
    [fb, next, pulseScore, shakeTheStage],
  );

  // ---------- specimen ----------
  const onAnswer = useCallback(
    (i: number) => {
      if (fb.locked || round.kind !== 'specimen') {
        return;
      }
      setPicked(i);
      const correct = i === round.correctIndex;
      if (correct) {
        markLearned(round.rock.id);
      }
      const gained = award('specimen', correct, { firstTry: true });
      settle(correct, gained);
    },
    [fb.locked, round, award, markLearned, settle],
  );

  // ---------- cycle ----------
  const onChip = useCallback(
    (id: string) => {
      if (fb.locked) {
        return;
      }
      setSelectedChip(id as ProcessId);
    },
    [fb.locked],
  );

  const onSlot = useCallback(
    (slotId: ProcessId) => {
      if (fb.locked || round.kind !== 'cycle' || !selectedChip) {
        return;
      }
      if (selectedChip !== slotId) {
        setRejected(slotId);
        fb.tick(10);
        mistakes.current += 1;
        setSelectedChip(null);
        if (mistakes.current > MAX_MISTAKES) {
          settle(false, award('cycle', false));
        }
        return;
      }

      const label =
        PROCESSES.find(p => p.id === slotId)?.label ?? slotId.toUpperCase();
      setRejected(null);
      setSelectedChip(null);
      fb.tick(10);

      const nextFilled = { ...filled, [slotId]: label };
      setFilled(nextFilled);
      if (Object.keys(nextFilled).length >= round.slots.length) {
        settle(true, award('cycle', true));
      }
    },
    [fb, round, selectedChip, filled, award, settle],
  );

  // ---------- cliff ----------
  const onBand = useCallback(
    (key: string) => {
      if (fb.locked || round.kind !== 'cliff') {
        return;
      }
      const band = round.bands.find(b => b.key === key);
      if (!band || order.indexOf(key) !== -1) {
        return;
      }

      if (band.age !== order.length) {
        setShakeKey(key);
        fb.tick(10);
        mistakes.current += 1;
        setTimeout(() => setShakeKey(null), 220);
        if (mistakes.current > MAX_MISTAKES) {
          settle(false, award('cliff', false));
        }
        return;
      }

      fb.tick(10);
      const nextOrder = order.concat(key);
      setOrder(nextOrder);
      if (nextOrder.length >= round.bands.length) {
        const fossil = round.bands.some(b => b.hasFossil);
        settle(true, award('cliff', true, { fossil }));
      }
    },
    [fb, round, order, award, settle],
  );

  // Clear the one-shot wrong-band flag when the round changes.
  useEffect(() => {
    setShakeKey(null);
  }, [roundNumber]);

  const isList = round.kind === 'specimen';
  const stageH = isList ? STAGE_H_LIST : STAGE_H_GRID;
  const controlsH = isList ? CONTROLS_H_LIST : CONTROLS_H_GRID;

  const optionStates = useMemo<OptionState[]>(() => {
    if (round.kind !== 'specimen') {
      return [];
    }
    return round.options.map((_, i) => {
      if (picked === null) {
        return 'idle';
      }
      if (i === round.correctIndex) {
        return 'correct';
      }
      if (i === picked) {
        return 'wrong';
      }
      return 'disabled';
    });
  }, [round, picked]);

  const unitLabel =
    round.kind === 'specimen' ? TYPE_LABEL[round.rock.type] : roundLabel(round);

  const stageShift = shakeStage.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-5, 0, 5],
  });

  const orderedBands = useMemo(() => {
    if (round.kind !== 'cliff') {
      return [];
    }
    return order.map(k => round.bands.find(b => b.key === k));
  }, [round, order]);

  return (
    <ScreenShell overlay={theme.overlays.game}>
      <ScreenHeader
        title={`${roundLabel(round)} ${roundNumber}/${totalRounds}`}
        onBack={onExit}
        backGlyph={
          <Image source={assets.iconPause} style={styles.pauseIcon} resizeMode="contain" />
        }
        subtitle={
          <View style={styles.railWrap}>
            <ProgressRail
              progress={roundNumber / totalRounds}
              width={120}
              height={4}
              colour={theme.colors.primary}
            />
          </View>
        }
        rightSlot={
          <Animated.View
            style={[styles.scorePill, { transform: [{ scale: scorePulse }] }]}>
            <Gem size={16} color={theme.colors.accent} strokeWidth={2.4} />
            <Text style={styles.scoreText}>{formatNumber(score)}</Text>
          </Animated.View>
        }
      />

      <View style={styles.gameArea}>
        <Animated.View
          pointerEvents="box-none"
          style={{ transform: [{ translateX: stageShift }] }}>
          <StoneSurface style={[styles.stage, { height: stageH }]}>
            <Text numberOfLines={1} style={styles.question}>
              {round.question}
            </Text>

            {round.kind === 'specimen' ? (
              <View style={styles.specimenBody}>
                <View style={styles.hintRow}>
                  <HintChip label="GRAIN" value={round.rock.grain} />
                  <HintChip label="COLOUR" value={round.rock.colour} />
                  <HintChip label="MOHS" value={round.rock.hardness} />
                </View>
                <SpecimenStage
                  rock={round.rock}
                  phase={
                    fb.phase === 'correct'
                      ? 'correct'
                      : fb.phase === 'wrong'
                      ? 'wrong'
                      : 'idle'
                  }
                />
              </View>
            ) : null}

            {round.kind === 'cycle' ? (
              <View style={styles.centreBody}>
                <RockCycleDiagram
                  width={CYCLE_W}
                  filled={filled}
                  onSlotPress={onSlot}
                  rejected={rejected}
                />
              </View>
            ) : null}

            {round.kind === 'cliff' ? (
              <View style={styles.cliffBody}>
                {round.bands.map(b => (
                  <CliffBand
                    key={b.key}
                    band={b}
                    slot={order.indexOf(b.key) + 1}
                    shake={shakeKey === b.key}
                    onPress={onBand}
                  />
                ))}
              </View>
            ) : null}
          </StoneSurface>
        </Animated.View>
      </View>

      <View style={[styles.controls, { height: controlsH }]}>
        <View style={styles.statStrip}>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>ROUND</Text>
            <Text style={styles.statValue}>
              {roundNumber}/{totalRounds}
            </Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>UNIT</Text>
            <Text numberOfLines={1} style={styles.statValue}>
              {unitLabel}
            </Text>
          </View>
          {streak > 0 ? (
            <View style={styles.statPill}>
              <Text style={styles.statLabel}>STREAK</Text>
              <Text style={[styles.statValue, styles.statHot]}>{streak}</Text>
            </View>
          ) : null}
        </View>

        {round.kind === 'specimen' ? (
          <View style={styles.answerBlock}>
            {round.options.map((opt, i) => (
              <AnswerOption
                key={`${opt}-${i}`}
                index={i}
                letter={LETTERS[i]}
                label={opt}
                state={optionStates[i]}
                onPress={onAnswer}
              />
            ))}
          </View>
        ) : null}

        {round.kind === 'cycle' ? (
          <View style={styles.chipGrid}>
            {round.chips.map(chip => (
              <View key={chip.id} style={styles.chipSlot}>
                <ProcessChip
                  id={chip.id}
                  label={chip.label}
                  selected={selectedChip === chip.id}
                  placed={Boolean(filled[chip.id])}
                  onPress={onChip}
                />
              </View>
            ))}
          </View>
        ) : null}

        {round.kind === 'cliff' ? (
          <View style={styles.chipGrid}>
            {round.bands.map((b, i) => {
              const placedBand = orderedBands[i];
              return (
                <View key={`slot-${i}`} style={styles.chipSlot}>
                  <View
                    style={[
                      styles.orderSlot,
                      placedBand ? styles.orderSlotFilled : null,
                    ]}>
                    <Text style={styles.orderIndex}>{i + 1}</Text>
                    <Text numberOfLines={1} style={styles.orderLabel}>
                      {placedBand ? placedBand.label : 'TAP A LAYER'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : null}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  railWrap: {
    marginTop: 5,
  },
  pauseIcon: {
    width: 20,
    height: 20,
  },
  scorePill: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(70,61,55,0.85)',
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  scoreText: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    color: theme.colors.text.primary,
  },
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  stage: {
    width: BOARD_W,
    padding: PAD,
    alignItems: 'center',
  },
  question: {
    marginTop: 2,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
  },
  specimenBody: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hintRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  centreBody: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cliffBody: {
    width: '100%',
    alignItems: 'center',
  },
  controls: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: 'rgba(28,25,22,0.94)',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderTopWidth: 1,
    borderTopColor: 'rgba(241,233,224,0.12)',
  },
  statStrip: {
    height: STAT_STRIP_H,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  statPill: {
    flex: 1,
    height: STAT_STRIP_H,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
    borderRadius: STAT_STRIP_H / 2,
    backgroundColor: theme.colors.surface.glass,
    borderWidth: 1,
    borderColor: theme.colors.surface.glassBorder,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.colors.text.muted,
  },
  statValue: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: theme.colors.text.primary,
  },
  statHot: {
    color: theme.colors.primary,
  },
  answerBlock: {
    width: '100%',
    gap: GAP,
  },
  chipGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  chipSlot: {
    width: '48%',
    height: OPTION_H,
  },
  orderSlot: {
    width: '100%',
    height: OPTION_H,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.surface.border,
    backgroundColor: theme.colors.surface.tile,
  },
  orderSlotFilled: {
    borderColor: theme.colors.accent,
    backgroundColor: 'rgba(127,200,169,0.18)',
  },
  orderIndex: {
    fontSize: 15,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    color: theme.colors.primary,
  },
  orderLabel: {
    flex: 1,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: theme.colors.text.primary,
  },
});

export default GameScreen;
