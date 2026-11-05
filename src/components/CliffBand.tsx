import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Polyline } from 'react-native-svg';
import { SPRITES } from '../assets';
import theme from '../constants/theme';
import { CLIFF_BAND_H, CLIFF_GAP, CONTENT_W } from '../constants/config';
import type { CliffBandData } from '../game/cliff';

const HIT = { top: 6, bottom: 6, left: 8, right: 8 };
const FOSSIL = 34;

type Props = {
  band: CliffBandData;
  /** 1-based slot once the learner has placed it, 0 while unplaced. */
  slot: number;
  shake: boolean;
  onPress: (key: string) => void;
};

function CliffBandBase({ band, slot, shake, onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const lift = useRef(new Animated.Value(0)).current;
  const wobble = useRef(new Animated.Value(0)).current;
  const placed = slot > 0;

  useEffect(() => {
    Animated.spring(lift, {
      toValue: placed ? 1 : 0,
      tension: theme.animation.band.tension,
      friction: theme.animation.band.friction,
      useNativeDriver: true,
    }).start();
  }, [placed, lift]);

  useEffect(() => {
    if (!shake) {
      return;
    }
    wobble.setValue(0);
    Animated.sequence([
      Animated.timing(wobble, { toValue: 1, duration: 55, useNativeDriver: true }),
      Animated.timing(wobble, { toValue: -1, duration: 55, useNativeDriver: true }),
      Animated.timing(wobble, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, [shake, wobble]);

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.98,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const handlePress = useCallback(() => onPress(band.key), [onPress, band.key]);

  const shiftX = wobble.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-6, 0, 6],
  });
  const shiftY = lift.interpolate({ inputRange: [0, 1], outputRange: [0, -4] });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${band.label} layer`}
      hitSlop={HIT}
      disabled={placed}
      onPress={handlePress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.animWrap,
          {
            opacity: placed ? 0.55 : 1,
            transform: [{ translateX: shiftX }, { translateY: shiftY }, { scale }],
          },
        ]}>
        <LinearGradient
          colors={band.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.band, placed ? styles.bandPlaced : null]}>
          <View pointerEvents="none" style={styles.bedding} />

          {band.hasFault ? (
            <View pointerEvents="none" style={styles.faultLayer}>
              <Svg width={CONTENT_W} height={CLIFF_BAND_H}>
                <Polyline
                  points={`${CONTENT_W * 0.52},0 ${CONTENT_W * 0.58},${CLIFF_BAND_H * 0.34} ${
                    CONTENT_W * 0.5
                  },${CLIFF_BAND_H * 0.66} ${CONTENT_W * 0.56},${CLIFF_BAND_H}`}
                  fill="none"
                  stroke="rgba(18,15,13,0.75)"
                  strokeWidth={3}
                />
              </Svg>
            </View>
          ) : null}

          <View style={styles.labelBlock}>
            <Text numberOfLines={1} style={styles.label}>
              {band.label}
            </Text>
            <Text numberOfLines={1} style={styles.note}>
              {band.note}
            </Text>
          </View>

          {band.hasFossil ? (
            <Image
              source={SPRITES.sprite5}
              style={styles.fossil}
              resizeMode="contain"
            />
          ) : null}

          <View style={[styles.badge, placed ? styles.badgePlaced : null]}>
            <Text style={[styles.badgeText, placed ? styles.badgeTextPlaced : null]}>
              {placed ? String(slot) : '?'}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: CONTENT_W,
    height: CLIFF_BAND_H,
    marginBottom: CLIFF_GAP,
  },
  animWrap: {
    width: CONTENT_W,
    height: CLIFF_BAND_H,
  },
  band: {
    width: CONTENT_W,
    height: CLIFF_BAND_H,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  bandPlaced: {
    borderColor: theme.colors.accent,
  },
  bedding: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(241,233,224,0.16)',
  },
  faultLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  labelBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'serif',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.primary,
  },
  note: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1,
    color: 'rgba(241,233,224,0.65)',
  },
  fossil: {
    width: FOSSIL,
    height: FOSSIL,
    marginRight: 10,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(42,37,34,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(241,233,224,0.2)',
  },
  badgePlaced: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accentDeep,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  badgeTextPlaced: {
    color: theme.colors.text.onSand,
  },
});

export const CliffBand = memo(CliffBandBase);
export default CliffBand;
