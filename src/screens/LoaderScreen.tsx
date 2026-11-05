import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import theme from '../constants/theme';
import { LOADER_BAR_MS, LOADER_DURATION_MS } from '../constants/config';

const BAR_W = 190;
const BAR_H = 6;
const PLINTH = 196;

type Props = {
  onDone: () => void;
};

/**
 * "Core sample" splash. Rule #14 — the overlay here is near-opaque dark basalt,
 * nothing like the Menu: no chips, no bento tiles, no CTA.
 */
export function LoaderScreen({ onDone }: Props) {
  const plinth = useRef(new Animated.Value(0)).current;
  const logoY = useRef(new Animated.Value(14)).current;
  const title = useRef(new Animated.Value(0)).current;
  const bar = useRef(new Animated.Value(0)).current;
  const exit = useRef(new Animated.Value(0)).current;

  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(plinth, {
        toValue: 1,
        tension: 48,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(logoY, {
        toValue: 0,
        duration: 420,
        delay: 160,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(title, {
        toValue: 1,
        duration: 380,
        delay: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Width animation — never the native driver (animation-gpu-properties).
    const barAnim = Animated.timing(bar, {
      toValue: BAR_W,
      duration: LOADER_BAR_MS,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    });
    barAnim.start();

    const exitAt = setTimeout(() => {
      Animated.timing(exit, {
        toValue: 1,
        duration: 260,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => done.current());
    }, LOADER_DURATION_MS - 260);

    return () => {
      barAnim.stop();
      clearTimeout(exitAt);
    };
  }, [plinth, logoY, title, bar, exit]);

  const exitOpacity = exit.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const exitY = exit.interpolate({ inputRange: [0, 1], outputRange: [0, -24] });
  const titleY = title.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });

  return (
    <ImageBackground
      source={assets.bgGame}
      style={styles.bg}
      resizeMode="cover">
      <LinearGradient
        colors={theme.gradients.loaderBg}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={[StyleSheet.absoluteFill, styles.darken]}
      />

      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {Array.from({ length: 7 }).map((_, i) => (
          <View key={`l-${i}`} style={[styles.strata, { top: 70 + i * 54 }]} />
        ))}
        <View style={styles.vein} />
      </View>

      <Animated.View
        style={[
          styles.centre,
          { opacity: exitOpacity, transform: [{ translateY: exitY }] },
        ]}>
        <Animated.View
          style={[
            styles.plinth,
            { opacity: plinth, transform: [{ scale: plinth }] },
          ]}>
          <View pointerEvents="none" style={styles.plinthHighlight} />
          <Animated.Image
            source={assets.logo}
            resizeMode="contain"
            style={[styles.logo, { transform: [{ translateY: logoY }] }]}
          />
        </Animated.View>

        <Animated.View
          style={[styles.titleBlock, { opacity: title, transform: [{ translateY: titleY }] }]}>
          <Text style={styles.titleLine}>ROCK LAYER</Text>
          <Text style={styles.titleLine}>QUIZ</Text>
          <Text style={styles.subtitle}>READ THE ROCK RECORD</Text>
        </Animated.View>

        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFillWrap, { width: bar }]}>
            <LinearGradient
              colors={theme.gradients.progress}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.barFill}
            />
          </Animated.View>
        </View>
        <Text style={styles.loading}>LOADING SAMPLES...</Text>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: theme.colors.bg.deep,
  },
  darken: {
    opacity: 0.93,
  },
  strata: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(201,123,74,0.10)',
  },
  vein: {
    position: 'absolute',
    top: 268,
    left: -14,
    right: -14,
    height: 2,
    backgroundColor: 'rgba(127,200,169,0.08)',
    transform: [{ rotate: '-2deg' }],
  },
  centre: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  plinth: {
    width: PLINTH,
    height: PLINTH,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#36302B',
    borderWidth: 2,
    borderColor: theme.colors.surface.border,
    shadowColor: '#000000',
    shadowOpacity: 0.55,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 14,
    overflow: 'hidden',
  },
  plinthHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(241,233,224,0.14)',
  },
  logo: {
    width: 148,
    height: 148,
  },
  titleBlock: {
    alignItems: 'center',
    marginTop: 28,
  },
  titleLine: {
    fontFamily: 'serif',
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '700',
    letterSpacing: 3,
    color: theme.colors.text.primary,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 4,
    color: theme.colors.text.secondary,
  },
  barTrack: {
    width: BAR_W,
    height: BAR_H,
    borderRadius: BAR_H / 2,
    marginTop: 40,
    backgroundColor: '#463D37',
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
    overflow: 'hidden',
  },
  barFillWrap: {
    height: '100%',
  },
  barFill: {
    flex: 1,
    borderRadius: BAR_H / 2,
  },
  loading: {
    marginTop: 14,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 3,
    color: theme.colors.text.muted,
  },
});

export default LoaderScreen;
