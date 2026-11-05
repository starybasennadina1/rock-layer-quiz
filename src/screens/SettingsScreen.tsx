import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RotateCcw, Type, Vibrate, Volume2 } from 'lucide-react-native';
import ScreenShell from '../components/ScreenShell';
import ScreenHeader from '../components/ScreenHeader';
import ToggleRow from '../components/ToggleRow';
import theme from '../constants/theme';
import { APP_VERSION, TEXT_SCALES, type TextSize } from '../constants/config';
import type { Settings } from '../hooks/useProgress';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const SIZES = Object.keys(TEXT_SCALES) as TextSize[];

type Props = {
  settings: Settings;
  onChange: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  onReset: () => void;
  onBack: () => void;
};

export function SettingsScreen({ settings, onChange, onReset, onBack }: Props) {
  const [confirming, setConfirming] = useState(false);

  const onSound = useCallback((v: boolean) => onChange('sound', v), [onChange]);
  const onHaptics = useCallback((v: boolean) => onChange('haptics', v), [onChange]);

  const onResetPress = useCallback(() => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setConfirming(false);
    onReset();
  }, [confirming, onReset]);

  return (
    <ScreenShell overlay={theme.overlays.settings}>
      <ScreenHeader title="CAMP SETTINGS" onBack={onBack} />

      <View style={styles.body}>
        <ToggleRow
          label="SOUND"
          Icon={Volume2}
          value={settings.sound}
          onChange={onSound}
        />
        <ToggleRow
          label="HAPTICS"
          Icon={Vibrate}
          value={settings.haptics}
          onChange={onHaptics}
        />

        <View style={styles.row}>
          <View style={styles.iconBox}>
            <Type size={24} color={theme.colors.primary} strokeWidth={2} />
          </View>
          <Text style={styles.rowLabel}>TEXT SIZE</Text>
          <View style={styles.sizeGroup}>
            {SIZES.map(size => {
              const active = settings.textSize === size;
              return (
                <Pressable
                  key={size}
                  accessibilityRole="button"
                  accessibilityLabel={`Text size ${size}`}
                  hitSlop={HIT}
                  onPress={() => onChange('textSize', size)}
                  style={[styles.sizeChip, active ? styles.sizeChipActive : null]}>
                  <Text
                    style={[styles.sizeText, active ? styles.sizeTextActive : null]}>
                    {size}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Reset progress"
          hitSlop={HIT}
          onPress={onResetPress}
          style={[styles.row, styles.danger]}>
          <View style={styles.iconBox}>
            <RotateCcw size={24} color={theme.colors.danger} strokeWidth={2} />
          </View>
          <Text numberOfLines={1} style={[styles.rowLabel, styles.dangerLabel]}>
            {confirming ? 'TAP AGAIN TO CONFIRM' : 'RESET PROGRESS'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          VERSION {APP_VERSION} · OFFLINE · NO ADS
        </Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  row: {
    width: '100%',
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: theme.colors.surface.tile,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  iconBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rowLabel: {
    flex: 1,
    fontSize: 14,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.text.primary,
  },
  sizeGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  sizeChip: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bg.base,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  sizeChipActive: {
    backgroundColor: 'rgba(201,123,74,0.22)',
    borderColor: theme.colors.primary,
  },
  sizeText: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.text.muted,
  },
  sizeTextActive: {
    color: theme.colors.primary,
  },
  danger: {
    borderColor: theme.colors.danger,
  },
  dangerLabel: {
    color: theme.colors.danger,
  },
  footer: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    color: theme.colors.text.muted,
  },
});

export default SettingsScreen;
