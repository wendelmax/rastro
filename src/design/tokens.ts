export const rastroColors = {
  background: '#F6F2E9',
  surface: '#FFFCF5',
  ink: '#17231F',
  muted: '#66736B',
  forest: '#175C45',
  forestStrong: '#0F3F31',
  clay: '#C96A2B',
  water: '#197A8A',
  success: '#2F7D4A',
  successSurface: '#DCEEDB',
  warning: '#A86516',
  warningSurface: '#F8E8C8',
  danger: '#B64A3B',
  dangerSurface: '#F4D8D2',
  waterSurface: '#D8EFF0',
  claySurface: '#F5DFCF',
  border: '#D8D2C5',
  white: '#FFFFFF',
  darkBackground: '#10211B',
  darkSurface: '#1B3329',
  darkInk: '#F6F2E9',
  darkMuted: '#B7C4BC',
  backdrop: 'rgba(23, 35, 31, 0.5)',
} as const;

export const rastroSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const rastroRadii = {
  sm: 8,
  md: 12,
  lg: 18,
  pill: 999,
} as const;

export const rastroTypography = {
  caption: { fontSize: 12, lineHeight: 17, fontWeight: '700' as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  bodyLarge: { fontSize: 17, lineHeight: 25, fontWeight: '500' as const },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '800' as const },
  display: { fontSize: 32, lineHeight: 38, fontWeight: '800' as const },
} as const;

export const rastroElevation = {
  card: {
    elevation: 2,
    shadowColor: '#17231F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
} as const;
