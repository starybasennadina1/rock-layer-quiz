import React, { memo, useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { OPTION_H } from '../constants/config';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export type OptionState = 'idle' | 'correct' | 'wrong' | 'disabled';

type Props = {
  letter: string;
  label: string;
  state: OptionState;
  onPress: (index: number) => void;
  index: number;
};

const FILL: Record<OptionState, string> = {
  idle: theme.colors.surface.tile,
  disabled: theme.colors.surface.tile,
  correct: 'rgba(127,200,169,0.18)',
  wrong: 'rgba(194,90,66,0.18)',
};

const EDGE: Record<OptionState, string> = {
  idle: theme.colors.surface.border,
  disabled: theme.colors.surface.border,
  correct: theme.colors.accent,
  wrong: theme.colors.danger,
};

const TEXT: Record<OptionState, string> = {
  idle: theme.colors.text.primary,
  disabled: theme.colors.text.secondary,
  correct: theme.colors.accent,
  wrong: theme.colors.danger,
};

function AnswerOptionBase({ letter, label, state, onPress, index }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const locked = state !== 'idle';

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

  const handlePress = useCallback(() => onPress(index), [onPress, index]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${letter}. ${label}`}
      hitSlop={HIT}
      disabled={locked}
      onPress={handlePress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.fill,
          {
            backgroundColor: FILL[state],
            borderColor: EDGE[state],
            transform: [{ scale }],
          },
        ]}>
        <View pointerEvents="none" style={styles.topHighlight} />
        <View
          style={[
            styles.badge,
            state === 'correct'
              ? styles.badgeCorrect
              : state === 'wrong'
              ? styles.badgeWrong
              : null,
          ]}>
          <Text style={[styles.badgeText, { color: TEXT[state] }]}>{letter}</Text>
        </View>
        <Text numberOfLines={1} style={[styles.label, { color: TEXT[state] }]}>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.surface.highlight,
  },
  badge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(201,123,74,0.22)',
    marginRight: 12,
  },
  badgeCorrect: {
    backgroundColor: 'rgba(127,200,169,0.26)',
  },
  badgeWrong: {
    backgroundColor: 'rgba(194,90,66,0.26)',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  label: {
    flex: 1,
    fontFamily: 'serif',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export const AnswerOption = memo(AnswerOptionBase);
export default AnswerOption;
