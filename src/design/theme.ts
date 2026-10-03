import { rastroColors, rastroElevation, rastroRadii, rastroSpacing, rastroTypography } from './tokens';

export const rastroTheme = {
  colors: rastroColors,
  spacing: rastroSpacing,
  radii: rastroRadii,
  typography: rastroTypography,
  elevation: rastroElevation,
} as const;

export type RastroTheme = typeof rastroTheme;
