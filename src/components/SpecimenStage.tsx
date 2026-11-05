import React, { memo, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SPRITES } from '../assets';
import theme from '../constants/theme';
import { CRACK_MS, DUST_MS, SPECIMEN_SIZE } from '../constants/config';
import type { Rock } from '../game/rocks';

const SPEC = SPECIMEN_SIZE;
const HALF = SPEC / 2;
const PLINTH_W = Math.round(SPEC * 1.12);
const DUST_COUNT = 7;
const GLOW = Math.round(SPEC * 0.58);
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  rock: Rock;
  phase: 'idle' | 'correct' | 'wrong';
};

function SpecimenStageBase({ rock, phase }: Props) {
  const idle = useRef(new Animated.Value(0)).current;
  const crack = useRef(new Animated.Value(0)).current;
  const geode = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const dust = useRef(new Animated.Value(0)).current;

  const dustSeeds = useMemo(
    () =>
      Array.from({ length: DUST_COUNT }).map((_, i) => ({
        key: `dust-${i}`,
        size: 6 + ((i * 3) % 5),
        dx: (i - (DUST_COUNT - 1) / 2) * 13,
        dy: -34 - (i % 3) * 12,
      })),
    [],
  );

  // Idle: the specimen turns slowly on its plinth. transform only -> native.
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(idle, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(idle, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [idle]);

  useEffect(() => {
    if (phase === 'correct') {
      crack.setValue(0);
      geode.setValue(0);
      Animated.parallel([
        Animated.timing(crack, {
          toValue: 1,
          duration: CRACK_MS,
          easing: Easing.out(Easing.back(1.4)),
          useNativeDriver: true,
        }),
        Animated.spring(geode, {
          toValue: 1,
          tension: 60,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    if (phase === 'wrong') {
      dust.setValue(0);
      Animated.timing(dust, {
        toValue: 1,
        duration: DUST_MS,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
      return;
    }

    crack.setValue(0);
    geode.setValue(0);
    dust.setValue(0);
  }, [phase, crack, geode, dust]);

  const nudge = () => {
    spin.setValue(0);
    Animated.timing(spin, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const sprite = SPRITES[rock.sprite];

  const idleRotate = idle.interpolate({
    inputRange: [0, 1],
    outputRange: ['-4deg', '4deg'],
  });
  const idleScaleX = idle.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.96],
  });
  const spinRotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const leftX = crack.interpolate({ inputRange: [0, 1], outputRange: [0, -18] });
  const rightX = crack.interpolate({ inputRange: [0, 1], outputRange: [0, 18] });
  const leftR = crack.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-6deg'],
  });
  const rightR = crack.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '6deg'],
  });
  const geodeScale = geode.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="imagebutton"
        accessibilityLabel="Turn the specimen"
        hitSlop={HIT}
        onPress={nudge}
        style={styles.press}>
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.specimen,
            {
              transform: [
                { rotate: idleRotate },
                { rotate: spinRotate },
                { scaleX: idleScaleX },
              ],
            },
          ]}>
          {/* Two exact halves of the same transparent PNG — clipped, never scaled. */}
          <Animated.View
            style={[
              styles.half,
              styles.halfLeft,
              { transform: [{ translateX: leftX }, { rotate: leftR }] },
            ]}>
            <Image source={sprite} style={styles.imgLeft} resizeMode="contain" />
          </Animated.View>
          <Animated.View
            style={[
              styles.half,
              styles.halfRight,
              { transform: [{ translateX: rightX }, { rotate: rightR }] },
            ]}>
            <Image source={sprite} style={styles.imgRight} resizeMode="contain" />
          </Animated.View>

          {phase === 'correct' ? (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.geodeWrap,
                { opacity: geode, transform: [{ scale: geodeScale }] },
              ]}>
              <Image
                source={SPRITES.sprite4}
                style={styles.geode}
                resizeMode="contain"
              />
            </Animated.View>
          ) : null}
        </Animated.View>
      </Pressable>

      {phase === 'wrong' ? (
        <View pointerEvents="none" style={styles.dustLayer}>
          {dustSeeds.map(seed => (
            <Animated.View
              key={seed.key}
              style={[
                styles.mote,
                {
                  width: seed.size,
                  height: seed.size,
                  borderRadius: seed.size / 2,
                  opacity: dust.interpolate({
                    inputRange: [0, 0.3, 1],
                    outputRange: [0, 0.7, 0],
                  }),
                  transform: [
                    {
                      translateX: dust.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, seed.dx],
                      }),
                    },
                    {
                      translateY: dust.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, seed.dy],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
      ) : null}

      <View style={styles.plinth} />

      {phase === 'wrong' ? (
        <Text style={styles.reveal}>{rock.name.toUpperCase()}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  press: {
    width: SPEC,
    height: SPEC,
    alignItems: 'center',
    justifyContent: 'center',
  },
  specimen: {
    width: SPEC,
    height: SPEC,
  },
  half: {
    position: 'absolute',
    top: 0,
    width: HALF,
    height: SPEC,
    overflow: 'hidden',
  },
  halfLeft: {
    left: 0,
  },
  halfRight: {
    left: HALF,
  },
  imgLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: SPEC,
    height: SPEC,
  },
  imgRight: {
    position: 'absolute',
    left: -HALF,
    top: 0,
    width: SPEC,
    height: SPEC,
  },
  geodeWrap: {
    position: 'absolute',
    left: SPEC / 2 - GLOW / 2,
    top: SPEC / 2 - GLOW / 2,
    width: GLOW,
    height: GLOW,
    borderRadius: GLOW / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(127,200,169,0.16)',
    borderWidth: 2,
    borderColor: theme.colors.accent,
    shadowColor: theme.colors.accent,
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  geode: {
    width: Math.round(GLOW * 0.78),
    height: Math.round(GLOW * 0.78),
  },
  dustLayer: {
    position: 'absolute',
    bottom: 26,
    left: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  mote: {
    backgroundColor: theme.colors.text.muted,
    marginHorizontal: 2,
  },
  plinth: {
    width: PLINTH_W,
    height: 22,
    borderRadius: 11,
    marginTop: 2,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 2,
    borderColor: theme.colors.surface.border,
  },
  reveal: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.accent,
  },
});

export const SpecimenStage = memo(SpecimenStageBase);
export default SpecimenStage;
