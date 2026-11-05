import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { CheckCircle2, Gem, Target, Tent } from 'lucide-react-native';
import { SPRITES } from '../assets';
import ScreenShell from '../components/ScreenShell';
import ScreenHeader from '../components/ScreenHeader';
import StatCard from '../components/StatCard';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import theme from '../constants/theme';
import { BOARD_MAX_W, GOOD_DIG_RATIO } from '../constants/config';
import { ROCK_BY_ID } from '../game/rocks';
import type { RunSummary } from '../hooks/useGameRound';
import { formatNumber, percent } from '../utils/format';

type Props = {
  summary: RunSummary;
  onPlayAgain: () => void;
  onMenu: () => void;
};

export function GameOverScreen({ summary, onPlayAgain, onMenu }: Props) {
  const enter = useRef(new Animated.Value(0)).current;
  const ring = useRef(new Animated.Value(0)).current;

  const accuracy = percent(summary.correct, summary.total);
  const good = summary.total > 0 && summary.correct / summary.total >= GOOD_DIG_RATIO;
  const heroColour = good ? theme.colors.accent : theme.colors.primary;

  const newRocks = useMemo(
    () =>
      summary.newRocks
        .map(id => ROCK_BY_ID[id])
        .filter(Boolean)
        .slice(0, 3),
    [summary.newRocks],
  );

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ring, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(ring, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [enter, ring]);

  const enterY = enter.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });
  const ringOpacity = ring.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 0.65],
  });

  return (
    <ScreenShell overlay={theme.overlays.gameover} strata={5}>
      <ScreenHeader
        title="EXPEDITION REPORT"
        rightSlot={
          newRocks.length > 0 ? (
            <View style={styles.pill}>
              <Gem size={16} color={theme.colors.accent} strokeWidth={2.4} />
              <Text style={styles.pillText}>{newRocks.length}</Text>
            </View>
          ) : null
        }
      />

      <Animated.View
        pointerEvents="box-none"
        style={[styles.body, { opacity: enter, transform: [{ translateY: enterY }] }]}>
        {/* Hero title. Nothing decorative crosses the letters (rule #17). */}
        <Text style={[styles.hero, { color: heroColour }]}>
          {good ? 'GOOD DIG!' : 'KEEP DIGGING'}
        </Text>
        <View style={styles.heroUnderline}>
          <Animated.View
            style={[
              styles.heroBar,
              { backgroundColor: heroColour, opacity: ringOpacity },
            ]}
          />
        </View>

        <View style={styles.slab}>
          <View pointerEvents="none" style={styles.slabHighlight} />
          <Text style={[styles.score, { color: theme.colors.primary }]}>
            {formatNumber(summary.score)}
          </Text>
          <Text style={styles.scoreCaption}>POINTS</Text>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statSlot}>
              <StatCard
                Icon={CheckCircle2}
                value={`${summary.correct}/${summary.total}`}
                label="CORRECT"
                valueColor={theme.colors.accent}
              />
            </View>
            <View style={styles.statSlot}>
              <StatCard
                Icon={Target}
                value={`${accuracy}%`}
                label="ACCURACY"
                valueColor={theme.colors.gold}
              />
            </View>
            {newRocks.length > 0 ? (
              <View style={styles.statSlot}>
                <StatCard
                  Icon={Gem}
                  value={`+${newRocks.length}`}
                  label="NEW ROCKS"
                  valueColor={theme.colors.primary}
                />
              </View>
            ) : null}
          </View>
        </View>

        {newRocks.length > 0 ? (
          <View style={styles.newBlock}>
            {newRocks.map(rock => (
              <View key={rock.id} style={styles.newItem}>
                <Image
                  source={SPRITES[rock.sprite]}
                  style={styles.newSprite}
                  resizeMode="contain"
                />
                <Text numberOfLines={1} style={styles.newName}>
                  {rock.name}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.ctaBlock}>
          {/* Hint sits ABOVE the primary CTA (rule #19). */}
          <Text style={styles.hint}>TEN ROUNDS · ONE TAP PER ANSWER</Text>
          <PrimaryButton label="DIG AGAIN" onPress={onPlayAgain} height={60} />
          <View style={styles.ctaGap} />
          <SecondaryButton label="FIELD CAMP" Icon={Tent} onPress={onMenu} height={50} />
        </View>
      </Animated.View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  pill: {
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
  pillText: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    color: theme.colors.text.primary,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  hero: {
    fontFamily: 'serif',
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroUnderline: {
    marginTop: 10,
    marginBottom: 18,
    height: 4,
    width: 120,
    alignItems: 'center',
  },
  heroBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
  },
  slab: {
    width: BOARD_MAX_W,
    padding: 18,
    alignItems: 'center',
    backgroundColor: theme.colors.surface.slab,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.surface.border,
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
    overflow: 'hidden',
  },
  slabHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.surface.highlight,
  },
  score: {
    fontSize: 46,
    lineHeight: 54,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: 1,
  },
  scoreCaption: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.colors.text.muted,
  },
  divider: {
    width: '100%',
    height: 1,
    marginVertical: 14,
    backgroundColor: 'rgba(241,233,224,0.10)',
  },
  statsRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 8,
  },
  statSlot: {
    flex: 1,
  },
  newBlock: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 14,
  },
  newItem: {
    alignItems: 'center',
    width: 72,
  },
  newSprite: {
    width: 48,
    height: 48,
  },
  newName: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
  ctaBlock: {
    width: BOARD_MAX_W,
    marginTop: 18,
  },
  hint: {
    marginBottom: 8,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    textAlign: 'center',
    color: theme.colors.text.muted,
  },
  ctaGap: {
    height: 12,
  },
});

export default GameOverScreen;
