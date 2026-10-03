# Extractable components

## Layout components

### RastroScreen
- Source: `src/design/components/RastroScreen.tsx`
- Category: layout
- Description: Safe-area shell with light/dark background and optional scroll.
- Extractable props: `dark`, `scroll`, `contentContainerStyle`.
- Hardcoded: token-driven padding and backgrounds.

### TabsLayout
- Source: `app/(tabs)/_layout.tsx`
- Category: layout
- Description: Expo Router bottom tabs for Explore and Profile.
- Extractable props: none currently; route labels are product copy.
- Hardcoded: tab names, tint colors from theme.

### RastroSection
- Source: `src/design/components/RastroSection.tsx`
- Category: layout
- Description: Section heading with optional description/action.
- Extractable props: `title`, `description`, `actionLabel`, `onAction`.
- Hardcoded: title hierarchy and spacing.

## Basic components

### RastroButton
- Source: `src/design/components/RastroButton.tsx`
- Category: basic
- Description: Accessible CTA with four variants and loading state.
- Extractable props: `label`, `variant`, `loading`, `disabled`, `onPress`, `accessibilityLabel`.
- Hardcoded: minimum touch size, typography and theme colors.

### RastroText
- Source: `src/design/components/RastroText.tsx`
- Category: basic
- Description: Token-backed type scale.
- Extractable props: `variant`, `color`, `numberOfLines`.
- Hardcoded: typography scale from theme.

### RastroCard
- Source: `src/design/components/RastroCard.tsx`
- Category: basic
- Description: Surface for related content.
- Extractable props: `variant`, `style`.
- Hardcoded: radius, padding and elevation.

### RastroBadge
- Source: `src/design/components/RastroBadge.tsx`
- Category: basic
- Description: Textual status/difficulty indicator.
- Extractable props: `label`, `tone`.
- Hardcoded: tone mapping and pill radius.

### TrailCard
- Source: `src/design/components/TrailCard.tsx`
- Category: basic
- Description: Operational summary of a public trail.
- Extractable props: `trail`, `onPress`.
- Hardcoded: metadata order, status mapping and duration formatting.
