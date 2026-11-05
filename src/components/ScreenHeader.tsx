import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import theme from '../constants/theme';
import { HEADER_H, HEADER_PAD_TOP } from '../constants/config';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  title: string;
  /** Rendered under the title, e.g. the round progress rail. */
  subtitle?: React.ReactNode;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  onBack?: () => void;
  /** Optional glyph for the back chip; defaults to the chevron. */
  backGlyph?: React.ReactNode;
};

/**
 * The ONE header used by Menu / Game / GameOver / Collection / Settings.
 * Screens differ only by the slots they pass in — never by inline markup.
 */
function ScreenHeaderBase({
  title,
  subtitle,
  leftSlot,
  rightSlot,
  onBack,
  backGlyph,
}: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={HIT}
            onPress={onBack}
            style={styles.backChip}>
            {backGlyph ?? (
              <ChevronLeft
                size={20}
                color={theme.colors.text.primary}
                strokeWidth={2.4}
              />
            )}
          </Pressable>
        ) : (
          leftSlot
        )}
      </View>

      <View style={styles.centre}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {subtitle}
      </View>

      <View style={[styles.side, styles.sideRight]}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_H + HEADER_PAD_TOP,
    paddingTop: HEADER_PAD_TOP, // rule #6
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.34)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(241,233,224,0.10)',
  },
  side: {
    width: 56,
    height: 44,
    justifyContent: 'center',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  centre: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.primary,
  },
  backChip: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(70,61,55,0.85)',
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
});

export const ScreenHeader = memo(ScreenHeaderBase);
export default ScreenHeader;
