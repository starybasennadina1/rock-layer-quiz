import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import theme from '../constants/theme';

const ICON_WRAP = 38;
const ICON = 20;

type Props = {
  Icon: LucideIcon;
  value: string;
  label: string;
  valueColor: string;
};

/**
 * The ONE stat pill, reused on Menu / GameOver / Collection with identical
 * metrics (rule #21). Differentiation is colour + value + label only — never a
 * different sprite per pill, and never `flex:1` on the card (rule #19a).
 */
function StatCardBase({ Icon, value, label, valueColor }: Props) {
  return (
    <View style={[styles.card, { borderColor: valueColor + '55' }]}>
      <View style={[styles.iconWrap, { backgroundColor: valueColor + '22' }]}>
        <Icon size={ICON} color={valueColor} strokeWidth={2.5} />
      </View>
      <Text numberOfLines={1} style={[styles.value, { color: valueColor }]}>
        {value}
      </Text>
      <Text numberOfLines={1} style={styles.label}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    // width:'100%' (NOT flex:1) — the parent slot already carries flex:1.
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface.tile,
    borderRadius: theme.radius.md,
    borderWidth: 1,
  },
  iconWrap: {
    width: ICON_WRAP,
    height: ICON_WRAP,
    borderRadius: ICON_WRAP / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.5,
  },
  label: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: theme.colors.text.muted,
  },
});

export const StatCard = memo(StatCardBase);
export default StatCard;
