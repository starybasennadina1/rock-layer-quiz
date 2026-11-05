import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Flame, Gem, Layers, Settings2, Trophy } from 'lucide-react-native';
import { assets, SPRITES } from '../assets';
import ScreenShell from '../components/ScreenShell';
import ScreenHeader from '../components/ScreenHeader';
import UnitProgressTile from '../components/UnitProgressTile';
import StatCard from '../components/StatCard';
import theme from '../constants/theme';
import { TOTAL_ROCKS } from '../constants/config';
import type { UnitProgress } from '../hooks/useProgress';
import { formatNumber } from '../utils/format';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const PLAY_H = 218;
const SLAB_H = 58;

type Props = {
  learnedCount: number;
  bestScore: number;
  streak: number;
  unitProgress: UnitProgress[];
  onPlay: () => void;
  onCollection: () => void;
  onSettings: () => void;
};

export function MenuScreen({
  learnedCount,
  bestScore,
  streak,
  unitProgress,
  onPlay,
  onCollection,
  onSettings,
}: Props) {
  const enter = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const playScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [enter, pulse]);

  const pressIn = useCallback(() => {
    Animated.spring(playScale, {
      toValue: 0.96,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [playScale]);

  const pressOut = useCallback(() => {
    Animated.spring(playScale, {
      toValue: 1,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [playScale]);

  const enterY = enter.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });
  const edgeOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  // Second side tile always carries a real value — never an empty pill (rule #13).
  const secondTile = useMemo(() => {
    if (bestScore > 0) {
      return {
        Icon: Trophy,
        value: formatNumber(bestScore),
        label: 'BEST RUN',
        colour: theme.colors.gold,
      };
    }
    return {
      Icon: Layers,
      value: String(unitProgress.length),
      label: 'UNITS',
      colour: theme.colors.gold,
    };
  }, [bestScore, unitProgress.length]);

  return (
    <ScreenShell overlay={theme.overlays.menu}>
      <ScreenHeader
        title="FIELD CAMP"
        leftSlot={
          <View style={styles.homeChip}>
            <Image source={assets.iconHome} style={styles.homeIcon} resizeMode="contain" />
          </View>
        }
        rightSlot={
          <View style={styles.streakPill}>
            <Flame size={18} color={theme.colors.primary} strokeWidth={2.4} />
            <Text style={styles.streakText}>{streak}</Text>
          </View>
        }
      />

      <Animated.View
        pointerEvents="box-none"
        style={[styles.grid, { opacity: enter, transform: [{ translateY: enterY }] }]}>
        <View style={styles.rowA}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Start expedition"
            hitSlop={HIT}
            onPress={onPlay}
            onPressIn={pressIn}
            onPressOut={pressOut}
            style={styles.playPress}>
            <Animated.View
              pointerEvents="box-none"
              style={[styles.playAnim, { transform: [{ scale: playScale }] }]}>
              <LinearGradient
                colors={theme.gradients.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.playFill}>
                <Animated.View
                  pointerEvents="none"
                  style={[styles.playEdge, { opacity: edgeOpacity }]}
                />
                <Image
                  source={SPRITES.sprite1}
                  style={styles.playSprite}
                  resizeMode="contain"
                />
                <Text style={styles.playLabel}>START EXPEDITION</Text>
                <Text numberOfLines={1} style={styles.playSub}>
                  3 UNITS READY
                </Text>
              </LinearGradient>
            </Animated.View>
          </Pressable>

          <View style={styles.sideColumn}>
            <View style={styles.sideSlot}>
              <StatCard
                Icon={Gem}
                value={`${learnedCount}/${TOTAL_ROCKS}`}
                label="SPECIMENS"
                valueColor={theme.colors.accent}
              />
            </View>
            <View style={styles.sideSlot}>
              <StatCard
                Icon={secondTile.Icon}
                value={secondTile.value}
                label={secondTile.label}
                valueColor={secondTile.colour}
              />
            </View>
          </View>
        </View>

        <View style={styles.rowB}>
          {unitProgress.map(u => (
            <UnitProgressTile
              key={u.id}
              label={u.label}
              done={u.done}
              total={u.total}
              colour={u.colour}
            />
          ))}
        </View>

        <View style={styles.rowC}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Rock collection"
            hitSlop={HIT}
            onPress={onCollection}
            style={styles.slab}>
            <View style={styles.slabRow}>
              <View style={styles.slabIcon}>
                <Layers size={24} color={theme.colors.text.primary} strokeWidth={2} />
              </View>
              <Text numberOfLines={1} style={styles.slabLabel}>
                COLLECTION
              </Text>
            </View>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Camp settings"
            hitSlop={HIT}
            onPress={onSettings}
            style={styles.slab}>
            <View style={styles.slabRow}>
              <View style={styles.slabIcon}>
                <Settings2 size={24} color={theme.colors.text.primary} strokeWidth={2} />
              </View>
              <Text numberOfLines={1} style={styles.slabLabel}>
                SETTINGS
              </Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Image
            source={SPRITES.sprite4}
            style={styles.footerSprite}
            resizeMode="contain"
          />
          <Text style={styles.footerText}>
            3 UNITS · {TOTAL_ROCKS} ROCKS · OFFLINE
          </Text>
        </View>
      </Animated.View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  homeChip: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(70,61,55,0.85)',
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  homeIcon: {
    width: 24,
    height: 24,
  },
  streakPill: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(70,61,55,0.85)',
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  streakText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    color: theme.colors.text.primary,
  },
  grid: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  rowA: {
    flexDirection: 'row',
    gap: 12,
    height: PLAY_H,
  },
  playPress: {
    flex: 62,
    height: PLAY_H,
  },
  playAnim: {
    width: '100%',
    height: PLAY_H,
    borderRadius: 20,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  playFill: {
    width: '100%',
    height: PLAY_H,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.primaryEdge,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
  playEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  playSprite: {
    width: 76,
    height: 76,
  },
  playLabel: {
    marginTop: 10,
    fontFamily: 'serif',
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 1.5,
    textAlign: 'center',
    color: theme.colors.text.onSand,
  },
  playSub: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: 'rgba(42,37,34,0.75)',
  },
  sideColumn: {
    flex: 38,
    gap: 12,
  },
  sideSlot: {
    // width:'100%' on the card, flex:1 only on the slot (rule #19a).
    flex: 1,
    justifyContent: 'center',
  },
  rowB: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  rowC: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    height: SLAB_H,
  },
  slab: {
    flex: 1,
    height: SLAB_H,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(70,61,55,0.72)',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.surface.glassBorder,
  },
  slabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  slabIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slabLabel: {
    fontSize: 12,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.primary,
  },
  footer: {
    height: 28,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  footerSprite: {
    width: 22,
    height: 22,
  },
  footerText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.colors.text.muted,
  },
});

export default MenuScreen;
