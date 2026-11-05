import React, { memo, useCallback } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SPRITES } from '../assets';
import theme from '../constants/theme';
import { COLLECTION_CARD_W } from '../constants/config';
import { UNITS, type Rock } from '../game/rocks';

const HIT = { top: 4, bottom: 4, left: 4, right: 4 };
const CARD_H = Math.round(COLLECTION_CARD_W / 0.82);

const TYPE_COLOUR: Record<string, string> = {
  igneous: UNITS[0].colour,
  sedimentary: UNITS[1].colour,
  metamorphic: UNITS[2].colour,
  mineral: theme.colors.text.secondary,
};

type Props = {
  rock: Rock;
  learned: boolean;
  selected: boolean;
  onPress: (id: string) => void;
};

function CollectionCardBase({ rock, learned, selected, onPress }: Props) {
  const handlePress = useCallback(() => onPress(rock.id), [onPress, rock.id]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={learned ? rock.name : 'Undiscovered specimen'}
      hitSlop={HIT}
      onPress={handlePress}
      style={[
        styles.card,
        selected ? { borderColor: TYPE_COLOUR[rock.type] } : null,
      ]}>
      <View style={[styles.cap, { backgroundColor: TYPE_COLOUR[rock.type] }]} />
      <Image
        source={SPRITES[rock.sprite]}
        style={[styles.sprite, learned ? null : styles.spriteLocked]}
        resizeMode="contain"
      />
      <Text numberOfLines={1} style={[styles.name, learned ? null : styles.locked]}>
        {learned ? rock.name : '???'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: COLLECTION_CARD_W,
    height: CARD_H,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
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
    height: 4,
  },
  sprite: {
    width: 54,
    height: 54,
  },
  spriteLocked: {
    opacity: 0.18,
  },
  name: {
    marginTop: 6,
    paddingHorizontal: 4,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
  locked: {
    color: theme.colors.text.muted,
  },
});

export const CollectionCard = memo(CollectionCardBase);
export default CollectionCard;
