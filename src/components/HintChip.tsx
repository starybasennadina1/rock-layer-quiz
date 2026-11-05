import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  label: string;
  value: string;
};

/** Glass hint pill — GRAIN - COARSE. The separator is the safe bullet glyph. */
function HintChipBase({ label, value }: Props) {
  return (
    <View style={styles.chip}>
      <Text numberOfLines={1} style={styles.text}>
        <Text style={styles.key}>{label}</Text>
        <Text style={styles.sep}> · </Text>
        <Text style={styles.val}>{value}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface.glass,
    borderWidth: 1,
    borderColor: theme.colors.surface.glassBorder,
  },
  text: {
    fontSize: 10,
    letterSpacing: 0.8,
  },
  key: {
    color: theme.colors.text.muted,
    fontWeight: '600',
  },
  sep: {
    color: theme.colors.text.muted,
  },
  val: {
    color: theme.colors.text.primary,
    fontWeight: '800',
  },
});

export const HintChip = memo(HintChipBase);
export default HintChip;
