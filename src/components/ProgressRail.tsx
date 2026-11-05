import React, { memo, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  /** 0..1 */
  progress: number;
  width: number;
  height?: number;
  colour?: string;
  /** Animate from 0 to `progress` once, over this duration (loader bar). */
  durationMs?: number;
};

/**
 * Width-animated rail. Width CANNOT run on the native driver
 * (animation-gpu-properties) — useNativeDriver is explicitly false here.
 */
function ProgressRailBase({
  progress,
  width,
  height = 6,
  colour = theme.colors.primary,
  durationMs = 320,
}: Props) {
  const target = Math.max(0, Math.min(1, progress)) * width;
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.timing(anim, {
      toValue: target,
      duration: durationMs,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false, // width — never native driver
    });
    a.start();
    return () => a.stop();
  }, [anim, target, durationMs]);

  return (
    <View style={[styles.track, { width, height, borderRadius: height / 2 }]}>
      <Animated.View
        style={{
          width: anim,
          height: '100%',
          borderRadius: height / 2,
          backgroundColor: colour,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: '#463D37',
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
    overflow: 'hidden',
  },
});

export const ProgressRail = memo(ProgressRailBase);
export default ProgressRail;
