# Theme context

## Compact token summary

Source: `src/design/tokens.ts`.

| Family | Values |
| --- | --- |
| Colors | background `#F6F2E9`, surface `#FFFCF5`, ink `#17231F`, muted `#66736B`, forest `#175C45`, forestStrong `#0F3F31`, clay `#C96A2B`, water `#197A8A`, success `#2F7D4A`, warning `#A86516`, danger `#B64A3B`, status surfaces in `tokens.ts` |
| Spacing | xs `4`, sm `8`, md `12`, lg `16`, xl `24`, xxl `32` |
| Radii | sm `8`, md `12`, lg `18`, pill `999` |
| Typography | caption 12/17/700, body 15/22/400, bodyLarge 17/25/500, title 24/30/800, display 32/38/800 |
| Touch | interactive controls min 44 × 44 |

## Raw token source

```ts
export const rastroColors = {
  background: '#F6F2E9', surface: '#FFFCF5', ink: '#17231F', muted: '#66736B',
  forest: '#175C45', forestStrong: '#0F3F31', clay: '#C96A2B', water: '#197A8A',
  success: '#2F7D4A', warning: '#A86516', danger: '#B64A3B', border: '#D8D2C5',
  white: '#FFFFFF', darkBackground: '#10211B', darkSurface: '#1B3329',
  darkInk: '#F6F2E9', darkMuted: '#B7C4BC',
} as const;

export const rastroSpacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const rastroRadii = { sm: 8, md: 12, lg: 18, pill: 999 } as const;
export const rastroTypography = {
  caption: { fontSize: 12, lineHeight: 17, fontWeight: '700' as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  bodyLarge: { fontSize: 17, lineHeight: 25, fontWeight: '500' as const },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '800' as const },
  display: { fontSize: 32, lineHeight: 38, fontWeight: '800' as const },
} as const;
```
