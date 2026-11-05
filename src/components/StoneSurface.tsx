import React, { memo } from 'react';
import { StyleSheet, View, type ViewStyle, type StyleProp } from 'react-native';
import theme from '../constants/theme';

export type StoneVariant = 'slab' | 'tile' | 'sheet';

type Props = {
  variant?: StoneVariant;
  style?: StyleProp<ViewStyle>;
  /** Render the 2px inner top highlight that sells the chiselled edge. */
  highlight?: boolean;
  children?: React.ReactNode;
};

/**
 * The universal skeuomorphic card: stone fill + chiselled border +
 * inner top highlight + outer shadow. Every card in the app is built from it.
 */
function StoneSurfaceBase({
  variant = 'slab',
  style,
  highlight = true,
  children,
}: Props) {
  return (
    <View style={[styles.base, styles[variant], style]}>
      {highlight ? <View pointerEvents="none" style={styles.topHighlight} /> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  slab: {
    backgroundColor: theme.colors.surface.slab,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.surface.border,
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  tile: {
    backgroundColor: theme.colors.surface.tile,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
    shadowColor: '#000000',
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 7,
  },
  sheet: {
    backgroundColor: 'rgba(70,61,55,0.72)',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.surface.glassBorder,
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.surface.highlight,
  },
});

export const StoneSurface = memo(StoneSurfaceBase);
export default StoneSurface;
