import React, { memo } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import theme from '../constants/theme';

type Props = {
  overlay: readonly [string, string];
  /** Strata decor lines behind the content (skeuomorphic canyon wall). */
  strata?: number;
  strataColour?: string;
  children: React.ReactNode;
};

/**
 * Layer 1 bg_game image -> layer 2 overlay gradient -> layer 3 strata decor
 * -> layer 4 content. Guarantees "never a flat background" on every screen.
 */
function ScreenShellBase({
  overlay,
  strata = 0,
  strataColour = 'rgba(201,123,74,0.10)',
  children,
}: Props) {
  return (
    <ImageBackground
      source={assets.bgGame}
      style={styles.bg}
      imageStyle={styles.bgImage}
      resizeMode="cover">
      <LinearGradient
        colors={[overlay[0], overlay[1]]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {strata > 0 ? (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {Array.from({ length: strata }).map((_, i) => (
            <View
              key={`strata-${i}`}
              style={[
                styles.strataLine,
                { top: 86 + i * 54, backgroundColor: strataColour },
              ]}
            />
          ))}
          <View
            style={[
              styles.veinLine,
              { top: 86 + Math.floor(strata / 2) * 54 + 22 },
            ]}
          />
        </View>
      ) : null}
      <View style={styles.content}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: theme.colors.bg.base,
  },
  bgImage: {
    opacity: 1,
  },
  content: {
    flex: 1,
  },
  strataLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
  },
  veinLine: {
    position: 'absolute',
    left: -12,
    right: -12,
    height: 2,
    backgroundColor: 'rgba(127,200,169,0.08)',
    transform: [{ rotate: '-2deg' }],
  },
});

export const ScreenShell = memo(ScreenShellBase);
export default ScreenShell;
