import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  label: string;
  done: number;
  total: number;
  colour: string;
};

function UnitProgressTileBase({ label, done, total, colour }: Props) {
  const ratio = total > 0 ? Math.max(0, Math.min(1, done / total)) : 0;
  return (
    <View style={styles.slot}>
      <View style={styles.card}>
        <View style={[styles.cap, { backgroundColor: colour }]} />
        <Text numberOfLines={1} style={styles.label}>
          {label}
        </Text>
        <View style={styles.rail}>
          <View
            style={[
              styles.railFill,
              { backgroundColor: colour, width: `${Math.round(ratio * 100)}%` },
            ]}
          />
        </View>
        <Text style={[styles.count, { color: colour }]}>
          {done}/{total}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    flex: 1,
  },
  card: {
    // width:'100%' — NOT flex:1 inside a flex:1 slot (rule #19a).
    width: '100%',
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    backgroundColor: theme.colors.surface.tile,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
    overflow: 'hidden',
  },
  cap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.primary,
  },
  rail: {
    width: '100%',
    height: 5,
    borderRadius: 3,
    marginTop: 8,
    backgroundColor: 'rgba(18,15,13,0.55)',
    overflow: 'hidden',
  },
  railFill: {
    height: '100%',
    borderRadius: 3,
  },
  count: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});

export const UnitProgressTile = memo(UnitProgressTileBase);
export default UnitProgressTile;
