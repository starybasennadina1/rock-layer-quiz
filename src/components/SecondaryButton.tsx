import React, { memo, useCallback, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import theme from '../constants/theme';

const ICON = 24; // same icon metric as PrimaryButton (rule #20).
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  label: string;
  onPress: () => void;
  Icon?: LucideIcon;
  height?: number;
  style?: StyleProp<ViewStyle>;
};

function SecondaryButtonBase({
  label,
  onPress,
  Icon,
  height = 50,
  style,
}: Props) {
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

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={HIT}
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      style={[styles.press, { height }, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.fill, { height, transform: [{ scale }] }]}>
        <View pointerEvents="none" style={styles.topHighlight} />
        <View style={styles.row}>
          {Icon ? (
            <View style={styles.iconBox}>
              <Icon size={ICON} color={theme.colors.text.primary} strokeWidth={2} />
            </View>
          ) : null}
          <Text numberOfLines={1} style={styles.label}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    alignSelf: 'stretch',
  },
  fill: {
    width: '100%',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(241,233,224,0.16)',
    backgroundColor: 'rgba(70,61,55,0.80)',
    alignItems: 'center',
    justifyContent: 'center',
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  iconBox: {
    width: ICON,
    height: ICON,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    lineHeight: ICON,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.text.primary,
  },
});

export const SecondaryButton = memo(SecondaryButtonBase);
export default SecondaryButton;
