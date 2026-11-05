// RockLayerQuiz — WARM_EARTHY preset, canyon override (dark basalt + sandstone + malachite).
// Rule #11b: the `name` field is the preset value verbatim; only colour values are overridden.

export const theme = {
  name: 'warm-earthy',

  colors: {
    bg: {
      deep: '#120F0D',
      base: '#2A2522',
      mid: '#1C1916',
    },
    surface: {
      slab: '#36302B',
      tile: '#463D37',
      border: '#56493F',
      highlight: 'rgba(241,233,224,0.12)',
      glass: 'rgba(241,233,224,0.07)',
      glassBorder: 'rgba(241,233,224,0.14)',
    },
    primary: '#C97B4A',
    primaryLight: '#D4884F',
    primaryDark: '#A75F35',
    primaryEdge: '#E0A070',
    accent: '#7FC8A9',
    accentDeep: '#4E9D80',
    gold: '#D9B36C',
    danger: '#C25A42',
    text: {
      primary: '#F1E9E0',
      secondary: '#B9AA9C',
      muted: '#8A7C70',
      onSand: '#2A2522',
    },
  },

  overlays: {
    loader: ['rgba(18,15,13,0.90)', 'rgba(18,15,13,0.97)'] as [string, string],
    menu: ['rgba(42,37,34,0.72)', 'rgba(28,25,22,0.92)'] as [string, string],
    game: ['rgba(42,37,34,0.80)', 'rgba(28,25,22,0.95)'] as [string, string],
    gameover: ['rgba(28,25,22,0.88)', 'rgba(18,15,13,0.97)'] as [string, string],
    collection: ['rgba(42,37,34,0.84)', 'rgba(28,25,22,0.96)'] as [string, string],
    settings: ['rgba(42,37,34,0.84)', 'rgba(28,25,22,0.96)'] as [string, string],
  },

  gradients: {
    loaderBg: ['#120F0D', '#1C1916', '#2A2522'] as [string, string, string],
    button: ['#D4884F', '#C97B4A', '#A75F35'] as [string, string, string],
    progress: ['#C97B4A', '#E0A070'] as [string, string],
    accent: ['#7FC8A9', '#4E9D80'] as [string, string],
  },

  typography: {
    hero: {
      fontFamily: 'serif' as const,
      fontSize: 38,
      fontWeight: '700' as const,
      letterSpacing: 3,
    },
    title: {
      fontFamily: 'serif' as const,
      fontSize: 24,
      fontWeight: '700' as const,
      letterSpacing: 1.5,
    },
    section: { fontSize: 16, fontWeight: '700' as const, letterSpacing: 1 },
    body: { fontSize: 15, fontWeight: '500' as const, lineHeight: 21 },
    caption: {
      fontSize: 11,
      fontWeight: '600' as const,
      letterSpacing: 2,
      textTransform: 'uppercase' as const,
    },
    number: {
      fontSize: 22,
      fontWeight: '800' as const,
      fontVariant: ['tabular-nums'] as const,
    },
  },

  radius: { sm: 8, md: 14, lg: 18, xl: 22, full: 999 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },

  shadows: {
    slab: {
      shadowColor: '#000000',
      shadowOpacity: 0.5,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 10,
    },
    tile: {
      shadowColor: '#000000',
      shadowOpacity: 0.45,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 7,
    },
    sand: {
      shadowColor: '#C97B4A',
      shadowOpacity: 0.45,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 12,
    },
  },

  animation: {
    press: { tension: 90, friction: 8 },
    entrance: { tension: 48, friction: 7 },
    band: { tension: 70, friction: 9 },
  },
} as const;

export type Theme = typeof theme;
export default theme;
