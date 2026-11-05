import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Polygon, Text as SvgText } from 'react-native-svg';
import theme from '../constants/theme';
import type { ProcessId } from '../game/rounds';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const SLOT_W = 92;
const SLOT_H = 30;
const NODE_R = 32;

export type SlotLayout = {
  id: ProcessId;
  cx: number;
  cy: number;
  caption: string;
};

type Props = {
  width: number;
  /** processId placed into each slot, keyed by slot id. */
  filled: Partial<Record<ProcessId, string>>;
  onSlotPress: (slotId: ProcessId) => void;
  /** Slot that just bounced back after a wrong placement. */
  rejected: ProcessId | null;
};

export function cycleLayout(width: number): {
  height: number;
  slots: SlotLayout[];
  nodes: { label: string; cx: number; cy: number }[];
} {
  const height = Math.round(width * 0.82);
  return {
    height,
    nodes: [
      { label: 'ROCK', cx: width * 0.5, cy: height * 0.17 },
      { label: 'MAGMA', cx: width * 0.18, cy: height * 0.78 },
      { label: 'SEDIMENT', cx: width * 0.82, cy: height * 0.78 },
    ],
    slots: [
      { id: 'cooling', cx: width * 0.2, cy: height * 0.46, caption: 'MAGMA TO ROCK' },
      { id: 'erosion', cx: width * 0.8, cy: height * 0.46, caption: 'ROCK TO SEDIMENT' },
      { id: 'heat', cx: width * 0.5, cy: height * 0.5, caption: 'SEDIMENT TO ROCK' },
      { id: 'melting', cx: width * 0.5, cy: height * 0.93, caption: 'ROCK TO MAGMA' },
    ],
  };
}

/** Every arrow is SVG geometry — never a text arrow glyph (rule #15). */
function Arrow({
  x1,
  y1,
  x2,
  y2,
  colour,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  colour: string;
}) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = 9;
  const p1x = x2 - head * Math.cos(angle - Math.PI / 7);
  const p1y = y2 - head * Math.sin(angle - Math.PI / 7);
  const p2x = x2 - head * Math.cos(angle + Math.PI / 7);
  const p2y = y2 - head * Math.sin(angle + Math.PI / 7);
  return (
    <>
      <Path
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
        stroke={colour}
        strokeWidth={2}
        fill="none"
      />
      <Polygon points={`${x2},${y2} ${p1x},${p1y} ${p2x},${p2y}`} fill={colour} />
    </>
  );
}

function RockCycleDiagramBase({ width, filled, onSlotPress, rejected }: Props) {
  const { height, nodes, slots } = cycleLayout(width);

  const press = useCallback(
    (id: ProcessId) => () => onSlotPress(id),
    [onSlotPress],
  );

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Arrow
          x1={nodes[1].cx + 6}
          y1={nodes[1].cy - NODE_R - 2}
          x2={nodes[0].cx - NODE_R - 4}
          y2={nodes[0].cy + NODE_R - 4}
          colour={theme.colors.primary}
        />
        <Arrow
          x1={nodes[0].cx + NODE_R + 4}
          y1={nodes[0].cy + NODE_R - 4}
          x2={nodes[2].cx - 6}
          y2={nodes[2].cy - NODE_R - 2}
          colour={theme.colors.gold}
        />
        <Arrow
          x1={nodes[2].cx - NODE_R - 6}
          y1={nodes[2].cy - 10}
          x2={nodes[0].cx + 10}
          y2={nodes[0].cy + NODE_R + 6}
          colour={theme.colors.accent}
        />
        <Arrow
          x1={nodes[0].cx - 10}
          y1={nodes[0].cy + NODE_R + 6}
          x2={nodes[1].cx + NODE_R - 2}
          y2={nodes[1].cy + 8}
          colour={theme.colors.danger}
        />

        {nodes.map(n => (
          <React.Fragment key={n.label}>
            <Circle
              cx={n.cx}
              cy={n.cy}
              r={NODE_R}
              fill={theme.colors.surface.tile}
              stroke={theme.colors.primary}
              strokeWidth={2}
            />
            <SvgText
              x={n.cx}
              y={n.cy + 4}
              fill={theme.colors.text.primary}
              fontSize={n.label.length > 5 ? 9 : 11}
              fontWeight="bold"
              textAnchor="middle">
              {n.label}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>

      {slots.map(slot => {
        const value = filled[slot.id];
        const isFilled = Boolean(value);
        return (
          <Pressable
            key={slot.id}
            accessibilityRole="button"
            accessibilityLabel={slot.caption}
            hitSlop={HIT}
            onPress={press(slot.id)}
            style={[
              styles.slot,
              {
                left: slot.cx - SLOT_W / 2,
                top: slot.cy - SLOT_H / 2,
              },
              isFilled ? styles.slotFilled : null,
              rejected === slot.id ? styles.slotRejected : null,
            ]}>
            <Text
              numberOfLines={1}
              style={[styles.slotText, isFilled ? styles.slotTextFilled : null]}>
              {isFilled ? value : slot.caption}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    position: 'absolute',
    width: SLOT_W,
    height: SLOT_H,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    backgroundColor: 'rgba(42,37,34,0.88)',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: theme.colors.accent,
  },
  slotFilled: {
    backgroundColor: theme.colors.accent,
    borderStyle: 'solid',
    borderColor: theme.colors.accentDeep,
  },
  slotRejected: {
    borderColor: theme.colors.danger,
    backgroundColor: 'rgba(194,90,66,0.3)',
  },
  slotText: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.6,
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
  slotTextFilled: {
    fontSize: 9,
    color: theme.colors.text.onSand,
  },
});

export const RockCycleDiagram = memo(RockCycleDiagramBase);
export default RockCycleDiagram;
