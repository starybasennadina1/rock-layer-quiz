import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import theme from '../constants/theme';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const TRACK_W = 52;
const TRACK_H = 30;
const KNOB = 24;
const ICON = 24;

type Props = {
  label: string;
  Icon: LucideIcon;
  value: boolean;
  onChange: (next: boolean) => void;
};

function ToggleRowBase({ label, Icon, value, onChange }: Props) {
  const x = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(x, {
      toValue: value ? 1 : 0,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      useNativeDriver: true,
    }).start();
  }, [value, x]);

  const toggle = useCallback(() => onChange(!value), [onChange, value]);

  const translateX = x.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRACK_W - KNOB - 6],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      hitSlop={HIT}
      onPress={toggle}
      style={styles.row}>
      <View style={styles.iconBox}>
        <Icon size={ICON} color={theme.colors.primary} strokeWidth={2} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.track,
          value ? styles.trackOn : null,
        ]}>
        <Animated.View
          pointerEvents="none"
          style={[styles.knob, { transform: [{ translateX }] }]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: theme.colors.surface.tile,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  iconBox: {
    width: ICON,
    height: ICON,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  label: {
    flex: 1,
    fontSize: 14,
    lineHeight: ICON,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.text.primary,
  },
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    padding: 3,
    justifyContent: 'center',
    backgroundColor: theme.colors.bg.base,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  trackOn: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accentDeep,
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: theme.colors.text.primary,
  },
});

export const ToggleRow = memo(ToggleRowBase);
export default ToggleRow;
