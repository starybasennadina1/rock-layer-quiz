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
import LinearGradient from 'react-native-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import theme from '../constants/theme';

const ICON = 24; // rule #20 — fixed square, lineHeight of the label matches it.
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  label: string;
  onPress: () => void;
  Icon?: LucideIcon;
  height?: number;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

/**
 * Sandstone gradient CTA. Pressable is the PARENT and the Animated.View is the
 * CHILD (rule #8) — the reverse eats onPress on Android release builds.
 */
function PrimaryButtonBase({
  label,
  onPress,
  Icon,
  height = 60,
  style,
  disabled = false,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.96,
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
      disabled={disabled}
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      style={[styles.press, { height }, disabled ? styles.disabled : null, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.anim, { height, transform: [{ scale }] }]}>
        <LinearGradient
          colors={theme.gradients.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.fill, { height }]}>
          <View pointerEvents="none" style={styles.topHighlight} />
          <View style={styles.row}>
            {Icon ? (
              <View style={styles.iconBox}>
                <Icon size={ICON} color={theme.colors.text.onSand} strokeWidth={2.4} />
              </View>
            ) : null}
            <Text numberOfLines={1} style={styles.label}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.55,
  },
  anim: {
    width: '100%',
    borderRadius: theme.radius.lg,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  fill: {
    width: '100%',
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.primaryEdge,
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
    backgroundColor: 'rgba(255,255,255,0.18)',
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
    fontFamily: 'serif',
    fontSize: 18,
    lineHeight: ICON,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: theme.colors.text.onSand,
  },
});

export const PrimaryButton = memo(PrimaryButtonBase);
export default PrimaryButton;
