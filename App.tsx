import React, { useCallback, useRef, useState } from 'react';
import { Animated, Easing, StatusBar, StyleSheet, View } from 'react-native';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import CollectionScreen from './src/screens/CollectionScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import theme from './src/constants/theme';
import { FADE_MS, ROUNDS_PER_RUN } from './src/constants/config';
import { useProgress } from './src/hooks/useProgress';
import type { RunSummary } from './src/hooks/useGameRound';

type Screen =
  | 'loader'
  | 'menu'
  | 'game'
  | 'gameover'
  | 'collection'
  | 'settings';

const EMPTY_SUMMARY: RunSummary = {
  score: 0,
  correct: 0,
  total: ROUNDS_PER_RUN,
  newRocks: [],
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('loader');
  const [summary, setSummary] = useState<RunSummary>(EMPTY_SUMMARY);
  // Remounts GameScreen so a new run starts from a clean round state.
  const [runKey, setRunKey] = useState(0);

  const progress = useProgress();
  const fade = useRef(new Animated.Value(1)).current;
  const drop = useRef(new Animated.Value(0)).current;

  /** Layer-drop transition: outgoing falls and fades, incoming rises and fades in. */
  const go = useCallback(
    (nextScreen: Screen, before?: () => void) => {
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 0,
          duration: FADE_MS,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(drop, {
          toValue: 1,
          duration: FADE_MS,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (before) {
          before();
        }
        setScreen(nextScreen);
        drop.setValue(-1);
        Animated.parallel([
          Animated.timing(fade, {
            toValue: 1,
            duration: FADE_MS,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(drop, {
            toValue: 0,
            duration: FADE_MS,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
      });
    },
    [fade, drop],
  );

  const onLoaderDone = useCallback(() => setScreen('menu'), []);

  const startRun = useCallback(() => {
    go('game', () => setRunKey(k => k + 1));
  }, [go]);

  const onGameOver = useCallback(
    (result: RunSummary) => {
      progress.commitRun(result.score, result.newRocks);
      go('gameover', () => setSummary(result));
    },
    [go, progress],
  );

  const toMenu = useCallback(() => go('menu'), [go]);
  const toCollection = useCallback(() => go('collection'), [go]);
  const toSettings = useCallback(() => go('settings'), [go]);

  const translateY = drop.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-20, 0, 24],
  });

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {screen === 'loader' ? (
        <LoaderScreen onDone={onLoaderDone} />
      ) : (
        <Animated.View
          pointerEvents="box-none"
          style={[styles.stage, { opacity: fade, transform: [{ translateY }] }]}>
          {screen === 'menu' ? (
            <MenuScreen
              learnedCount={progress.learnedCount}
              bestScore={progress.bestScore}
              streak={progress.runs}
              unitProgress={progress.unitProgress}
              onPlay={startRun}
              onCollection={toCollection}
              onSettings={toSettings}
            />
          ) : null}

          {screen === 'game' ? (
            <GameScreen
              key={runKey}
              haptics={progress.settings.haptics}
              onExit={toMenu}
              onGameOver={onGameOver}
            />
          ) : null}

          {screen === 'gameover' ? (
            <GameOverScreen
              summary={summary}
              onPlayAgain={startRun}
              onMenu={toMenu}
            />
          ) : null}

          {screen === 'collection' ? (
            <CollectionScreen learnedSet={progress.learnedSet} onBack={toMenu} />
          ) : null}

          {screen === 'settings' ? (
            <SettingsScreen
              settings={progress.settings}
              onChange={progress.setSetting}
              onReset={progress.resetProgress}
              onBack={toMenu}
            />
          ) : null}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.deep,
  },
  stage: {
    flex: 1,
  },
});
