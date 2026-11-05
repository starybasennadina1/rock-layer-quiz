import React, { memo, useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { OPTION_H } from '../constants/config';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  id: string;
  label: string;
  selected: boolean;
  placed: boolean;
  onPress: (id: string) => void;
};

/** Same 58px metrics as AnswerOption so CONTROLS_H never shifts between rounds. */
function ProcessChipBase({ id, label, selected, placed, onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.97,
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

  const handlePress = useCallback(() => onPress(id), [onPress, id]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={HIT}
      disabled={placed}
      onPress={handlePress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.fill,
          selected ? styles.selected : null,
          placed ? styles.placed : null,
          { transform: [{ scale }] },
        ]}>
        <View pointerEvents="none" style={styles.topHighlight} />
        <Text
          numberOfLines={2}
          style={[
            styles.label,
            selected ? styles.labelSelected : null,
            placed ? styles.labelPlaced : null,
          ]}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    height: OPTION_H,
  },
  fill: {
    width: '100%',
    height: OPTION_H,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.surface.border,
    backgroundColor: theme.colors.surface.tile,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    overflow: 'hidden',
  },
  selected: {
    borderColor: theme.colors.accent,
    backgroundColor: 'rgba(127,200,169,0.20)',
  },
  placed: {
    opacity: 0.38,
    borderColor: theme.colors.surface.border,
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.surface.highlight,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
  labelSelected: {
    color: theme.colors.accent,
  },
  labelPlaced: {
    color: theme.colors.text.muted,
  },
});

export const ProcessChip = memo(ProcessChipBase);
export default ProcessChip;
