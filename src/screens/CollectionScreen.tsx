import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenShell from '../components/ScreenShell';
import ScreenHeader from '../components/ScreenHeader';
import CollectionCard from '../components/CollectionCard';
import theme from '../constants/theme';
import {
  COLLECTION_COLS,
  COLLECTION_GAP,
  CONTENT_W,
  TOTAL_ROCKS,
} from '../constants/config';
import { ROCKS, ROCK_BY_ID, TYPE_LABEL, type Rock, type RockType } from '../game/rocks';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Filter = 'all' | RockType;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'ALL' },
  { id: 'igneous', label: 'IGNEOUS' },
  { id: 'sedimentary', label: 'SEDIMENT' },
  { id: 'metamorphic', label: 'METAMORPH' },
  { id: 'mineral', label: 'MINERALS' },
];

type Props = {
  learnedSet: Set<string>;
  onBack: () => void;
};

export function CollectionScreen({ learnedSet, onBack }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<string | null>(null);

  const data = useMemo(
    () => (filter === 'all' ? ROCKS : ROCKS.filter(r => r.type === filter)),
    [filter],
  );

  const detail: Rock | null = selected ? ROCK_BY_ID[selected] ?? null : null;
  const detailUnlocked = Boolean(detail && learnedSet.has(detail.id));

  const onCardPress = useCallback((id: string) => {
    setSelected(prev => (prev === id ? null : id));
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Rock }) => (
      <CollectionCard
        rock={item}
        learned={learnedSet.has(item.id)}
        selected={selected === item.id}
        onPress={onCardPress}
      />
    ),
    [learnedSet, selected, onCardPress],
  );

  const keyExtractor = useCallback((item: Rock) => item.id, []);

  return (
    <ScreenShell overlay={theme.overlays.collection}>
      <ScreenHeader
        title="COLLECTION"
        onBack={onBack}
        rightSlot={
          <View style={styles.pill}>
            <Text style={styles.pillText}>
              {learnedSet.size}/{TOTAL_ROCKS}
            </Text>
          </View>
        }
      />

      <View style={styles.filterRow}>
        {FILTERS.map(f => {
          const active = filter === f.id;
          return (
            <Pressable
              key={f.id}
              accessibilityRole="button"
              accessibilityLabel={f.label}
              hitSlop={HIT}
              onPress={() => setFilter(f.id)}
              style={[styles.chip, active ? styles.chipActive : null]}>
              <Text
                numberOfLines={1}
                style={[styles.chipText, active ? styles.chipTextActive : null]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={COLLECTION_COLS}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={12}
        windowSize={7}
        removeClippedSubviews
      />

      {detail ? (
        <View style={styles.detail}>
          <View pointerEvents="none" style={styles.detailHighlight} />
          <Text numberOfLines={1} style={styles.detailName}>
            {detailUnlocked ? detail.name : 'UNDISCOVERED'}
          </Text>
          <Text style={styles.detailMeta}>
            {detailUnlocked
              ? `${TYPE_LABEL[detail.type]} · GRAIN ${detail.grain} · MOHS ${detail.hardness}`
              : 'FIND THIS ONE ON AN EXPEDITION'}
          </Text>
          <Text numberOfLines={2} style={styles.detailBlurb}>
            {detailUnlocked ? detail.blurb : 'Answer it correctly to unlock its field notes.'}
          </Text>
        </View>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(70,61,55,0.85)',
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    color: theme.colors.text.primary,
  },
  filterRow: {
    height: 40,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  chip: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(70,61,55,0.6)',
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  chipActive: {
    backgroundColor: 'rgba(201,123,74,0.18)',
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: theme.colors.text.muted,
  },
  chipTextActive: {
    color: theme.colors.primary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  column: {
    width: CONTENT_W,
    gap: COLLECTION_GAP,
    marginBottom: COLLECTION_GAP,
  },
  detail: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 18,
    backgroundColor: theme.colors.surface.slab,
    borderWidth: 2,
    borderColor: theme.colors.surface.border,
    overflow: 'hidden',
  },
  detailHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.surface.highlight,
  },
  detailName: {
    fontFamily: 'serif',
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.primary,
  },
  detailMeta: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.primary,
  },
  detailBlurb: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
});

export default CollectionScreen;
