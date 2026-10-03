import {
  rastroColors,
  rastroElevation,
  rastroRadii,
  rastroSpacing,
  rastroTypography,
} from './tokens';
import { rastroTheme } from './theme';

describe('Rastro Terra design tokens', () => {
  it('exposes the approved field palette', () => {
    expect(rastroColors).toMatchObject({
      background: '#F6F2E9',
      surface: '#FFFCF5',
      ink: '#17231F',
      muted: '#66736B',
      forest: '#175C45',
      forestStrong: '#0F3F31',
      clay: '#C96A2B',
      water: '#197A8A',
      success: '#2F7D4A',
      warning: '#A86516',
      danger: '#B64A3B',
    });
  });

  it('exposes a compact spacing, radius and typography scale', () => {
    expect(Object.values(rastroSpacing)).toEqual([4, 8, 12, 16, 24, 32]);
    expect(Object.values(rastroRadii)).toEqual([8, 12, 18, 999]);
    expect(Object.keys(rastroTypography)).toEqual(['caption', 'body', 'bodyLarge', 'title', 'display']);
    expect(rastroElevation.card).toEqual(expect.objectContaining({ elevation: 2 }));
  });

  it('groups all token families in the public theme export', () => {
    expect(rastroTheme).toEqual({
      colors: rastroColors,
      spacing: rastroSpacing,
      radii: rastroRadii,
      typography: rastroTypography,
      elevation: rastroElevation,
    });
  });
});
